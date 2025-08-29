import { expect, test, describe } from 'vitest';
import { ExhaustiveError } from '@/app/lib/errors';

describe('ExhaustiveError', () => {
  describe('実際のユースケースシミュレーション', () => {
    test('switch文のdefaultケースでの使用をシミュレート', () => {
      type ValidAction = 'ADD' | 'REMOVE';
      
      function handleAction(action: ValidAction) {
        switch (action) {
          case 'ADD':
            return 'added';
          case 'REMOVE':
            return 'removed';
          default:
            throw new ExhaustiveError(action);
        }
      }
      
      // 正常なケース
      expect(handleAction('ADD')).toBe('added');
      expect(handleAction('REMOVE')).toBe('removed');
      
      // 不正な値（実際のコードでは起こらないが、テスト用）
      expect(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handleAction('INVALID' as any);
      }).toThrow('Unsupported action type: "INVALID"');
    });
  });
});