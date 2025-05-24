document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("formSubida");
  const mensaje = document.getElementById("mensaje");
  const user = JSON.parse(localStorage.getItem("user"));
  const concurso = JSON.parse(localStorage.getItem("concurso"));

  const nombreUsuario = document.getElementById("userName");
  if (nombreUsuario) {
    nombreUsuario.textContent = user ? user.nombre : "participante";
  }

  const concursoNombre = document.getElementById("concursoNombre");
  if (concursoNombre) {
    concursoNombre.textContent = concurso ? concurso.nombre : "No seleccionado";
  }

  const cerrar_sesion  = document.getElementById("cerrar_sesion");
  if (cerrar_sesion ) {
    cerrar_sesion .addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      localStorage.removeItem("concurso");
      window.location.href = "index.html";
    });
  }



  if (!user || !user.id) {
    mensaje.textContent = "⚠️ Debes iniciar sesión para subir una foto.";
    mensaje.style.color = "red";
    form.style.display = "none";
    return;
  }

  if (!concurso || !concurso.id) {
    mensaje.textContent = "⚠️ No has seleccionado un concurso.";
    mensaje.style.color = "red";
    form.style.display = "none";
    return;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const archivo = document.getElementById("foto").files[0];
    if (!archivo) {
      mostrarMensaje("Debes seleccionar una imagen.", "red");
      return;
    }

    const extensionesPermitidas = ["image/jpeg", "image/png"];
    const maxSizeMB = 5;

    if (!extensionesPermitidas.includes(archivo.type)) {
      mostrarMensaje("Solo se permiten archivos JPG y PNG.", "red");
      return;
    }

    if (archivo.size > maxSizeMB * 1024 * 1024) {
      mostrarMensaje(`La imagen supera los ${maxSizeMB}MB.`, "red");
      return;
    }

    const formDato = new FormData(form);
    formDato.set("user_id", user.id); 
    formDato.set("concurso_id", concurso.id); 

    console.log("Concurso ID que se enviará:", concurso.id);

    fetch("../backend/api/subirFoto.php", {
      method: "POST",
      body: formDato,
    })
      .then(res => res.json())
      .then(data => {
        mostrarMensaje(data.message, data.success ? "green" : "red");
        if (data.success) form.reset();
      })
      .catch(err => {
        console.error(err);
        mostrarMensaje("❌ Error inesperado al subir la foto.", "red");
      });
  });

  function mostrarMensaje(texto, color) {
    mensaje.textContent = texto;
    mensaje.style.color = color;
  }
});



