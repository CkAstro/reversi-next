import mongoose from 'mongoose';
import type { Reversi } from '@/types/reversi';

export interface SavedGame {
   gameId: string;
   moveHistory: number[];
   finalState: number[];
   playerA: string;
   playerB: string;
   firstTurn: Reversi['PlayerRole'];
   winner: Reversi['PlayerRole'];
   score: [number, number];
   startTime: number;
   endTime: number;
}

const reversiGameSchema = new mongoose.Schema<SavedGame>({
   gameId: String,
   moveHistory: Array,
   finalState: Array,
   playerA: String,
   playerB: String,
   firstTurn: Number,
   winner: Number,
   score: Array,
   startTime: Number,
   endTime: Number,
});

export const ReversiGame = mongoose.model('ReversiGame', reversiGameSchema);
