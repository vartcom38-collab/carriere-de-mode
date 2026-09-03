<?php
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$configFile = dirname(__DIR__) . '/config/private.php';
if (!is_file($configFile)) {
  http_response_code(503);
  echo json_encode(['ok'=>false,'error'=>'private_config_missing'], JSON_UNESCAPED_UNICODE);
  exit;
}
$config = require $configFile;
$db = $config['db'] ?? [];
$dsn = sprintf('mysql:host=%s;port=%d;dbname=%s;charset=%s', $db['host'] ?? '', (int)($db['port'] ?? 3306), $db['name'] ?? '', $db['charset'] ?? 'utf8mb4');
try {
  $pdo = new PDO($dsn, $db['user'] ?? '', $db['password'] ?? '', [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
  $version = $pdo->query('SELECT VERSION() AS version')->fetch();
  echo json_encode(['ok'=>true,'database'=>$db['name'] ?? null,'server_version'=>$version['version'] ?? null], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['ok'=>false,'error'=>'database_connection_failed'], JSON_UNESCAPED_UNICODE);
}
