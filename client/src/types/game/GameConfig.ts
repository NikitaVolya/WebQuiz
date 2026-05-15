import type { GameMode } from './GameMode';
import type { GameModifier } from './GameModifier';

export interface GameConfig {
  quizId: number;
  mode: GameMode;
  modifier: GameModifier;
}