<?php
$data = json_decode(file_get_contents('php://input'), true);
if (!$data) { echo json_encode(['success'=>false]); exit; }

$configPath = '../config.json';
if (file_exists($configPath)) {
    $current = json_decode(file_get_contents($configPath), true);
    $data = array_merge($current, $data);
}
file_put_contents($configPath, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
echo json_encode(['success'=>true]);
?>