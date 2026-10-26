import type { UserId } from './user';
import type { ConversationId } from './message';

export type GameId = string;
export type GameSessionId = string;

export type GameType =
  | 'truth-or-dare'
  | 'this-or-that'
  | 'would-you-rather'
  | 'guess-my-answer'
  | 'how-well-do-you-know-me'
  | 'couple-trivia'
  | 'emoji-guessing'
  | 'word-association'
  | 'memory-match'
  | 'love-language-quiz'
  | 'daily-question'
  | 'draw-and-guess'
  | 'romantic-quiz'
  | 'story-builder'
  | 'bucket-list'
  | 'mini-puzzle';

export interface GameSession {
  id: GameSessionId;
  conversationId: ConversationId;
  gameType: GameType;
  participants: UserId[];
  currentTurn: UserId;
  state: GameState;
  scores: Record<UserId, number>;
  status: 'waiting' | 'active' | 'paused' | 'completed' | 'abandoned';
  createdAt: string;
  updatedAt: string;
}

export interface GameState {
  round: number;
  totalRounds: number;
  currentPrompt?: GamePrompt;
  history: GameTurn[];
}

export interface GamePrompt {
  id: string;
  text: string;
  category?: string;
  /** Some prompts are optional adult content. Always labeled and opt-in. */
  isSensitive: boolean;
}

export interface GameTurn {
  round: number;
  playerId: UserId;
  promptId: string;
  /** The player's answer – encrypted in transit same as a chat message. */
  answer?: string;
  timestamp: string;
}

export interface GameInvite {
  sessionId: GameSessionId;
  fromUserId: UserId;
  gameType: GameType;
  conversationId: ConversationId;
  expiresAt: string;
}
