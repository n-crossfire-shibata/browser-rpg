'use client';

import Image from 'next/image';
import { Character } from '@/app/types/game';

interface BattleCharacterCardProps {
  character: Character;
  is_enemy?: boolean;
}

export default function BattleCharacterCard({
  character,
  is_enemy = false
}: BattleCharacterCardProps) {
  const is_alive = character.hp > 0;
  const hp_percentage = character.max_hp > 0 ? (character.hp / character.max_hp) * 100 : 0;
  
  const bg_color = is_enemy ? 'bg-red-800/50' : 'bg-blue-800/50';
  const border_color = is_enemy ? 'border-red-600' : 'border-blue-600';
  
  return (
    <div
      className={`${bg_color} rounded-lg p-3 w-28 h-32 border ${border_color} flex-shrink-0 ${
        !is_alive ? 'opacity-50 grayscale' : ''
      }`}
    >
      <div className="text-white text-center h-full flex flex-col">
        {/* Character Image */}
        <div className="mb-1 flex justify-center">
          <div className="w-8 h-8 relative">
            <Image
              src={character.image}
              alt={character.name}
              width={32}
              height={32}
              className={`rounded-full border ${!is_alive ? 'opacity-50' : ''}`}
            />
            {!is_alive && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-red-500 font-bold text-lg">💀</div>
              </div>
            )}
          </div>
        </div>
        
        {/* Character Name */}
        <div className="text-sm font-bold truncate mb-1">{character.name}</div>
        
        {/* HP Display */}
        <div className="text-xs mb-1">
          HP: {character.hp}/{character.max_hp}
        </div>
        
        {/* HP Bar */}
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              is_alive 
                ? hp_percentage > 50 
                  ? 'bg-green-500' 
                  : hp_percentage > 25 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                : 'bg-gray-500'
            }`}
            style={{ width: `${hp_percentage}%` }}
          ></div>
        </div>
        
        {/* Status */}
        {!is_alive && (
          <div className="text-xs text-red-300 mt-1 font-bold">戦闘不能</div>
        )}
      </div>
    </div>
  );
}