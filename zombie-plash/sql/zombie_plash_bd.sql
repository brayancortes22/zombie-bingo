-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-12-2024 a las 03:38:19
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

CREATE DEFINER=`root`@`localhost` PROCEDURE `verificar_efectos_activos` (IN `p_id_sala` INT, IN `p_id_jugador` INT)   BEGIN
    SELECT 
        ea.id,
        ea.tipo_efecto,
        ea.jugador_origen,
        ea.jugador_destino,
        ea.duracion,
        UNIX_TIMESTAMP(ea.fecha_aplicacion) as timestamp_aplicacion
    FROM efectos_aplicados ea
    WHERE ea.id_sala = p_id_sala 
        AND ea.jugador_destino = p_id_jugador
        AND ea.jugador_origen != p_id_jugador
        AND ea.fecha_aplicacion >= NOW() - INTERVAL (ea.duracion/1000) SECOND
        AND NOT EXISTS (
            -- Verificar si el efecto ya fue procesado
            SELECT 1 
            FROM efectos_procesados ep 
            WHERE ep.id_efecto = ea.id 
            AND ep.id_jugador = p_id_jugador
        );
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
(11, 1, 19, '2024-11-30 06:12:45'),
(12, 10, 4, '2024-12-03 21:51:58'),
(13, 10, 1, '2024-12-03 21:51:58'),
(14, 10, 15, '2024-12-03 21:54:41');

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
(6781, 1, 'B', 1, 54, 201),
(6782, 2, 'B', 1, 14, 201),
(6783, 3, 'B', 1, 37, 201),
(6784, 4, 'B', 1, 38, 201),
(6785, 5, 'B', 1, 48, 201),
(6786, 6, 'B', 1, 43, 201),
(6787, 7, 'B', 1, 57, 201),
(6788, 8, 'B', 1, 55, 201),
(6789, 9, 'B', 1, 45, 201),
(6790, 10, 'B', 1, 25, 201),
(6791, 11, 'B', 1, 20, 201),
(6792, 12, 'B', 1, 56, 201),
(6793, 13, 'I', 1, 4, 201),
(6794, 14, 'I', 1, 36, 201),
(6795, 15, 'I', 1, 21, 201),
(6796, 16, 'I', 1, 39, 201),
(6797, 17, 'I', 1, 24, 201),
(6798, 18, 'I', 1, 15, 201),
(6799, 19, 'I', 1, 51, 201),
(6800, 20, 'I', 1, 29, 201),
(6801, 21, 'I', 1, 59, 201),
(6802, 22, 'I', 1, 50, 201),
(6803, 23, 'I', 1, 8, 201),
(6804, 24, 'N', 1, 28, 201),
(6805, 25, 'N', 1, 7, 201),
(6806, 26, 'N', 1, 31, 201),
(6807, 27, 'N', 1, 5, 201),
(6808, 28, 'N', 1, 47, 201),
(6809, 29, 'N', 1, 32, 201),
(6810, 30, 'N', 1, 41, 201),
(6811, 31, 'N', 1, 16, 201),
(6812, 32, 'N', 1, 6, 201),
(6813, 33, 'N', 1, 53, 201),
(6814, 34, 'N', 1, 34, 201),
(6815, 35, 'G', 1, 52, 201),
(6816, 36, 'G', 1, 3, 201),
(6817, 37, 'G', 1, 10, 201),
(6818, 38, 'G', 1, 13, 201),
(6819, 39, 'G', 1, 23, 201),
(6820, 40, 'G', 1, 60, 201),
(6821, 41, 'G', 1, 40, 201),
(6822, 42, 'G', 1, 49, 201),
(6823, 43, 'G', 1, 42, 201),
(6824, 44, 'G', 1, 18, 201),
(6825, 45, 'G', 1, 11, 201),
(6826, 46, 'O', 1, 46, 201),
(6827, 47, 'O', 1, 35, 201),
(6828, 48, 'O', 1, 30, 201),
(6829, 49, 'O', 1, 44, 201),
(6830, 50, 'O', 1, 2, 201),
(6831, 51, 'O', 1, 58, 201),
(6832, 52, 'O', 1, 12, 201),
(6833, 53, 'O', 1, 9, 201),
(6834, 54, 'O', 1, 33, 201),
(6835, 55, 'O', 1, 26, 201),
(6836, 56, 'O', 1, 1, 201),
(6837, 57, 'O', 1, 27, 201),
(6838, 58, 'O', 1, 17, 201),
(6839, 59, 'O', 1, 19, 201),
(6840, 60, 'O', 1, 22, 201),
(6901, 1, 'B', 1, 28, 202),
(6902, 2, 'B', 1, 14, 202),
(6903, 3, 'B', 1, 33, 202),
(6904, 4, 'B', 1, 29, 202),
(6905, 5, 'B', 1, 37, 202),
(6906, 6, 'B', 1, 46, 202),
(6907, 7, 'B', 1, 25, 202),
(6908, 8, 'B', 1, 39, 202),
(6909, 9, 'B', 1, 27, 202),
(6910, 10, 'B', 1, 20, 202),
(6911, 11, 'B', 1, 36, 202),
(6912, 12, 'B', 1, 53, 202),
(6913, 13, 'I', 1, 56, 202),
(6914, 14, 'I', 1, 60, 202),
(6915, 15, 'I', 1, 34, 202),
(6916, 16, 'I', 1, 38, 202),
(6917, 17, 'I', 1, 42, 202),
(6918, 18, 'I', 1, 54, 202),
(6919, 19, 'I', 1, 59, 202),
(6920, 20, 'I', 1, 45, 202),
(6921, 21, 'I', 1, 3, 202),
(6922, 22, 'I', 1, 5, 202),
(6923, 23, 'I', 1, 21, 202),
(6924, 24, 'N', 1, 52, 202),
(6925, 25, 'N', 1, 49, 202),
(6926, 26, 'N', 1, 18, 202),
(6927, 27, 'N', 1, 58, 202),
(6928, 28, 'N', 1, 41, 202),
(6929, 29, 'N', 1, 57, 202),
(6930, 30, 'N', 1, 7, 202),
(6931, 31, 'N', 1, 6, 202),
(6932, 32, 'N', 1, 1, 202),
(6933, 33, 'N', 1, 48, 202),
(6934, 34, 'N', 1, 31, 202),
(6935, 35, 'G', 1, 50, 202),
(6936, 36, 'G', 1, 51, 202),
(6937, 37, 'G', 1, 19, 202),
(6938, 38, 'G', 1, 35, 202),
(6939, 39, 'G', 1, 43, 202),
(6940, 40, 'G', 1, 44, 202),
(6941, 41, 'G', 1, 55, 202),
(6942, 42, 'G', 1, 17, 202),
(6943, 43, 'G', 1, 16, 202),
(6944, 44, 'G', 1, 40, 202),
(6945, 45, 'G', 1, 22, 202),
(6946, 46, 'O', 1, 32, 202),
(6947, 47, 'O', 1, 24, 202),
(6948, 48, 'O', 1, 10, 202),
(6949, 49, 'O', 1, 23, 202),
(6950, 50, 'O', 1, 11, 202),
(6951, 51, 'O', 1, 15, 202),
(6952, 52, 'O', 1, 4, 202),
(6953, 53, 'O', 1, 47, 202),
(6954, 54, 'O', 1, 13, 202),
(6955, 55, 'O', 1, 30, 202),
(6956, 56, 'O', 1, 8, 202),
(6957, 57, 'O', 1, 2, 202),
(6958, 58, 'O', 1, 9, 202),
(6959, 59, 'O', 1, 12, 202),
(6960, 60, 'O', 1, 26, 202),
(7021, 1, 'B', 0, NULL, 203),
(7022, 2, 'B', 1, 14, 203),
(7023, 3, 'B', 1, 2, 203),
(7024, 4, 'B', 1, 4, 203),
(7025, 5, 'B', 0, NULL, 203),
(7026, 6, 'B', 0, NULL, 203),
(7027, 7, 'B', 0, NULL, 203),
(7028, 8, 'B', 0, NULL, 203),
(7029, 9, 'B', 0, NULL, 203),
(7030, 10, 'B', 0, NULL, 203),
(7031, 11, 'B', 0, NULL, 203),
(7032, 12, 'B', 0, NULL, 203),
(7033, 13, 'I', 0, NULL, 203),
(7034, 14, 'I', 0, NULL, 203),
(7035, 15, 'I', 1, 10, 203),
(7036, 16, 'I', 1, 16, 203),
(7037, 17, 'I', 0, NULL, 203),
(7038, 18, 'I', 1, 18, 203),
(7039, 19, 'I', 0, NULL, 203),
(7040, 20, 'I', 0, NULL, 203),
(7041, 21, 'I', 0, NULL, 203),
(7042, 22, 'I', 1, 11, 203),
(7043, 23, 'I', 0, NULL, 203),
(7044, 24, 'N', 0, NULL, 203),
(7045, 25, 'N', 0, NULL, 203),
(7046, 26, 'N', 0, NULL, 203),
(7047, 27, 'N', 1, 12, 203),
(7048, 28, 'N', 0, NULL, 203),
(7049, 29, 'N', 0, NULL, 203),
(7050, 30, 'N', 0, NULL, 203),
(7051, 31, 'N', 0, NULL, 203),
(7052, 32, 'N', 0, NULL, 203),
(7053, 33, 'N', 1, 1, 203),
(7054, 34, 'N', 0, NULL, 203),
(7055, 35, 'G', 0, NULL, 203),
(7056, 36, 'G', 1, 8, 203),
(7057, 37, 'G', 0, NULL, 203),
(7058, 38, 'G', 1, 3, 203),
(7059, 39, 'G', 0, NULL, 203),
(7060, 40, 'G', 1, 7, 203),
(7061, 41, 'G', 1, 9, 203),
(7062, 42, 'G', 0, NULL, 203),
(7063, 43, 'G', 0, NULL, 203),
(7064, 44, 'G', 0, NULL, 203),
(7065, 45, 'G', 1, 13, 203),
(7066, 46, 'O', 0, NULL, 203),
(7067, 47, 'O', 0, NULL, 203),
(7068, 48, 'O', 0, NULL, 203),
(7069, 49, 'O', 1, 22, 203),
(7070, 50, 'O', 1, 17, 203),
(7071, 51, 'O', 1, 19, 203),
(7072, 52, 'O', 1, 21, 203),
(7073, 53, 'O', 0, NULL, 203),
(7074, 54, 'O', 1, 6, 203),
(7075, 55, 'O', 1, 5, 203),
(7076, 56, 'O', 1, 20, 203),
(7077, 57, 'O', 1, 15, 203),
(7078, 58, 'O', 0, NULL, 203),
(7079, 59, 'O', 0, NULL, 203),
(7080, 60, 'O', 0, NULL, 203);

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
  `fecha_aplicacion` datetime NOT NULL DEFAULT current_timestamp(),
  `duracion` int(11) NOT NULL DEFAULT 10000
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
(10, 'jhon', NULL, 2),
(11, 'brayan_cortes', NULL, 24);

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
(325, 201, 1, 'bscl', 'creador'),
(326, 201, 6, 'bscl-5', 'participante'),
(327, 202, 1, 'bscl', 'creador'),
(328, 202, 6, 'bscl-5', 'participante'),
(329, 203, 1, 'bscl', 'creador'),
(330, 203, 6, 'bscl-5', 'participante'),
(332, 205, 11, 'brayan_cortes', 'creador');

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
(1, 'bscl', '$2y$10$d4Mukc4CVyvuAzSnC6RMmO3fBTRyG.CO7D0WmtlNxJ3C1GYk7FMNu', 'bscl20062007@gmail.com', NULL, '674f73d101bd3_1733260241.png', NULL),
(2, 'jhon-1', '$2y$10$Yi5b4dFqPazLcPMhFja0fuoz10TS2QxCN1n4nFBeLswFxYYOE7Pga', 'jhon@d.com', NULL, 'avatar1.jpg', NULL),
(3, 'jhondd', '$2y$10$8gAjzhQMgOjmM0S.c5384Og5wDjmx2.wYH3RPTa0RgfYN5QysIyfG', 'wwww@gmail.co', NULL, 'perfil1.jpeg', NULL),
(4, 'bs', '$2y$10$6ZeQlaB2GjNHcoOcumTxTeQSjCgevvpkbzKfnlPG4vEw/gVoXRB/y', 'bsc@gmail.com', NULL, 'perfil1.jpeg', NULL),
(6, 'bsl-1', '$2y$10$iQU7o1RbOyLG3ie53guOYO8LuPNpXFxc8IT.tAsST0GnmWaOXLfru', 'bscl-1@gmail.com', NULL, 'perfil1.jpeg', NULL),
(7, 'bscl-2', '$2y$10$CIr/WjQSTAR02H1Wqs6r/uQLlWrLqY//7fr8FJo/oC49ea7HjTdoO', 'bscl-2@gmail.com', NULL, 'avatar3.jpg', NULL),
(8, 'bsl-3', '$2y$10$Zr6XuSqwJZwWJf3C4gZ.1.yrFU46aWtAkk8sebGEKJi8k92YQaywa', 'bscl-3@gmail.com', NULL, 'perfil1.jpeg', NULL),
(9, 'bscl-4', '$2y$10$RncrORRaf/wF8GavdHIMNO2S5BQghk2XmN6/b9j9vDMxBnY/KVG7.', 'bscl-4@gmail.com', NULL, 'perfil1.jpeg', NULL),
(10, 'bscl-5', '$2y$10$Pm.KgzjXIutMFVt.0h8d2OgYaez6TYFPiKE7km9CWwv4ZN89Fr1rO', 'bscl-5@gmail.com', NULL, '674f7cfe0d069_kaka.png', NULL),
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
(23, 'holaaas', '$2y$10$1HgMC1TYJWNN4tFm5vbm.eY8bAmJWwSIgwstZNkn33sxH.TQLVCVe', 'bscl2006200ww7@gmail.com', NULL, 'perfil1.jpeg', NULL),
(24, 'brayan_cortes', '$2y$10$gv2pvMCicPPA9O6tC9Jz8.Q0qga9WZWJhQhXen9oK5WCYkb6Bja56', 'brayanstidcorteslombana@gmail.com', NULL, '674fbda95de36_Imagen de WhatsApp 2024-12-03 a las 21.25.16_87333a8c.jpg', NULL);

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
(201, 1, '$2y$10$RdYfR2h1bb2hUZ5cqwXNTu4.//MlHMuvi1x2VEr4CDwtYStkihmTi', 2, 1, 'en_juego', 0, NULL, '[]', '2024-12-03 20:09:25'),
(202, 1, '$2y$10$ndWrCo8KLPDWQ7Da8BsUtuJwnXnFwZe6Fm2xYddNbDOt7LgJNjENe', 2, 1, 'en_juego', 0, NULL, '[]', '2024-12-03 20:23:33'),
(203, 1, '$2y$10$2YW1YUMoyP//dl9DQ6b.PeOPGNFEguGNkDvlRlPtoHh69sAm04Tfq', 2, 2, 'en_juego', 0, NULL, '[]', '2024-12-03 20:38:49'),
(205, 11, '$2y$10$v4QRK9qTsRHKsi6cc3DIrew6Qj0TH3797cNkriIbP3d.TrluJamFG', 2, 1, 'esperando', 0, NULL, '[]', '2024-12-04 02:35:33');

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
  ADD KEY `id_sala` (`id_sala`),
  ADD KEY `jugador_origen` (`jugador_origen`),
  ADD KEY `jugador_destino` (`jugador_destino`);

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
  MODIFY `id_amistad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de la tabla `balotas`
--
ALTER TABLE `balotas`
  MODIFY `id_balota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7081;

--
-- AUTO_INCREMENT de la tabla `efectos_aplicados`
--
ALTER TABLE `efectos_aplicados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `jugador`
--
ALTER TABLE `jugador`
  MODIFY `id_jugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `jugadores_en_sala`
--
ALTER TABLE `jugadores_en_sala`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=333;

--
-- AUTO_INCREMENT de la tabla `partida`
--
ALTER TABLE `partida`
  MODIFY `id_partida` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registro_usuarios`
--
ALTER TABLE `registro_usuarios`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=206;

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
  ADD CONSTRAINT `efectos_aplicados_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON DELETE CASCADE,
  ADD CONSTRAINT `efectos_aplicados_ibfk_2` FOREIGN KEY (`jugador_origen`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE,
  ADD CONSTRAINT `efectos_aplicados_ibfk_3` FOREIGN KEY (`jugador_destino`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE;

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
