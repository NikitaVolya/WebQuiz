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
    
    public function createResetToken($email) {

        $stmt = $this->conn->prepare(
            "SELECT id FROM users WHERE email = ?"
        );

        $stmt->execute([$email]);

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            return false;
        }

        $token = bin2hex(random_bytes(32));

        $expires = date(
            'Y-m-d H:i:s',
            strtotime('+1 hour')
        );

        $stmt = $this->conn->prepare(
            "INSERT INTO password_resets
            (user_id, token, expires_at)
            VALUES (?, ?, ?)"
        );

        $stmt->execute([
            $user['id'],
            $token,
            $expires
        ]);

        return $token;
    }

    public function getUserByResetToken($token) {

        $stmt = $this->conn->prepare(
            "SELECT users.*
            FROM users

            INNER JOIN password_resets
            ON users.id = password_resets.user_id

            WHERE password_resets.token = ?
            AND password_resets.expires_at > NOW()"
        );

        $stmt->execute([$token]);

        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function resetPassword(
        $token,
        $newPassword
    ) {

        $hash = password_hash(
            $newPassword,
            PASSWORD_BCRYPT
        );

        $stmt = $this->conn->prepare(
            "SELECT user_id
            FROM password_resets
            WHERE token = ?"
        );

        $stmt->execute([$token]);

        $reset = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$reset) {
            return false;
        }

        $stmt = $this->conn->prepare(
            "UPDATE users
            SET password_hash = ?
            WHERE id = ?"
        );

        $stmt->execute([
            $hash,
            $reset['user_id']
        ]);

        $stmt = $this->conn->prepare(
            "DELETE FROM password_resets
            WHERE token = ?"
        );

        $stmt->execute([$token]);

        return true;
    }
}
