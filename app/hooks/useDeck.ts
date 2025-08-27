'use client';

import { useMemo } from 'react';
import { Card } from '@/app/types/card';
import { Character } from '@/app/types/game';

export function useDeck(party_members: Character[]) {
  const current_deck = useMemo(() => {
    const all_cards: Card[] = [];
    
    party_members.forEach(character => {
      all_cards.push(...character.cards);
    });
    
    return all_cards;
  }, [party_members]);

  const get_cards_by_character = (character_id: string) => {
    const character = party_members.find(char => char.id === character_id);
    return character?.cards || [];
  };

  const get_cards_by_type = (type: Card['type']) => {
    return current_deck.filter(card => card.type === type);
  };

  const get_cards_by_rarity = (rarity: Card['rarity']) => {
    return current_deck.filter(card => card.rarity === rarity);
  };

  const get_unique_cards = () => {
    const unique_cards_map = new Map<string, Card>();
    current_deck.forEach(card => {
      unique_cards_map.set(card.id, card);
    });
    return Array.from(unique_cards_map.values());
  };

  const get_card_count = (card_id: string) => {
    return current_deck.filter(card => card.id === card_id).length;
  };

  const total_cards = current_deck.length;

  const deck_stats = {
    attack_cards: get_cards_by_type('attack').length,
    skill_cards: get_cards_by_type('skill').length,
    power_cards: get_cards_by_type('power').length,
    common_cards: get_cards_by_rarity('common').length,
    uncommon_cards: get_cards_by_rarity('uncommon').length,
    rare_cards: get_cards_by_rarity('rare').length,
    legendary_cards: get_cards_by_rarity('legendary').length,
  };

  return {
    current_deck,
    get_cards_by_character,
    get_cards_by_type,
    get_cards_by_rarity,
    get_unique_cards,
    get_card_count,
    total_cards,
    deck_stats,
  };
}