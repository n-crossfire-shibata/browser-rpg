import { expect, test, describe } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { PartyProvider, useParty } from '@/app/context/PartyContext';
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
  return <PartyProvider>{children}</PartyProvider>;
}

describe('PartyContext', () => {
  describe('初期状態', () => {
    test('パーティが空であること', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      expect(result.current.party.members).toEqual([]);
      expect(result.current.get_party_size()).toBe(0);
      expect(result.current.is_party_full()).toBe(false);
    });
  });

  describe('add_party_member', () => {
    test('キャラクターをパーティに追加できること', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
      });
      
      expect(result.current.party.members).toHaveLength(1);
      expect(result.current.party.members[0]).toEqual(test_character_1);
      expect(result.current.get_party_size()).toBe(1);
    });

    test('3人まで追加できること', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
        result.current.add_party_member(test_character_3);
      });
      
      expect(result.current.party.members).toHaveLength(3);
      expect(result.current.is_party_full()).toBe(true);
    });

    test('3人を超えて追加しようとしても追加されないこと', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
        result.current.add_party_member(test_character_3);
        result.current.add_party_member(test_character_4);
      });
      
      expect(result.current.party.members).toHaveLength(3);
      expect(result.current.party.members.find(m => m.id === 'test_4')).toBeUndefined();
    });
  });

  describe('remove_party_member', () => {
    test('キャラクターをパーティから削除できること', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
      });
      
      act(() => {
        result.current.remove_party_member(test_character_1.id);
      });
      
      expect(result.current.party.members).toHaveLength(1);
      expect(result.current.party.members[0]).toEqual(test_character_2);
    });

    test('存在しないキャラクターの削除は何も起こらないこと', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
      });
      
      act(() => {
        result.current.remove_party_member('non_existent');
      });
      
      expect(result.current.party.members).toHaveLength(1);
      expect(result.current.party.members[0]).toEqual(test_character_1);
    });
  });

  describe('set_party_member', () => {
    test('指定位置にキャラクターを設定できること', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.set_party_member(0, test_character_1);
      });
      
      expect(result.current.party.members).toHaveLength(1);
      expect(result.current.party.members[0]).toEqual(test_character_1);
    });

    test('指定位置のキャラクターを削除できること', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
      });
      
      act(() => {
        result.current.set_party_member(0, null);
      });
      
      expect(result.current.party.members).toHaveLength(1);
      expect(result.current.party.members[0]).toEqual(test_character_2);
    });

    test('既存メンバーの間にキャラクターを挿入できること', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
      });
      
      act(() => {
        result.current.set_party_member(1, test_character_3);
      });
      
      expect(result.current.party.members).toHaveLength(3);
      expect(result.current.party.members[0]).toEqual(test_character_1);
      expect(result.current.party.members[1]).toEqual(test_character_3);
      expect(result.current.party.members[2]).toEqual(test_character_2);
    });

    test('最大3人制限が適用されること', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.set_party_member(0, test_character_1);
        result.current.set_party_member(1, test_character_2);
        result.current.set_party_member(2, test_character_3);
        result.current.set_party_member(3, test_character_4);
      });
      
      expect(result.current.party.members).toHaveLength(3);
      expect(result.current.party.members.find(m => m.id === 'test_4')).toBeUndefined();
    });

    test('範囲外のインデックスで削除しても何も起こらないこと', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
      });
      
      const original_members = [...result.current.party.members];
      
      act(() => {
        result.current.set_party_member(5, null);
      });
      
      expect(result.current.party.members).toEqual(original_members);
    });
  });

  describe('swap_party_members', () => {
    test('パーティメンバーの位置を入れ替えできること', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
        result.current.add_party_member(test_character_3);
      });
      
      act(() => {
        result.current.swap_party_members(0, 2);
      });
      
      expect(result.current.party.members[0]).toEqual(test_character_3);
      expect(result.current.party.members[1]).toEqual(test_character_2);
      expect(result.current.party.members[2]).toEqual(test_character_1);
    });

    test('無効なインデックスでは何も起こらないこと', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
      });
      
      const original_members = [...result.current.party.members];
      
      act(() => {
        result.current.swap_party_members(0, 5);
      });
      
      expect(result.current.party.members).toEqual(original_members);
    });

    test('同じインデックス同士の入れ替えでも問題ないこと', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
      });
      
      const original_members = [...result.current.party.members];
      
      act(() => {
        result.current.swap_party_members(0, 0);
      });
      
      expect(result.current.party.members).toEqual(original_members);
    });
  });

  describe('ユーティリティ関数', () => {
    test('is_party_full が正しく動作すること', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      expect(result.current.is_party_full()).toBe(false);
      
      act(() => {
        result.current.add_party_member(test_character_1);
        result.current.add_party_member(test_character_2);
      });
      
      expect(result.current.is_party_full()).toBe(false);
      
      act(() => {
        result.current.add_party_member(test_character_3);
      });
      
      expect(result.current.is_party_full()).toBe(true);
    });

    test('get_party_size が正しく動作すること', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      expect(result.current.get_party_size()).toBe(0);
      
      act(() => {
        result.current.add_party_member(test_character_1);
      });
      
      expect(result.current.get_party_size()).toBe(1);
      
      act(() => {
        result.current.add_party_member(test_character_2);
        result.current.add_party_member(test_character_3);
      });
      
      expect(result.current.get_party_size()).toBe(3);
    });
  });
});