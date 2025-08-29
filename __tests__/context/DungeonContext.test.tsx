import { expect, test, describe } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ReactNode } from 'react';
import { DungeonProvider, useDungeon } from '@/app/context/DungeonContext';

function wrapper({ children }: { children: ReactNode }) {
  return <DungeonProvider>{children}</DungeonProvider>;
}

describe('DungeonContext', () => {
  describe('初期状態', () => {
    test('ダンジョン状態が未設定であること', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      expect(result.current.state.current_dungeon).toBeUndefined();
      expect(result.current.state.dungeon_progress).toBeUndefined();
    });
  });

  describe('start_dungeon', () => {
    test('ダンジョンを開始できること', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('test_dungeon', 10);
      });
      
      expect(result.current.state.current_dungeon).toBe('test_dungeon');
      expect(result.current.state.dungeon_progress).toEqual({
        dungeon_id: 'test_dungeon',
        current_floor: 1,
        remaining_floors: 10,
        total_floors: 10
      });
    });

    test('異なるダンジョンを開始すると前のダンジョン情報が上書きされること', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('dungeon_1', 5);
      });
      
      act(() => {
        result.current.start_dungeon('dungeon_2', 15);
      });
      
      expect(result.current.state.current_dungeon).toBe('dungeon_2');
      expect(result.current.state.dungeon_progress).toEqual({
        dungeon_id: 'dungeon_2',
        current_floor: 1,
        remaining_floors: 15,
        total_floors: 15
      });
    });

    test('0階層のダンジョンも開始できること', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('empty_dungeon', 0);
      });
      
      expect(result.current.state.current_dungeon).toBe('empty_dungeon');
      expect(result.current.state.dungeon_progress).toEqual({
        dungeon_id: 'empty_dungeon',
        current_floor: 1,
        remaining_floors: 0,
        total_floors: 0
      });
    });
  });

  describe('progress_floor', () => {
    test('フロアを進行できること', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('test_dungeon', 10);
        result.current.progress_floor();
      });
      
      expect(result.current.state.dungeon_progress?.current_floor).toBe(2);
      expect(result.current.state.dungeon_progress?.remaining_floors).toBe(9);
      expect(result.current.state.dungeon_progress?.total_floors).toBe(10);
    });

    test('複数回フロア進行できること', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('test_dungeon', 10);
        result.current.progress_floor();
        result.current.progress_floor();
        result.current.progress_floor();
      });
      
      expect(result.current.state.dungeon_progress?.current_floor).toBe(4);
      expect(result.current.state.dungeon_progress?.remaining_floors).toBe(7);
    });

    test('残り階層が0になっても現在階層は進行すること', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('test_dungeon', 2);
        result.current.progress_floor();
        result.current.progress_floor();
      });
      
      expect(result.current.state.dungeon_progress?.current_floor).toBe(3);
      expect(result.current.state.dungeon_progress?.remaining_floors).toBe(0);
    });

    test('残り階層は0未満にならないこと', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('test_dungeon', 1);
        result.current.progress_floor();
        result.current.progress_floor();
        result.current.progress_floor();
      });
      
      expect(result.current.state.dungeon_progress?.current_floor).toBe(4);
      expect(result.current.state.dungeon_progress?.remaining_floors).toBe(0);
    });

    test('ダンジョン未開始時のフロア進行は何も起こらないこと', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.progress_floor();
      });
      
      expect(result.current.state.dungeon_progress).toBeUndefined();
    });

    test('ダンジョンリセット後のフロア進行は何も起こらないこと', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('test_dungeon', 10);
        result.current.reset_dungeon();
        result.current.progress_floor();
      });
      
      expect(result.current.state.dungeon_progress).toBeUndefined();
    });
  });

  describe('reset_dungeon', () => {
    test('ダンジョンをリセットできること', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('test_dungeon', 10);
        result.current.progress_floor();
        result.current.reset_dungeon();
      });
      
      expect(result.current.state.current_dungeon).toBeUndefined();
      expect(result.current.state.dungeon_progress).toBeUndefined();
    });

    test('未開始状態でリセットしても問題ないこと', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.reset_dungeon();
      });
      
      expect(result.current.state.current_dungeon).toBeUndefined();
      expect(result.current.state.dungeon_progress).toBeUndefined();
    });

    test('リセット後に新しいダンジョンを開始できること', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('first_dungeon', 5);
        result.current.progress_floor();
        result.current.reset_dungeon();
        result.current.start_dungeon('second_dungeon', 8);
      });
      
      expect(result.current.state.current_dungeon).toBe('second_dungeon');
      expect(result.current.state.dungeon_progress).toEqual({
        dungeon_id: 'second_dungeon',
        current_floor: 1,
        remaining_floors: 8,
        total_floors: 8
      });
    });
  });

  describe('状態の一貫性', () => {
    test('current_dungeonとdungeon_progress.dungeon_idが一致すること', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('consistency_test', 20);
      });
      
      expect(result.current.state.current_dungeon).toBe(result.current.state.dungeon_progress?.dungeon_id);
    });

    test('フロア進行後もdungeon_idが変わらないこと', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('stable_dungeon', 10);
        result.current.progress_floor();
        result.current.progress_floor();
      });
      
      expect(result.current.state.current_dungeon).toBe('stable_dungeon');
      expect(result.current.state.dungeon_progress?.dungeon_id).toBe('stable_dungeon');
    });

    test('current_floor + remaining_floors - 1 = total_floors が常に成り立つこと', () => {
      const { result } = renderHook(() => useDungeon(), { wrapper });
      
      act(() => {
        result.current.start_dungeon('math_test', 15);
      });
      
      const progress = result.current.state.dungeon_progress!;
      expect(progress.current_floor + progress.remaining_floors - 1).toBe(progress.total_floors);
      
      act(() => {
        result.current.progress_floor();
        result.current.progress_floor();
      });
      
      const progress2 = result.current.state.dungeon_progress!;
      expect(progress2.current_floor + progress2.remaining_floors - 1).toBe(progress2.total_floors);
    });
  });
});