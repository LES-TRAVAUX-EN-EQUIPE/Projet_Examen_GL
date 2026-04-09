<?php

declare(strict_types=1);

function obtenirConnexion(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $hote = getenv('DB_HOST') ?: '127.0.0.1';
    $port = getenv('DB_PORT') ?: '3306';
    $base = getenv('DB_NAME') ?: 'fueltrack_nord_kivu';
    $utilisateur = getenv('DB_USER') ?: 'root';
    $motDePasse = getenv('DB_PASS') ?: '';

    $dsn = sprintf('mysql:host=%s;port=%s;dbname=%s;charset=utf8mb4', $hote, $port, $base);

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $pdo = new PDO($dsn, $utilisateur, $motDePasse, $options);

    return $pdo;
}
