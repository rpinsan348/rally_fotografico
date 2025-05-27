document.addEventListener("DOMContentLoaded", () => {
    const listaRanking = document.getElementById("lista-ranking");
    // Obtenemos donde vamos a dibujar el grafico de barras
    const grafico = document.getElementById("graficoVotos").getContext("2d");

    // Obtenemos el concurso guardado en el localStorage
    const concursoGuardado = JSON.parse(localStorage.getItem("concurso"));
    const concursoId = concursoGuardado?.id;

    console.log("ID del concurso desde localStorage:", concursoId);

    if (!concursoId) {
        listaRanking.innerHTML = "No se especificó el concurso.";
        return;
    }

    // Pedimos al servidor los datos del ranking de fotos para ese concurso
    fetch(`../backend/api/obtenerRanking.php?concurso_id=${concursoId}`)
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.success) {
                let html = "<ul>";

                // Mostramos cada foto con sus datos
                datos.fotos.forEach(foto => {
                    html += `
                        <li>
                            <img src="../uploads/${foto.imagen_url}" alt="${foto.titulo}" style="width: 100px; height: auto;">
                            <strong>${foto.titulo}</strong><br>
                            Votos: ${foto.votos} | Promedio de Voto: ${foto.promedio_voto} / 5
                        </li>
                    `;
                });

                html += "</ul>";
                // Insertamos el HTML en la pagina
                listaRanking.innerHTML = html;

                // Preparamos los datos para el grafico de barras
                const etiquetas = datos.fotos.map(foto => foto.titulo);
                const votos = datos.fotos.map(foto => foto.votos);
                const promedioVotos = datos.fotos.map(foto => foto.promedio_voto);

                //Creamos el grafico de barras
                new Chart(grafico, {
                    type: 'bar', //Tipo de grafico
                    data: {
                        labels: etiquetas, //Eje X
                        datasets: [
                            {
                                label: 'Votos por Foto',
                                data: votos,
                                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1
                            },
                            {
                                label: 'Promedio de Voto',
                                data: promedioVotos,
                                backgroundColor: 'rgba(255, 159, 64, 0.2)',
                                borderColor: 'rgba(255, 159, 64, 1)',
                                borderWidth: 1
                            }
                        ]
                    },
                    options: {
                        responsive: true,
                        scales: {
                            y: {
                                beginAtZero: true
                            }
                        }
                    }
                });
            } else {
                listaRanking.innerHTML = "No se pudieron cargar las fotos.";
            }
        })
        .catch(error => {
            console.error(error);
            listaRanking.innerHTML = "Ocurrió un error al cargar el ranking.";
        });
});
