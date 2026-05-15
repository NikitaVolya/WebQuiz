# Quiz Battle - Frontend

L'interface client de Quiz Battle est une Single Page Application (SPA) moderne construite avec **React**, **TypeScript** et **Vite**. Elle offre une expérience de jeu fluide avec des animations haute performance via Framer Motion.

## Stack Technique

- **Framework** : React 19
- **Langage** : TypeScript
- **Tooling** : Vite
- **Styles** : CSS Modules (isolation des composants)
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Client HTTP** : Axios avec intercepteurs pour la gestion du JWT

## Architecture du Projet

Le projet suit une architecture découplée pour faciliter la maintenance et l'évolution vers différents backends (API réelle ou Mocks JSON).

- **Repositories** : Abstraction de la couche de données. Utilise des interfaces pour garantir que le reste de l'appli ne dépend pas de l'implémentation (API PHP ou LocalStorage).
- **Mappers** : Traducteurs de données situés dans `src/repositories/api/mappers/`. Ils convertissent le `snake_case` de la base de données PHP en `camelCase` TypeScript.
- **Services** : Orchestrent la logique métier et font le lien entre les hooks et les repositories.
- **Hooks Personnalisés** : Encapsulent la logique complexe (ex: `useSoloGame` gère le timer de 50ms et le cycle de vie d'une partie).

### Stratégie de Données (Mocking)
L'application supporte nativement le changement de source de données. Grâce au pattern Repository, il est possible de basculer entre :
- **ApiRepository** : Consomme l'API PHP réelle (production/dev avancé).
- **JsonRepository** : Utilise les mocks locaux situés dans `src/data/` (développement frontend isolé).

Pour changer de source, il suffit de modifier l'instanciation dans les services correspondants (ex: `quizService.ts`).

## Installation et Lancement

### Prérequis
- **Node.js** : Version 18.0 ou supérieure.
- **npm** : Version 9.0 ou supérieure.

1. **Installation des dépendances** :

    ```bash
    npm install
    ```

2. **Lancement du serveur de développement** :

    ```bash
    npm run dev
    ```
    *L'application sera accessible sur http://localhost:5173*

3. **Build pour la production** :

    ```bash
    npm run build
    ```

## Configuration du Proxy (Backend)

L'application est configurée pour communiquer avec un backend PHP tournant sur `http://localhost:8000`.
Le fichier `vite.config.ts` gère le proxy pour les routes suivantes afin d'éviter les erreurs CORS en développement :

* `/auth` → Authentification
* `/quizzes` → Gestion des quiz
* `/categories` → Liste des catégories
* `/users` → Profils utilisateurs

## Gestion de l'Authentification

Le système utilise un **JSON Web Token (JWT)** stocké dans le localStorage.

* **Intercepteur de requête** : Ajoute automatiquement le header `authorization: Bearer <token>` à chaque appel API.
* **Intercepteur de réponse** : Déconnecte automatiquement l'utilisateur et nettoie la session si le serveur renvoie une erreur 401 (Token expiré).

## Structure des dossiers clés

* `src/api` : Instance centrale Axios.
* `src/components/QuizEngine` : Cœur logique du jeu (Solo/Multi).
* `src/repositories/api/mappers` : Transformation des données reçues du backend.
* `src/views` : Pages principales de l'application.

## Conventions de code
- **Types** : Toujours utiliser les interfaces définies dans `src/types`.
- **Style** : Utilisation stricte de CSS Modules pour éviter les collisions de classes.
- **Mapping** : Toute nouvelle donnée provenant du backend doit passer par un Mapper pour respecter le standard `camelCase`.