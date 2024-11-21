<?php
require_once 'Bingo.php';

$bingo = new Bingo();
$numero = $bingo->sacarNumero();
echo json_encode([
    'success' => $numero !== false,
    'numero' => $numero
]); 