// api/live-scores.js

// No necesitamos importar axios si usamos fetch nativo
// const axios = require('axios'); // <<-- ELIMINAR O COMENTAR ESTA LÍNEA
// Prueba de despliegue con clave actualizada

export default async (req, res) => {
    const API_FOOTBALL_KEY = process.env.API_FOOTBALL_KEY;

    const desiredLeagueIds = '39,61,135,78,94,140,71,1,299,128,13,9,866,2,3,4,5,848,531,15,1168,143,556,34,32';

    // *** INICIO DE LAS CABECERAS CORS Y CACHÉ ***
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Accept');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    // *** FIN DE LAS CABECERAS CORS Y CACHÉ ***

    if (!API_FOOTBALL_KEY) {
        return res.status(500).json({ error: "API_FOOTBALL_KEY no está configurada en Vercel." });
    }

    try {
        // Usando fetch nativo de Node.js
        const API_URL = `https://api-football-v1.p.rapidapi.com/v3/fixtures?live=all&league=${desiredLeagueIds}`;

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                'X-RapidAPI-Key': API_FOOTBALL_KEY
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error de la API-Football: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        console.error("Error en la función serverless:", error.message);
        res.status(500).json({ error: "No se pudieron obtener los resultados en vivo.", details: error.message });
    }
};