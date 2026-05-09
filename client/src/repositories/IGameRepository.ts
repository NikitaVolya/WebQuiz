/**
 * @file repositories/IGameRepository.ts
 * Contrat pour la gestion du temps réel et de la logique de session de jeu.
 */
import type { 
  GameSession, 
  GamePlayer, 
  GameMode, 
  GameModifier 
} from '../types/game';

export interface IGameRepository {
  /**
   * Initialise la connexion au serveur (WebSocket)
   */
  connect(): Promise<void>;

  /**
   * Coupe la connexion et nettoie les écouteurs
   */
  disconnect(): void;

  /**
   * Demande la création d'une salle au serveur
   */
  createRoom(quizId: number, mode: GameMode, modifier: GameModifier): Promise<string>;

  /**
   * Tente de rejoindre une salle existante
   * playerInfo est optionnel car le serveur peut identifier l'utilisateur via sa session
   */
  joinRoom(roomCode: string, playerInfo?: Partial<GamePlayer>): Promise<void>;

  /**
   * Notifie le serveur que le joueur est prêt
   */
  toggleReady(isReady: boolean): void;

  /**
   * Envoie une réponse pour la question en cours
   * IDs numériques pour correspondre à la base de données
   */
  submitAnswer(questionId: number, answerId: number): void;

  /**
   * Quitte la salle actuelle
   */
  leaveRoom(): void;

  /**
   * ÉCOUTEURS (Flux entrants)
   */
  
  onStateChange(callback: (session: GameSession) => void): void;
  
  onPlayerJoined(callback: (player: GamePlayer) => void): void;
  
  onErrorMessage(callback: (message: string) => void): void;
}