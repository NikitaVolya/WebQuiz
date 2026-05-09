/**
 * @file services/gameService.ts
 * Orchestre la logique de jeu et la communication temps-réel.
 */
import { JsonGameRepository as gameRepo } from '../repositories/json/JsonGameRepository';
import type { GameSession, GameMode, GameModifier } from "../types/game";

export const gameService = {
  /**
   * Initialise une nouvelle partie (Host)
   */
  initializeGame: async (params: { 
    quizId: number; 
    mode: GameMode; 
    modifier: GameModifier 
  }): Promise<string> => {
    // 1. Connexion au serveur (WebSocket)
    await gameRepo.connect();
    
    // 2. Création de la salle
    const roomCode = await gameRepo.createRoom(
      params.quizId, 
      params.mode,
      params.modifier
    );
    
    // 3. Le joueur qui crée rejoint automatiquement
    // Note: Le repo récupérera l'utilisateur actuel en interne ou via le serveur
    await gameRepo.joinRoom(roomCode);
    
    return roomCode;
  },

  /**
   * Rejoindre une partie existante via un code
   */
  joinExistingGame: async (code: string): Promise<void> => {
    const formattedCode = code.toUpperCase().trim();
    if (formattedCode.length !== 4) {
        throw new Error("Le code doit comporter 4 caractères.");
    }
    
    await gameRepo.connect();
    await gameRepo.joinRoom(formattedCode);
  },

  /**
   * Change l'état de préparation du joueur
   */
  setReadyStatus: (isReady: boolean) => {
    gameRepo.toggleReady(isReady);
  },

  /**
   * Envoi d'une réponse (IDs numériques désormais)
   */
  submitAnswer: (questionId: number, answerId: number) => {
    gameRepo.submitAnswer(questionId, answerId);
  },

  /**
   * Quitter proprement
   */
  leaveGame: () => {
    gameRepo.leaveRoom();
    gameRepo.disconnect();
  },

  /**
   * S'abonner aux changements d'état (GameSession)
   */
  subscribeToState: (callback: (session: GameSession) => void) => {
    gameRepo.onStateChange(callback);
  }
};