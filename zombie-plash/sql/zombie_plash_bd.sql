-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-12-2024 a las 04:17:52
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
  `orden_salida` INT DEFAULT NULL,
  `id_sala` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `balotas`
--

INSERT INTO `balotas` (`id_balota`, `numero`, `letra`, `estado`, `orden_salida`, `id_sala`) VALUES
(3421, 1, 'B', 0, NULL, 188),
(3422, 2, 'B', 1, NULL, 188),
(3423, 3, 'B', 1, NULL, 188),
(3424, 4, 'B', 1, NULL, 188),
(3425, 5, 'B', 0, NULL, 188),
(3426, 6, 'B', 1, NULL, 188),
(3427, 7, 'B', 0, NULL, 188),
(3428, 8, 'B', 1, NULL, 188),
(3429, 9, 'B', 0, NULL, 188),
(3430, 10, 'B', 0, NULL, 188),
(3431, 11, 'B', 1, NULL, 188),
(3432, 12, 'B', 0, NULL, 188),
(3433, 13, 'I', 1, NULL, 188),
(3434, 14, 'I', 0, NULL, 188),
(3435, 15, 'I', 0, NULL, 188),
(3436, 16, 'I', 0, NULL, 188),
(3437, 17, 'I', 0, NULL, 188),
(3438, 18, 'I', 0, NULL, 188),
(3439, 19, 'I', 0, NULL, 188),
(3440, 20, 'I', 0, NULL, 188),
(3441, 21, 'I', 0, NULL, 188),
(3442, 22, 'I', 1, NULL, 188),
(3443, 23, 'I', 1, NULL, 188),
(3444, 24, 'N', 0, NULL, 188),
(3445, 25, 'N', 0, NULL, 188),
(3446, 26, 'N', 1, NULL, 188),
(3447, 27, 'N', 0, NULL, 188),
(3448, 28, 'N', 1, NULL, 188),
(3449, 29, 'N', 1, NULL, 188),
(3450, 30, 'N', 0, NULL, 188),
(3451, 31, 'N', 0, NULL, 188),
(3452, 32, 'N', 0, NULL, 188),
(3453, 33, 'N', 0, NULL, 188),
(3454, 34, 'N', 1, NULL, 188),
(3455, 35, 'G', 1, NULL, 188),
(3456, 36, 'G', 0, NULL, 188),
(3457, 37, 'G', 0, NULL, 188),
(3458, 38, 'G', 0, NULL, 188),
(3459, 39, 'G', 0, NULL, 188),
(3460, 40, 'G', 0, NULL, 188),
(3461, 41, 'G', 0, NULL, 188),
(3462, 42, 'G', 0, NULL, 188),
(3463, 43, 'G', 0, NULL, 188),
(3464, 44, 'G', 0, NULL, 188),
(3465, 45, 'G', 0, NULL, 188),
(3466, 46, 'O', 0, NULL, 188),
(3467, 47, 'O', 1, NULL, 188),
(3468, 48, 'O', 0, NULL, 188),
(3469, 49, 'O', 0, NULL, 188),
(3470, 50, 'O', 0, NULL, 188),
(3471, 51, 'O', 0, NULL, 188),
(3472, 52, 'O', 0, NULL, 188),
(3473, 53, 'O', 0, NULL, 188),
(3474, 54, 'O', 0, NULL, 188),
(3475, 55, 'O', 0, NULL, 188),
(3476, 56, 'O', 0, NULL, 188),
(3477, 57, 'O', 0, NULL, 188),
(3478, 58, 'O', 0, NULL, 188),
(3479, 59, 'O', 0, NULL, 188),
(3480, 60, 'O', 1, NULL, 188),
(3481, 1, 'B', 1, NULL, 189),
(3482, 2, 'B', 1, NULL, 189),
(3483, 3, 'B', 1, NULL, 189),
(3484, 4, 'B', 1, NULL, 189),
(3485, 5, 'B', 1, NULL, 189),
(3486, 6, 'B', 1, NULL, 189),
(3487, 7, 'B', 1, NULL, 189),
(3488, 8, 'B', 1, NULL, 189),
(3489, 9, 'B', 1, NULL, 189),
(3490, 10, 'B', 1, NULL, 189),
(3491, 11, 'B', 1, NULL, 189),
(3492, 12, 'B', 1, NULL, 189),
(3493, 13, 'I', 1, NULL, 189),
(3494, 14, 'I', 1, NULL, 189),
(3495, 15, 'I', 1, NULL, 189),
(3496, 16, 'I', 1, NULL, 189),
(3497, 17, 'I', 1, NULL, 189),
(3498, 18, 'I', 1, NULL, 189),
(3499, 19, 'I', 1, NULL, 189),
(3500, 20, 'I', 1, NULL, 189),
(3501, 21, 'I', 1, NULL, 189),
(3502, 22, 'I', 1, NULL, 189),
(3503, 23, 'I', 1, NULL, 189),
(3504, 24, 'N', 1, NULL, 189),
(3505, 25, 'N', 1, NULL, 189),
(3506, 26, 'N', 1, NULL, 189),
(3507, 27, 'N', 1, NULL, 189),
(3508, 28, 'N', 1, NULL, 189),
(3509, 29, 'N', 1, NULL, 189),
(3510, 30, 'N', 1, NULL, 189),
(3511, 31, 'N', 1, NULL, 189),
(3512, 32, 'N', 1, NULL, 189),
(3513, 33, 'N', 1, NULL, 189),
(3514, 34, 'N', 1, NULL, 189),
(3515, 35, 'G', 1, NULL, 189),
(3516, 36, 'G', 1, NULL, 189),
(3517, 37, 'G', 1, NULL, 189),
(3518, 38, 'G', 1, NULL, 189),
(3519, 39, 'G', 1, NULL, 189),
(3520, 40, 'G', 1, NULL, 189),
(3521, 41, 'G', 1, NULL, 189),
(3522, 42, 'G', 1, NULL, 189),
(3523, 43, 'G', 1, NULL, 189),
(3524, 44, 'G', 1, NULL, 189),
(3525, 45, 'G', 1, NULL, 189),
(3526, 46, 'O', 1, NULL, 189),
(3527, 47, 'O', 1, NULL, 189),
(3528, 48, 'O', 1, NULL, 189),
(3529, 49, 'O', 1, NULL, 189),
(3530, 50, 'O', 1, NULL, 189),
(3531, 51, 'O', 1, NULL, 189),
(3532, 52, 'O', 1, NULL, 189),
(3533, 53, 'O', 1, NULL, 189),
(3534, 54, 'O', 1, NULL, 189),
(3535, 55, 'O', 1, NULL, 189),
(3536, 56, 'O', 1, NULL, 189),
(3537, 57, 'O', 1, NULL, 189),
(3538, 58, 'O', 1, NULL, 189),
(3539, 59, 'O', 1, NULL, 189),
(3540, 60, 'O', 1, NULL, 189),
(3541, 1, 'B', 1, NULL, 190),
(3542, 2, 'B', 1, NULL, 190),
(3543, 3, 'B', 1, NULL, 190),
(3544, 4, 'B', 1, NULL, 190),
(3545, 5, 'B', 1, NULL, 190),
(3546, 6, 'B', 1, NULL, 190),
(3547, 7, 'B', 1, NULL, 190),
(3548, 8, 'B', 1, NULL, 190),
(3549, 9, 'B', 1, NULL, 190),
(3550, 10, 'B', 1, NULL, 190),
(3551, 11, 'B', 1, NULL, 190),
(3552, 12, 'B', 1, NULL, 190),
(3553, 13, 'I', 1, NULL, 190),
(3554, 14, 'I', 1, NULL, 190),
(3555, 15, 'I', 1, NULL, 190),
(3556, 16, 'I', 1, NULL, 190),
(3557, 17, 'I', 1, NULL, 190),
(3558, 18, 'I', 1, NULL, 190),
(3559, 19, 'I', 1, NULL, 190),
(3560, 20, 'I', 1, NULL, 190),
(3561, 21, 'I', 1, NULL, 190),
(3562, 22, 'I', 1, NULL, 190),
(3563, 23, 'I', 1, NULL, 190),
(3564, 24, 'N', 1, NULL, 190),
(3565, 25, 'N', 1, NULL, 190),
(3566, 26, 'N', 1, NULL, 190),
(3567, 27, 'N', 1, NULL, 190),
(3568, 28, 'N', 1, NULL, 190),
(3569, 29, 'N', 1, NULL, 190),
(3570, 30, 'N', 1, NULL, 190),
(3571, 31, 'N', 1, NULL, 190),
(3572, 32, 'N', 1, NULL, 190),
(3573, 33, 'N', 1, NULL, 190),
(3574, 34, 'N', 1, NULL, 190),
(3575, 35, 'G', 1, NULL, 190),
(3576, 36, 'G', 1, NULL, 190),
(3577, 37, 'G', 1, NULL, 190),
(3578, 38, 'G', 1, NULL, 190),
(3579, 39, 'G', 1, NULL, 190),
(3580, 40, 'G', 1, NULL, 190),
(3581, 41, 'G', 1, NULL, 190),
(3582, 42, 'G', 1, NULL, 190),
(3583, 43, 'G', 1, NULL, 190),
(3584, 44, 'G', 1, NULL, 190),
(3585, 45, 'G', 1, NULL, 190),
(3586, 46, 'O', 1, NULL, 190),
(3587, 47, 'O', 1, NULL, 190),
(3588, 48, 'O', 1, NULL, 190),
(3589, 49, 'O', 1, NULL, 190),
(3590, 50, 'O', 1, NULL, 190),
(3591, 51, 'O', 1, NULL, 190),
(3592, 52, 'O', 1, NULL, 190),
(3593, 53, 'O', 1, NULL, 190),
(3594, 54, 'O', 1, NULL, 190),
(3595, 55, 'O', 1, NULL, 190),
(3596, 56, 'O', 1, NULL, 190),
(3597, 57, 'O', 1, NULL, 190),
(3598, 58, 'O', 1, NULL, 190),
(3599, 59, 'O', 1, NULL, 190),
(3600, 60, 'O', 1, NULL, 190),
(3841, 1, 'B', 1, NULL, 194),
(3842, 2, 'B', 0, NULL, 194),
(3843, 3, 'B', 0, NULL, 194),
(3844, 4, 'B', 1, NULL, 194),
(3845, 5, 'B', 0, NULL, 194),
(3846, 6, 'B', 0, NULL, 194),
(3847, 7, 'B', 0, NULL, 194),
(3848, 8, 'B', 1, NULL, 194),
(3849, 9, 'B', 1, NULL, 194),
(3850, 10, 'B', 1, NULL, 194),
(3851, 11, 'B', 1, NULL, 194),
(3852, 12, 'B', 0, NULL, 194),
(3853, 13, 'I', 0, NULL, 194),
(3854, 14, 'I', 1, NULL, 194),
(3855, 15, 'I', 0, NULL, 194),
(3856, 16, 'I', 1, NULL, 194),
(3857, 17, 'I', 0, NULL, 194),
(3858, 18, 'I', 0, NULL, 194),
(3859, 19, 'I', 1, NULL, 194),
(3860, 20, 'I', 1, NULL, 194),
(3861, 21, 'I', 0, NULL, 194),
(3862, 22, 'I', 0, NULL, 194),
(3863, 23, 'I', 0, NULL, 194),
(3864, 24, 'N', 0, NULL, 194),
(3865, 25, 'N', 0, NULL, 194),
(3866, 26, 'N', 0, NULL, 194),
(3867, 27, 'N', 0, NULL, 194),
(3868, 28, 'N', 0, NULL, 194),
(3869, 29, 'N', 0, NULL, 194),
(3870, 30, 'N', 1, NULL, 194),
(3871, 31, 'N', 1, NULL, 194),
(3872, 32, 'N', 0, NULL, 194),
(3873, 33, 'N', 0, NULL, 194),
(3874, 34, 'N', 0, NULL, 194),
(3875, 35, 'G', 0, NULL, 194),
(3876, 36, 'G', 0, NULL, 194),
(3877, 37, 'G', 0, NULL, 194),
(3878, 38, 'G', 1, NULL, 194),
(3879, 39, 'G', 0, NULL, 194),
(3880, 40, 'G', 1, NULL, 194),
(3881, 41, 'G', 1, NULL, 194),
(3882, 42, 'G', 1, NULL, 194),
(3883, 43, 'G', 0, NULL, 194),
(3884, 44, 'G', 0, NULL, 194),
(3885, 45, 'G', 0, NULL, 194),
(3886, 46, 'O', 0, NULL, 194),
(3887, 47, 'O', 0, NULL, 194),
(3888, 48, 'O', 0, NULL, 194),
(3889, 49, 'O', 0, NULL, 194),
(3890, 50, 'O', 1, NULL, 194),
(3891, 51, 'O', 1, NULL, 194),
(3892, 52, 'O', 0, NULL, 194),
(3893, 53, 'O', 0, NULL, 194),
(3894, 54, 'O', 0, NULL, 194),
(3895, 55, 'O', 1, NULL, 194),
(3896, 56, 'O', 0, NULL, 194),
(3897, 57, 'O', 0, NULL, 194),
(3898, 58, 'O', 0, NULL, 194),
(3899, 59, 'O', 0, NULL, 194),
(3900, 60, 'O', 0, NULL, 194),
(3901, 1, 'B', 1, NULL, 195),
(3902, 2, 'B', 1, NULL, 195),
(3903, 3, 'B', 1, NULL, 195),
(3904, 4, 'B', 1, NULL, 195),
(3905, 5, 'B', 1, NULL, 195),
(3906, 6, 'B', 1, NULL, 195),
(3907, 7, 'B', 1, NULL, 195),
(3908, 8, 'B', 1, NULL, 195),
(3909, 9, 'B', 1, NULL, 195),
(3910, 10, 'B', 1, NULL, 195),
(3911, 11, 'B', 1, NULL, 195),
(3912, 12, 'B', 1, NULL, 195),
(3913, 13, 'I', 1, NULL, 195),
(3914, 14, 'I', 1, NULL, 195),
(3915, 15, 'I', 1, NULL, 195),
(3916, 16, 'I', 1, NULL, 195),
(3917, 17, 'I', 1, NULL, 195),
(3918, 18, 'I', 1, NULL, 195),
(3919, 19, 'I', 1, NULL, 195),
(3920, 20, 'I', 1, NULL, 195),
(3921, 21, 'I', 1, NULL, 195),
(3922, 22, 'I', 1, NULL, 195),
(3923, 23, 'I', 1, NULL, 195),
(3924, 24, 'N', 1, NULL, 195),
(3925, 25, 'N', 1, NULL, 195),
(3926, 26, 'N', 1, NULL, 195),
(3927, 27, 'N', 1, NULL, 195),
(3928, 28, 'N', 1, NULL, 195),
(3929, 29, 'N', 1, NULL, 195),
(3930, 30, 'N', 1, NULL, 195),
(3931, 31, 'N', 1, NULL, 195),
(3932, 32, 'N', 1, NULL, 195),
(3933, 33, 'N', 1, NULL, 195),
(3934, 34, 'N', 1, NULL, 195),
(3935, 35, 'G', 1, NULL, 195),
(3936, 36, 'G', 1, NULL, 195),
(3937, 37, 'G', 1, NULL, 195),
(3938, 38, 'G', 1, NULL, 195),
(3939, 39, 'G', 1, NULL, 195),
(3940, 40, 'G', 1, NULL, 195),
(3941, 41, 'G', 1, NULL, 195),
(3942, 42, 'G', 1, NULL, 195),
(3943, 43, 'G', 1, NULL, 195),
(3944, 44, 'G', 1, NULL, 195),
(3945, 45, 'G', 1, NULL, 195),
(3946, 46, 'O', 1, NULL, 195),
(3947, 47, 'O', 1, NULL, 195),
(3948, 48, 'O', 1, NULL, 195),
(3949, 49, 'O', 1, NULL, 195),
(3950, 50, 'O', 1, NULL, 195),
(3951, 51, 'O', 1, NULL, 195),
(3952, 52, 'O', 1, NULL, 195),
(3953, 53, 'O', 1, NULL, 195),
(3954, 54, 'O', 1, NULL, 195),
(3955, 55, 'O', 1, NULL, 195),
(3956, 56, 'O', 1, NULL, 195),
(3957, 57, 'O', 1, NULL, 195),
(3958, 58, 'O', 1, NULL, 195),
(3959, 59, 'O', 1, NULL, 195),
(3960, 60, 'O', 1, NULL, 195),
(4261, 1, 'B', 1, NULL, 196),
(4262, 2, 'B', 1, NULL, 196),
(4263, 3, 'B', 1, NULL, 196),
(4264, 4, 'B', 1, NULL, 196),
(4265, 5, 'B', 1, NULL, 196),
(4266, 6, 'B', 1, NULL, 196),
(4267, 7, 'B', 1, NULL, 196),
(4268, 8, 'B', 1, NULL, 196),
(4269, 9, 'B', 1, NULL, 196),
(4270, 10, 'B', 1, NULL, 196),
(4271, 11, 'B', 1, NULL, 196),
(4272, 12, 'B', 1, NULL, 196),
(4273, 13, 'I', 1, NULL, 196),
(4274, 14, 'I', 1, NULL, 196),
(4275, 15, 'I', 1, NULL, 196),
(4276, 16, 'I', 1, NULL, 196),
(4277, 17, 'I', 1, NULL, 196),
(4278, 18, 'I', 1, NULL, 196),
(4279, 19, 'I', 1, NULL, 196),
(4280, 20, 'I', 1, NULL, 196),
(4281, 21, 'I', 1, NULL, 196),
(4282, 22, 'I', 1, NULL, 196),
(4283, 23, 'I', 1, NULL, 196),
(4284, 24, 'N', 1, NULL, 196),
(4285, 25, 'N', 1, NULL, 196),
(4286, 26, 'N', 1, NULL, 196),
(4287, 27, 'N', 1, NULL, 196),
(4288, 28, 'N', 1, NULL, 196),
(4289, 29, 'N', 1, NULL, 196),
(4290, 30, 'N', 1, NULL, 196),
(4291, 31, 'N', 1, NULL, 196),
(4292, 32, 'N', 1, NULL, 196),
(4293, 33, 'N', 1, NULL, 196),
(4294, 34, 'N', 1, NULL, 196),
(4295, 35, 'G', 1, NULL, 196),
(4296, 36, 'G', 1, NULL, 196),
(4297, 37, 'G', 1, NULL, 196),
(4298, 38, 'G', 1, NULL, 196),
(4299, 39, 'G', 1, NULL, 196),
(4300, 40, 'G', 1, NULL, 196),
(4301, 41, 'G', 1, NULL, 196),
(4302, 42, 'G', 1, NULL, 196),
(4303, 43, 'G', 1, NULL, 196),
(4304, 44, 'G', 1, NULL, 196),
(4305, 45, 'G', 1, NULL, 196),
(4306, 46, 'O', 1, NULL, 196),
(4307, 47, 'O', 1, NULL, 196),
(4308, 48, 'O', 1, NULL, 196),
(4309, 49, 'O', 1, NULL, 196),
(4310, 50, 'O', 1, NULL, 196),
(4311, 51, 'O', 1, NULL, 196),
(4312, 52, 'O', 1, NULL, 196),
(4313, 53, 'O', 1, NULL, 196),
(4314, 54, 'O', 1, NULL, 196),
(4315, 55, 'O', 1, NULL, 196),
(4316, 56, 'O', 1, NULL, 196),
(4317, 57, 'O', 1, NULL, 196),
(4318, 58, 'O', 1, NULL, 196),
(4319, 59, 'O', 1, NULL, 196),
(4320, 60, 'O', 1, NULL, 196),
(4381, 1, 'B', 0, NULL, 197),
(4382, 2, 'B', 0, NULL, 197),
(4383, 3, 'B', 0, NULL, 197),
(4384, 4, 'B', 0, NULL, 197),
(4385, 5, 'B', 0, NULL, 197),
(4386, 6, 'B', 0, NULL, 197),
(4387, 7, 'B', 0, NULL, 197),
(4388, 8, 'B', 0, NULL, 197),
(4389, 9, 'B', 0, NULL, 197),
(4390, 10, 'B', 0, NULL, 197),
(4391, 11, 'B', 0, NULL, 197),
(4392, 12, 'B', 0, NULL, 197),
(4393, 13, 'I', 0, NULL, 197),
(4394, 14, 'I', 0, NULL, 197),
(4395, 15, 'I', 0, NULL, 197),
(4396, 16, 'I', 0, NULL, 197),
(4397, 17, 'I', 0, NULL, 197),
(4398, 18, 'I', 0, NULL, 197),
(4399, 19, 'I', 0, NULL, 197),
(4400, 20, 'I', 0, NULL, 197),
(4401, 21, 'I', 0, NULL, 197),
(4402, 22, 'I', 0, NULL, 197),
(4403, 23, 'I', 0, NULL, 197),
(4404, 24, 'N', 0, NULL, 197),
(4405, 25, 'N', 0, NULL, 197),
(4406, 26, 'N', 0, NULL, 197),
(4407, 27, 'N', 0, NULL, 197),
(4408, 28, 'N', 0, NULL, 197),
(4409, 29, 'N', 0, NULL, 197),
(4410, 30, 'N', 0, NULL, 197),
(4411, 31, 'N', 0, NULL, 197),
(4412, 32, 'N', 0, NULL, 197),
(4413, 33, 'N', 0, NULL, 197),
(4414, 34, 'N', 0, NULL, 197),
(4415, 35, 'G', 0, NULL, 197),
(4416, 36, 'G', 0, NULL, 197),
(4417, 37, 'G', 0, NULL, 197),
(4418, 38, 'G', 0, NULL, 197),
(4419, 39, 'G', 0, NULL, 197),
(4420, 40, 'G', 0, NULL, 197),
(4421, 41, 'G', 0, NULL, 197),
(4422, 42, 'G', 0, NULL, 197),
(4423, 43, 'G', 0, NULL, 197),
(4424, 44, 'G', 0, NULL, 197),
(4425, 45, 'G', 0, NULL, 197),
(4426, 46, 'O', 0, NULL, 197),
(4427, 47, 'O', 0, NULL, 197),
(4428, 48, 'O', 0, NULL, 197),
(4429, 49, 'O', 0, NULL, 197),
(4430, 50, 'O', 0, NULL, 197),
(4431, 51, 'O', 0, NULL, 197),
(4432, 52, 'O', 0, NULL, 197),
(4433, 53, 'O', 0, NULL, 197),
(4434, 54, 'O', 0, NULL, 197),
(4435, 55, 'O', 0, NULL, 197),
(4436, 56, 'O', 0, NULL, 197),
(4437, 57, 'O', 0, NULL, 197),
(4438, 58, 'O', 0, NULL, 197),
(4439, 59, 'O', 0, NULL, 197),
(4440, 60, 'O', 0, NULL, 197);

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
(318, 197, 6, 'bscl-5', 'participante');

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
(197, 1, '$2y$10$54LQcllFvWljGbwO0K4fPOD2L/tG9H9xwghNtE27EDFbtib3lRtOm', 2, 2, 'en_juego', 0, NULL, '[]', '2024-12-03 03:09:58');

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
  MODIFY `id_balota` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4441;

--
-- AUTO_INCREMENT de la tabla `jugador`
--
ALTER TABLE `jugador`
  MODIFY `id_jugador` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `jugadores_en_sala`
--
ALTER TABLE `jugadores_en_sala`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=319;

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
  MODIFY `id_sala` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=198;

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
