<?php

require_once __DIR__ . '/controllers/AuthController.php';

$auth = new AuthController($conn);

$action = $_GET['action'] ?? '';

$data = json_decode(file_get_contents("php://input"), true);

switch ($action) {
    case "login":
        $auth->login($data);
        break;

    case "register":
        $auth->register($data);
        break;

    case "exists":
        $auth->exists($_GET['field'], $_GET['value']);
        break;
}