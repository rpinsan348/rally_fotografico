<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data["oldEmail"]) ||
    !isset($data["nuevoNombre"]) ||
    !isset($data["nuevoEmail"]) ||
    !isset($data["nuevoRol"])
) {
    echo json_encode(["success" => false, "message" => "Faltan datos obligatorios."]);
    exit();
}

//Asignamos los valores recibidos a las variables para utilizarlos en la consulta
$oldEmail = $data["oldEmail"];
$nombre = $data["nuevoNombre"];
$email = $data["nuevoEmail"];
$rol = $data["nuevoRol"];

$stmt = $conexion->prepare("UPDATE usuarios SET nombre = ?, email = ?, rol = ? WHERE email = ?");
$stmt->bind_param("ssss", $nombre, $email, $rol, $oldEmail);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario actualizado correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al actualizar usuario.", "error" => $stmt->error]);
}

$stmt->close();
$conexion->close();
