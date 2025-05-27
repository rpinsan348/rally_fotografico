document.addEventListener("DOMContentLoaded", () => {
    // Año actual
    document.getElementById("year").textContent = new Date().getFullYear();

    fetch("../backend/api/obtenerConcursos.php")
        .then(res => res.json())
        .then(data => {
            // Obtenemos los concursoso activos y cerrados
            const listaActivos = document.getElementById("listaConcursosActivos");
            const listaCerrados = document.getElementById("listaConcursosCerrados");
            listaActivos.innerHTML = "";
            listaCerrados.innerHTML = "";

            // Verificamos que contenga concursos
            if (data.success && data.concursos.length > 0) {
                // Filtramos los concursos por estado
                const activos = data.concursos.filter(c => c.estado === "activo");
                const cerrados = data.concursos.filter(c => c.estado === "cerrado");

                // Mostramos los concursos activos
                if (activos.length > 0) {
                    activos.forEach(c => {
                        const div = document.createElement("div");
                        // Estilos
                        div.style.marginBottom = "15px";
                        div.style.border = "1px solid #ccc";
                        div.style.padding = "10px";
                        div.style.borderRadius = "8px";
                        div.style.backgroundColor = "#f4f4f4";

                        const nombre = document.createElement("h4");
                        nombre.textContent = c.nombre;

                        const descripcion = document.createElement("p");
                        descripcion.textContent = c.descripcion;

                        const fechas = document.createElement("p");
                        fechas.innerHTML = `<strong>Inicio:</strong> ${c.fecha_inicio} &nbsp;&nbsp; <strong>Fin:</strong> ${c.fecha_fin}`;

                        // Boton para ver la galeria del concurso
                        const btn = document.createElement("button");
                        btn.textContent = "Ver galería";
                        btn.style.marginTop = "10px";
                        //Guardamos en localStorage el concurso y redirigimos a galeriaPublico
                        btn.onclick = () => {
                            localStorage.setItem("concurso", JSON.stringify(c));
                            window.location.href = "galeriaPublico.html";
                        };

                        div.appendChild(nombre);
                        div.appendChild(descripcion);
                        div.appendChild(fechas);
                        div.appendChild(btn);

                        listaActivos.appendChild(div);
                    });
                } else {
                    listaActivos.innerHTML = "<p>No hay concursos activos en este momento.</p>";
                }

                // Mostramos los concursos cerrados
                if (cerrados.length > 0) {
                    cerrados.forEach(c => {
                        const div = document.createElement("div");
                        div.style.marginBottom = "15px";
                        div.style.border = "1px solid #ccc";
                        div.style.padding = "10px";
                        div.style.borderRadius = "8px";
                        div.style.backgroundColor = "#e6e6e6";

                        const nombre = document.createElement("h4");
                        nombre.textContent = c.nombre;

                        const descripcion = document.createElement("p");
                        descripcion.textContent = c.descripcion;

                        const fechas = document.createElement("p");
                        fechas.innerHTML = `<strong>Inicio:</strong> ${c.fecha_inicio} &nbsp;&nbsp; <strong>Fin:</strong> ${c.fecha_fin}`;

                        //Concursos cerrados
                        const cerradoT = document.createElement("p");
                        cerradoT.textContent = "Concurso cerrado";
                        cerradoT.style.color = "red";

                        //Boton para ver la galeria
                        const btn = document.createElement("button");
                        btn.textContent = "Ver galería";
                        btn.style.marginTop = "10px";
                        btn.onclick = () => {
                            localStorage.setItem("concurso", JSON.stringify(c));
                            window.location.href = "galeriaPublico.html";
                        };

                        div.appendChild(cerradoT);
                        div.appendChild(nombre);
                        div.appendChild(descripcion);
                        div.appendChild(fechas);
                        div.appendChild(btn);

                        listaCerrados.appendChild(div);
                    });
                } else {
                    listaCerrados.innerHTML = "<p>No hay concursos cerrados en este momento.</p>";
                }
            } else {
                listaActivos.innerHTML = "<p>No se encontraron concursos disponibles.</p>";
                listaCerrados.innerHTML = "<p>No se encontraron concursos cerrados.</p>";
            }
        })
        .catch(err => {
            console.error(err);
            document.getElementById("listaConcursosActivos").innerHTML = "<p>Error al cargar concursos activos.</p>";
            document.getElementById("listaConcursosCerrados").innerHTML = "<p>Error al cargar concursos cerrados.</p>";
        });


});
