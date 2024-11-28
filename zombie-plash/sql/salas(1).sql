-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-11-2024 a las 02:44:47
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
(115, 1, '$2y$10$kbJKxBy2omEv1.6CniXb3uV7tYjxitZkeHbVU8f0Z/nuhb0oE2gUm', 2, 1),
(116, 1, '$2y$10$lE70RsWQU3w/KJcDtOYI6u5bL8k5zRRV9InFykKjHPa2TaWFBXUK.', 5, 1),
(117, 1, '$2y$10$9YNmowkGmL6cZBjzrq6p0.IlgCfmROheYxUd2UNuAeRG01DyOKLrK', 1, 1),
(119, 1, '$2y$10$lIW5jnQp1Sy8wAgZD99v6e.EOkLoTAUZEA0JubnnvufpJQxGzbpzC', 2, 1),
(123, 1, '$2y$10$EgKQ9.hV6LkffxiVQGQi5OMWav5bserGLfSaKYicv1s/m0nlcec0y', 2, 2);

--
-- Índices para tablas volcadas
--

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
-- AUTO_INCREMENT de la tabla `salas`
--
ALTER TABLE `salas`
  MODIFY `id_sala` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=124;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `salas`
--
ALTER TABLE `salas`
  ADD CONSTRAINT `fk_id_creador` FOREIGN KEY (`id_creador`) REFERENCES `jugador` (`id_jugador`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
