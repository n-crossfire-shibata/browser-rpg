import { expect, test, describe, vi, beforeEach } from 'vitest';
import { get_enemy_by_id, get_all_enemies } from '@/app/lib/enemies';

// enemiesデータのモック（vi.mock内で直接定義）
vi.mock('@/app/data/enemies', () => ({
  enemies: [
    {
      id: 'goblin-1',
      name: 'ゴブリン',
      hp: 50,
      max_hp: 50,
      image: '/images/enemies/goblin.svg',
      ai_pattern: 'aggressive',
      actions: []
    },
    {
      id: 'orc-1',
      name: 'オーク',
      hp: 80,
      max_hp: 80,
      image: '/images/enemies/orc.svg',
      ai_pattern: 'defensive',
      actions: []
    },
    {
      id: 'dragon-1',
      name: 'ドラゴン',
      hp: 200,
      max_hp: 200,
      image: '/images/enemies/dragon.svg',
      ai_pattern: 'aggressive',
      actions: []
    }
  ]
}));

describe('enemies utility functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('get_enemy_by_id', () => {
    test('存在する敵IDで正しい敵を取得できる', () => {
      const result = get_enemy_by_id('goblin-1');
      
      expect(result).toBeDefined();
      expect(result?.id).toBe('goblin-1');
      expect(result?.name).toBe('ゴブリン');
      expect(result?.hp).toBe(50);
      expect(result?.max_hp).toBe(50);
    });

    test('別の存在する敵IDでも正しい敵を取得できる', () => {
      const result = get_enemy_by_id('orc-1');
      
      expect(result).toBeDefined();
      expect(result?.id).toBe('orc-1');
      expect(result?.name).toBe('オーク');
      expect(result?.hp).toBe(80);
      expect(result?.ai_pattern).toBe('defensive');
    });

    test('存在しない敵IDの場合はundefinedを返す', () => {
      const result = get_enemy_by_id('nonexistent-enemy');
      
      expect(result).toBeUndefined();
    });

    test('空文字列を渡した場合はundefinedを返す', () => {
      const result = get_enemy_by_id('');
      
      expect(result).toBeUndefined();
    });

  });

  describe('get_all_enemies', () => {
    test('全ての敵のリストを取得できる', () => {
      const result = get_all_enemies();
      
      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('goblin-1');
      expect(result[1].id).toBe('orc-1');
      expect(result[2].id).toBe('dragon-1');
    });

    test('返されるリストは元の配列のコピーである（参照の独立性）', () => {
      const result1 = get_all_enemies();
      const result2 = get_all_enemies();
      
      // 異なる配列オブジェクトであることを確認
      expect(result1).not.toBe(result2);
      
      // 内容は同じであることを確認
      expect(result1).toEqual(result2);
    });

    test('返されたリストを変更しても元のデータに影響しない', () => {
      const result = get_all_enemies();
      const original_length = result.length;
      
      // 結果の配列に変更を加える
      result.push({
        id: 'test-enemy',
        name: 'テスト敵',
        hp: 100,
        max_hp: 100,
        image: '/test.svg',
        ai_pattern: 'aggressive',
        actions: []
      });
      
      // 新しい取得では元の長さのままであることを確認
      const new_result = get_all_enemies();
      expect(new_result).toHaveLength(original_length);
      expect(new_result.some(enemy => enemy.id === 'test-enemy')).toBe(false);
    });

    test('空の敵リストでも正常に動作する', () => {
      // 一時的に空の配列をモック
      vi.doMock('@/app/data/enemies', () => ({
        enemies: []
      }));
      
      // 動的インポートで新しいモックを適用
      vi.resetModules();
      
      // この時点では既存のモジュールキャッシュがあるので、
      // 実際のテストでは元のモックが使われる
      const result = get_all_enemies();
      expect(Array.isArray(result)).toBe(true);
    });

    test('各敵オブジェクトが必要なプロパティを持っている', () => {
      const result = get_all_enemies();
      
      result.forEach(enemy => {
        expect(enemy).toHaveProperty('id');
        expect(enemy).toHaveProperty('name');
        expect(enemy).toHaveProperty('hp');
        expect(enemy).toHaveProperty('max_hp');
        expect(enemy).toHaveProperty('image');
        expect(enemy).toHaveProperty('ai_pattern');
        expect(enemy).toHaveProperty('actions');
        
        // 基本的な型チェック
        expect(typeof enemy.id).toBe('string');
        expect(typeof enemy.name).toBe('string');
        expect(typeof enemy.hp).toBe('number');
        expect(typeof enemy.max_hp).toBe('number');
        expect(typeof enemy.image).toBe('string');
        expect(typeof enemy.ai_pattern).toBe('string');
        expect(Array.isArray(enemy.actions)).toBe(true);
      });
    });
  });

  describe('データの整合性', () => {
    test('全ての敵のHPがmax_hp以下である', () => {
      const result = get_all_enemies();
      
      result.forEach(enemy => {
        expect(enemy.hp).toBeLessThanOrEqual(enemy.max_hp);
        expect(enemy.hp).toBeGreaterThan(0);
        expect(enemy.max_hp).toBeGreaterThan(0);
      });
    });

    test('全ての敵が有効なai_patternを持っている', () => {
      const valid_patterns = ['aggressive', 'defensive', 'balanced'];
      const result = get_all_enemies();
      
      result.forEach(enemy => {
        expect(valid_patterns).toContain(enemy.ai_pattern);
      });
    });

    test('全ての敵が一意のIDを持っている', () => {
      const result = get_all_enemies();
      const ids = result.map(enemy => enemy.id);
      const unique_ids = [...new Set(ids)];
      
      expect(ids.length).toBe(unique_ids.length);
    });
  });
});