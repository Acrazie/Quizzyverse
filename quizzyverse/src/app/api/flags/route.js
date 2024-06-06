import fetch from 'node-fetch';

let countriesData = [];

// je récupère tous les pays de l'api
const fetchAllCountries = async () => {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();
        countriesData = data;
    } catch (error) {
        console.error('Error while trying to fetch all countries data', error);
        throw error;
    }
};

// je récupère un pays aléatoire dans le tableau de tous les pays
const getRandomCountry = () => {
    return countriesData[Math.floor(Math.random() * countriesData.length)];
};

// j'initialise la fonction qui récupère tous les pays
await fetchAllCountries();


// j'exporte la méthode GET qui contient la fonction initialisée avec la récupération du pays au hasard
export const GET = async () => {
    try {
        if (countriesData.length === 0) {
            await fetchAllCountries(); // en cas de bug sur le fetch
        }
        const randomCountry = getRandomCountry();
        return new Response(JSON.stringify(randomCountry), { status: 200, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch countries data' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};


// const code_country = ["AF","AX","AL","DZ","AS","AD","AO","AI","AQ","AG","AR","AM","AW","AU","AT","AZ","BS","BH","BD","BB","BY","BE","BZ","BJ","BM","BT","BO","BQ","BA","BW","BV","BR","IO","BN","BG","BF","BI","CV","KH","CM","CA","KY","CF","TD","CL","CN","CX","CC","CO","KM","CG","CD","CK","CR","HR","CU","CW","CY","CZ","DK","DJ","DM","DO","EC","EG","SV","GQ","ER","EE","SZ","ET","FK","FO","FJ","FI","FR","GF","PF","TF","GA","GM","GE","DE","GH","GI","GR","GL","GD","GP","GU","GT","GG","GN","GW","GY","HT","HM","VA","HN","HK","HU","IS","IN","ID","IR","IQ","IE","IM","IL","IT","JM","JP","JE","JO","KZ","KE","KI","KP","KR","KW","KG","LA","LV","LB","LS","LR","LY","LI","LT","LU","MO","MG","MW","MY","MV","ML","MT","MH","MQ","MR","MU","YT","MX","FM","MD","MC","MN","ME","MS","MA","MZ","MM","NA","NR","NP","NL","NC","NZ","NI","NE","NG","NU","NF","MK","MP","NO","OM","PK","PW","PS","PA","PG","PY","PE","PH","PN","PL","PT","PR","QA","RE","RO","RU","RW","BL","SH","KN","LC","MF","PM","VC","WS","SM","ST","SA","SN","RS","SC","SL","SG","SX","SK","SI","SB","SO","ZA","GS","SS","ES","LK","SD","SR","SJ","SE","CH","SY","TW","TJ","TZ","TH","TL","TG","TK","TO","TT","TN","TR","TM","TC","TV","UG","UA","AE","GB","UM","US","UY","UZ","VU","VE","VN","VG","VI","WF","EH","YE","ZM","ZW"];

// const getRandomCountryCode = () => {
//     return code_country[Math.floor(Math.random() * code_country.length)];
// };

// export const GET = async () => {
//     const code_country = getRandomCountryCode(); // ajout de la randomisation ici après
//     try {
//         const dataCountry = await fetchAllCountries(code_country);
//         return new Response(JSON.stringify(dataCountry), { status: 200, headers: { 'Content-Type': 'application/json' } });
//     } catch (error) {
//         return new Response(JSON.stringify({ error: 'Failed to fetch country data' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
//     }
// };