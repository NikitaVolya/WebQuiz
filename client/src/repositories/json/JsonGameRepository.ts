/**
 * @file repositories/json/JsonGameRepository.ts
 * Simulation locale du serveur de jeu.
 */
import type { IGameRepository } from '../IGameRepository';
import type { 
  GameSession, 
  GamePlayer, 
  GameMode, 
  GameModifier 
} from '../../types/game';

// État en mémoire vive
let currentSession: GameSession | null = null;
let listeners: ((session: GameSession) => void)[] = [];

const repo = {
  async connect(): Promise<void> {
    console.log("[Mock Socket] Connexion établie.");
  },

  disconnect(): void {
    currentSession = null;
    listeners = [];
  },

  async createRoom(quizId: number, mode: GameMode, modifier: GameModifier): Promise<string> {
    await new Promise(res => setTimeout(res, 600));
    
    const code = Math.random().toString(36).substring(2, 6).toUpperCase();
    
    currentSession = {
      id: Math.floor(Math.random() * 1000),
      quizId: quizId,
      hostId: 1,
      roomCode: code,
      mode: mode,
      modifier: modifier,
      status: 'LOBBY',
      maxPlayers: 8,
      currentQuestionIndex: 0,
      players: []
    };

    return code;
  },

  async joinRoom(roomCode: string, playerInfo?: Partial<GamePlayer>): Promise<void> {
    await new Promise(res => setTimeout(res, 400));

    if (!currentSession || currentSession.roomCode !== roomCode) {
      throw new Error("Salle introuvable.");
    }

    const newPlayer: GamePlayer = {
      id: Math.floor(Math.random() * 10000),
      sessionId: currentSession.id,
      userId: playerInfo?.userId || 1,
      username: playerInfo?.username || 'Moi (Joueur)',
      avatarUrl: playerInfo?.avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=me',
      score: 0,
      isReady: false,
      isHost: currentSession.players.length === 0,
      inventory: [],
      penalties: [] 
    };

    currentSession.players.push(newPlayer);
    this._notify();

    // Simulation d'un adversaire
    setTimeout(() => {
      if (currentSession) {
        const bot: GamePlayer = {
          id: 999,
          sessionId: currentSession.id,
          userId: 42,
          username: 'Dark_Sasuke',
          avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bot',
          score: 0,
          isReady: true,
          isHost: false,
          inventory: [],
          penalties: []
        };
        currentSession.players.push(bot);
        this._notify();
      }
    }, 2000);
  },

  toggleReady(isReady: boolean): void {
    if (!currentSession) return;
    // On cherche le joueur par userId (simulé à 1)
    const me = currentSession.players.find(p => p.userId === 1);
    if (me) {
      me.isReady = isReady;
      this._notify();
    }
  },

  submitAnswer(questionId: number, answerId: number): void {
    console.log(`[Mock Server] Réponse reçue - Q:${questionId} R:${answerId}`);
  },

  leaveRoom(): void {
    this.disconnect();
  },

  onStateChange(callback: (session: GameSession) => void): void {
    listeners.push(callback);
  },

  onPlayerJoined(callback: (player: GamePlayer) => void): void {},

  onErrorMessage(callback: (message: string) => void): void {},

  _notify() {
    if (currentSession) {
      listeners.forEach(cb => cb({ ...currentSession! }));
    }
  }
};

export const JsonGameRepository: IGameRepository = repo;