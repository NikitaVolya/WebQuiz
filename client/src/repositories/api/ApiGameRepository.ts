/**
 * @file repositories/api/ApiGameRepository.ts
 */
import api from '../../api/axiosInstance';
import { type IGameRepository } from '../IGameRepository';
import { GameMapper } from './mappers/GameMapper';
import type { GameSession, GamePlayer, GameMode, GameModifier } from '../../types/game';

export class ApiGameRepository implements IGameRepository {
  private pollInterval: number | null = null;
  private currentRoomCode: string | null = null;
  private lastStateHash: string = '';

  // Callbacks
  private onStateChangeCb?: (session: GameSession) => void;
  private onPlayerJoinedCb?: (player: GamePlayer) => void;
  private onErrorMessageCb?: (message: string) => void;

  async connect(): Promise<void> {
    this.startPolling();
  }

  disconnect(): void {
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.currentRoomCode = null;
    this.lastStateHash = '';
  }

  async createRoom(quizId: number, mode: GameMode, modifier: GameModifier): Promise<string> {
    console.log("Token avant création:", localStorage.getItem('auth_token'));
    const res = await api.post('/rooms', { quiz_id: quizId, mode, modifier });
    this.currentRoomCode = res.data.room_code;
    
    await this.fetchState();
    return res.data.room_code;
  }

  async joinRoom(roomCode: string): Promise<void> {
    await api.post('/rooms/join', { room_code: roomCode });
    this.currentRoomCode = roomCode;
    
    await this.fetchState();
  }

  submitAnswer(questionId: number, answerId: number): void {
    if (!this.currentRoomCode) return;
    api.post(`/rooms/answer/${this.currentRoomCode}`, { answer_id: answerId })
       .catch(err => this.onErrorMessageCb?.(err.response?.data?.error || "Erreur réponse"));
  }

  // --- LOGIQUE DE RÉCUPÉRATION D'ÉTAT ---

  private async fetchState() {
    if (!this.currentRoomCode) return;

    try {
      const res = await api.get(`/rooms/status/${this.currentRoomCode}`);
      
      const sessionData: GameSession = GameMapper.toDomain(res.data);

      const stateHash = JSON.stringify(sessionData);
      if (stateHash !== this.lastStateHash) {
        this.lastStateHash = stateHash;
        this.onStateChangeCb?.(sessionData);
      }
    } catch (error) {
      console.error("Fetch state error", error);
    }
  }

  private startPolling() {
    if (this.pollInterval) clearInterval(this.pollInterval);

    this.pollInterval = window.setInterval(() => {
      this.fetchState();
    }, 2000);
  }

  // --- ÉCOUTEURS ---

  onStateChange(callback: (session: GameSession) => void) {
    this.onStateChangeCb = callback;
  }

  onPlayerJoined(callback: (player: GamePlayer) => void) {
    this.onPlayerJoinedCb = callback;
  }

  onErrorMessage(callback: (message: string) => void) {
    this.onErrorMessageCb = callback;
  }

  toggleReady(isReady: boolean): void {
    console.log("Toggle ready:", isReady);
  }

  leaveRoom(): void { 
    this.disconnect(); 
  }
}