<?php

require_once __DIR__ . '/../utils/response.php';

class QuizController {

    private PDO $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // =====================
    // LIGHT LIST
    // =====================
    public function findAll() {
        $stmt = $this->conn->query("
            SELECT id, title, description, image_url, questions_count, category_id
            FROM quizzes
        ");

        Response::json($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // =====================
    // HEAVY QUIZ (JOIN)
    // =====================
    public function findById($id) {
        $stmt = $this->conn->prepare("
            SELECT * FROM quizzes WHERE id = ?
        ");
        $stmt->execute([$id]);
        $quiz = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$quiz) {
            Response::json(["error" => "Quiz not found"], 404);
        }

        // questions
        $stmt = $this->conn->prepare("
            SELECT * FROM questions WHERE quiz_id = ?
        ");
        $stmt->execute([$id]);
        $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // attach answers
        foreach ($questions as &$q) {
            $stmt = $this->conn->prepare("
                SELECT id, answer_text, is_correct
                FROM answers
                WHERE question_id = ?
            ");
            $stmt->execute([$q['id']]);
            $q['answers'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        $quiz['questions'] = $questions;

        Response::json($quiz);
    }

    // =====================
    // CATEGORY FILTER
    // =====================
    public function findByCategory($category_id) {
        $stmt = $this->conn->prepare("
            SELECT id, title, description, image_url, questions_count
            FROM quizzes
            WHERE category_id = ?
        ");
        $stmt->execute([$category_id]);

        Response::json($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // =====================
    // SEARCH
    // =====================
    public function search($q) {
        $stmt = $this->conn->prepare("
            SELECT id, title, description, image_url, questions_count
            FROM quizzes
            WHERE title LIKE ? OR description LIKE ?
        ");

        $search = "%$q%";
        $stmt->execute([$search, $search]);

        Response::json($stmt->fetchAll(PDO::FETCH_ASSOC));
    }
}