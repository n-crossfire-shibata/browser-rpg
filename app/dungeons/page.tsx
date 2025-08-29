'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDungeon } from '@/app/context/DungeonContext';
import { dungeons } from '@/app/data/dungeons';

export default function DungeonSelectPage() {
  const router = useRouter();
  const { start_dungeon } = useDungeon();
  
  const handle_dungeon_select = (dungeon_id: string) => {
    console.log(`Selected dungeon: ${dungeon_id}`);
    // ダンジョン初期化を先に実行
    start_dungeon(dungeon_id, 30);
    // その後ページ遷移
    router.push(`/dungeons/${dungeon_id}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link
            href="/home"
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mr-4"
          >
            ← 戻る
          </Link>
          <h1 className="text-4xl font-bold">
            ダンジョン選択
          </h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dungeons.map((dungeon) => (
            <div
              key={dungeon.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => handle_dungeon_select(dungeon.id)}
            >
              <div className="mb-4">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {dungeon.name}
                </h3>
                <div className="mb-3">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {dungeon.difficulty}
                  </span>
                </div>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {dungeon.description}
              </p>
              
              <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handle_dungeon_select(dungeon.id);
                }}
              >
                このダンジョンに挑戦する
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}