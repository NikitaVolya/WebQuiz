<?php

require_once __DIR__ . '/../controllers/AuthController.php';

$auth = new AuthController($conn);

$data = json_decode(file_get_contents("php://input"), true);

if ($method === "POST" && $action === "register") {
    $auth->register($data);
}
else if ($method === "POST" && $action === "login") {
    $auth->login($data);
}
else if ($method === "GET" && $action === "exists") {
    $auth->exists($_GET['field'], $_GET['value']);
}
else {

    http_response_code(404);
    echo json_encode(["error" => "Route not found"]);

}