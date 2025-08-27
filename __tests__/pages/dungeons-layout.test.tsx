import { expect, test, describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import DungeonsLayout from '@/app/dungeons/layout';
import { GameProvider } from '@/app/context/GameContext';

// SidePanelコンポーネントをモック
vi.mock('@/app/components/SidePanel', () => ({
  default: vi.fn(({ party_members }) => (
    <div data-testid="mocked-side-panel">
      SidePanel with {party_members.length} members
    </div>
  ))
}));

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <GameProvider>{children}</GameProvider>
);

describe('DungeonsLayout', () => {
  test('子要素が正しくレンダリングされること', () => {
    render(
      <TestWrapper>
        <DungeonsLayout>
          <div data-testid="test-child">Dungeons Content</div>
        </DungeonsLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId('test-child')).toBeDefined();
    expect(screen.getByText('Dungeons Content')).toBeDefined();
  });

  test('SidePanelが表示されること', () => {
    render(
      <TestWrapper>
        <DungeonsLayout>
          <div>Dungeons Content</div>
        </DungeonsLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId('mocked-side-panel')).toBeDefined();
  });

  test('初期状態でSidePanelに空のパーティーメンバーが渡されること', () => {
    render(
      <TestWrapper>
        <DungeonsLayout>
          <div>Dungeons Content</div>
        </DungeonsLayout>
      </TestWrapper>
    );

    expect(screen.getByText('SidePanel with 0 members')).toBeDefined();
  });

  test('GameContextが正しく動作すること', () => {
    const { container } = render(
      <TestWrapper>
        <DungeonsLayout>
          <div>Dungeons Content</div>
        </DungeonsLayout>
      </TestWrapper>
    );

    // レンダリングエラーが発生していないことを確認
    expect(container).toBeDefined();
  });

  test('複数の子要素が正しくレンダリングされること', () => {
    render(
      <TestWrapper>
        <DungeonsLayout>
          <div data-testid="child-1">Dungeons Child 1</div>
          <div data-testid="child-2">Dungeons Child 2</div>
        </DungeonsLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId('child-1')).toBeDefined();
    expect(screen.getByTestId('child-2')).toBeDefined();
  });

  test('レイアウトの構造が正しいこと', () => {
    render(
      <TestWrapper>
        <DungeonsLayout>
          <div data-testid="content">Dungeons Main Content</div>
        </DungeonsLayout>
      </TestWrapper>
    );

    // childrenとSidePanelが両方存在することを確認
    expect(screen.getByTestId('content')).toBeDefined();
    expect(screen.getByTestId('mocked-side-panel')).toBeDefined();
  });
});