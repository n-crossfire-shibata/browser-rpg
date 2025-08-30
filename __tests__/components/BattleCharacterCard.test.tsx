/**
 * BattleCharacterCard コンポーネントテスト
 * Phase 2: BattleCharacterCard テスト
 */

import { expect, describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import BattleCharacterCard from '@/app/battle/components/BattleCharacterCard';
import { Character } from '@/app/types/game';

const mock_healthy_warrior: Character = {
  id: 'warrior-1',
  name: '戦士',
  hp: 100,
  max_hp: 100,
  job: 'warrior',
  image: '/images/warrior.png',
  flavor: 'テスト用戦士',
  cards: []
};

const mock_damaged_warrior: Character = {
  id: 'warrior-2',
  name: '負傷戦士',
  hp: 30,
  max_hp: 100,
  job: 'warrior',
  image: '/images/warrior.png',
  flavor: 'ダメージを受けた戦士',
  cards: []
};

const mock_critical_warrior: Character = {
  id: 'warrior-critical',
  name: '瀕死戦士',
  hp: 20,
  max_hp: 100,
  job: 'warrior',
  image: '/images/warrior.png',
  flavor: '瀕死の戦士',
  cards: []
};

const mock_dead_warrior: Character = {
  id: 'warrior-3',
  name: '倒れた戦士',
  hp: 0,
  max_hp: 100,
  job: 'warrior',
  image: '/images/warrior.png',
  flavor: '戦闘不能の戦士',
  cards: []
};

describe('BattleCharacterCard', () => {
  describe('基本レンダリング', () => {
    it('健康なキャラクターを正しく表示する', () => {
      render(<BattleCharacterCard character={mock_healthy_warrior} />);
      
      expect(screen.getByText('戦士')).toBeInTheDocument();
      expect(screen.getByText('HP: 100/100')).toBeInTheDocument();
    });

    it('ダメージを受けたキャラクターを正しく表示する', () => {
      render(<BattleCharacterCard character={mock_damaged_warrior} />);
      
      expect(screen.getByText('負傷戦士')).toBeInTheDocument();
      expect(screen.getByText('HP: 30/100')).toBeInTheDocument();
    });

    it('戦闘不能キャラクターを正しく表示する', () => {
      render(<BattleCharacterCard character={mock_dead_warrior} />);
      
      expect(screen.getByText('倒れた戦士')).toBeInTheDocument();
      expect(screen.getByText('HP: 0/100')).toBeInTheDocument();
      expect(screen.getByText('戦闘不能')).toBeInTheDocument();
    });
  });

  describe('HP バー表示', () => {
    it('満タンHPの場合緑色のバーを表示', () => {
      const { container } = render(<BattleCharacterCard character={mock_healthy_warrior} />);
      
      const hp_bar = container.querySelector('.bg-green-500');
      expect(hp_bar).toBeInTheDocument();
      expect(hp_bar).toHaveStyle({ width: '100%' });
    });

    it('30%HPの場合黄色のバーを表示', () => {
      const { container } = render(<BattleCharacterCard character={mock_damaged_warrior} />);
      
      const hp_bar = container.querySelector('.bg-yellow-500');
      expect(hp_bar).toBeInTheDocument();
      expect(hp_bar).toHaveStyle({ width: '30%' });
    });

    it('20%HPの場合赤色のバーを表示', () => {
      const { container } = render(<BattleCharacterCard character={mock_critical_warrior} />);
      
      const hp_bar = container.querySelector('.bg-red-500');
      expect(hp_bar).toBeInTheDocument();
      expect(hp_bar).toHaveStyle({ width: '20%' });
    });

    it('0HPの場合灰色のバーを表示', () => {
      const { container } = render(<BattleCharacterCard character={mock_dead_warrior} />);
      
      const hp_bar = container.querySelector('.bg-gray-500');
      expect(hp_bar).toBeInTheDocument();
      expect(hp_bar).toHaveStyle({ width: '0%' });
    });
  });

  describe('死亡状態の視覚表現', () => {
    it('生きているキャラクターは透明度やグレースケールが適用されない', () => {
      const { container } = render(<BattleCharacterCard character={mock_healthy_warrior} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).not.toHaveClass('opacity-50');
      expect(card).not.toHaveClass('grayscale');
    });

    it('死んでいるキャラクターは透明度とグレースケールが適用される', () => {
      const { container } = render(<BattleCharacterCard character={mock_dead_warrior} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('opacity-50');
      expect(card).toHaveClass('grayscale');
    });
  });

  describe('敵/味方の区別', () => {
    it('味方キャラクターは青系の色で表示', () => {
      const { container } = render(<BattleCharacterCard character={mock_healthy_warrior} is_enemy={false} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-blue-800/50');
      expect(card).toHaveClass('border-blue-600');
    });

    it('敵キャラクターは赤系の色で表示', () => {
      const { container } = render(<BattleCharacterCard character={mock_healthy_warrior} is_enemy={true} />);
      
      const card = container.firstChild as HTMLElement;
      expect(card).toHaveClass('bg-red-800/50');
      expect(card).toHaveClass('border-red-600');
    });
  });

  describe('HPパーセンテージの計算', () => {
    it('max_hpが0の場合エラーにならない', () => {
      const zero_max_hp_character: Character = {
        ...mock_healthy_warrior,
        hp: 0,
        max_hp: 0
      };
      
      expect(() => {
        render(<BattleCharacterCard character={zero_max_hp_character} />);
      }).not.toThrow();
    });
  });
});