// Variable en la que vamos a almacenar los concursos
let concursosGlobal = [];

document.addEventListener("DOMContentLoaded", () => {
  // Obtenemos la lista de los concursos
  fetch("../backend/api/obtenerConcursos.php")
    .then(res => res.json())
    .then(dato => {
      const contenedor = document.getElementById("listaConcursos");

      if (!dato.success || dato.concursos.length === 0) {
        contenedor.innerHTML = "<p>No hay concursos registrados.</p>";
        return;
      }
      // Guardamos los concursos
      concursosGlobal = dato.concursos;

      //Los recorremos y creamos elementos HTML para cada uno de ellos
      dato.concursos.forEach(concurso => {
        const div = document.createElement("div");
        div.className = "concurso";
        div.innerHTML = `
          <h3>${concurso.nombre}</h3>
          <p>${concurso.descripcion}</p>
          <p><strong>Inicio:</strong> ${concurso.fecha_inicio}</p>
          <p><strong>Fin:</strong> ${concurso.fecha_fin}</p>
          <p><strong>Estado:</strong> ${concurso.estado}</p>
          <button class="btn-seleccionar" data-id="${concurso.id}">Gestionar</button>
        `;
        contenedor.appendChild(div);
      });

      // Añadimos eventos a los botones de Gestionar
      document.querySelectorAll(".btn-seleccionar").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-id");
          seleccionarConcurso(id); //Llamamos a la funcion para elimimnar el concurso que hemos seleccionado
        });
      });
    })
    .catch(err => {
      console.error(err);
      document.getElementById("listaConcursos").textContent = "No se pudieron cargar los concursos.";
    });

  // Evento para el boton de mostrar selector para eliminar
  const btnEliminar = document.getElementById("btnEliminar");
  if (btnEliminar) {
    btnEliminar.addEventListener("click", mostrarSelectorEliminar);
  }

  // Evento para el boton de confirmar eliminacion
  const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");
  if (btnConfirmarEliminar) {
    btnConfirmarEliminar.addEventListener("click", confirmarEliminacion);
  }
});

function seleccionarConcurso(id) {
  localStorage.setItem("concurso_admin_id", id);
  window.location.href = "admin.html";
}

// Ocultar o mostrar el selector para eliminar
function mostrarSelectorEliminar() {
  const selector = document.getElementById("selectorEliminar");
  const select = document.getElementById("concursoAEliminar");

  // Si esta visible, lo oculta
  if (selector.style.display === "block") {
    selector.style.display = "none";
    return;
  }

  // Si no está visible, lo muestra y carga las opciones
  select.innerHTML = `<option value="">-- Selecciona un concurso --</option>`;

  // Rellenamos el select
  concursosGlobal.forEach(concurso => {
    const option = document.createElement("option");
    option.value = concurso.id;
    option.textContent = concurso.nombre;
    select.appendChild(option);
  });

  selector.style.display = "block";
}


function confirmarEliminacion() {
  const id = document.getElementById("concursoAEliminar").value;
  if (!id) {
    alert("Por favor, selecciona un concurso.");
    return;
  }

  const confirmado = confirm("¿Estás seguro de que deseas eliminar este concurso?");
  if (!confirmado) return;

  fetch(`../backend/api/eliminarConcurso.php?id=${id}`, {
    method: "DELETE"
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Concurso eliminado correctamente.");

        // Eliminamos el concurso de la lista
        const lista = document.getElementById("listaConcursos");
        const items = lista.querySelectorAll(".concurso");

        items.forEach(item => {
          const btn = item.querySelector(".btn-seleccionar");
          if (btn && btn.dataset.id === id) {
            item.remove();
          }
        });

        // Eliminamos del selector
        const optionToRemove = document.querySelector(`#concursoAEliminar option[value="${id}"]`);
        if (optionToRemove) {
          optionToRemove.remove();
        }

        // Actualizamos el array
        concursosGlobal = concursosGlobal.filter(concurso => concurso.id !== parseInt(id));

        // Ocultamos el selector
        document.getElementById("selectorEliminar").style.display = "none";
      } else {
        alert("Error al eliminar el concurso.");
      }
    })
    .catch(err => {
      console.error(err);
      alert("Hubo un error al intentar eliminar el concurso.");
    });
}

