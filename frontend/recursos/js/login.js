document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("loginForm");
    const mensaje = document.getElementById("mensaje");

    form.addEventListener("submit", function (event) {
        event.preventDefault();  

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        console.log({
            email: email,
            password: password
        });

        fetch("../backend/api/login.php", {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(response => response.text())  // Obtenemos la respuesta como texto
        .then(text => {
            console.log("Respuesta del servidor:", text); 

            try {
                const dato = JSON.parse(text);  // Intentamos convertir la respuesta a JSON
                if (dato.success) {
                    mensaje.style.color = "green";
                    mensaje.textContent = "✅ Login exitoso. Redirigiendo...";

                    // Guardamos el usuario en el localStorage
                    localStorage.setItem("user", JSON.stringify(dato.user));

                    // Detectamos el rol del usuario
                    const rol = dato.user.rol;
                    console.log("Rol del usuario en login.js:", rol);

                    // Despues de 2 segundos redirigimos segun el rol
                    setTimeout(() => {
                        if (rol === "admin") {
                            window.location.href = "concursos_admin.html";
                        } else {
                            window.location.href = "concursos.html";
                        }
                    }, 2000);
                } else {
                    mensaje.style.color = "red";
                    mensaje.textContent = "❌ " + dato.message;
                }
            } catch (error) {
                console.log("Error en la autenticación:", error);
                mensaje.style.color = "red";
                mensaje.textContent = "❌ Error en la conexión.";
            }
        })
        .catch(error => {
            console.log("Error:", error);
            mensaje.style.color = "red";
            mensaje.textContent = "❌ Error en la conexión.";
        });
    });
});
