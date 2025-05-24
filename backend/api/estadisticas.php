<?php
header('Content-Type: application/json');
include "../../config/conexion.php";

$concurso_id = isset($_GET['concurso_id']) ? intval($_GET['concurso_id']) : 0;
if ($concurso_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Concurso ID inválido.']);
    exit;
}

try {
    if ($conexion->connect_error) {
        throw new Exception("Error de conexión: " . $conexion->connect_error);
    }

    $base_url = "../uploads/";

    //Total de fotos
    $resultado = $conexion->query("SELECT COUNT(*) as total_fotos FROM fotografias WHERE concurso_id = $concurso_id");
    if ($resultado) {
        $totalFotos = $resultado->fetch_assoc()['total_fotos'];
    } else {
        throw new Exception("Error al obtener el total de fotos: " . $conexion->error);
    }

    // Fotos admitidas y rechazadas
    $resultado = $conexion->query("SELECT 
    SUM(estado = 'admitida') AS admitidas,
    SUM(estado = 'rechazada') AS rechazadas
FROM fotografias
WHERE concurso_id = $concurso_id");


    if ($resultado) {
        $validadas = $resultado->fetch_assoc();
        $validadas['admitidas'] = $validadas['admitidas'] ?? 0;
        $validadas['rechazadas'] = $validadas['rechazadas'] ?? 0;
    } else {
        throw new Exception("Error al obtener las fotos admitidas y rechazadas: " . $conexion->error);
    }

    // Participantes que han subido fotos
    $resultado = $conexion->query("SELECT COUNT(DISTINCT usuario_id) AS participantes_activos 
    FROM fotografias
    WHERE concurso_id = $concurso_id");

if ($resultado) {
        $activos = $resultado->fetch_assoc()['participantes_activos'];
    } else {
        throw new Exception("Error al obtener participantes activos: " . $conexion->error);
    }

    // Top 5 fotos mas votadas
    $resultado = $conexion->query("SELECT f.imagen_url, COUNT(v.id) AS votos 
    FROM votaciones v 
    JOIN fotografias f ON f.id = v.foto_id
    WHERE f.concurso_id = $concurso_id
    GROUP BY v.foto_id 
    ORDER BY votos DESC 
    LIMIT 5");

    if ($resultado) {
        $topFotos = [];
        while ($row = $resultado->fetch_assoc()) {
            $row['url'] = $base_url . $row['imagen_url'];
            unset($row['imagen_url']);
            $topFotos[] = $row;
        }
    } else {
        throw new Exception("Error al obtener las fotos más votadas: " . $conexion->error);
    }

    echo json_encode([
        'success' => true,
        'total_fotos' => $totalFotos,
        'admitidas' => $validadas['admitidas'],
        'rechazadas' => $validadas['rechazadas'],
        'participantes_activos' => $activos,
        'top_fotos' => $topFotos
    ]);

    $resultado->free();

} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}

$conexion->close();
?>
