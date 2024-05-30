// src/app/page.js (or wherever your Home component is located)
import Link from "next/link";
import NavBar from "./components/Navbar";
import { Libre_Franklin } from "next/font/google";


export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <NavBar/>
      <section className="flex justify-center items-center h-screen">
        <Link href='/quiz' className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300">
          Start Quiz
        </Link>
      </section>
    </main>
  );
}
