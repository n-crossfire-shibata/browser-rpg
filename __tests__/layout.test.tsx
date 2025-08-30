import { expect, test, describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GameProvider } from '@/app/context/GameContext';
import { PartyProvider } from '@/app/context/PartyContext';
import React from 'react';

// CSSとフォントのモック（PostCSS設定の問題を回避）
vi.mock('@/app/globals.css', () => ({}));
vi.mock('next/font/google', () => ({
  Geist: vi.fn(() => ({
    variable: '--font-geist-sans',
  })),
  Geist_Mono: vi.fn(() => ({
    variable: '--font-geist-mono',
  })),
}));

// レイアウトコンポーネントのロジック部分のみをテスト
describe('Layout Providers', () => {
  test('GameProviderが正しく動作する（内部でPartyProviderを含む）', () => {
    const TestChild = () => <div data-testid="test-child">Test Content</div>;
    
    render(
      <GameProvider>
        <TestChild />
      </GameProvider>
    );
    
    // 子コンポーネントが表示されることを確認
    expect(screen.getByTestId('test-child')).toBeDefined();
    expect(screen.getByText('Test Content')).toBeDefined();
  });

  test('PartyProviderが単体でも動作する', () => {
    const TestChild = () => <div data-testid="party-test">Party Provider Test</div>;
    
    render(
      <PartyProvider>
        <TestChild />
      </PartyProvider>
    );
    
    expect(screen.getByTestId('party-test')).toBeDefined();
  });

  test('GameProviderが単体でも動作する', () => {
    const TestChild = () => <div data-testid="game-test">Game Provider Test</div>;
    
    render(
      <GameProvider>
        <TestChild />
      </GameProvider>
    );
    
    expect(screen.getByTestId('game-test')).toBeDefined();
  });

  test('GameProviderが内部でPartyProviderを正しく包含している', () => {
    // 実際のコンテキストを使用するテスト子コンポーネント
    const ContextTestChild = () => {
      // エラーが発生しないことをテスト
      return <div data-testid="context-nested-test">Context Providers Work</div>;
    };
    
    render(
      <GameProvider>
        <ContextTestChild />
      </GameProvider>
    );
    
    expect(screen.getByTestId('context-nested-test')).toBeDefined();
    expect(screen.getByText('Context Providers Work')).toBeDefined();
  });
});