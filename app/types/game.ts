export interface Character {
  id: string;
  name: string;
  hp: number;
  max_hp: number;
  job: string;
  image: string;
  flavor: string;
}

export interface Party {
  members: Character[];
}

export interface GameState {
  party: Party;
  current_dungeon?: string;
}