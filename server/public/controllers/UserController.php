<?php

require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../models/User.php';

class UserController {
    private User $userModel;

    public function __construct($db) {
        $this->userModel = new User($db);
    }

    public function getUserById($id) {
        $user = $this->userModel->getById($id);

        if (!$user) {
            Response::json(["error" => "User not found"], 404);
        }

        Response::json($user);
    }

    public function getStats($id) {
        $stats = $this->userModel->getStats($id);

        if (!$stats) {
            Response::json(["error" => "Stats not found"], 404);
        }

        Response::json($stats);
    }
}