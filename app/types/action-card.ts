// ダンジョン探索時の行動カード型定義

export type ActionCardType = 'battle' | 'treasure' | 'rest' | 'event' | 'shop' | 'boss';

export interface ActionCard {
  id: string;
  type: ActionCardType;
  title: string;
  description: string;
  icon?: string;
}

// 行動カードの結果
export interface ActionResult {
  success: boolean;
  message: string;
  rewards?: {
    experience?: number;
    gold?: number;
    items?: string[];
  };
  next_floor?: boolean; // 次の階層に進むかどうか
}

// ダンジョン進行状態
export interface DungeonProgress {
  dungeon_id: string;
  current_floor: number;
  remaining_floors: number;
  total_floors: number;
}