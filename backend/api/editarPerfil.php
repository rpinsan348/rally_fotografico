<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

if (!isset($_POST["id"]) || !isset($_POST["nombre"])  || !isset($_POST["email"])) {
    echo json_encode(["success" => false, "message" => "Faltan datos."]);
    exit;
}

$id = intval($_POST["id"]);
//Evita espacios en blancos
$nombre = trim($_POST["nombre"]);
$email = trim($_POST["email"]);
$password = isset($_POST["password"]) && !empty($_POST["password"]) ? password_hash($_POST["password"], PASSWORD_DEFAULT) : null;

if ($password) {
    $stmt = $conexion->prepare("UPDATE usuarios SET nombre=?, email=?, password=? WHERE id=?");
    $stmt->bind_param("sssi", $nombre, $email, $password, $id);
} else {
    $stmt = $conexion->prepare("UPDATE usuarios SET nombre=?, email=? WHERE id=?");
    $stmt->bind_param("ssi", $nombre, $email, $id);
}

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "✅ Perfil actualizado correctamente."]);
} else {
    echo json_encode(["success" => false, "message" => "❌ Error al actualizar."]);
}
?>
