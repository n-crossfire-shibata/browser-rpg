import { expect, test, describe, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ReactNode } from 'react';
import DungeonSelectPage from '@/app/dungeons/page';
import { GameProvider } from '@/app/context/GameContext';

// Next.js Link コンポーネントのモック
vi.mock('next/link', () => {
  return {
    default: ({ children, href, className, ...props }: { children: React.ReactNode; href: string; className?: string; [key: string]: unknown }) => {
      return (
        <a href={href} className={className} {...props}>
          {children}
        </a>
      );
    }
  };
});

// Next.js useRouter のモック
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  })),
}));

function TestWrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

describe('DungeonSelectPage', () => {
  describe('基本表示', () => {
    test('ページタイトルが表示されること', () => {
      render(<DungeonSelectPage />, { wrapper: TestWrapper });
      expect(screen.getByText('ダンジョン選択')).toBeDefined();
    });

    test('戻るボタンが表示されること', () => {
      render(<DungeonSelectPage />, { wrapper: TestWrapper });
      const back_link = screen.getByRole('link', { name: '← 戻る' });
      expect(back_link).toBeDefined();
      expect(back_link.getAttribute('href')).toBe('/home');
    });
  });

  describe('ダンジョン表示', () => {
    test('はじまりの迷宮が表示されること', () => {
      render(<DungeonSelectPage />, { wrapper: TestWrapper });
      
      expect(screen.getByText('はじまりの迷宮')).toBeDefined();
      expect(screen.getByText('冒険者が最初に挑戦するダンジョン。比較的安全で、基本的な戦闘を学べます。')).toBeDefined();
      expect(screen.getByText('初級')).toBeDefined();
      expect(screen.getByRole('button', { name: 'このダンジョンに挑戦する' })).toBeDefined();
    });

    test('難易度バッジが正しく表示されること', () => {
      render(<DungeonSelectPage />, { wrapper: TestWrapper });
      
      const difficulty_badge = screen.getByText('初級');
      expect(difficulty_badge).toBeDefined();
      expect(difficulty_badge.className).toContain('bg-green-100');
      expect(difficulty_badge.className).toContain('text-green-800');
    });
  });

  describe('ダンジョン選択機能', () => {
    test('ダンジョンカードクリックで選択処理が実行されること', () => {
      const console_log_spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      render(<DungeonSelectPage />, { wrapper: TestWrapper });
      
      const dungeon_card = screen.getByText('はじまりの迷宮').closest('div');
      fireEvent.click(dungeon_card!);
      
      expect(console_log_spy).toHaveBeenCalledWith('Selected dungeon: hajimari-no-meikyuu');
      
      console_log_spy.mockRestore();
    });

    test('挑戦ボタンクリックで選択処理が実行されること', () => {
      const console_log_spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      render(<DungeonSelectPage />, { wrapper: TestWrapper });
      
      const challenge_button = screen.getByRole('button', { name: 'このダンジョンに挑戦する' });
      fireEvent.click(challenge_button);
      
      expect(console_log_spy).toHaveBeenCalledWith('Selected dungeon: hajimari-no-meikyuu');
      
      console_log_spy.mockRestore();
    });

    test('挑戦ボタンクリック時にイベント伝播が停止されること', () => {
      const console_log_spy = vi.spyOn(console, 'log').mockImplementation(() => {});
      
      render(<DungeonSelectPage />, { wrapper: TestWrapper });
      
      const challenge_button = screen.getByRole('button', { name: 'このダンジョンに挑戦する' });
      fireEvent.click(challenge_button);
      
      // ボタンクリック時に1回だけ呼ばれることを確認（カードクリックとボタンクリックの重複なし）
      expect(console_log_spy).toHaveBeenCalledTimes(1);
      expect(console_log_spy).toHaveBeenCalledWith('Selected dungeon: hajimari-no-meikyuu');
      
      console_log_spy.mockRestore();
    });
  });

  describe('レスポンシブデザイン', () => {
    test('グリッドレイアウトのクラスが正しく設定されていること', () => {
      render(<DungeonSelectPage />, { wrapper: TestWrapper });
      
      // ダンジョンカードの親要素（グリッドコンテナ）を取得
      const container = screen.getByText('ダンジョン選択').parentElement;
      const grid_container = container?.querySelector('.grid');
      
      expect(grid_container).toBeDefined();
      if (grid_container) {
        expect(grid_container.className).toContain('grid');
        expect(grid_container.className).toContain('grid-cols-1');
        expect(grid_container.className).toContain('md:grid-cols-2');
        expect(grid_container.className).toContain('lg:grid-cols-3');
      }
    });
  });
});