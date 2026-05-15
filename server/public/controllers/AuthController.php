<?php

require_once __DIR__ . '/../utils/response.php';
require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/../models/User.php';

class AuthController {

    private User $userModel;

    private PDO $conn;

    public function __construct($db) {
        $this->userModel = new User($db);
        $this->conn = $db;
    }

    public function login($data) {
        $user = $this->userModel->authenticate(
            $data['email'],
            $data['password']
        );

        if (!$user) {
            Response::json(["error" => "Invalid credentials"], 401);
        }

        $token = JWT::generate([
            "id" => $user['id'],
            "email" => $user['email'],
            "role" => $user['role'],
            "iat" => time()
        ]);

        Response::json([
            "user" => $user,
            "token" => $token
        ]);
    }

    public function register($data) {
        if ($this->userModel->exists('email', $data['email']) ||
            $this->userModel->exists('username', $data['username'])) {
            Response::json(["error" => "User already exists"], 409);
        }

        $user = $this->userModel->create(
            $data['username'],
            $data['email'],
            $data['password']
        );

        Response::json($user, 201);
    }

    public function exists($field, $value) {
        $result = $this->userModel->exists($field, $value);

        Response::json([
            "exists" => $result
        ]);
    }
    
    public function forgotPassword($data) {

        if (
            !$this->userModel->exists(
                'email',
                $data['email']
            )
        ) {

            Response::json([
                "error" => "Email not found"
            ], 404);
        }

        $token = $this->userModel
            ->createResetToken(
                $data['email']
            );

        $resetLink =
            "http://localhost/reset-password.html?token="
            . $token;

        Response::json([

            "message" =>
                "Reset link generated",

            "reset_link" =>
                $resetLink
        ]);
    }

    public function resetPassword($data) {

        $user =
            $this->userModel
            ->getUserByResetToken(
                $data['token']
            );

        if (!$user) {

            Response::json([

                "error" =>
                    "Invalid or expired token"

            ], 400);
        }

        $this->userModel->resetPassword(

            $data['token'],
            $data['password']
        );

        Response::json([

            "message" =>
                "Password updated successfully"
        ]);
    }
}
