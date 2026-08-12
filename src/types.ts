// TypeScript Type Definitions for Uc & Dokuz Tas Game
export type GameType = 'uc-tas' | 'dokuz-tas';

export type Player = 'P1' | 'P2'; // P1: Red / Ruby, P2: Blue / Sapphire

export type GameMode = 'vs-ai' | 'pass-and-play' | 'online-2p';

export type AIDifficulty = 'easy' | 'medium' | 'impossible';

export type BoardTheme = 'wood' | 'marble';

export type GamePhase = 'placement' | 'movement' | 'removal' | 'game-over';

export interface Point2D {
  x: number;
  y: number;
}

// Coordinate represented as string "x,y" or index
export type BoardState = (Player | null)[];

export interface UcTasMove {
  from?: number; // undefined in placement phase
  to: number;
}

export interface GameStats {
  p1Wins: number;
  p2Wins: number;
  draws: number;
  streak: number;
}

export interface RuleStep {
  title: string;
  description: string;
  iconName: string;
}
