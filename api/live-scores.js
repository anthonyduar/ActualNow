// api/live-scores.js

module.exports = async (req, res) => {

    // Establece las cabeceras CORS antes de enviar cualquier respuesta

    res.setHeader('Access-Control-Allow-Origin', '*'); // Permite cualquier origen. Para mayor seguridad, podrías especificar tu dominio de WordPress: 'https://actualnow.local'

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');



    // Manejo de solicitudes OPTIONS (preflight requests de CORS)

    if (req.method === 'OPTIONS') {

        res.status(200).end();

        return;

    }



    const API_KEY = process.env.FOOTBALL_DATA_API_KEY; // Asegúrate de que esta variable de entorno esté configurada en Vercel

    const API_BASE_URL = 'https://api.football-data.org/v4/matches'; // Endpoint para partidos



    // Ligas que quieres consultar. Añade más IDs según lo necesites.

    // Puedes encontrar los IDs en la documentación de Football-Data.org o en la sección de "Competiciones disponibles".

    const COMPETITION_IDS = [

        2013, // Brasileirão Série A (EEB)

        2021, // Primeira Liga (PPL)

        2014, // Primera Division (PD)

        2002, // Bundesliga (V1)

        2015, // Ligue 1 (FL1)

        2019, // Serie A (SA)

        2003, // Eredivisie (DED)

        // 2017, // Primeira Liga (PPL) - Este parece duplicado con 2021

        2000, // Copa Mundial de la FIFA (WC)

        2001, // Liga de Campeones de la UEFA (CL)

        2152  // Championship (ELC)

    ]; 



    // Obtener la fecha de hoy para filtrar los partidos

    const today = new Date();

    const year = today.getFullYear();

    const month = String(today.getMonth() + 1).padStart(2, '0');

    const day = String(today.getDate()).padStart(2, '0');

    const dateFrom = `${year}-${month}-${day}`;

    const dateTo = `${year}-${month}-${day}`; // Para obtener solo partidos de hoy



    try {

        const params = new URLSearchParams({

            competitions: COMPETITION_IDS.join(','),

            dateFrom: dateFrom,

            dateTo: dateTo

        });



        const fullApiUrl = `${API_BASE_URL}?${params.toString()}`;

        console.log('Fetching from URL:', fullApiUrl); // Línea de depuración para la URL



        const response = await fetch(fullApiUrl, {

            headers: {

                'X-Auth-Token': API_KEY,

            },

        });



        if (!response.ok) {

            const errorText = await response.text();

            console.error(`Error de la API de Football-Data.org: ${response.status} - ${errorText}`);

            // Enviar un error HTTP 500 al cliente si la API externa falla