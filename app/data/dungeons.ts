import { Dungeon } from '@/app/types/dungeon';

export const dungeons: Dungeon[] = [
  {
    id: 'hajimari-no-meikyuu',
    name: 'はじまりの迷宮',
    description: '冒険者が最初に挑戦するダンジョン。比較的安全で、基本的な戦闘を学べます。',
    difficulty: '初級'
  }
];

export function get_dungeon_by_id(id: string): Dungeon | undefined {
  return dungeons.find(dungeon => dungeon.id === id);
}