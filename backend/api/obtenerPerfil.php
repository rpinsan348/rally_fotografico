<?php
include "../../config/conexion.php";

if (!isset($_GET["id"])) {
    echo json_encode(["error" => "Falta ID"]);
    exit;
}

$id = intval($_GET["id"]);
$stmt = $conexion->prepare("SELECT nombre, email FROM usuarios WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$resultado = $stmt->get_result();

if ($user = $resultado->fetch_assoc()) {
    echo json_encode($user);
} else {
    echo json_encode(["error" => "Usuario no encontrado"]);
}

?>