'use client';

import CharacterCard from '@/app/components/CharacterCard';
import { Character } from '@/app/types/game';

interface PartyTabProps {
  party_members: Character[];
}

export default function PartyTab({ party_members }: PartyTabProps) {
  return (
    <div className="h-full flex flex-col max-h-full">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <h2 className="text-lg font-bold text-gray-800">現在のパーティー</h2>
        <p className="text-sm text-gray-600">
          {party_members.length}/3 メンバー
        </p>
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
            {party_members.map((character, index) => (
              <div key={character.id} className="relative">
                <div className="absolute -left-2 top-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <CharacterCard 
                  character={character} 
                  is_draggable={false}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>総HP:</span>
            <span>
              {party_members.reduce((sum, char) => sum + char.hp, 0)}/
              {party_members.reduce((sum, char) => sum + char.max_hp, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}