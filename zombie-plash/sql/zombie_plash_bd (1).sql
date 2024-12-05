-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 05-12-2024 a las 09:45:08
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
(3601, 250, 1, 'B', 0, NULL),
(3602, 250, 2, 'B', 0, NULL),
(3603, 250, 3, 'B', 0, NULL),
(3604, 250, 4, 'B', 0, NULL),
(3605, 250, 5, 'B', 0, NULL),
(3606, 250, 6, 'B', 0, NULL),
(3607, 250, 7, 'B', 0, NULL),
(3608, 250, 8, 'B', 0, NULL),
(3609, 250, 9, 'B', 0, NULL),
(3610, 250, 10, 'B', 0, NULL),
(3611, 250, 11, 'B', 0, NULL),
(3612, 250, 12, 'B', 0, NULL),
(3613, 250, 13, 'B', 0, NULL),
(3614, 250, 14, 'B', 0, NULL),
(3615, 250, 15, 'B', 0, NULL),
(3616, 250, 16, 'I', 0, NULL),
(3617, 250, 17, 'I', 0, NULL),
(3618, 250, 18, 'I', 0, NULL),
(3619, 250, 19, 'I', 0, NULL),
(3620, 250, 20, 'I', 0, NULL),
(3621, 250, 21, 'I', 1, 2),
(3622, 250, 22, 'I', 0, NULL),
(3623, 250, 23, 'I', 0, NULL),
(3624, 250, 24, 'I', 0, NULL),
(3625, 250, 25, 'I', 0, NULL),
(3626, 250, 26, 'I', 0, NULL),
(3627, 250, 27, 'I', 0, NULL),
(3628, 250, 28, 'I', 0, NULL),
(3629, 250, 29, 'I', 0, NULL),
(3630, 250, 30, 'I', 1, 3),
(3631, 250, 31, 'N', 0, NULL),
(3632, 250, 32, 'N', 0, NULL),
(3633, 250, 33, 'N', 0, NULL),
(3634, 250, 34, 'N', 0, NULL),
(3635, 250, 35, 'N', 0, NULL),
(3636, 250, 36, 'N', 0, NULL),
(3637, 250, 37, 'N', 0, NULL),
(3638, 250, 38, 'N', 0, NULL),
(3639, 250, 39, 'N', 0, NULL),
(3640, 250, 40, 'N', 0, NULL),
(3641, 250, 41, 'N', 0, NULL),
(3642, 250, 42, 'N', 0, NULL),
(3643, 250, 43, 'N', 0, NULL),
(3644, 250, 44, 'N', 0, NULL),
(3645, 250, 45, 'N', 1, 1),
(3646, 250, 46, 'G', 0, NULL),
(3647, 250, 47, 'G', 0, NULL),
(3648, 250, 48, 'G', 0, NULL),
(3649, 250, 49, 'G', 0, NULL),
(3650, 250, 50, 'G', 0, NULL),
(3651, 250, 51, 'G', 0, NULL),
(3652, 250, 52, 'G', 0, NULL),
(3653, 250, 53, 'G', 0, NULL),
(3654, 250, 54, 'G', 0, NULL),
(3655, 250, 55, 'G', 0, NULL),
(3656, 250, 56, 'G', 0, NULL),
(3657, 250, 57, 'G', 0, NULL),
(3658, 250, 58, 'G', 0, NULL),
(3659, 250, 59, 'G', 0, NULL),
(3660, 250, 60, 'G', 0, NULL),
(3661, 250, 61, 'O', 0, NULL),
(3662, 250, 62, 'O', 0, NULL),
(3663, 250, 63, 'O', 0, NULL),
(3664, 250, 64, 'O', 0, NULL),
(3665, 250, 65, 'O', 0, NULL),
(3666, 250, 66, 'O', 0, NULL),
(3667, 250, 67, 'O', 0, NULL),
(3668, 250, 68, 'O', 0, NULL),
(3669, 250, 69, 'O', 0, NULL),
(3670, 250, 70, 'O', 0, NULL),
(3671, 250, 71, 'O', 0, NULL),
(3672, 250, 72, 'O', 0, NULL),
(3673, 250, 73, 'O', 0, NULL),
(3674, 250, 74, 'O', 0, NULL),
(3675, 250, 75, 'O', 0, NULL);

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
(412, 250, 13, 'brayan_22', 'creador', NULL, NULL),
(413, 250, 14, 'brayan_cortes', 'participante', NULL, NULL);

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
  `ultimo_numero_sacado` timestamp NOT NULL DEFAULT current_timestamp(),
  `ganador_id` int(11) DEFAULT NULL,
  `ranking` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`ranking`)),
  `ganador_nombre` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `salas`
--

INSERT INTO `salas` (`id_sala`, `id_creador`, `contraseña`, `max_jugadores`, `jugadores_unidos`, `estado`, `jugando`, `efectos`, `numeros_sacados`, `ultimo_numero_sacado`, `ganador_id`, `ranking`, `ganador_nombre`) VALUES
(250, 13, '$2y$10$ftPcpIGKeyRclSo1zQD.1OfzH0NjCjlcvxOzpklPlQ4Ka5fCE.bDq', 2, 2, 'finalizado', 0, NULL, '[]', '2024-12-05 08:42:37', 14, '[{\"nombre_jugador\":\"brayan_22\",\"aciertos\":3},{\"nombre_jugador\":\"brayan_cortes\",\"aciertos\":3}]', 'brayan_cortes');

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
  MODIFY `id_balota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3676;

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
  MODIFY `id_efecto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=414;

--
-- AUTO_INCREMENT de la tabla `numeros_seleccionados`
--
ALTER TABLE `numeros_seleccionados`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `partida`
--
ALTER TABLE `partida`
  MODIFY `id_partida` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

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
  MODIFY `id_sala` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=251;

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
