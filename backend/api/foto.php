<?php
header('Content-Type: application/json');
include "../../config/conexion.php"; 

$base_url = "../uploads/";

$concurso_id = isset($_GET['concurso_id']) ? intval($_GET['concurso_id']) : 0;

if ($concurso_id <= 0) {
    echo json_encode(["success" => false, "message" => "Concurso ID inválido"]);
    exit;
}

$sql = "SELECT id, imagen_url AS url, estado FROM fotografias WHERE estado = 'pendiente' AND concurso_id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $concurso_id);
$stmt->execute();
$resultado = $stmt->get_result();

//Almacenamos las fotos
$fotos = [];
while ($row = $resultado->fetch_assoc()) {
    $row['url'] = $base_url . $row['url'];
    $fotos[] = $row;
}

echo json_encode(["success" => true, "fotos" => $fotos]);
$stmt->close();
$conexion->close();