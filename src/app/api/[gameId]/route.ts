import { NextResponse } from 'next/server';
import { ReversiGame } from '@/lib/mongodb/reversiGame';

interface Params {
   params: {
      gameId: string;
   };
}

export async function GET(req: Request, { params }: Params) {
   const { gameId } = params;
   const game = await ReversiGame.findOne({ gameId });
   console.log('game', game);

   if (!game)
      return NextResponse.json({ error: 'Game not found.' }, { status: 404 });

   return NextResponse.json(game);
}
