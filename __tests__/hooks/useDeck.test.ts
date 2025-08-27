import { expect, test, describe } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDeck } from '@/app/hooks/useDeck';
import { Character } from '@/app/types/game';
import { BASIC_CARDS } from '@/app/data/cards';

const mockCharacterWithCards = (id: string, name: string, cardIndices: number[]): Character => ({
  id,
  name,
  hp: 100,
  max_hp: 100,
  job: 'テスト職',
  image: 'test.png',
  flavor: 'テストキャラクター',
  cards: cardIndices.map(index => BASIC_CARDS[index]),
});

describe('useDeck', () => {
  test('should return empty deck when no party members', () => {
    const { result } = renderHook(() => useDeck([]));
    
    expect(result.current.current_deck).toEqual([]);
    expect(result.current.total_cards).toBe(0);
  });

  test('should combine cards from all party members', () => {
    const character1 = mockCharacterWithCards('char1', 'キャラ1', [0, 1]);
    const character2 = mockCharacterWithCards('char2', 'キャラ2', [2, 3]);
    
    const { result } = renderHook(() => useDeck([character1, character2]));
    
    expect(result.current.current_deck).toHaveLength(4);
    expect(result.current.total_cards).toBe(4);
  });

  test('should get cards by character ID', () => {
    const character1 = mockCharacterWithCards('char1', 'キャラ1', [0, 1]);
    const character2 = mockCharacterWithCards('char2', 'キャラ2', [2, 3]);
    
    const { result } = renderHook(() => useDeck([character1, character2]));
    
    const char1Cards = result.current.get_cards_by_character('char1');
    expect(char1Cards).toHaveLength(2);
    expect(char1Cards[0]).toEqual(BASIC_CARDS[0]);
    expect(char1Cards[1]).toEqual(BASIC_CARDS[1]);
  });

  test('should return empty array for non-existent character', () => {
    const character1 = mockCharacterWithCards('char1', 'キャラ1', [0, 1]);
    
    const { result } = renderHook(() => useDeck([character1]));
    
    const nonExistentCards = result.current.get_cards_by_character('non-existent');
    expect(nonExistentCards).toEqual([]);
  });

  test('should filter cards by type', () => {
    const character1 = mockCharacterWithCards('char1', 'キャラ1', [0, 1, 2]);
    
    const { result } = renderHook(() => useDeck([character1]));
    
    const attackCards = result.current.get_cards_by_type('attack');
    const skillCards = result.current.get_cards_by_type('skill');
    
    expect(attackCards).toHaveLength(2); // ストライク、バッシュ
    expect(skillCards).toHaveLength(1);  // ディフェンド
  });

  test('should filter cards by rarity', () => {
    const character1 = mockCharacterWithCards('char1', 'キャラ1', [0, 1, 4]);
    
    const { result } = renderHook(() => useDeck([character1]));
    
    const commonCards = result.current.get_cards_by_rarity('common');
    const rareCards = result.current.get_cards_by_rarity('rare');
    
    expect(commonCards).toHaveLength(2);
    expect(rareCards).toHaveLength(1);
  });

  test('should return unique cards', () => {
    const character1 = mockCharacterWithCards('char1', 'キャラ1', [0, 0, 1]);
    
    const { result } = renderHook(() => useDeck([character1]));
    
    const uniqueCards = result.current.get_unique_cards();
    expect(uniqueCards).toHaveLength(2);
    expect(uniqueCards.map(card => card.id)).toContain(BASIC_CARDS[0].id);
    expect(uniqueCards.map(card => card.id)).toContain(BASIC_CARDS[1].id);
  });

  test('should count card occurrences', () => {
    const character1 = mockCharacterWithCards('char1', 'キャラ1', [0, 0, 1]);
    
    const { result } = renderHook(() => useDeck([character1]));
    
    const strikeCount = result.current.get_card_count(BASIC_CARDS[0].id);
    const bashCount = result.current.get_card_count(BASIC_CARDS[1].id);
    
    expect(strikeCount).toBe(2);
    expect(bashCount).toBe(1);
  });

  test('should calculate deck statistics', () => {
    const character1 = mockCharacterWithCards('char1', 'キャラ1', [0, 1, 2, 4, 5]);
    
    const { result } = renderHook(() => useDeck([character1]));
    
    const stats = result.current.deck_stats;
    expect(stats.attack_cards).toBe(2);  // ストライク、バッシュ
    expect(stats.skill_cards).toBe(1);   // ディフェンド
    expect(stats.power_cards).toBe(2);   // デーモンフォーム、インフレイム
    expect(stats.common_cards).toBe(3);
    expect(stats.rare_cards).toBe(1);
    expect(stats.uncommon_cards).toBe(1);
  });

  test('should update when party members change', () => {
    const character1 = mockCharacterWithCards('char1', 'キャラ1', [0, 1]);
    const character2 = mockCharacterWithCards('char2', 'キャラ2', [2, 3]);
    
    const { result, rerender } = renderHook(
      ({ members }) => useDeck(members),
      { initialProps: { members: [character1] } }
    );
    
    expect(result.current.total_cards).toBe(2);
    
    rerender({ members: [character1, character2] });
    expect(result.current.total_cards).toBe(4);
  });
});