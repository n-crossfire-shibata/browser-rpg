'use client';

import { useDeck } from '@/app/hooks/useDeck';
import { Character } from '@/app/types/game';
import CardDisplay from '@/app/components/CardDisplay';

interface DeckTabProps {
  party_members: Character[];
}

export default function DeckTab({ party_members }: DeckTabProps) {
  const { get_unique_cards, get_card_count, total_cards, deck_stats } = useDeck(party_members);

  const unique_cards = get_unique_cards();

  return (
    <div className="h-full flex flex-col max-h-full">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-800">現在のデッキ</h2>
        <p className="text-sm text-gray-600">
          総カード数: {total_cards}枚
        </p>
      </div>

      {/* デッキ統計 */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
        <h3 className="font-semibold text-sm mb-2">カード構成</h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="text-red-600 font-bold">{deck_stats.attack_cards}</div>
            <div className="text-gray-600">攻撃</div>
          </div>
          <div className="text-center">
            <div className="text-blue-600 font-bold">{deck_stats.skill_cards}</div>
            <div className="text-gray-600">スキル</div>
          </div>
          <div className="text-center">
            <div className="text-purple-600 font-bold">{deck_stats.power_cards}</div>
            <div className="text-gray-600">パワー</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 min-h-0" style={{ scrollbarWidth: 'thin' }}>
        {party_members.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="text-gray-500 text-center">
              パーティーメンバーがいません<br />
              編成画面でメンバーを追加してください
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-1 gap-3">
              {unique_cards.map((card) => (
                <CardDisplay
                  key={card.id}
                  card={card}
                  count={get_card_count(card.id)}
                  show_count={true}
                />
              ))}
            </div>
            
            {/* キャラクター別カード表示 */}
            <div className="mt-6">
              <h3 className="font-semibold text-sm mb-3 text-gray-700">キャラクター別カード</h3>
              {party_members.map((character, index) => (
                <div key={character.id} className="mb-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">
                    {index + 1}. {character.name} ({character.job})
                  </h4>
                  <div className="grid grid-cols-1 gap-2 ml-2">
                    {character.cards.map((card, cardIndex) => (
                      <div key={`${character.id}-${cardIndex}`} className="transform scale-90 origin-left">
                        <CardDisplay card={card} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}