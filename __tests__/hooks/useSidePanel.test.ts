import { expect, test, describe } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSidePanel } from '@/app/hooks/useSidePanel';

describe('useSidePanel', () => {
  test('初期状態が正しく設定されること', () => {
    const { result } = renderHook(() => useSidePanel());
    
    expect(result.current.is_open).toBe(false);
    expect(result.current.active_tab).toBe('party');
  });

  describe('パネル開閉操作', () => {
    test('toggle_panelが正しく動作すること', () => {
      const { result } = renderHook(() => useSidePanel());
      
      // 初期状態：閉じている
      expect(result.current.is_open).toBe(false);
      
      // トグルで開く
      act(() => {
        result.current.toggle_panel();
      });
      expect(result.current.is_open).toBe(true);
      
      // トグルで閉じる
      act(() => {
        result.current.toggle_panel();
      });
      expect(result.current.is_open).toBe(false);
    });

    test('open_panelが正しく動作すること', () => {
      const { result } = renderHook(() => useSidePanel());
      
      expect(result.current.is_open).toBe(false);
      
      act(() => {
        result.current.open_panel();
      });
      
      expect(result.current.is_open).toBe(true);
      
      // 既に開いている状態でopen_panelを呼んでも開いたまま
      act(() => {
        result.current.open_panel();
      });
      
      expect(result.current.is_open).toBe(true);
    });

    test('close_panelが正しく動作すること', () => {
      const { result } = renderHook(() => useSidePanel());
      
      // まずパネルを開く
      act(() => {
        result.current.open_panel();
      });
      expect(result.current.is_open).toBe(true);
      
      // パネルを閉じる
      act(() => {
        result.current.close_panel();
      });
      expect(result.current.is_open).toBe(false);
      
      // 既に閉じている状態でclose_panelを呼んでも閉じたまま
      act(() => {
        result.current.close_panel();
      });
      expect(result.current.is_open).toBe(false);
    });
  });

  describe('タブ切り替え操作', () => {
    test('switch_tabが正しく動作すること', () => {
      const { result } = renderHook(() => useSidePanel());
      
      expect(result.current.active_tab).toBe('party');
      expect(result.current.is_open).toBe(false);
      
      // inventoryタブに切り替え
      act(() => {
        result.current.switch_tab('inventory');
      });
      
      expect(result.current.active_tab).toBe('inventory');
      expect(result.current.is_open).toBe(true); // タブ切り替え時に自動で開く
    });

    test('settingsタブに切り替えできること', () => {
      const { result } = renderHook(() => useSidePanel());
      
      act(() => {
        result.current.switch_tab('settings');
      });
      
      expect(result.current.active_tab).toBe('settings');
      expect(result.current.is_open).toBe(true);
    });

    test('partyタブに戻せること', () => {
      const { result } = renderHook(() => useSidePanel());
      
      // 別のタブに切り替え
      act(() => {
        result.current.switch_tab('inventory');
      });
      expect(result.current.active_tab).toBe('inventory');
      
      // partyタブに戻す
      act(() => {
        result.current.switch_tab('party');
      });
      expect(result.current.active_tab).toBe('party');
    });

    test('パネルが閉じている状態でタブを切り替えるとパネルが開くこと', () => {
      const { result } = renderHook(() => useSidePanel());
      
      // パネルが閉じていることを確認
      expect(result.current.is_open).toBe(false);
      
      // タブを切り替える
      act(() => {
        result.current.switch_tab('settings');
      });
      
      // パネルが自動で開いていることを確認
      expect(result.current.is_open).toBe(true);
      expect(result.current.active_tab).toBe('settings');
    });

    test('パネルが開いている状態でタブを切り替えても開いたままであること', () => {
      const { result } = renderHook(() => useSidePanel());
      
      // パネルを開く
      act(() => {
        result.current.open_panel();
      });
      expect(result.current.is_open).toBe(true);
      
      // タブを切り替える
      act(() => {
        result.current.switch_tab('inventory');
      });
      
      // パネルが開いたままであることを確認
      expect(result.current.is_open).toBe(true);
      expect(result.current.active_tab).toBe('inventory');
    });
  });

  describe('複合操作', () => {
    test('タブ切り替え後にパネルを閉じることができること', () => {
      const { result } = renderHook(() => useSidePanel());
      
      // タブを切り替える（自動でパネルが開く）
      act(() => {
        result.current.switch_tab('inventory');
      });
      expect(result.current.is_open).toBe(true);
      expect(result.current.active_tab).toBe('inventory');
      
      // パネルを閉じる
      act(() => {
        result.current.close_panel();
      });
      expect(result.current.is_open).toBe(false);
      expect(result.current.active_tab).toBe('inventory'); // タブは変わらない
    });

    test('パネル閉じた後に再度開いてもタブが保持されること', () => {
      const { result } = renderHook(() => useSidePanel());
      
      // タブを切り替える
      act(() => {
        result.current.switch_tab('settings');
      });
      expect(result.current.active_tab).toBe('settings');
      
      // パネルを閉じる
      act(() => {
        result.current.close_panel();
      });
      
      // パネルを再度開く
      act(() => {
        result.current.open_panel();
      });
      
      // タブが保持されていることを確認
      expect(result.current.active_tab).toBe('settings');
      expect(result.current.is_open).toBe(true);
    });
  });
});