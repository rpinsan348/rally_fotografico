-- Crear la base de datos
CREATE DATABASE rally_fotografico;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'participante') DEFAULT 'participante',
    estado ENUM('pendiente', 'aprobado') DEFAULT 'pendiente',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de concursos
CREATE TABLE concursos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha_inicio DATETIME,
    fecha_fin DATETIME,
    plazo_subida DATETIME,
    plazo_votacion DATETIME,
    max_fotos INT DEFAULT 5,
    max_tamano_foto INT DEFAULT 5242880 
);

-- Tabla de fotografías
CREATE TABLE fotografias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    concurso_id INT NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255) NOT NULL,
    estado ENUM('pendiente', 'admitida', 'rechazada') DEFAULT 'pendiente',
    fecha_subida TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (concurso_id) REFERENCES concursos(id) ON DELETE CASCADE
);

-- Tabla de votaciones
CREATE TABLE votaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    foto_id INT NOT NULL,
    usuario_id INT NOT NULL,
    valor INT NOT NULL, 
    fecha_voto TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (foto_id) REFERENCES fotografias(id) ON DELETE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE (usuario_id, foto_id) 
);
