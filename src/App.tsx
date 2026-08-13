// Main Application Component
import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { ModeSelection } from './components/ModeSelection';
import { DokuzTasBoard } from './components/DokuzTasBoard';
import { Header } from './components/Header';
import { StatsPanel } from './components/StatsPanel';
import { GameOverModal } from './components/GameOverModal';
import { RulesModal } from './components/RulesModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { auth, syncUserProfile, UserProfile, loginAsGuest, recordGameResult, logoutUser } from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import {
  GameSession,
  createMultiplayerRoom,
  joinMultiplayerRoom,
  joinMatchmaking,
  listenToGame,
  updateGameState,
} from './lib/multiplayer';
import { AIDifficulty, BoardState, GameMode, Player } from './types';
import {
  DOKUZ_TAS_MILLS,
  formsMill,
  getDokuzTasAIMove,
  getDokuzTasAIRemove,
  getDokuzTasMoves,
  getRemovableStones,
} from './utils/aiDokuzTas';

export default function App() {
  // Navigation State
  const [screen, setScreen] = useState<'splash' | 'menu' | 'game'>('splash');
  const [gameMode, setGameMode] = useState<GameMode>('vs-ai');
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('impossible');
  const [isRulesOpen, setIsRulesOpen] = useState<boolean>(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState<boolean>(false);

  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Online Multiplayer State
  const [activeOnlineGameId, setActiveOnlineGameId] = useState<string | null>(null);
  const [myOnlinePlayer, setMyOnlinePlayer] = useState<Player | null>(null);
  const [onlineSession, setOnlineSession] = useState<GameSession | null>(null);
  const [isWaitingOnlinePlayer, setIsWaitingOnlinePlayer] = useState<boolean>(false);

  // Dokuz Taş Board Game State (24 Nodes)
  const [board, setBoard] = useState<BoardState>(Array(24).fill(null));
  const [phase, setPhase] = useState<'placement' | 'movement'>('placement');
  const [currentPlayer, setCurrentPlayer] = useState<Player>('P1');
  const [p1Reserve, setP1Reserve] = useState<number>(9);
  const [p2Reserve, setP2Reserve] = useState<number>(9);
  const [p1StonesOnBoard, setP1StonesOnBoard] = useState<number>(0);
  const [p2StonesOnBoard, setP2StonesOnBoard] = useState<number>(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [removableStones, setRemovableStones] = useState<number[]>([]);
  const [isRemovalPhase, setIsRemovalPhase] = useState<boolean>(false);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [isGameOverModalOpen, setIsGameOverModalOpen] = useState<boolean>(true);
  const [isAiThinking, setIsAiThinking] = useState<boolean>(false);

  // Scoreboard Wins
  const [p1Wins, setP1Wins] = useState<number>(0);
  const [p2Wins, setP2Wins] = useState<number>(0);

  // History for Undo (Offline mode)
  const [history, setHistory] = useState<{
    board: BoardState;
    phase: 'placement' | 'movement';
    currentPlayer: Player;
    p1Reserve: number;
    p2Reserve: number;
    p1StonesOnBoard: number;
    p2StonesOnBoard: number;
  }[]>([]);

  // 1. Firebase Auth Listener & Profile Sync
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          const profile = await syncUserProfile(user);
          setCurrentUser(profile);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Firebase Auth/Profile sync error:', err);
      }
    });
    return () => unsub();
  }, []);

  // 1b. PWA Service Worker Registration
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
  }, []);

  // 2. Real-time Online Game Subscription
  useEffect(() => {
    if (!activeOnlineGameId) return;

    const unsub = listenToGame(activeOnlineGameId, (session) => {
      if (!session) return;
      setOnlineSession(session);

      if (currentUser) {
        if (session.p1Uid === currentUser.uid) setMyOnlinePlayer('P1');
        else if (session.p2Uid === currentUser.uid) setMyOnlinePlayer('P2');
      }

      setBoard(session.boardState);
      setCurrentPlayer(session.currentPlayer);
      setPhase(session.phase === 'capture' ? 'movement' : session.phase);
      setIsRemovalPhase(session.phase === 'capture');
      setP1Reserve(session.p1Reserve);
      setP2Reserve(session.p2Reserve);

      const p1BoardCount = session.boardState.filter((c) => c === 'P1').length;
      const p2BoardCount = session.boardState.filter((c) => c === 'P2').length;
      setP1StonesOnBoard(p1BoardCount);
      setP2StonesOnBoard(p2BoardCount);

      if (session.status === 'waiting') {
        setIsWaitingOnlinePlayer(true);
      } else {
        setIsWaitingOnlinePlayer(false);
      }

      if (session.winner) {
        setWinner(session.winner as any);
      }
    });

    return () => unsub();
  }, [activeOnlineGameId, currentUser]);

  // 3. Record Game Result to Firestore Stats & Open Modal
  useEffect(() => {
    if (winner) {
      setIsGameOverModalOpen(true);
      if (currentUser?.uid) {
        if (winner === 'P1') {
          recordGameResult(currentUser.uid);
        } else if (winner === 'P2' && gameMode === 'online-2p' && onlineSession) {
          const opponentUid = onlineSession.p1Uid === currentUser.uid ? onlineSession.p2Uid : onlineSession.p1Uid;
          if (opponentUid) recordGameResult(opponentUid, currentUser.uid);
        }
      }
    }
  }, [winner, currentUser, gameMode, onlineSession]);

  // Reset local game state
  const resetLocalGame = useCallback(() => {
    setBoard(Array(24).fill(null));
    setPhase('placement');
    setCurrentPlayer('P1');
    setP1Reserve(9);
    setP2Reserve(9);
    setP1StonesOnBoard(0);
    setP2StonesOnBoard(0);
    setSelectedIdx(null);
    setRemovableStones([]);
    setIsRemovalPhase(false);
    setWinner(null);
    setIsGameOverModalOpen(false);
    setHistory([]);
    setIsAiThinking(false);
  }, []);

  // Check Game Over Condition
  const checkGameOver = useCallback(
    (
      currentBoard: BoardState,
      currentP1Reserve: number,
      currentP2Reserve: number,
      nextTurnPlayer: Player
    ) => {
      const p1Count = currentBoard.filter((c) => c === 'P1').length;
      const p2Count = currentBoard.filter((c) => c === 'P2').length;

      // In movement phase, if a player drops below 3 stones, they lose!
      if (currentP1Reserve === 0 && currentP2Reserve === 0) {
        if (p1Count < 3) {
          setWinner('P2');
          setP2Wins((w) => w + 1);
          return true;
        }
        if (p2Count < 3) {
          setWinner('P1');
          setP1Wins((w) => w + 1);
          return true;
        }

        // Check if next player has valid moves
        const isFlying = (nextTurnPlayer === 'P1' ? p1Count : p2Count) === 3;
        const validMoves = getDokuzTasMoves(
          currentBoard,
          nextTurnPlayer,
          'movement',
          nextTurnPlayer === 'P1' ? p1Count : p2Count
        );

        if (validMoves.length === 0) {
          const gameWinner = nextTurnPlayer === 'P1' ? 'P2' : 'P1';
          setWinner(gameWinner);
          if (gameWinner === 'P1') setP1Wins((w) => w + 1);
          else setP2Wins((w) => w + 1);
          return true;
        }
      }
      return false;
    },
    []
  );

  // Save State History for Undo
  const saveHistory = useCallback(() => {
    setHistory((prev) => [
      ...prev,
      {
        board: [...board],
        phase,
        currentPlayer,
        p1Reserve,
        p2Reserve,
        p1StonesOnBoard,
        p2StonesOnBoard,
      },
    ]);
  }, [board, phase, currentPlayer, p1Reserve, p2Reserve, p1StonesOnBoard, p2StonesOnBoard]);

  // Undo Move
  const handleUndo = useCallback(() => {
    if (history.length === 0 || gameMode === 'online-2p' || isAiThinking) return;
    const last = history[history.length - 1];
    setBoard(last.board);
    setPhase(last.phase);
    setCurrentPlayer(last.currentPlayer);
    setP1Reserve(last.p1Reserve);
    setP2Reserve(last.p2Reserve);
    setP1StonesOnBoard(last.p1StonesOnBoard);
    setP2StonesOnBoard(last.p2StonesOnBoard);
    setSelectedIdx(null);
    setIsRemovalPhase(false);
    setRemovableStones([]);
    setHistory((prev) => prev.slice(0, -1));
  }, [history, gameMode, isAiThinking]);

  // Point Click Handler (Placement, Selection, Movement, Capture)
  const handlePointClick = useCallback(
    async (clickedIdx: number) => {
      if (winner || isAiThinking) return;

      // Online Multiplayer Turn Guard
      if (gameMode === 'online-2p') {
        if (!activeOnlineGameId || currentPlayer !== myOnlinePlayer) return;
      }

      const opponent: Player = currentPlayer === 'P1' ? 'P2' : 'P1';

      // --- CAPTURE / REMOVAL PHASE ---
      if (isRemovalPhase) {
        if (!removableStones.includes(clickedIdx)) return;

        saveHistory();

        const newBoard = [...board];
        newBoard[clickedIdx] = null;
        setBoard(newBoard);

        const newP1Count = newBoard.filter((c) => c === 'P1').length;
        const newP2Count = newBoard.filter((c) => c === 'P2').length;
        setP1StonesOnBoard(newP1Count);
        setP2StonesOnBoard(newP2Count);

        setIsRemovalPhase(false);
        setRemovableStones([]);

        // Determine if all stones are placed -> transition to movement phase
        const nextP1Res = p1Reserve;
        const nextP2Res = p2Reserve;
        const nextPhase = nextP1Res === 0 && nextP2Res === 0 ? 'movement' : 'placement';
        setPhase(nextPhase);

        // Turn changes to opponent
        setCurrentPlayer(opponent);

        // Online sync
        if (gameMode === 'online-2p' && activeOnlineGameId) {
          await updateGameState(activeOnlineGameId, {
            boardState: newBoard,
            currentPlayer: opponent,
            phase: nextPhase,
          });
        }

        checkGameOver(newBoard, nextP1Res, nextP2Res, opponent);
        return;
      }

      // --- PLACEMENT PHASE ---
      if (phase === 'placement') {
        if (board[clickedIdx] !== null) return;

        saveHistory();

        const newBoard = [...board];
        newBoard[clickedIdx] = currentPlayer;
        setBoard(newBoard);

        let newP1Res = p1Reserve;
        let newP2Res = p2Reserve;

        if (currentPlayer === 'P1') {
          newP1Res = Math.max(0, p1Reserve - 1);
          setP1Reserve(newP1Res);
        } else {
          newP2Res = Math.max(0, p2Reserve - 1);
          setP2Reserve(newP2Res);
        }

        const newP1Count = newBoard.filter((c) => c === 'P1').length;
        const newP2Count = newBoard.filter((c) => c === 'P2').length;
        setP1StonesOnBoard(newP1Count);
        setP2StonesOnBoard(newP2Count);

        // Check Mill Formation
        if (formsMill(newBoard, clickedIdx, currentPlayer)) {
          const removables = getRemovableStones(newBoard, opponent);
          setIsRemovalPhase(true);
          setRemovableStones(removables);

          if (gameMode === 'online-2p' && activeOnlineGameId) {
            await updateGameState(activeOnlineGameId, {
              boardState: newBoard,
              p1Reserve: newP1Res,
              p2Reserve: newP2Res,
              phase: 'capture',
            });
          }
          return;
        }

        const nextPhase = newP1Res === 0 && newP2Res === 0 ? 'movement' : 'placement';
        setPhase(nextPhase);
        setCurrentPlayer(opponent);

        if (gameMode === 'online-2p' && activeOnlineGameId) {
          await updateGameState(activeOnlineGameId, {
            boardState: newBoard,
            p1Reserve: newP1Res,
            p2Reserve: newP2Res,
            currentPlayer: opponent,
            phase: nextPhase,
          });
        }

        checkGameOver(newBoard, newP1Res, newP2Res, opponent);
        return;
      }

      // --- MOVEMENT PHASE ---
      if (phase === 'movement') {
        // Selecting own stone
        if (board[clickedIdx] === currentPlayer) {
          setSelectedIdx(clickedIdx);
          return;
        }

        // Moving selected stone
        if (selectedIdx !== null && board[clickedIdx] === null) {
          const countCurrent = currentPlayer === 'P1' ? p1StonesOnBoard : p2StonesOnBoard;
          const validMoves = getDokuzTasMoves(board, currentPlayer, 'movement', countCurrent);
          const isValidMove = validMoves.some((m) => m.from === selectedIdx && m.to === clickedIdx);

          if (!isValidMove) return;

          saveHistory();

          const newBoard = [...board];
          newBoard[selectedIdx] = null;
          newBoard[clickedIdx] = currentPlayer;
          setBoard(newBoard);
          setSelectedIdx(null);

          // Check Mill Formation
          if (formsMill(newBoard, clickedIdx, currentPlayer)) {
            const removables = getRemovableStones(newBoard, opponent);
            setIsRemovalPhase(true);
            setRemovableStones(removables);

            if (gameMode === 'online-2p' && activeOnlineGameId) {
              await updateGameState(activeOnlineGameId, {
                boardState: newBoard,
                phase: 'capture',
              });
            }
            return;
          }

          setCurrentPlayer(opponent);

          if (gameMode === 'online-2p' && activeOnlineGameId) {
            await updateGameState(activeOnlineGameId, {
              boardState: newBoard,
              currentPlayer: opponent,
              phase: 'movement',
            });
          }

          checkGameOver(newBoard, p1Reserve, p2Reserve, opponent);
        }
      }
    },
    [
      winner,
      isAiThinking,
      gameMode,
      activeOnlineGameId,
      currentPlayer,
      myOnlinePlayer,
      isRemovalPhase,
      removableStones,
      board,
      phase,
      p1Reserve,
      p2Reserve,
      selectedIdx,
      p1StonesOnBoard,
      p2StonesOnBoard,
      saveHistory,
      checkGameOver,
    ]
  );

  // AI Turn Trigger Handler
  useEffect(() => {
    if (gameMode !== 'vs-ai' || currentPlayer !== 'P2' || winner) return;

    setIsAiThinking(true);

    const timer = setTimeout(() => {
      const opponent: Player = 'P1';

      if (isRemovalPhase) {
        // AI Stone Removal
        const removeIdx = getDokuzTasAIRemove(board, opponent);
        if (removeIdx !== null) {
          const newBoard = [...board];
          newBoard[removeIdx] = null;
          setBoard(newBoard);

          const newP1Count = newBoard.filter((c) => c === 'P1').length;
          const newP2Count = newBoard.filter((c) => c === 'P2').length;
          setP1StonesOnBoard(newP1Count);
          setP2StonesOnBoard(newP2Count);

          setIsRemovalPhase(false);
          setRemovableStones([]);

          const nextPhase = p1Reserve === 0 && p2Reserve === 0 ? 'movement' : 'placement';
          setPhase(nextPhase);
          setCurrentPlayer('P1');
          checkGameOver(newBoard, p1Reserve, p2Reserve, 'P1');
        }
        setIsAiThinking(false);
        return;
      }

      // AI Placement or Movement
      const aiMove = getDokuzTasAIMove(board, 'P2', phase, p2StonesOnBoard, aiDifficulty);

      if (aiMove) {
        const newBoard = [...board];
        if (aiMove.from !== undefined) newBoard[aiMove.from] = null;
        newBoard[aiMove.to] = 'P2';

        let newP2Res = p2Reserve;
        if (phase === 'placement') {
          newP2Res = Math.max(0, p2Reserve - 1);
          setP2Reserve(newP2Res);
        }

        let newP1Count = newBoard.filter((c) => c === 'P1').length;
        let newP2Count = newBoard.filter((c) => c === 'P2').length;

        // AI formed a Mill
        if (formsMill(newBoard, aiMove.to, 'P2')) {
          const removeIdx = getDokuzTasAIRemove(newBoard, opponent);
          if (removeIdx !== null) {
            newBoard[removeIdx] = null;
            newP1Count = newBoard.filter((c) => c === 'P1').length;
          }
        }

        setBoard(newBoard);
        setP1StonesOnBoard(newP1Count);
        setP2StonesOnBoard(newP2Count);

        const nextPhase = p1Reserve === 0 && newP2Res === 0 ? 'movement' : 'placement';
        setPhase(nextPhase);
        setCurrentPlayer('P1');
        checkGameOver(newBoard, p1Reserve, newP2Res, 'P1');
      }

      setIsAiThinking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [
    gameMode,
    currentPlayer,
    winner,
    isRemovalPhase,
    board,
    phase,
    p2StonesOnBoard,
    aiDifficulty,
    p1Reserve,
    p2Reserve,
    checkGameOver,
  ]);

  // Handle Online Creation
  const handleCreateOnlineRoom = async () => {
    if (!currentUser) return;
    try {
      const roomId = await createMultiplayerRoom(currentUser.uid, currentUser.displayName, 'dokuz-tas');
      setActiveOnlineGameId(roomId);
      setGameMode('online-2p');
      setScreen('game');
    } catch (e) {
      console.error(e);
    }
  };

  // Handle Online Joining
  const handleJoinOnlineRoom = async (code: string) => {
    if (!currentUser) return;
    try {
      const success = await joinMultiplayerRoom(code, currentUser.uid, currentUser.displayName);
      if (success) {
        setActiveOnlineGameId(code);
        setGameMode('online-2p');
        setScreen('game');
      } else {
        alert('Oda bulunamadı veya oda dolu!');
      }
    } catch (e) {
      console.error(e);
      alert('Odaya katılırken hata oluştu.');
    }
  };

  // Handle Quick Match
  const handleQuickMatch = async () => {
    if (!currentUser) return;
    try {
      const res = await joinMatchmaking(currentUser.uid, currentUser.displayName, 'dokuz-tas');
      setActiveOnlineGameId(res.gameId);
      setGameMode('online-2p');
      setScreen('game');
    } catch (e) {
      console.error(e);
    }
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Logout error:', err);
    }
    setCurrentUser(null);
    setScreen('splash');
  };

  // Update user name
  const handleUpdateUserName = async (newName: string) => {
    if (!currentUser) return;
    const updated = await syncUserProfile({ uid: currentUser.uid } as any, newName);
    setCurrentUser(updated);
  };

  // Valid move calculations for selected stone
  const validMovesFromSelected =
    selectedIdx !== null
      ? getDokuzTasMoves(
          board,
          currentPlayer,
          phase,
          currentPlayer === 'P1' ? p1StonesOnBoard : p2StonesOnBoard
        )
          .filter((m) => m.from === selectedIdx)
          .map((m) => m.to)
      : [];

  // Determine status message
  let statusMessage = '';
  if (winner) {
    const winnerName =
      winner === 'draw'
        ? 'Berabere!'
        : winner === 'P1'
        ? onlineSession?.p1Name || currentUser?.displayName || '1. Oyuncu'
        : gameMode === 'vs-ai'
        ? 'Yapay Zeka'
        : onlineSession?.p2Name || '2. Oyuncu';
    statusMessage = winner === 'draw' ? 'OYUN BİTTİ: Berabere!' : `🎉 OYUN BİTTİ: ${winnerName} Kazandı!`;
  } else if (isWaitingOnlinePlayer) {
    statusMessage = `Rakip bekleniyor... Oda Kodu: ${activeOnlineGameId}`;
  } else if (isRemovalPhase) {
    statusMessage = 'ÜÇLÜ OLUŞTU! Rakip taş seçip çıkarın.';
  } else if (phase === 'placement') {
    statusMessage = `${currentPlayer === 'P1' ? '1. Oyuncu' : '2. Oyuncu'} - Taş koyma sırası (Elde: ${
      currentPlayer === 'P1' ? p1Reserve : p2Reserve
    })`;
  } else {
    statusMessage = `${currentPlayer === 'P1' ? '1. Oyuncu' : '2. Oyuncu'} - Taş taşıma sırası`;
  }

  return (
    <div className="min-h-screen w-full bg-light-theme text-[#2C1810] flex flex-col items-center justify-between font-sans selection:bg-[#7A4219] selection:text-[#FFF8E7]">
      
      {/* 1. SPLASH / AUTHENTICATION LANDING SCREEN */}
      {screen === 'splash' && (
        <SplashScreen 
          currentUser={currentUser}
          onStart={() => setScreen('menu')} 
          onUserAuthenticated={(profile) => {
            setCurrentUser(profile);
            setScreen('menu');
          }}
          onLogout={handleLogout}
        />
      )}

      {/* 2. USER ENTRY & MODE SELECTION SCREEN */}
      {screen === 'menu' && (
        <ModeSelection
          currentUser={currentUser}
          onUpdateUserName={handleUpdateUserName}
          onStartOfflineGame={(mode, diff) => {
            setGameMode(mode);
            if (diff) setAiDifficulty(diff);
            setActiveOnlineGameId(null);
            resetLocalGame();
            setScreen('game');
          }}
          onCreateOnlineRoom={handleCreateOnlineRoom}
          onJoinOnlineRoom={handleJoinOnlineRoom}
          onQuickMatch={handleQuickMatch}
          onOpenRules={() => setIsRulesOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onLogout={handleLogout}
        />
      )}

      {/* 3. GAME SCREEN */}
      {screen === 'game' && (
        <div className="w-full h-screen flex flex-col justify-between overflow-hidden">
          <Header
            onBackToMenu={() => {
              setActiveOnlineGameId(null);
              setScreen('menu');
            }}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
            onResetGame={resetLocalGame}
            currentUser={currentUser}
            modeLabel={
              gameMode === 'vs-ai'
                ? `Yapay Zeka (${aiDifficulty === 'easy' ? 'Kolay' : 'Zor'})`
                : gameMode === 'online-2p'
                ? 'Çevrimiçi Oyun'
                : '2 Kişilik (Aynı Cihaz)'
            }
          />

          <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 overflow-y-auto max-w-lg mx-auto w-full gap-3">
            <StatsPanel
              currentPlayer={currentPlayer}
              gameMode={gameMode}
              p1Name={onlineSession?.p1Name || currentUser?.displayName || '1. Oyuncu'}
              p2Name={onlineSession?.p2Name || '2. Oyuncu'}
              p1StonesReserve={p1Reserve}
              p2StonesReserve={p2Reserve}
              p1StonesOnBoard={p1StonesOnBoard}
              p2StonesOnBoard={p2StonesOnBoard}
              p1Wins={p1Wins}
              p2Wins={p2Wins}
              isAiThinking={isAiThinking}
              onUndo={gameMode !== 'online-2p' ? handleUndo : undefined}
              onRestart={resetLocalGame}
              canUndo={history.length > 0}
              statusMessage={statusMessage}
            />

            {/* Dokuz Taş Board */}
            <DokuzTasBoard
              board={board}
              selectedIdx={selectedIdx}
              validMovesFromSelected={validMovesFromSelected}
              removableStones={removableStones}
              isRemovalPhase={isRemovalPhase}
              currentPlayer={currentPlayer}
              phase={phase}
              isFlying={(currentPlayer === 'P1' ? p1StonesOnBoard : p2StonesOnBoard) === 3}
              onPointClick={handlePointClick}
            />

            {/* Persistent Game Over Action Bar when game ends */}
            {winner && (
              <div className="w-full max-w-[500px] bg-[#FFFDF9] border-2 border-[#7A4219] rounded-2xl p-2.5 sm:p-3 flex items-center justify-between gap-2 shadow-lg shrink-0">
                <span className="text-xs font-black text-[#7A4219]">Oyun Bitti</span>
                <div className="flex items-center gap-2">
                  {!isGameOverModalOpen && (
                    <button
                      onClick={() => setIsGameOverModalOpen(true)}
                      className="px-2.5 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#D4C3B3] text-xs font-bold text-[#7A4219] hover:bg-[#7A4219]/10 transition-colors cursor-pointer"
                    >
                      Kartı Gör
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setActiveOnlineGameId(null);
                      setScreen('menu');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#FAF6F0] border border-[#D4C3B3] text-xs font-bold text-[#2C1810] hover:bg-[#E8DFD5] transition-colors cursor-pointer"
                  >
                    Ana Menü
                  </button>

                  <button
                    onClick={resetLocalGame}
                    className="px-3 py-1.5 rounded-xl bg-[#7A4219] text-[#FFF8E7] text-xs font-black hover:bg-[#8B5A2B] transition-colors cursor-pointer flex items-center gap-1 shadow-sm"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Tekrar Oyna</span>
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {/* Game Over Modal */}
      {isGameOverModalOpen && (
        <GameOverModal
          winner={winner}
          gameMode={gameMode}
          p1Name={onlineSession?.p1Name || currentUser?.displayName || '1. Oyuncu'}
          p2Name={onlineSession?.p2Name || '2. Oyuncu'}
          onRestart={resetLocalGame}
          onBackToMenu={() => {
            setActiveOnlineGameId(null);
            setScreen('menu');
          }}
          onInspectBoard={() => setIsGameOverModalOpen(false)}
        />
      )}

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        isOpen={isLeaderboardOpen}
        onClose={() => setIsLeaderboardOpen(false)}
        currentUserUid={currentUser?.uid}
      />

    </div>
  );
}
