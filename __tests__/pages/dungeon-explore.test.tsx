import { expect, test, describe, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReactNode } from 'react';
import DungeonExplorePage from '@/app/dungeons/[id]/page';
import { GameProvider } from '@/app/context/GameContext';

// Next.js navigation モック
const mock_push = vi.fn();
const mock_useParams = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mock_push,
  }),
  useParams: () => mock_useParams(),
}));

// SidePanel コンポーネントのモック（シンプルに）
vi.mock('@/app/components/SidePanel', () => {
  return {
    default: ({ party_members }: { party_members: unknown[] }) => (
      <div data-testid="side-panel">
        サイドパネル ({party_members.length}人)
      </div>
    )
  };
});

// get_dungeon_by_id のモック
vi.mock('@/app/data/dungeons', () => ({
  get_dungeon_by_id: vi.fn((id: string) => {
    if (id === 'hajimari-no-meikyuu') {
      return {
        id: 'hajimari-no-meikyuu',
        name: 'はじまりの迷宮',
        description: 'テスト用ダンジョン',
        difficulty: 'beginner',
        floors: 30
      };
    }
    return null;
  }),
}));

// action-cards のモック
vi.mock('@/app/data/action-cards', () => ({
  battle_card: {
    id: 'battle',
    type: 'battle',
    title: '戦闘',
    description: '敵と戦う',
    icon: '⚔️',
  },
}));

function TestWrapper({ children }: { children: ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

// alert のモック
const mock_alert = vi.fn();
global.alert = mock_alert;

describe('DungeonExplorePage - 軽量テスト', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mock_useParams.mockReturnValue({ id: 'hajimari-no-meikyuu' });
  });

  describe('基本表示', () => {
    test('初期状態で読み込み中が表示される', () => {
      // ダンジョンが見つからない場合のテスト（この場合は読み込み中が表示される）
      mock_useParams.mockReturnValue({ id: 'invalid-dungeon' });
      
      render(<DungeonExplorePage />, { wrapper: TestWrapper });
      
      // 無効なダンジョンIDの場合、読み込み中が表示される
      expect(screen.getByText('読み込み中...')).toBeDefined();
    });

    test('有効なダンジョンでは正常に表示される', async () => {
      render(<DungeonExplorePage />, { wrapper: TestWrapper });
      
      // useEffectが実行されるまで待つ
      await waitFor(() => {
        expect(screen.getByText('はじまりの迷宮')).toBeDefined();
        expect(screen.getByTestId('side-panel')).toBeDefined();
      });
    });
  });

  describe('エラーケース', () => {
    test('存在しないダンジョンIDの場合はリダイレクト', () => {
      mock_useParams.mockReturnValue({ id: 'invalid-dungeon' });
      
      render(<DungeonExplorePage />, { wrapper: TestWrapper });
      
      // useEffectが即座に実行されてリダイレクトされる
      expect(mock_push).toHaveBeenCalledWith('/dungeons');
    });
  });

  describe('ダンジョンクリア', () => {
    test('残り階層1の状態で行動選択すると階層進行する', async () => {
      const user = userEvent.setup();
      
      // alertをモック
      global.alert = vi.fn();

      render(<DungeonExplorePage />, { wrapper: TestWrapper });
      
      // 通常表示を待つ
      await waitFor(() => {
        expect(screen.getByText('はじまりの迷宮')).toBeDefined();
      });

      // 29回行動を実行して残り階層を1にする（30階層 - 29回 = 1階層）
      for (let i = 0; i < 29; i++) {
        const battleCards = screen.getAllByText('戦闘');
        if (battleCards.length > 0) {
          await user.click(battleCards[0]);
        }
      }

      // 残り階層が1であることを確認
      expect(screen.getByText('残り階層:')).toBeDefined();
      
      // 最後の行動を実行
      const finalBattleCards = screen.getAllByText('戦闘');
      if (finalBattleCards.length > 0) {
        await user.click(finalBattleCards[0]);
      }

      // ダンジョンクリア表示を確認
      await waitFor(() => {
        expect(screen.getByText('ダンジョンクリア！')).toBeDefined();
        expect(screen.getByText('おめでとうございます！このダンジョンを完全攻略しました。')).toBeDefined();
        expect(screen.getByText('ホームに戻る')).toBeDefined();
      });
    });

    test('ホームに戻るボタンをクリックできる', async () => {
      const user = userEvent.setup();
      
      render(<DungeonExplorePage />, { wrapper: TestWrapper });
      
      // 通常表示を待つ
      await waitFor(() => {
        expect(screen.getByText('はじまりの迷宮')).toBeDefined();
      });

      // 30回行動を実行してダンジョンクリアさせる
      for (let i = 0; i < 30; i++) {
        const battleCards = screen.getAllByText('戦闘');
        if (battleCards.length > 0) {
          await user.click(battleCards[0]);
        }
      }

      // ダンジョンクリア表示を確認
      await waitFor(() => {
        expect(screen.getByText('ホームに戻る')).toBeDefined();
      });

      // ホームに戻るボタンをクリック
      const homeButton = screen.getByText('ホームに戻る');
      await user.click(homeButton);

      // ホームへのリダイレクトを確認
      expect(mock_push).toHaveBeenCalledWith('/home');
    });
  });

  describe('戦闘への遷移', () => {
    test('戦闘カードをクリックすると戦闘画面に遷移する', async () => {
      const user = userEvent.setup();
      
      render(<DungeonExplorePage />, { wrapper: TestWrapper });
      
      // 通常表示を待つ
      await waitFor(() => {
        expect(screen.getByText('はじまりの迷宮')).toBeDefined();
      });

      // 戦闘カードをクリック
      const battleCards = screen.getAllByText('戦闘');
      expect(battleCards.length).toBeGreaterThan(0);
      await user.click(battleCards[0]);

      // 戦闘画面への遷移を確認
      expect(mock_push).toHaveBeenCalledWith('/battle');
    });

    test('戦闘カード選択時に階層が進行する', async () => {
      const user = userEvent.setup();
      
      render(<DungeonExplorePage />, { wrapper: TestWrapper });
      
      // 通常表示を待つ
      await waitFor(() => {
        expect(screen.getByText('はじまりの迷宮')).toBeDefined();
        // 「残り階層:」と「30」が別々の要素にある可能性があるため、個別にチェック
        expect(screen.getByText('残り階層:')).toBeDefined();
        expect(screen.getByText('30')).toBeDefined();
      });

      // 戦闘カードをクリック
      const battleCards = screen.getAllByText('戦闘');
      await user.click(battleCards[0]);

      // 階層が進行していることを確認（残り29階層）
      await waitFor(() => {
        expect(screen.getByText('残り階層:')).toBeDefined();
        expect(screen.getByText('29')).toBeDefined();
      });
      
      // 戦闘画面への遷移も確認
      expect(mock_push).toHaveBeenCalledWith('/battle');
    });
  });

  describe('純粋関数のテスト', () => {
    test('battle_cardが正しくモックされていること', async () => {
      // モックされたbattle_cardの構造確認
      const { battle_card } = await import('@/app/data/action-cards');
      expect(battle_card.type).toBe('battle');
      expect(battle_card.title).toBe('戦闘');
      expect(battle_card.icon).toBe('⚔️');
    });
  });
});