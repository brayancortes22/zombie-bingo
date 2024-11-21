<?php
session_start();

class Bingo {
    private $carton;
    private $numerosSacados;
    private $rangos = [
        'B' => ['min' => 1, 'max' => 12],
        'I' => ['min' => 13, 'max' => 23],
        'N' => ['min' => 24, 'max' => 34],
        'G' => ['min' => 35, 'max' => 45],
        'O' => ['min' => 46, 'max' => 60]
    ];

    public function __construct() {
        $this->inicializarJuego();
    }

    private function inicializarJuego() {
        if (!isset($_SESSION['carton'])) {
            $_SESSION['carton'] = $this->generarCarton();
        }
        if (!isset($_SESSION['numerosSacados'])) {
            $_SESSION['numerosSacados'] = [];
        }
        $this->carton = $_SESSION['carton'];
        $this->numerosSacados = $_SESSION['numerosSacados'];
    }

    private function generarCarton() {
        $carton = [];
        foreach ($this->rangos as $letra => $rango) {
            $numeros = range($rango['min'], $rango['max']);
            shuffle($numeros);
            $carton[$letra] = array_slice($numeros, 0, 5);
        }
        return $carton;
    }

    public function sacarNumero() {
        $numerosDisponibles = [];
        foreach ($this->rangos as $rango) {
            $numerosDisponibles = array_merge(
                $numerosDisponibles, 
                range($rango['min'], $rango['max'])
            );
        }
        $numerosDisponibles = array_diff($numerosDisponibles, $this->numerosSacados);

        if (!empty($numerosDisponibles)) {
            $nuevoNumero = array_rand(array_flip($numerosDisponibles));
            $this->numerosSacados[] = $nuevoNumero;
            $_SESSION['numerosSacados'] = $this->numerosSacados;
            return $nuevoNumero;
        }
        return false;
    }

    public function nuevoCarton() {
        $this->carton = $this->generarCarton();
        $this->numerosSacados = [];
        $_SESSION['carton'] = $this->carton;
        $_SESSION['numerosSacados'] = $this->numerosSacados;
    }

    public function getCarton() {
        return $this->carton;
    }

    public function getNumerosSacados() {
        return $this->numerosSacados;
    }
} 