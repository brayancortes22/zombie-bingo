-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-12-2024 a las 18:18:24
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

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `obtener_balotas_sacadas` (IN `sala_id` INT)   BEGIN
    SELECT numero, letra, orden_salida
    FROM balotas
    WHERE id_sala = sala_id 
    AND estado = 1
    ORDER BY orden_salida ASC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `reiniciar_balotas` (IN `sala_id` INT)   BEGIN
    -- Iniciar transacción
    START TRANSACTION;
    
    -- Reiniciar balotas
    UPDATE balotas 
    SET orden_salida = NULL,
        estado = 0 
    WHERE id_sala = sala_id;
    
    -- Reiniciar estado de la sala
    UPDATE salas 
    SET numeros_sacados = '[]',
        ultimo_numero_sacado = CURRENT_TIMESTAMP 
    WHERE id_sala = sala_id;
    
    -- Confirmar transacción
    COMMIT;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sacar_balota` (IN `sala_id` INT)   BEGIN
    DECLARE balota_id INT;
    DECLARE siguiente_orden INT;
    
    -- Iniciar transacción
    START TRANSACTION;
    
    -- Obtener una balota aleatoria no usada
    SELECT id_balota INTO balota_id
    FROM balotas 
    WHERE id_sala = sala_id 
    AND estado = 0 
    ORDER BY RAND() 
    LIMIT 1;
    
    IF balota_id IS NOT NULL THEN
        -- Obtener el siguiente orden
        SELECT COALESCE(MAX(orden_salida), 0) + 1 
        INTO siguiente_orden
        FROM balotas 
        WHERE id_sala = sala_id 
        AND estado = 1;
        
        -- Actualizar la balota
        UPDATE balotas 
        SET estado = 1,
            orden_salida = siguiente_orden
        WHERE id_balota = balota_id;
        
        -- Seleccionar la información de la balota
        SELECT numero, letra, orden_salida
        FROM balotas
        WHERE id_balota = balota_id;
    END IF;
    
    -- Confirmar transacción
    COMMIT;
END$$

DELIMITER ;

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
  `orden_salida` int(11) DEFAULT NULL,
  `id_sala` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `balotas`
--

INSERT INTO `balotas` (`id_balota`, `numero`, `letra`, `estado`, `orden_salida`, `id_sala`) VALUES
(4861, 1, 'B', 1, 28, 199),
(4862, 2, 'B', 1, 53, 199),
(4863, 3, 'B', 1, 48, 199),
(4864, 4, 'B', 1, 46, 199),
(4865, 5, 'B', 1, 33, 199),
(4866, 6, 'B', 1, 37, 199),
(4867, 7, 'B', 1, 51, 199),
(4868, 8, 'B', 1, 30, 199),
(4869, 9, 'B', 1, 36, 199),
(4870, 10, 'B', 1, 16, 199),
(4871, 11, 'B', 1, 40, 199),
(4872, 12, 'B', 1, 42, 199),
(4873, 13, 'I', 1, 11, 199),
(4874, 14, 'I', 1, 15, 199),
(4875, 15, 'I', 1, 10, 199),
(4876, 16, 'I', 1, 39, 199),
(4877, 17, 'I', 1, 52, 199),
(4878, 18, 'I', 1, 17, 199),
(4879, 19, 'I', 1, 18, 199),
(4880, 20, 'I', 1, 20, 199),
(4881, 21, 'I', 1, 44, 199),
(4882, 22, 'I', 1, 34, 199),
(4883, 23, 'I', 1, 1, 199),
(4884, 24, 'N', 1, 14, 199),
(4885, 25, 'N', 1, 22, 199),
(4886, 26, 'N', 1, 25, 199),
(4887, 27, 'N', 1, 8, 199),
(4888, 28, 'N', 1, 19, 199),
(4889, 29, 'N', 1, 43, 199),
(4890, 30, 'N', 1, 35, 199),
(4891, 31, 'N', 1, 59, 199),
(4892, 32, 'N', 1, 56, 199),
(4893, 33, 'N', 1, 12, 199),
(4894, 34, 'N', 1, 41, 199),
(4895, 35, 'G', 1, 5, 199),
(4896, 36, 'G', 1, 55, 199),
(4897, 37, 'G', 1, 24, 199),
(4898, 38, 'G', 1, 58, 199),
(4899, 39, 'G', 1, 13, 199),
(4900, 40, 'G', 1, 38, 199),
(4901, 41, 'G', 1, 7, 199),
(4902, 42, 'G', 1, 31, 199),
(4903, 43, 'G', 1, 49, 199),
(4904, 44, 'G', 1, 4, 199),
(4905, 45, 'G', 1, 9, 199),
(4906, 46, 'O', 1, 29, 199),
(4907, 47, 'O', 1, 23, 199),
(4908, 48, 'O', 1, 6, 199),
(4909, 49, 'O', 1, 32, 199),
(4910, 50, 'O', 1, 27, 199),
(4911, 51, 'O', 1, 57, 199),
(4912, 52, 'O', 1, 54, 199),
(4913, 53, 'O', 1, 21, 199),
(4914, 54, 'O', 1, 2, 199),
(4915, 55, 'O', 1, 50, 199),
(4916, 56, 'O', 1, 26, 199),
(4917, 57, 'O', 1, 45, 199),
(4918, 58, 'O', 1, 47, 199),
(4919, 59, 'O', 1, 3, 199),
(4920, 60, 'O', 1, 60, 199);

--
-- Disparadores `balotas`
--
DELIMITER $$
CREATE TRIGGER `before_balota_update` BEFORE UPDATE ON `balotas` FOR EACH ROW BEGIN
    IF NEW.estado = 1 AND OLD.estado = 0 THEN
        SET NEW.orden_salida = (
            SELECT COALESCE(MAX(orden_salida), 0) + 1
            FROM balotas
            WHERE id_sala = NEW.id_sala
            AND estado = 1
        );
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `efectos_aplicados`
--

CREATE TABLE `efectos_aplicados` (
  `id` int(11) NOT NULL,
  `id_sala` int(11) NOT NULL,
  `tipo_efecto` varchar(50) NOT NULL,
  `jugador_origen` int(11) NOT NULL,
  `jugador_destino` int(11) NOT NULL,
  `fecha_aplicacion` datetime NOT NULL
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
  `nombre_jugador` varchar(255) DEFAULT NULL,
  `rol` enum('creador','participante') DEFAULT 'participante'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugadores_en_sala`
--

INSERT INTO `jugadores_en_sala` (`id`, `id_sala`, `id_jugador`, `nombre_jugador`, `rol`) VALUES
(300, 188, 1, 'bscl', 'creador'),
(301, 188, 6, 'bscl-5', 'participante'),
(302, 189, 1, 'bscl', 'creador'),
(303, 189, 6, 'bscl-5', 'participante'),
(304, 190, 1, 'bscl', 'creador'),
(305, 190, 6, 'bscl-5', 'participante'),
(311, 194, 1, 'bscl', 'creador'),
(312, 194, 6, 'bscl-5', 'participante'),
(313, 195, 1, 'bscl', 'creador'),
(314, 195, 6, 'bscl-5', 'participante'),
(315, 196, 1, 'bscl', 'creador'),
(316, 196, 6, 'bscl-5', 'participante'),
(317, 197, 1, 'bscl', 'creador'),
(318, 197, 6, 'bscl-5', 'participante'),
(319, 198, 6, 'bscl-5', 'creador'),
(320, 198, 1, 'bscl', 'participante'),
(321, 199, 1, 'bscl', 'creador'),
(322, 199, 6, 'bscl-5', 'participante');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `partida`
--

CREATE TABLE `partida` (
  `id_partida` int(11) NOT NULL,
  `id_sala` int(11) NOT NULL,
  `id_ganador` int(11) NOT NULL,
  `fecha_partida` timestamp NOT NULL DEFAULT current_timestamp()
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
(1, 'bscl', '$2y$10$vGmfIplF7fkVC8HAHDSwp.19i1qeOw6SlDJS0lqQ8ULb55VyoZiwy', 'bscl20062007@gmail.com', NULL, '8AADdGIAGBTuzcdYs+8qgWGZRwM4wsHPdR7L4nhyABLFIAAGikXyfhZZuiZo1cLpyisOQ9gAliYzzVV64AEjLWLAAAA', NULL),
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
(188, 1, '$2y$10$aj4mWYapApIasnNDldytHe69fTmswCnMOVOVqeH4JxkGKXcbde4l.', 2, 1, 'en_juego', 0, NULL, '[\"48\", \"2\", \"6\", \"7\", \"34\", \"36\", \"21\", \"45\", \"12\", \"23\", \"11\", \"13\", \"5\", \"59\", \"27\", \"50\", \"18\", \"49\", \"52\", \"16\", \"37\", \"47\", \"1\", \"43\", \"39\", \"17\", \"54\", \"46\", \"53\", \"44\", \"15\", \"30\", \"56\", \"38\", \"3\", \"20\", \"32\", \"58\", \"35\", \"14\", \"41\", \"31\", \"26\", \"25\", \"4\", \"60\", \"19\", \"33\", \"9\", \"8\", \"57\", \"40\", \"42\", \"55\", \"28\", \"24\", \"51\", \"10\", \"29\", \"22\", \"29\", \"4\", \"34\", \"6\", \"23\", \"26\", \"60\", \"11\", \"13\", \"8\", \"35\", \"28\", \"3\", \"22\", \"2\", \"47\"]', '2024-12-03 00:32:41'),
(189, 1, '$2y$10$5QyDgReQjLCTkXudzlKo5uUKXU21bksSoFI6t06qvKMnBO75klTWm', 2, 2, 'en_juego', 0, NULL, '[\"36\", \"27\", \"22\", \"33\", \"10\", \"30\", \"4\", \"45\", \"18\", \"14\", \"21\", \"50\", \"28\", \"2\", \"56\", \"53\", \"55\", \"25\", \"47\", \"42\", \"5\", \"37\", \"9\", \"38\", \"1\", \"12\", \"24\", \"19\", \"3\", \"8\", \"29\", \"23\", \"40\", \"39\", \"57\", \"41\", \"49\", \"52\", \"17\", \"34\", \"7\", \"35\", \"58\", \"51\", \"32\", \"13\", \"48\", \"46\", \"31\", \"16\", \"15\", \"60\", \"59\", \"11\", \"44\", \"54\", \"43\", \"26\", \"20\", \"6\"]', '2024-12-03 00:45:03'),
(190, 1, '$2y$10$riUOBtetgwxryJpdIxua8OEcf0PTRhk4Ek1U0JbXYAJWAwcy/fZ8W', 2, 2, 'en_juego', 0, NULL, '[\"39\", \"36\", \"41\", \"30\", \"1\", \"49\", \"50\", \"24\", \"25\", \"46\", \"23\", \"22\", \"14\", \"27\", \"11\", \"3\", \"43\", \"20\", \"59\", \"47\", \"4\", \"10\", \"51\", \"12\", \"53\", \"31\", \"21\", \"16\", \"15\", \"9\", \"54\", \"7\", \"33\", \"5\", \"60\", \"18\", \"19\", \"40\", \"44\", \"55\", \"26\", \"8\", \"29\", \"42\", \"58\", \"48\", \"52\", \"13\", \"38\", \"34\", \"17\", \"37\", \"56\", \"6\", \"2\", \"45\", \"57\", \"35\", \"28\", \"32\"]', '2024-12-03 00:55:16'),
(194, 1, '$2y$10$VEAIdnOlg25.3m/SWRtgDOS2m85VQxSzFbHryzeYKG6qZ//5/BA8G', 2, 1, 'en_juego', 0, NULL, '[\"29\", \"34\", \"4\", \"7\", \"52\", \"5\", \"47\", \"13\", \"56\", \"41\", \"15\", \"58\", \"35\", \"18\", \"53\", \"23\", \"36\", \"45\", \"22\", \"54\", \"6\", \"17\", \"51\", \"10\", \"42\", \"49\", \"28\", \"40\", \"27\", \"57\", \"32\", \"24\", \"2\", \"8\", \"55\", \"12\", \"60\", \"59\", \"20\", \"21\", \"48\", \"38\", \"26\", \"50\", \"44\", \"1\", \"9\", \"37\", \"46\", \"31\", \"25\", \"19\", \"3\", \"11\", \"43\", \"33\", \"39\", \"30\", \"16\", \"14\", \"55\", \"28\", \"15\", \"27\", \"22\", \"33\", \"42\", \"11\", \"55\", \"43\", \"39\", \"54\", \"6\", \"7\", \"8\", \"5\", \"16\", \"44\", \"59\", \"45\", \"35\", \"47\", \"49\", \"30\", \"2\", \"52\", \"38\", \"9\", \"60\", \"40\", \"37\", \"21\", \"24\", \"10\", \"51\", \"53\", \"56\", \"46\", \"3\", \"57\", \"18\", \"19\", \"32\", \"4\", \"50\", \"23\", \"31\", \"17\", \"34\", \"1\", \"41\", \"29\", \"12\", \"36\", \"20\", \"58\", \"48\", \"25\", \"13\", \"14\", \"26\", \"38\", \"50\", \"14\", \"1\", \"51\", \"55\", \"16\", \"30\", \"42\", \"31\", \"41\", \"19\", \"40\", \"10\", \"20\", \"8\", \"4\", \"9\", \"11\"]', '2024-12-03 02:08:09'),
(195, 1, '$2y$10$Fay6TjMu1GT9iAsDsxi6EO8Aev8ydCUGgdizKW/zE4RLParcEetnq', 2, 2, 'en_juego', 0, NULL, '[\"35\", \"39\", \"22\", \"46\", \"36\", \"20\", \"37\", \"47\", \"59\", \"18\", \"21\", \"24\", \"51\", \"58\", \"4\", \"44\", \"11\", \"10\", \"53\", \"28\", \"9\", \"33\", \"57\", \"19\", \"7\", \"29\", \"17\", \"2\", \"31\", \"48\", \"32\", \"54\", \"6\", \"25\", \"15\", \"26\", \"55\", \"41\", \"60\", \"52\", \"1\", \"49\", \"12\", \"42\", \"23\", \"45\", \"50\", \"30\", \"8\", \"5\", \"38\", \"16\", \"27\", \"3\", \"40\", \"43\", \"34\", \"14\", \"13\", \"56\"]', '2024-12-03 02:28:23'),
(196, 1, '$2y$10$e7xJAzt360KkrOybfkacoeEKfxij5owkRer0OUFs4kHqH7ccRHwkO', 2, 1, 'en_juego', 0, NULL, '[\"39\", \"57\", \"58\", \"20\", \"51\", \"46\", \"59\", \"16\", \"19\", \"9\", \"4\", \"41\", \"40\", \"18\", \"23\", \"15\", \"8\", \"36\", \"60\", \"31\", \"47\", \"17\", \"42\", \"45\", \"21\", \"44\", \"25\", \"34\", \"33\", \"38\", \"43\", \"3\", \"32\", \"11\", \"29\", \"24\", \"37\", \"56\", \"22\", \"50\", \"54\", \"14\", \"55\", \"10\", \"5\", \"49\", \"2\", \"30\", \"35\", \"39\", \"28\", \"26\", \"6\", \"13\", \"7\", \"52\", \"27\", \"53\", \"48\", \"1\", \"12\", \"59\", \"35\", \"59\", \"30\", \"16\", \"51\", \"49\", \"54\", \"41\", \"47\", \"38\", \"24\", \"37\", \"14\", \"3\", \"45\", \"22\", \"55\", \"5\", \"40\", \"9\", \"12\", \"28\", \"7\", \"33\", \"18\", \"29\", \"4\", \"32\", \"36\", \"34\", \"19\", \"1\", \"46\", \"52\", \"58\", \"20\", \"21\", \"44\", \"23\", \"10\", \"57\", \"13\", \"53\", \"27\", \"11\", \"48\", \"15\", \"26\", \"42\", \"39\", \"60\", \"6\", \"43\", \"56\", \"31\", \"50\", \"8\", \"25\", \"17\", \"2\", \"52\", \"58\", \"2\", \"47\", \"34\", \"10\", \"43\", \"31\", \"51\", \"42\", \"56\", \"14\", \"54\", \"28\", \"45\", \"53\", \"50\", \"27\", \"11\", \"35\", \"44\", \"24\", \"33\", \"22\", \"37\", \"39\", \"41\", \"29\", \"1\", \"15\", \"26\", \"5\", \"36\", \"38\", \"4\", \"55\", \"17\", \"12\", \"3\", \"60\", \"52\", \"30\", \"32\", \"46\", \"18\", \"16\", \"25\", \"59\", \"9\", \"13\", \"20\", \"48\", \"7\", \"21\", \"8\", \"40\", \"23\", \"19\", \"57\", \"6\", \"49\"]', '2024-12-03 02:51:07'),
(197, 1, '$2y$10$54LQcllFvWljGbwO0K4fPOD2L/tG9H9xwghNtE27EDFbtib3lRtOm', 2, 1, 'en_juego', 0, NULL, '[]', '2024-12-03 03:09:58'),
(198, 6, '$2y$10$NdlJnbdrnZ6sWMW2yc2UrO5k9Q5YY0ZHQQx9fG/MN61TaXmUAUS6G', 2, 1, 'en_juego', 0, NULL, '[]', '2024-12-03 03:31:59'),
(199, 1, '$2y$10$S/Aw0ttCyBuPN0byOilJF.uRpA.sEwGhwXdLcEtO0gPf3eA6Njzra', 2, 2, 'en_juego', 0, NULL, '[]', '2024-12-03 17:03:20');

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
  ADD KEY `id_sala` (`id_sala`),
  ADD KEY `idx_balotas_estado_orden` (`id_sala`,`estado`,`orden_salida`);

--
-- Indices de la tabla `efectos_aplicados`
--
ALTER TABLE `efectos_aplicados`
  ADD PRIMARY KEY (`id`),
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
  ADD PRIMARY KEY (`id_partida`),
  ADD KEY `id_sala` (`id_sala`),
  ADD KEY `id_ganador` (`id_ganador`);

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
  MODIFY `id_balota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4921;

--
-- AUTO_INCREMENT de la tabla `efectos_aplicados`
--
ALTER TABLE `efectos_aplicados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jugador`
--
ALTER TABLE `jugador`
  MODIFY `id_jugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `jugadores_en_sala`
--
ALTER TABLE `jugadores_en_sala`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=323;

--
-- AUTO_INCREMENT de la tabla `partida`
--
ALTER TABLE `partida`
  MODIFY `id_partida` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registro_usuarios`
--
ALTER TABLE `registro_usuarios`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=200;

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
-- Filtros para la tabla `efectos_aplicados`
--
ALTER TABLE `efectos_aplicados`
  ADD CONSTRAINT `efectos_aplicados_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`);

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
-- Filtros para la tabla `partida`
--
ALTER TABLE `partida`
  ADD CONSTRAINT `partida_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`),
  ADD CONSTRAINT `partida_ibfk_2` FOREIGN KEY (`id_ganador`) REFERENCES `jugador` (`id_jugador`);

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
