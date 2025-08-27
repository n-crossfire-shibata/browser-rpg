import { expect, test, describe } from 'vitest';
import { BASIC_CARDS, CHARACTER_CARD_SETS } from '@/app/data/cards';

describe('Cards Data', () => {
  describe('BASIC_CARDS', () => {
    test('should have all required card properties', () => {
      BASIC_CARDS.forEach((card) => {
        expect(card).toHaveProperty('id');
        expect(card).toHaveProperty('name');
        expect(card).toHaveProperty('description');
        expect(card).toHaveProperty('cost');
        expect(card).toHaveProperty('type');
        expect(card).toHaveProperty('rarity');
        expect(card).toHaveProperty('effects');
        
        expect(typeof card.id).toBe('string');
        expect(typeof card.name).toBe('string');
        expect(typeof card.description).toBe('string');
        expect(typeof card.cost).toBe('number');
        expect(['attack', 'skill', 'power']).toContain(card.type);
        expect(['common', 'uncommon', 'rare', 'legendary']).toContain(card.rarity);
        expect(Array.isArray(card.effects)).toBe(true);
      });
    });

    test('should have unique card IDs', () => {
      const ids = BASIC_CARDS.map(card => card.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('should have valid cost values', () => {
      BASIC_CARDS.forEach(card => {
        expect(card.cost).toBeGreaterThanOrEqual(0);
        expect(card.cost).toBeLessThanOrEqual(10); // Reasonable upper bound
      });
    });

    test('should have valid effects', () => {
      BASIC_CARDS.forEach(card => {
        card.effects.forEach(effect => {
          expect(effect).toHaveProperty('type');
          expect(effect).toHaveProperty('value');
          expect(effect).toHaveProperty('target');
          
          expect(['damage', 'heal', 'block', 'buff', 'debuff', 'draw_card', 'gain_energy']).toContain(effect.type);
          expect(typeof effect.value).toBe('number');
          expect(['self', 'single_enemy', 'all_enemies', 'random_enemy']).toContain(effect.target);
        });
      });
    });

    test('should contain expected basic cards', () => {
      const cardNames = BASIC_CARDS.map(card => card.name);
      expect(cardNames).toContain('ストライク');
      expect(cardNames).toContain('ディフェンド');
      expect(cardNames).toContain('バッシュ');
    });
  });

  describe('CHARACTER_CARD_SETS', () => {
    test('should have card sets for all expected characters', () => {
      const expectedCharacters = ['warrior_001', 'mage_001', 'cleric_001', 'thief_001', 'archer_001'];
      
      expectedCharacters.forEach(characterId => {
        expect(CHARACTER_CARD_SETS).toHaveProperty(characterId);
        expect(Array.isArray(CHARACTER_CARD_SETS[characterId])).toBe(true);
      });
    });

    test('should have exactly 5 cards per character', () => {
      Object.keys(CHARACTER_CARD_SETS).forEach(characterId => {
        expect(CHARACTER_CARD_SETS[characterId]).toHaveLength(5);
      });
    });

    test('should contain valid card references', () => {
      Object.keys(CHARACTER_CARD_SETS).forEach(characterId => {
        CHARACTER_CARD_SETS[characterId].forEach(card => {
          expect(BASIC_CARDS).toContainEqual(card);
        });
      });
    });

    test('should have different card compositions for different characters', () => {
      const characterIds = Object.keys(CHARACTER_CARD_SETS);
      expect(characterIds.length).toBeGreaterThan(1);
      
      // Check that not all characters have identical card sets
      const firstCharacterCards = CHARACTER_CARD_SETS[characterIds[0]];
      let hasVariation = false;
      
      for (let i = 1; i < characterIds.length; i++) {
        const otherCharacterCards = CHARACTER_CARD_SETS[characterIds[i]];
        if (JSON.stringify(firstCharacterCards) !== JSON.stringify(otherCharacterCards)) {
          hasVariation = true;
          break;
        }
      }
      
      expect(hasVariation).toBe(true);
    });

    test('should maintain card object integrity', () => {
      Object.keys(CHARACTER_CARD_SETS).forEach(characterId => {
        CHARACTER_CARD_SETS[characterId].forEach(card => {
          expect(card).toHaveProperty('id');
          expect(card).toHaveProperty('name');
          expect(card).toHaveProperty('description');
          expect(card).toHaveProperty('cost');
          expect(card).toHaveProperty('type');
          expect(card).toHaveProperty('rarity');
          expect(card).toHaveProperty('effects');
        });
      });
    });

    test('should have valid card distributions', () => {
      // Each character should have a reasonable mix of card types
      Object.keys(CHARACTER_CARD_SETS).forEach(characterId => {
        const cards = CHARACTER_CARD_SETS[characterId];
        const cardTypes = cards.map(card => card.type);
        
        // Should have at least one basic attack or defense capability
        const hasBasicCapability = cardTypes.includes('attack') || cardTypes.includes('skill');
        expect(hasBasicCapability).toBe(true);
      });
    });
  });
});