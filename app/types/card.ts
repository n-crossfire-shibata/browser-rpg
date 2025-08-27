// カードシステム型定義
export type CardType = 'attack' | 'skill' | 'power';
export type CardRarity = 'common' | 'uncommon' | 'rare' | 'legendary';
export type EffectType = 
  | 'damage' 
  | 'heal' 
  | 'block' 
  | 'buff' 
  | 'debuff' 
  | 'draw_card' 
  | 'gain_energy';
export type TargetType = 
  | 'self' 
  | 'single_enemy' 
  | 'all_enemies' 
  | 'random_enemy';

export interface CardEffect {
  type: EffectType;
  value: number;
  target: TargetType;
}

export interface Card {
  id: string;
  name: string;
  description: string;
  flavor: string;
  cost: number;
  type: CardType;
  rarity: CardRarity;
  effects: CardEffect[];
  upgraded?: boolean;
}

export interface PlayerDeck {
  cards: Card[];
}