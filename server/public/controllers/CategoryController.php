<?php

require_once __DIR__ . '/../utils/response.php';

class CategoryController {

    private PDO $conn;

    public function __construct($db) {
        $this->conn = $db;
    }

    // =====================
    // ALL CATEGORIES
    // =====================
    public function findAllCategories() {
        $stmt = $this->conn->query("
            SELECT 
                id,
                name,
                color_code,
                image_url
            FROM categories
        ");

        Response::json($stmt->fetchAll(PDO::FETCH_ASSOC));
    }

    // =====================
    // CATEGORY BY ID
    // =====================
    public function getCategoryById($id) {
        $stmt = $this->conn->prepare("
            SELECT 
                id,
                name,
                color_code,
                image_url
            FROM categories
            WHERE id = ?
        ");

        $stmt->execute([$id]);

        $category = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$category) {
            Response::json([
                "error" => "Category not found"
            ], 404);
        }

        Response::json($category);
    }
}