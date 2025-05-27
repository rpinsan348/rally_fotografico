document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Validación frontend
        const email = form.email.value.trim();
        const password = form.password.value;
        const confirmarContrasena = form.confirmar_contrasena ? form.confirmar_contrasena.value : password;

        if (!validarEmail(email)) {
            mensaje.style.color = "red";
            mensaje.textContent = "❌ El correo electrónico no es válido.";
            return;
        }

        if (password.length < 6) {
            mensaje.style.color = "red";
            mensaje.textContent = "❌ La contraseña debe tener al menos 6 caracteres.";
            return;
        }

        if (password !== confirmarContrasena) {
            mensaje.style.color = "red";
            mensaje.textContent = "❌ Las contraseñas no coinciden.";
            return;
        }

        //Si pasa las validaciones, se crea un formDato con los datos del formulario
        const formDato = new FormData(form);
        fetch("../backend/api/registro.php", {
            method: "POST",
            body: formDato
        })
        .then(respuesta => respuesta.json())
        .then(datos => {
            if (datos.success) {
                mensaje.style.color = "green";
                mensaje.textContent = "✅ Registro exitoso. Redirigiendo...";
                //Despues de 2 segundos redirige a la pagina de login
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 2000);
            } else {
                mensaje.style.color = "red";
                mensaje.textContent = "❌ " + datos.message;
            }
        })
        .catch(error => {
            console.error("Error:", error);
            mensaje.style.color = "red";
            mensaje.textContent = "❌ Error en la conexión.";
        });
    });

    //Validamos el formato del email
    function validarEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
