<?php
require_once 'Bingo.php';

$bingo = new Bingo();
echo json_encode([
    'carton' => $bingo->getCarton(),
    'numerosSacados' => $bingo->getNumerosSacados()
]); 