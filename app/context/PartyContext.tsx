'use client';

import { createContext, useContext, useReducer, ReactNode } from 'react';
import { Character, Party } from '@/app/types/game';
import { ExhaustiveError } from '@/app/lib/errors';

interface PartyContextType {
  party: Party;
  add_party_member: (character: Character) => void;
  remove_party_member: (character_id: string) => void;
  set_party_member: (index: number, character: Character | null) => void;
  swap_party_members: (from_index: number, to_index: number) => void;
  is_party_full: () => boolean;
  get_party_size: () => number;
  update_character_hp: (character_id: string, new_hp: number) => void;
  heal_character: (character_id: string, heal_amount: number) => void;
  damage_character: (character_id: string, damage: number) => void;
  get_character_is_alive: (character_id: string) => boolean;
}

const PartyContext = createContext<PartyContextType | undefined>(undefined);

type PartyAction =
  | { type: 'ADD_PARTY_MEMBER'; payload: Character }
  | { type: 'REMOVE_PARTY_MEMBER'; payload: string }
  | { type: 'SET_PARTY_MEMBER'; payload: { index: number; character: Character | null } }
  | { type: 'SWAP_PARTY_MEMBERS'; payload: { from_index: number; to_index: number } }
  | { type: 'UPDATE_CHARACTER_HP'; payload: { character_id: string; hp: number } }
  | { type: 'HEAL_CHARACTER'; payload: { character_id: string; heal: number } }
  | { type: 'DAMAGE_CHARACTER'; payload: { character_id: string; damage: number } };

function party_reducer(state: Party, action: PartyAction): Party {
  switch (action.type) {
    case 'ADD_PARTY_MEMBER':
      if (state.members.length >= 3) {
        return state;
      }
      return {
        ...state,
        members: [...state.members, action.payload]
      };
    case 'REMOVE_PARTY_MEMBER':
      return {
        ...state,
        members: state.members.filter(member => member.id !== action.payload)
      };
    case 'SET_PARTY_MEMBER':
      const new_members = [...state.members];
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
        members: new_members.slice(0, 3) // Ensure max 3 members
      };
    case 'SWAP_PARTY_MEMBERS':
      const members_copy = [...state.members];
      const { from_index, to_index } = action.payload;
      if (from_index < members_copy.length && to_index < members_copy.length) {
        const temp = members_copy[from_index];
        members_copy[from_index] = members_copy[to_index];
        members_copy[to_index] = temp;
        return {
          ...state,
          members: members_copy
        };
      }
      return state;
    case 'UPDATE_CHARACTER_HP':
      return {
        ...state,
        members: state.members.map(member =>
          member.id === action.payload.character_id
            ? { ...member, hp: Math.max(0, Math.min(action.payload.hp, member.max_hp)) }
            : member
        )
      };
    case 'HEAL_CHARACTER':
      return {
        ...state,
        members: state.members.map(member =>
          member.id === action.payload.character_id
            ? { ...member, hp: Math.min(member.hp + action.payload.heal, member.max_hp) }
            : member
        )
      };
    case 'DAMAGE_CHARACTER':
      return {
        ...state,
        members: state.members.map(member =>
          member.id === action.payload.character_id
            ? { ...member, hp: Math.max(0, member.hp - action.payload.damage) }
            : member
        )
      };
    /* c8 ignore next 2 */
    default:
      throw new ExhaustiveError(action);
  }
}

const initial_party: Party = {
  members: []
};

export function PartyProvider({ children }: { children: ReactNode }) {
  const [party, dispatch] = useReducer(party_reducer, initial_party);

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

  const is_party_full = () => party.members.length === 3;

  const get_party_size = () => party.members.length;

  const update_character_hp = (character_id: string, new_hp: number) => {
    dispatch({ type: 'UPDATE_CHARACTER_HP', payload: { character_id, hp: new_hp } });
  };

  const heal_character = (character_id: string, heal_amount: number) => {
    dispatch({ type: 'HEAL_CHARACTER', payload: { character_id, heal: heal_amount } });
  };

  const damage_character = (character_id: string, damage: number) => {
    dispatch({ type: 'DAMAGE_CHARACTER', payload: { character_id, damage } });
  };

  const get_character_is_alive = (character_id: string): boolean => {
    const character = party.members.find(member => member.id === character_id);
    return character ? character.hp > 0 : false;
  };

  return (
    <PartyContext.Provider
      value={{
        party,
        add_party_member,
        remove_party_member,
        set_party_member,
        swap_party_members,
        is_party_full,
        get_party_size,
        update_character_hp,
        heal_character,
        damage_character,
        get_character_is_alive
      }}
    >
      {children}
    </PartyContext.Provider>
  );
}

export function useParty() {
  const context = useContext(PartyContext);
  /* c8 ignore next 3 */
  if (context === undefined) {
    throw new Error('useParty must be used within a PartyProvider');
  }
  return context;
}