import { Enemy } from '@/app/types/enemy';
import { enemies } from '@/app/data/enemies';

export const get_enemy_by_id = (id: string): Enemy | undefined => {
  return enemies.find(enemy => enemy.id === id);
};

export const get_all_enemies = (): Enemy[] => {
  return [...enemies];
};