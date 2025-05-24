<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$data = json_decode(file_get_contents("php://input"), true);
$usuario_id = intval($data["usuario_id"]);
$foto_id = intval($data["fotografia_id"]);
$valor = intval($data["valor"]);
$ip_votante = $_SERVER['REMOTE_ADDR'];

if (!$usuario_id || !$foto_id) {
    echo json_encode(["success" => false, "message" => "Datos incompletos."]);
    exit;
}

// Verificamos que la foto no sea del usuario logueado
$stmt = $conexion->prepare("SELECT usuario_id FROM fotografias WHERE id = ?");
$stmt->bind_param("i", $foto_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "La foto no existe."]);
    exit;
}

$foto = $res->fetch_assoc();

if ($foto["usuario_id"] == $usuario_id) {
    echo json_encode(["success" => false, "message" => "No puedes votar tu propia foto."]);
    exit;
}

// Verificamos si ya hemos votado esta foto por IP o usuario_id
$stmtCheck = $conexion->prepare("SELECT id FROM votaciones WHERE foto_id = ? AND (usuario_id = ? OR ip_votante = ?)");
$stmtCheck->bind_param("iis", $foto_id, $usuario_id, $ip_votante);
$stmtCheck->execute();
$resCheck = $stmtCheck->get_result();

if ($resCheck->num_rows > 0) {
    echo json_encode(["success" => false, "message" => "Ya has votado esta foto desde esta cuenta o IP."]);
    exit;
}

$stmtInsert = $conexion->prepare("INSERT INTO votaciones (foto_id, usuario_id, ip_votante, valor) VALUES (?, ?, ?, ?)");
$stmtInsert->bind_param("iisi", $foto_id, $usuario_id, $ip_votante, $valor);

if ($stmtInsert->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Error al registrar el voto."]);
}
?>
