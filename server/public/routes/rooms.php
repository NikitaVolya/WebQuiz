<?php

require_once __DIR__ . '/../controllers/RoomController.php';

$roomController = new RoomController($conn);




// GET /rooms/status/<ROOM CODE>
if ($method === "GET" && $action == "status") {
    $roomController->getStatus($segments[2]);
    exit;
}

// GET /rooms/question/<ROOM CODE> WITH JWT
else if ($method === "GET" && $action == "question") {
    $roomController->getCurrentQuestion($segments[2]);
    exit;
}

// GET /api/rooms/results/<ROOM CODE> WITH JWT
else if ($method === "GET" && $action === "results") {
    $roomController->getResults($segments[2]);
    exit;
}

// POST /api/rooms/next/<ROOM CODE> WITH JWT ONLY HOST
else if ($method === "POST" && $action === "next") {
    $roomController->forceNextQuestion($segments[2]);
    exit;
}

// POST /rooms/start/<ROOM CODE> WITH JWT ONLY HOST
else if ($method === "POST" && $action == "start") {
    $roomController->startGame($segments[2]);
    exit;
}

// POST /rooms/join WITH JWT
else if ($method === "POST" && $action == "join") {
    $roomController->joinRoom();
    exit;
}

// POST /rooms/answer/<ROOM CODE> WITH JWT
if ($method === "POST" && $action === "answer") {
    $roomController->submitAnswer($segments[2]);
    exit;
}

// POST /rooms
else if ($method === "POST") {
    $roomController->createRoom();
    exit;
}

else {

    http_response_code(404);
    echo json_encode(["error" => "Route not found"]);
}