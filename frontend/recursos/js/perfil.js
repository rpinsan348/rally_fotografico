document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("perfilForm");
    const mensaje = document.getElementById("mensaje");
    const editarBtn = document.getElementById("editarBtn");
    const guardarBtn = document.getElementById("guardarBtn");
    const cerrar_sesion = document.getElementById("cerrar_sesion");
    const nombreUsuario = document.getElementById("userName");
    const user = JSON.parse(localStorage.getItem("user"));

  // Mostramos el nombre del usuario
  if (nombreUsuario) {
    nombreUsuario.textContent = user?.nombre || "participante";
  }

  // Cerrar sesion
  if (cerrar_sesion) {
    cerrar_sesion.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("user");
      window.location.href = "index.html";
    });
  }
  
    if (!user || !user.id) {
      mensaje.textContent = "⚠️ No se pudo cargar el perfil. Vuelve a iniciar sesión.";
      mensaje.style.color = "red";
      return;
    }
  
    fetch(`../backend/api/obtenerPerfil.php?id=${user.id}`)
      .then(res => res.json())
      .then(dato => {
        form.nombre.value = dato.nombre || "";
        form.email.value = dato.email || "";
      });
  
    // Habilitamos la edicion al hacer click en el boton
    editarBtn.addEventListener("click", () => {
      //Permitimos modificar los campos
      form.nombre.removeAttribute("readonly");
      form.email.removeAttribute("readonly");
  
      editarBtn.style.display = "none"; // Ocultamos el boton editar
      guardarBtn.style.display = "inline-block"; //Mostramos el boton guardar
    });
  
    // Guardampos los cambios
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const password = form.password.value.trim(); // Obtenemos el valor de de la nueva contraseña

        // Si hay una contraseña nueva, mostramos la confirmacion
        if (password !== "") {
            const confirmUpdate = confirm("¿Estás seguro de que deseas actualizar tu contraseña?");
            if (!confirmUpdate) {
                return; 
            }
        }
        
      //Creamos un FormData con todos los campos del formulario
      const formDato = new FormData(form);
      formDato.append("id", user.id); // Enviamos el ID al backend
  
      fetch("../backend/api/editarPerfil.php", {
        method: "POST",
        body: formDato
      })
        .then(res => res.json())
        .then(dato => {
          mensaje.textContent = dato.message;
          mensaje.style.color = dato.success ? "green" : "red";
  
          if (dato.success) {
            // Si se ha guardado bien, se bloquean los campos
            form.nombre.setAttribute("readonly", true);
            form.email.setAttribute("readonly", true);
            editarBtn.style.display = "inline-block";
            guardarBtn.style.display = "none";
          }
        });
    });
  });
  