<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

echo json_encode([
    'application' => 'FuelTrack API',
    'version' => '1.0.0',
    'endpoints' => [
        'api' => '/api/index.php?entity=utilisateurs',
        'dashboard' => '/api/index.php?entity=dashboard',
        'rapports' => '/api/index.php?entity=rapports',
    ],
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
