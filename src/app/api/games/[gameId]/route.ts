import { NextResponse } from 'next/server';
import { ReversiGame } from '@/lib/mongodb/reversiGame';
import { connectToDatabase } from '@/lib/mongodb/mongoose';

interface Params {
   params: Promise<{
      gameId: string;
   }>;
}

export async function GET(req: Request, { params }: Params) {
   const { gameId } = await params;
   await connectToDatabase();
   console.log('looking for game', gameId);
   const game = await ReversiGame.findOne({ gameId })
      .select('finalState -_id')
      .lean();
   console.log('game', game);

   if (!game)
      return NextResponse.json({ error: 'Game not found.' }, { status: 404 });

   return NextResponse.json(game);
}
