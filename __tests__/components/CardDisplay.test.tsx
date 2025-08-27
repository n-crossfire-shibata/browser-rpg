import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import CardDisplay from '@/app/components/CardDisplay';
import { Card } from '@/app/types/card';

const mockCard: Card = {
  id: 'test-card',
  name: 'テストカード',
  description: 'テスト用のカードです',
  flavor: 'テスト環境で使用される基本的なカード。',
  cost: 2,
  type: 'attack',
  rarity: 'common',
  effects: [
    {
      type: 'damage',
      value: 10,
      target: 'single_enemy',
    },
    {
      type: 'buff',
      value: 2,
      target: 'self',
    },
  ],
};

const mockUpgradedCard: Card = {
  ...mockCard,
  id: 'upgraded-card',
  name: 'アップグレードカード',
  upgraded: true,
};

describe('CardDisplay', () => {
  test('should render card information correctly', () => {
    render(<CardDisplay card={mockCard} />);
    
    expect(screen.getByText('テストカード')).toBeDefined();
    expect(screen.getByText('テスト用のカードです')).toBeDefined();
    // Check cost is displayed in the cost badge
    const costBadge = document.querySelector('.bg-yellow-400');
    expect(costBadge?.textContent).toBe('2');
    expect(screen.getByText('攻撃')).toBeDefined();
    expect(screen.getByText('コモン')).toBeDefined();
  });

  test('should display card effects', () => {
    render(<CardDisplay card={mockCard} />);
    
    expect(screen.getByText('damage:')).toBeDefined();
    expect(screen.getByText('10')).toBeDefined();
    expect(screen.getByText('(single_enemy)')).toBeDefined();
    
    expect(screen.getByText('buff:')).toBeDefined();
    expect(screen.getByText('(self)')).toBeDefined();
  });

  test('should show upgraded indicator for upgraded cards', () => {
    render(<CardDisplay card={mockUpgradedCard} />);
    
    expect(screen.getByText('+')).toBeDefined();
  });

  test('should not show upgraded indicator for normal cards', () => {
    render(<CardDisplay card={mockCard} />);
    
    expect(screen.queryByText('+')).toBeNull();
  });

  test('should display count when show_count is true and count > 1', () => {
    render(<CardDisplay card={mockCard} count={3} show_count={true} />);
    
    // Check count is displayed in the count badge
    const countBadge = document.querySelector('.bg-gray-600');
    expect(countBadge?.textContent).toBe('3');
  });

  test('should not display count when count is 1', () => {
    render(<CardDisplay card={mockCard} count={1} show_count={true} />);
    
    // Should not show count badge for count of 1
    const countBadge = document.querySelector('.bg-gray-600');
    expect(countBadge).toBeNull();
  });

  test('should not display count when show_count is false', () => {
    render(<CardDisplay card={mockCard} count={5} show_count={false} />);
    
    // Should not show count badge when show_count is false
    const countBadge = document.querySelector('.bg-gray-600');
    expect(countBadge).toBeNull();
  });

  test('should apply correct styling for different card types', () => {
    const skillCard: Card = { ...mockCard, type: 'skill', flavor: 'スキル系のテストカード。' };
    const powerCard: Card = { ...mockCard, type: 'power', flavor: 'パワー系のテストカード。' };
    
    const { rerender } = render(<CardDisplay card={mockCard} />);
    expect(screen.getByText('攻撃')).toBeDefined();
    
    rerender(<CardDisplay card={skillCard} />);
    expect(screen.getByText('スキル')).toBeDefined();
    
    rerender(<CardDisplay card={powerCard} />);
    expect(screen.getByText('パワー')).toBeDefined();
  });

  test('should apply correct styling for different rarities', () => {
    const uncommonCard: Card = { ...mockCard, rarity: 'uncommon', flavor: 'アンコモンレアリティのテストカード。' };
    const rareCard: Card = { ...mockCard, rarity: 'rare', flavor: 'レアレアリティのテストカード。' };
    const legendaryCard: Card = { ...mockCard, rarity: 'legendary', flavor: '伝説レアリティのテストカード。' };
    
    const { rerender } = render(<CardDisplay card={mockCard} />);
    expect(screen.getByText('コモン')).toBeDefined();
    
    rerender(<CardDisplay card={uncommonCard} />);
    expect(screen.getByText('アンコモン')).toBeDefined();
    
    rerender(<CardDisplay card={rareCard} />);
    expect(screen.getByText('レア')).toBeDefined();
    
    rerender(<CardDisplay card={legendaryCard} />);
    expect(screen.getByText('伝説')).toBeDefined();
  });

  test('should handle cards with no effects', () => {
    const cardWithNoEffects: Card = {
      ...mockCard,
      effects: [],
      flavor: 'エフェクトのないテストカード。',
    };
    
    render(<CardDisplay card={cardWithNoEffects} />);
    
    expect(screen.getByText('テストカード')).toBeDefined();
    expect(screen.getByText('テスト用のカードです')).toBeDefined();
  });

  test('should handle cards with multiple effects of the same type', () => {
    const cardWithMultipleEffects: Card = {
      ...mockCard,
      effects: [
        { type: 'damage', value: 5, target: 'single_enemy' },
        { type: 'damage', value: 3, target: 'all_enemies' },
      ],
      flavor: '複数エフェクトを持つテストカード。',
    };
    
    render(<CardDisplay card={cardWithMultipleEffects} />);
    
    const damageEffects = screen.getAllByText('damage:');
    expect(damageEffects).toHaveLength(2);
  });
});