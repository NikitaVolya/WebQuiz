CREATE DATABASE IF NOT EXISTS quiz_app
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE quiz_app;

-- =====================
-- USERS
-- =====================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT 'default_avatar.png',
    role ENUM('USER','ADMIN','MODERATOR') DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_stats (
    user_id INT PRIMARY KEY,
    total_score INT DEFAULT 0,
    games_played INT DEFAULT 0,
    victories INT DEFAULT 0,
    level INT DEFAULT 1,
    experience INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =====================
-- CATEGORIES / QUIZZES
-- =====================
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    color_code VARCHAR(7) DEFAULT '#3b82f6',
    slug VARCHAR(50) UNIQUE
);

CREATE TABLE quizzes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NULL,
    creator_id INT,
    title VARCHAR(100) NOT NULL,
    questions_count INT DEFAULT 0,
    description TEXT,
    image_url VARCHAR(255),
    is_public BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE questions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    question_text TEXT NOT NULL,
    image_url VARCHAR(255),
    timer_seconds INT DEFAULT 15,
    points_value INT DEFAULT 100,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
);

CREATE TABLE answers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question_id INT,
    answer_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- =====================
-- GAME SESSIONS
-- =====================
CREATE TABLE game_sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quiz_id INT,
    host_id INT NULL,
    room_code VARCHAR(6) NOT NULL UNIQUE,
    mode ENUM('SOLO','MULTIPLAYER','PARTY'),
    modifier ENUM('CLASSIC','CHAOS','BATTLE_ROYALE'),
    status ENUM('LOBBY','PLAYING','RESULTS','FINISHED'),
    max_players INT DEFAULT 8,
    is_private BOOLEAN DEFAULT FALSE,
    current_question_index INT DEFAULT 0,
    started_at TIMESTAMP NULL,
    FOREIGN KEY (quiz_id) REFERENCES quizzes(id),
    FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE game_players (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,
    user_id INT,
    score INT DEFAULT 0,
    is_ready BOOLEAN DEFAULT FALSE,
    is_host BOOLEAN DEFAULT FALSE,
    player_rank INT NULL,
    last_answer_id INT NULL,
    FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (last_answer_id) REFERENCES answers(id) ON DELETE SET NULL
);

-- =====================
-- ITEMS SYSTEM
-- =====================
CREATE TABLE items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50),
    code_name VARCHAR(50) UNIQUE,
    description TEXT,
    icon_url VARCHAR(255)
);

CREATE TABLE player_inventory (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_player_id INT,
    item_id INT,
    quantity INT DEFAULT 1,
    FOREIGN KEY (game_player_id) REFERENCES game_players(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id) ON DELETE CASCADE
);

CREATE TABLE active_penalties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    session_id INT,
    target_id INT,
    attacker_id INT,
    item_id INT,
    expires_at TIMESTAMP NULL,
    FOREIGN KEY (session_id) REFERENCES game_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (target_id) REFERENCES game_players(id) ON DELETE CASCADE,
    FOREIGN KEY (attacker_id) REFERENCES game_players(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES items(id)
);