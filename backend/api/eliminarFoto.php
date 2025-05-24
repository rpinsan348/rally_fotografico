<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$dato = json_decode(file_get_contents("php://input"), true);

if (!isset($dato["user_id"], $dato["foto_id"])) {
    echo json_encode(["success" => false, "message" => "Faltan datos."]);
    exit;
}

$user_id = intval($dato["user_id"]);
$foto_id = intval($datdatoa["foto_id"]);

$stmt = $conexion->prepare("SELECT imagen_url, estado FROM fotografias WHERE id = ? AND usuario_id = ?");
$stmt->bind_param("ii", $foto_id, $user_id);
$stmt->execute();
$resultado = $stmt->get_result();

//Si no obtenemos resultado, la foto no pertenece al usuario
if ($resultado->num_rows === 0) {
    echo json_encode(["success" => false, "message" => "No tienes permiso para eliminar esta foto."]);
    exit;
}

$foto = $resultado->fetch_assoc();

if ($foto["estado"] !== "pendiente") {
    echo json_encode(["success" => false, "message" => "Solo puedes eliminar fotos en estado 'pendiente'."]);
    exit;
}

$ruta = "../../uploads/" . $foto["imagen_url"];
//Si existe el archivo, se elimina
if (file_exists($ruta)) {
    unlink($ruta);
}

$stmt = $conexion->prepare("DELETE FROM fotografias WHERE id = ? AND usuario_id = ?");
$stmt->bind_param("ii", $foto_id, $user_id);
$stmt->execute();

echo json_encode(["success" => true, "message" => "✅ Foto eliminada correctamente."]);
?>
