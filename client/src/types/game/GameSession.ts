import { type GameMode } from './GameMode';
import { type GameModifier } from './GameModifier';
import { type RoomStatus } from './RoomStatus';
import { type GamePlayer } from './GamePlayer';

export interface GameSession {
  id: number;
  quizId: number;
  hostId: number;
  roomCode: string;
  mode: GameMode;
  modifier: GameModifier;
  status: RoomStatus;
  maxPlayers: number;
  currentQuestionIndex: number;
  players: GamePlayer[];
}