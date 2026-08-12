// AI Strategy Engine for Dokuz Tas
import { BoardState, Player } from '../types';

export const DOKUZ_TAS_MILLS: number[][] = [
  // Outer square
  [0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 0],
  // Middle square
  [8, 9, 10], [10, 11, 12], [12, 13, 14], [14, 15, 8],
  // Inner square
  [16, 17, 18], [18, 19, 20], [20, 21, 22], [22, 23, 16],
  // Cross connections
  [1, 9, 17], [3, 11, 19], [5, 13, 21], [7, 15, 23]
];

export const DOKUZ_TAS_ADJACENCY: { [key: number]: number[] } = {
  0: [1, 7],
  1: [0, 2, 9],
  2: [1, 3],
  3: [2, 4, 11],
  4: [3, 5],
  5: [4, 6, 13],
  6: [5, 7],
  7: [6, 0, 15],

  8: [9, 15],
  9: [8, 10, 1, 17],
  10: [9, 11],
  11: [10, 12, 3, 19],
  12: [11, 13],
  13: [12, 14, 5, 21],
  14: [13, 15],
  15: [14, 8, 7, 23],

  16: [17, 23],
  17: [16, 18, 9],
  18: [17, 19],
  19: [18, 20, 11],
  20: [19, 21],
  21: [20, 22, 13],
  22: [21, 23],
  23: [22, 16, 15]
};

// Check if a point is part of a mill for a player
export function isPartOfMill(board: BoardState, pointIdx: number, player: Player): boolean {
  return DOKUZ_TAS_MILLS.some((mill) => {
    if (!mill.includes(pointIdx)) return false;
    return mill.every((idx) => board[idx] === player);
  });
}

// Check if a newly placed/moved stone forms a NEW mill
export function formsMill(board: BoardState, pointIdx: number, player: Player): boolean {
  return isPartOfMill(board, pointIdx, player);
}

// Check valid stones that can be removed from opponent
export function getRemovableStones(board: BoardState, opponent: Player): number[] {
  const opponentStones: number[] = [];
  const nonMillStones: number[] = [];

  board.forEach((cell, idx) => {
    if (cell === opponent) {
      opponentStones.push(idx);
      if (!isPartOfMill(board, idx, opponent)) {
        nonMillStones.push(idx);
      }
    }
  });

  // If all opponent stones are in mills, any opponent stone can be removed
  return nonMillStones.length > 0 ? nonMillStones : opponentStones;
}

// Get valid moves for a player in Dokuz Taş
export function getDokuzTasMoves(
  board: BoardState,
  player: Player,
  phase: 'placement' | 'movement',
  playerStoneCountOnBoard: number
): { from?: number; to: number }[] {
  const moves: { from?: number; to: number }[] = [];

  if (phase === 'placement') {
    // Drop on any empty spot
    board.forEach((cell, idx) => {
      if (cell === null) moves.push({ to: idx });
    });
  } else {
    // Movement phase
    const isFlying = playerStoneCountOnBoard === 3; // Flying rule when down to 3 stones!

    board.forEach((cell, fromIdx) => {
      if (cell === player) {
        if (isFlying) {
          // Can move to ANY empty spot
          board.forEach((targetCell, toIdx) => {
            if (targetCell === null) moves.push({ from: fromIdx, to: toIdx });
          });
        } else {
          // Move to adjacent empty spots
          const neighbors = DOKUZ_TAS_ADJACENCY[fromIdx] || [];
          neighbors.forEach((toIdx) => {
            if (board[toIdx] === null) moves.push({ from: fromIdx, to: toIdx });
          });
        }
      }
    });
  }

  return moves;
}

// AI logic for Dokuz Taş
export function getDokuzTasAIMove(
  board: BoardState,
  aiPlayer: Player,
  phase: 'placement' | 'movement',
  aiStonesOnBoard: number,
  difficulty: 'easy' | 'medium' | 'impossible'
): { from?: number; to: number } | null {
  const validMoves = getDokuzTasMoves(board, aiPlayer, phase, aiStonesOnBoard);
  if (validMoves.length === 0) return null;

  // Easy: random
  if (difficulty === 'easy' && Math.random() < 0.7) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  // Look for move that creates a mill
  for (const move of validMoves) {
    const testBoard = [...board];
    if (move.from !== undefined) testBoard[move.from] = null;
    testBoard[move.to] = aiPlayer;

    if (formsMill(testBoard, move.to, aiPlayer)) {
      return move;
    }
  }

  const humanPlayer: Player = aiPlayer === 'P1' ? 'P2' : 'P1';

  // Look for move that blocks opponent mill
  for (const move of validMoves) {
    const testBoard = [...board];
    testBoard[move.to] = humanPlayer;
    if (formsMill(testBoard, move.to, humanPlayer)) {
      return move; // Block it!
    }
  }

  // Medium: 30% random among valid
  if (difficulty === 'medium' && Math.random() < 0.3) {
    return validMoves[Math.floor(Math.random() * validMoves.length)];
  }

  // Prefer intersection points with highest connectivity
  validMoves.sort((a, b) => {
    const connA = (DOKUZ_TAS_ADJACENCY[a.to] || []).length;
    const connB = (DOKUZ_TAS_ADJACENCY[b.to] || []).length;
    return connB - connA;
  });

  return validMoves[0];
}

// AI logic for stone removal
export function getDokuzTasAIRemove(board: BoardState, humanPlayer: Player): number | null {
  const removables = getRemovableStones(board, humanPlayer);
  if (removables.length === 0) return null;

  // Prefer removing opponent stones that form potential 2-in-a-row
  for (const idx of removables) {
    const isThreat = DOKUZ_TAS_MILLS.some((mill) => {
      if (!mill.includes(idx)) return false;
      const countHuman = mill.filter((m) => board[m] === humanPlayer).length;
      return countHuman === 2;
    });
    if (isThreat) return idx;
  }

  return removables[Math.floor(Math.random() * removables.length)];
}
