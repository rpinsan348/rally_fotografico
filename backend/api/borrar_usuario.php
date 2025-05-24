<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"])) {
    echo json_encode(["success" => false, "message" => "Falta el email."]);
    exit();
}

$email = $data["email"];

$stmt = $conexion->prepare("DELETE FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario eliminado correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al eliminar el usuario.", "error" => $stmt->error]);
}

$stmt->close();
$conexion->close();
