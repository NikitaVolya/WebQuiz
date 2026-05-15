<?php

require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/response.php';

class Auth {

    public static function getAuthenticatedUser(PDO $conn): ?array {

        $headers = getallheaders();

        // CHECK AUTH HEADER
        if (!isset($headers['authorization'])) {
            return null;
        }

        $authHeader = $headers['authorization'];

        // EXTRACT TOKEN
        $token = trim(
            str_replace('Bearer ', '', $authHeader)
        );

        // VALIDATE TOKEN
        if (empty($token)) {
            return null;
        }

        $payload = JWT::validate($token);

        if (!$payload) {
            return null;
        }

        // CHECK USER ID
        if (!isset($payload['id'])) {
            return null;
        }

        // LOAD USER FROM DATABASE
        $stmt = $conn->prepare("
            SELECT
                id,
                username,
                email,
                avatar_url,
                role,
                is_active,
                created_at
            FROM users
            WHERE id = ?
            LIMIT 1
        ");

        $stmt->execute([
            $payload['id']
        ]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        // USER NOT FOUND
        if (!$user) {
            return null;
        }

        return $user;
    }
}