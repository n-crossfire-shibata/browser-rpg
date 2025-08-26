import { expect, test, describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ReactNode } from 'react';
import PartyPage from '@/app/party/page';
import { GameProvider, useGame } from '@/app/context/GameContext';
import { Character } from '@/app/types/game';
import React from 'react';

// Mock Next.js Link component
vi.mock('next/link', () => {
  return {
    default: function MockLink({ children, href, ...props }: { children: ReactNode; href: string }) {
      return <a href={href} {...props}>{children}</a>;
    }
  };
});

const test_character_1: Character = {
  id: 'warrior_001',
  name: '戦士アレン',
  hp: 100,
  max_hp: 100,
  job: '戦士',
  image: '/images/characters/warrior.svg',
  flavor: 'テスト用戦士'
};

const test_character_2: Character = {
  id: 'mage_001',
  name: '魔法使いリナ',
  hp: 70,
  max_hp: 70,
  job: '魔法使い',
  image: '/images/characters/mage.svg',
  flavor: 'テスト用魔法使い'
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

describe('PartyPage', () => {
  describe('基本表示', () => {
    test('ページタイトルが表示されること', () => {
      render(
        <TestWrapper>
          <PartyPage />
        </TestWrapper>
      );
      
      expect(screen.getByText('編成画面')).toBeDefined();
    });

    test('ホームに戻るリンクが表示されること', () => {
      render(
        <TestWrapper>
          <PartyPage />
        </TestWrapper>
      );
      
      const home_link = screen.getByRole('link', { name: 'ホームに戻る' });
      expect(home_link).toBeDefined();
    });

    test('パーティセクションが表示されること', () => {
      render(
        <TestWrapper>
          <PartyPage />
        </TestWrapper>
      );
      
      expect(screen.getByText(/パーティ \(0\/3\)/)).toBeDefined();
    });

    test('待機メンバーセクションが表示されること', () => {
      render(
        <TestWrapper>
          <PartyPage />
        </TestWrapper>
      );
      
      expect(screen.getByText('待機メンバー')).toBeDefined();
    });

    test('操作方法が表示されること', () => {
      render(
        <TestWrapper>
          <PartyPage />
        </TestWrapper>
      );
      
      expect(screen.getByText('操作方法')).toBeDefined();
      expect(screen.getByText(/キャラクターカードをドラッグして/)).toBeDefined();
    });
  });

  describe('パーティが空の場合', () => {
    test('3つの空きスロットが表示されること', () => {
      render(
        <TestWrapper initial_party={[]}>
          <PartyPage />
        </TestWrapper>
      );
      
      expect(screen.getByText('スロット 1')).toBeDefined();
      expect(screen.getByText('スロット 2')).toBeDefined();
      expect(screen.getByText('スロット 3')).toBeDefined();
    });

    test('待機エリアに全キャラクターが表示されること', () => {
      render(
        <TestWrapper initial_party={[]}>
          <PartyPage />
        </TestWrapper>
      );
      
      // 初期キャラクターが表示されているかチェック
      expect(screen.getByText('戦士アレン')).toBeDefined();
      expect(screen.getByText('魔法使いリナ')).toBeDefined();
      expect(screen.getByText('僧侶ミア')).toBeDefined();
      expect(screen.getByText('盗賊カイ')).toBeDefined();
      expect(screen.getByText('弓使いユウ')).toBeDefined();
    });
  });

  describe('パーティにメンバーがいる場合', () => {
    test('パーティメンバーが正しく表示されること', () => {
      render(
        <TestWrapper initial_party={[test_character_1, test_character_2]}>
          <PartyPage />
        </TestWrapper>
      );
      
      const allen_elements = screen.getAllByText('戦士アレン');
      const lina_elements = screen.getAllByText('魔法使いリナ');
      
      // パーティエリアに表示される
      expect(allen_elements.length).toBeGreaterThan(0);
      expect(lina_elements.length).toBeGreaterThan(0);
    });

    test('パーティメンバーが待機エリアにも表示される', () => {
      render(
        <TestWrapper initial_party={[test_character_1]}>
          <PartyPage />
        </TestWrapper>
      );
      
      // パーティエリアにキャラクターが表示される（複数個所に表示される可能性あり）
      const allen_elements = screen.getAllByText('戦士アレン');
      expect(allen_elements.length).toBeGreaterThan(0);
      
      // 他のキャラクターは待機エリアに表示される
      expect(screen.getByText('魔法使いリナ')).toBeDefined();
      expect(screen.getByText('僧侶ミア')).toBeDefined();
    });
  });

  describe('ドラッグ&ドロップ機能', () => {
    test('待機キャラクターが表示されること', () => {
      render(
        <TestWrapper initial_party={[]}>
          <PartyPage />
        </TestWrapper>
      );
      
      expect(screen.getByText('戦士アレン')).toBeDefined();
      expect(screen.getByText('魔法使いリナ')).toBeDefined();
    });

    test('スロットがドロップゾーンとして機能すること', () => {
      render(
        <TestWrapper initial_party={[]}>
          <PartyPage />
        </TestWrapper>
      );
      
      const slot = screen.getByText('スロット 1');
      expect(slot.className).toContain('border-dashed');
    });
  });

  describe('パーティが満員の場合', () => {
    test('待機メンバーが少なくなること', () => {
      const three_characters = [
        test_character_1,
        test_character_2,
        {
          id: 'cleric_001',
          name: '僧侶ミア',
          hp: 80,
          max_hp: 80,
          job: '僧侶',
          image: '/images/characters/cleric.svg',
          flavor: 'テスト用僧侶'
        }
      ];

      render(
        <TestWrapper initial_party={three_characters}>
          <PartyPage />
        </TestWrapper>
      );
      
      expect(screen.getByText(/パーティ \(3\/3\)/)).toBeDefined();
      
      // 待機エリアには残り2キャラクターのみ表示
      const standby_characters = screen.getAllByText(/盗賊|弓使い/);
      expect(standby_characters.length).toBeGreaterThan(0);
    });
  });
});