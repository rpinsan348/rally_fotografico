<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

if (!isset($_POST["user_id"], $_POST["titulo"], $_POST["descripcion"], $_POST["concurso_id"]) || !isset($_FILES["foto"])) {
    echo json_encode(["success" => false, "message" => "Faltan datos o archivo."]);
    exit;
}

$user_id = intval($_POST["user_id"]);
$titulo = trim($_POST["titulo"]);
$descripcion = trim($_POST["descripcion"]);
$concurso_id = intval($_POST["concurso_id"]);
$foto = $_FILES["foto"];

// Configuracion del concurso seleccionado
$sql = "SELECT plazo_subida, max_fotos, max_tamano_foto FROM concursos WHERE id = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("i", $concurso_id);
$stmt->execute();
$resultado = $stmt->get_result();
$config = $resultado->fetch_assoc();
$stmt->close();

if (!$config) {
    echo json_encode(['success' => false, 'message' => 'Concurso no encontrado.']);
    exit;
}

// Validamos plazo de subida
$plazoSubida = strtotime($config['plazo_subida']);
$fechaActual = time();

if ($fechaActual > $plazoSubida) {
    echo json_encode(['success' => false, 'message' => 'El plazo para subir fotos ha expirado.']);
    exit;
}

$limite_fotos = $config['max_fotos'] ?? 5;

$tamanoMax = (isset($config['max_tamano_foto']) && intval($config['max_tamano_foto']) > 0)
    ? intval($config['max_tamano_foto'])
    : 5 * 1024 * 1024;

$permitidos = ["image/jpeg", "image/png"];

if (!in_array($foto["type"], $permitidos)) {
    echo json_encode(["success" => false, "message" => "Formato no permitido."]);
    exit;
}

if ($foto["size"] > $tamanoMax) {
    $tamMB = round($tamanoMax / (1024 * 1024), 2);
    echo json_encode(["success" => false, "message" => "La imagen supera el tamaño permitido de {$tamMB} MB."]);
    exit;
}

// Cantidad de fotos que ha subido el usuario en un concurso
$stmt = $conexion->prepare("SELECT COUNT(*) FROM fotografias WHERE usuario_id = ? AND concurso_id = ?");
$stmt->bind_param("ii", $user_id, $concurso_id);
$stmt->execute();
$stmt->bind_result($cantidad_fotos);
$stmt->fetch();
$stmt->close();

if ($cantidad_fotos >= $limite_fotos) {
    echo json_encode([
        "success" => false,
        "message" => "❌ Has alcanzado el límite de $limite_fotos fotos permitidas."
    ]);
    exit;
}

$nombreArchivo = uniqid("foto_") . "." . pathinfo($foto["name"], PATHINFO_EXTENSION);
$rutaDestino = "../../uploads/" . $nombreArchivo;

if (!move_uploaded_file($foto["tmp_name"], $rutaDestino)) {
    echo json_encode(["success" => false, "message" => "Error al guardar la imagen."]);
    exit;
}

$stmt = $conexion->prepare("INSERT INTO fotografias (usuario_id, titulo, descripcion, imagen_url, estado, concurso_id) VALUES (?, ?, ?, ?, 'pendiente', ?)");
$stmt->bind_param("isssi", $user_id, $titulo, $descripcion, $nombreArchivo, $concurso_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "✅ Foto subida correctamente. Queda pendiente de revisión."]);
} else {
    echo json_encode(["success" => false, "message" => "❌ Error al guardar en la base de datos."]);
}
?>
