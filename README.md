<<<<<<< HEAD
# 🏆 Quiz Battle - Fullstack Application

Quiz Battle est une plateforme de quiz interactive et compétitive. Ce projet intègre un système de jeu en temps réel (Solo & Multijoueur), un Studio de création de quiz complet, et une architecture robuste séparant le **Frontend (React/TS)** du **Backend (PHP/MySQL)**.

## 📁 Structure du Projet
=======
# Quiz Battle - Fullstack Application

Quiz Battle est une plateforme de quiz interactive et compétitive. Ce projet intègre un système de jeu en temps réel (Solo & Multijoueur), un Studio de création de quiz complet, et une architecture robuste séparant le **Frontend (React/TS)** du **Backend (PHP/MySQL)**.

## Structure du Projet
>>>>>>> b15df854a07d22763c416eb05e0909f0098fae85

* **/client** : Interface utilisateur moderne développée avec React 18, TypeScript, Vite et Framer Motion.
* **/server** : API RESTful en PHP natif avec gestion JWT, architecture par contrôleurs et système de base de données MySQL.
* **/docs** : Spécifications détaillées de l'API et schéma de la base de données.

---

<<<<<<< HEAD
## 🚀 Installation Rapide
=======
## Installation Rapide
>>>>>>> b15df854a07d22763c416eb05e0909f0098fae85

### 1. Base de données
1.  Ouvrez votre gestionnaire MySQL (phpMyAdmin, MySQL Workbench, etc.).
2.  Créez une base de données nommée `quiz_app`.
3.  Importez le fichier `server/public/config/database.sql` pour créer les tables.
4.  *(Optionnel)* Exécutez le contenu de `server/public/config/debug.sql` pour ajouter des données de test.

### 2. Configuration Backend
Dans le dossier `server/public/config/` :
* **Base de données** : Modifiez `db.php` pour renseigner vos identifiants (`$host`, `$username`, `$password`).
* **Sécurité** : Dans `jwt.php`, remplacez `SUPER_SECRET_KEY_CHANGE_ME` par une clé secrète complexe.

### 3. Configuration Frontend
Le client est configuré pour communiquer avec le serveur local.
* Vérifiez le fichier `client/src/api/axiosInstance.ts`. Par défaut, la `baseURL` est vide pour utiliser le proxy ou le chemin relatif, mais vous pouvez y spécifier `http://localhost:8000`.

---

<<<<<<< HEAD
## 🛠️ Lancement du projet
=======
## Lancement du projet
>>>>>>> b15df854a07d22763c416eb05e0909f0098fae85

Le projet nécessite que le serveur et le client tournent simultanément.

### Démarrer le Backend (PHP)
Placez-vous dans le dossier `/server` et lancez le serveur PHP intégré sur le port 8000 :
```bash
php -S localhost:8000 -t public
```

### Démarrer le Frontend (React)
Placez-vous dans le dossier `/client` et exécutez les commandes suivantes :

```bash
# Installation des dépendances
npm install

# Lancement en mode développement (Vite)
npm run dev

# Lancement en mode production (Build + Preview)
npm run build
npm run preview
```

---

## Fonctionnalités Clés

*  **Système d'Authentification** : Inscription/Connexion sécurisée avec tokens JWT persistants.
*  **Hub & Navigation** : Système de catégories dynamique avec carrousel et recherche filtrée.
*  **Studio de Création** : Interface avancée pour créer ses propres quiz (Drag & Drop, brouillons JSON).
*  **Modes de Jeu** :
   *  **Solo** : Mode entraînement avec barre de progression et résultats détaillés.
   *  **Multijoueur** : Système de salons (Lobby) avec codes uniques à 6 caractères.
*  **Mécaniques de Jeu** : Gestion d'inventaire, pénalités entre joueurs, et multiplicateurs de score.

---

## Stack Technique & Architecture

| Composant| Technologie         |
| -------- | ------------------- |
| Frontend | React, TypeScript, Vite, Axios, Framer Motion, Lucide Icons |
| Backend  | PHP 8.x natif, PDO |
| Base de données | MySQL 8.0+ |
| Sécurité | Authentification JWT (Header Authorization Bearer) |

### Architecture Interne (Clean Code)

Le projet suit des principes de design rigoureux :

*  **Repository Pattern** : Abstraction de la source de données (permet de switcher entre une API réelle et un Mock JSON).
*  **Mappers** : Conversion des réponses API brutes en objets typés pour le Frontend.
*  **CSS Modules** : Isolation des styles pour éviter les conflits et faciliter la maintenance.

---

<<<<<<< HEAD
© 2026 Quiz Battle Project
=======
© 2026 Quiz Battle Project
>>>>>>> b15df854a07d22763c416eb05e0909f0098fae85
