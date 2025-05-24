document.addEventListener("DOMContentLoaded", () => {
  const mensaje = document.getElementById("mensaje");
  const user = JSON.parse(localStorage.getItem("user"));
  const concurso = JSON.parse(localStorage.getItem("concurso"));

  document.getElementById("userName").textContent = user?.nombre || "Participante";
  document.getElementById("concursoNombre").textContent = concurso?.nombre || "No seleccionado";

  if (!user || !user.id) {
    mensaje.textContent = "⚠️ Debes iniciar sesión para ver tus fotos.";
    mensaje.style.color = "red";
    return;
  }

  if (!concurso || !concurso.id) {
    mensaje.textContent = "⚠️ No se ha seleccionado un concurso.";
    mensaje.style.color = "red";
    return;
  }

  fetch(`../backend/api/obtenerFotos.php?user_id=${user.id}&concurso_id=${concurso.id}`)
    .then(res => res.json())
    .then(dato => {
      if (dato.success) {
        const fotosContainer = document.querySelector(".foto");
        dato.fotos.forEach(foto => {
          const fotoElemento= document.createElement("div");
          fotoElemento.classList.add("foto-item");

          fotoElemento.innerHTML = `
            <img src="../uploads/${foto.imagen_url}" alt="${foto.titulo}">
            <p><strong>${foto.titulo}</strong></p>
            <p class="estado">${foto.estado}</p>
            ${foto.estado === "pendiente" ? `<button onclick="eliminarFoto(${foto.id})">🗑️ Eliminar</button>` : ""}
          `;

          fotosContainer.appendChild(fotoElemento);
        });
      } else {
        mensaje.textContent = "No tienes fotos subidas o hubo un error.";
        mensaje.style.color = "red";
      }
    })
    .catch(err => {
      console.error(err);
      mensaje.textContent = "❌ Error al cargar las fotos.";
      mensaje.style.color = "red";
    });

  window.eliminarFoto = function (idFoto) {
    if (!confirm("¿Seguro que deseas eliminar esta foto?")) return;

    fetch("../backend/api/eliminarFoto.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: user.id,
        foto_id: idFoto
      })
    })
      .then(res => res.json())
      .then(dato => {
        alert(dato.message);
        if (dato.success) {
          location.reload();
        }
      })
      .catch(err => {
        console.error(err);
        alert("❌ Error al intentar eliminar la foto.");
      });
  };

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
