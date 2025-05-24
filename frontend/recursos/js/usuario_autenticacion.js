document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

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

                if (dato.success) {
                    localStorage.setItem("user", JSON.stringify(dato.user));
                    alert("Bienvenido, " + dato.user.nombre);

                    const role = dato.user.rol;
                    console.log("Rol del usuario:", role);

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

function cerrar_sesion() {
    localStorage.removeItem("user");
    alert("Sesión cerrada.");
    window.location.replace("index.html");
}
