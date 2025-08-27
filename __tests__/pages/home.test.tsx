import { expect, test, describe, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';
import HomePage from '@/app/home/page';
import { GameProvider, useGame } from '@/app/context/GameContext';
import { Character } from '@/app/types/game';
import React from 'react';

// Next.js Link コンポーネントのモック
vi.mock('next/link', () => ({
  default: ({ children, href, onClick, ...props }: { children: React.ReactNode; href: string; onClick?: (e: React.MouseEvent) => void; [key: string]: unknown }) => (
    <a href={href} onClick={(e) => {
      e.preventDefault(); // 実際の遷移を防ぐ
      onClick?.(e);
    }} {...props}>
      {children}
    </a>
  )
}));

const test_character_1: Character = {
  id: 'test_1',
  name: 'テスト戦士',
  hp: 100,
  max_hp: 100,
  job: '戦士',
  image: '/images/characters/warrior.svg',
  flavor: 'テスト用戦士'
};

const test_character_2: Character = {
  id: 'test_2',
  name: 'テスト魔法使い',
  hp: 70,
  max_hp: 70,
  job: '魔法使い',
  image: '/images/characters/mage.svg',
  flavor: 'テスト用魔法使い'
};

const test_character_3: Character = {
  id: 'test_3',
  name: 'テスト僧侶',
  hp: 80,
  max_hp: 80,
  job: '僧侶',
  image: '/images/characters/cleric.svg',
  flavor: 'テスト用僧侶'
};

function TestWrapper({ children, initial_party = [] }: { children: ReactNode; initial_party?: Character[] }) {
  return (
    <GameProvider>
      <TestPartySetup initial_party={initial_party} />
      {children}
    </GameProvider>
  );
}

function TestPartySetup({ initial_party }: { initial_party: Character[] }) {
  const { add_party_member } = useGame();
  
  React.useEffect(() => {
    initial_party.forEach(character => {
      add_party_member(character);
    });
  }, [initial_party, add_party_member]);
  
  return null;
}

describe('HomePage', () => {
  describe('基本表示', () => {
    test('ページタイトルが表示されること', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );
      
      expect(screen.getByText('ホーム画面')).toBeDefined();
    });

    test('編成セクションが表示されること', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );
      
      expect(screen.getByText('編成')).toBeDefined();
      expect(screen.getByText('パーティメンバーを編成しましょう')).toBeDefined();
      expect(screen.getByRole('link', { name: '編成画面へ' })).toBeDefined();
    });

    test('ダンジョンセクションが表示されること', () => {
      render(
        <TestWrapper>
          <HomePage />
        </TestWrapper>
      );
      
      expect(screen.getByText('ダンジョン')).toBeDefined();
      expect(screen.getByText('冒険に出かけましょう')).toBeDefined();
      expect(screen.getByRole('link', { name: 'ダンジョン選択へ' })).toBeDefined();
    });
  });

  describe('パーティが3人未満の場合', () => {
    test('パーティが空の場合、ダンジョンボタンクリックで警告モーダルが表示されること', () => {
      render(
        <TestWrapper initial_party={[]}>
          <HomePage />
        </TestWrapper>
      );
      
      const dungeon_link = screen.getByRole('link', { name: 'ダンジョン選択へ' });
      fireEvent.click(dungeon_link);
      
      expect(screen.getByText('パーティが不完全です')).toBeDefined();
      expect(screen.getByText('パーティーを3人編成してください')).toBeDefined();
    });

    test('警告モーダルのOKボタンでモーダルが閉じること', () => {
      render(
        <TestWrapper initial_party={[]}>
          <HomePage />
        </TestWrapper>
      );
      
      const dungeon_link = screen.getByRole('link', { name: 'ダンジョン選択へ' });
      fireEvent.click(dungeon_link);
      
      expect(screen.getByText('パーティが不完全です')).toBeDefined();
      
      const ok_button = screen.getByRole('button', { name: 'OK' });
      fireEvent.click(ok_button);
      
      expect(screen.queryByText('パーティが不完全です')).toBeNull();
    });
  });

  describe('パーティが3人の場合', () => {
    test('ダンジョンリンククリックで警告モーダルが表示されないこと', () => {
      render(
        <TestWrapper initial_party={[test_character_1, test_character_2, test_character_3]}>
          <HomePage />
        </TestWrapper>
      );
      
      const dungeon_link = screen.getByRole('link', { name: 'ダンジョン選択へ' });
      fireEvent.click(dungeon_link);
      
      expect(screen.queryByText('パーティが不完全です')).toBeNull();
      expect(dungeon_link.getAttribute('href')).toBe('/dungeons');
    });
  });
});