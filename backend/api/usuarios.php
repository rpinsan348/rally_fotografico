<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$sql = "SELECT nombre, email, rol, estado FROM usuarios";

if ($resultado = $conexion->query($sql)) {
    $usuarios = [];

    while ($row = $resultado->fetch_assoc()) {
        $usuarios[] = $row;
    }

    echo json_encode(["success" => true, "usuarios" => $usuarios]);

    $resultado->close();
} else {
    echo json_encode(["success" => false, "message" => "Error al obtener usuarios: " . $conexion->error]);
}

$conexion->close();
?>
