# Spécifications API - Quiz App

> **Note importante :** Toutes les données échangées doivent être en **snake_case** côté JSON. Le serveur est responsable de la logique de calcul des scores et du timing des questions.

---

## 1. Module Auth & Users
Gestion des comptes et des profils.

### [POST] `/api/auth/login`
- **Description :** Reçoit les identifiants, vérifie le hash du mot de passe en BDD et génère un jeton de session (JWT).
- **Entrée :** `{ "email": "...", "password": "..." }`
- **Sortie :** `User` (objet) + `token` (string)
- **Repo :** `authenticate()`

### [POST] `/api/auth/register`
- **Description :** Crée une entrée en table `users` et initialise une ligne correspondante dans `user_stats`.
- **Entrée :** `{ "username": "...", "email": "...", "password": "..." }`
- **Sortie :** `User` (objet)
- **Repo :** `create()`

### [GET] `/api/auth/exists`
- **Description :** Permet de vérifier en temps réel si un email ou username est déjà pris lors de l'inscription.
- **Params :** `?field=email|username&value=...`
- **Repo :** `exists()`

### [GET] `/api/users/:id`
- **Description :** Récupère les informations détaillées d'un profil (avatar, rôle, date de création).
- **Sortie :** `{ "id": 1, "username": "...", "avatar_url": "...", "role": "USER", "created_at": "..." }`
- **Repo :** `getUserById()`

### [GET] `/api/users/:id/stats`
- **Description :** Récupère les données de progression (score total, victoires, niveau, expérience).
- **Sortie :** `{ "user_id": 1, "total_score": 500, "level": 5, "experience": 1200, "games_played": 10, "victories": 3 }`

---

## 2. Module Quiz
Contenu et catalogue.

### [GET] `/api/quizzes`
- **Description :** Liste globale pour la page d'accueil. 
- **Format :** Format léger (sans les questions).
- **Obligatoire :** Doit retourner le champ `questions_count`.
- **Repo :** `findAll()`

### [GET] `/api/quizzes/:id`
- **Description :** Chargement complet du quiz avant de lancer une partie.
- **Format :** Format lourd. Jointure SQL nécessaire : `Quiz` ➔ `Questions` ➔ `Answers`.
- **Repo :** `findById()`

### [GET] `/api/categories`
- **Description :** Liste tous les thèmes disponibles (id, name, color_code, image_url).
- **Repo :** `findAllCategories()`

### [GET] `/api/quizzes?category_id=...`
- **Description :** Filtre la liste des quiz pour n'afficher que ceux appartenant à une catégorie spécifique.
- **Paramètre :** `category_id` (ID numérique de la catégorie).
- **Format :** Format léger (sans les questions).
- **Repo :** `findByCategory()`

### [GET] `/api/quizzes/search?q=...`
- **Description :** Effectue une recherche textuelle sur les quiz existants.
- **Paramètre :** `q` (chaîne de caractères). Le serveur doit chercher dans les colonnes `title` et `description`.
- **Format :** Format léger.
- **Repo :** `search()`

### [GET] `/api/categories/:id`
- **Description :** Récupère les informations détaillées d'une seule catégorie.
- **Sortie :** `{ "id": 1, "name": "...", "color_code": "...", "image_url": "..." }`
- **Repo :** `getCategoryById()`

---

## 3. Module Game (Temps Réel)
Logique de session via HTTP et WebSockets.

### [POST] `/api/rooms` (HTTP)
- **Description :** Le serveur génère un `room_code` unique et prépare l'instance de jeu en mémoire.
- **Entrée :** `{ "quiz_id": 1, "mode": "MULTIPLAYER", "modifier": "CLASSIC" }`
- **Sortie :** `{ "room_code": "ABCD12" }`
- **Repo :** `createRoom()`

# Spécifications API - Module Rooms (Quiz App)

> **Note importante :** Toutes les données JSON utilisent le format **snake_case**. Le serveur gère toute la logique de jeu (scores, progression, validation des réponses).

---

### 4. Module Rooms (Game Sessions)
Gestion des salles, des joueurs et du déroulement du quiz.

---

## [POST] `/api/rooms`

### Description

Crée une nouvelle salle de jeu et génère un `room_code` unique.

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

Permet à un joueur de rejoindre une salle en statut LOBBY.

### Auth

✔ JWT requis

### Body

```json
{
  "room_code": "ABCD12"
}
```

### Règles

* Refus si la partie est déjà commencée (`status != LOBBY`)
* Refus si salle pleine
* Refus si joueur déjà présent

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

Démarre la partie (uniquement host).

### Auth

✔ JWT requis (host uniquement)

### Conditions

* `status == LOBBY`
* `user == host_id`

### Effet

* Passe `status` à `PLAYING`
* Définit `started_at`

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

Retourne l'état global de la session.

### Response

```json
{
  "id": 1,
  "status": "PLAYING",
  "mode": "MULTIPLAYER",
  "modifier": "CLASSIC",
  "current_question_index": 0,
  "max_players": 8,
  "players_count": 3
}
```

### Repo

`getStatus()`

---

## [GET] `/api/rooms/question/:room_code`

### Description

Retourne la question actuelle + réponses.

### Auth

✔ JWT requis

### Conditions

* `status == PLAYING`

### Response

```json
{
  "id": 10,
  "question_text": "...",
  "answers": [
    { "id": 1, "answer_text": "A" },
    { "id": 2, "answer_text": "B" }
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

* Refus si jeu non démarré
* Refus si utilisateur pas dans la salle
* Refus si déjà répondu
* `answer_id` peut être `null` (timeout / auto-submit)

### Effets

* Stocke dans `player_answers`
* Met à jour score si correct
* Déclenche auto-advance si tous ont répondu

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

Passe à la question suivante (host uniquement).

### Auth

✔ JWT requis (host)

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

Retourne le leaderboard final.

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

# 2. États de la partie

| État     | Description         |
| -------- | ------------------- |
| LOBBY    | Attente des joueurs |
| PLAYING  | Partie en cours     |
| RESULTS  | Résultats affichés  |
| FINISHED | Partie terminée     |

---

# 3. Règles serveur

* Le serveur est **authoritative** (score + progression)
* Une réponse `null` est acceptée (timeout)
* Une question avance automatiquement quand tous les joueurs ont répondu
* Le host peut forcer la progression
* Impossible de rejoindre une partie en cours

---

# 4. Tables utilisées

* `game_sessions`
* `game_players`
* `questions`
* `answers`
* `player_answers`
* `users`

---

# 5. Sécurité

* Toutes les routes critiques nécessitent JWT
* Validation du host obligatoire pour actions sensibles
* Protection contre double submit
* Validation des réponses côté serveur uniquement

---

## Conventions Techniques
1. **Format Date :** ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`).
2. **Booleans :** Utiliser les vrais types booléens (`true`/`false`).
3. **Naming :** `snake_case` (JSON) <-> `camelCase` (TS Front).
4. **Logique Serveur (Master) :** C'est le serveur qui gère le timer. Une fois le temps écoulé, le serveur ignore les réponses entrantes et émet le `session_update` suivant.
5. **Sécurité :** Le serveur ne doit jamais envoyer `is_correct: true` dans la liste des réponses tant que la question n'est pas terminée.