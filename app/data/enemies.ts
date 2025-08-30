import { Enemy } from '@/app/types/enemy';

export const enemies: Enemy[] = [
  {
    id: 'goblin-1',
    name: 'ゴブリン',
    hp: 50,
    max_hp: 50,
    image: '/images/enemies/goblin.svg',
    ai_pattern: 'aggressive',
    actions: [
      {
        id: 'goblin-attack',
        name: '爪攻撃',
        damage: 15,
        target: 'single',
        description: '鋭い爪で単体を攻撃'
      },
      {
        id: 'goblin-rage',
        name: '怒りの咆哮',
        damage: 10,
        target: 'all',
        description: '怒りの咆哮で全体に小ダメージ'
      }
    ]
  },
  {
    id: 'orc-1',
    name: 'オーク',
    hp: 80,
    max_hp: 80,
    image: '/images/enemies/orc.svg',
    ai_pattern: 'defensive',
    actions: [
      {
        id: 'orc-club',
        name: '棍棒攻撃',
        damage: 25,
        target: 'single',
        description: '重い棍棒で強力な単体攻撃'
      },
      {
        id: 'orc-intimidate',
        name: '威嚇',
        damage: 5,
        target: 'random',
        description: 'ランダムな相手を威嚇して軽微なダメージ'
      }
    ]
  }
];