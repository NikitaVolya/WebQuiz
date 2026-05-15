# Spécifications API - Quiz App

> **Note importante :** Toutes les données échangées doivent être en **snake_case** côté JSON. Le serveur est responsable de la logique de calcul des scores et du timing des questions.

---

# 1. Module Auth & Users
Gestion des comptes et des profils.

## [POST] `/api/auth/login`

- **Description :** Reçoit les identifiants, vérifie le hash du mot de passe en BDD et génère un jeton JWT.
- **Entrée :**

```json
{
  "email": "...",
  "password": "..."
}
```

- **Sortie :** `User` + `token`
- **Repo :** `authenticate()`

---

## [POST] `/api/auth/register`

- **Description :** Crée un nouveau compte utilisateur.
- **Entrée :**

```json
{
  "username": "...",
  "email": "...",
  "password": "..."
}
```

- **Sortie :** `User`
- **Repo :** `create()`

---

## [GET] `/api/auth/exists`

- **Description :** Vérifie si un email ou username existe déjà.
- **Params :**

```txt
?field=email|username&value=...
```

- **Repo :** `exists()`

---

## [GET] `/api/users/:id`

- **Description :** Retourne les informations publiques d'un utilisateur.

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

- **Repo :** `getUserById()`

---

## [GET] `/api/users/:id/stats`

- **Description :** Retourne les statistiques du joueur.

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

- **Description :** Retourne la liste des quiz.
- **Format :** Léger (sans questions)
- **Obligatoire :** `questions_count`
- **Repo :** `findAll()`

---

## [GET] `/api/quizzes/:id`

- **Description :** Retourne un quiz complet avec questions et réponses.
- **Repo :** `findById()`

---

## [GET] `/api/categories`

- **Description :** Retourne toutes les catégories.
- **Repo :** `findAllCategories()`

---

## [GET] `/api/quizzes?category_id=...`

- **Description :** Filtre les quiz par catégorie.
- **Repo :** `findByCategory()`

---

## [GET] `/api/quizzes/search?q=...`

- **Description :** Recherche textuelle dans les quiz.
- **Repo :** `search()`

---

## [GET] `/api/categories/:id`

- **Description :** Retourne les détails d'une catégorie.
- **Repo :** `getCategoryById()`

---

# 3. Module Rooms (Game Sessions)

Gestion des salles, des joueurs et de la progression des parties.

---

## [POST] `/api/rooms`

### Description

Crée une nouvelle salle de jeu.

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

### Repo

`createRoom()`

---

## [POST] `/api/rooms/join`

### Description

Permet à un joueur de rejoindre une salle.

### Auth

✔ JWT requis

### Body

```json
{
  "room_code": "ABCD12"
}
```

### Règles

- Impossible de rejoindre si partie commencée
- Impossible de rejoindre si salle pleine
- Impossible de rejoindre deux fois

### Response

```json
{
  "message": "Joined room successfully"
}
```

### Repo

`joinRoom()`

---

## [POST] `/api/rooms/start/:room_code`

### Description

Démarre une partie.

### Auth

✔ JWT requis (host uniquement)

### Conditions

- `status == LOBBY`
- `user == host_id`

### Response

```json
{
  "message": "Game started"
}
```

### Repo

`startGame()`

---

## [GET] `/api/rooms/status/:room_code`

### Description

Retourne l'état actuel d'une salle.

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

### Repo

`getStatus()`

---

## [GET] `/api/rooms/question/:room_code`

### Description

Retourne la question actuelle.

### Auth

✔ JWT requis

### Conditions

- `status == PLAYING`

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

### Repo

`getCurrentQuestion()`

---

## [POST] `/api/rooms/answer/:room_code`

### Description

Soumet une réponse utilisateur.

### Auth

✔ JWT requis

### Body

```json
{
  "answer_id": 2,
  "response_time_ms": 1500
}
```

### Règles

- Refus si partie non démarrée
- Refus si joueur absent
- Refus si déjà répondu
- `answer_id` peut être `null`

### Response

```json
{
  "correct": true
}
```

### Repo

`submitAnswer()`

---

## [POST] `/api/rooms/next/:room_code`

### Description

Passe à la question suivante.

### Auth

✔ JWT requis (host uniquement)

### Response

```json
{
  "message": "Next question started"
}
```

### Repo

`forceNextQuestion()`

---

## [GET] `/api/rooms/results/:room_code`

### Description

Retourne le classement final.

### Auth

✔ JWT requis

### Response

```json
{
  "room_code": "ABCD12",
  "results": [
    {
      "user_id": 1,
      "username": "John",
      "score": 500,
      "avatar_url": "..."
    }
  ]
}
```

### Repo

`getResults()`

---

# 4. Module Studio

Gestion des brouillons et publication des quiz.

---

## [GET] `/api/studio/drafts`

### Description

Retourne la liste des brouillons utilisateur non publiés.

### Auth

✔ JWT requis

### Response

```json
[
  {
    "id": "uuid",
    "title": "Quiz Histoire",
    "image_url": "...",
    "category_id": 1,
    "is_published": 0
  }
]
```

### Repo

`getDrafts()`

---

## [GET] `/api/studio/drafts/:id`

### Description

Retourne un brouillon complet.

### Auth

✔ JWT requis

### Repo

`getDraft()`

---

## [POST] `/api/studio/drafts`

### Description

Crée un nouveau brouillon.

### Auth

✔ JWT requis

### Body

```json
{
  "id": "uuid",
  "title": "Quiz",
  "description": "...",
  "category_id": 1,
  "image_url": "...",
  "questions": []
}
```

### Repo

`save('new')`

---

## [POST] `/api/studio/drafts/:id`

### Description

Met à jour un brouillon existant.

### Auth

✔ JWT requis

### Repo

`save(id)`

---

## [DELETE] `/api/studio/drafts/:id`

### Description

Supprime un brouillon.

### Auth

✔ JWT requis

### Response

```json
{
  "success": true
}
```

### Repo

`delete()`

---

## [POST] `/api/studio/drafts/:id/publish`

### Description

Publie un brouillon et génère un quiz réel.

### Auth

✔ JWT requis

### Effets

- Création du quiz
- Création des questions
- Création des réponses
- Passage `is_published = 1`

### Response

```json
{
  "success": true,
  "quizId": 10
}
```

### Repo

`publish()`

---

# 5. États de la partie

| État | Description |
|---|---|
| LOBBY | Salle en attente |
| PLAYING | Partie en cours |
| RESULTS | Résultats affichés |
| FINISHED | Partie terminée |

---

# 6. Tables utilisées

- `users`
- `quizzes`
- `questions`
- `answers`
- `game_sessions`
- `game_players`
- `player_answers`
- `quiz_drafts`

---

# 7. Sécurité

- JWT obligatoire sur routes sensibles
- Validation host côté serveur
- Validation réponses côté serveur
- Protection anti double-submit
- Impossible de rejoindre une partie commencée

---

# 8. Conventions Techniques

1. Format date : ISO 8601
2. JSON en `snake_case`
3. Front en `camelCase`
4. Le serveur contrôle score et progression
5. Le serveur ne doit jamais envoyer `is_correct` avant fin de question
