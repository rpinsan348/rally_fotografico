const concurso = JSON.parse(localStorage.getItem("concurso"));

if (!concurso || !concurso.id) {
    alert("No se ha seleccionado un concurso. Redirigiendo al inicio.");
    window.location.href = "index.html"; 
}

console.log("ID del concurso:", concurso.id); 

function votar(fotoId, valor) {
    fetch("../backend/api/votar.php", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ fotoId: fotoId, valor: valor })
    })
    .then(response => response.json()) 
    .then(data => {
        if (data.success) {
            const fotoElemento = document.getElementById(`foto_${fotoId}`);
            const votosElemento = fotoElemento.querySelector(".votos");
            const estrellasDiv = fotoElemento.querySelector(".estrellas");

            votosElemento.textContent = `🗳️ Votos: ${parseInt(votosElemento.textContent.split(": ")[1]) + 1}`;

            const estrellas = estrellasDiv.querySelectorAll(".estrella");

            const promedioVoto = data.promedio || 0;

            estrellas.forEach((estrella, index) => {
                if (index < promedioVoto) {
                    estrella.style.color = "gold"; 
                } else {
                    estrella.style.color = "#ddd"; 
                }
            });

            alert("¡Gracias por votar!");
        } else {
            alert(data.message);
        }
    })
    .catch(err => {
        console.error(err);
        alert("Error al registrar el voto.");
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const concurso = JSON.parse(localStorage.getItem("concurso"));
    if (concurso && concurso.nombre) {
        const concursoNombreSpan = document.getElementById("concursoNombre");
        if(concursoNombreSpan) {
            concursoNombreSpan.textContent = concurso.nombre;
        }
    } else {
        const concursoNombreSpan = document.getElementById("concursoNombre");
        if(concursoNombreSpan) {
            concursoNombreSpan.textContent = "No seleccionado";
        }
    }

    const contenedor = document.querySelector(".galeria-container");
    const mensaje = document.getElementById("mensaje");

    if (!concurso || !concurso.id) {
        mensaje.textContent = "❌ No se ha seleccionado ningún concurso.";
        mensaje.style.color = "red";
        return;
    }

    const concursoCerrado = concurso.estado === "cerrado";

    if (concursoCerrado) {
        mensaje.textContent = "Este concurso ya ha finalizado. Puedes ver las fotos, pero no se permite votar.";
        mensaje.style.color = "darkred";
    }

    fetch(`../backend/api/obtenerGaleriaPublico.php?concurso_id=${concurso.id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                if (data.fotos.length === 0) {
                    mensaje.textContent = "Aún no hay fotografías admitidas para este concurso.";
                    return;
                }

                data.fotos.forEach(foto => {
                    const div = document.createElement("div");
                    div.classList.add("foto-item");
                    div.id = `foto_${foto.id}`;

                    const estrellasDiv = document.createElement("div");
                    estrellasDiv.classList.add("estrellas");

                    for (let i = 1; i <= 5; i++) {
                        const estrella = document.createElement("span");
                        estrella.classList.add("estrella");
                        estrella.dataset.valor = i;
                        estrella.textContent = "★";  
                        estrella.style.cursor = "pointer";

                        if (!concursoCerrado) {
                            estrella.addEventListener("click", () => votar(foto.id, i));
                        }

                        estrellasDiv.appendChild(estrella);
                    }

                    const promedioVoto = foto.promedio || 0;
                    const estrellas = estrellasDiv.querySelectorAll(".estrella");
                    for (let i = 0; i < promedioVoto; i++) {
                        estrellas[i].style.color = "gold";  
                    }

                    div.innerHTML = `
                        <img src="../uploads/${foto.imagen_url}" alt="${foto.titulo}">
                        <h3>${foto.titulo}</h3>
                        <p>${foto.descripcion || ""}</p>
                        <p class="votos">🗳️ Votos: ${foto.votos}</p>
                        ${concursoCerrado ? `<p><strong>Autor:</strong> ${foto.autor || "Desconocido"}</p>` : ""}
                    `;

                    div.appendChild(estrellasDiv);
                    contenedor.appendChild(div);
                });
            } else {
                mensaje.textContent = data.message || "No se pudieron cargar las fotos.";
                mensaje.style.color = "red";
            }
        })
        .catch(err => {
            console.error(err);
            mensaje.textContent = "❌ Error al cargar la galería.";
            mensaje.style.color = "red";
        });
});
