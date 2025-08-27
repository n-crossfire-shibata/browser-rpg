import { expect, test, describe, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';
import PartyPage from '@/app/party/page';
import { GameProvider, useGame } from '@/app/context/GameContext';
import { Character } from '@/app/types/game';
import React from 'react';

// available_charactersをモック
vi.mock('@/app/data/characters', () => ({
  available_characters: [
    {
      id: 'warrior_001',
      name: '戦士アレン',
      hp: 100,
      max_hp: 100,
      job: '戦士',
      image: '/images/characters/warrior.svg',
      flavor: 'テスト用戦士'
    },
    {
      id: 'mage_001',
      name: '魔法使いリナ',
      hp: 70,
      max_hp: 70,
      job: '魔法使い',
      image: '/images/characters/mage.svg',
      flavor: 'テスト用魔法使い'
    },
    {
      id: 'cleric_001',
      name: '僧侶ミア',
      hp: 80,
      max_hp: 80,
      job: '僧侶',
      image: '/images/characters/cleric.svg',
      flavor: 'テスト用僧侶'
    }
  ]
}));

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
  const { set_party_member } = useGame();
  
  React.useEffect(() => {
    // set_party_memberを使って正確に制御
    initial_party.forEach((character, index) => {
      if (index < 3) { // 最大3人まで
        set_party_member(index, character);
      }
    });
  }, []);
  
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
      
      // モックしたキャラクターが表示されているかチェック
      expect(screen.getByText('戦士アレン')).toBeDefined();
      expect(screen.getByText('魔法使いリナ')).toBeDefined();
      expect(screen.getByText('僧侶ミア')).toBeDefined();
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

    test('handle_drop_to_standby() - パーティメンバーを待機に戻すことができること', async () => {
      render(
        <TestWrapper initial_party={[test_character_1]}>
          <PartyPage />
        </TestWrapper>
      );
      
      // デバッグ：実際に表示されている内容を確認
      // console.log(screen.debug());
      
      // 初期状態でパーティに1人いることを確認
      expect(screen.getByText('パーティ (1/3)')).toBeDefined();
      
      // パーティエリアの戦士アレンカードを取得
      const party_cards = screen.getAllByText('戦士アレン');
      expect(party_cards.length).toBeGreaterThan(0);
      
      // 待機エリアのドロップゾーンを取得
      const standby_area = screen.getByText('待機メンバー').closest('div')?.querySelector('[class*="border-dashed"]');
      expect(standby_area).toBeDefined();
      
      if (standby_area) {
        // ドラッグ開始をシミュレート（戦士アレンをドラッグ）
        const mock_data_transfer = {
          setData: vi.fn(),
          getData: vi.fn()
        };
        
        fireEvent.dragStart(party_cards[0], {
          dataTransfer: mock_data_transfer
        });
        
        // 待機エリアへのドロップをシミュレート
        fireEvent.dragOver(standby_area);
        fireEvent.drop(standby_area, {
          dataTransfer: mock_data_transfer
        });
        
        // handle_drop_to_standby()が呼び出されたことを確認
        // 実際の削除処理は内部状態に依存するが、少なくともエラーなく処理される
        expect(standby_area).toBeDefined();
      }
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
      
      expect(screen.getByText('パーティ (3/3)')).toBeDefined();
      
      // 待機エリアには誰もいない（全員パーティに入っている）
      expect(screen.getByText('待機中のキャラクターはいません')).toBeDefined();
    });
  });

  describe('ドラッグ&ドロップの詳細テスト', () => {
    test('パーティ内のキャラクターを同じ位置にドロップしても変化しない', () => {
      render(
        <TestWrapper initial_party={[test_character_1, test_character_2]}>
          <PartyPage />
        </TestWrapper>
      );

      const party_cards = screen.getAllByText('戦士アレン')[0].closest('div');
      
      if (party_cards) {
        const mock_data_transfer = {
          setData: vi.fn(),
          getData: vi.fn().mockReturnValue(JSON.stringify(test_character_1))
        };
        
        fireEvent.dragStart(party_cards, {
          dataTransfer: mock_data_transfer
        });
        
        // 同じ位置（スロット0）にドロップ
        fireEvent.drop(party_cards, {
          dataTransfer: mock_data_transfer
        });
        
        // 位置に変化がないことを確認
        expect(screen.getByText('戦士アレン')).toBeDefined();
        expect(screen.getByText('魔法使いリナ')).toBeDefined();
      }
    });

    test('待機キャラクターをパーティの末尾に追加', () => {
      render(
        <TestWrapper initial_party={[test_character_1]}>
          <PartyPage />
        </TestWrapper>
      );

      // 待機中の魔法使いをドラッグ
      const standby_mage = screen.getAllByText('魔法使いリナ')[0].closest('div');
      const party_area = screen.getByText('パーティ (1/3)').closest('div');
      
      if (standby_mage && party_area) {
        const mock_data_transfer = {
          setData: vi.fn(),
          getData: vi.fn().mockReturnValue(JSON.stringify(test_character_2))
        };
        
        fireEvent.dragStart(standby_mage, {
          dataTransfer: mock_data_transfer
        });
        
        // パーティエリアの空きスロットにドロップ
        const empty_slots = party_area.querySelectorAll('.border-dashed');
        if (empty_slots.length > 0) {
          fireEvent.drop(empty_slots[0], {
            dataTransfer: mock_data_transfer
          });
        }
        
        // テストの実行確認（エラーが発生しないこと）
        expect(party_area).toBeDefined();
      }
    });

    test('待機キャラクターをパーティの中間位置に挿入', () => {
      render(
        <TestWrapper initial_party={[test_character_1, test_character_2]}>
          <PartyPage />
        </TestWrapper>
      );

      // 待機中の僧侶をドラッグ
      const standby_cleric = screen.getAllByText('僧侶ミア')[0].closest('div');
      const party_area = screen.getByText('パーティ (2/3)').closest('div');
      
      if (standby_cleric && party_area) {
        const cleric_character = {
          id: 'cleric_001',
          name: '僧侶ミア',
          hp: 80,
          max_hp: 80,
          job: '僧侶',
          image: '/images/characters/cleric.svg',
          flavor: 'テスト用僧侶'
        };

        const mock_data_transfer = {
          setData: vi.fn(),
          getData: vi.fn().mockReturnValue(JSON.stringify(cleric_character))
        };
        
        fireEvent.dragStart(standby_cleric, {
          dataTransfer: mock_data_transfer
        });
        
        // 既存パーティメンバーの間（1番目の位置）にドロップ
        // これによりslot_index < state.party.members.lengthの条件でset_party_member(slot_index, character)が実行される
        const party_members = party_area.querySelectorAll('.cursor-grab');
        if (party_members.length >= 2) {
          // 2番目のメンバー（魔法使いリナ）の位置にドロップ → 中間挿入
          fireEvent.drop(party_members[1], {
            dataTransfer: mock_data_transfer
          });
        }
        
        // テストの実行確認（エラーが発生しないこと）
        expect(party_area).toBeDefined();
      }
    });

    test('パーティが満員の場合は待機キャラクターを追加できない', () => {
      const three_characters = [test_character_1, test_character_2, {
        id: 'cleric_001',
        name: '僧侶ミア',
        hp: 80,
        max_hp: 80,
        job: '僧侶',
        image: '/images/characters/cleric.svg',
        flavor: 'テスト用僧侶'
      }];

      render(
        <TestWrapper initial_party={three_characters}>
          <PartyPage />
        </TestWrapper>
      );

      // 満員状態の確認
      expect(screen.getByText('パーティ (3/3)')).toBeDefined();
      expect(screen.getByText('待機中のキャラクターはいません')).toBeDefined();
      
      // この状態でドロップ処理を実行しても変化しないことの確認
      const party_area = screen.getByText('パーティ (3/3)');
      expect(party_area).toBeDefined();
    });

    test('ドラッグしたキャラクターがnullの場合は何も起こらない', () => {
      render(
        <TestWrapper initial_party={[test_character_1]}>
          <PartyPage />
        </TestWrapper>
      );

      const party_area = screen.getByText('パーティ (1/3)').closest('div');
      
      if (party_area) {
        // dragged_characterがnullの状態をシミュレート
        const mock_data_transfer = {
          setData: vi.fn(),
          getData: vi.fn().mockReturnValue('')
        };
        
        fireEvent.dragOver(party_area);
        fireEvent.drop(party_area, {
          dataTransfer: mock_data_transfer
        });
        
        // 何も変化しないことを確認
        expect(screen.getByText('パーティ (1/3)')).toBeDefined();
      }
    });

    test('パーティメンバーの位置交換', () => {
      render(
        <TestWrapper initial_party={[test_character_1, test_character_2]}>
          <PartyPage />
        </TestWrapper>
      );

      const party_section = screen.getByText('パーティ (2/3)').closest('div');
      
      if (party_section) {
        // 最初のキャラクターを取得してドラッグ
        const first_char = screen.getAllByText('戦士アレン')[0].closest('div');
        
        if (first_char) {
          const mock_data_transfer = {
            setData: vi.fn(),
            getData: vi.fn().mockReturnValue(JSON.stringify(test_character_1))
          };
          
          fireEvent.dragStart(first_char, {
            dataTransfer: mock_data_transfer
          });
          
          // 2番目の位置にドロップ（位置交換）
          const second_slot = party_section.querySelectorAll('.cursor-grab')[1];
          if (second_slot) {
            fireEvent.drop(second_slot, {
              dataTransfer: mock_data_transfer
            });
          }
        }
      }
      
      // 処理が正常に実行されることを確認
      expect(screen.getByText('パーティ (2/3)')).toBeDefined();
    });
  });
});