# Quiz App Server

Backend API pour une application de quiz multijoueur en temps réel.

Le serveur est développé en PHP avec MySQL/MariaDB et utilise JWT pour l’authentification.

---

# Fonctionnalités

* Authentification JWT
* Gestion des utilisateurs
* Gestion des quiz et catégories
* Création de salles multijoueur
* Système de progression des questions
* Gestion des scores serveur-side
* Brouillons de quiz (Studio)
* Publication dynamique de quiz
* Validation sécurisée des réponses
* Architecture REST API

---

# Stack Technique

| Technologie                  | Utilisation      |
| ---------------------------- | ---------------- |
| PHP                          | Backend API      |
| MySQL / MariaDB              | Base de données  |
| JWT                          | Authentification |
| Apache / PHP Built-in Server | Serveur HTTP     |
| React / React Native         | Frontend         |
| Axios                        | Requêtes HTTP    |

---

# Installation

## 1. Cloner le projet

```bash
git clone <repo_url>
cd server
```

---

## 2. Configuration Base de Données

Créer une base de données MySQL/MariaDB.

Exemple :

```sql
CREATE DATABASE quiz_app;
```

---

## 3. Configuration `.env` / config

Configurer les accès BDD dans :

```php
public/config/database.php
```

Exemple :

```php
$host = '127.0.0.1';
$dbname = 'quiz_app';
$username = 'root';
$password = '';
```

---

## 4. Lancer le serveur PHP

Depuis le dossier `public` :

```bash
php -S 127.0.0.1:8000 public
```

Le serveur sera disponible sur :

```txt
http://127.0.0.1:8000
```

---

# Authentification JWT

Toutes les routes protégées nécessitent le header :

```http
Authorization: Bearer <token>
```

Exemple Axios :

```js
axios.post('http://127.0.0.1:8000/rooms', body, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

---

# Structure API

---

# 1. Module Auth & Users

Gestion des comptes et profils.

## [POST] `/api/auth/login`

Authentifie un utilisateur et retourne un JWT.

### Body

```json
{
  "email": "test@gmail.com",
  "password": "1234"
}
```

### Response

```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "username": "John"
  }
}
```

---

## [POST] `/api/auth/register`

Crée un nouveau compte utilisateur.

```json
{
  "username": "...",
  "email": "...",
  "password": "..."
}
```

---

## [GET] `/api/auth/exists`

Vérifie si un email ou username existe déjà.

```txt
?field=email|username&value=...
```

---

## [GET] `/api/users/:id`

Retourne les informations publiques d’un utilisateur.

### Response

```json
{
  "id": 1,
  "username": "John",
  "avatar_url": "...",
  "role": "USER",
  "created_at": "2026-01-01T10:00:00Z"
}
```

---

## [GET] `/api/users/:id/stats`

Retourne les statistiques du joueur.

### Response

```json
{
  "user_id": 1,
  "total_score": 500,
  "level": 5,
  "experience": 1200,
  "games_played": 10,
  "victories": 3
}
```

---

# 2. Module Quiz

Catalogue des quiz et catégories.

## [GET] `/api/quizzes`

Retourne la liste des quiz.

---

## [GET] `/api/quizzes/:id`

Retourne un quiz complet avec questions/réponses.

---

## [GET] `/api/categories`

Retourne toutes les catégories.

---

## [GET] `/api/quizzes/search?q=...`

Recherche textuelle sur les quiz.

---

# 3. Module Rooms

Gestion des parties multijoueur.

---

## [POST] `/api/rooms`

Crée une salle.

### Auth

✔ JWT requis

### Body

```json
{
  "quiz_id": 1,
  "mode": "MULTIPLAYER",
  "modifier": "CLASSIC"
}
```

### Response

```json
{
  "room_code": "ABCD12",
  "host_id": 1
}
```

---

## [POST] `/api/rooms/join`

Rejoint une salle.

### Body

```json
{
  "room_code": "ABCD12"
}
```

---

## [POST] `/api/rooms/start/:room_code`

Démarre une partie.

---

## [GET] `/api/rooms/status/:room_code`

Retourne l’état d’une partie.

### Response

```json
{
  "id": 1,
  "status": "PLAYING",
  "mode": "MULTIPLAYER",
  "modifier": "CLASSIC",
  "current_question_index": 0,
  "max_players": 8,
  "players_count": 4
}
```

---

## [GET] `/api/rooms/question/:room_code`

Retourne la question actuelle.

### Response

```json
{
  "id": 10,
  "question_text": "Question ?",
  "answers": [
    {
      "id": 1,
      "answer_text": "Réponse A"
    },
    {
      "id": 2,
      "answer_text": "Réponse B"
    }
  ]
}
```

---

## [POST] `/api/rooms/answer/:room_code`

Soumet une réponse.

### Body

```json
{
  "answer_id": 2,
  "response_time_ms": 1500
}
```

---

## [POST] `/api/rooms/next/:room_code`

Force la question suivante.

---

## [GET] `/api/rooms/results/:room_code`

Retourne le leaderboard final.

---

# 4. Module Studio

Gestion des brouillons de quiz.

---

## [GET] `/api/studio/drafts`

Retourne tous les brouillons utilisateur.

---

## [POST] `/api/studio/drafts`

Crée un brouillon.

---

## [POST] `/api/studio/drafts/:id`

Met à jour un brouillon.

---

## [DELETE] `/api/studio/drafts/:id`

Supprime un brouillon.

---

## [POST] `/api/studio/drafts/:id/publish`

Publie un brouillon.

---

# États des Parties

| État     | Description     |
| -------- | --------------- |
| LOBBY    | Salle d’attente |
| PLAYING  | Partie en cours |
| RESULTS  | Résultats       |
| FINISHED | Partie terminée |

---

# Sécurité

* JWT obligatoire sur routes sensibles
* Validation des réponses côté serveur
* Validation host côté serveur
* Anti double-submit
* Impossible de rejoindre une partie commencée
* Le serveur contrôle score et progression

---

# Structure Base de Données

---

# TABLE `users`

| Colonne       | Type         |
| ------------- | ------------ |
| id            | INT PK       |
| username      | VARCHAR(50)  |
| email         | VARCHAR(255) |
| password_hash | VARCHAR(255) |
| avatar_url    | VARCHAR(255) |
| role          | ENUM         |
| created_at    | TIMESTAMP    |

---

# TABLE `user_stats`

| Colonne      | Type        |
| ------------ | ----------- |
| user_id      | FK users.id |
| total_score  | INT         |
| games_played | INT         |
| victories    | INT         |
| level        | INT         |
| experience   | INT         |

---

# TABLE `categories`

| Colonne     | Type         |
| ----------- | ------------ |
| id          | INT PK       |
| name        | VARCHAR(50)  |
| description | TEXT         |
| image_url   | VARCHAR(255) |
| color_code  | VARCHAR(7)   |
| slug        | VARCHAR(50)  |

---

# TABLE `quizzes`

| Colonne         | Type             |
| --------------- | ---------------- |
| id              | INT PK           |
| category_id     | FK categories.id |
| creator_id      | FK users.id      |
| title           | VARCHAR(100)     |
| questions_count | INT              |
| description     | TEXT             |
| image_url       | VARCHAR(255)     |
| is_public       | BOOLEAN          |
| created_at      | TIMESTAMP        |

---

# TABLE `questions`

| Colonne       | Type          |
| ------------- | ------------- |
| id            | INT PK        |
| quiz_id       | FK quizzes.id |
| question_text | TEXT          |
| image_url     | VARCHAR(255)  |
| timer_seconds | INT           |
| points_value  | INT           |

---

# TABLE `answers`

| Colonne     | Type            |
| ----------- | --------------- |
| id          | INT PK          |
| question_id | FK questions.id |
| answer_text | TEXT            |
| is_correct  | BOOLEAN         |

---

# TABLE `game_sessions`

| Colonne                | Type          |
| ---------------------- | ------------- |
| id                     | INT PK        |
| quiz_id                | FK quizzes.id |
| host_id                | FK users.id   |
| room_code              | VARCHAR(6)    |
| mode                   | ENUM          |
| modifier               | ENUM          |
| status                 | ENUM          |
| max_players            | INT           |
| current_question_index | INT           |
| started_at             | TIMESTAMP     |

---

# TABLE `game_players`

| Colonne    | Type                |
| ---------- | ------------------- |
| id         | INT PK              |
| session_id | FK game_sessions.id |
| user_id    | FK users.id         |
| score      | INT                 |
| is_ready   | BOOLEAN             |
| rank       | INT                 |

---

# TABLE `player_answers`

| Colonne          | Type                |
| ---------------- | ------------------- |
| id               | INT PK              |
| session_id       | FK game_sessions.id |
| player_id        | FK game_players.id  |
| question_id      | FK questions.id     |
| answer_id        | FK answers.id       |
| is_correct       | BOOLEAN             |
| response_time_ms | INT                 |

---

# TABLE `quiz_drafts`

| Colonne      | Type           |
| ------------ | -------------- |
| id           | VARCHAR / UUID |
| user_id      | FK users.id    |
| title        | VARCHAR(255)   |
| image_url    | VARCHAR(255)   |
| category_id  | INT            |
| content      | JSON           |
| is_published | BOOLEAN        |

---

# Conventions Techniques

1. JSON en `snake_case`
2. Frontend en `camelCase`
3. Format date ISO 8601
4. Le serveur contrôle toute la logique de jeu
5. Les réponses correctes ne sont jamais envoyées avant fin de question

---
