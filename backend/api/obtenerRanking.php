<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$concurso_id = isset($_GET['concurso_id']) ? intval($_GET['concurso_id']) : 0;
if ($concurso_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Concurso ID inválido']);
    exit;
}

$stmt = $conexion->prepare("
    SELECT f.id, f.titulo, f.imagen_url, 
           COUNT(v.id) AS votos, 
           AVG(v.valor) AS promedio_voto  
    FROM fotografias f
    LEFT JOIN votaciones v ON f.id = v.foto_id
    WHERE f.estado = 'admitida' AND f.concurso_id = ?  
    GROUP BY f.id
    ORDER BY promedio_voto DESC, votos DESC 
");

$stmt->bind_param("i", $concurso_id);
$stmt->execute();
$resultado = $stmt->get_result();

$fotos = [];
while ($row = $resultado->fetch_assoc()) {
    $fotos[] = [
        'id' => $row['id'],
        'titulo' => $row['titulo'],
        'imagen_url' => $row['imagen_url'],
        'votos' => $row['votos'],
        'promedio_voto' => round($row['promedio_voto'], 2)  // Redondeamos a 2 decimales
    ];
}

echo json_encode(['success' => true, 'fotos' => $fotos]);
?>
