import { expect, test, describe } from 'vitest';
import { Dungeon } from '@/app/types/dungeon';

describe('Dungeon型', () => {
  describe('型定義の検証', () => {
    test('正しいプロパティを持つオブジェクトがDungeon型として扱えること', () => {
      const valid_dungeon: Dungeon = {
        id: 'test-dungeon',
        name: 'テストダンジョン',
        description: 'テスト用のダンジョンです',
        difficulty: '中級'
      };

      expect(valid_dungeon.id).toBe('test-dungeon');
      expect(valid_dungeon.name).toBe('テストダンジョン');
      expect(valid_dungeon.description).toBe('テスト用のダンジョンです');
      expect(valid_dungeon.difficulty).toBe('中級');
    });

    test('はじまりの迷宮のデータ構造が正しいこと', () => {
      const hajimari_dungeon: Dungeon = {
        id: 'hajimari-no-meikyuu',
        name: 'はじまりの迷宮',
        description: '冒険者が最初に挑戦するダンジョン。比較的安全で、基本的な戦闘を学べます。',
        difficulty: '初級'
      };

      expect(hajimari_dungeon.id).toBe('hajimari-no-meikyuu');
      expect(hajimari_dungeon.name).toBe('はじまりの迷宮');
      expect(hajimari_dungeon.description).toContain('冒険者が最初に挑戦する');
      expect(hajimari_dungeon.difficulty).toBe('初級');
    });

    test('必須プロパティがすべて定義されていること', () => {
      const dungeon: Dungeon = {
        id: 'required-test',
        name: '必須テスト',
        description: '必須プロパティのテスト',
        difficulty: '上級'
      };

      expect(typeof dungeon.id).toBe('string');
      expect(typeof dungeon.name).toBe('string');
      expect(typeof dungeon.description).toBe('string');
      expect(typeof dungeon.difficulty).toBe('string');
      
      expect(dungeon.id.length).toBeGreaterThan(0);
      expect(dungeon.name.length).toBeGreaterThan(0);
      expect(dungeon.description.length).toBeGreaterThan(0);
      expect(dungeon.difficulty.length).toBeGreaterThan(0);
    });

    test('難易度の値が期待される値であること', () => {
      const difficulties = ['初級', '中級', '上級', '超級'];
      
      difficulties.forEach(difficulty => {
        const dungeon: Dungeon = {
          id: `test-${difficulty}`,
          name: `${difficulty}テスト`,
          description: `${difficulty}のテストダンジョン`,
          difficulty: difficulty
        };
        
        expect(dungeon.difficulty).toBe(difficulty);
        expect(typeof dungeon.difficulty).toBe('string');
      });
    });
  });
});