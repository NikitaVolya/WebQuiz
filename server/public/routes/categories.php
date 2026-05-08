<?php

require_once __DIR__ . '/../controllers/CategoryController.php';

$categoryController = new CategoryController($conn);

// /categories/:id
if ($method === "GET" && isset($segments[1])) {
    $categoryController->getCategoryById($segments[1]);
    exit;
}

// /categories
else {
    $categoryController->findAllCategories();
    exit;
}