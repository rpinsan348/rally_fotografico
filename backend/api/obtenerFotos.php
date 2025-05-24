<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$user_id = $_GET['user_id'] ?? null;
$concurso_id = $_GET['concurso_id'] ?? null;

if (!$user_id || !$concurso_id) {
    echo json_encode(["success" => false, "message" => "Faltan parámetros."]);
    exit;
}

$stmt = $conexion->prepare("
    SELECT f.id, f.titulo, f.imagen_url, f.estado
    FROM fotografias f
    WHERE f.usuario_id = ? AND f.concurso_id = ?
");

$stmt->bind_param("ii", $user_id, $concurso_id);
$stmt->execute();
$resultado = $stmt->get_result();

$fotos = [];
while ($row = $resultado->fetch_assoc()) {
    $fotos[] = [
        "id" => $row["id"],
        "titulo" => $row["titulo"],
        "imagen_url" => $row["imagen_url"],
        "estado" => $row["estado"]
    ];
}

if (count($fotos) > 0) {
    echo json_encode(["success" => true, "fotos" => $fotos]);
} else {
    echo json_encode(["success" => false, "message" => "No tienes fotos subidas."]);
}
?>
