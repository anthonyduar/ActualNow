// api/live-scores.js

export default async (req, res) => {
    const API_KEY_FOOTBALL_DATA = process.env.API_FOOTBALL_DATA_KEY;

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const formattedDate = `<span class="math-inline">\{year\}\-</span>{month}-${day}`;

    // *** CAMBIO A LOS CÓDIGOS DE LIGAS DE FOOTBALL-DATA.ORG ***
    // Estos son códigos de ligas para Football-Data.org, no números ID.
    // Puedes encontrar más en su documentación bajo 'Competitions' o en la sección de 'Recursos disponibles' que me diste.
    // EJEMPLOS: PL (Premier League), BL1 (Bundesliga), PD (La Liga), SA (Serie A), CL (Champions League)
    const desiredLeagueCodes = ['PL', 'BL1', 'PD', 'SA', 'CL']; // <-- ¡NUEVOS CÓDIGOS DE LIGAS!
    const competitionsFilter = desiredLeagueCodes.join(',');

    // URL adaptada para Football-Data.org
    // Usamos el endpoint '/v4/matches' y filtramos por fecha y competiciones (usando los códigos).
    const API_URL = `https://api.football-data.org/v4/matches?dateFrom=<span class="math-inline">\{formattedDate\}&dateTo\=</span>{formattedDate}&competitions=${competitionsFilter}`;

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'X-Auth-Token': API_KEY_FOOTBALL_DATA,
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error de la API de Football-Data.org:', response.status, errorData);
            return res.status(500).json({ error: `Error de la API de Football-Data.org: ${response.status} - ${errorData.message || 'Error desconocido'}` });
        }

        const data = await response.json();

        res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
        res.status(200).json(data);

    } catch (error) {
        console.error('Error en la función serverless:', error);
        res.status(500).json({ error: `Error en la función serverless: ${error.message}` });
    }
};