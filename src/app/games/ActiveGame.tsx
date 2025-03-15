interface ActiveGameProps {
   gameId: string | null;
   playerA: string;
   playerB: string | null;
   observerCount: number;
   onClick: (gameId: string) => void;
}

export default function ActiveGame({
   gameId,
   playerA,
   playerB,
   // observerCount,
   onClick,
}: ActiveGameProps) {
   const className =
      'p-4 w-30 h-30 flex flex-col items-center justify-center bg-slate-600';
   if (gameId === null)
      return (
         <div
            className={className}
            onClick={() => onClick(gameId as unknown as string)}
         >
            <span>New</span>
            <span>Game</span>
         </div>
      );
   return (
      <div className={className} onClick={() => onClick(gameId)}>
         <span className="truncate">{playerA}</span>
         <span>{playerB === null ? 'Waiting' : 'vs'}</span>
         {playerB !== null && <span className="truncate">{playerB}</span>}
      </div>
   );
}
