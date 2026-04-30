# Schéma de la Base de Données (SQL)

> **Note :** Le schéma est conçu pour MySQL/MariaDB. Les noms de colonnes utilisent le `snake_case` pour correspondre aux mappers du Front-end.

---

## 1. Utilisateurs (Auth & Profil)
Contient les informations de compte et la progression globale.

**TABLE users**
- `id`: INT (PK, Auto-increment)
- `username`: VARCHAR(50) (Unique, Not Null)
- `email`: VARCHAR(255) (Unique, Not Null)
- `password_hash`: VARCHAR(255) (Not Null)
- `avatar_url`: VARCHAR(255) (Default: 'default_avatar.png')
- `role`: ENUM ('USER', 'ADMIN', 'MODERATOR') (Default: 'USER')
- `is_active`: BOOLEAN (Default: true)
- `last_login`: TIMESTAMP (Nullable)
- `created_at`: TIMESTAMP (Default: Now)

**TABLE user_stats**
- `user_id`: INT (PK, FK -> users.id, Delete: Cascade)
- `total_score`: INT (Default: 0)
- `games_played`: INT (Default: 0)
- `victories`: INT (Default: 0)
- `level`: INT (Default: 1)
- `experience`: INT (Default: 0)

---

## 2. Catalogue de Contenu
La structure hiérarchique des quiz.

**TABLE categories**
- `id`: INT (PK, Auto-increment)
- `name`: VARCHAR(50) (Not Null)
- `description`: TEXT
- `image_url`: VARCHAR(255)
- `color_code`: VARCHAR(7) (Default: '#3b82f6')
- `slug`: VARCHAR(50) (Unique)

**TABLE quizzes**
- `id`: INT (PK, Auto-increment)
- `category_id`: INT (FK -> categories.id, Delete: Set Null)
- `creator_id`: INT (FK -> users.id, Delete: Cascade)
- `title`: VARCHAR(100) (Not Null)
- `questions_count`: INT (Default: 0)
- `description`: TEXT
- `image_url`: VARCHAR(255)
- `is_public`: BOOLEAN (Default: true)
- `created_at`: TIMESTAMP (Default: Now)

**TABLE questions**
- `id`: INT (PK, Auto-increment)
- `quiz_id`: INT (FK -> quizzes.id, Delete: Cascade)
- `question_text`: TEXT (Not Null)
- `image_url`: VARCHAR(255) (Nullable)
- `timer_seconds`: INT (Default: 15)
- `points_value`: INT (Default: 100)

**TABLE answers**
- `id`: INT (PK, Auto-increment)
- `question_id`: INT (FK -> questions.id, Delete: Cascade)
- `answer_text`: TEXT (Not Null)
- `is_correct`: BOOLEAN (Default: false)

---

## 3. Sessions & Temps Réel
Gestion des salles actives et des joueurs connectés.

**TABLE game_sessions**
- `id`: INT (PK, Auto-increment)
- `quiz_id`: INT (FK -> quizzes.id)
- `host_id`: INT (FK -> users.id, Delete: Set Null)
- `room_code`: VARCHAR(6) (Unique, Not Null)
- `mode`: ENUM ('SOLO', 'MULTIPLAYER', 'PARTY')
- `modifier`: ENUM ('CLASSIC', 'CHAOS', 'BATTLE_ROYALE')
- `status`: ENUM ('LOBBY', 'PLAYING', 'RESULTS', 'FINISHED')
- `max_players`: INT (Default: 8)
- `is_private`: BOOLEAN (Default: false)
- `current_question_index`: INT (Default: 0)
- `started_at`: TIMESTAMP (Nullable)

**TABLE game_players**
- `id`: INT (PK, Auto-increment)
- `session_id`: INT (FK -> game_sessions.id, Delete: Cascade)
- `user_id`: INT (FK -> users.id, Delete: Cascade)
- `score`: INT (Default: 0)
- `is_ready`: BOOLEAN (Default: false)
- `is_host`: BOOLEAN (Default: false)
- `rank`: INT (Nullable)
- `last_answer_id`: INT (FK -> answers.id, Delete: Set Null)

---

## 4. Système d'Items (Mode CHAOS)
Mécaniques de jeu avancées (Bonus / Malus).

**TABLE items**
- `id`: INT (PK, Auto-increment)
- `name`: VARCHAR(50)
- `code_name`: VARCHAR(50) (Unique)
- `description`: TEXT
- `icon_url`: VARCHAR(255)

**TABLE player_inventory**
- `id`: INT (PK, Auto-increment)
- `game_player_id`: INT (FK -> game_players.id, Delete: Cascade)
- `item_id`: INT (FK -> items.id, Delete: Cascade)
- `quantity`: INT (Default: 1)

**TABLE active_penalties**
- `id`: INT (PK, Auto-increment)
- `session_id`: INT (FK -> game_sessions.id, Delete: Cascade)
- `target_id`: INT (FK -> game_players.id, Delete: Cascade)
- `attacker_id`: INT (FK -> game_players.id, Delete: Cascade)
- `item_id`: INT (FK -> items.id, Delete: Cascade)
- `expires_at`: TIMESTAMP (Nullable)