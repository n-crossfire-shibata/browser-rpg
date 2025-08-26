'use client';

import Image from 'next/image';
import { Character } from '@/app/types/game';

interface CharacterCardProps {
  character: Character | null;
  is_draggable?: boolean;
  is_drop_zone?: boolean;
  on_drag_start?: (character: Character) => void;
  on_drag_over?: (e: React.DragEvent) => void;
  on_drop?: (e: React.DragEvent) => void;
  slot_index?: number;
}

export default function CharacterCard({
  character,
  is_draggable = true,
  is_drop_zone = false,
  on_drag_start,
  on_drag_over,
  on_drop,
  slot_index
}: CharacterCardProps) {
  const handle_drag_start = (e: React.DragEvent, character: Character) => {
    e.dataTransfer.setData('character', JSON.stringify(character));
    if (on_drag_start) {
      on_drag_start(character);
    }
  };

  const handle_drag_over = (e: React.DragEvent) => {
    e.preventDefault();
    if (on_drag_over) {
      on_drag_over(e);
    }
  };

  const handle_drop = (e: React.DragEvent) => {
    e.preventDefault();
    if (on_drop) {
      on_drop(e);
    }
  };

  if (!character && is_drop_zone) {
    return (
      <div
        className="w-full h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors"
        onDragOver={handle_drag_over}
        onDrop={handle_drop}
      >
        {slot_index !== undefined ? `スロット ${slot_index + 1}` : '空きスロット'}
      </div>
    );
  }

  if (!character) {
    return (
      <div className="w-full h-24 border border-gray-200 rounded-lg bg-gray-100"></div>
    );
  }

  return (
    <div
      className={`w-full p-4 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow ${
        is_draggable ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
      draggable={is_draggable}
      onDragStart={(e) => handle_drag_start(e, character)}
      onDragOver={is_drop_zone ? handle_drag_over : undefined}
      onDrop={is_drop_zone ? handle_drop : undefined}
    >
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <Image
            src={character.image}
            alt={character.name}
            width={48}
            height={48}
            className="rounded-full border"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-sm truncate">{character.name}</div>
          <div className="text-xs text-gray-600 mb-1">{character.job}</div>
          <div className="text-xs text-gray-500 mb-2">
            <div>HP: {character.hp}/{character.max_hp}</div>
          </div>
          <div className="text-xs text-gray-400 italic line-clamp-2">
            {character.flavor}
          </div>
        </div>
      </div>
    </div>
  );
}