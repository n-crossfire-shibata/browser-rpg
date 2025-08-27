import { expect, test, describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SidePanel from '@/app/components/SidePanel';
import { Character } from '@/app/types/game';
import { TabType } from '@/app/hooks/useSidePanel';

// useSidePanelフックをモック
vi.mock('@/app/hooks/useSidePanel', () => ({
  useSidePanel: vi.fn()
}));

const test_characters: Character[] = [
  {
    id: 'char_1',
    name: 'テスト戦士',
    hp: 85,
    max_hp: 100,
    job: '戦士',
    image: '/images/characters/warrior.svg',
    flavor: 'テスト用のフレーバーテキスト',
    cards: []
  },
  {
    id: 'char_2',
    name: 'テスト魔法使い',
    hp: 60,
    max_hp: 80,
    job: '魔法使い',
    image: '/images/characters/mage.svg',
    flavor: 'テスト用の魔法使い',
    cards: []
  }
];

const default_hook_return = {
  is_open: false,
  active_tab: 'party' as TabType,
  toggle_panel: vi.fn(),
  open_panel: vi.fn(),
  close_panel: vi.fn(),
  switch_tab: vi.fn()
};

describe('SidePanel', () => {
  test('基本的なコンポーネントレンダリングが正常に動作すること', async () => {
    const { useSidePanel } = vi.mocked(await import('@/app/hooks/useSidePanel'));
    useSidePanel.mockReturnValue(default_hook_return);
    
    render(<SidePanel party_members={test_characters} />);
    
    const toggle_button = screen.getByLabelText('サイドパネルを開く');
    expect(toggle_button).toBeDefined();
    expect(toggle_button.textContent).toBe('👥');
  });

  test('パネル開いた状態で正常にレンダリングされること', async () => {
    const { useSidePanel } = vi.mocked(await import('@/app/hooks/useSidePanel'));
    useSidePanel.mockReturnValue({
      ...default_hook_return,
      is_open: true
    });
    
    render(<SidePanel party_members={test_characters} />);
    
    expect(screen.getByText('ゲーム情報')).toBeDefined();
    expect(screen.getByText('パーティー')).toBeDefined();
    expect(screen.getByText('デッキ')).toBeDefined();
    expect(screen.getByText('アイテム')).toBeDefined();
    expect(screen.getByText('設定')).toBeDefined();
  });

  test('パーティータブで正しくコンテンツが表示されること', async () => {
    const { useSidePanel } = vi.mocked(await import('@/app/hooks/useSidePanel'));
    useSidePanel.mockReturnValue({
      ...default_hook_return,
      is_open: true,
      active_tab: 'party'
    });
    
    render(<SidePanel party_members={test_characters} />);
    
    expect(screen.getByText('現在のパーティー')).toBeDefined();
    expect(screen.getByText('テスト戦士')).toBeDefined();
    expect(screen.getByText('テスト魔法使い')).toBeDefined();
  });

  test('デッキタブで正しくコンテンツが表示されること', async () => {
    const { useSidePanel } = vi.mocked(await import('@/app/hooks/useSidePanel'));
    useSidePanel.mockReturnValue({
      ...default_hook_return,
      is_open: true,
      active_tab: 'deck'
    });
    
    render(<SidePanel party_members={test_characters} />);
    
    expect(screen.getByText('現在のデッキ')).toBeDefined();
    expect(screen.getByText('カード構成')).toBeDefined();
  });

  test('inventoryタブで開発中メッセージが表示されること', async () => {
    const { useSidePanel } = vi.mocked(await import('@/app/hooks/useSidePanel'));
    useSidePanel.mockReturnValue({
      ...default_hook_return,
      is_open: true,
      active_tab: 'inventory'
    });
    
    render(<SidePanel party_members={test_characters} />);
    
    expect(screen.getByText('インベントリ機能は開発中です')).toBeDefined();
  });

  test('settingsタブで開発中メッセージが表示されること', async () => {
    const { useSidePanel } = vi.mocked(await import('@/app/hooks/useSidePanel'));
    useSidePanel.mockReturnValue({
      ...default_hook_return,
      is_open: true,
      active_tab: 'settings'
    });
    
    render(<SidePanel party_members={test_characters} />);
    
    expect(screen.getByText('設定機能は開発中です')).toBeDefined();
  });

  test('不正なタブでdefault caseが実行されること', async () => {
    const { useSidePanel } = vi.mocked(await import('@/app/hooks/useSidePanel'));
    // TypeScript型チェックを回避するため、一時的に型アサーションを使用
    type TestTabType = TabType | 'invalid_tab';
    
    useSidePanel.mockReturnValue({
      ...default_hook_return,
      is_open: true,
      active_tab: 'invalid_tab' as TestTabType as TabType
    });
    
    const { container } = render(<SidePanel party_members={test_characters} />);
    
    // default case (return null) により、タブコンテンツエリアが空になることを確認
    const content_area = container.querySelector('.flex-1.overflow-hidden');
    expect(content_area).toBeDefined();
    expect(content_area?.children).toHaveLength(0);
  });
});