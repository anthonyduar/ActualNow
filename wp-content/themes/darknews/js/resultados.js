document.addEventListener('DOMContentLoaded', function() {
    const resultadosDiv = document.getElementById('resultados-en-vivo');
    const SERVERLESS_FUNCTION_URL = '/api/live-scores'; 

    async function fetchLiveResults() {
        try {
            const response = await fetch(SERVERLESS_FUNCTION_URL);

            if (!response.ok) {
                const errorData = await response.json(); 
                throw new Error(`Error de la función serverless: ${response.status} - ${errorData.details || response.statusText}`);
            }

            const data = await response.json();

            let htmlContent = '<h2>Resultados de Fútbol en Vivo</h2>';

            if (data && data.response && data.response.length > 0) {
                htmlContent += '<ul>';
                data.response.forEach(fixture => {
                    const homeTeam = fixture.teams.home.name;
                    const awayTeam = fixture.teams.away.name;
                    const homeGoals = fixture.goals.home !== null ? fixture.goals.home : '-';
                    const awayGoals = fixture.goals.away !== null ? fixture.goals.away : '-';
                    const status = fixture.fixture.status.short; 

                    htmlContent += `
                        <li>
                            <strong>${homeTeam}</strong> ${homeGoals} - <span class="math-inline">\{awayGoals\} <strong\></span>{awayTeam}</strong> (${status})
                            <br><small>Minuto: ${fixture.fixture.status.elapsed !== null ? fixture.fixture.status.elapsed : 'N/A'}</small>
                        </li>
                    `;
                });
                htmlContent += '</ul>';
            } else {
                htmlContent += '<p>No hay partidos en vivo en este momento.</p>';
            }
            resultadosDiv.innerHTML = htmlContent;

        } catch (error) {
            console.error("Error al obtener resultados:", error);
            resultadosDiv.innerHTML = '<p>Error al cargar resultados: ' + error.message + '</p>';
        }
    }
    fetchLiveResults();
    setInterval(fetchLiveResults, 900000); // Actualiza cada 15 minutos
});