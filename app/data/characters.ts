import { Character } from '@/app/types/game';
import { CHARACTER_CARD_SETS } from './cards';
import warriorImg from '@/public/images/characters/warrior.svg';
import mageImg from '@/public/images/characters/mage.svg';
import clericImg from '@/public/images/characters/cleric.svg';
import thiefImg from '@/public/images/characters/thief.svg';
import archerImg from '@/public/images/characters/archer.svg';

export const available_characters: Character[] = [
  {
    id: 'warrior_001',
    name: '戦士アレン',
    hp: 100,
    max_hp: 100,
    job: '戦士',
    image: warriorImg.src,
    flavor: '剣と盾を愛する頼もしい戦士。仲間を守るためなら自分の身を犠牲にすることも厭わない。',
    cards: CHARACTER_CARD_SETS.warrior_001
  },
  {
    id: 'mage_001',
    name: '魔法使いリナ',
    hp: 70,
    max_hp: 70,
    job: '魔法使い',
    image: mageImg.src,
    flavor: '古代魔法の研究に没頭する若き魔法使い。杖から放たれる魔法は敵を焼き尽くす。',
    cards: CHARACTER_CARD_SETS.mage_001
  },
  {
    id: 'cleric_001',
    name: '僧侶ミア',
    hp: 80,
    max_hp: 80,
    job: '僧侶',
    image: clericImg.src,
    flavor: '光の女神に仕える聖職者。優しい心の持ち主で、傷ついた仲間を癒すことができる。',
    cards: CHARACTER_CARD_SETS.cleric_001
  },
  {
    id: 'thief_001',
    name: '盗賊カイ',
    hp: 75,
    max_hp: 75,
    job: '盗賊',
    image: thiefImg.src,
    flavor: '影に潜み、素早く動く盗賊。鍵開けと罠の解除は彼の得意分野だ。',
    cards: CHARACTER_CARD_SETS.thief_001
  },
  {
    id: 'archer_001',
    name: '弓使いユウ',
    hp: 85,
    max_hp: 85,
    job: '弓使い',
    image: archerImg.src,
    flavor: '森で育った弓の名手。百発百中の矢は遠く離れた敵をも確実に射抜く。',
    cards: CHARACTER_CARD_SETS.archer_001
  }
];