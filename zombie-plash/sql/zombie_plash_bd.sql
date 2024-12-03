-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-12-2024 a las 23:09:55
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
(10, 7, 10, '2024-11-26 19:50:02'),
(11, 1, 19, '2024-11-30 06:12:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `balotas`
--

CREATE TABLE `balotas` (
  `id_balota` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  `letra` char(1) NOT NULL,
  `estado` tinyint(1) DEFAULT 0,
  `id_sala` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `balotas`
--

INSERT INTO `balotas` (`id_balota`, `numero`, `letra`, `estado`, `id_sala`) VALUES
(1381, 1, 'B', 0, 179),
(1382, 2, 'B', 0, 179),
(1383, 3, 'B', 0, 179),
(1384, 4, 'B', 0, 179),
(1385, 5, 'B', 0, 179),
(1386, 6, 'B', 0, 179),
(1387, 7, 'B', 0, 179),
(1388, 8, 'B', 0, 179),
(1389, 9, 'B', 0, 179),
(1390, 10, 'B', 0, 179),
(1391, 11, 'B', 0, 179),
(1392, 12, 'B', 0, 179),
(1393, 13, 'I', 0, 179),
(1394, 14, 'I', 0, 179),
(1395, 15, 'I', 0, 179),
(1396, 16, 'I', 0, 179),
(1397, 17, 'I', 0, 179),
(1398, 18, 'I', 0, 179),
(1399, 19, 'I', 0, 179),
(1400, 20, 'I', 0, 179),
(1401, 21, 'I', 0, 179),
(1402, 22, 'I', 0, 179),
(1403, 23, 'I', 0, 179),
(1404, 24, 'N', 0, 179),
(1405, 25, 'N', 0, 179),
(1406, 26, 'N', 0, 179),
(1407, 27, 'N', 0, 179),
(1408, 28, 'N', 0, 179),
(1409, 29, 'N', 0, 179),
(1410, 30, 'N', 0, 179),
(1411, 31, 'N', 0, 179),
(1412, 32, 'N', 0, 179),
(1413, 33, 'N', 0, 179),
(1414, 34, 'N', 0, 179),
(1415, 35, 'G', 0, 179),
(1416, 36, 'G', 0, 179),
(1417, 37, 'G', 0, 179),
(1418, 38, 'G', 0, 179),
(1419, 39, 'G', 0, 179),
(1420, 40, 'G', 0, 179),
(1421, 41, 'G', 0, 179),
(1422, 42, 'G', 0, 179),
(1423, 43, 'G', 0, 179),
(1424, 44, 'G', 0, 179),
(1425, 45, 'G', 0, 179),
(1426, 46, 'O', 0, 179),
(1427, 47, 'O', 0, 179),
(1428, 48, 'O', 0, 179),
(1429, 49, 'O', 0, 179),
(1430, 50, 'O', 0, 179),
(1431, 51, 'O', 0, 179),
(1432, 52, 'O', 0, 179),
(1433, 53, 'O', 0, 179),
(1434, 54, 'O', 0, 179),
(1435, 55, 'O', 0, 179),
(1436, 56, 'O', 0, 179),
(1437, 57, 'O', 0, 179),
(1438, 58, 'O', 0, 179),
(1439, 59, 'O', 0, 179),
(1440, 60, 'O', 0, 179),
(1441, 1, 'B', 0, 180),
(1442, 2, 'B', 0, 180),
(1443, 3, 'B', 0, 180),
(1444, 4, 'B', 0, 180),
(1445, 5, 'B', 0, 180),
(1446, 6, 'B', 0, 180),
(1447, 7, 'B', 0, 180),
(1448, 8, 'B', 0, 180),
(1449, 9, 'B', 0, 180),
(1450, 10, 'B', 0, 180),
(1451, 11, 'B', 0, 180),
(1452, 12, 'B', 0, 180),
(1453, 13, 'I', 0, 180),
(1454, 14, 'I', 0, 180),
(1455, 15, 'I', 0, 180),
(1456, 16, 'I', 0, 180),
(1457, 17, 'I', 0, 180),
(1458, 18, 'I', 0, 180),
(1459, 19, 'I', 0, 180),
(1460, 20, 'I', 0, 180),
(1461, 21, 'I', 0, 180),
(1462, 22, 'I', 0, 180),
(1463, 23, 'I', 0, 180),
(1464, 24, 'N', 0, 180),
(1465, 25, 'N', 0, 180),
(1466, 26, 'N', 0, 180),
(1467, 27, 'N', 0, 180),
(1468, 28, 'N', 0, 180),
(1469, 29, 'N', 0, 180),
(1470, 30, 'N', 0, 180),
(1471, 31, 'N', 0, 180),
(1472, 32, 'N', 0, 180),
(1473, 33, 'N', 0, 180),
(1474, 34, 'N', 0, 180),
(1475, 35, 'G', 0, 180),
(1476, 36, 'G', 0, 180),
(1477, 37, 'G', 0, 180),
(1478, 38, 'G', 0, 180),
(1479, 39, 'G', 0, 180),
(1480, 40, 'G', 0, 180),
(1481, 41, 'G', 0, 180),
(1482, 42, 'G', 0, 180),
(1483, 43, 'G', 0, 180),
(1484, 44, 'G', 0, 180),
(1485, 45, 'G', 0, 180),
(1486, 46, 'O', 0, 180),
(1487, 47, 'O', 0, 180),
(1488, 48, 'O', 0, 180),
(1489, 49, 'O', 0, 180),
(1490, 50, 'O', 0, 180),
(1491, 51, 'O', 0, 180),
(1492, 52, 'O', 0, 180),
(1493, 53, 'O', 0, 180),
(1494, 54, 'O', 0, 180),
(1495, 55, 'O', 0, 180),
(1496, 56, 'O', 0, 180),
(1497, 57, 'O', 0, 180),
(1498, 58, 'O', 0, 180),
(1499, 59, 'O', 0, 180),
(1500, 60, 'O', 0, 180),
(1621, 1, 'B', 0, 181),
(1622, 2, 'B', 0, 181),
(1623, 3, 'B', 0, 181),
(1624, 4, 'B', 0, 181),
(1625, 5, 'B', 0, 181),
(1626, 6, 'B', 0, 181),
(1627, 7, 'B', 0, 181),
(1628, 8, 'B', 0, 181),
(1629, 9, 'B', 0, 181),
(1630, 10, 'B', 0, 181),
(1631, 11, 'B', 0, 181),
(1632, 12, 'B', 0, 181),
(1633, 13, 'I', 0, 181),
(1634, 14, 'I', 0, 181),
(1635, 15, 'I', 0, 181),
(1636, 16, 'I', 0, 181),
(1637, 17, 'I', 0, 181),
(1638, 18, 'I', 0, 181),
(1639, 19, 'I', 0, 181),
(1640, 20, 'I', 0, 181),
(1641, 21, 'I', 0, 181),
(1642, 22, 'I', 0, 181),
(1643, 23, 'I', 0, 181),
(1644, 24, 'N', 0, 181),
(1645, 25, 'N', 0, 181),
(1646, 26, 'N', 0, 181),
(1647, 27, 'N', 0, 181),
(1648, 28, 'N', 0, 181),
(1649, 29, 'N', 0, 181),
(1650, 30, 'N', 0, 181),
(1651, 31, 'N', 0, 181),
(1652, 32, 'N', 0, 181),
(1653, 33, 'N', 0, 181),
(1654, 34, 'N', 0, 181),
(1655, 35, 'G', 0, 181),
(1656, 36, 'G', 0, 181),
(1657, 37, 'G', 0, 181),
(1658, 38, 'G', 0, 181),
(1659, 39, 'G', 0, 181),
(1660, 40, 'G', 0, 181),
(1661, 41, 'G', 0, 181),
(1662, 42, 'G', 0, 181),
(1663, 43, 'G', 0, 181),
(1664, 44, 'G', 0, 181),
(1665, 45, 'G', 0, 181),
(1666, 46, 'O', 0, 181),
(1667, 47, 'O', 0, 181),
(1668, 48, 'O', 0, 181),
(1669, 49, 'O', 0, 181),
(1670, 50, 'O', 0, 181),
(1671, 51, 'O', 0, 181),
(1672, 52, 'O', 0, 181),
(1673, 53, 'O', 0, 181),
(1674, 54, 'O', 0, 181),
(1675, 55, 'O', 0, 181),
(1676, 56, 'O', 0, 181),
(1677, 57, 'O', 0, 181),
(1678, 58, 'O', 0, 181),
(1679, 59, 'O', 0, 181),
(1680, 60, 'O', 0, 181);

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
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_sala` int(11) DEFAULT NULL,
  `id_jugador` int(11) DEFAULT NULL,
  `nombre_jugador` varchar(255) DEFAULT NULL,
  `rol` enum('creador','participante') DEFAULT 'participante',
  PRIMARY KEY (`id`),
  KEY `id_sala` (`id_sala`),
  KEY `id_jugador` (`id_jugador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugadores_en_sala`
--

INSERT INTO `jugadores_en_sala` (`id`, `id_sala`, `id_jugador`, `nombre_jugador`, `rol`) VALUES
(282, 179, 1, 'bscl', 'creador'),
(283, 179, 6, 'bscl-5', 'participante'),
(284, 180, 1, 'bscl', 'creador'),
(285, 180, 6, 'bscl-5', 'participante'),
(286, 181, 1, 'bscl', 'creador'),
(287, 181, 6, 'bscl-5', 'participante');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partida`
--

CREATE TABLE IF NOT EXISTS `partida` (
  `id_partida` int(11) NOT NULL AUTO_INCREMENT,
  `id_sala` int(11) NOT NULL,
  `id_ganador` int(11) NOT NULL,
  `fecha_partida` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_partida`),
  FOREIGN KEY (`id_sala`) REFERENCES `salas`(`id_sala`),
  FOREIGN KEY (`id_ganador`) REFERENCES `jugador`(`id_jugador`)
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
  `avatar` varchar(255) DEFAULT 'perfil1.jpeg',
  `ultima_conexion` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `registro_usuarios`
--

INSERT INTO `registro_usuarios` (`id_registro`, `nombre`, `contraseña`, `correo`, `estado`, `avatar`, `ultima_conexion`) VALUES
(1, 'bscl', '$2y$10$vGmfIplF7fkVC8HAHDSwp.19i1qeOw6SlDJS0lqQ8ULb55VyoZiwy', 'bscl20062007@gmail.com', NULL, 'perfil1.jpeg', NULL),
(2, 'jhon-1', '$2y$10$Yi5b4dFqPazLcPMhFja0fuoz10TS2QxCN1n4nFBeLswFxYYOE7Pga', 'jhon@d.com', NULL, 'avatar1.jpg', NULL),
(3, 'jhondd', '$2y$10$8gAjzhQMgOjmM0S.c5384Og5wDjmx2.wYH3RPTa0RgfYN5QysIyfG', 'wwww@gmail.co', NULL, 'perfil1.jpeg', NULL),
(4, 'bs', '$2y$10$6ZeQlaB2GjNHcoOcumTxTeQSjCgevvpkbzKfnlPG4vEw/gVoXRB/y', 'bsc@gmail.com', NULL, 'perfil1.jpeg', NULL),
(6, 'bsl-1', '$2y$10$iQU7o1RbOyLG3ie53guOYO8LuPNpXFxc8IT.tAsST0GnmWaOXLfru', 'bscl-1@gmail.com', NULL, 'perfil1.jpeg', NULL),
(7, 'bscl-2', '$2y$10$CIr/WjQSTAR02H1Wqs6r/uQLlWrLqY//7fr8FJo/oC49ea7HjTdoO', 'bscl-2@gmail.com', NULL, 'avatar3.jpg', NULL),
(8, 'bsl-3', '$2y$10$Zr6XuSqwJZwWJf3C4gZ.1.yrFU46aWtAkk8sebGEKJi8k92YQaywa', 'bscl-3@gmail.com', NULL, 'perfil1.jpeg', NULL),
(9, 'bscl-4', '$2y$10$RncrORRaf/wF8GavdHIMNO2S5BQghk2XmN6/b9j9vDMxBnY/KVG7.', 'bscl-4@gmail.com', NULL, 'perfil1.jpeg', NULL),
(10, 'bscl-5', '$2y$10$Pm.KgzjXIutMFVt.0h8d2OgYaez6TYFPiKE7km9CWwv4ZN89Fr1rO', 'bscl-5@gmail.com', NULL, '6740fd5ceb657__a0f72250-92c3-4c5f-a3a7-f199d68a8b41.jpeg', NULL),
(11, 'catalina', '$2y$10$h6SZm1h9E3jO3wbbelCWr.SmtEUzbAX0chtjY3WFsG7gTXcGfvN2i', 'catalina2005cometta@gmail.com', NULL, 'perfil1.jpeg', NULL),
(12, 'bsl-31', '$2y$10$0y5Xft.a5SI8taVmJftfLOkE5MpqL.2PjoNlf1ddiYfZ1.nW4wbCW', 'wwwffw@gmail.co', NULL, 'perfil1.jpeg', NULL),
(14, 'hola283', '$2y$10$7y5yCSDFY48XwYr19/AFleoFccoPdacLEOQtGR2ckacM6Q7.ITMka', 'hola@gamail.com', NULL, 'perfil1.jpeg', NULL),
(15, 'GTRG', '$2y$10$Rf8IFRrLLUlbY8D2zkUGjeOmjpK6Nlw9yu0wmXQQJDXZ4OZRNktoa', 'RTG@GMAIL.COM', NULL, 'perfil1.jpeg', NULL),
(16, 's', '$2y$10$tzPvpaaP5fixP2pQ/EIpL.abRFY7XZ2DR299KvmdRn84mEZGzO5R6', 'bscl2006s2007@gmail.com', NULL, 'perfil1.jpeg', NULL),
(17, 'sss', '$2y$10$2Y.lDE1SArVeGThmLlXjkO0G/htDy8SzOEoFv.EBP.cx/mYnLruiK', 'bscl2006s20aa07@gmail.com', NULL, 'perfil1.jpeg', NULL),
(18, 'pepe', '$2y$10$Fy3Sk2jd7Ao2BfNtaHJj6OWcmBTBNdDFEIf0v./aOu9EtYcu2TKw2', 'pepe@gmail.com', NULL, 'perfil1.jpeg', NULL),
(19, 'bscl-9', '$2y$10$0rSkwnkECYnBeuyIzsMR8.ZYRSfJY6jqVHXm4Se9UWxdjFSB5iPZW', 'bscl-9@gmail.com', NULL, 'perfil1.jpeg', NULL),
(20, 'pepen', '$2y$10$l2glVT3gwpw0CYCGDGliLuqiAgyfnCzL2cTIvdS2tMB/fA8omEsgm', 'bscl20062m007@gmail.com', NULL, 'perfil1.jpeg', NULL),
(21, 'hola2332', '$2y$10$GRyUZvIAADLTeHisTL1q4.L6S9mGnuypWsp2rEY4XhEh02Nuk.1MW', 'holas3de@gmail.com', NULL, 'perfil1.jpeg', NULL),
(22, 'BRAYAN', '$2y$10$WSMAghJZF2cnqxCVAHq/8.To.fBws3yD.8AyFEuHJCSN4/prKtUqO', 'BRAYAN@GMAIL.COM', NULL, 'perfil1.jpeg', NULL),
(23, 'holaaas', '$2y$10$1HgMC1TYJWNN4tFm5vbm.eY8bAmJWwSIgwstZNkn33sxH.TQLVCVe', 'bscl2006200ww7@gmail.com', NULL, 'perfil1.jpeg', NULL);

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
  `estado` enum('esperando','en_juego','finalizado') DEFAULT 'esperando',
  `jugando` tinyint(4) DEFAULT 0 COMMENT '0: esperando, 1: en juego, -1: cerrada',
  `efectos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`efectos`)),
  `numeros_sacados` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT '[]' CHECK (json_valid(`numeros_sacados`)),
  `ultimo_numero_sacado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `salas`
--

INSERT INTO `salas` (`id_sala`, `id_creador`, `contraseña`, `max_jugadores`, `jugadores_unidos`, `estado`, `jugando`, `efectos`, `numeros_sacados`, `ultimo_numero_sacado`) VALUES
(179, 1, '$2y$10$TkjW2i2TxYGPWis/LMw7Qeb7L.uYSI4hYzRUaFYKCCoPcIRzuNhry', 2, 2, 'en_juego', 0, NULL, '[]', '2024-12-02 21:49:34'),
(180, 1, '$2y$10$HE7tPTYp40QCMwTjBviZxuGQm7fMXG3q7lJLRg5Xe3wXzFVpdjC0C', 2, 2, 'en_juego', 0, NULL, '[]', '2024-12-02 21:59:35'),
(181, 1, '$2y$10$.HBmVuB.TVMtY06lSWWTcend09i.lTvDu6bXSGfKYZGZCIOggSXtC', 2, 2, 'en_juego', 0, NULL, '[]', '2024-12-02 22:04:51');

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
-- Indices de la tabla `balotas`
--
ALTER TABLE `balotas`
  ADD PRIMARY KEY (`id_balota`),
  ADD KEY `id_sala` (`id_sala`);

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
  MODIFY `id_amistad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `balotas`
--
ALTER TABLE `balotas`
  MODIFY `id_balota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1681;

--
-- AUTO_INCREMENT de la tabla `jugador`
--
ALTER TABLE `jugador`
  MODIFY `id_jugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `jugadores_en_sala`
--
ALTER TABLE `jugadores_en_sala`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=288;

--
-- AUTO_INCREMENT de la tabla `registro_usuarios`
--
ALTER TABLE `registro_usuarios`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=182;

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
-- Filtros para la tabla `balotas`
--
ALTER TABLE `balotas`
  ADD CONSTRAINT `fk_sala_balotas` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON DELETE CASCADE;

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
