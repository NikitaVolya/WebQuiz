<?php

require_once __DIR__ . '/../controllers/StudioController.php';
require_once __DIR__ . '/../utils/auth.php';

$user = Auth::getAuthenticatedUser($conn);
if (!$user) {
    Response::json(["error" => "Non autorisé"], 401);
    exit;
}

$userId = $user['id'];
$studioController = new StudioController($conn, $userId);

// GET /studio/drafts
if ($method === "GET" && $action === "drafts" && !isset($segments[2])) {
    $studioController->getDrafts();
    exit;
}

// GET /studio/drafts/:id
else if ($method === "GET" && $action === "drafts" && isset($segments[2])) {
    $studioController->getDraft($segments[2]);
    exit;
}

// POST /studio/drafts (INSERT)
else if ($method === "POST" && $action === "drafts" && !isset($segments[2])) {
    $studioController->save('new');
    exit;
}

// POST /studio/drafts/:id (UPDATE)
else if ($method === "POST" && $action === "drafts" && isset($segments[2]) && !isset($segments[3])) {
    $studioController->save($segments[2]);
    exit;
}

// DELETE /studio/drafts/:id
else if ($method === "DELETE" && $action === "drafts" && isset($segments[2])) {
    $studioController->delete($segments[2]);
    exit;
}

// POST /studio/drafts/:id/publish
else if ($method === "POST" && $action === "drafts" && isset($segments[2]) && $segments[3] === "publish") {
    $studioController->publish($segments[2]);
    exit;
}

else {
    http_response_code(404);
    Response::json(["error" => "Action studio introuvable"]);
}