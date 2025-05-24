<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["nombre"], $data["descripcion"], $data["fecha_inicio"], $data["fecha_fin"])) {
    echo json_encode(["success" => false, "message" => "Faltan campos requeridos."]);
    exit;
}

$stmt = $conexion->prepare("INSERT INTO concursos (nombre, descripcion, fecha_inicio, fecha_fin) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $data["nombre"], $data["descripcion"], $data["fecha_inicio"], $data["fecha_fin"]);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al insertar el concurso."]);
}
