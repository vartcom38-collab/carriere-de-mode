<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
http_response_code(200);
echo json_encode([
  'ok' => true,
  'app' => 'Haute Couture Live',
  'host' => $_SERVER['HTTP_HOST'] ?? null,
  'php' => PHP_VERSION,
  'time' => gmdate('c')
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
