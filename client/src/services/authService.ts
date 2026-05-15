/**
 * @file services/authService.ts
 * Logique métier de l'authentification.
 */
import type { User, UserCredentials, SignUpData } from '../types/auth';
// import { JsonAuthRepository as authRepo } from '../repositories/json/JsonAuthRepository';
import { ApiAuthRepository } from '../repositories/api/ApiAuthRepository';
const authRepo = new ApiAuthRepository();

import { studioService } from './studioService';

export const authService = {
  /**
   * Cas d'utilisation : Connexion de l'utilisateur
   */
  signIn: async (credentials: UserCredentials): Promise<User> => {
    // Règle métier : Validation de surface
    if (!credentials.email || !credentials.password) {
      throw new Error("Identifiants incomplets.");
    }
    
    const user = await authRepo.authenticate(credentials);
    
    if (!user) {
      throw new Error("Email ou mot de passe incorrect.");
    }

    // Persistance de la session
    authRepo.saveSession(user);
    
    return user;
  },

  /**
   * Cas d'utilisation : Inscription d'un nouvel utilisateur
   */
  signUp: async (data: SignUpData): Promise<User> => {
    // Règles métier : Validations
    if (data.username.length < 3) {
      throw new Error("Le pseudo doit contenir au moins 3 caractères.");
    }
    if (!data.email.includes('@')) {
      throw new Error("Format d'email invalide.");
    }

    // Vérification de disponibilité
    const emailExists = await authRepo.exists('email', data.email);
    if (emailExists) {
      throw new Error("Cet email est déjà utilisé.");
    }

    const nameExists = await authRepo.exists('username', data.username);
    if (nameExists) {
      throw new Error("Ce pseudo est déjà pris.");
    }

    const newUser = await authRepo.create(data);

    authRepo.saveSession(newUser);

    return newUser;
  },

  /**
   * Cas d'utilisation : Déconnexion
   */
  signOut: (): void => {
    authRepo.destroySession();
    studioService.clearCache();
  },

  /**
   * Cas d'utilisation : Restauration de session au démarrage
   */
  restoreSession: (): User | null => {
    return authRepo.loadSession();
  }
};