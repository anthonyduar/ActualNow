import fetch from 'node-fetch'; // Asegúrate de que esto es 'node-fetch' si tu Node.js es antiguo, o quítalo si usas Node.js 18+

export default async (req, res) => {
    // TU CLAVE API SE CONFIGURARÁ EN VERCEL, NO AQUÍ DIRECTAMENTE
    const API_KEY = process.env.API_FOOTBALL_KEY;

    // Esta es la URL del endpoint que encontramos en la documentación para partidos en vivo
    const API_URL = "https://v3.football.api-sports.io/fixtures?live=all";

    // *** INICIO DE LAS CABECERAS CORS AÑADIDAS ***
    // Permite que cualquier origen (tu Live Server local, por ejemplo) acceda a esta API
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Define los métodos HTTP permitidos (GET, POST, OPTIONS)
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    // Define las cabeceras que pueden ser usadas en la solicitud
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-rapidapi-host, x-rapidapi-key');

    // Manejar las solicitudes preflight (OPTIONS):
    // El navegador envía una solicitud OPTIONS primero para verificar los permisos CORS.
    // Si la solicitud es OPTIONS, respondemos con 200 OK y las cabeceras CORS.
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    // *** FIN DE LAS CABECERAS CORS AÑADIDAS ***

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