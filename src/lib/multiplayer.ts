// Online Multiplayer Engine for Firebase
import { 
  db,
  handleFirestoreError,
  OperationType
} from './firebase';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot, 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  serverTimestamp,
  Unsubscribe 
} from 'firebase/firestore';
import { GameType, Player } from '../types';

export interface GameSession {
  gameId: string;
  gameType: GameType;
  p1Uid: string;
  p2Uid: string;
  p1Name: string;
  p2Name: string;
  boardState: (Player | null)[];
  phase: 'placement' | 'movement' | 'capture';
  currentPlayer: Player;
  p1Reserve: number;
  p2Reserve: number;
  p1RemovedCount: number;
  p2RemovedCount: number;
  winner: Player | 'DRAW' | null;
  status: 'waiting' | 'active' | 'completed' | 'abandoned';
  lastMoveTimestamp: number;
  selectedNodeIndex?: number | null;
  millCountP1?: number;
  millCountP2?: number;
  rematchRequestedBy?: string | null;
}

export interface GameInvitation {
  id: string;
  senderUid: string;
  senderName: string;
  receiverUid: string;
  receiverName: string;
  gameType: GameType;
  status: 'pending' | 'accepted' | 'declined';
  gameId?: string;
  createdAt: number;
}

export interface MatchmakingQueueItem {
  id: string;
  uid: string;
  displayName: string;
  gameType: GameType;
  gameId: string;
  createdAt: number;
}

// Initial state generators
export function createInitialGameData(
  gameId: string,
  gameType: GameType,
  p1Uid: string,
  p1Name: string,
  p2Uid: string = '',
  p2Name: string = 'Bekleniyor...'
): GameSession {
  const isUc = gameType === 'uc-tas';
  return {
    gameId,
    gameType,
    p1Uid,
    p2Uid,
    p1Name,
    p2Name,
    boardState: Array(isUc ? 9 : 24).fill(null),
    phase: 'placement',
    currentPlayer: 'P1',
    p1Reserve: isUc ? 3 : 9,
    p2Reserve: isUc ? 3 : 9,
    p1RemovedCount: 0,
    p2RemovedCount: 0,
    winner: null,
    status: p2Uid ? 'active' : 'waiting',
    lastMoveTimestamp: Date.now(),
    selectedNodeIndex: null,
  };
}

// Create a direct room
export async function createMultiplayerRoom(
  p1Uid: string, 
  p1Name: string, 
  gameType: GameType
): Promise<string> {
  const gamesRef = collection(db, 'games');
  const newDoc = doc(gamesRef);
  const initialData = createInitialGameData(newDoc.id, gameType, p1Uid, p1Name);
  await setDoc(newDoc, initialData);
  return newDoc.id;
}

// Join an existing room
export async function joinMultiplayerRoom(
  gameId: string, 
  p2Uid: string, 
  p2Name: string
): Promise<boolean> {
  const gameRef = doc(db, 'games', gameId);
  const snap = await getDoc(gameRef);
  if (!snap.exists()) return false;

  const data = snap.data() as GameSession;
  if (data.p2Uid && data.p2Uid !== p2Uid) {
    return false; // Room full
  }

  await updateDoc(gameRef, {
    p2Uid,
    p2Name,
    status: 'active',
    lastMoveTimestamp: Date.now()
  });
  return true;
}

// Real-time listener for a game room
export function listenToGame(gameId: string, callback: (game: GameSession | null) => void): Unsubscribe {
  const gameRef = doc(db, 'games', gameId);
  return onSnapshot(
    gameRef, 
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as GameSession);
      } else {
        callback(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `games/${gameId}`);
    }
  );
}

// Update game state on move
export async function updateGameState(gameId: string, updates: Partial<GameSession>) {
  const gameRef = doc(db, 'games', gameId);
  await updateDoc(gameRef, {
    ...updates,
    lastMoveTimestamp: Date.now()
  });
}

// Matchmaking Queue Logic
export async function joinMatchmaking(
  uid: string, 
  displayName: string, 
  gameType: GameType
): Promise<{ gameId: string; unsubscribeQueue?: Unsubscribe }> {
  // Check if there is already an open room waiting for P2
  const gamesRef = collection(db, 'games');
  const q = query(
    gamesRef, 
    where('gameType', '==', gameType), 
    where('status', '==', 'waiting')
  );
  const snap = await getDocs(q);

  let availableGame: GameSession | null = null;
  snap.forEach((d) => {
    const data = d.data() as GameSession;
    if (data.p1Uid !== uid && !data.p2Uid) {
      availableGame = data;
    }
  });

  if (availableGame) {
    // Join this game
    const game = availableGame as GameSession;
    await joinMultiplayerRoom(game.gameId, uid, displayName);
    return { gameId: game.gameId };
  }

  // Otherwise, create a new waiting room
  const newGameId = await createMultiplayerRoom(uid, displayName, gameType);
  return { gameId: newGameId };
}

// Send Friend Game Invitation
export async function sendGameInvite(
  senderUid: string, 
  senderName: string, 
  receiverUid: string, 
  receiverName: string, 
  gameType: GameType
): Promise<{ gameId: string; inviteId: string }> {
  // First create a waiting room
  const gameId = await createMultiplayerRoom(senderUid, senderName, gameType);

  const invitesRef = collection(db, 'invitations');
  const newInviteDoc = await addDoc(invitesRef, {
    senderUid,
    senderName,
    receiverUid,
    receiverName,
    gameType,
    status: 'pending',
    gameId,
    createdAt: Date.now()
  });

  return { gameId, inviteId: newInviteDoc.id };
}

// Cancel Game Invitation (by sender)
export async function cancelGameInvite(inviteId: string) {
  try {
    const inviteRef = doc(db, 'invitations', inviteId);
    await updateDoc(inviteRef, { status: 'declined' });
  } catch (err) {
    console.warn('Error cancelling invite:', err);
  }
}

// Listen to an outgoing invite (by sender)
export function listenToOutgoingInvite(
  inviteId: string,
  callback: (invite: GameInvitation | null) => void
): Unsubscribe {
  const inviteRef = doc(db, 'invitations', inviteId);
  return onSnapshot(
    inviteRef,
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...snap.data() } as GameInvitation);
      } else {
        callback(null);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, `invitations/${inviteId}`);
    }
  );
}

// Listen to incoming game invitations
export function listenToIncomingInvites(
  userUid: string, 
  callback: (invites: GameInvitation[]) => void
): Unsubscribe {
  if (!userUid || userUid.startsWith('guest_') || userUid === 'guest_user') {
    return () => {};
  }
  const invitesRef = collection(db, 'invitations');
  const q = query(
    invitesRef, 
    where('receiverUid', '==', userUid), 
    where('status', '==', 'pending')
  );

  return onSnapshot(
    q, 
    (snap) => {
      const invites: GameInvitation[] = [];
      const now = Date.now();
      snap.forEach((docSnap) => {
        const data = docSnap.data() as GameInvitation;
        // Ignore invites older than 60 seconds
        if (!data.createdAt || now - data.createdAt <= 60000) {
          invites.push({ id: docSnap.id, ...data });
        }
      });
      callback(invites);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'invitations');
    }
  );
}

// Respond to Invitation
export async function respondToInvite(
  inviteId: string, 
  accept: boolean, 
  receiverUid: string, 
  receiverName: string
) {
  const inviteRef = doc(db, 'invitations', inviteId);
  const snap = await getDoc(inviteRef);
  if (!snap.exists()) return;

  const data = snap.data() as GameInvitation;

  if (accept && data.gameId) {
    await updateDoc(inviteRef, { status: 'accepted' });
    await joinMultiplayerRoom(data.gameId, receiverUid, receiverName);
  } else {
    await updateDoc(inviteRef, { status: 'declined' });
  }
}
