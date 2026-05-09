export interface ActivePenalty {
  id: number;
  sessionId: number;
  targetId: number;
  attackerId: number;
  itemId: number;
  expiresAt: string | null;
  itemCodeName?: string; 
}