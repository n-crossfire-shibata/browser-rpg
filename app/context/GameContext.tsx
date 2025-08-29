'use client';

import { createContext, useContext, ReactNode } from 'react';
import { GameState } from '@/app/types/game';
import { PartyProvider, useParty } from './PartyContext';
import { DungeonProvider, useDungeon } from './DungeonContext';

interface GameContextType {
  state: GameState;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  return (
    <PartyProvider>
      <DungeonProvider>
        <GameProviderInternal>
          {children}
        </GameProviderInternal>
      </DungeonProvider>
    </PartyProvider>
  );
}

function GameProviderInternal({ children }: { children: ReactNode }) {
  const { party } = useParty();
  const { state: dungeonState } = useDungeon();

  const state: GameState = {
    party,
    current_dungeon: dungeonState.current_dungeon,
    dungeon_progress: dungeonState.dungeon_progress
  };

  return (
    <GameContext.Provider value={{ state }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  /* c8 ignore next 3 */
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}