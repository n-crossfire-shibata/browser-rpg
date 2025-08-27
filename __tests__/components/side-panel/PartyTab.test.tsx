import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import PartyTab from '@/app/components/side-panel/PartyTab';
import { Character } from '@/app/types/game';

const test_characters: Character[] = [
  {
    id: 'char_1',
    name: 'テスト戦士',
    hp: 85,
    max_hp: 100,
    job: '戦士',
    image: '/images/characters/warrior.svg',
    flavor: 'テスト用のフレーバーテキスト'
  },
  {
    id: 'char_2',
    name: 'テスト魔法使い',
    hp: 60,
    max_hp: 80,
    job: '魔法使い',
    image: '/images/characters/mage.svg',
    flavor: 'テスト用の魔法使い'
  },
  {
    id: 'char_3',
    name: 'テスト盗賊',
    hp: 45,
    max_hp: 70,
    job: '盗賊',
    image: '/images/characters/thief.svg',
    flavor: 'テスト用の盗賊'
  }
];

describe('PartyTab', () => {
  describe('パーティーメンバーがいる場合', () => {
    test('ヘッダー情報が正しく表示されること', () => {
      render(<PartyTab party_members={test_characters} />);
      
      expect(screen.getByText('現在のパーティー')).toBeDefined();
      expect(screen.getByText('3/3 メンバー')).toBeDefined();
    });

    test('1人のメンバーが表示されること', () => {
      const one_member = [test_characters[0]];
      render(<PartyTab party_members={one_member} />);
      
      expect(screen.getByText('1/3 メンバー')).toBeDefined();
      expect(screen.getByText('テスト戦士')).toBeDefined();
      expect(screen.getByText('戦士')).toBeDefined();
      expect(screen.getByText('HP: 85/100')).toBeDefined();
    });

    test('2人のメンバーが表示されること', () => {
      const two_members = test_characters.slice(0, 2);
      render(<PartyTab party_members={two_members} />);
      
      expect(screen.getByText('2/3 メンバー')).toBeDefined();
      expect(screen.getByText('テスト戦士')).toBeDefined();
      expect(screen.getByText('テスト魔法使い')).toBeDefined();
    });

    test('3人のメンバーが表示されること', () => {
      render(<PartyTab party_members={test_characters} />);
      
      expect(screen.getByText('3/3 メンバー')).toBeDefined();
      expect(screen.getByText('テスト戦士')).toBeDefined();
      expect(screen.getByText('テスト魔法使い')).toBeDefined();
      expect(screen.getByText('テスト盗賊')).toBeDefined();
    });

    test('メンバーの番号が正しく表示されること', () => {
      render(<PartyTab party_members={test_characters} />);
      
      const number_badges = document.querySelectorAll('.bg-blue-500');
      expect(number_badges).toHaveLength(3);
      
      expect(screen.getByText('1')).toBeDefined();
      expect(screen.getByText('2')).toBeDefined();
      expect(screen.getByText('3')).toBeDefined();
    });

    test('総HPが正しく計算されること', () => {
      render(<PartyTab party_members={test_characters} />);
      
      // 85 + 60 + 45 = 190 (current HP)
      // 100 + 80 + 70 = 250 (max HP)
      expect(screen.getByText('190/250')).toBeDefined();
      expect(screen.getByText('総HP:')).toBeDefined();
    });

    test('単一メンバーの総HPが正しく計算されること', () => {
      const one_member = [test_characters[0]];
      render(<PartyTab party_members={one_member} />);
      
      expect(screen.getByText('85/100')).toBeDefined();
    });

    test('フッターの統計情報が表示されること', () => {
      render(<PartyTab party_members={test_characters} />);
      
      expect(screen.getByText('総HP:')).toBeDefined();
      // 総HPの値も確認
      expect(screen.getByText('190/250')).toBeDefined();
    });
  });

  describe('パーティーメンバーがいない場合', () => {
    test('空状態メッセージが表示されること', () => {
      render(<PartyTab party_members={[]} />);
      
      expect(screen.getByText('0/3 メンバー')).toBeDefined();
      expect(screen.getByText(/パーティーメンバーがいません/)).toBeDefined();
      expect(screen.getByText(/編成画面でメンバーを追加してください/)).toBeDefined();
    });

    test('空状態でも総HPが表示されること', () => {
      render(<PartyTab party_members={[]} />);
      
      expect(screen.getByText('総HP:')).toBeDefined();
      expect(screen.getByText('0/0')).toBeDefined();
    });

    test('キャラクターカードが表示されないこと', () => {
      render(<PartyTab party_members={[]} />);
      
      // キャラクター名が表示されていないことを確認
      expect(screen.queryByText('テスト戦士')).toBeNull();
      expect(screen.queryByText('テスト魔法使い')).toBeNull();
      expect(screen.queryByText('テスト盗賊')).toBeNull();
    });

    test('番号バッジが表示されないこと', () => {
      render(<PartyTab party_members={[]} />);
      
      const number_badges = document.querySelectorAll('.bg-blue-500');
      expect(number_badges).toHaveLength(0);
    });
  });

  describe('レイアウトとスタイリング', () => {
    test('正しいCSSクラスが適用されること', () => {
      render(<PartyTab party_members={test_characters} />);
      
      // ヘッダー部分のクラスを確認
      const header = screen.getByText('現在のパーティー').closest('div');
      expect(header).toBeDefined();
      
      // フッター部分の存在を確認
      const footer = screen.getByText('総HP:');
      expect(footer).toBeDefined();
    });

    test('スクロール可能なコンテンツエリアが存在すること', () => {
      render(<PartyTab party_members={test_characters} />);
      
      const scroll_area = document.querySelector('.overflow-y-auto');
      expect(scroll_area).toBeDefined();
      expect(scroll_area?.className).toContain('flex-1');
      expect(scroll_area?.className).toContain('overflow-y-auto');
      expect(scroll_area?.className).toContain('p-4');
    });

    test('番号バッジのスタイリングが正しいこと', () => {
      render(<PartyTab party_members={[test_characters[0]]} />);
      
      const badge = screen.getByText('1').closest('div');
      expect(badge?.className).toContain('bg-blue-500');
      expect(badge?.className).toContain('text-white');
      expect(badge?.className).toContain('text-xs');
      expect(badge?.className).toContain('rounded-full');
    });
  });

  describe('エッジケース', () => {
    test('HPが0のキャラクターも正しく表示されること', () => {
      const zero_hp_character: Character[] = [{
        ...test_characters[0],
        hp: 0
      }];
      
      render(<PartyTab party_members={zero_hp_character} />);
      
      expect(screen.getByText('HP: 0/100')).toBeDefined();
      expect(screen.getByText('0/100')).toBeDefined(); // 総HP表示
    });

    test('max_hpが0のキャラクターも正しく表示されること', () => {
      const zero_max_hp_character: Character[] = [{
        ...test_characters[0],
        hp: 0,
        max_hp: 0
      }];
      
      render(<PartyTab party_members={zero_max_hp_character} />);
      
      expect(screen.getByText('HP: 0/0')).toBeDefined();
      expect(screen.getByText('0/0')).toBeDefined(); // 総HP表示
    });

    test('長い名前のキャラクターも正しく表示されること', () => {
      const long_name_character: Character[] = [{
        ...test_characters[0],
        name: 'とても長いキャラクター名前テストケース'
      }];
      
      render(<PartyTab party_members={long_name_character} />);
      
      expect(screen.getByText('とても長いキャラクター名前テストケース')).toBeDefined();
    });
  });
});