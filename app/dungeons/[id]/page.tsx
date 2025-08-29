'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useGame } from '@/app/context/GameContext';
import { get_dungeon_by_id } from '@/app/data/dungeons';
import { battle_card } from '@/app/data/action-cards';
import { ActionCard } from '@/app/types/action-card';
import SidePanel from '@/app/components/SidePanel';

// ランダムに3つの行動カードを生成する関数
function generate_random_action_cards(count: number = 3): ActionCard[] {
  // 現在は戦闘カードのみを使用（3枚とも同じ戦闘カード）
  const cards: ActionCard[] = [];
  
  for (let i = 0; i < count; i++) {
    cards.push(battle_card);
  }
  
  return cards;
}

export default function DungeonExplorePage() {
  const router = useRouter();
  const params = useParams();
  const dungeon_id = params.id as string;
  
  const { state, start_dungeon, progress_floor, reset_dungeon } = useGame();
  const dungeon = get_dungeon_by_id(dungeon_id);
  
  // ダンジョンが存在しない場合は即座にリダイレクト、存在する場合は開始
  useEffect(() => {
    if (!dungeon) {
      router.push('/dungeons');
      return;
    }
    
    // まだダンジョンが開始されていない、または異なるダンジョンの場合は開始
    if (!state.dungeon_progress || state.dungeon_progress.dungeon_id !== dungeon_id) {
      // デフォルトで30階層に設定（実際のダンジョンデータには floors プロパティがないため）
      start_dungeon(dungeon_id, 30);
    }
  }, [dungeon, dungeon_id, router, start_dungeon, state.dungeon_progress]);

  const [action_cards, set_action_cards] = useState<ActionCard[]>(() => 
    dungeon ? generate_random_action_cards(3) : []
  );

  const handle_action_select = (action_card: ActionCard) => {
    // ダンジョンクリア済みの場合は何もしない
    if (state.dungeon_progress && state.dungeon_progress.remaining_floors === 0) {
      return;
    }

    console.log(`Selected action: ${action_card.title}`);

    progress_floor();
    
    // TODO: 行動結果の処理を実装
    switch (action_card.type) {
      case 'battle':
        // 戦闘画面への遷移またはバトル処理
        alert(`${action_card.title}を選択しました。戦闘処理を実装予定。`);
        break;
      default:
        alert(`${action_card.title}を選択しました。処理を実装予定。`);
    }
    
    // 新しい行動カードを生成（残り階層がまだある場合のみ）
    if (state.dungeon_progress && state.dungeon_progress.remaining_floors > 1) {
      const new_cards = generate_random_action_cards(3);
      set_action_cards(new_cards);
    }
  };

  const handle_exit_dungeon = () => {
    reset_dungeon();
    router.push('/home');
  };

  // ローディング判定を同期的に実行
  if (!dungeon || !state.dungeon_progress) {
    return <div className="flex justify-center items-center min-h-screen">読み込み中...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* サイドパネル */}
      <SidePanel party_members={state.party.members} />
      
      {/* メインコンテンツ */}
      <div className="flex-1 flex flex-col p-6">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800">{dungeon.name}</h1>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold text-gray-700">
                残り階層: <span className="text-blue-600">{state.dungeon_progress.remaining_floors}</span>
              </div>
              <div className="text-sm text-gray-500">
                {state.dungeon_progress.current_floor} / {state.dungeon_progress.total_floors} 階層
              </div>
            </div>
          </div>
        </div>

        {/* メインコンテンツエリア */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">行動を選択してください</h2>
          
          {/* 行動カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {state.dungeon_progress.remaining_floors > 0 ? (
              action_cards.map((card, index) => (
                <div
                  key={`${card.id}-${index}`}
                  className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-200 rounded-lg p-6 cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105"
                  onClick={() => handle_action_select(card)}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{card.icon}</div>
                    <h3 className="text-xl font-bold text-gray-800 mb-3">{card.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{card.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500 text-lg">
                ダンジョン攻略完了！下のボタンからホームに戻れます。
              </div>
            )}
          </div>
          
          {/* 階層進行情報 */}
          {state.dungeon_progress.remaining_floors === 0 && (
            <div className="mt-8 p-4 bg-green-100 border border-green-400 rounded-lg text-center">
              <h3 className="text-lg font-bold text-green-800">ダンジョンクリア！</h3>
              <p className="text-green-700">おめでとうございます！このダンジョンを完全攻略しました。</p>
              <button
                onClick={handle_exit_dungeon}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded transition-colors"
              >
                ホームに戻る
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}