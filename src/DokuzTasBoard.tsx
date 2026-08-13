// Dokuz Tas Interactive Game Board Component
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BoardState, Player } from '../types';

interface DokuzTasBoardProps {
  board: BoardState;
  selectedIdx: number | null;
  validMovesFromSelected: number[];
  removableStones: number[];
  isRemovalPhase: boolean;
  currentPlayer: Player;
  phase: 'placement' | 'movement';
  isFlying: boolean;
  onPointClick: (index: number) => void;
}

// 24 Node coordinates on a 500x500 SVG ViewBox
export const DOKUZ_TAS_POINTS = [
  // Outer square (0..7)
  { x: 30, y: 30 },
  { x: 250, y: 30 },
  { x: 470, y: 30 },
  { x: 470, y: 250 },
  { x: 470, y: 470 },
  { x: 250, y: 470 },
  { x: 30, y: 470 },
  { x: 30, y: 250 },

  // Middle square (8..15)
  { x: 100, y: 100 },
  { x: 250, y: 100 },
  { x: 400, y: 100 },
  { x: 400, y: 250 },
  { x: 400, y: 400 },
  { x: 250, y: 400 },
  { x: 100, y: 400 },
  { x: 100, y: 250 },

  // Inner square (16..23)
  { x: 170, y: 170 },
  { x: 250, y: 170 },
  { x: 330, y: 170 },
  { x: 330, y: 250 },
  { x: 330, y: 330 },
  { x: 250, y: 330 },
  { x: 170, y: 330 },
  { x: 170, y: 250 },
];

export const DokuzTasBoard: React.FC<DokuzTasBoardProps> = ({
  board,
  selectedIdx,
  validMovesFromSelected,
  removableStones,
  isRemovalPhase,
  onPointClick,
}) => {
  return (
    <div className="relative w-full max-w-[500px] max-h-[min(60vh,500px)] aspect-square mx-auto p-2 flex items-center justify-center select-none">
      {/* Board Canvas Outer Box - Light Natural Wood Finish */}
      <div className="relative w-full h-full rounded-2xl bg-gradient-to-br from-[#FFFDF9] via-[#F5ECE0] to-[#E8DCC8] border-4 border-[#8B5A2B] shadow-xl p-2 flex items-center justify-center overflow-hidden">
        
        {/* SVG Board Rendering */}
        <svg viewBox="0 0 500 500" className="w-full h-full overflow-visible z-10 relative">
          <defs>
            {/* 3D Radial Gradients for Player 1 (Ivory Gold) & Player 2 (Ebony Slate) */}
            <radialGradient id="p1IvoryGold" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF2A3" />
              <stop offset="55%" stopColor="#E5B94E" />
              <stop offset="100%" stopColor="#8C6316" />
            </radialGradient>

            <radialGradient id="p2EbonySlate" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#555555" />
              <stop offset="60%" stopColor="#1F1F1F" />
              <stop offset="100%" stopColor="#080808" />
            </radialGradient>
          </defs>

          {/* Outer Square */}
          <rect
            x="30"
            y="30"
            width="440"
            height="440"
            fill="none"
            stroke="#5C3210"
            strokeWidth="7"
            rx="8"
          />

          {/* Middle Square */}
          <rect
            x="100"
            y="100"
            width="300"
            height="300"
            fill="none"
            stroke="#5C3210"
            strokeWidth="7"
            rx="6"
          />

          {/* Inner Square */}
          <rect
            x="170"
            y="170"
            width="160"
            height="160"
            fill="none"
            stroke="#5C3210"
            strokeWidth="7"
            rx="4"
          />

          {/* Cross Connection Lines */}
          <line x1="250" y1="30" x2="250" y2="170" stroke="#5C3210" strokeWidth="7" strokeLinecap="round" />
          <line x1="470" y1="250" x2="330" y2="250" stroke="#5C3210" strokeWidth="7" strokeLinecap="round" />
          <line x1="250" y1="470" x2="250" y2="330" stroke="#5C3210" strokeWidth="7" strokeLinecap="round" />
          <line x1="30" y1="250" x2="170" y2="250" stroke="#5C3210" strokeWidth="7" strokeLinecap="round" />

          {/* 24 Intersection Nodes & Stones */}
          {DOKUZ_TAS_POINTS.map((pt, idx) => {
            const stone = board[idx];
            const isSelected = selectedIdx === idx;
            const isValidTarget = validMovesFromSelected.includes(idx);
            const isRemovable = isRemovalPhase && removableStones.includes(idx);

            return (
              <g key={idx} className="cursor-pointer group" onClick={() => onPointClick(idx)}>
                {/* Invisible Hit Area */}
                <circle cx={pt.x} cy={pt.y} r="28" fill="transparent" />

                {/* Node Intersection Circle (Base) */}
                {!stone && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="10"
                    fill="#FAF6F0"
                    stroke="#5C3210"
                    strokeWidth="3.5"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    className="transition-all duration-150 group-hover:scale-125 group-hover:fill-[#7A4219]"
                  />
                )}

                {/* Removable Target Highlight (Pulsing Red) */}
                {isRemovable && (
                  <motion.circle
                    cx={pt.x}
                    cy={pt.y}
                    r="24"
                    fill="none"
                    stroke="#D93838"
                    strokeWidth="5"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.9, 1.25, 0.9], opacity: [0.7, 1, 0.7] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                  />
                )}

                {/* Valid Move Target Highlight (Pulsing Green) */}
                {isValidTarget && (
                  <motion.circle
                    cx={pt.x}
                    cy={pt.y}
                    r="22"
                    fill="none"
                    stroke="#2E7D32"
                    strokeWidth="4"
                    strokeDasharray="4 3"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.6, 1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}

                {/* Selected Stone Ring */}
                {isSelected && (
                  <motion.circle
                    cx={pt.x}
                    cy={pt.y}
                    r="25"
                    fill="none"
                    stroke="#7A4219"
                    strokeWidth="4"
                    style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                    animate={{ scale: [1, 1.12, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}

                {/* Stone Rendering */}
                <AnimatePresence>
                  {stone && (
                    <motion.g
                      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      {stone === 'P1' ? (
                        <g>
                          {/* Drop Shadow */}
                          <circle cx={pt.x + 2} cy={pt.y + 3} r="18" fill="#2C1810" opacity="0.2" />
                          {/* Main Gold/Ivory Stone */}
                          <circle cx={pt.x} cy={pt.y} r="18" fill="url(#p1IvoryGold)" stroke="#9E6B1F" strokeWidth="1.5" />
                          <circle cx={pt.x} cy={pt.y} r="12" fill="none" stroke="#FFF" strokeWidth="1" opacity="0.5" />
                        </g>
                      ) : (
                        <g>
                          {/* Drop Shadow */}
                          <circle cx={pt.x + 2} cy={pt.y + 3} r="18" fill="#2C1810" opacity="0.2" />
                          {/* Main Ebony/Slate Stone */}
                          <circle cx={pt.x} cy={pt.y} r="18" fill="url(#p2EbonySlate)" stroke="#9E6B1F" strokeWidth="1.5" />
                          <circle cx={pt.x} cy={pt.y} r="12" fill="none" stroke="#D4AF37" strokeWidth="1" opacity="0.4" />
                        </g>
                      )}
                    </motion.g>
                  )}
                </AnimatePresence>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
