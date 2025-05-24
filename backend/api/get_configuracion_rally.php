<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

if (!isset($_GET['concurso_id'])) {
    echo json_encode(["success" => false, "message" => "Falta concurso_id"]);
    exit;
}

$concurso_id = intval($_GET['concurso_id']);

$sql = "SELECT nombre, descripcion, fecha_inicio, fecha_fin, plazo_subida, plazo_votacion, max_fotos , max_tamano_foto
        FROM concursos 
        WHERE id = ?";

$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $concurso_id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($row = $resultado->fetch_assoc()) {
    $row['max_tamano_foto'] = intval($row['max_tamano_foto']) / 1048576; // Convertimos de bytes a MB
    echo json_encode(["success" => true, "config" => $row]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontró el concurso"]);
}

$stmt->close();
$conexion->close();
