interface ActiveGameProps {
   gameId: string;
   playerA: string;
   playerB: string | null;
   observerCount: number;
}

export default function ActiveGame({
   // gameId,
   playerA,
   playerB,
}: // observerCount,
ActiveGameProps) {
   return (
      <div className="p-4 w-30 h-30 flex flex-col items-center justify-center bg-slate-600">
         <span className="truncate">{playerA}</span>
         <span>{playerB === null ? 'Waiting' : 'vs'}</span>
         {playerB !== null && <span className="truncate">{playerB}</span>}
      </div>
   );
}
