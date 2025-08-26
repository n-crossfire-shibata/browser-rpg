'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useGame } from '@/app/context/GameContext';
import Modal from '@/app/components/Modal';

export default function HomePage() {
  const { get_party_size } = useGame();
  const [show_party_warning, set_show_party_warning] = useState(false);

  const handle_dungeon_click = () => {
    if (get_party_size() < 3) {
      set_show_party_warning(true);
    } else {
      // TODO: Navigate to dungeon selection
      console.log('Navigate to dungeon selection');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          ホーム画面
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">編成</h2>
            <p className="text-gray-600 mb-4">
              パーティメンバーを編成しましょう
            </p>
            <Link
              href="/party"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded inline-block text-center"
            >
              編成画面へ
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">ダンジョン</h2>
            <p className="text-gray-600 mb-4">
              冒険に出かけましょう
            </p>
            <button 
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              onClick={handle_dungeon_click}
            >
              ダンジョン選択へ
            </button>
          </div>
        </div>
      </div>

      <Modal 
        is_open={show_party_warning} 
        on_close={() => set_show_party_warning(false)}
      >
        <div className="text-center">
          <h3 className="text-lg font-bold mb-4">パーティが不完全です</h3>
          <p className="text-gray-600 mb-6">
            パーティーを3人編成してください
          </p>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded"
            onClick={() => set_show_party_warning(false)}
          >
            OK
          </button>
        </div>
      </Modal>
    </div>
  );
}