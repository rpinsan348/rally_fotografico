<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

if (!isset($_GET["concurso_id"])) {
    echo json_encode(["success" => false, "message" => "Falta el ID del concurso."]);
    exit;
}

$concurso_id = intval($_GET["concurso_id"]);

if ($concurso_id <= 0) {
    echo json_encode(["success" => false, "message" => "ID de concurso inválido."]);
    exit;
}

$stmt = $conexion->prepare("
    SELECT f.id, f.titulo, f.imagen_url, f.estado, u.nombre AS autor, f.usuario_id, 
           COUNT(v.valor) AS votos, AVG(v.valor) AS promedio_voto  
    FROM fotografias f
    JOIN usuarios u ON f.usuario_id = u.id
    LEFT JOIN votaciones v ON f.id = v.foto_id
    WHERE f.concurso_id = ? AND f.estado = 'admitida'
    GROUP BY f.id
");

$stmt->bind_param("i", $concurso_id);
$stmt->execute();
$resultado = $stmt->get_result();

$fotos = [];
while ($foto = $resultado->fetch_assoc()) {
    $fotos[] = $foto;
}

if (count($fotos) > 0) {
    echo json_encode(["success" => true, "fotos" => $fotos]);
} else {
    echo json_encode(["success" => false, "message" => "No se encontraron fotos para este concurso."]);
}
?>
