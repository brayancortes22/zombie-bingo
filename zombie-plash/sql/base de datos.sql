-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 09-10-2024 a las 03:22:54
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
-- Base de datos: `zombie_plash`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `codigos_verificacion`
--

CREATE TABLE `codigos_verificacion` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `codigo` varchar(10) NOT NULL,
  `creado_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `expira_en` timestamp NOT NULL DEFAULT current_timestamp(),
  `usado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `invitados`
--

CREATE TABLE `invitados` (
  `id` int(11) NOT NULL,
  `apodo` varchar(50) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores`
--

CREATE TABLE `jugadores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `sala_codigo` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugadores`
--

INSERT INTO `jugadores` (`id`, `nombre`, `sala_codigo`) VALUES
(1, 'pepe', 'a8727d'),
(2, 'pepe', '6bb0b4'),
(3, 'paco', '6bb0b4'),
(4, 'paco', '65ccfe'),
(5, 'paco', '65ccfe'),
(6, 'kkd', 'd7cbe1'),
(7, 'k', 'd7cbe1'),
(8, 'k', '118637'),
(9, 'k', '59f82e'),
(10, 'kgg', '59f82e'),
(11, 'kggkk', '59f82e');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `registro_usuarios`
--

CREATE TABLE `registro_usuarios` (
  `id` int(11) NOT NULL,
  `usuario` varchar(255) NOT NULL,
  `correo` varchar(255) NOT NULL,
  `contraseña` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registro_usuarios`
--

INSERT INTO `registro_usuarios` (`id`, `usuario`, `correo`, `contraseña`) VALUES
(17, 'jhon', 'jhon@d.com', '$2y$10$YdiJ3LBW/4DKhekUc53Z.uztmGASCa1UwCLII3rCIhfVh8PgatH1.'),
(18, 'bscl', 'brayanstidcorteslombana@gmail.com', '$2y$10$gKKOFA.HhlW2Anyh/xDnT.XNMUZ59.jSO9dSQjgn90/j.oPMkEpA6');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salas`
--

CREATE TABLE `salas` (
  `id` int(11) NOT NULL,
  `codigo` varchar(10) DEFAULT NULL,
  `creador` varchar(50) DEFAULT NULL,
  `fecha_creacion` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `salas`
--

INSERT INTO `salas` (`id`, `codigo`, `creador`, `fecha_creacion`) VALUES
(43, 'a8727d', 'dd', '2024-09-27 14:51:59'),
(44, '6bb0b4', 'javi', '2024-09-27 14:57:44'),
(45, '65ccfe', 'javi', '2024-09-27 14:59:32'),
(46, 'd7cbe1', 'bscortes', '2024-10-03 12:32:27'),
(47, 'c3eea8', 'bscortes', '2024-10-03 12:49:43'),
(48, '118637', 'bscortesft', '2024-10-03 12:50:20'),
(49, '59f82e', 'yuli', '2024-10-03 13:56:06');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `codigos_verificacion`
--
ALTER TABLE `codigos_verificacion`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `invitados`
--
ALTER TABLE `invitados`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sala_codigo` (`sala_codigo`);

--
-- Indices de la tabla `registro_usuarios`
--
ALTER TABLE `registro_usuarios`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `salas`
--
ALTER TABLE `salas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `codigos_verificacion`
--
ALTER TABLE `codigos_verificacion`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `invitados`
--
ALTER TABLE `invitados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `jugadores`
--
ALTER TABLE `jugadores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `registro_usuarios`
--
ALTER TABLE `registro_usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `codigos_verificacion`
--
ALTER TABLE `codigos_verificacion`
  ADD CONSTRAINT `codigos_verificacion_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `registro_usuarios` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `jugadores`
--
ALTER TABLE `jugadores`
  ADD CONSTRAINT `jugadores_ibfk_1` FOREIGN KEY (`sala_codigo`) REFERENCES `salas` (`codigo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
