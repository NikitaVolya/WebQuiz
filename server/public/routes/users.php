<?php

require_once __DIR__ . '/controllers/UserController.php';

$user = new UserController($conn);

$action = $_GET['action'] ?? '';

switch ($action) {
    case "get":
        $user->getUserById($_GET['id']);
        break;

    case "stats":
        $user->getStats($_GET['id']);
        break;
}