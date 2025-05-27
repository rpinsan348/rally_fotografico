document.addEventListener("DOMContentLoaded", () => {
  const mensaje = document.getElementById("mensaje");
  const nombreConcurso = document.getElementById("nombreConcurso");
  const user = JSON.parse(localStorage.getItem("user"));
  const concurso = JSON.parse(localStorage.getItem("concurso"));

  if (user && user.nombre) {
    document.getElementById("userName").textContent = user.nombre;
  } else {
    document.getElementById("userName").textContent = "participante";
  }

  if (!user || !user.id) {
    mensaje.textContent = "⚠️ Debes iniciar sesión para ver las fotos del concurso.";
    mensaje.style.color = "red";
    return;
  }

  if (!concurso || !concurso.id) {
    mensaje.textContent = "⚠️ No has seleccionado un concurso.";
    mensaje.style.color = "red";
    return;
  }

  // Mostramos el nombre del concurso en la pagina
  nombreConcurso.textContent = concurso.nombre;

  document.getElementById("concursoNombre").textContent = concurso.nombre;

  // Mostramos el plazos del concurso
  const fechaInicio = document.getElementById("fechaInicio");
  const fechaFin = document.getElementById("fechaFin");
  const plazoSubida = document.getElementById("plazoSubida");
  const plazoVotacion = document.getElementById("plazoVotacion");

  if (concurso) {
    fechaInicio.textContent = formatearFecha(concurso.fecha_inicio);
    fechaFin.textContent = formatearFecha(concurso.fecha_fin);
    plazoSubida.textContent = validarYFormatearFecha(concurso.plazo_subida);
    plazoVotacion.textContent = validarYFormatearFecha(concurso.plazo_votacion);
  }

  function formatearFecha(fechaISO) {
    const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
  }

  function validarYFormatearFecha(fecha) {
    if (!fecha) return "No disponible";
    const fechaValida = new Date(fecha);
    return isNaN(fechaValida.getTime()) ? "Fecha inválida" : formatearFecha(fechaValida);
  }

  // Cargamos las fotos del concurso
  fetch(`../backend/api/obtenerFotosConcurso.php?concurso_id=${concurso.id}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        const contenedorFotos = document.querySelector(".foto");
        contenedorFotos.innerHTML = "";

        //Recorremos cada foto
        data.fotos.forEach(foto => {
          const fotoElemento = document.createElement("div");
          fotoElemento.classList.add("foto-item");

          const puedeVotar = foto.usuario_id !== user.id;

          const estrellasDiv = document.createElement("div");
          estrellasDiv.classList.add("estrellas");

          // Añadimos 5 estrellas
          for (let i = 1; i <= 5; i++) {
            const estrella = document.createElement("i");
            estrella.classList.add("fa", "fa-star", "estrella");
            estrella.dataset.value = i;
            estrella.style.cursor = puedeVotar ? "pointer" : "default";

            // Si puede votar, permitimos el clic
            if (puedeVotar) {
              estrella.addEventListener("click", () => {

                const valor = parseInt(estrella.dataset.value);

                fetch("../backend/api/votarFoto.php", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({
                    usuario_id: user.id,
                    fotografia_id: foto.id,
                    valor: valor
                  })
                })
                .then(res => res.json())
                .then(data => {
                  if (data.success) {
                    alert("✅ Voto registrado con éxito.");
                    // Actualizamos el numero de votos
                    foto.votos = (parseInt(foto.votos) || 0) + 1;
                    fotoElemento.querySelector(".votos").textContent = `🗳️ Votos: ${foto.votos}`;
                    estrellasDiv.querySelectorAll(".estrella").forEach((e, idx) => {
                      e.style.pointerEvents = "none";
                      e.style.cursor = "default";
                      e.style.color = idx < valor ? "gold" : "#ccc";
                    });
                  } else {
                    alert("❌ " + data.message);
                  }
                })
                .catch(err => {
                  console.error(err);
                  alert("❌ Error al enviar el voto.");
                });
              });
            }

            estrellasDiv.appendChild(estrella);
          }

          // Pintamos las estrellas segun el promedio de votos
          const promedio = Math.round(foto.promedio_voto || 0);  // Redondeamos el promedio para pintar las estrellas
          const estrellas = estrellasDiv.querySelectorAll(".estrella");
          for (let i = 0; i < promedio; i++) {
            estrellas[i].style.color = "gold";
          }

          fotoElemento.innerHTML = `
            <img src="../uploads/${foto.imagen_url}" alt="${foto.titulo}">
            <p><strong>${foto.titulo}</strong></p>
            <p class="estado">${foto.estado}</p>
            <p class="votos">🗳️ Votos: ${foto.votos || 0}</p>
            ${!puedeVotar ? `<p>📸 Tu foto<br>No puedes votar tu propia foto</p>` : ""}
          `;

          fotoElemento.appendChild(estrellasDiv);
          contenedorFotos.appendChild(fotoElemento);
        });

      } else {
        mensaje.textContent = "No hay fotos para mostrar en este concurso.";
        mensaje.style.color = "red";
      }
    })
    .catch(err => {
      console.error(err);
      mensaje.textContent = "❌ Error al cargar las fotos.";
      mensaje.style.color = "red";
    });

  // Funcion para cerrar sesión
  const cerrar_sesion = document.getElementById("cerrar_sesion");
  if (cerrar_sesion) {
    cerrar_sesion.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      localStorage.removeItem("concurso");
      window.location.href = "index.html";
    });
  }
});
