<?php

declare(strict_types=1);

function envoyerReponse(int $codeHttp, array $payload): void
{
    http_response_code($codeHttp);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function reponseSucces(mixed $donnees, string $message = 'OK', int $codeHttp = 200): void
{
    envoyerReponse($codeHttp, [
        'succes' => true,
        'message' => $message,
        'donnees' => $donnees,
    ]);
}

function reponseErreur(string $message, int $codeHttp = 400, array $details = []): void
{
    envoyerReponse($codeHttp, [
        'succes' => false,
        'message' => $message,
        'details' => $details,
    ]);
}
