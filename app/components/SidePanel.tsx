'use client';

import { useSidePanel } from '@/app/hooks/useSidePanel';
import PartyTab from './side-panel/PartyTab';
import { Character } from '@/app/types/game';

interface SidePanelProps {
  party_members: Character[];
}

const TAB_CONFIG = [
  { id: 'party' as const, label: 'パーティー', icon: '👥' },
  { id: 'inventory' as const, label: 'アイテム', icon: '🎒' },
  { id: 'settings' as const, label: '設定', icon: '⚙️' },
] as const;

export default function SidePanel({ party_members }: SidePanelProps) {
  const { is_open, active_tab, toggle_panel, close_panel, switch_tab } = useSidePanel();

  const render_tab_content = () => {
    switch (active_tab) {
      case 'party':
        return <PartyTab party_members={party_members} />;
      case 'inventory':
        return (
          <div className="p-4 text-center text-gray-500">
            インベントリ機能は開発中です
          </div>
        );
      case 'settings':
        return (
          <div className="p-4 text-center text-gray-500">
            設定機能は開発中です
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {/* オーバーレイ */}
      {is_open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={close_panel}
        />
      )}

      {/* フローティングボタン */}
      <button
        onClick={toggle_panel}
        className="fixed right-4 top-20 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-colors z-50"
        aria-label="サイドパネルを開く"
      >
        <span className="text-lg">👥</span>
      </button>

      {/* サイドパネル */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-80 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${
          is_open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ヘッダー */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <h1 className="text-lg font-bold text-gray-800">ゲーム情報</h1>
          <button
            onClick={close_panel}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            aria-label="サイドパネルを閉じる"
          >
            <span className="text-xl">×</span>
          </button>
        </div>

        {/* タブナビゲーション */}
        <div className="flex border-b border-gray-200">
          {TAB_CONFIG.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switch_tab(tab.id)}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                active_tab === tab.id
                  ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-500'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <span className="mr-1">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* タブコンテンツ */}
        <div className="flex-1 overflow-hidden">
          {render_tab_content()}
        </div>
      </div>
    </>
  );
}