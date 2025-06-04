-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-06-2025 a las 16:53:32
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `rally_fotografico`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `concursos`
--

CREATE TABLE `concursos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `plazo_subida` date DEFAULT NULL,
  `plazo_votacion` date DEFAULT NULL,
  `max_fotos` int(11) DEFAULT 5,
  `max_tamano_foto` int(11) DEFAULT 5242880
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `concursos`
--

INSERT INTO `concursos` (`id`, `nombre`, `descripcion`, `fecha_inicio`, `fecha_fin`, `plazo_subida`, `plazo_votacion`, `max_fotos`, `max_tamano_foto`) VALUES
(8, 'Pasión y Gloria', 'En este concurso podrás ver y participar en una galería de fotos única de la esencia de Andalucía', '2025-05-27', '2025-06-17', '2025-06-10', '2025-06-17', 4, 2097152),
(9, 'Paisajes con olor a verano..', 'Captura la esencia del verano a través de paisajes que transmitan calor, color y libertad. Comparte tu mejor foto y participa en esta galería estacional.', '2025-05-27', '2025-06-02', '2025-05-31', '2025-06-01', 5, 5242880),
(10, 'Atardeceres', 'Participa con tus mejores fotos de atardeceres y muestra cómo el día se despide con luz, color y emoción. ¡Cada puesta de sol cuenta una historia!', '2025-05-27', '2025-06-22', '2025-06-15', '2025-06-22', 4, 5242880);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `fotografias`
--

CREATE TABLE `fotografias` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `titulo` varchar(255) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen_url` varchar(255) NOT NULL,
  `estado` enum('pendiente','admitida','rechazada') DEFAULT 'pendiente',
  `fecha_subida` timestamp NOT NULL DEFAULT current_timestamp(),
  `concurso_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `fotografias`
--

INSERT INTO `fotografias` (`id`, `usuario_id`, `titulo`, `descripcion`, `imagen_url`, `estado`, `fecha_subida`, `concurso_id`) VALUES
(63, 25, 'Virgen del Rocío', 'Majestuosa y radiante, la Virgen del Rocío se presenta rodeada de fe y devoción popular. Su rostro sereno y su manto ricamente bordado reflejan la esencia de una tradición mariana profundamente arraigada en el alma andaluza. Una imagen que no solo inspira veneración, sino también identidad, historia y fervor.', 'foto_6835e288852f2.png', 'admitida', '2025-05-27 16:04:24', 8),
(64, 26, 'Paisaje Caribeño', 'Imagen de un precioso paisaje Caribeño', 'foto_6835e53ec7e93.jpg', 'admitida', '2025-05-27 16:15:58', 9),
(65, 27, 'Atardecer en la playa', 'Atardeceres que enamoran en primera línea', 'foto_6835e5953ff97.jpg', 'admitida', '2025-05-27 16:17:25', 10),
(66, 25, 'Gran Poder', 'El rostro del Señor del Gran Poder, sereno y cargado de dolor contenido, transmite una fuerza espiritual que traspasa el tiempo. Tallado en el siglo XVII, su mirada penetrante conmueve a generaciones de fieles que acuden a Él buscando consuelo, esperanza y redención. Una imagen que resume el corazón de la Semana Santa sevillana.', 'foto_683f080916f76.jpg', 'admitida', '2025-06-03 14:34:49', 8),
(67, 26, 'Esperanza de Triana', 'Nuestra Señora de la Esperanza de Triana, una de las imágenes más veneradas de la Semana Santa sevillana. La Virgen aparece con lágrimas en el rostro, vestida con un manto bordado en oro y una corona de orfebrería, adornada con piedras preciosas y detalles florales.', 'foto_683f08ce18499.jpg', 'admitida', '2025-06-03 14:38:06', 8),
(68, 26, 'Tres Caidas', 'La talla muestra a Jesús coronado de espinas, con la cabeza inclinada en gesto de profundo dolor y resignación, mientras cae bajo el peso de la cruz. Su rostro sereno, a pesar del sufrimiento, transmite una mezcla de compasión y entrega. Viste túnica de terciopelo morado ricamente bordada en oro, símbolo de la realeza y el sacrificio. Esta imagen es una de las más veneradas y emblemáticas de la Semana Santa sevillana, saliendo en la madrugada del Viernes Santo.', 'foto_683f09d4af850.jpg', 'admitida', '2025-06-03 14:42:28', 8),
(70, 27, 'Descanso Bajo las Palmeras', 'Descanso en una tumbona frente al mar azul turquesa, protegida por las palmas de un cocotero.', 'foto_683f0cc4cfddd.jpg', 'admitida', '2025-06-03 14:55:00', 9),
(71, 29, 'Costa Salvaje al Atardecer', 'Una playa rocosa y natural iluminada por la suave luz del atardecer. Las palmeras se recortan contra el cielo azul con nubes dispersas, mientras las olas rompen suavemente en la orilla. Esta imagen captura la belleza cruda y tranquila de una costa sin intervención humana, perfecta para quienes buscan una conexión auténtica con la naturaleza.', 'foto_683f0e5d390e8.jpeg', 'admitida', '2025-06-03 15:01:49', 9),
(74, 26, 'Caída del sol', 'Maravillosa caída de sol', 'foto_683f133c4a54c.jpg', 'admitida', '2025-06-03 15:22:36', 10),
(75, 25, 'Atarderes en la playa', 'Maravillosos atardeceres desde el mar', 'foto_683f2788b65e6.jpg', 'admitida', '2025-06-03 16:49:12', 10),
(78, 26, 'Fuego en el Horizonte', 'Un atardecer vibrante con tonos intensos de rojo y naranja que envuelven el cielo mientras el sol se posa justo sobre el mar. Las delgadas nubes negras cruzan el disco solar, creando un efecto dramático e hipnótico.', 'foto_683f2a0725c72.jpg', 'pendiente', '2025-06-03 16:59:51', 10),
(79, 26, 'Luz Dorada sobre las Montañas', 'El sol se despide lentamente detrás de un paisaje montañoso, teñido por un cielo cargado de nubes que reflejan cálidos tonos rojizos y dorados. Una vista serena y profunda que invita a la contemplación.', 'foto_683f2a1f35915.jpg', 'pendiente', '2025-06-03 17:00:15', 10),
(80, 26, 'Magia en el Mar', 'Una puesta de sol espectacular donde el cielo se transforma en una sinfonía de colores morado, rosado, naranja y dorado mientras las olas rompen con fuerza sobre las rocas de la costa. La energía del mar y la belleza del cielo se combinan en una escena inolvidable.', 'foto_683f2a4b2e2f0.jpg', 'pendiente', '2025-06-03 17:00:59', 10),
(87, 27, 'Paraíso Tropical Desierto', 'Una impresionante playa tropical virgen con arena blanca y aguas cristalinas. Rodeada de palmeras y vegetación exuberante, esta escena transmite paz y desconexión total. La tranquilidad del lugar, sin presencia humana, invita a relajarse y disfrutar de la naturaleza en su estado más puro.', 'foto_68404f350cfaf.jpg', 'admitida', '2025-06-04 13:50:45', 9);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` enum('admin','participante') DEFAULT 'participante',
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('pendiente','aprobado','rechazado') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `email`, `password`, `rol`, `fecha_registro`, `estado`) VALUES
(13, 'Marco', 'marco@gmail.com', '$2y$10$i2fq3DRknMypeXGNOK9yKOAV6CnW1jqg7r4eN8yQQ5XejAsn.Frf2', 'admin', '2025-04-14 09:19:22', 'aprobado'),
(25, 'marta', 'marta@gmail.com', '$2y$10$aT9GR15UzGO2OjO2IoNUzuMdQtYdckNXS/Slp0ONgpGjfSxRyZcgG', 'participante', '2025-05-27 16:03:04', 'aprobado'),
(26, 'Pablo', 'pablo@gmail.com', '$2y$10$CuKfpjnR3cCkAkMxcDZQ6O.KmR3G4nhOA3wlDbBbcYG6ye5fY2h7y', 'participante', '2025-05-27 16:07:14', 'aprobado'),
(27, 'Raul', 'raul@gmail.com', '$2y$10$Ufg./i64kRDYbT7XHq9oT.VzJub5sWWbMwa4yNCSa/vKXb/NDoIti', 'participante', '2025-05-27 16:07:36', 'aprobado'),
(29, 'Natalia', 'natalia@gmail.com', '$2y$10$2vqGY/BBvjRapzJYrt4LJuV79G3oF5Qgu5I/I.9W2Zu.cH4OoTLMe', 'participante', '2025-06-03 14:55:38', 'aprobado'),
(30, 'David', 'david@gmail.com', '$2y$10$xtE8612m7RrPDF1RdmEDoeGttMsJlKruBDqpr9og3KOXkOfTHcxDi', 'participante', '2025-06-03 16:45:30', 'aprobado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `votaciones`
--

CREATE TABLE `votaciones` (
  `id` int(11) NOT NULL,
  `foto_id` int(11) NOT NULL,
  `ip_votante` varchar(50) NOT NULL,
  `fecha_voto` timestamp NOT NULL DEFAULT current_timestamp(),
  `usuario_id` int(11) DEFAULT NULL,
  `valor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `votaciones`
--

INSERT INTO `votaciones` (`id`, `foto_id`, `ip_votante`, `fecha_voto`, `usuario_id`, `valor`) VALUES
(58, 63, '::1', '2025-05-27 16:06:05', NULL, 5),
(59, 64, '::1', '2025-05-27 16:18:19', NULL, 4),
(60, 66, '::1', '2025-06-03 14:44:01', NULL, 4),
(61, 67, '::1', '2025-06-03 14:44:33', 25, 5),
(62, 68, '::1', '2025-06-03 14:44:37', 25, 5),
(64, 70, '::1', '2025-06-03 15:04:02', NULL, 2),
(66, 74, '::1', '2025-06-03 15:23:13', NULL, 4),
(67, 65, '::1', '2025-06-03 15:23:19', NULL, 2),
(68, 87, '::1', '2025-06-04 13:54:25', NULL, 3);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `concursos`
--
ALTER TABLE `concursos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `fotografias`
--
ALTER TABLE `fotografias`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `votaciones`
--
ALTER TABLE `votaciones`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unq_usuario_foto` (`usuario_id`,`foto_id`),
  ADD KEY `foto_id` (`foto_id`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `concursos`
--
ALTER TABLE `concursos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `fotografias`
--
ALTER TABLE `fotografias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=88;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `votaciones`
--
ALTER TABLE `votaciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `fotografias`
--
ALTER TABLE `fotografias`
  ADD CONSTRAINT `fotografias_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `votaciones`
--
ALTER TABLE `votaciones`
  ADD CONSTRAINT `fk_votaciones_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `votaciones_ibfk_1` FOREIGN KEY (`foto_id`) REFERENCES `fotografias` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
