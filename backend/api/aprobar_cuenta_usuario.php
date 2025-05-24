<?php
include __DIR__ . "/../../config/conexion.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["email"])) {
    echo json_encode(["success" => false, "message" => "Falta el email."]);
    exit();
}

$email = $data["email"];

$stmt = $conexion->prepare("UPDATE usuarios SET estado = 'aprobado' WHERE email = ?");
$stmt->bind_param("s", $email);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Usuario aprobado."]);
} else {
    echo json_encode(["success" => false, "message" => "Error al aprobar usuario."]);
}
