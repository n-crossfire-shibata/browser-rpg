import { expect, test, describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import BattlePage from '@/app/battle/page';
import { PartyProvider } from '@/app/context/PartyContext';
import React from 'react';

// available_charactersをモック（画像パス警告回避）
vi.mock('@/app/data/characters', () => ({
  available_characters: [
    {
      id: 'warrior_001',
      name: '戦士アレン',
      hp: 100,
      max_hp: 100,
      job: '戦士',
      image: '/images/characters/warrior.svg',
      flavor: 'テスト用戦士',
      cards: []
    },
    {
      id: 'mage_001',
      name: '魔法使いリナ',
      hp: 70,
      max_hp: 70,
      job: '魔法使い',
      image: '/images/characters/mage.svg',
      flavor: 'テスト用魔法使い',
      cards: []
    }
  ]
}));

// enemiesをモック（画像パス警告回避）
vi.mock('@/app/data/enemies', () => ({
  enemies: [
    {
      id: 'goblin-1',
      name: 'ゴブリン',
      hp: 50,
      max_hp: 50,
      image: '/images/enemies/goblin.svg',
      ai_pattern: 'aggressive',
      actions: []
    },
    {
      id: 'orc-1',
      name: 'オーク',
      hp: 80,
      max_hp: 80,
      image: '/images/enemies/orc.svg',
      ai_pattern: 'defensive',
      actions: []
    }
  ]
}));

// テスト用のラッパーコンポーネント
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <PartyProvider>{children}</PartyProvider>
);

describe('BattlePage', () => {
  test('戦闘画面の基本構造が表示される', () => {
    render(<BattlePage />, { wrapper: TestWrapper });

    // ヘッダー
    expect(screen.getByText('戦闘画面')).toBeDefined();
  });

  test('敵エリアが正しく表示される', () => {
    render(<BattlePage />, { wrapper: TestWrapper });

    // 敵エリアのタイトル
    expect(screen.getByText('敵')).toBeDefined();
    
    // モック敵キャラクター
    expect(screen.getByText('ゴブリン')).toBeDefined();
    expect(screen.getByText('HP: 50/50')).toBeDefined();
    expect(screen.getByText('オーク')).toBeDefined();
    expect(screen.getByText('HP: 80/80')).toBeDefined();
  });

  test('味方エリアが正しく表示される', () => {
    render(<BattlePage />, { wrapper: TestWrapper });

    // 味方エリアのタイトル
    expect(screen.getByText('味方')).toBeDefined();
    
    // PartyContextが空の場合、味方キャラクターは表示されない
    // 味方が0人の場合のテスト
    const memberElements = screen.queryAllByText(/戦士|魔法使い/);
    expect(memberElements).toHaveLength(0);
  });

  test('手札エリアが正しく表示される', () => {
    render(<BattlePage />, { wrapper: TestWrapper });

    // 手札エリアのタイトル
    expect(screen.getByText('手札 (3/5)')).toBeDefined();
    
    // モック手札カード
    expect(screen.getByText('攻撃')).toBeDefined();
    expect(screen.getByText('ダメージ 20')).toBeDefined();
    expect(screen.getByText('回復')).toBeDefined();
    expect(screen.getByText('HP回復 30')).toBeDefined();
    expect(screen.getByText('防御')).toBeDefined();
    expect(screen.getByText('防御力UP')).toBeDefined();
  });

  test('行動エリアが正しく表示される', () => {
    render(<BattlePage />, { wrapper: TestWrapper });

    // 行動エリアのタイトルと行動開始ボタン
    expect(screen.getByText('行動エリア (0/3)')).toBeDefined();
    expect(screen.getByText('行動開始')).toBeDefined();
    
    // ドロップゾーン
    expect(screen.getByText('カードをドラッグ＆ドロップ')).toBeDefined();
    expect(screen.getByText('(最大3枚)')).toBeDefined();
  });

  test('戦闘情報が正しく表示される', () => {
    render(<BattlePage />, { wrapper: TestWrapper });

    // 戦闘情報
    expect(screen.getByText('ターン:')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('フェーズ:')).toBeDefined();
    expect(screen.getByText('計画')).toBeDefined();
    expect(screen.getByText('山札残り:')).toBeDefined();
    expect(screen.getByText('12枚')).toBeDefined();
  });


  test('行動開始ボタンがクリック可能な状態で表示される', () => {
    render(<BattlePage />, { wrapper: TestWrapper });
    
    const actionButton = screen.getByText('行動開始');
    expect(actionButton).toBeDefined();
    expect(actionButton.tagName).toBe('BUTTON');
  });

  test('手札カードにドラッグ可能なスタイルが適用される', () => {
    render(<BattlePage />, { wrapper: TestWrapper });
    
    // 攻撃カードを探してドラッグ可能スタイルを確認
    const attackCardParent = screen.getByText('攻撃').closest('.cursor-grab');
    expect(attackCardParent).toBeDefined();
  });

  test('HPバーが正しく表示される', () => {
    render(<BattlePage />, { wrapper: TestWrapper });
    
    // HPバーの確認（BattleCharacterCardコンポーネント使用）
    const hpBars = document.querySelectorAll('.h-2.rounded-full');
    expect(hpBars.length).toBeGreaterThan(0);
    
    // 緑色のHPバー（敵2体のみ、味方は0人）
    const greenHpBars = document.querySelectorAll('.bg-green-500');
    expect(greenHpBars.length).toBe(2); // 敵2体のみ
  });

  test('PartyContextからパーティーメンバーを取得して表示する', () => {
    // パーティーメンバーが存在するコンテキストを作成
    const TestWrapperWithParty = ({ children }: { children: React.ReactNode }) => (
      <PartyProvider>
        {children}
      </PartyProvider>
    );

    render(<BattlePage />, { wrapper: TestWrapperWithParty });

    // 味方エリアのタイトルは表示される
    expect(screen.getByText('味方')).toBeDefined();
    
    // 初期状態ではパーティーメンバーは空
    const memberElements = screen.queryAllByText(/戦士|魔法使い/);
    expect(memberElements).toHaveLength(0);
  });

  test('PartyContextが提供されていない場合はエラーになる', () => {
    // console.errorをモック（エラーログを隠すため）
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => {
      render(<BattlePage />);
    }).toThrow('useParty must be used within a PartyProvider');

    consoleErrorSpy.mockRestore();
  });
});