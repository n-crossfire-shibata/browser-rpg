/**
 * PartyContext HP管理機能テスト
 * Phase 2: HP管理機能テスト
 */

import { expect, describe, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { PartyProvider, useParty } from '@/app/context/PartyContext';
import { Character } from '@/app/types/game';
import { ReactNode } from 'react';

const mock_warrior: Character = {
  id: 'warrior-1',
  name: '戦士',
  hp: 100,
  max_hp: 100,
  job: 'warrior',
  image: '/images/warrior.png',
  flavor: 'テスト用戦士',
  cards: []
};


const wrapper = ({ children }: { children: ReactNode }) => (
  <PartyProvider>{children}</PartyProvider>
);

describe('PartyContext HP管理機能', () => {
  describe('damage_character', () => {
    it('指定したキャラクターにダメージを与える', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      // キャラクターをパーティに追加
      act(() => {
        result.current.add_party_member(mock_warrior);
      });

      // ダメージを与える
      act(() => {
        result.current.damage_character('warrior-1', 30);
      });

      const damaged_character = result.current.party.members.find(c => c.id === 'warrior-1');
      expect(damaged_character?.hp).toBe(70); // 100 - 30 = 70
    });

    it('HPが0を下回らない', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(mock_warrior);
      });

      // 大きなダメージを与える
      act(() => {
        result.current.damage_character('warrior-1', 150);
      });

      const damaged_character = result.current.party.members.find(c => c.id === 'warrior-1');
      expect(damaged_character?.hp).toBe(0); // 負の値にならない
    });

    it('存在しないキャラクターの場合何もしない', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(mock_warrior);
      });

      const original_hp = result.current.party.members[0].hp;

      act(() => {
        result.current.damage_character('nonexistent', 50);
      });

      expect(result.current.party.members[0].hp).toBe(original_hp);
    });
  });

  describe('heal_character', () => {
    it('指定したキャラクターのHPを回復する', () => {
      const damaged_warrior = { ...mock_warrior, hp: 50 };
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(damaged_warrior);
      });

      act(() => {
        result.current.heal_character('warrior-1', 30);
      });

      const healed_character = result.current.party.members.find(c => c.id === 'warrior-1');
      expect(healed_character?.hp).toBe(80); // 50 + 30 = 80
    });

    it('最大HPを超えない', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(mock_warrior);
      });

      act(() => {
        result.current.heal_character('warrior-1', 50);
      });

      const healed_character = result.current.party.members.find(c => c.id === 'warrior-1');
      expect(healed_character?.hp).toBe(100); // max_hpを超えない
    });

    it('存在しないキャラクターの場合何もしない', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(mock_warrior);
      });

      const original_hp = result.current.party.members[0].hp;

      act(() => {
        result.current.heal_character('nonexistent', 50);
      });

      expect(result.current.party.members[0].hp).toBe(original_hp);
    });
  });

  describe('update_character_hp', () => {
    it('指定したキャラクターのHPを直接設定する', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(mock_warrior);
      });

      act(() => {
        result.current.update_character_hp('warrior-1', 75);
      });

      const updated_character = result.current.party.members.find(c => c.id === 'warrior-1');
      expect(updated_character?.hp).toBe(75);
    });

    it('HPが0未満の場合0にクランプする', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(mock_warrior);
      });

      act(() => {
        result.current.update_character_hp('warrior-1', -10);
      });

      const updated_character = result.current.party.members.find(c => c.id === 'warrior-1');
      expect(updated_character?.hp).toBe(0);
    });

    it('HPが最大HPを超える場合最大HPにクランプする', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(mock_warrior);
      });

      act(() => {
        result.current.update_character_hp('warrior-1', 150);
      });

      const updated_character = result.current.party.members.find(c => c.id === 'warrior-1');
      expect(updated_character?.hp).toBe(100); // max_hp
    });

    it('存在しないキャラクターの場合何もしない', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(mock_warrior);
      });

      const original_hp = result.current.party.members[0].hp;

      act(() => {
        result.current.update_character_hp('nonexistent', 50);
      });

      expect(result.current.party.members[0].hp).toBe(original_hp);
    });
  });

  describe('get_character_is_alive', () => {
    it('HPが1以上の場合trueを返す', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(mock_warrior);
      });

      expect(result.current.get_character_is_alive('warrior-1')).toBe(true);
    });

    it('HPが0の場合falseを返す', () => {
      const dead_warrior = { ...mock_warrior, hp: 0 };
      const { result } = renderHook(() => useParty(), { wrapper });
      
      act(() => {
        result.current.add_party_member(dead_warrior);
      });

      expect(result.current.get_character_is_alive('warrior-1')).toBe(false);
    });

    it('存在しないキャラクターの場合falseを返す', () => {
      const { result } = renderHook(() => useParty(), { wrapper });
      
      expect(result.current.get_character_is_alive('nonexistent')).toBe(false);
    });
  });
});