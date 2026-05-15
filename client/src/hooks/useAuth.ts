/**
 * @file hooks/useAuth.ts
 * Gère l'état de l'authentification pour les composants React.
 * Connecté au AuthService (Logique métier).
 */
import { useState, useEffect } from "react";
import { authService } from "../services/authService";
import type { User, UserCredentials, SignUpData } from "../types/auth";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Effet d'hydratation : vérifie si une session existe au chargement
   */
  useEffect(() => {
    const savedUser = authService.restoreSession();
    if (savedUser) {
      setUser(savedUser);
    }
  }, []);

  /**
   * Action de connexion
   */
  const signIn = async (credentials: UserCredentials) => {
    setIsPending(true);
    setError(null);
    try {
      const userData = await authService.signIn(credentials);
      setUser(userData);
      return userData;
    } catch (err: any) {
      const msg = err.message || "Erreur de connexion";
      setError(msg);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  /**
   * Action d'inscription
   */
  const signUp = async (data: SignUpData) => {
    setIsPending(true);
    setError(null);
    try {
      const userData = await authService.signUp(data);
      setUser(userData);
      return userData;
    } catch (err: any) {
      const msg = err.message || "Erreur lors de l'inscription";
      setError(msg);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  /**
   * Action de déconnexion
   */
  const signOut = () => {
    authService.signOut();
    setUser(null);
    setError(null);
  };

  return { 
    user, 
    isPending, 
    error,
    setError, 
    signIn, 
    signUp, 
    signOut,
    isLoggedIn: !!user
  };
};