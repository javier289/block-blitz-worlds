export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

export interface Block {
  x: number;
  y: number;
  color: string;
  type: TetrominoType;
}

export interface Tetromino {
  shape: number[][];
  color: string;
  type: TetrominoType;
  x: number;
  y: number;
}

export interface GameState {
  board: (Block | null)[][];
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  lines: number;
  level: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export interface World {
  id: number;
  name: string;
  theme: 'wood' | 'brick' | 'water' | 'fire' | 'ice';
  image: string;
  unlocked: boolean;
  completed: boolean;
  levels: Level[];
}

export interface Level {
  id: number;
  worldId: number;
  number: number;
  targetLines: number;
  timeLimit?: number;
  unlocked: boolean;
  completed: boolean;
  stars: number;
}

export interface PlayerProgress {
  currentWorld: number;
  currentLevel: number;
  unlockedWorlds: number[];
  completedLevels: { worldId: number; levelId: number; stars: number }[];
  totalScore: number;
}