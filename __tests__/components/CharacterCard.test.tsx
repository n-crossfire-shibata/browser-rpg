import { expect, test, describe, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CharacterCard from '@/app/components/CharacterCard';
import { Character } from '@/app/types/game';

const test_character: Character = {
  id: 'test_1',
  name: 'テスト戦士',
  hp: 85,
  max_hp: 100,
  job: '戦士',
  image: '/images/characters/warrior.svg',
  flavor: 'テスト用のフレーバーテキスト'
};

describe('CharacterCard', () => {
  describe('キャラクターありの場合', () => {
    test('キャラクター情報が正しく表示されること', () => {
      render(<CharacterCard character={test_character} />);
      
      expect(screen.getByText('テスト戦士')).toBeDefined();
      expect(screen.getByText('戦士')).toBeDefined();
      expect(screen.getByText('HP: 85/100')).toBeDefined();
    });

    test('キャラクター情報が表示されること', () => {
      render(<CharacterCard character={test_character} is_draggable={true} />);
      
      expect(screen.getByText('テスト戦士')).toBeDefined();
      expect(screen.getByText('戦士')).toBeDefined();
    });

    test('ドラッグ開始時にコールバックが呼ばれること', () => {
      const mock_drag_start = vi.fn();
      render(
        <CharacterCard 
          character={test_character} 
          is_draggable={true}
          on_drag_start={mock_drag_start}
        />
      );
      
      const card = screen.getByText('テスト戦士').closest('div') as Element;
      
      fireEvent.dragStart(card, {
        dataTransfer: {
          setData: vi.fn()
        }
      });
      
      expect(mock_drag_start).toHaveBeenCalledWith(test_character);
    });
  });

  describe('キャラクターなしの場合', () => {
    test('ドロップゾーンとして表示されること', () => {
      render(<CharacterCard character={null} is_drop_zone={true} />);
      
      expect(screen.getByText('空きスロット')).toBeDefined();
      expect(screen.getByText('空きスロット').closest('div')?.className).toContain('border-dashed');
    });

    test('スロット番号が表示されること', () => {
      render(<CharacterCard character={null} is_drop_zone={true} slot_index={0} />);
      
      expect(screen.getByText('スロット 1')).toBeDefined();
    });

    test('ドロップイベントが処理されること', () => {
      const mock_drop = vi.fn();
      render(
        <CharacterCard 
          character={null} 
          is_drop_zone={true}
          on_drop={mock_drop}
        />
      );
      
      const drop_zone = screen.getByText('空きスロット');
      
      fireEvent.dragOver(drop_zone);
      fireEvent.drop(drop_zone);
      
      expect(mock_drop).toHaveBeenCalled();
    });

    test('is_drop_zoneがfalseの場合、通常の空カードが表示されること', () => {
      render(<CharacterCard character={null} is_drop_zone={false} />);
      
      const empty_cards = document.querySelectorAll('.bg-gray-100');
      expect(empty_cards.length).toBeGreaterThan(0);
      expect(screen.queryByText('空きスロット')).toBeNull();
    });
  });

  describe('ドラッグ&ドロップ機能', () => {
    test('ドラッグオーバー時にコールバックが呼ばれること', () => {
      const mock_drag_over = vi.fn();
      render(
        <CharacterCard 
          character={test_character}
          is_drop_zone={true}
          on_drag_over={mock_drag_over}
        />
      );
      
      const card = screen.getByText('テスト戦士').closest('div') as Element;
      
      fireEvent.dragOver(card);
      
      expect(mock_drag_over).toHaveBeenCalled();
    });

    test('dataTransferにキャラクターデータが設定されること', () => {
      const mock_set_data = vi.fn();
      render(
        <CharacterCard 
          character={test_character}
          is_draggable={true}
        />
      );
      
      const card = screen.getByText('テスト戦士').closest('div') as Element;
      
      fireEvent.dragStart(card, {
        dataTransfer: {
          setData: mock_set_data
        }
      });
      
      expect(mock_set_data).toHaveBeenCalledWith('character', JSON.stringify(test_character));
    });
  });
});