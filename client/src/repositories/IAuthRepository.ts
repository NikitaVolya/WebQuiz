/**
 * @file repositories/IAuthRepository.ts
 * Contrat d'interface pour l'authentification
 */
import type { User, UserCredentials, SignUpData } from '../types/auth';

export interface IAuthRepository {
  /**
   * Vérifie les identifiants auprès de la source de données
   * @returns L'utilisateur trouvé ou null si échec
   */
  authenticate(credentials: UserCredentials): Promise<User | null>;

  /**
   * Crée un nouvel utilisateur dans la base de données
   */
  create(data: SignUpData): Promise<User>;

  /**
   * Vérifie si un identifiant (email ou pseudo) est déjà pris
   */
  exists(field: 'email' | 'username', value: string): Promise<boolean>;

  /**
   * Récupère les données fraîches de l'utilisateur (ex: après un changement d'avatar)
   */
  getUserById(userId: number): Promise<User | null>;

  /**
   * Persistance locale : Sauvegarde l'état de connexion (Token ou User)
   */
  saveSession(user: User): void;

  /**
   * Persistance locale : Récupère la session au chargement de l'app
   */
  loadSession(): User | null;

  /**
   * Persistance locale : Supprime les données de session
   */
  destroySession(): void;
}