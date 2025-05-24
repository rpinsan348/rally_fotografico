<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

// Recibimos los datos enviados desde el frontend en formato JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"]) || !isset($data["newRole"])) {
    echo json_encode(["success" => false, "message" => "Faltan datos obligatorios."]);
    exit();
}

$email = $data["email"];
$nuevoRol = $data["newRole"];

$stmt = $conexion->prepare("UPDATE usuarios SET rol = ? WHERE email = ?");
// Asocia los parámetros a la consulta, ambos campos como cadenas string(ss)
$stmt->bind_param("ss", $nuevoRol, $email);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Rol actualizado correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar el rol."]);
}

$stmt->close();
$conexion->close();
