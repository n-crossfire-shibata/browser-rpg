'use client';

import { Card } from '@/app/types/card';

interface CardDisplayProps {
  card: Card;
  count?: number;
  show_count?: boolean;
}

const CARD_TYPE_COLORS = {
  attack: 'bg-red-100 border-red-400 text-red-800',
  skill: 'bg-blue-100 border-blue-400 text-blue-800',
  power: 'bg-purple-100 border-purple-400 text-purple-800',
};

const RARITY_COLORS = {
  common: 'bg-gray-200 text-gray-800',
  uncommon: 'bg-green-200 text-green-800',
  rare: 'bg-blue-200 text-blue-800',
  legendary: 'bg-yellow-200 text-yellow-800',
};

const CARD_TYPE_LABELS = {
  attack: '攻撃',
  skill: 'スキル',
  power: 'パワー',
};

const RARITY_LABELS = {
  common: 'コモン',
  uncommon: 'アンコモン',
  rare: 'レア',
  legendary: '伝説',
};

export default function CardDisplay({ card, count, show_count = false }: CardDisplayProps) {
  const type_color = CARD_TYPE_COLORS[card.type];
  const rarity_color = RARITY_COLORS[card.rarity];

  return (
    <div className={`p-3 border-2 rounded-lg ${type_color} relative`}>
      {/* カードコスト */}
      <div className="absolute -top-2 -left-2 bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
        {card.cost}
      </div>

      {/* カウント表示 */}
      {show_count && count && count > 1 && (
        <div className="absolute -top-2 -right-2 bg-gray-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
          {count}
        </div>
      )}

      {/* カード名 */}
      <h3 className="font-bold text-sm mb-1 pr-4">
        {card.name}
        {card.upgraded && <span className="text-xs text-yellow-600 ml-1">+</span>}
      </h3>

      {/* カードタイプとレアリティ */}
      <div className="flex gap-1 mb-2">
        <span className="text-xs px-2 py-1 rounded bg-white bg-opacity-70">
          {CARD_TYPE_LABELS[card.type]}
        </span>
        <span className={`text-xs px-2 py-1 rounded ${rarity_color}`}>
          {RARITY_LABELS[card.rarity]}
        </span>
      </div>

      {/* カード説明 */}
      <p className="text-xs leading-tight">
        {card.description}
      </p>

      {/* エフェクト情報 */}
      <div className="mt-2 space-y-1">
        {card.effects.map((effect, index) => (
          <div key={index} className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
            <span className="font-semibold">{effect.type}:</span> {effect.value} 
            <span className="text-gray-600 ml-1">({effect.target})</span>
          </div>
        ))}
      </div>
    </div>
  );
}