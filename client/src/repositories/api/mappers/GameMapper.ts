/**
 * @file mappers/GameMapper.ts
 */
import type { GameSession, GamePlayer } from '../../../types/game';

export class GameMapper {
  /**
   * Transforme une session brute de l'API (PHP) vers le type Frontend
   */
  static toDomain(raw: any): GameSession {
    return {
      id: Number(raw.id),
      quizId: Number(raw.quiz_id),
      hostId: Number(raw.host_id),
      roomCode: raw.room_code,
      mode: raw.mode,
      modifier: raw.modifier,
      status: raw.status,
      maxPlayers: Number(raw.max_players),
      currentQuestionIndex: Number(raw.current_question_index),
      players: Array.isArray(raw.players) 
        ? raw.players.map((p: any) => this.toPlayer(p)) 
        : []
    };
  }

  /**
   * Transforme un joueur brut de l'API vers le type Frontend GamePlayer
   */
  static toPlayer(raw: any): GamePlayer {
    return {
      id: Number(raw.id),
      sessionId: Number(raw.session_id),
      userId: Number(raw.user_id),
      username: raw.username || 'Joueur',
      avatarUrl: raw.avatar_url || 'default_avatar.png',
      score: Number(raw.score || 0),
      isReady: Boolean(raw.is_ready),
      isHost: Boolean(raw.is_host),
      rank: raw.player_rank ? Number(raw.player_rank) : undefined,
      lastAnswerId: raw.last_answer_id ? Number(raw.last_answer_id) : undefined,
      inventory: [],
      penalties: []
    };
  }
}