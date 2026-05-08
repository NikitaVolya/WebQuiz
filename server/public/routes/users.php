<?php

require_once __DIR__ . '/../controllers/UserController.php';

$userController = new UserController($conn);


// GET user/status/:id
if ($method === "GET" && $action === "stats" && isset($segments[2])) {
    $userController->getStats($segments[2]);
    exit;
}
// GET user/:id
else if ($method === "GET" && isset($segments[1])) {
    $userController->getUserById($segments[1]);
    exit;
}

else {

    http_response_code(404);
    echo json_encode(["error" => "Route not found"]);

}