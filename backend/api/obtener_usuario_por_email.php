<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

if (!isset($_GET['email'])) {
    echo json_encode(["success" => false, "message" => "Email no especificado."]);
    exit;
}

$email = $_GET['email'];

$stmt = $conexion->prepare("SELECT nombre, email, rol, estado FROM usuarios WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();

$resultado = $stmt->get_result();

if ($resultado && $resultado->num_rows > 0) {
    $user = $resultado->fetch_assoc();
    echo json_encode(["success" => true, "user" => $user]);
} else {
    echo json_encode(["success" => false, "message" => "Usuario no encontrado."]);
}

$stmt->close();
$conexion->close();
?>
