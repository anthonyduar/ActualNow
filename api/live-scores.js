module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const API_KEY = process.env.FOOTBALL_DATA_API_KEY;
    const API_BASE_URL = 'https://api.football-data.org/v4/matches';

    // Lista optimizada solo con ligas del PLAN GRATUITO para evitar error 403
    const COMPETITION_IDS = [
        2021, // Primeira Liga
        2014, // Primera Division (España)
        2002, // Bundesliga
        2015, // Ligue 1
        2019, // Serie A
        2003, // Eredivisie
        2001  // Champions League
    ]; 

    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    try {
        const params = new URLSearchParams({
            competitions: COMPETITION_IDS.join(','),
            dateFrom: dateStr,
            dateTo: dateStr
        });

        const response = await fetch(`${API_BASE_URL}?${params.toString()}`, {
            headers: { 'X-Auth-Token': API_KEY }
        });

        if (!response.ok) {
            const errorText = await response.text();
            res.status(response.status).json({ error: errorText });
            return;
        }

        const data = await response.json();
        res.status(200).json(data);

    } catch (error) {
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
};