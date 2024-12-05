-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-12-2024 a las 05:55:18
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `generar_balotas_sala` (IN `p_id_sala` INT)   BEGIN
    -- Limpiar balotas existentes
    DELETE FROM balotas WHERE id_sala = p_id_sala;
    
    -- Generar nuevas balotas
    -- B: 1-15
    INSERT INTO balotas (id_sala, numero, letra)
    SELECT p_id_sala, n, 'B' FROM 
    (SELECT @row := @row + 1 as n FROM 
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) t1,
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2) t2,
     (SELECT @row := 0) t3 LIMIT 15) numbers;
    
    -- I: 16-30
    INSERT INTO balotas (id_sala, numero, letra)
    SELECT p_id_sala, n + 15, 'I' FROM 
    (SELECT @row := @row + 1 as n FROM 
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) t1,
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2) t2,
     (SELECT @row := 0) t3 LIMIT 15) numbers;
     
    -- Continuar con N, G, O...
END$$

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
(17, 27, 26, '2024-12-04 18:22:49'),
(18, 27, 28, '2024-12-04 19:24:43');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `balotas`
--

CREATE TABLE `balotas` (
  `id_balota` int(11) NOT NULL,
  `id_sala` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  `letra` char(1) NOT NULL,
  `estado` tinyint(4) DEFAULT 0,
  `orden_salida` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `balotas`
--

INSERT INTO `balotas` (`id_balota`, `id_sala`, `numero`, `letra`, `estado`, `orden_salida`) VALUES
(76, 239, 1, 'B', 0, NULL),
(77, 239, 2, 'B', 0, NULL),
(78, 239, 3, 'B', 1, 25),
(79, 239, 4, 'B', 1, 11),
(80, 239, 5, 'B', 0, NULL),
(81, 239, 6, 'B', 0, NULL),
(82, 239, 7, 'B', 0, NULL),
(83, 239, 8, 'B', 1, 2),
(84, 239, 9, 'B', 0, NULL),
(85, 239, 10, 'B', 0, NULL),
(86, 239, 11, 'B', 0, NULL),
(87, 239, 12, 'B', 0, NULL),
(88, 239, 13, 'B', 0, NULL),
(89, 239, 14, 'B', 0, NULL),
(90, 239, 15, 'B', 0, NULL),
(91, 239, 16, 'I', 0, NULL),
(92, 239, 17, 'I', 1, 10),
(93, 239, 18, 'I', 0, NULL),
(94, 239, 19, 'I', 1, 24),
(95, 239, 20, 'I', 0, NULL),
(96, 239, 21, 'I', 0, NULL),
(97, 239, 22, 'I', 0, NULL),
(98, 239, 23, 'I', 0, NULL),
(99, 239, 24, 'I', 1, 18),
(100, 239, 25, 'I', 0, NULL),
(101, 239, 26, 'I', 0, NULL),
(102, 239, 27, 'I', 0, NULL),
(103, 239, 28, 'I', 1, 1),
(104, 239, 29, 'I', 0, NULL),
(105, 239, 30, 'I', 1, 7),
(106, 239, 31, 'N', 0, NULL),
(107, 239, 32, 'N', 1, 13),
(108, 239, 33, 'N', 1, 3),
(109, 239, 34, 'N', 0, NULL),
(110, 239, 35, 'N', 1, 9),
(111, 239, 36, 'N', 1, 6),
(112, 239, 37, 'N', 0, NULL),
(113, 239, 38, 'N', 1, 14),
(114, 239, 39, 'N', 1, 17),
(115, 239, 40, 'N', 0, NULL),
(116, 239, 41, 'N', 0, NULL),
(117, 239, 42, 'N', 0, NULL),
(118, 239, 43, 'N', 0, NULL),
(119, 239, 44, 'N', 1, 21),
(120, 239, 45, 'N', 0, NULL),
(121, 239, 46, 'G', 1, 4),
(122, 239, 47, 'G', 0, NULL),
(123, 239, 48, 'G', 0, NULL),
(124, 239, 49, 'G', 0, NULL),
(125, 239, 50, 'G', 1, 19),
(126, 239, 51, 'G', 0, NULL),
(127, 239, 52, 'G', 0, NULL),
(128, 239, 53, 'G', 1, 26),
(129, 239, 54, 'G', 0, NULL),
(130, 239, 55, 'G', 0, NULL),
(131, 239, 56, 'G', 0, NULL),
(132, 239, 57, 'G', 0, NULL),
(133, 239, 58, 'G', 0, NULL),
(134, 239, 59, 'G', 1, 22),
(135, 239, 60, 'G', 1, 15),
(136, 239, 61, 'O', 1, 8),
(137, 239, 62, 'O', 0, NULL),
(138, 239, 63, 'O', 1, 12),
(139, 239, 64, 'O', 1, 20),
(140, 239, 65, 'O', 1, 23),
(141, 239, 66, 'O', 0, NULL),
(142, 239, 67, 'O', 0, NULL),
(143, 239, 68, 'O', 0, NULL),
(144, 239, 69, 'O', 0, NULL),
(145, 239, 70, 'O', 1, 16),
(146, 239, 71, 'O', 0, NULL),
(147, 239, 72, 'O', 1, 5),
(148, 239, 73, 'O', 0, NULL),
(149, 239, 74, 'O', 0, NULL),
(150, 239, 75, 'O', 0, NULL),
(901, 240, 1, 'B', 0, NULL),
(902, 240, 2, 'B', 1, 4),
(903, 240, 3, 'B', 0, NULL),
(904, 240, 4, 'B', 0, NULL),
(905, 240, 5, 'B', 0, NULL),
(906, 240, 6, 'B', 0, NULL),
(907, 240, 7, 'B', 0, NULL),
(908, 240, 8, 'B', 0, NULL),
(909, 240, 9, 'B', 0, NULL),
(910, 240, 10, 'B', 0, NULL),
(911, 240, 11, 'B', 0, NULL),
(912, 240, 12, 'B', 1, 6),
(913, 240, 13, 'B', 0, NULL),
(914, 240, 14, 'B', 1, 5),
(915, 240, 15, 'B', 0, NULL),
(916, 240, 16, 'I', 0, NULL),
(917, 240, 17, 'I', 0, NULL),
(918, 240, 18, 'I', 0, NULL),
(919, 240, 19, 'I', 0, NULL),
(920, 240, 20, 'I', 0, NULL),
(921, 240, 21, 'I', 0, NULL),
(922, 240, 22, 'I', 0, NULL),
(923, 240, 23, 'I', 0, NULL),
(924, 240, 24, 'I', 0, NULL),
(925, 240, 25, 'I', 0, NULL),
(926, 240, 26, 'I', 0, NULL),
(927, 240, 27, 'I', 0, NULL),
(928, 240, 28, 'I', 0, NULL),
(929, 240, 29, 'I', 1, 11),
(930, 240, 30, 'I', 0, NULL),
(931, 240, 31, 'N', 1, 3),
(932, 240, 32, 'N', 1, 1),
(933, 240, 33, 'N', 1, 7),
(934, 240, 34, 'N', 0, NULL),
(935, 240, 35, 'N', 1, 8),
(936, 240, 36, 'N', 0, NULL),
(937, 240, 37, 'N', 0, NULL),
(938, 240, 38, 'N', 1, 10),
(939, 240, 39, 'N', 0, NULL),
(940, 240, 40, 'N', 0, NULL),
(941, 240, 41, 'N', 0, NULL),
(942, 240, 42, 'N', 0, NULL),
(943, 240, 43, 'N', 0, NULL),
(944, 240, 44, 'N', 0, NULL),
(945, 240, 45, 'N', 0, NULL),
(946, 240, 46, 'G', 0, NULL),
(947, 240, 47, 'G', 0, NULL),
(948, 240, 48, 'G', 0, NULL),
(949, 240, 49, 'G', 0, NULL),
(950, 240, 50, 'G', 0, NULL),
(951, 240, 51, 'G', 0, NULL),
(952, 240, 52, 'G', 0, NULL),
(953, 240, 53, 'G', 0, NULL),
(954, 240, 54, 'G', 0, NULL),
(955, 240, 55, 'G', 0, NULL),
(956, 240, 56, 'G', 0, NULL),
(957, 240, 57, 'G', 1, 13),
(958, 240, 58, 'G', 1, 12),
(959, 240, 59, 'G', 1, 2),
(960, 240, 60, 'G', 0, NULL),
(961, 240, 61, 'O', 0, NULL),
(962, 240, 62, 'O', 0, NULL),
(963, 240, 63, 'O', 0, NULL),
(964, 240, 64, 'O', 0, NULL),
(965, 240, 65, 'O', 0, NULL),
(966, 240, 66, 'O', 0, NULL),
(967, 240, 67, 'O', 0, NULL),
(968, 240, 68, 'O', 0, NULL),
(969, 240, 69, 'O', 1, 9),
(970, 240, 70, 'O', 0, NULL),
(971, 240, 71, 'O', 0, NULL),
(972, 240, 72, 'O', 0, NULL),
(973, 240, 73, 'O', 0, NULL),
(974, 240, 74, 'O', 0, NULL),
(975, 240, 75, 'O', 0, NULL),
(1351, 241, 1, 'B', 1, 19),
(1352, 241, 2, 'B', 1, 53),
(1353, 241, 3, 'B', 1, 2),
(1354, 241, 4, 'B', 1, 64),
(1355, 241, 5, 'B', 1, 38),
(1356, 241, 6, 'B', 1, 29),
(1357, 241, 7, 'B', 1, 36),
(1358, 241, 8, 'B', 1, 74),
(1359, 241, 9, 'B', 1, 15),
(1360, 241, 10, 'B', 1, 56),
(1361, 241, 11, 'B', 1, 52),
(1362, 241, 12, 'B', 1, 18),
(1363, 241, 13, 'B', 1, 22),
(1364, 241, 14, 'B', 1, 37),
(1365, 241, 15, 'B', 1, 55),
(1366, 241, 16, 'I', 1, 9),
(1367, 241, 17, 'I', 1, 7),
(1368, 241, 18, 'I', 1, 69),
(1369, 241, 19, 'I', 1, 49),
(1370, 241, 20, 'I', 1, 40),
(1371, 241, 21, 'I', 1, 25),
(1372, 241, 22, 'I', 1, 65),
(1373, 241, 23, 'I', 1, 66),
(1374, 241, 24, 'I', 1, 1),
(1375, 241, 25, 'I', 1, 47),
(1376, 241, 26, 'I', 1, 12),
(1377, 241, 27, 'I', 1, 4),
(1378, 241, 28, 'I', 1, 45),
(1379, 241, 29, 'I', 1, 46),
(1380, 241, 30, 'I', 1, 63),
(1381, 241, 31, 'N', 1, 62),
(1382, 241, 32, 'N', 1, 20),
(1383, 241, 33, 'N', 1, 50),
(1384, 241, 34, 'N', 1, 71),
(1385, 241, 35, 'N', 1, 3),
(1386, 241, 36, 'N', 1, 39),
(1387, 241, 37, 'N', 1, 28),
(1388, 241, 38, 'N', 1, 23),
(1389, 241, 39, 'N', 1, 73),
(1390, 241, 40, 'N', 1, 30),
(1391, 241, 41, 'N', 1, 61),
(1392, 241, 42, 'N', 1, 31),
(1393, 241, 43, 'N', 1, 70),
(1394, 241, 44, 'N', 1, 8),
(1395, 241, 45, 'N', 1, 51),
(1396, 241, 46, 'G', 1, 35),
(1397, 241, 47, 'G', 1, 34),
(1398, 241, 48, 'G', 1, 16),
(1399, 241, 49, 'G', 1, 26),
(1400, 241, 50, 'G', 1, 44),
(1401, 241, 51, 'G', 1, 11),
(1402, 241, 52, 'G', 1, 72),
(1403, 241, 53, 'G', 1, 68),
(1404, 241, 54, 'G', 1, 33),
(1405, 241, 55, 'G', 1, 14),
(1406, 241, 56, 'G', 1, 27),
(1407, 241, 57, 'G', 1, 75),
(1408, 241, 58, 'G', 1, 43),
(1409, 241, 59, 'G', 1, 48),
(1410, 241, 60, 'G', 1, 10),
(1411, 241, 61, 'O', 1, 59),
(1412, 241, 62, 'O', 1, 42),
(1413, 241, 63, 'O', 1, 54),
(1414, 241, 64, 'O', 1, 17),
(1415, 241, 65, 'O', 1, 67),
(1416, 241, 66, 'O', 1, 21),
(1417, 241, 67, 'O', 1, 60),
(1418, 241, 68, 'O', 1, 57),
(1419, 241, 69, 'O', 1, 41),
(1420, 241, 70, 'O', 1, 58),
(1421, 241, 71, 'O', 1, 5),
(1422, 241, 72, 'O', 1, 32),
(1423, 241, 73, 'O', 1, 24),
(1424, 241, 74, 'O', 1, 13),
(1425, 241, 75, 'O', 1, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cartones_jugadores`
--

CREATE TABLE `cartones_jugadores` (
  `id_carton` int(11) NOT NULL,
  `id_sala` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `numeros` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`numeros`)),
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `casillas_marcadas`
--

CREATE TABLE `casillas_marcadas` (
  `id_marcada` int(11) NOT NULL,
  `id_sala` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  `letra` char(1) NOT NULL,
  `fecha_marcado` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `efectos_activos`
--

CREATE TABLE `efectos_activos` (
  `id_efecto` int(11) NOT NULL,
  `id_sala` int(11) NOT NULL,
  `tipo_efecto` varchar(50) NOT NULL,
  `jugador_origen` int(11) NOT NULL,
  `jugador_destino` int(11) NOT NULL,
  `estado` enum('pendiente','activo','completado') DEFAULT 'pendiente',
  `tiempo_inicio` timestamp NOT NULL DEFAULT current_timestamp(),
  `duracion` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `efectos_activos`
--

INSERT INTO `efectos_activos` (`id_efecto`, `id_sala`, `tipo_efecto`, `jugador_origen`, `jugador_destino`, `estado`, `tiempo_inicio`, `duracion`) VALUES
(1, 240, 'oscuridad', 13, 15, 'pendiente', '2024-12-05 03:37:03', 10000),
(2, 240, 'oscuridad', 13, 15, 'pendiente', '2024-12-05 03:47:19', 10000),
(3, 240, 'oscuridad', 13, 15, 'activo', '2024-12-05 03:51:00', 10000),
(4, 240, 'oscuridad', 13, 15, 'activo', '2024-12-05 03:58:17', 10000),
(5, 240, 'oscuridad', 15, 13, 'activo', '2024-12-05 03:58:45', 10000),
(6, 241, 'oscuridad', 15, 13, 'activo', '2024-12-05 04:00:30', 10000),
(7, 241, 'oscuridad', 13, 15, 'activo', '2024-12-05 04:00:45', 10000),
(8, 241, 'numeros', 13, 15, 'activo', '2024-12-05 04:00:50', 10000),
(9, 241, 'elige_numero', 13, 15, 'activo', '2024-12-05 04:00:52', 10000),
(10, 241, 'numeros', 15, 13, 'activo', '2024-12-05 04:00:54', 10000),
(11, 241, 'elige_numero', 15, 13, 'activo', '2024-12-05 04:00:56', 10000),
(12, 241, 'oscuridad', 15, 13, 'activo', '2024-12-05 04:11:27', 10000),
(13, 241, 'oscuridad', 13, 15, 'activo', '2024-12-05 04:11:43', 10000),
(14, 241, 'numeros', 13, 15, 'activo', '2024-12-05 04:12:23', 10000),
(15, 241, 'numeros', 15, 13, 'activo', '2024-12-05 04:12:37', 10000),
(16, 241, 'elige_numero', 13, 15, 'activo', '2024-12-05 04:12:52', 10000),
(17, 241, 'oscuridad', 15, 13, 'activo', '2024-12-05 04:22:29', 10000),
(18, 241, 'numeros', 13, 15, 'activo', '2024-12-05 04:22:46', 10000),
(19, 241, 'elige_numero', 13, 15, 'activo', '2024-12-05 04:25:00', 10000),
(20, 241, 'elige_numero', 13, 15, 'activo', '2024-12-05 04:31:05', 10000),
(21, 241, 'numeros', 13, 15, 'activo', '2024-12-05 04:38:47', 10000),
(22, 241, 'numeros', 15, 13, 'activo', '2024-12-05 04:49:26', 10000),
(23, 241, 'oscuridad', 13, 15, 'activo', '2024-12-05 04:49:32', 10000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `efectos_aplicados`
--

CREATE TABLE `efectos_aplicados` (
  `id_efecto` int(11) NOT NULL,
  `id_sala` int(11) NOT NULL,
  `tipo_efecto` varchar(50) NOT NULL,
  `jugador_origen` int(11) NOT NULL,
  `jugador_destino` int(11) NOT NULL,
  `duracion` int(11) NOT NULL,
  `fecha_aplicacion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `efectos_aplicados`
--

INSERT INTO `efectos_aplicados` (`id_efecto`, `id_sala`, `tipo_efecto`, `jugador_origen`, `jugador_destino`, `duracion`, `fecha_aplicacion`) VALUES
(1, 240, 'oscuridad', 13, 15, 10000, '2024-12-05 03:16:27'),
(2, 240, 'oscuridad', 13, 15, 10000, '2024-12-05 03:34:07');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `efectos_procesados`
--

CREATE TABLE `efectos_procesados` (
  `id` int(11) NOT NULL,
  `id_efecto` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `fecha_proceso` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estado_juego`
--

CREATE TABLE `estado_juego` (
  `id_sala` int(11) NOT NULL,
  `estado` enum('esperando','jugando','finalizado') DEFAULT 'esperando',
  `ultima_balota_id` int(11) DEFAULT NULL,
  `ultima_actualizacion` timestamp NOT NULL DEFAULT current_timestamp()
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
(13, 'brayan_cortes_2', NULL, 27),
(14, 'brayan_cortes', NULL, 26),
(15, 'bscl', NULL, 28);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `jugadores_en_sala`
--

CREATE TABLE `jugadores_en_sala` (
  `id` int(11) NOT NULL,
  `id_sala` int(11) DEFAULT NULL,
  `id_jugador` int(11) DEFAULT NULL,
  `nombre_jugador` varchar(255) DEFAULT NULL,
  `rol` enum('creador','participante') DEFAULT 'participante',
  `ultimo_poder_usado` timestamp NULL DEFAULT NULL,
  `poder_bloqueado_hasta` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `jugadores_en_sala`
--

INSERT INTO `jugadores_en_sala` (`id`, `id_sala`, `id_jugador`, `nombre_jugador`, `rol`, `ultimo_poder_usado`, `poder_bloqueado_hasta`) VALUES
(382, 235, 14, 'brayan_cortes', 'creador', NULL, NULL),
(383, 235, 13, 'brayan_22', 'participante', NULL, NULL),
(384, 236, 14, 'brayan_cortes', 'creador', NULL, NULL),
(385, 236, 13, 'brayan_22', 'participante', NULL, NULL),
(386, 237, 13, 'brayan_22', 'creador', NULL, NULL),
(387, 237, 15, 'bscl', 'participante', NULL, NULL),
(388, 238, 13, 'brayan_22', 'creador', NULL, NULL),
(389, 238, 15, 'bscl', 'participante', NULL, NULL),
(390, 239, 13, 'brayan_22', 'creador', NULL, NULL),
(391, 239, 15, 'bscl', 'participante', NULL, NULL),
(392, 240, 13, 'brayan_22', 'creador', NULL, NULL),
(393, 240, 15, 'bscl', 'participante', NULL, NULL),
(394, 241, 13, 'brayan_22', 'creador', '2024-12-05 04:49:32', '2024-12-05 04:49:31'),
(395, 241, 15, 'bscl', 'participante', '2024-12-05 04:49:26', '2024-12-05 04:49:37');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `numeros_seleccionados`
--

CREATE TABLE `numeros_seleccionados` (
  `id` int(11) NOT NULL,
  `id_sala` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  `letra` char(1) NOT NULL,
  `fecha_seleccion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `numeros_seleccionados`
--

INSERT INTO `numeros_seleccionados` (`id`, `id_sala`, `id_jugador`, `numero`, `letra`, `fecha_seleccion`) VALUES
(1, 241, 15, 3, 'B', '2024-12-05 04:31:10'),
(2, 241, 15, 26, 'I', '2024-12-05 04:38:17');

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
(26, 'brayan_cortes', '$2y$10$4Q1Rq4uV/04nQhLmIZVLReaDRiIa.2rOi/DJsYqQAM8AC41N8nuTq', 'brayanstidcorteslombana@gmail.com', NULL, '6750ad950f0f1_Imagen de WhatsApp 2024-12-03 a las 21.25.16_87333a8c.jpg', NULL),
(27, 'brayan_22', '$2y$10$qUFDBmK4uc2eJCU2/onWQurJtsBw4T7L/QSJvkcvA2I6myOB32aOy', 'elmundodelanime92@gmail.com', NULL, '6750a413917b1_images.jpg', NULL),
(28, 'bscl', '$2y$10$YiyAg4oXeCsWzyA60SrZYe3VvITZykjZZ9wPHL3LS0g4lwxUNPVOO', 'bscl20062007@gmail.com', NULL, 'perfil1.jpeg', NULL);

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
(235, 14, '$2y$10$4Y/5r9SX8aiAWag7OyoQMOyH7uDtopfNaLqN3JmxxXwzDq5Jdd1HC', 2, 2, 'en_juego', 0, NULL, '[]', '2024-12-04 23:53:01'),
(236, 14, '$2y$10$y63PMi3/BJ66k6T3WVUuyeSVfZYKfqg1cT2/BOAFOSWQTV2o6bIIy', 2, 2, 'esperando', 0, NULL, '[]', '2024-12-05 00:04:20'),
(237, 13, '$2y$10$p3oSuqEgki5vEpBDMcVfGuamVm1k465dl3fcyX2s/xHciJy2cz3fa', 2, 2, 'en_juego', 0, NULL, '[]', '2024-12-05 02:00:15'),
(238, 13, '$2y$10$QxU0.SzWHBiCBo2TpnQKPeD0bRkUP1Z0kQTu/nH5NF8dl4iJNzDJe', 2, 2, 'en_juego', 0, NULL, '[]', '2024-12-05 02:16:31'),
(239, 13, '$2y$10$LSz1Sbxi51RA.3EQCw7Hs.43Xoh72Gu0Tp40l1lnYlZ8.W15A5dDS', 2, 0, 'en_juego', 0, NULL, '[]', '2024-12-05 02:19:43'),
(240, 13, '$2y$10$DDtnrV/CXkYUyfWFssIXNu0MHTcU0cZm74PporG2nWVaCgA9t5ONm', 2, 0, 'en_juego', 0, NULL, '[]', '2024-12-05 02:55:20'),
(241, 13, '$2y$10$oFKCJbYEZRM7U10OLTRfn.LGIprjnnxNJlr6L4e3JNQIQsJSCO.BO', 2, 2, 'en_juego', 0, NULL, '[{\"numero\": \"26\", \"letra\": \"I\", \"orden\": \"3\"}]', '2024-12-05 04:38:17');

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
-- Indices de la tabla `cartones_jugadores`
--
ALTER TABLE `cartones_jugadores`
  ADD PRIMARY KEY (`id_carton`),
  ADD KEY `id_sala` (`id_sala`),
  ADD KEY `id_jugador` (`id_jugador`);

--
-- Indices de la tabla `casillas_marcadas`
--
ALTER TABLE `casillas_marcadas`
  ADD PRIMARY KEY (`id_marcada`),
  ADD KEY `id_sala` (`id_sala`),
  ADD KEY `id_jugador` (`id_jugador`);

--
-- Indices de la tabla `efectos_activos`
--
ALTER TABLE `efectos_activos`
  ADD PRIMARY KEY (`id_efecto`),
  ADD KEY `id_sala` (`id_sala`),
  ADD KEY `jugador_origen` (`jugador_origen`),
  ADD KEY `jugador_destino` (`jugador_destino`);

--
-- Indices de la tabla `efectos_aplicados`
--
ALTER TABLE `efectos_aplicados`
  ADD PRIMARY KEY (`id_efecto`),
  ADD KEY `id_sala` (`id_sala`),
  ADD KEY `jugador_origen` (`jugador_origen`),
  ADD KEY `jugador_destino` (`jugador_destino`);

--
-- Indices de la tabla `efectos_procesados`
--
ALTER TABLE `efectos_procesados`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_efecto` (`id_efecto`),
  ADD KEY `id_jugador` (`id_jugador`);

--
-- Indices de la tabla `estado_juego`
--
ALTER TABLE `estado_juego`
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
-- Indices de la tabla `numeros_seleccionados`
--
ALTER TABLE `numeros_seleccionados`
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
  MODIFY `id_amistad` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT de la tabla `balotas`
--
ALTER TABLE `balotas`
  MODIFY `id_balota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1426;

--
-- AUTO_INCREMENT de la tabla `cartones_jugadores`
--
ALTER TABLE `cartones_jugadores`
  MODIFY `id_carton` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `casillas_marcadas`
--
ALTER TABLE `casillas_marcadas`
  MODIFY `id_marcada` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `efectos_activos`
--
ALTER TABLE `efectos_activos`
  MODIFY `id_efecto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT de la tabla `efectos_aplicados`
--
ALTER TABLE `efectos_aplicados`
  MODIFY `id_efecto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `efectos_procesados`
--
ALTER TABLE `efectos_procesados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `jugador`
--
ALTER TABLE `jugador`
  MODIFY `id_jugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT de la tabla `jugadores_en_sala`
--
ALTER TABLE `jugadores_en_sala`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=396;

--
-- AUTO_INCREMENT de la tabla `numeros_seleccionados`
--
ALTER TABLE `numeros_seleccionados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `partida`
--
ALTER TABLE `partida`
  MODIFY `id_partida` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registro_usuarios`
--
ALTER TABLE `registro_usuarios`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=242;

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
  ADD CONSTRAINT `balotas_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON DELETE CASCADE;

--
-- Filtros para la tabla `cartones_jugadores`
--
ALTER TABLE `cartones_jugadores`
  ADD CONSTRAINT `cartones_jugadores_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON DELETE CASCADE,
  ADD CONSTRAINT `cartones_jugadores_ibfk_2` FOREIGN KEY (`id_jugador`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE;

--
-- Filtros para la tabla `casillas_marcadas`
--
ALTER TABLE `casillas_marcadas`
  ADD CONSTRAINT `casillas_marcadas_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON DELETE CASCADE,
  ADD CONSTRAINT `casillas_marcadas_ibfk_2` FOREIGN KEY (`id_jugador`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE;

--
-- Filtros para la tabla `efectos_activos`
--
ALTER TABLE `efectos_activos`
  ADD CONSTRAINT `efectos_activos_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON DELETE CASCADE,
  ADD CONSTRAINT `efectos_activos_ibfk_2` FOREIGN KEY (`jugador_origen`) REFERENCES `jugador` (`id_jugador`),
  ADD CONSTRAINT `efectos_activos_ibfk_3` FOREIGN KEY (`jugador_destino`) REFERENCES `jugador` (`id_jugador`);

--
-- Filtros para la tabla `efectos_aplicados`
--
ALTER TABLE `efectos_aplicados`
  ADD CONSTRAINT `efectos_aplicados_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON DELETE CASCADE,
  ADD CONSTRAINT `efectos_aplicados_ibfk_2` FOREIGN KEY (`jugador_origen`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE,
  ADD CONSTRAINT `efectos_aplicados_ibfk_3` FOREIGN KEY (`jugador_destino`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE;

--
-- Filtros para la tabla `efectos_procesados`
--
ALTER TABLE `efectos_procesados`
  ADD CONSTRAINT `efectos_procesados_ibfk_1` FOREIGN KEY (`id_efecto`) REFERENCES `efectos_aplicados` (`id_efecto`) ON DELETE CASCADE,
  ADD CONSTRAINT `efectos_procesados_ibfk_2` FOREIGN KEY (`id_jugador`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE;

--
-- Filtros para la tabla `estado_juego`
--
ALTER TABLE `estado_juego`
  ADD CONSTRAINT `estado_juego_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON DELETE CASCADE;

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
-- Filtros para la tabla `numeros_seleccionados`
--
ALTER TABLE `numeros_seleccionados`
  ADD CONSTRAINT `numeros_seleccionados_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON DELETE CASCADE,
  ADD CONSTRAINT `numeros_seleccionados_ibfk_2` FOREIGN KEY (`id_jugador`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE;

--
-- Filtros para la tabla `partida`
--
ALTER TABLE `partida`
  ADD CONSTRAINT `partida_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`),
  ADD CONSTRAINT `partida_ibfk_2` FOREIGN KEY (`id_ganador`) REFERENCES `jugador` (`id_jugador`);

--
-- Filtros para la tabla `salas`
--
ALTER TABLE `salas`
  ADD CONSTRAINT `fk_id_creador` FOREIGN KEY (`id_creador`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;