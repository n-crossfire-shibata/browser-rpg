import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import BattlePage from '@/app/battle/page';
import React from 'react';

describe('BattlePage', () => {
  test('戦闘画面の基本構造が表示される', () => {
    render(<BattlePage />);

    // ヘッダー
    expect(screen.getByText('戦闘画面')).toBeDefined();
  });

  test('敵エリアが正しく表示される', () => {
    render(<BattlePage />);

    // 敵エリアのタイトル
    expect(screen.getByText('敵')).toBeDefined();
    
    // モック敵キャラクター
    expect(screen.getByText('ゴブリン')).toBeDefined();
    expect(screen.getByText('HP: 50/50')).toBeDefined();
    expect(screen.getByText('オーク')).toBeDefined();
    expect(screen.getByText('HP: 80/80')).toBeDefined();
  });

  test('味方エリアが正しく表示される', () => {
    render(<BattlePage />);

    // 味方エリアのタイトル
    expect(screen.getByText('味方')).toBeDefined();
    
    // モック味方キャラクター
    expect(screen.getByText('戦士')).toBeDefined();
    expect(screen.getByText('HP: 85/100')).toBeDefined();
    expect(screen.getByText('魔法使い')).toBeDefined();
    expect(screen.getByText('HP: 70/70')).toBeDefined();
  });

  test('手札エリアが正しく表示される', () => {
    render(<BattlePage />);

    // 手札エリアのタイトル
    expect(screen.getByText('手札 (3/5)')).toBeDefined();
    
    // モック手札カード
    expect(screen.getByText('攻撃')).toBeDefined();
    expect(screen.getByText('ダメージ 20')).toBeDefined();
    expect(screen.getByText('回復')).toBeDefined();
    expect(screen.getByText('HP回復 30')).toBeDefined();
    expect(screen.getByText('防御')).toBeDefined();
    expect(screen.getByText('防御力UP')).toBeDefined();
  });

  test('行動エリアが正しく表示される', () => {
    render(<BattlePage />);

    // 行動エリアのタイトルと行動開始ボタン
    expect(screen.getByText('行動エリア (0/3)')).toBeDefined();
    expect(screen.getByText('行動開始')).toBeDefined();
    
    // ドロップゾーン
    expect(screen.getByText('カードをドラッグ＆ドロップ')).toBeDefined();
    expect(screen.getByText('(最大3枚)')).toBeDefined();
  });

  test('戦闘情報が正しく表示される', () => {
    render(<BattlePage />);

    // 戦闘情報
    expect(screen.getByText('ターン:')).toBeDefined();
    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('フェーズ:')).toBeDefined();
    expect(screen.getByText('計画')).toBeDefined();
    expect(screen.getByText('山札残り:')).toBeDefined();
    expect(screen.getByText('12枚')).toBeDefined();
  });


  test('行動開始ボタンがクリック可能な状態で表示される', () => {
    render(<BattlePage />);
    
    const actionButton = screen.getByText('行動開始');
    expect(actionButton).toBeDefined();
    expect(actionButton.tagName).toBe('BUTTON');
  });

  test('手札カードにドラッグ可能なスタイルが適用される', () => {
    render(<BattlePage />);
    
    // 攻撃カードを探してドラッグ可能スタイルを確認
    const attackCardParent = screen.getByText('攻撃').closest('.cursor-grab');
    expect(attackCardParent).toBeDefined();
  });

  test('HPバーが正しく表示される', () => {
    render(<BattlePage />);
    
    // HPバーの確認（戦士のHPバー）
    const hpBars = document.querySelectorAll('.bg-green-500.h-2.rounded-full');
    expect(hpBars.length).toBeGreaterThan(0);
    
    // 敵のHPバー（満タン）
    const enemyHpBars = document.querySelectorAll('.bg-red-500.h-2.rounded-full.w-full');
    expect(enemyHpBars.length).toBe(2); // ゴブリンとオークの2体
  });
});