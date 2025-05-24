document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("perfilForm");
    const mensaje = document.getElementById("mensaje");
    const editarBtn = document.getElementById("editarBtn");
    const guardarBtn = document.getElementById("guardarBtn");
    const cerrar_sesion = document.getElementById("cerrar_sesion");
    const nombreUsuario = document.getElementById("userName");
    const user = JSON.parse(localStorage.getItem("user"));

  if (nombreUsuario) {
    nombreUsuario.textContent = user?.nombre || "participante";
  }

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
  
    editarBtn.addEventListener("click", () => {
      form.nombre.removeAttribute("readonly");
      form.email.removeAttribute("readonly");
  
      editarBtn.style.display = "none";
      guardarBtn.style.display = "inline-block";
    });
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const password = form.password.value.trim(); 

        if (password !== "") {
            const confirmUpdate = confirm("¿Estás seguro de que deseas actualizar tu contraseña?");
            if (!confirmUpdate) {
                return; 
            }
        }
        
      const formDato = new FormData(form);
      formDato.append("id", user.id); 
  
      fetch("../backend/api/editarPerfil.php", {
        method: "POST",
        body: formDato
      })
        .then(res => res.json())
        .then(dato => {
          mensaje.textContent = dato.message;
          mensaje.style.color = dato.success ? "green" : "red";
  
          if (dato.success) {
            form.nombre.setAttribute("readonly", true);
            form.email.setAttribute("readonly", true);
            editarBtn.style.display = "inline-block";
            guardarBtn.style.display = "none";
          }
        });
    });
  });
  