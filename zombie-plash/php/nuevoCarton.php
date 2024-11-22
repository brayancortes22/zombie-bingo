<?php
require_once 'Bingo.php';

$bingo = new Bingo();
$bingo->nuevoCarton();
echo json_encode([
    'success' => true,
    'carton' => $bingo->getCarton()
]); 