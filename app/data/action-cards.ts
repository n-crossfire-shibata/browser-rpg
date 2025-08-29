import { ActionCard } from '@/app/types/action-card';

// 基本的な行動カード定義（現在は戦闘のみ）
export const battle_card: ActionCard = {
  id: 'battle',
  type: 'battle',
  title: '戦闘',
  description: '敵との戦闘が発生します。どんな敵が現れるかは分からない...',
  icon: '⚔️'
};

// 将来追加予定の他のイベントカード
export const treasure_cards: ActionCard[] = [
  // TODO: 宝箱系イベント
];

export const rest_cards: ActionCard[] = [
  // TODO: 休憩系イベント
];

export const event_cards: ActionCard[] = [
  // TODO: 特殊イベント
];
