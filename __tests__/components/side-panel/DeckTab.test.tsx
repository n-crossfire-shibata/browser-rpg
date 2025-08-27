import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import DeckTab from '@/app/components/side-panel/DeckTab';
import { Character } from '@/app/types/game';
import { BASIC_CARDS } from '@/app/data/cards';

const mockCharacter: Character = {
  id: 'test-char',
  name: 'テストキャラクター',
  hp: 100,
  max_hp: 100,
  job: 'テスト職',
  image: 'test.png',
  flavor: 'テストキャラクター',
  cards: [BASIC_CARDS[0], BASIC_CARDS[1], BASIC_CARDS[2]],
};

const mockCharacter2: Character = {
  id: 'test-char-2',
  name: 'テストキャラクター2',
  hp: 80,
  max_hp: 80,
  job: 'テスト職2',
  image: 'test2.png',
  flavor: 'テストキャラクター2',
  cards: [BASIC_CARDS[3], BASIC_CARDS[4]],
};

describe('DeckTab', () => {
  test('should display empty state when no party members', () => {
    render(<DeckTab party_members={[]} />);
    
    expect(screen.getByText('現在のデッキ')).toBeDefined();
    expect(screen.getByText('総カード数: 0枚')).toBeDefined();
    expect(screen.getByText(/パーティーメンバーがいません/)).toBeDefined();
    expect(screen.getByText(/編成画面でメンバーを追加してください/)).toBeDefined();
  });

  test('should display deck information with single character', () => {
    render(<DeckTab party_members={[mockCharacter]} />);
    
    expect(screen.getByText('現在のデッキ')).toBeDefined();
    expect(screen.getByText('総カード数: 3枚')).toBeDefined();
    expect(screen.getByText('カード構成')).toBeDefined();
  });

  test('should display correct deck statistics', () => {
    render(<DeckTab party_members={[mockCharacter]} />);
    
    // Check deck stats section exists
    expect(screen.getByText('カード構成')).toBeDefined();
    // Check that card type labels exist in the statistics area
    const statsSection = document.querySelector('.grid-cols-3');
    expect(statsSection?.textContent).toContain('攻撃');
    expect(statsSection?.textContent).toContain('スキル');
    expect(statsSection?.textContent).toContain('パワー');
  });

  test('should display unique cards with counts', () => {
    const characterWithDuplicates: Character = {
      ...mockCharacter,
      cards: [BASIC_CARDS[0], BASIC_CARDS[0], BASIC_CARDS[1]],
    };
    
    render(<DeckTab party_members={[characterWithDuplicates]} />);
    
    expect(screen.getAllByText(BASIC_CARDS[0].name)).toHaveLength(3); // Once in unique section, twice in character section
    expect(screen.getAllByText(BASIC_CARDS[1].name)).toHaveLength(2); // Once in unique section, once in character section
  });

  test('should display character-specific card sections', () => {
    render(<DeckTab party_members={[mockCharacter, mockCharacter2]} />);
    
    expect(screen.getByText('キャラクター別カード')).toBeDefined();
    expect(screen.getByText('1. テストキャラクター (テスト職)')).toBeDefined();
    expect(screen.getByText('2. テストキャラクター2 (テスト職2)')).toBeDefined();
  });

  test('should display all cards from multiple characters', () => {
    render(<DeckTab party_members={[mockCharacter, mockCharacter2]} />);
    
    expect(screen.getByText('総カード数: 5枚')).toBeDefined();
  });

  test('should show card details for each character', () => {
    render(<DeckTab party_members={[mockCharacter]} />);
    
    // Check that character's cards are displayed in unique section
    const uniqueCards = screen.getAllByText(BASIC_CARDS[0].name);
    expect(uniqueCards.length).toBeGreaterThanOrEqual(1);
  });

  test('should handle empty character cards', () => {
    const characterWithNoCards: Character = {
      ...mockCharacter,
      cards: [],
    };
    
    render(<DeckTab party_members={[characterWithNoCards]} />);
    
    expect(screen.getByText('総カード数: 0枚')).toBeDefined();
    expect(screen.getByText('1. テストキャラクター (テスト職)')).toBeDefined();
  });

  test('should maintain proper scroll container structure', () => {
    const { container } = render(<DeckTab party_members={[mockCharacter]} />);
    
    // Check for proper CSS classes that enable scrolling
    const scrollContainer = container.querySelector('.overflow-y-auto');
    expect(scrollContainer).toBeDefined();
    expect(scrollContainer?.className).toContain('flex-1');
    expect(scrollContainer?.className).toContain('min-h-0');
  });

  test('should display deck statistics with correct values for mixed party', () => {
    const warrior: Character = {
      id: 'warrior',
      name: '戦士',
      hp: 100,
      max_hp: 100,
      job: '戦士',
      image: 'warrior.png',
      flavor: '戦士',
      cards: [BASIC_CARDS[0], BASIC_CARDS[1]], // strike (attack), bash (attack)
    };
    
    const mage: Character = {
      id: 'mage',
      name: '魔法使い',
      hp: 70,
      max_hp: 70,
      job: '魔法使い',
      image: 'mage.png',
      flavor: '魔法使い',
      cards: [BASIC_CARDS[2], BASIC_CARDS[4]], // defend (skill), demon_form (power)
    };
    
    render(<DeckTab party_members={[warrior, mage]} />);
    
    expect(screen.getByText('総カード数: 4枚')).toBeDefined();
  });
});