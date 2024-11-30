-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-11-2024 a las 04:54:33
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
-- Estructura de tabla para la tabla `amistad`
--

CREATE TABLE `amistad` (
  `id_amistad` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `id_amigo` int(11) NOT NULL,
  `fecha_amistad` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `amistad`
--

INSERT INTO `amistad` (`id_amistad`, `id_jugador`, `id_amigo`, `fecha_amistad`) VALUES
(1, 1, 6, '2024-11-15 19:38:43'),
(2, 1, 2, '2024-11-15 20:07:15'),
(3, 1, 4, '2024-11-15 20:07:59'),
(4, 1, 16, '2024-11-15 21:15:26'),
(5, 1, 9, '2024-11-17 03:27:07'),
(6, 1, 10, '2024-11-17 03:27:23'),
(7, 7, 1, '2024-11-22 20:14:53'),
(8, 2, 7, '2024-11-22 22:00:01'),
(9, 2, 10, '2024-11-22 22:00:05'),
(10, 7, 10, '2024-11-26 19:50:02');

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
(6, 'bscl-5', NULL, 10),
(7, 'bsl-31', NULL, 12),
(9, 'pepen', NULL, 20),
(10, 'jhon', NULL, 2);

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
(204, 138, 1, 'bscl');

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
  `estado` varchar(255) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT 'perfil1.jpeg'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registro_usuarios`
--

INSERT INTO `registro_usuarios` (`id_registro`, `nombre`, `contraseña`, `correo`, `estado`, `avatar`) VALUES
(1, 'bscl', '$2y$10$vGmfIplF7fkVC8HAHDSwp.19i1qeOw6SlDJS0lqQ8ULb55VyoZiwy', 'bscl20062007@gmail.com', NULL, 'perfil1.jpeg'),
(2, 'jhon-1', '$2y$10$Yi5b4dFqPazLcPMhFja0fuoz10TS2QxCN1n4nFBeLswFxYYOE7Pga', 'jhon@d.com', NULL, 'avatar1.jpg'),
(3, 'jhondd', '$2y$10$8gAjzhQMgOjmM0S.c5384Og5wDjmx2.wYH3RPTa0RgfYN5QysIyfG', 'wwww@gmail.co', NULL, 'perfil1.jpeg'),
(4, 'bs', '$2y$10$6ZeQlaB2GjNHcoOcumTxTeQSjCgevvpkbzKfnlPG4vEw/gVoXRB/y', 'bsc@gmail.com', NULL, 'perfil1.jpeg'),
(6, 'bsl-1', '$2y$10$iQU7o1RbOyLG3ie53guOYO8LuPNpXFxc8IT.tAsST0GnmWaOXLfru', 'bscl-1@gmail.com', NULL, 'perfil1.jpeg'),
(7, 'bscl-2', '$2y$10$CIr/WjQSTAR02H1Wqs6r/uQLlWrLqY//7fr8FJo/oC49ea7HjTdoO', 'bscl-2@gmail.com', NULL, 'avatar3.jpg'),
(8, 'bsl-3', '$2y$10$Zr6XuSqwJZwWJf3C4gZ.1.yrFU46aWtAkk8sebGEKJi8k92YQaywa', 'bscl-3@gmail.com', NULL, 'perfil1.jpeg'),
(9, 'bscl-4', '$2y$10$RncrORRaf/wF8GavdHIMNO2S5BQghk2XmN6/b9j9vDMxBnY/KVG7.', 'bscl-4@gmail.com', NULL, 'perfil1.jpeg'),
(10, 'bscl-5', '$2y$10$Pm.KgzjXIutMFVt.0h8d2OgYaez6TYFPiKE7km9CWwv4ZN89Fr1rO', 'bscl-5@gmail.com', NULL, '6740fd5ceb657__a0f72250-92c3-4c5f-a3a7-f199d68a8b41.jpeg'),
(11, 'catalina', '$2y$10$h6SZm1h9E3jO3wbbelCWr.SmtEUzbAX0chtjY3WFsG7gTXcGfvN2i', 'catalina2005cometta@gmail.com', NULL, 'perfil1.jpeg'),
(12, 'bsl-31', '$2y$10$0y5Xft.a5SI8taVmJftfLOkE5MpqL.2PjoNlf1ddiYfZ1.nW4wbCW', 'wwwffw@gmail.co', NULL, 'perfil1.jpeg'),
(14, 'hola283', '$2y$10$7y5yCSDFY48XwYr19/AFleoFccoPdacLEOQtGR2ckacM6Q7.ITMka', 'hola@gamail.com', NULL, 'perfil1.jpeg'),
(15, 'GTRG', '$2y$10$Rf8IFRrLLUlbY8D2zkUGjeOmjpK6Nlw9yu0wmXQQJDXZ4OZRNktoa', 'RTG@GMAIL.COM', NULL, 'perfil1.jpeg'),
(16, 's', '$2y$10$tzPvpaaP5fixP2pQ/EIpL.abRFY7XZ2DR299KvmdRn84mEZGzO5R6', 'bscl2006s2007@gmail.com', NULL, 'perfil1.jpeg'),
(17, 'sss', '$2y$10$2Y.lDE1SArVeGThmLlXjkO0G/htDy8SzOEoFv.EBP.cx/mYnLruiK', 'bscl2006s20aa07@gmail.com', NULL, 'perfil1.jpeg'),
(18, 'pepe', '$2y$10$Fy3Sk2jd7Ao2BfNtaHJj6OWcmBTBNdDFEIf0v./aOu9EtYcu2TKw2', 'pepe@gmail.com', NULL, 'perfil1.jpeg'),
(19, 'bscl-9', '$2y$10$0rSkwnkECYnBeuyIzsMR8.ZYRSfJY6jqVHXm4Se9UWxdjFSB5iPZW', 'bscl-9@gmail.com', NULL, 'perfil1.jpeg'),
(20, 'pepen', '$2y$10$l2glVT3gwpw0CYCGDGliLuqiAgyfnCzL2cTIvdS2tMB/fA8omEsgm', 'bscl20062m007@gmail.com', NULL, 'perfil1.jpeg'),
(21, 'hola2332', '$2y$10$GRyUZvIAADLTeHisTL1q4.L6S9mGnuypWsp2rEY4XhEh02Nuk.1MW', 'holas3de@gmail.com', NULL, 'perfil1.jpeg'),
(22, 'BRAYAN', '$2y$10$WSMAghJZF2cnqxCVAHq/8.To.fBws3yD.8AyFEuHJCSN4/prKtUqO', 'BRAYAN@GMAIL.COM', NULL, 'perfil1.jpeg');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `salas`
--

CREATE TABLE `salas` (
  `id_sala` int(255) NOT NULL,
  `id_creador` int(11) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `max_jugadores` int(11) NOT NULL,
  `jugadores_unidos` int(11) NOT NULL DEFAULT 1,
  `jugando` tinyint(4) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `salas`
--

INSERT INTO `salas` (`id_sala`, `id_creador`, `contraseña`, `max_jugadores`, `jugadores_unidos`, `jugando`) VALUES
(133, 10, '$2y$10$4ixjWB5z5/mVs6mFdJMdVuXsi2lByVVq/EbYTcQMqr9.mF2cqSoVi', 2, 3, 0),
(134, 10, '$2y$10$PW6fdCNx76FcVZ3ZrqM0FOuBy/CtRm38sYuZ76wfnJ0OeRKj51c.e', 2, 2, 0),
(135, 1, '$2y$10$ck4FkcLP.cp.ZmedOnjwFOmq9Q8m3EIgoVeogvA5nacjXmxu7XbXO', 2, 2, 0),
(136, 1, '$2y$10$lMZ0Uy4COXLbelh5k2FSHux8iaRcGQTIW5XkJPM6w.0hSz2AgVubu', 2, 2, 0),
(137, 1, '$2y$10$NCJ73DpPUAUBGop3RId9qeWAVFWfXIWQ9bQ.EqHlnp7mBpV4zLaz6', 3, 1, 0),
(138, 1, '$2y$10$VdvEwVX0QK7jFR97tox84ez1s.8G2aSf0VXQKIYKjkChBXO.BJrrO', 2, 1, 0);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `amistad`
--
ALTER TABLE `amistad`
  ADD PRIMARY KEY (`id_amistad`),
  ADD UNIQUE KEY `unique_friendship` (`id_jugador`,`id_amigo`),
  ADD KEY `id_amigo` (`id_amigo`);

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
-- Indices de la tabla `salas`
--
ALTER TABLE `salas`
  ADD PRIMARY KEY (`id_sala`),
  ADD KEY `id_creador` (`id_creador`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `amistad`
--
ALTER TABLE `amistad`
  MODIFY `id_amistad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `jugador`
--
ALTER TABLE `jugador`
  MODIFY `id_jugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `jugadores_en_sala`
--
ALTER TABLE `jugadores_en_sala`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=205;

--
-- AUTO_INCREMENT de la tabla `registro_usuarios`
--
ALTER TABLE `registro_usuarios`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `amistad`
--
ALTER TABLE `amistad`
  ADD CONSTRAINT `amistad_ibfk_1` FOREIGN KEY (`id_jugador`) REFERENCES `registro_usuarios` (`id_registro`) ON DELETE CASCADE,
  ADD CONSTRAINT `amistad_ibfk_2` FOREIGN KEY (`id_amigo`) REFERENCES `registro_usuarios` (`id_registro`) ON DELETE CASCADE;

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
-- Filtros para la tabla `salas`
--
ALTER TABLE `salas`
  ADD CONSTRAINT `fk_id_creador` FOREIGN KEY (`id_creador`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
