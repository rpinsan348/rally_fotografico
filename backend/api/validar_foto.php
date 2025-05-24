<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["id"]) || !isset($data["estado"])) {
    echo json_encode(["success" => false, "message" => "Faltan datos obligatorios."]);
    exit();
}

$id = intval($data["id"]);
$estado = $data["estado"];

$stmt = $conexion->prepare("UPDATE fotografias SET estado = ? WHERE id = ?");
$stmt->bind_param("si", $estado, $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Estado actualizado correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar el estado.", "error" => $stmt->error]);
}

$stmt->close();
$conexion->close();
