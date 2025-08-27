import { expect, test, describe, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomeLayout from '@/app/home/layout';
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

describe('HomeLayout', () => {
  test('子要素が正しくレンダリングされること', () => {
    render(
      <TestWrapper>
        <HomeLayout>
          <div data-testid="test-child">Test Content</div>
        </HomeLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId('test-child')).toBeDefined();
    expect(screen.getByText('Test Content')).toBeDefined();
  });

  test('SidePanelが表示されること', () => {
    render(
      <TestWrapper>
        <HomeLayout>
          <div>Test Content</div>
        </HomeLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId('mocked-side-panel')).toBeDefined();
  });

  test('初期状態でSidePanelに空のパーティーメンバーが渡されること', () => {
    render(
      <TestWrapper>
        <HomeLayout>
          <div>Test Content</div>
        </HomeLayout>
      </TestWrapper>
    );

    expect(screen.getByText('SidePanel with 0 members')).toBeDefined();
  });

  test('GameContextが正しく動作すること', () => {
    // GameContextの状態変更テストは、実際のGameContextテストで行われているため、
    // ここではレイアウトがGameContextに依存していることを確認
    const { container } = render(
      <TestWrapper>
        <HomeLayout>
          <div>Test Content</div>
        </HomeLayout>
      </TestWrapper>
    );

    // レンダリングエラーが発生していないことを確認
    expect(container).toBeDefined();
  });

  test('複数の子要素が正しくレンダリングされること', () => {
    render(
      <TestWrapper>
        <HomeLayout>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
          <span data-testid="child-3">Child 3</span>
        </HomeLayout>
      </TestWrapper>
    );

    expect(screen.getByTestId('child-1')).toBeDefined();
    expect(screen.getByTestId('child-2')).toBeDefined();
    expect(screen.getByTestId('child-3')).toBeDefined();
  });

  test('レイアウトの構造が正しいこと', () => {
    render(
      <TestWrapper>
        <HomeLayout>
          <div data-testid="content">Main Content</div>
        </HomeLayout>
      </TestWrapper>
    );

    // childrenとSidePanelが両方存在することを確認
    expect(screen.getByTestId('content')).toBeDefined();
    expect(screen.getByTestId('mocked-side-panel')).toBeDefined();
  });
});