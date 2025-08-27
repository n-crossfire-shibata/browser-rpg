import { expect, test, describe } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { GameProvider, useGame } from '@/app/context/GameContext';
import { Character } from '@/app/types/game';

const test_character_1: Character = {
  id: 'test_1',
  name: 'テスト戦士',
  hp: 100,
  max_hp: 100,
  job: '戦士',
  image: '/images/characters/warrior.svg',
  flavor: 'テスト用戦士',
  cards: []
};

const test_character_2: Character = {
  id: 'test_2',
  name: 'テスト魔法使い',
  hp: 70,
  max_hp: 70,
  job: '魔法使い',
  image: '/images/characters/mage.svg',
  flavor: 'テスト用魔法使い',
  cards: []
};

const test_character_3: Character = {
  id: 'test_3',
  name: 'テスト僧侶',
  hp: 80,
  max_hp: 80,
  job: '僧侶',
  image: '/images/characters/cleric.svg',
  flavor: 'テスト用僧侶',
  cards: []
};

const test_character_4: Character = {
  id: 'test_4',
  name: 'テスト盗賊',
  hp: 75,
  max_hp: 75,
  job: '盗賊',
  image: '/images/characters/thief.svg',
  flavor: 'テスト用盗賊',
  cards: []
};

function wrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

describe('GameContext', () => {
  describe('初期状態', () => {
    test('パーティが空であること', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      expect(result.current.state.party.members).toEqual([]);
      expect(result.current.get_party_size()).toBe(0);
      expect(result.current.is_party_full()).toBe(false);
    });
  });

  describe('add_party_member', () => {
    test('キャラクターをパーティに追加できること', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
      });
      
      expect(result.current.state.party.members).toHaveLength(1);
      expect(result.current.state.party.members[0]).toEqual(test_character_1);
      expect(result.current.get_party_size()).toBe(1);
    });

    test('3人まで追加できること', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
        result.current.add_party_member(test_character_3);
      });
      
      expect(result.current.state.party.members).toHaveLength(3);
      expect(result.current.is_party_full()).toBe(true);
    });

    test('3人を超えて追加しようとしても追加されないこと', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
        result.current.add_party_member(test_character_3);
        result.current.add_party_member(test_character_4);
      });
      
      expect(result.current.state.party.members).toHaveLength(3);
      expect(result.current.state.party.members.find(m => m.id === 'test_4')).toBeUndefined();
    });
  });

  describe('remove_party_member', () => {
    test('キャラクターをパーティから削除できること', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
      });
      
      act(() => {
        result.current.remove_party_member(test_character_1.id);
      });
      
      expect(result.current.state.party.members).toHaveLength(1);
      expect(result.current.state.party.members[0]).toEqual(test_character_2);
    });

    test('存在しないキャラクターの削除は何も起こらないこと', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
      });
      
      act(() => {
        result.current.remove_party_member('non_existent');
      });
      
      expect(result.current.state.party.members).toHaveLength(1);
      expect(result.current.state.party.members[0]).toEqual(test_character_1);
    });
  });

  describe('set_party_member', () => {
    test('指定位置にキャラクターを設定できること', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.set_party_member(0, test_character_1);
      });
      
      expect(result.current.state.party.members).toHaveLength(1);
      expect(result.current.state.party.members[0]).toEqual(test_character_1);
    });

    test('指定位置のキャラクターを削除できること', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
      });
      
      act(() => {
        result.current.set_party_member(0, null);
      });
      
      expect(result.current.state.party.members).toHaveLength(1);
      expect(result.current.state.party.members[0]).toEqual(test_character_2);
    });

    test('既存メンバーの間にキャラクターを挿入できること', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      // 最初に2人追加
      act(() => {
        result.current.add_party_member(test_character_1); // index 0
        result.current.add_party_member(test_character_2); // index 1
      });
      
      // index 1の位置に新しいキャラクターを挿入
      act(() => {
        result.current.set_party_member(1, test_character_3);
      });
      
      expect(result.current.state.party.members).toHaveLength(3);
      expect(result.current.state.party.members[0]).toEqual(test_character_1); // 元の位置
      expect(result.current.state.party.members[1]).toEqual(test_character_3); // 挿入されたキャラ
      expect(result.current.state.party.members[2]).toEqual(test_character_2); // 後ろにずれた
    });

    test('最大3人制限が適用されること', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.set_party_member(0, test_character_1);
        result.current.set_party_member(1, test_character_2);
        result.current.set_party_member(2, test_character_3);
        result.current.set_party_member(3, test_character_4);
      });
      
      expect(result.current.state.party.members).toHaveLength(3);
      expect(result.current.state.party.members.find(m => m.id === 'test_4')).toBeUndefined();
    });
  });

  describe('swap_party_members', () => {
    test('パーティメンバーの位置を入れ替えできること', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
        result.current.add_party_member(test_character_3);
      });
      
      act(() => {
        result.current.swap_party_members(0, 2);
      });
      
      expect(result.current.state.party.members[0]).toEqual(test_character_3);
      expect(result.current.state.party.members[1]).toEqual(test_character_2);
      expect(result.current.state.party.members[2]).toEqual(test_character_1);
    });

    test('無効なインデックスでは何も起こらないこと', () => {
      const { result } = renderHook(() => useGame(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
      });
      
      const original_members = [...result.current.state.party.members];
      
      act(() => {
        result.current.swap_party_members(0, 5);
      });
      
      expect(result.current.state.party.members).toEqual(original_members);
    });
  });
});