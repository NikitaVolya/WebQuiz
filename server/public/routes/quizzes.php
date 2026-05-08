<?php

require_once __DIR__ . '/../controllers/QuizController.php';

$quizController = new QuizController($conn);


// /quizzes/search?q=?
if ($method === "GET" && $action == "search") {
    $quizController->search($_GET['q']);
    exit;
} 

// /quizzes/:id
else if ($method === "GET" && isset($segments[1])) {
    $quizController->findById($segments[1]);
    exit;
} 

// /quizzes?category_id=?
else if ($method === "GET" && isset($_GET['category_id'])) {
    $quizController->findByCategory($_GET['category_id']);
    exit;
}

// /quizzes/
else {
    $quizController->findAll();
    exit;
}