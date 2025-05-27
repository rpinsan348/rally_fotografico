document.addEventListener("DOMContentLoaded", () => {
  const mensaje = document.getElementById("mensaje");
  const contenedorConcursos = document.getElementById("concursos");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.id) {
    mensaje.textContent = "⚠️ Debes iniciar sesión para continuar.";
    return;
  }

  fetch("../backend/api/obtenerConcursos.php")
    .then(res => res.json())
    .then(dato => {
      if (dato.success && Array.isArray(dato.concursos)) {
        if (dato.concursos.length === 0) {
          mensaje.textContent = "No hay concursos disponibles.";
          return;
        }

        //Recorremos todos los concursos y creamos un boton en cada uno
        dato.concursos.forEach(concurso => {
          const btn = document.createElement("button");
          btn.className = "concurso-btn";
          btn.textContent = `${concurso.nombre} (${concurso.estado})`;

          //Si el concurso esta cerrado, se desactiva el boton
          if (concurso.estado === "cerrado") {
            btn.disabled = true;
          } else {
            btn.onclick = () => {
              //Se guarda el concurso en el localStorage
              localStorage.setItem("concurso", JSON.stringify(concurso));
              //Se redirige al usuario
              window.location.href = "galeria.html";
            };
          }
          //Agregamos el boton a la pagina
          contenedorConcursos.appendChild(btn);
        });
      } else {
        mensaje.textContent = "No se pudieron obtener los concursos.";
      }
    })
    .catch(err => {
      console.error(err);
      mensaje.textContent = "❌ Error al cargar los concursos.";
    });
});
