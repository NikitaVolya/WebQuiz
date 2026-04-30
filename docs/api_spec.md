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

### WebSockets (Events)

| Direction | Event | Description détaillée |
| :--- | :--- | :--- |
| **Client ➔ Srv** | `join_room` | Le client rejoint le canal WS du `room_code`. Le serveur broadcast l'arrivée aux autres. |
| **Client ➔ Srv** | `set_ready` | Alerte le serveur que le joueur est prêt. Si tous les joueurs sont `ready`, le serveur démarre. |
| **Client ➔ Srv** | `submit_answer` | Envoie `q_id` et `a_id`. Le serveur calcule les points et stocke le résultat. |
| **Client ➔ Srv** | `leave_room` | Déconnexion propre de la salle actuelle. |
| **Srv ➔ Client** | `session_update` | **Crucial.** Envoyé à chaque changement d'état (Passage à la question suivante, leaderboard, fin). |
| **Srv ➔ Client** | `player_update` | Notifie d'un changement spécifique à un joueur (connexion, déconnexion, score). |
| **Srv ➔ Client** | `error` | Envoyé en cas de salle pleine, code inexistant ou action invalide. |

---

## Conventions Techniques
1. **Format Date :** ISO 8601 (`YYYY-MM-DDTHH:mm:ssZ`).
2. **Booleans :** Utiliser les vrais types booléens (`true`/`false`).
3. **Naming :** `snake_case` (JSON) <-> `camelCase` (TS Front).
4. **Logique Serveur (Master) :** C'est le serveur qui gère le timer. Une fois le temps écoulé, le serveur ignore les réponses entrantes et émet le `session_update` suivant.
5. **Sécurité :** Le serveur ne doit jamais envoyer `is_correct: true` dans la liste des réponses tant que la question n'est pas terminée.