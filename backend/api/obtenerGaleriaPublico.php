<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

if (!isset($_GET['concurso_id']) || !is_numeric($_GET['concurso_id'])) {
    echo json_encode(["success" => false, "message" => "ID de concurso no proporcionado o inválido."]);
    exit;
}

$id_concurso = $_GET['concurso_id'];
$estado = 'admitida';

//Obtenemos las fotos admitidas y el nombre del autor
$stmt = $conexion->prepare("
    SELECT f.id, f.titulo, f.descripcion, f.imagen_url,
           COUNT(v.id) AS votos,
           AVG(v.valor) AS promedio,
           u.nombre AS autor
    FROM fotografias f
    LEFT JOIN votaciones v ON f.id = v.foto_id
    INNER JOIN usuarios u ON f.usuario_id = u.id
    WHERE f.estado = ? AND f.concurso_id = ?
    GROUP BY f.id
    ORDER BY votos DESC
");

if (!$stmt) {
    echo json_encode(["success" => false, "message" => "Error en la consulta a la base de datos."]);
    exit;
}

$stmt->bind_param("si", $estado, $id_concurso);
$stmt->execute();
$resultado = $stmt->get_result();

$fotos = [];
while ($fila = $resultado->fetch_assoc()) {
    $fotos[] = $fila;
}

if (count($fotos) > 0) {
    echo json_encode(["success" => true, "fotos" => $fotos]);
} else {
    echo json_encode(["success" => false, "message" => "No hay fotos admitidas para este concurso."]);
}
?>
