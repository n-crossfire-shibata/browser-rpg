export interface Enemy {
  id: string;
  name: string;
  hp: number;
  max_hp: number;
  image: string;
  ai_pattern: 'aggressive' | 'defensive' | 'random';
  actions: EnemyAction[];
}

export interface EnemyAction {
  id: string;
  name: string;
  damage?: number;
  target: 'single' | 'all' | 'random';
  description: string;
}