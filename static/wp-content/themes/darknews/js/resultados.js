// Código para resultados.js
document.addEventListener('DOMContentLoaded', function() {
    // Asegúrate de que este ID coincide con el ID del div en tu HTML personalizado
    const resultadosContainer = document.getElementById('live-scores-container'); 
    const updateButtonTop = document.getElementById('btn-actualizar-resultados-top');
    const updateButtonBottom = document.getElementById('btn-actualizar-resultados-bottom'); 
    const apiURL = 'https://actualnow.vercel.app/api/live-scores'; 

    function fetchLiveScores() {
        if (resultadosContainer) {
            resultadosContainer.innerHTML = '<p class="mensaje-estado">Actualizando resultados...</p>'; 
        }
        
        // Deshabilitar botones durante la carga
        if (updateButtonTop) {
            updateButtonTop.disabled = true; 
            updateButtonTop.textContent = 'Actualizando...'; 
        }
        if (updateButtonBottom) {
            updateButtonBottom.disabled = true; 
            updateButtonBottom.textContent = 'Actualizando...'; 
        }

        fetch(apiURL)
            .then(response => {
                if (!response.ok) {
                    console.error('Error en la respuesta de la API:', response.status, response.statusText);
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(apiResponse => {
                let htmlContent = '';
                // Football-Data.org devuelve los partidos en 'matches'
                const matches = apiResponse.matches; 

                if (!matches || matches.length === 0) {
                    htmlContent = '<p class="mensaje-estado">No hay partidos en vivo disponibles en este momento.</p>';
                } else {
                    matches.forEach(match => {
                        // Adaptar a la estructura de Football-Data.org
                        const homeTeamName = match.homeTeam ? match.homeTeam.name : 'N/A';
                        const awayTeamName = match.awayTeam ? match.awayTeam.name : 'N/A';
                        const homeScore = match.score && match.score.fullTime ? match.score.fullTime.home : '-';
                        const awayScore = match.score && match.score.fullTime ? match.score.fullTime.away : '-';
                        const leagueName = match.competition ? match.competition.name : 'N/A'; 
                        const status = match.status; 
                        const utcDate = new Date(match.utcDate);
                        const matchTime = utcDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                        const statusClass = (status === 'FINISHED' || status === 'PAUSED') ? 'estado-finalizado' : 'estado-partido'; 

                        htmlContent += `
                            <div class="partido-item">
                                <div class="partido-equipos">
                                    <span class="equipo-local">${homeTeamName}</span>
                                    <span class="partido-resultado">${homeScore} - ${awayScore}</span>
                                    <span class="equipo-visitante">${awayTeamName}</span>
                                </div>
                                <div class="partido-info">
                                    Liga: <strong>${leagueName}</strong> - Estado: <span class="${statusClass}">${status}</span> ${status === 'SCHEDULED' ? `(${matchTime})` : ''}
                                </div>
                            </div>
                        `;
                    });
                }
                if (resultadosContainer) {
                    resultadosContainer.innerHTML = htmlContent;
                }
                
                // Habilitar botones y restaurar texto
                if (updateButtonTop) {
                    updateButtonTop.disabled = false; 
                    updateButtonTop.textContent = 'Actualizar Resultados'; 
                }
                if (updateButtonBottom) {
                    updateButtonBottom.disabled = false; 
                    updateButtonBottom.textContent = 'Actualizar Resultados'; 
                }
            })
            .catch(error => {
                console.error('Error al obtener los datos de los partidos:', error);
                if (resultadosContainer) {
                    resultadosContainer.innerHTML = '<p class="mensaje-estado">Error al cargar los resultados de fútbol. Por favor, inténtalo de nuevo más tarde.</p>';
                }
                
                // Habilitar botones e indicar reintento
                if (updateButtonTop) {
                    updateButtonTop.disabled = false; 
                    updateButtonTop.textContent = 'Reintentar Actualizar'; 
                }
                if (updateButtonBottom) {
                    updateButtonBottom.disabled = false; 
                    updateButtonBottom.textContent = 'Reintentar Actualizar'; 
                }
            });
    }

    // Llamar a la función al cargar la página
    fetchLiveScores();

    // Añadir listeners a los botones si existen
    if (updateButtonTop) {
        updateButtonTop.addEventListener('click', fetchLiveScores);
    }
    if (updateButtonBottom) {
        updateButtonBottom.addEventListener('click', fetchLiveScores);
    }
});