'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/app/context/GameContext';
import { available_characters } from '@/app/data/characters';
import CharacterCard from '@/app/components/CharacterCard';
import { Character } from '@/app/types/game';

export default function PartyPage() {
  const { state, set_party_member, swap_party_members } = useGame();
  const [dragged_character, set_dragged_character] = useState<Character | null>(null);

  const party_slots = Array.from({ length: 3 }, (_, index) => 
    state.party.members[index] || null
  );

  const standby_characters = available_characters.filter(
    character => !state.party.members.some(member => member.id === character.id)
  );

  const handle_drag_start = (character: Character) => {
    set_dragged_character(character);
  };

  const handle_drop_to_party = (e: React.DragEvent, slot_index: number) => {
    e.preventDefault();
    if (!dragged_character) return;

    const from_party_index = state.party.members.findIndex(m => m.id === dragged_character.id);
    
    if (from_party_index !== -1) {
      // Character is already in party - swap positions
      if (from_party_index !== slot_index && slot_index < state.party.members.length) {
        swap_party_members(from_party_index, slot_index);
      }
    } else {
      // Character is from standby - add to party
      if (state.party.members.length < 3) {
        if (slot_index >= state.party.members.length) {
          // Add to end of party
          set_party_member(state.party.members.length, dragged_character);
        } else {
          // Insert at specific position
          set_party_member(slot_index, dragged_character);
        }
      }
    }
    
    set_dragged_character(null);
  };

  const handle_drop_to_standby = (e: React.DragEvent) => {
    e.preventDefault();
    if (!dragged_character) return;

    const from_party_index = state.party.members.findIndex(m => m.id === dragged_character.id);
    if (from_party_index !== -1) {
      set_party_member(from_party_index, null);
    }
    
    set_dragged_character(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">編成画面</h1>
          <Link
            href="/home"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            ホームに戻る
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Party Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">
              パーティ ({state.party.members.length}/3)
            </h2>
            
            <div className="grid grid-cols-1 gap-4">
              {party_slots.map((character, index) => (
                <div key={index} className="relative">
                  <div className="absolute -top-2 -left-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {index + 1}
                  </div>
                  <CharacterCard
                    character={character}
                    is_draggable={character !== null}
                    is_drop_zone={true}
                    slot_index={index}
                    on_drag_start={handle_drag_start}
                    on_drop={(e) => handle_drop_to_party(e, index)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Standby Section */}
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">待機メンバー</h2>
            
            <div 
              className="min-h-96 p-4 border-2 border-dashed border-gray-300 rounded-lg"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handle_drop_to_standby}
            >
              {standby_characters.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  待機中のキャラクターはいません
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {standby_characters.map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      is_draggable={true}
                      on_drag_start={handle_drag_start}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h3 className="font-bold text-blue-800 mb-2">操作方法</h3>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• キャラクターカードをドラッグしてパーティスロットにドロップすると編成に加わります</li>
            <li>• パーティメンバーを待機エリアにドラッグすると待機状態になります</li>
            <li>• パーティスロット間でドラッグ&ドロップすると順番を入れ替えられます</li>
          </ul>
        </div>
      </div>
    </div>
  );
}