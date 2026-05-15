<?php

require_once __DIR__ . '/../utils/response.php';

class StudioController {
    private PDO $conn;
    private int $userId;

    public function __construct($db, $userId) {
        $this->conn = $db;
        $this->userId = $userId;
    }

    /**
     * GET /studio/drafts
     */
    public function getDrafts() {
        $stmt = $this->conn->prepare("
            SELECT id, title, image_url, category_id, is_published 
            FROM quiz_drafts 
            WHERE user_id = ? AND is_published = 0
            ORDER BY updated_at DESC
        ");
        $stmt->execute([$this->userId]);
        Response::json($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    /**
     * POST /studio/drafts/{id}
     */
    public function save($id = null) {
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!$data) {
            Response::json(["error" => "Données invalides"], 400);
            return;
        }

        $draftId = $data['id'];

        if ($id === 'new' || $id === null) {
            $stmt = $this->conn->prepare("
                INSERT INTO quiz_drafts (id, user_id, title, category_id, image_url, content) 
                VALUES (?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $draftId,
                $this->userId,
                $data['title'],
                $data['category_id'],
                $data['image_url'],
                json_encode($data)
            ]);
        } else {
            $stmt = $this->conn->prepare("
                UPDATE quiz_drafts 
                SET title = ?, category_id = ?, image_url = ?, content = ? 
                WHERE id = ? AND user_id = ?
            ");
            $stmt->execute([
                $data['title'],
                $data['category_id'],
                $data['image_url'],
                json_encode($data),
                $id,
                $this->userId
            ]);
        }
        Response::json(["success" => true, "id" => $draftId]);
    }

    /**
     * GET /studio/drafts/{id}
     */
    public function getDraft($id) {
        $stmt = $this->conn->prepare("SELECT content FROM quiz_drafts WHERE id = ? AND user_id = ?");
        $stmt->execute([$id, $this->userId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            Response::json(["error" => "Brouillon introuvable"], 404);
            return;
        }

        Response::json(json_decode($row['content'], true));
    }

    /**
     * DELETE /studio/drafts/{id}
     */
    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM quiz_drafts WHERE id = ? AND user_id = ?");
        $success = $stmt->execute([$id, $this->userId]);
        Response::json(["success" => $success]);
    }

    /**
     * POST /studio/drafts/{id}/publish
     */
    public function publish($id) {
        try {
            $this->conn->beginTransaction();

            $stmt = $this->conn->prepare("SELECT content FROM quiz_drafts WHERE id = ? AND user_id = ?");
            $stmt->execute([$id, $this->userId]);
            $draft = json_decode($stmt->fetchColumn(), true);

            $stmt = $this->conn->prepare("
                INSERT INTO quizzes (creator_id, title, description, category_id, image_url, is_public) 
                VALUES (?, ?, ?, ?, ?, 1)
            ");
            $stmt->execute([
                $this->userId,
                $draft['title'],
                $draft['description'],
                $draft['category_id'],
                $draft['image_url']
            ]);
            $newQuizId = $this->conn->lastInsertId();

            foreach ($draft['questions'] as $q) {
                $stmt = $this->conn->prepare("INSERT INTO questions (quiz_id, question_text) VALUES (?, ?)");
                $stmt->execute([$newQuizId, $q['text']]);
                $questionId = $this->conn->lastInsertId();

                foreach ($q['answers'] as $a) {
                    $stmt = $this->conn->prepare("INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)");
                    $stmt->execute([$questionId, $a['text'], $a['isCorrect'] ? 1 : 0]);
                }
            }

            $stmt = $this->conn->prepare("UPDATE quiz_drafts SET is_published = 1 WHERE id = ?");
            $stmt->execute([$id]);

            $this->conn->commit();
            Response::json(["success" => true, "quizId" => $newQuizId]);

        } catch (Exception $e) {
            $this->conn->rollBack();
            Response::json(["error" => $e->getMessage()], 500);
        }
    }
}