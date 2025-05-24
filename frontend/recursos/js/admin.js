let graficoVotosChart = null; 

document.addEventListener("DOMContentLoaded", function () {
const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.rol !== "admin") {
        alert("Acceso no autorizado.");
        window.location.href = "index.html";
        return;
    }
    

    const concurso_id = localStorage.getItem("concurso_admin_id"); 
    if (!concurso_id) {
        alert("No se ha seleccionado un concurso.");
        window.location.href = "concursos_admin.html";
        return;
    }

    getConfiguracionRally(concurso_id); 

    const configForm = document.getElementById("configRallyForm");
    if (configForm) {
        configForm.addEventListener("submit", async function (event) {
            event.preventDefault();
            const nombre = document.getElementById("nombre").value;
            const descripcion = document.getElementById("descripcion").value;
            const fechaInicio = document.getElementById("fechaInicio").value;
            const fechaFin = document.getElementById("fechaFin").value;
            const plazoRecepcion = document.getElementById("plazoRecepcion").value;
            const limiteFotos = document.getElementById("limiteFotos").value;
            const plazoVotacion = document.getElementById("plazoVotacion").value;
    const maxTamanoFoto = document.getElementById("maxTamanoFoto").value; 

    
            document.getElementById("fechaInicio").blur();
            document.getElementById("fechaFin").blur();
            document.getElementById("plazoRecepcion").blur();
            document.getElementById("plazoVotacion").blur();

            console.log("Nombre:", nombre);
            console.log("Descripción:", descripcion);
            console.log("Fecha de Inicio:", fechaInicio);
            console.log("Fecha de Fin:", fechaFin);
            console.log("Plazo Recepción:", plazoRecepcion);
            console.log("Límite Fotos:", limiteFotos);
            console.log("Plazo Votación:", plazoVotacion);

            try {
                const response = await fetch("../backend/api/configuracion_rally.php", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        concurso_id, 
                        nombre,
                        descripcion,
                        fechaInicio,
                        fechaFin,
                        plazoSubida: plazoRecepcion,
                        limiteFotos,
                        plazoVotacion,
                        maxTamanoFoto
                    })
                });
                const data = await response.json();
                console.log("Respuesta del servidor:", data);

                if (data.success) {
                    alert("Configuración guardada correctamente.");
                } else {
                    alert("Error al guardar la configuración.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("❌ Error al conectar con el servidor.");
            }
        });
    }

    usuarios(concurso_id); 
    fotos(concurso_id); 
    estadisticas(concurso_id); 
});

async function getConfiguracionRally(concurso_id) {
    try {
        const response = await fetch(`../backend/api/get_configuracion_rally.php?concurso_id=${concurso_id}`); 
        const data = await response.json();
        if (data.success) {
            document.getElementById("nombre").value = data.config.nombre;
            document.getElementById("descripcion").value = data.config.descripcion;
            document.getElementById("fechaInicio").value = formatDateForInput(data.config.fecha_inicio);
            document.getElementById("fechaFin").value = formatDateForInput(data.config.fecha_fin);
            document.getElementById("plazoRecepcion").value = formatDateForInput(data.config.plazo_subida);
            document.getElementById("limiteFotos").value = data.config.max_fotos;
            document.getElementById("plazoVotacion").value = formatDateForInput(data.config.plazo_votacion);

            document.getElementById("maxTamanoFoto").value = data.config.max_tamano_foto;

        }
    } catch (error) {
        console.error("Error al cargar configuración:", error);
    }
}

function formatDateForInput(datetimeStr) {
    if (!datetimeStr || new Date(datetimeStr).getTime() === 0) {
        return ""; 
    }
    const date = new Date(datetimeStr);
    return date.toISOString().slice(0, 16);
}



async function usuarios(concurso_id) {
    const usuariosTableBody = document.getElementById("usuariosTable").getElementsByTagName("tbody")[0];
    const pendientesTableBody = document.getElementById("usuariosPendientesTable").getElementsByTagName("tbody")[0];
    usuariosTableBody.innerHTML = "";
    pendientesTableBody.innerHTML = "";

    try {
        const response = await fetch(`../backend/api/usuarios.php?concurso_id=${concurso_id}`);
        const data = await response.json();

        if (data.success) {
            data.usuarios.forEach(user => {
                if (user.estado === "pendiente") {
                    const row = pendientesTableBody.insertRow();
                    row.innerHTML = `
                        <td>${user.nombre}</td>
                        <td>${user.email}</td>
                        <td>${user.rol}</td>
                        <td>
                            <button onclick="actualizar_Role('${user.email}', '${concurso_id}')">Cambiar Rol</button>
                            <button onclick="aprobarCuentaUsuario('${user.email}', '${concurso_id}')">Aprobar</button>
                            <button onclick="rechazarCuentasPendientes('${user.email}', '${concurso_id}')">Rechazar</button>
                        </td>
                    `;
                } else if (user.estado === "aprobado") {
                    const row = usuariosTableBody.insertRow();
                    row.innerHTML = `
                        <td>${user.nombre}</td>
                        <td>${user.email}</td>
                        <td>${user.rol}</td>
                        <td>
                            <button onclick="actualizar_Role('${user.email}', '${concurso_id}')">Cambiar Rol</button>
                            <button onclick="actualizarUsuario('${user.nombre}', '${user.email}', '${user.rol}', '${concurso_id}')">Modificar</button>
                            <button onclick="borrarUsuario('${user.email}', '${concurso_id}')">Eliminar</button>
                        </td>
                    `;
                }
            });
            
        } else {
            alert("Error al cargar los usuarios.");
        }
    } catch (error) {
        console.error("Error al cargar usuarios:", error);
    }
}




async function aprobarCuentaUsuario(email, concurso_id) {
    if (confirm("¿Aprobar este usuario?")) {
        const user = await obtenerUsuarioPorEmail(email); 
        if (user && user.rol === "admin") {
            const actualizar_Role = confirm("Este usuario tiene rol 'admin'. ¿Quieres cambiarlo a 'participante'?");

            if (actualizar_Role) {
                await actualizarRolUsuario(email, concurso_id);
            }
        }

        try {
            const response = await fetch("../backend/api/aprobar_cuenta_usuario.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (data.success) {
                alert("Usuario aprobado.");
                usuarios(concurso_id);
            } else {
                alert("Error al aprobar usuario.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}


async function obtenerUsuarioPorEmail(email) {
    try {
        const response = await fetch(`../backend/api/obtener_usuario_por_email.php?email=${encodeURIComponent(email)}`);
        const data = await response.json();
        if (data.success) {
            return data.user;
        } else {
            console.warn("Usuario no encontrado:", data.message);
            return null;
        }
    } catch (error) {
        console.error("Error al obtener usuario por email:", error);
        return null;
    }
}


async function rechazarCuentasPendientes(email, concurso_id) {
    if (confirm("¿Estás seguro de que quieres rechazar este usuario?")) {
        try {
            const response = await fetch("../backend/api/rechazar_cuentas_pendientes.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (data.success) {
                alert("Usuario rechazado.");
                usuarios(concurso_id);
            } else {
                alert("Error al rechazar usuario.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}


async function actualizarRolUsuario(email, concurso_id) {
    try {
        const response = await fetch("../backend/api/actualizar_rol_usuario.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newRole: "participante" })
        });
        const data = await response.json();
        if (data.success) {
            alert("Rol cambiado a 'participante'.");
        } else {
            alert("Error al cambiar el rol.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}



async function estadisticas(concurso_id) {
    try {
        const response = await fetch(`../backend/api/estadisticas.php?concurso_id=${concurso_id}`);
        const data = await response.json();
        console.log("Estadísticas cargadas:", data);

        const contenedor = document.getElementById("estadisticas");
        if (data.success) {
            contenedor.innerHTML = `
                <h3>Resumen General</h3>
                <p><strong>Total de fotos subidas:</strong> ${data.total_fotos}</p>
                <p><strong>Fotos admitidas:</strong> ${data.admitidas}</p>
                <p><strong>Fotos rechazadas:</strong> ${data.rechazadas}</p>
                <p><strong>Participantes que han subido fotos:</strong> ${data.participantes_activos}</p>
            `;
        } else {
            contenedor.innerHTML = "<p>Error al obtener estadísticas generales.</p>";
        }

        const rankingList = document.getElementById("ranking-list");
        const graficoCanvas = document.getElementById("graficoVotos").getContext("2d");

        const rankingResponse = await fetch(`../backend/api/obtenerRanking.php?concurso_id=${concurso_id}`);
        const rankingData = await rankingResponse.json();

        if (rankingData.success) {
            let html = `
                <h3>Ranking de Fotos Más Votadas</h3>
                <ul style="list-style: none; padding: 0;">
            `;
            const etiquetas = [];
            const votos = [];
            const promedios = [];

            rankingData.fotos.forEach(foto => {
                html += `
                    <li style="margin-bottom: 15px;">
                        <img src="../uploads/${foto.imagen_url}" alt="${foto.titulo}" style="width: 100px; vertical-align: middle; margin-right: 10px;">
                        <strong>${foto.titulo}</strong><br>
                        Votos: ${foto.votos} | Promedio: ${foto.promedio_voto}/5
                    </li>
                `;
                etiquetas.push(foto.titulo);
                votos.push(foto.votos);
                promedios.push(foto.promedio_voto);
            });

            html += "</ul>";
            rankingList.innerHTML = html;

            if (graficoVotosChart) {
                graficoVotosChart.destroy();
            }

            graficoVotosChart = new Chart(graficoCanvas, {
                type: 'bar',
                data: {
                    labels: etiquetas,
                    datasets: [
                        {
                            label: 'Votos',
                            data: votos,
                            backgroundColor: 'rgba(54, 162, 235, 0.5)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: 'Promedio de Voto',
                            data: promedios,
                            backgroundColor: 'rgba(255, 206, 86, 0.5)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        }
                    ]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            max: 5
                        }
                    }
                }
            });
        } else {
            rankingList.innerHTML = "<p>No se pudo cargar el ranking de fotos.</p>";
        }

    } catch (error) {
        console.error("Error al cargar estadísticas:", error);
    }
}





async function actualizarUsuario(nombre, email, rol, concurso_id) {
    const nuevoNombre = prompt("Nuevo nombre:", nombre);
    const nuevoEmail = prompt("Nuevo email:", email);
    const nuevoRol = prompt("Nuevo rol (admin/participante):", rol);

    if (nuevoNombre && nuevoEmail && (nuevoRol === "admin" || nuevoRol === "participante")) {
        try {
            const response = await fetch("../backend/api/actualizar_usuario.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    oldEmail: email,
                    nuevoNombre,
                    nuevoEmail,
                    nuevoRol
                })
            });
            const data = await response.json();
            if (data.success) {
                alert("Usuario actualizado correctamente.");
                usuarios(concurso_id); 
            } else {
                alert("Error al actualizar el usuario.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        alert("Datos inválidos.");
    }
}

async function borrarUsuario(email, concurso_id) {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
        try {
            const response = await fetch("../backend/api/borrar_usuario.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await response.json();
            if (data.success) {
                alert("Usuario eliminado.");
                usuarios(concurso_id);
            } else {
                alert("Error al eliminar usuario.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}

async function actualizar_Role(email, concurso_id) {
    const newRole = prompt("Introduce el nuevo rol (participante/admin):");
    if (newRole && (newRole === "admin" || newRole === "participante")) {
        try {
            const response = await fetch("../backend/api/actualizar_rol_usuario.php", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newRole })
            });
            const data = await response.json();
            if (data.success) {
                alert("Rol actualizado.");
                usuarios(concurso_id);
            } else {
                alert("Error al cambiar el rol.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    } else {
        alert("Rol no válido.");
    }
}

async function fotos(concurso_id) {
    try {
        const response = await fetch(`../backend/api/foto.php?concurso_id=${concurso_id}`);
        const data = await response.json();
        if (data.success) {
            const fotosTable = document.getElementById("fotosTable").getElementsByTagName("tbody")[0];
            fotosTable.innerHTML = "";

            data.fotos.forEach(foto => {
                const row = fotosTable.insertRow();
                row.innerHTML = `
                    <td><img src="${foto.url}" alt="Foto" width="100"></td>
                    <td>${foto.estado}</td>
                    <td>
                        <button onclick="validarFoto('${foto.id}', 'admitida', '${concurso_id}')">Admitir</button>
                        <button onclick="validarFoto('${foto.id}', 'rechazada', '${concurso_id}')">Rechazar</button>

                    </td>
                `;
            });
        }
    } catch (error) {
        console.error("Error al cargar fotos:", error);
    }
}

async function validarFoto(id, estado, concurso_id) {
    try {
        const response = await fetch("../backend/api/validar_foto.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, estado })
        });
        const data = await response.json();
        if (data.success) {
            alert(`Foto ${estado} correctamente.`);
            fotos(concurso_id);
            estadisticas(concurso_id); 

        } else {
            alert("Error al validar foto.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

function cerrar_sesion() {
    localStorage.removeItem("user");
    window.location.href = "index.html";
}
