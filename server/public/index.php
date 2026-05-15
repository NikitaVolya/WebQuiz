<?php

require_once "config/db.php";

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Content-Type: application/json");

$db = new Database();
$conn = $db->getConnection();

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$uri = str_replace("/api", "", $uri);

$segments = explode("/", trim($uri, "/"));

$controller = $segments[0] ?? null;
$action = $segments[1] ?? null;

switch ($controller) {

    case "quizzes":
        require "routes/quizzes.php";
        break;

    case "auth":
        require "routes/auth.php";
        break;

    case "users":
        require "routes/users.php";
        break;

    case "categories":
        require "routes/categories.php";
        break;

    case "rooms":
        require "routes/rooms.php";
        break;
    
    case "studio":
        require "routes/studio.php";
        break;

    default:
        http_response_code(404);
        echo json_encode(["error" => "Route not found"]);
}