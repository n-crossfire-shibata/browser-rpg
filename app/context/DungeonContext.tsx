'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { DungeonProgress } from '@/app/types/action-card';

class ExhaustiveError extends Error {
  constructor(value: never, message = `Unsupported action type: ${JSON.stringify(value)}`) {
    super(message);
  }
}

interface DungeonState {
  current_dungeon?: string;
  dungeon_progress?: DungeonProgress;
}

interface DungeonContextType {
  state: DungeonState;
  start_dungeon: (dungeon_id: string, total_floors: number) => void;
  progress_floor: () => void;
  reset_dungeon: () => void;
}

const DungeonContext = createContext<DungeonContextType | undefined>(undefined);

type DungeonAction =
  | { type: 'START_DUNGEON'; payload: { dungeon_id: string; total_floors: number } }
  | { type: 'PROGRESS_FLOOR' }
  | { type: 'RESET_DUNGEON' };

function dungeon_reducer(state: DungeonState, action: DungeonAction): DungeonState {
  switch (action.type) {
    case 'START_DUNGEON':
      return {
        ...state,
        current_dungeon: action.payload.dungeon_id,
        dungeon_progress: {
          dungeon_id: action.payload.dungeon_id,
          current_floor: 1,
          remaining_floors: action.payload.total_floors,
          total_floors: action.payload.total_floors
        }
      };
    case 'PROGRESS_FLOOR':
      if (!state.dungeon_progress) return state;
      return {
        ...state,
        dungeon_progress: {
          ...state.dungeon_progress,
          current_floor: state.dungeon_progress.current_floor + 1,
          remaining_floors: Math.max(0, state.dungeon_progress.remaining_floors - 1)
        }
      };
    case 'RESET_DUNGEON':
      return {
        ...state,
        current_dungeon: undefined,
        dungeon_progress: undefined
      };
    /* c8 ignore next 2 */
    default:
      throw new ExhaustiveError(action);
  }
}

const initial_state: DungeonState = {};

export function DungeonProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(dungeon_reducer, initial_state);

  const start_dungeon = (dungeon_id: string, total_floors: number) => {
    dispatch({ type: 'START_DUNGEON', payload: { dungeon_id, total_floors } });
  };

  const progress_floor = () => {
    dispatch({ type: 'PROGRESS_FLOOR' });
  };

  const reset_dungeon = () => {
    dispatch({ type: 'RESET_DUNGEON' });
  };

  return (
    <DungeonContext.Provider
      value={{
        state,
        start_dungeon,
        progress_floor,
        reset_dungeon
      }}
    >
      {children}
    </DungeonContext.Provider>
  );
}

export function useDungeon() {
  const context = useContext(DungeonContext);
  /* c8 ignore next 3 */
  if (context === undefined) {
    throw new Error('useDungeon must be used within a DungeonProvider');
  }
  return context;
}