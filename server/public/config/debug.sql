INSERT INTO users (username, email, password_hash, avatar_url, role)
VALUES
('alex', 'alex@mail.com', 'hash1', 'avatar1.png', 'USER'),
('maria', 'maria@mail.com', 'hash2', 'avatar2.png', 'USER'),
('admin', 'admin@mail.com', 'hash3', 'admin.png', 'ADMIN');

INSERT INTO user_stats (user_id, total_score, games_played, victories, level, experience)
VALUES
(1, 1200, 15, 5, 4, 300),
(2, 2400, 30, 12, 7, 800),
(3, 9999, 100, 80, 20, 5000);

INSERT INTO categories (name, description, image_url, color_code, slug)
VALUES
('General Knowledge', 'Basic trivia questions', 'gen.png', '#3b82f6', 'general'),
('Science', 'Physics, chemistry, biology', 'science.png', '#10b981', 'science'),
('Gaming', 'Video games quiz', 'gaming.png', '#ef4444', 'gaming');

INSERT INTO quizzes (category_id, creator_id, title, questions_count, description, is_public)
VALUES
(1, 1, 'General Trivia #1', 2, 'Basic knowledge quiz', TRUE),
(2, 2, 'Science Basics', 2, 'Easy science questions', TRUE);

INSERT INTO questions (quiz_id, question_text, timer_seconds, points_value)
VALUES
(1, 'What is the capital of France?', 15, 100),
(1, 'How many continents are there?', 15, 100),
(2, 'What planet is known as the Red Planet?', 15, 100),
(2, 'What is H2O?', 15, 100);

-- Question 1
INSERT INTO answers (question_id, answer_text, is_correct)
VALUES
(1, 'Paris', TRUE),
(1, 'Berlin', FALSE),
(1, 'Rome', FALSE),
(1, 'Madrid', FALSE);

-- Question 2
INSERT INTO answers (question_id, answer_text, is_correct)
VALUES
(2, '5', FALSE),
(2, '6', FALSE),
(2, '7', TRUE),
(2, '8', FALSE);

-- Question 3
INSERT INTO answers (question_id, answer_text, is_correct)
VALUES
(3, 'Mars', TRUE),
(3, 'Venus', FALSE),
(3, 'Jupiter', FALSE),
(3, 'Mercury', FALSE);

-- Question 4
INSERT INTO answers (question_id, answer_text, is_correct)
VALUES
(4, 'Water', TRUE),
(4, 'Oxygen', FALSE),
(4, 'Hydrogen', FALSE),
(4, 'Salt', FALSE);

INSERT INTO game_sessions (quiz_id, host_id, room_code, mode, modifier, status, max_players)
VALUES
(1, 1, 'AB12CD', 'MULTIPLAYER', 'CLASSIC', 'LOBBY', 4);

INSERT INTO game_players (session_id, user_id, score, is_ready, is_host)
VALUES
(1, 1, 0, TRUE, TRUE),
(1, 2, 0, TRUE, FALSE);