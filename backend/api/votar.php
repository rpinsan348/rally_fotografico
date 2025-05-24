<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$data = json_decode(file_get_contents("php://input"));
$fotoId = $data->fotoId ?? null;
$valor = $data->valor ?? null;
//Obtenemos la IP del usuario que esta votando
$ipVotante = $_SERVER['REMOTE_ADDR'];

if (!$fotoId || !$valor || $valor < 1 || $valor > 5) {
    echo json_encode(['success' => false, 'message' => 'ID de foto o valor de voto no válido.']);
    exit;
}

$stmt = $conexion->prepare("SELECT concurso_id FROM fotografias WHERE id = ?");
$stmt->bind_param("i", $fotoId);
$stmt->execute();
$resultado = $stmt->get_result();
$foto = $resultado->fetch_assoc();

if (!$foto) {
    echo json_encode(['success' => false, 'message' => 'Foto no encontrada']);
    exit;
}

//Guardamos el concurso al que pertenece la foto
$concurso_id = $foto['concurso_id'];

$stmt = $conexion->prepare("SELECT plazo_votacion FROM concursos WHERE id = ?");
$stmt->bind_param("i", $concurso_id);
$stmt->execute();
$resultado = $stmt->get_result();
$concurso = $resultado->fetch_assoc();

if (!$concurso) {
    echo json_encode(['success' => false, 'message' => 'Concurso no encontrado']);
    exit;
}

//Convertimos el plazo de votacion para comparar las fechas
$plazoVotacion = strtotime($concurso['plazo_votacion']);
$fechaActual = time();

if ($fechaActual > $plazoVotacion) {
    echo json_encode(['success' => false, 'message' => 'El plazo para votar ha expirado.']);
    exit;
}

// Verificamos si la IP ya ha votado por esta foto
$stmt = $conexion->prepare("SELECT COUNT(*) AS voto_existente FROM votaciones WHERE foto_id = ? AND ip_votante = ?");
$stmt->bind_param("is", $fotoId, $ipVotante);
$stmt->execute();
$resultado = $stmt->get_result();
$row = $resultado->fetch_assoc();

if ($row['voto_existente'] > 0) {
    echo json_encode(['success' => false, 'message' => 'Ya has votado por esta foto.']);
    exit;
}

$stmt = $conexion->prepare("INSERT INTO votaciones (foto_id, ip_votante, valor) VALUES (?, ?, ?)");
$stmt->bind_param("isi", $fotoId, $ipVotante, $valor);
$stmt->execute();

$stmt = $conexion->prepare("SELECT COUNT(*) AS votos, AVG(valor) AS promedio FROM votaciones WHERE foto_id = ?");
$stmt->bind_param("i", $fotoId); 
$stmt->execute();
$resultado = $stmt->get_result();
$row = $resultado->fetch_assoc();

$promedioVotos = round($row['promedio'], 2);  // Promedio de las puntuaciones

echo json_encode(['success' => true, 'message' => 'Voto registrado correctamente', 'promedio' => $promedioVotos]);
?>
