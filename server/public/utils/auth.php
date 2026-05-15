<?php

require_once __DIR__ . '/../config/jwt.php';
require_once __DIR__ . '/response.php';

class Auth {

    public static function getAuthenticatedUser(PDO $conn): ?array {

        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? null;

        if (!$authHeader) {
            error_log("AUTH DEBUG: Pas de header Authorization trouvé");
            return null;
        }

        $token = trim(str_replace('Bearer ', '', $authHeader));
        error_log("AUTH DEBUG: Token extrait : " . substr($token, 0, 20) . "...");

        $payload = JWT::validate($token);

        if (!$payload) {
            error_log("AUTH DEBUG: JWT::validate a renvoyé false");
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