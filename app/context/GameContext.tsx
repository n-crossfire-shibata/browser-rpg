'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { GameState, Character } from '@/app/types/game';

interface GameContextType {
  state: GameState;
  add_party_member: (character: Character) => void;
  remove_party_member: (character_id: string) => void;
  set_party_member: (index: number, character: Character | null) => void;
  swap_party_members: (from_index: number, to_index: number) => void;
  is_party_full: () => boolean;
  get_party_size: () => number;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

type GameAction =
  | { type: 'ADD_PARTY_MEMBER'; payload: Character }
  | { type: 'REMOVE_PARTY_MEMBER'; payload: string }
  | { type: 'SET_PARTY_MEMBER'; payload: { index: number; character: Character | null } }
  | { type: 'SWAP_PARTY_MEMBERS'; payload: { from_index: number; to_index: number } };

function game_reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'ADD_PARTY_MEMBER':
      if (state.party.members.length >= 3) {
        return state;
      }
      return {
        ...state,
        party: {
          ...state.party,
          members: [...state.party.members, action.payload]
        }
      };
    case 'REMOVE_PARTY_MEMBER':
      return {
        ...state,
        party: {
          ...state.party,
          members: state.party.members.filter(member => member.id !== action.payload)
        }
      };
    case 'SET_PARTY_MEMBER':
      const new_members = [...state.party.members];
      if (action.payload.character === null) {
        // Remove character at index
        if (action.payload.index < new_members.length) {
          new_members.splice(action.payload.index, 1);
        }
      } else {
        // Add/insert character at index
        if (action.payload.index >= new_members.length) {
          // Add to end
          new_members.push(action.payload.character);
        } else {
          // Insert at specific position
          new_members.splice(action.payload.index, 0, action.payload.character);
        }
      }
      return {
        ...state,
        party: {
          ...state.party,
          members: new_members.slice(0, 3) // Ensure max 3 members
        }
      };
    case 'SWAP_PARTY_MEMBERS':
      const members_copy = [...state.party.members];
      const { from_index, to_index } = action.payload;
      if (from_index < members_copy.length && to_index < members_copy.length) {
        const temp = members_copy[from_index];
        members_copy[from_index] = members_copy[to_index];
        members_copy[to_index] = temp;
        return {
          ...state,
          party: {
            ...state.party,
            members: members_copy
          }
        };
      }
      return state;
    /* c8 ignore next 2 */
    default:
      return state;
  }
}

const initial_state: GameState = {
  party: {
    members: []
  }
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(game_reducer, initial_state);

  const add_party_member = (character: Character) => {
    dispatch({ type: 'ADD_PARTY_MEMBER', payload: character });
  };

  const remove_party_member = (character_id: string) => {
    dispatch({ type: 'REMOVE_PARTY_MEMBER', payload: character_id });
  };

  const set_party_member = (index: number, character: Character | null) => {
    dispatch({ type: 'SET_PARTY_MEMBER', payload: { index, character } });
  };

  const swap_party_members = (from_index: number, to_index: number) => {
    dispatch({ type: 'SWAP_PARTY_MEMBERS', payload: { from_index, to_index } });
  };

  const is_party_full = () => state.party.members.length === 3;

  const get_party_size = () => state.party.members.length;

  return (
    <GameContext.Provider
      value={{
        state,
        add_party_member,
        remove_party_member,
        set_party_member,
        swap_party_members,
        is_party_full,
        get_party_size
      }}
    >
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