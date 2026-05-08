<?php

require_once "config/db.php";

header("Content-Type: application/json");

$db = new Database();
$conn = $db->getConnection();

$route = $_GET['route'] ?? '';

switch ($route) {
    case "auth":
        require "routes/auth.php";
        break;

    case "users":
        require "routes/users.php";
        break;

    default:
        echo json_encode(["status" => "API running"]);
}