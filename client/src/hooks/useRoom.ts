/**
 * @file hooks/useRoom.ts
 * Gère l'état d'une session de jeu (Lobby + Jeu en cours).
 */
import { useState, useEffect } from "react";
import { gameService } from "../services/gameService";
import type { GameSession, GameMode, GameModifier } from "../types/game";

export const useRoom = (currentUserId?: number) => {
  const [session, setSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    gameService.subscribeToState((newSession: GameSession) => {
      setSession(newSession);
    });

    return () => {
      gameService.leaveGame();
    };
  }, []);

  const create = async (quizId: number, mode: GameMode, modifier: GameModifier) => {
    setIsLoading(true);
    setError(null);
    try {
      await gameService.initializeGame({ quizId, mode, modifier });
    } catch (err: any) {
      setError(err.message || "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const join = async (code: string) => {
    setIsLoading(true);
    setError(null);
    try {
      await gameService.joinExistingGame(code);
    } catch (err: any) {
      setError(err.message || "Impossible de rejoindre");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleReady = (isReady: boolean) => gameService.setReadyStatus(isReady);
  
  const sendAnswer = (questionId: number, answerId: number) => 
    gameService.submitAnswer(questionId, answerId);

  return { 
    session,
    isLoading, 
    error, 
    create, 
    join, 
    toggleReady, 
    sendAnswer,
    me: session?.players.find(p => p.userId === currentUserId),
    isHost: session?.players.find(p => p.userId === currentUserId)?.isHost ?? false,
    players: session?.players ?? []
  };
};