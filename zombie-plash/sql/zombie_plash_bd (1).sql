-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-12-2024 a las 06:39:20
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `generar_balotas_sala` (IN `p_id_sala` INT)   
BEGIN
    -- Limpiar balotas existentes
    DELETE FROM balotas WHERE id_sala = p_id_sala;
    
    -- Generar balotas para B (1-15)
    INSERT INTO balotas (id_sala, numero, letra)
    SELECT p_id_sala, n, 'B' FROM 
    (SELECT @row := @row + 1 as n FROM 
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) t1,
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2) t2,
     (SELECT @row := 0) t3 LIMIT 15) numbers;
    
    -- Generar balotas para I (16-30)
    INSERT INTO balotas (id_sala, numero, letra)
    SELECT p_id_sala, n + 15, 'I' FROM 
    (SELECT @row := @row + 1 as n FROM 
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) t1,
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2) t2,
     (SELECT @row := 0) t3 LIMIT 15) numbers;
     
    -- Generar balotas para N (31-45)
    INSERT INTO balotas (id_sala, numero, letra)
    SELECT p_id_sala, n + 30, 'N' FROM 
    (SELECT @row := @row + 1 as n FROM 
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) t1,
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2) t2,
     (SELECT @row := 0) t3 LIMIT 15) numbers;
     
    -- Generar balotas para G (46-60)
    INSERT INTO balotas (id_sala, numero, letra)
    SELECT p_id_sala, n + 45, 'G' FROM 
    (SELECT @row := @row + 1 as n FROM 
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) t1,
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2) t2,
     (SELECT @row := 0) t3 LIMIT 15) numbers;
     
    -- Generar balotas para O (61-75)
    INSERT INTO balotas (id_sala, numero, letra)
    SELECT p_id_sala, n + 60, 'O' FROM 
    (SELECT @row := @row + 1 as n FROM 
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4) t1,
     (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2) t2,
     (SELECT @row := 0) t3 LIMIT 15) numbers;
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
(1576, 242, 1, 'B', 0, NULL),
(1577, 242, 2, 'B', 0, NULL),
(1578, 242, 3, 'B', 0, NULL),
(1579, 242, 4, 'B', 0, NULL),
(1580, 242, 5, 'B', 0, NULL),
(1581, 242, 6, 'B', 0, NULL),
(1582, 242, 7, 'B', 0, NULL),
(1583, 242, 8, 'B', 1, 3),
(1584, 242, 9, 'B', 0, NULL),
(1585, 242, 10, 'B', 0, NULL),
(1586, 242, 11, 'B', 0, NULL),
(1587, 242, 12, 'B', 0, NULL),
(1588, 242, 13, 'B', 0, NULL),
(1589, 242, 14, 'B', 0, NULL),
(1590, 242, 15, 'B', 0, NULL),
(1591, 242, 16, 'I', 0, NULL),
(1592, 242, 17, 'I', 0, NULL),
(1593, 242, 18, 'I', 0, NULL),
(1594, 242, 19, 'I', 0, NULL),
(1595, 242, 20, 'I', 0, NULL),
(1596, 242, 21, 'I', 0, NULL),
(1597, 242, 22, 'I', 0, NULL),
(1598, 242, 23, 'I', 0, NULL),
(1599, 242, 24, 'I', 0, NULL),
(1600, 242, 25, 'I', 0, NULL),
(1601, 242, 26, 'I', 1, 1),
(1602, 242, 27, 'I', 0, NULL),
(1603, 242, 28, 'I', 0, NULL),
(1604, 242, 29, 'I', 0, NULL),
(1605, 242, 30, 'I', 0, NULL),
(1606, 242, 31, 'N', 0, NULL),
(1607, 242, 32, 'N', 0, NULL),
(1608, 242, 33, 'N', 0, NULL),
(1609, 242, 34, 'N', 0, NULL),
(1610, 242, 35, 'N', 0, NULL),
(1611, 242, 36, 'N', 0, NULL),
(1612, 242, 37, 'N', 0, NULL),
(1613, 242, 38, 'N', 0, NULL),
(1614, 242, 39, 'N', 0, NULL),
(1615, 242, 40, 'N', 0, NULL),
(1616, 242, 41, 'N', 0, NULL),
(1617, 242, 42, 'N', 1, 2),
(1618, 242, 43, 'N', 0, NULL),
(1619, 242, 44, 'N', 0, NULL),
(1620, 242, 45, 'N', 0, NULL),
(1621, 242, 46, 'G', 0, NULL),
(1622, 242, 47, 'G', 0, NULL),
(1623, 242, 48, 'G', 0, NULL),
(1624, 242, 49, 'G', 0, NULL),
(1625, 242, 50, 'G', 0, NULL),
(1626, 242, 51, 'G', 0, NULL),
(1627, 242, 52, 'G', 0, NULL),
(1628, 242, 53, 'G', 0, NULL),
(1629, 242, 54, 'G', 0, NULL),
(1630, 242, 55, 'G', 0, NULL),
(1631, 242, 56, 'G', 0, NULL),
(1632, 242, 57, 'G', 0, NULL),
(1633, 242, 58, 'G', 0, NULL),
(1634, 242, 59, 'G', 0, NULL),
(1635, 242, 60, 'G', 0, NULL),
(1636, 242, 61, 'O', 0, NULL),
(1637, 242, 62, 'O', 0, NULL),
(1638, 242, 63, 'O', 0, NULL),
(1639, 242, 64, 'O', 0, NULL),
(1640, 242, 65, 'O', 0, NULL),
(1641, 242, 66, 'O', 0, NULL),
(1642, 242, 67, 'O', 0, NULL),
(1643, 242, 68, 'O', 0, NULL),
(1644, 242, 69, 'O', 0, NULL),
(1645, 242, 70, 'O', 0, NULL),
(1646, 242, 71, 'O', 1, 4),
(1647, 242, 72, 'O', 0, NULL),
(1648, 242, 73, 'O', 0, NULL),
(1649, 242, 74, 'O', 0, NULL),
(1650, 242, 75, 'O', 0, NULL),
(1651, 243, 1, 'B', 1, 30),
(1652, 243, 2, 'B', 1, 72),
(1653, 243, 3, 'B', 1, 34),
(1654, 243, 4, 'B', 1, 14),
(1655, 243, 5, 'B', 1, 69),
(1656, 243, 6, 'B', 1, 49),
(1657, 243, 7, 'B', 1, 36),
(1658, 243, 8, 'B', 1, 57),
(1659, 243, 9, 'B', 1, 75),
(1660, 243, 10, 'B', 1, 62),
(1661, 243, 11, 'B', 1, 23),
(1662, 243, 12, 'B', 1, 13),
(1663, 243, 13, 'B', 1, 53),
(1664, 243, 14, 'B', 1, 46),
(1665, 243, 15, 'B', 1, 10),
(1666, 243, 16, 'I', 1, 15),
(1667, 243, 17, 'I', 1, 5),
(1668, 243, 18, 'I', 1, 60),
(1669, 243, 19, 'I', 1, 65),
(1670, 243, 20, 'I', 1, 71),
(1671, 243, 21, 'I', 1, 22),
(1672, 243, 22, 'I', 1, 37),
(1673, 243, 23, 'I', 1, 44),
(1674, 243, 24, 'I', 1, 20),
(1675, 243, 25, 'I', 1, 12),
(1676, 243, 26, 'I', 1, 21),
(1677, 243, 27, 'I', 1, 63),
(1678, 243, 28, 'I', 1, 68),
(1679, 243, 29, 'I', 1, 61),
(1680, 243, 30, 'I', 1, 51),
(1681, 243, 31, 'N', 1, 47),
(1682, 243, 32, 'N', 1, 31),
(1683, 243, 33, 'N', 1, 26),
(1684, 243, 34, 'N', 1, 9),
(1685, 243, 35, 'N', 1, 32),
(1686, 243, 36, 'N', 1, 52),
(1687, 243, 37, 'N', 1, 42),
(1688, 243, 38, 'N', 1, 56),
(1689, 243, 39, 'N', 1, 59),
(1690, 243, 40, 'N', 1, 8),
(1691, 243, 41, 'N', 1, 3),
(1692, 243, 42, 'N', 1, 54),
(1693, 243, 43, 'N', 1, 58),
(1694, 243, 44, 'N', 1, 6),
(1695, 243, 45, 'N', 1, 45),
(1696, 243, 46, 'G', 1, 4),
(1697, 243, 47, 'G', 1, 40),
(1698, 243, 48, 'G', 1, 38),
(1699, 243, 49, 'G', 1, 27),
(1700, 243, 50, 'G', 1, 24),
(1701, 243, 51, 'G', 1, 17),
(1702, 243, 52, 'G', 1, 66),
(1703, 243, 53, 'G', 1, 18),
(1704, 243, 54, 'G', 1, 73),
(1705, 243, 55, 'G', 1, 74),
(1706, 243, 56, 'G', 1, 70),
(1707, 243, 57, 'G', 1, 11),
(1708, 243, 58, 'G', 1, 50),
(1709, 243, 59, 'G', 1, 48),
(1710, 243, 60, 'G', 1, 19),
(1711, 243, 61, 'O', 1, 33),
(1712, 243, 62, 'O', 1, 28),
(1713, 243, 63, 'O', 1, 1),
(1714, 243, 64, 'O', 1, 64),
(1715, 243, 65, 'O', 1, 29),
(1716, 243, 66, 'O', 1, 7),
(1717, 243, 67, 'O', 1, 55),
(1718, 243, 68, 'O', 1, 2),
(1719, 243, 69, 'O', 1, 43),
(1720, 243, 70, 'O', 1, 39),
(1721, 243, 71, 'O', 1, 67),
(1722, 243, 72, 'O', 1, 41),
(1723, 243, 73, 'O', 1, 35),
(1724, 243, 74, 'O', 1, 25),
(1725, 243, 75, 'O', 1, 16);

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
(24, 242, 'oscuridad', 13, 15, 'activo', '2024-12-05 05:06:13', 10000),
(25, 243, 'oscuridad', 15, 13, 'activo', '2024-12-05 05:23:21', 10000);

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
(396, 242, 13, 'brayan_22', 'creador', '2024-12-05 05:06:13', NULL),
(397, 242, 15, 'bscl', 'participante', NULL, '2024-12-05 05:06:18'),
(398, 243, 13, 'brayan_22', 'creador', NULL, '2024-12-05 05:23:26'),
(399, 243, 15, 'bscl', 'participante', '2024-12-05 05:23:21', NULL);

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
(3, 242, 13, 30, 'I', '2024-12-05 05:10:17'),
(4, 242, 13, 31, 'N', '2024-12-05 05:10:26'),
(5, 242, 13, 29, 'I', '2024-12-05 05:10:32'),
(6, 242, 15, 3, 'B', '2024-12-05 05:11:01'),
(7, 242, 15, 49, 'G', '2024-12-05 05:11:21'),
(8, 242, 15, 58, 'G', '2024-12-05 05:12:16'),
(9, 242, 13, 69, 'O', '2024-12-05 05:12:29'),
(10, 242, 13, 45, 'N', '2024-12-05 05:12:45'),
(11, 243, 13, 32, 'N', '2024-12-05 05:24:07'),
(12, 243, 13, 73, 'O', '2024-12-05 05:24:24'),
(13, 243, 13, 6, 'B', '2024-12-05 05:25:26');

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
-- Estructura de tabla para la tabla `ranking_partida`
--

CREATE TABLE `ranking_partida` (
  `id_ranking` int(11) NOT NULL,
  `id_sala` int(11) NOT NULL,
  `id_jugador` int(11) NOT NULL,
  `posicion` int(11) NOT NULL,
  `numeros_acertados` int(11) NOT NULL,
  `tiempo_final` timestamp NOT NULL DEFAULT current_timestamp(),
  `carton_final` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`carton_final`))
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
(242, 13, '$2y$10$RUWCaV2eSjxt29VnHi2vvunYQ6LgY/2l3q3wdXedRkIMLiN9CT/SO', 2, 1, 'en_juego', 0, NULL, '[{\"numero\": \"30\", \"letra\": \"I\", \"orden\": \"3\"}, {\"numero\": \"31\", \"letra\": \"N\", \"orden\": \"6\"}, {\"numero\": \"29\", \"letra\": \"I\", \"orden\": \"8\"}, {\"numero\": \"3\", \"letra\": \"B\", \"orden\": \"15\"}, {\"numero\": \"49\", \"letra\": \"G\", \"orden\": \"20\"}, {\"numero\": \"58\", \"letra\": \"G\", \"orden\": \"32\"}, {\"numero\": \"69\", \"letra\": \"O\", \"orden\": \"35\"}, {\"numero\": \"45\", \"letra\": \"N\", \"orden\": \"39\"}]', '2024-12-05 05:12:45'),
(243, 13, '$2y$10$wPvzR2Bw6VZdLstijLvWTecKUpXJdvl/zYDQ3AazKH2Kmao82Br.W', 2, 2, 'en_juego', 0, NULL, '[{\"numero\": \"32\", \"letra\": \"N\", \"orden\": \"31\"}, {\"numero\": \"73\", \"letra\": \"O\", \"orden\": \"35\"}, {\"numero\": \"6\", \"letra\": \"B\", \"orden\": \"49\"}]', '2024-12-05 05:25:26');

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
-- Indices de la tabla `ranking_partida`
--
ALTER TABLE `ranking_partida`
  ADD PRIMARY KEY (`id_ranking`),
  ADD KEY `id_sala` (`id_sala`),
  ADD KEY `id_jugador` (`id_jugador`);

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
  MODIFY `id_balota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1726;

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
  MODIFY `id_efecto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=400;

--
-- AUTO_INCREMENT de la tabla `numeros_seleccionados`
--
ALTER TABLE `numeros_seleccionados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `partida`
--
ALTER TABLE `partida`
  MODIFY `id_partida` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `ranking_partida`
--
ALTER TABLE `ranking_partida`
  MODIFY `id_ranking` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `registro_usuarios`
--
ALTER TABLE `registro_usuarios`
  MODIFY `id_registro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=244;

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
-- Filtros para la tabla `ranking_partida`
--
ALTER TABLE `ranking_partida`
  ADD CONSTRAINT `ranking_partida_ibfk_1` FOREIGN KEY (`id_sala`) REFERENCES `salas` (`id_sala`) ON DELETE CASCADE,
  ADD CONSTRAINT `ranking_partida_ibfk_2` FOREIGN KEY (`id_jugador`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE;

--
-- Filtros para la tabla `salas`
--
ALTER TABLE `salas`
  ADD CONSTRAINT `fk_id_creador` FOREIGN KEY (`id_creador`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
