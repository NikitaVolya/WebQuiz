import { type Item } from './Item';

export interface PlayerInventory {
  id: number;
  gamePlayerId: number;
  itemId: number;
  quantity: number;
  itemDetails?: Item;
}