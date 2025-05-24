<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

// Recibimos los datos enviados desde el frontend en formato JSON
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['concurso_id'], $data['nombre'], $data['descripcion'], $data['fechaInicio'], $data['fechaFin'], $data['plazoSubida'], $data['limiteFotos'], $data['plazoVotacion'], $data['maxTamanoFoto'])) {
    echo json_encode(["success" => false, "message" => "Faltan datos"]);
    exit;
}

$concurso_id = intval($data['concurso_id']);
$nombre = $data['nombre'];
$descripcion = $data['descripcion'];
//Convertimos fechas  de tipo texto a formato SQL DATETIME
$fecha_inicio = date("Y-m-d H:i:s", strtotime($data['fechaInicio']));
$fecha_fin = date("Y-m-d H:i:s", strtotime($data['fechaFin']));
$plazo_subida = date("Y-m-d H:i:s", strtotime($data['plazoSubida']));
$limite_fotos = intval($data['limiteFotos']);
$plazo_votacion = date("Y-m-d H:i:s", strtotime($data['plazoVotacion']));
$max_tamano_foto = intval($data['maxTamanoFoto']) * 1048576; // Convertir MB a bytes


// Verificar si el concurso existe
$verificarConcurso = $conexion->prepare("SELECT id FROM concursos WHERE id = ?");
$verificarConcurso->bind_param("i", $concurso_id);
$verificarConcurso->execute();
$resultado = $verificarConcurso->get_result();

if ($resultado->num_rows > 0) {
    // El concurso existe, entonces actualizamos la configuración
    $sql = "UPDATE concursos 
            SET nombre = ?, descripcion = ?, fecha_inicio = ?, fecha_fin = ?, plazo_subida = ?, plazo_votacion = ?, max_fotos = ? , max_tamano_foto = ?
            WHERE id = ?";

    if ($stmt = $conexion->prepare($sql)) {
        $stmt->bind_param("ssssssiii", $nombre, $descripcion, $fecha_inicio, $fecha_fin, $plazo_subida, $plazo_votacion, $limite_fotos, $max_tamano_foto, $concurso_id);

        if ($stmt->execute()) {
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al ejecutar la consulta: " . $stmt->error]);
        }
        $stmt->close();
    } else {
        echo json_encode(["success" => false, "message" => "Error al preparar la consulta."]);
    }
} else {
    echo json_encode(["success" => false, "message" => "No se encontró el concurso con el ID especificado."]);
}

$verificarConcurso->close();
$conexion->close();
?>
