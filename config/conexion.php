<?php
$host = "localhost";
$username = "root";
$password = "";
$dbname = "rally_fotografico";

$conexion = new mysqli($host, $username, $password, $dbname);

if ($conexion->connect_error) {
    die("Conexión fallida: " . $conexion->connect_error);
} 
?>
