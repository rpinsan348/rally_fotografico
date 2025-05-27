document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    // Si el formulario existe se añade un evento submit
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            try {
                const respuesta = await fetch("../backend/api/login.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });

                const dato = await respuesta.json();
                console.log("Respuesta del servidor:", dato);

                //Si el login ha sido exitoso guarda los datos de usuario en el localStorage
                if (dato.success) {
                    localStorage.setItem("user", JSON.stringify(dato.user));
                    alert("Bienvenido, " + dato.user.nombre);

                    //Obtenemos el rol de usuario
                    const role = dato.user.rol;
                    console.log("Rol del usuario:", role);

                    //Segun el rol del usuario te lleva a distointas paginas
                    if (role === "admin") {
                        window.location.replace("admin.html");
                    } else {
                        window.location.replace("galeria.html");
                    }
                } else {
                    alert(dato.message);
                }
            } catch (error) {
                console.error("Error en la autenticación:", error);
                alert("❌ Error al conectar con el servidor.");
            }
        });
    }

});

// Función para cerrar sesión
function cerrar_sesion() {
    //Elimina el usuario guardado en el localStorage
    localStorage.removeItem("user");
    alert("Sesión cerrada.");
    window.location.replace("index.html");
}
