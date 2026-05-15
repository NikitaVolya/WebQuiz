<?php

class User {
    private PDO $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function authenticate($email, $password) {
        $stmt = $this->conn->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) return null;

        if (!password_verify($password, $user['password_hash'])) {
            return null;
        }

        return $user;
    }

    public function create($username, $email, $password) {
        $hash = password_hash($password, PASSWORD_BCRYPT);

        $stmt = $this->conn->prepare("
            INSERT INTO users (username, email, password_hash)
            VALUES (?, ?, ?)
        ");

        $stmt->execute([$username, $email, $hash]);
        $userId = $this->conn->lastInsertId();

        // init stats
        $stmt = $this->conn->prepare("
            INSERT INTO user_stats (user_id) VALUES (?)
        ");
        $stmt->execute([$userId]);

        return $this->getById($userId);
    }

    public function exists($field, $value): bool {
        if (!in_array($field, ['email', 'username'])) return false;

        $stmt = $this->conn->prepare("SELECT id FROM users WHERE $field = ?");
        $stmt->execute([$value]);

        return $stmt->fetch() !== false;
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("
            SELECT id, username, email, avatar_url, role, created_at
            FROM users WHERE id = ?
        ");
        $stmt->execute([$id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function getStats($id) {
        $stmt = $this->conn->prepare("
            SELECT * FROM user_stats WHERE user_id = ?
        ");
        $stmt->execute([$id]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}