<?php
include __DIR__ . "/../../config/conexion.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = trim($_POST["nombre"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST["password"]);
    $rol = trim($_POST["rol"]);
    $estado = "pendiente"; 

    if (empty($nombre) || empty($email) || empty($password) || empty($rol)) {
        echo json_encode(["success" => false, "message" => "Todos los campos son obligatorios."]);
        exit();
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(["success" => false, "message" => "Correo inválido."]);
        exit();
    }

    if ($rol !== "admin" && $rol !== "participante") {
        echo json_encode(["success" => false, "message" => "Rol no válido."]);
        exit();
    }

    //Encriptamos la contraseña
    $password_hash = password_hash($password, PASSWORD_BCRYPT);

    $stmt = $conexion->prepare("SELECT id FROM usuarios WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        echo json_encode(["success" => false, "message" => "Este correo ya está registrado."]);
        exit();
    }

    $stmt->close();

    $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, email, password, rol, estado) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $nombre, $email, $password_hash, $rol, $estado);

    if ($stmt->execute()) {
        echo json_encode([
            "success" => true,
            "message" => "Registro enviado. Espera aprobación del administrador."
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Error al registrar el usuario."]);
    }

    $stmt->close();
    $conexion->close();
}
?>
