import { type PlayerInventory } from './PlayerInventory';
import { type ActivePenalty } from './ActivePenalty';

export interface GamePlayer {
  id: number;
  sessionId: number;
  userId: number;
  username: string;
  avatarUrl: string;
  score: number;
  isReady: boolean;
  isHost: boolean;
  rank?: number;
  lastAnswerId?: number;
  
  inventory: PlayerInventory[];
  penalties: ActivePenalty[];
}