-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-10-2024 a las 22:40:29
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
-- Base de datos: `zombie_plash_bd`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amigos`
--

CREATE TABLE `amigos` (
  `id_amigo` int(11) NOT NULL,
  `id_jugador` int(11) DEFAULT NULL,
  `id_jugador_2` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `amistad`
--

CREATE TABLE `amistad` (
  `id_amistad` int(11) NOT NULL,
  `id_jugador` int(11) DEFAULT NULL,
  `id_amigo` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `invitados`
--

CREATE TABLE `invitados` (
  `id_invitado` int(11) NOT NULL,
  `apodo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugador`
--

CREATE TABLE `jugador` (
  `id_jugador` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `id_credenciales` int(11) DEFAULT NULL,
  `id_registro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugador`
--

INSERT INTO `jugador` (`id_jugador`, `nombre`, `id_credenciales`, `id_registro`) VALUES
(1, 'bscl', NULL, 1),
(2, 'bsl-1', NULL, 6),
(3, 'bscl-2', NULL, 7),
(4, 'bsl-3', NULL, 8),
(5, 'bscl-4', NULL, 9),
(6, 'bscl-5', NULL, 10);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores_en_sala`
--

CREATE TABLE `jugadores_en_sala` (
  `id` int(11) NOT NULL,
  `id_sala` int(11) DEFAULT NULL,
  `id_jugador` int(11) DEFAULT NULL,
  `nombre_jugador` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugadores_en_sala`
--

INSERT INTO `jugadores_en_sala` (`id`, `id_sala`, `id_jugador`, `nombre_jugador`) VALUES
(71, 53, 1, 'bscl'),
(72, 53, 6, 'bscl-5'),
(73, 53, 3, 'bscl-2');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partida`
--

CREATE TABLE `partida` (
  `id_partida` int(11) NOT NULL,
  `fecha_partida` date DEFAULT NULL,
  `ganador` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `perfil`
--

CREATE TABLE `perfil` (
  `id_perfil` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `imagen` blob DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL,
  `tipo_articulo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `poderes`
--

CREATE TABLE `poderes` (
  `id_poderes` int(11) NOT NULL,
  `uso_poder` varchar(255) DEFAULT NULL,
  `estado_poder` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `recuperar_contraseña`
--

CREATE TABLE `recuperar_contraseña` (
  `id_codigo` int(11) NOT NULL,
  `id_registro` int(11) DEFAULT NULL,
  `fecha_inicio` date DEFAULT NULL,
  `fecha_fin` date DEFAULT NULL,
  `codigo` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_usuarios`
--

CREATE TABLE `registro_usuarios` (
  `id_registro` int(11) NOT NULL,
  `nombre` varchar(255) DEFAULT NULL,
  `contraseña` varchar(255) DEFAULT NULL,
  `correo` varchar(255) DEFAULT NULL,
  `estado` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registro_usuarios`
--

INSERT INTO `registro_usuarios` (`id_registro`, `nombre`, `contraseña`, `correo`, `estado`) VALUES
(1, 'bscl', '$2y$10$vGmfIplF7fkVC8HAHDSwp.19i1qeOw6SlDJS0lqQ8ULb55VyoZiwy', 'bscl20062007@gmail.com', NULL),
(2, 'jhon', '$2y$10$Yi5b4dFqPazLcPMhFja0fuoz10TS2QxCN1n4nFBeLswFxYYOE7Pga', 'jhon@d.com', NULL),
(3, 'jhondd', '$2y$10$8gAjzhQMgOjmM0S.c5384Og5wDjmx2.wYH3RPTa0RgfYN5QysIyfG', 'wwww@gmail.co', NULL),
(4, 'bs', '$2y$10$6ZeQlaB2GjNHcoOcumTxTeQSjCgevvpkbzKfnlPG4vEw/gVoXRB/y', 'bsc@gmail.com', NULL),
(5, 'Algericoffe', '$2y$10$pBWGcIM4K5kVe.vzUfwzxu5Zj1PO1iByHDnhrOQccVmaivzxHE6ne', 'jsolayareyes@gmail.com', NULL),
(6, 'bsl-1', '$2y$10$iQU7o1RbOyLG3ie53guOYO8LuPNpXFxc8IT.tAsST0GnmWaOXLfru', 'bscl-1@gmail.com', NULL),
(7, 'bscl-2', '$2y$10$CIr/WjQSTAR02H1Wqs6r/uQLlWrLqY//7fr8FJo/oC49ea7HjTdoO', 'bscl-2@gmail.com', NULL),
(8, 'bsl-3', '$2y$10$Zr6XuSqwJZwWJf3C4gZ.1.yrFU46aWtAkk8sebGEKJi8k92YQaywa', 'bscl-3@gmail.com', NULL),
(9, 'bscl-4', '$2y$10$RncrORRaf/wF8GavdHIMNO2S5BQghk2XmN6/b9j9vDMxBnY/KVG7.', 'bscl-4@gmail.com', NULL),
(10, 'bscl-5', '$2y$10$Pm.KgzjXIutMFVt.0h8d2OgYaez6TYFPiKE7km9CWwv4ZN89Fr1rO', 'bscl-5@gmail.com', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `rol_jugador`
--

CREATE TABLE `rol_jugador` (
  `id_rol_jugador` int(11) NOT NULL,
  `id_participacion` int(11) DEFAULT NULL,
  `tipo_rol` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salas`
--

CREATE TABLE `salas` (
  `id_sala` int(255) NOT NULL,
  `id_creador` int(11) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `max_jugadores` int(11) NOT NULL,
  `jugadores_unidos` int(11) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `salas`
--

INSERT INTO `salas` (`id_sala`, `id_creador`, `contraseña`, `max_jugadores`, `jugadores_unidos`) VALUES
(53, 1, '$2y$10$3Wte5rG5w6Y2Glo6wumr/.IU60k4GHN42o.nE1o1Raab9p9ShKTx.', 2, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_seleccion`
--

CREATE TABLE `tipo_seleccion` (
  `id_tipo_seleccion` int(11) NOT NULL,
  `id_perfil` int(11) DEFAULT NULL,
  `id_jugador` int(11) DEFAULT NULL,
  `uso_articulo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amigos`
--
ALTER TABLE `amigos`
  ADD PRIMARY KEY (`id_amigo`);

--
-- Indices de la tabla `amistad`
--
ALTER TABLE `amistad`
  ADD PRIMARY KEY (`id_amistad`),
  ADD KEY `id_jugador` (`id_jugador`),
  ADD KEY `id_amigo` (`id_amigo`);

--
-- Indices de la tabla `invitados`
--
ALTER TABLE `invitados`
  ADD PRIMARY KEY (`id_invitado`);

--
-- Indices de la tabla `jugador`
--
ALTER TABLE `jugador`
  ADD PRIMARY KEY (`id_jugador`),
  ADD UNIQUE KEY `id_registro` (`id_registro`),
  ADD UNIQUE KEY `id_credenciales` (`id_credenciales`);

--
-- Indices de la tabla `jugadores_en_sala`
--
ALTER TABLE `jugadores_en_sala`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_sala` (`id_sala`),
  ADD KEY `id_jugador` (`id_jugador`);

--
-- Indices de la tabla `partida`
--
ALTER TABLE `partida`
  ADD PRIMARY KEY (`id_partida`);

--
-- Indices de la tabla `perfil`
--
ALTER TABLE `perfil`
  ADD PRIMARY KEY (`id_perfil`);

--
-- Indices de la tabla `poderes`
--
ALTER TABLE `poderes`
  ADD PRIMARY KEY (`id_poderes`);

--
-- Indices de la tabla `recuperar_contraseña`
--
ALTER TABLE `recuperar_contraseña`
  ADD PRIMARY KEY (`id_codigo`),
  ADD KEY `fk_id_registro` (`id_registro`);

--
-- Indices de la tabla `registro_usuarios`
--
ALTER TABLE `registro_usuarios`
  ADD PRIMARY KEY (`id_registro`);

--
-- Indices de la tabla `rol_jugador`
--
ALTER TABLE `rol_jugador`
  ADD PRIMARY KEY (`id_rol_jugador`),
  ADD KEY `fk_id_participacion` (`id_participacion`);

--
-- Indices de la tabla `tipo_seleccion`
--
ALTER TABLE `tipo_seleccion`
  ADD PRIMARY KEY (`id_tipo_seleccion`),
  ADD KEY `fk_id_perfil` (`id_perfil`),
  ADD KEY `fk_id_jugador` (`id_jugador`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `invitados`
--
ALTER TABLE `invitados`
  MODIFY `id_invitado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `jugador`
--
ALTER TABLE `jugador`
  MODIFY `id_jugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `jugadores_en_sala`
--
ALTER TABLE `jugadores_en_sala`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT de la tabla `registro_usuarios`
--
ALTER TABLE `registro_usuarios`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amistad`
--
ALTER TABLE `amistad`
  ADD CONSTRAINT `amistad_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `jugador` (`id_jugador`),
  ADD CONSTRAINT `amistad_ibfk_2` FOREIGN KEY (`id_amigo`) REFERENCES `jugador` (`id_jugador`);

--
-- Filtros para la tabla `jugador`
--
ALTER TABLE `jugador`
  ADD CONSTRAINT `fk_jugador_registro` FOREIGN KEY (`id_registro`) REFERENCES `registro_usuarios` (`id_registro`),
  ADD CONSTRAINT `jugador_ibfk_1` FOREIGN KEY (`id_registro`) REFERENCES `registro_usuarios` (`id_registro`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `jugador_ibfk_2` FOREIGN KEY (`id_credenciales`) REFERENCES `invitados` (`id_invitado`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `jugadores_en_sala`
--
ALTER TABLE `jugadores_en_sala`
  ADD CONSTRAINT `jugadores_en_sala_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`),
  ADD CONSTRAINT `jugadores_en_sala_ibfk_2` FOREIGN KEY (`id_jugador`) REFERENCES `jugador` (`id_jugador`);

--
-- Filtros para la tabla `recuperar_contraseña`
--
ALTER TABLE `recuperar_contraseña`
  ADD CONSTRAINT `fk_id_registro` FOREIGN KEY (`id_registro`) REFERENCES `registro_usuarios` (`id_registro`);

--
-- Filtros para la tabla `rol_jugador`
--
ALTER TABLE `rol_jugador`
  ADD CONSTRAINT `fk_id_participacion` FOREIGN KEY (`id_participacion`) REFERENCES `partida` (`id_partida`);

--
-- Filtros para la tabla `tipo_seleccion`
--
ALTER TABLE `tipo_seleccion`
  ADD CONSTRAINT `fk_id_jugador` FOREIGN KEY (`id_jugador`) REFERENCES `jugador` (`id_jugador`),
  ADD CONSTRAINT `fk_id_perfil` FOREIGN KEY (`id_perfil`) REFERENCES `perfil` (`id_perfil`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
