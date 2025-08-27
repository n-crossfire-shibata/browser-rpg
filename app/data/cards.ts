import { Card } from '@/app/types/card';

// 基本カードデータ
export const BASIC_CARDS: Card[] = [
  // 攻撃カード
  {
    id: 'strike',
    name: 'ストライク',
    description: '敵に6ダメージを与える。',
    cost: 1,
    type: 'attack',
    rarity: 'common',
    effects: [
      {
        type: 'damage',
        value: 6,
        target: 'single_enemy',
      },
    ],
  },
  {
    id: 'bash',
    name: 'バッシュ',
    description: '敵に8ダメージを与え、脆弱を付与する。',
    cost: 2,
    type: 'attack',
    rarity: 'common',
    effects: [
      {
        type: 'damage',
        value: 8,
        target: 'single_enemy',
      },
      {
        type: 'debuff',
        value: 2,
        target: 'single_enemy',
      },
    ],
  },

  // スキルカード
  {
    id: 'defend',
    name: 'ディフェンド',
    description: '5防御を得る。',
    cost: 1,
    type: 'skill',
    rarity: 'common',
    effects: [
      {
        type: 'block',
        value: 5,
        target: 'self',
      },
    ],
  },
  {
    id: 'pommel_strike',
    name: 'ポメルストライク',
    description: '敵に9ダメージを与え、カードを1枚引く。',
    cost: 1,
    type: 'skill',
    rarity: 'common',
    effects: [
      {
        type: 'damage',
        value: 9,
        target: 'single_enemy',
      },
      {
        type: 'draw_card',
        value: 1,
        target: 'self',
      },
    ],
  },

  // パワーカード
  {
    id: 'demon_form',
    name: 'デーモンフォーム',
    description: '毎ターン開始時に筋力を2得る。',
    cost: 3,
    type: 'power',
    rarity: 'rare',
    effects: [
      {
        type: 'buff',
        value: 2,
        target: 'self',
      },
    ],
  },
  {
    id: 'inflame',
    name: 'インフレイム',
    description: '筋力を2得る。',
    cost: 1,
    type: 'power',
    rarity: 'uncommon',
    effects: [
      {
        type: 'buff',
        value: 2,
        target: 'self',
      },
    ],
  },
];

// キャラクター別カードセット（各キャラクター5枚）
export const CHARACTER_CARD_SETS: Record<string, Card[]> = {
  warrior_001: [
    BASIC_CARDS[0], // ストライク
    BASIC_CARDS[0], // ストライク
    BASIC_CARDS[1], // バッシュ
    BASIC_CARDS[2], // ディフェンド
    BASIC_CARDS[5], // インフレイム
  ],
  mage_001: [
    BASIC_CARDS[0], // ストライク
    BASIC_CARDS[3], // ポメルストライク
    BASIC_CARDS[3], // ポメルストライク
    BASIC_CARDS[2], // ディフェンド
    BASIC_CARDS[4], // デーモンフォーム
  ],
  cleric_001: [
    BASIC_CARDS[0], // ストライク
    BASIC_CARDS[2], // ディフェンド
    BASIC_CARDS[2], // ディフェンド
    BASIC_CARDS[2], // ディフェンド
    BASIC_CARDS[5], // インフレイム
  ],
  thief_001: [
    BASIC_CARDS[0], // ストライク
    BASIC_CARDS[1], // バッシュ
    BASIC_CARDS[3], // ポメルストライク
    BASIC_CARDS[3], // ポメルストライク
    BASIC_CARDS[2], // ディフェンド
  ],
  archer_001: [
    BASIC_CARDS[0], // ストライク
    BASIC_CARDS[0], // ストライク
    BASIC_CARDS[1], // バッシュ
    BASIC_CARDS[3], // ポメルストライク
    BASIC_CARDS[2], // ディフェンド
  ],
};