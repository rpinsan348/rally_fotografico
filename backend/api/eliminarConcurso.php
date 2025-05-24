<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

if (!isset($_GET["id"])) {
    echo json_encode(["success" => false, "message" => "ID no proporcionado."]);
    exit;
}

$id = intval($_GET["id"]);

$stmt = $conexion->prepare("DELETE FROM concursos WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "No se pudo eliminar el concurso."]);
}
?>
