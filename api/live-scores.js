import fetch from 'node-fetch'; // Asegúrate de que esto es 'node-fetch' si tu Node.js es antiguo, o quítalo si usas Node.js 18+

export default async (req, res) => {
    // TU CLAVE API SE CONFIGURARÁ EN VERCEL, NO AQUÍ DIRECTAMENTE
    const API_KEY = process.env.API_FOOTBALL_KEY; 

    // Esta es la URL del endpoint que encontramos en la documentación para partidos en vivo
    const API_URL = "https://v3.football.api-sports.io/fixtures?live=all"; 

    if (!API_KEY) {
        return res.status(500).json({ error: "API_FOOTBALL_KEY no está configurada en Vercel." });
    }

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'x-rapidapi-host': 'v3.football.api-sports.io', // Este host podría variar, verifica la doc si hay problemas
                'x-rapidapi-key': API_KEY
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error de la API-Football: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        res.status(200).json(data); // Envía los datos obtenidos al navegador de quien lo solicite
    } catch (error) {
        console.error("Error en la función serverless:", error.message);
        res.status(500).json({ error: "No se pudieron obtener los resultados en vivo.", details: error.message });
    }
};