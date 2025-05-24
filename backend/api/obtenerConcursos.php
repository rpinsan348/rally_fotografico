<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$hoy = date('Y-m-d');

$stmt = $conexion->prepare("SELECT id, nombre, descripcion, fecha_inicio, fecha_fin , plazo_subida, plazo_votacion, max_fotos  FROM concursos ORDER BY fecha_inicio ASC");
$stmt->execute();
$resultado = $stmt->get_result();

$concursos = [];
while ($row = $resultado->fetch_assoc()) {
    // Vemos el estado del concurso segun su fecha actual
    $estado = ($hoy >= $row["fecha_inicio"] && $hoy <= $row["fecha_fin"]) ? "activo" : "cerrado";

    $concursos[] = [
        "id" => $row["id"],
        "nombre" => $row["nombre"],
        "descripcion" => $row["descripcion"],
        "fecha_inicio" => $row["fecha_inicio"],
        "fecha_fin" => $row["fecha_fin"],
        "plazo_subida" => $row["plazo_subida"],
        "plazo_votacion" => $row["plazo_votacion"],
        "max_fotos" => $row["max_fotos"],
        "estado" => $estado
    ];
}

if (count($concursos) > 0) {
    echo json_encode(["success" => true, "concursos" => $concursos]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontraron concursos."]);
}
?>
