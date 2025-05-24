document.getElementById("formCrearConcurso").addEventListener("submit", function(e) {
  e.preventDefault();

  const formDato = new FormData(this);
  const data = Object.fromEntries(formDato.entries());

  fetch("../backend/api/crearConcurso.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => res.json())
  .then(respuesta => {
    if (respuesta.success) {
      alert("Concurso creado con éxito");
      window.location.href = "concursos_admin.html";
    } else {
      alert("Error: " + respuesta.message);
    }
  })
  .catch(err => {
    console.error(err);
    alert("Error al crear el concurso.");
  });
});
