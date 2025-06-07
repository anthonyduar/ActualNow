// api/live-scores.js
import fetch from 'node-fetch';

export default async function (req, res) {
    // Establecer encabezados CORS para permitir peticiones desde cualquier origen
    // En un entorno de producción, es mejor especificar dominios exactos en lugar de '*'
    res.setHeader('Access-Control-Allow-Origin', '*'); // Esto permite a cualquier origen (incluido tu local) acceder
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept, X-Auth-Token');

    // Manejar solicitudes OPTIONS (preflight requests para CORS)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const API_KEY = process.env.API_FOOTBALL_DATA_KEY; // Tu clave de Football-Data.org
    const BASE_URL = 'https://api.football-data.org/v4/matches';

    // Ligas que quieres obtener (ej. Premier League, Bundesliga, La Liga, Serie A, Champions League)
    const competitions = 'PL,BL1,PD,SA,CL'; 

    // Obtener la fecha de hoy en formato YYYY-MM-DD
    const today = new Date();
    const dateFrom = today.toISOString().split('T')[0]; // Hoy
    const dateTo = today.toISOString().split('T')[0];   // Hoy

    try {
        const url = `<span class="math-inline">\{BASE\_URL\}?dateFrom\=</span>{dateFrom}&dateTo=<span class="math-inline">\{dateTo\}&competitions\=</span>{competitions}`;
        // console.log(`Fetching from: ${url}`); // Para depuración

        const response = await fetch(url, {
            headers: {
                'X-Auth-Token': API_KEY,
            },
        });

        if (!response.ok) {
            // Si la respuesta no es OK (ej. 403, 429), intenta leer el cuerpo como texto para ver el error
            const errorText = await response.text();
            console.error(`Error en la API de Football-Data.org: ${response.status} ${response.statusText} - ${errorText}`);
            return res.status(response.status).json({ error: `Error fetching data from external API: ${response.statusText}`, details: errorText });
        }

        const data = await response.json();
        // console.log('Data fetched successfully:', data); // Para depuración

        res.status(200).json(data); // Envía los datos JSON de la API externa
    } catch (error) {
        console.error('Error en la función serverless:', error);
        res.status(500).json({ error: 'Error en la función serverless', details: error.message });
    }
}