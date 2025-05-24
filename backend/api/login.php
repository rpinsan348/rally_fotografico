<?php
include __DIR__ . "/../../config/conexion.php"; 

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Faltan datos']);
    exit();
}

$email = $data['email'];
$password = $data['password'];

$stmt = $conexion->prepare("SELECT * FROM usuarios WHERE email = ? LIMIT 1");
$stmt->bind_param("s", $email);
$stmt->execute();
$resultado = $stmt->get_result();

if ($resultado->num_rows > 0) {
    $user = $resultado->fetch_assoc();

    if ($user['estado'] === 'rechazado') {
        echo json_encode(['success' => false, 'message' => 'Tu cuenta ha sido rechazada.']);
        exit();
    } elseif ($user['estado'] !== 'aprobado') {
        echo json_encode(['success' => false, 'message' => 'Tu cuenta aún no ha sido aprobada por el administrador.']);
        exit();
    }
    

    if (password_verify($password, $user['password'])) {
        // Eliminamos la contraseña antes de enviarlo al cliente
        unset($user['password']);
        echo json_encode(['success' => true, 'message' => 'Login exitoso', 'user' => $user]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Contraseña incorrecta']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
}
?>
