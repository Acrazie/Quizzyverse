"use client";

import 'tailwindcss/tailwind.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { checkUserDailyCount } from "../api/users/renewedat/checkRenewedAt";
import { addXp } from "../api/users/xp/addXp";
import NavBar from '../components/Navbar';

// Thème du quiz
const quizzFlag = "Trouve le pays ou la région qui correspond au drapeau !";

const Page = () => {
    // j'utilise useState pour définir des états de base pour les varaibles venant à être modifiées
    const { data: session, status } = useSession();
    const [fetchedImage, setFetchedImage] = useState('');
    const [fetchedAnswer, setFetchedAnswer] = useState('');
    const [fetchedTip, setFetchedTip] = useState("");
    const [questionNumber, setQuestionNumber] = useState(1); // Par défaut à 1
    const [showTip, setShowTip] = useState(false);
    const [userAnswer, setUserAnswer] = useState(''); // stockage de la réponse du joueur pour comparer
    const [showResultPopup, setShowResultPopup] = useState(false); // affichage de la pop-up à false par défaut
    const [resultMessage, setResultMessage] = useState(''); // stockage du message de résultat
    const [xpWon, setXpWon] = useState(0); // xp gagnée à incrémenter et à ajouter au user dans la DB ultérieurement
    const [totalXp, setTotalXp] = useState(0); // total XP gagné par le joueur à la fin du quizz
    const [email, setEmail] = useState('');

    const router = useRouter();

    if (status === "unauthenticated") {
        window.location.href = "/login";
        return null;
      }

    // J'utilise "useEffect" pour récupérer les données de l'api lors du montage du composant
    useEffect(() => {
        if (session) {
            setEmail(session.user.email);
          };

        const fetchQuizzData = async () => {
            try {
                const response = await fetch('/api/flags');
                const data = await response.json();

                // Adapter les champs de data selon l'API !!!!
                setFetchedImage(data.flags.png);
                setFetchedAnswer(data.translations.fra.common);
                 setFetchedTip(data.capital ? `Capitale(s) de ce pays : ${data.capital}` : 'Pas d\'indice disponible pour ce pays !');
            } catch (error) {
                console.error(error);
            }
        };

        fetchQuizzData();

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = 'Si vous rafraîchissez la page, le quizz ne sera pas comptabilisé.';
        };

        const handlePopState = () => {
            confirm('Si vous quittez la page, le quizz ne sera pas comptabilisé et vous serez redirigé vers la page d\'accueil.');
            router.push('/');
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };

    }, [questionNumber, router, session]);

    const validateAnswer = async() => { // bouton de validation de la réponse et affichage du pop-up
        if (!await checkUserDailyCount(email)) // placer le user actuel avec "UseSession"
        {return};

        let message = '';
        if (userAnswer != '' & userAnswer.trim().toLowerCase() === fetchedAnswer.trim().toLowerCase()) { // pour la sensibilité à la casse
            const newXp = xpWon + 10; // incrémentation de l'XP si la réponse est correcte
            setXpWon(newXp);
            setTotalXp(prevTotalXp => prevTotalXp + 10);

            if (questionNumber >= 5) {
                message = 'Bonne réponse ! Vous avez gagné ' + newXp + ' xp ! Revenez demain ou passez premium pour jouer en illimité !';
                let score = newXp;
                if (score > 0){
                    addXp(email, score)
              }  
            } else {
                message = 'Bonne réponse ! + 10 xp !';
            }

        } else {

            message = `Mauvaise réponse, c'était ${fetchedAnswer} !`;
            if (questionNumber >= 5) {
                message += ' Vous avez gagné ' + xpWon + ' xp ! Revenez demain ou passez premium pour jouer en illimité !';
                let score = xpWon;
                if (score > 0){
                    addXp(email, score)
              }
            }
        }
        setResultMessage(message);
        setShowResultPopup(true);
    };

    const handleNextQuestion = () => { // bouton de validation du pop-up et affichage de la nouvelle question
        if (questionNumber >= 5) {
            router.push('/');
            // ajouter la limitation de réalisation du quizz
        } else {
            setShowResultPopup(false);
            setUserAnswer(''); // reset de la réponse du joueur
            setShowTip(false); // on cache de nouveau l'indice
            setQuestionNumber(prevQuestionNumber => prevQuestionNumber + 1);
        }
    };

    const handleShowTip = () => {
        setShowTip(true); // Met à jour l'état pour afficher l'indice
    };

    return (
        <div className="flex items-center justify-center mt-10 flex-col">
            <NavBar/>
            <h6 className="mt-5">{quizzFlag}</h6>
            <div className="container mx-auto p-4">
                <div className="max-w-sm mx-auto bg-white shadow-md rounded-md overflow-hidden">
                    <img src={fetchedImage} alt="Quiz Image" className="w-full h-auto max-w-full max-h-full object-contain" />
                    <div className="text-xl text-center text-black m-3">Question {questionNumber}</div>
                </div>
            </div>
            {showTip && <div className="mt-2">{fetchedTip}</div>}
            <input required
                placeholder='Votre réponse'
                name="answer"
                className="text-xl text-center text-black mt-5 w-80 h-10 border border-black rounded-md"
                type="text"
                value={userAnswer}
                onChange={e => setUserAnswer(e.target.value)}
            />
            <div className="mt-4">
            <button
  type="button"
  className="mr-20 mb-20 bg-blue-600 text-white font-bold py-2 px-4 rounded mt-3"
  onClick={handleShowTip}
>
  Indice
</button>
<button
  type="button"
  className="ml-20 mb-20 bg-blue-600 text-white font-bold py-2 px-4 rounded mt-3"
  onClick={validateAnswer}
>
  Valider
</button>
            </div>
            {showResultPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <div className="bg-white p-6 rounded shadow-md text-center">
                        <p className="text-black">{resultMessage}</p>
                        <button 
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded" 
                            onClick={handleNextQuestion}
                        >
                            {questionNumber < 5 ? 'Prochaine question' : 'Retourner à l\'accueil'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Page;