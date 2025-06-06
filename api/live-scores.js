import axios from 'axios'; // Asegúrate de que tienes axios instalado (npm install axios)

export default async (req, res) => {
    // Tu clave API se configurará en Vercel, no aquí directamente
    const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;

    // IDs de las ligas y competiciones que quieres mostrar
    // Esta es la lista que me proporcionaste, separada por comas.
    const desiredLeagueIds = '39,61,135,78,94,140,71,1,299,128,13,9,866,2,3,4,5,848,531,15,1168,143,556,34,32';

    // *** INICIO DE LAS CABECERAS CORS Y CACHÉ ***
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept');

    // Manejar las solicitudes preflight (OPTIONS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Cabeceras de caché para Vercel Edge. Cachea la respuesta por 60 segundos.
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    // *** FIN DE LAS CABECERAS CORS Y CACHÉ ***

    if (!API_FOOTBALL_KEY) {
        return res.status(500).json({ error: "API_FOOTBALL_KEY no está configurada en Vercel." });
    }

    try {
        const options = {
            method: 'GET',
            // La URL base es solo el host, los parámetros van en 'params'
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: {
                live: 'all', // Pide todos los partidos que estén en vivo
                league: desiredLeagueIds // Filtra por las ligas específicas
            },
            headers: {
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com', // Asegúrate de que este host sea el correcto para tu suscripción
                'X-RapidAPI-Key': API_FOOTBALL_KEY
            }
        };

        const response = await axios.request(options);

        if (response.status !== 200) {
            throw new Error(`Error de la API-Football: ${response.status} - ${response.statusText}`);
        }

        res.status(200).json(response.data); // Envía los datos obtenidos
    } catch (error) {
        console.error("Error en la función serverless:", error.message);
        res.status(500).json({ error: "No se pudieron obtener los resultados en vivo.", details: error.message });
    }
};