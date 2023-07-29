import { Card } from './Card';

export default interface Player {
  HeadEq?: Card;
  ChestEq?: Card;
  GlovesEq?: Card;
  FeetEq?: Card;
  WeaponLEq?: Card;
  Hero?: Card;
  WeaponREq?: Card;
  Health?: number;
  ActionPoints?: number;
  Hand?: Card[];
  Arsenal?: Card[];
  Banish?: Card[];
  BanishCount?: number;
  Graveyard?: Card[];
  GraveyardCount?: number;
  Pitch?: Card[];
  PitchRemaining?: number;
  DeckSize?: number;
  DeckBack?: Card;
  Deck?: Card[];
  Name?: string;
  IsVerified?: boolean;
  Effects?: Card[];
  Permanents?: Card[];
  Soul?: Card[];
  SoulCount?: number;
  Playmat?: string;
  isPatron?: boolean;
  isContributor?: boolean;
  bloodDebtCount?: number;
  bloodDebtImmune?: boolean;
}
