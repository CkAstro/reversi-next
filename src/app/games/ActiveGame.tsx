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
   observerCount,
   onClick,
}: ActiveGameProps) {
   const className =
      'bg-gray-700 rounded-xl p-4 text-center text-gray-100 shadow-md hover:bg-gray-600 transition flex flex-col w-full aspect-square justify-center relative';
   if (gameId === null)
      return (
         <div
            className={className}
            onClick={() => onClick(gameId as unknown as string)}
         >
            <span className="text-gray-400 font-black">New</span>
            <span className="text-gray-400 font-black">Game</span>
         </div>
      );
   return (
      <div className={[className].join(' ')} onClick={() => onClick(gameId)}>
         <span className="truncate text-md text-gray-400 font-black">
            {playerA}
         </span>
         {playerB === null && (
            <span className="text-xs text-gray-500">Waiting</span>
         )}
         {playerB !== null && <span className="text-xs text-gray-500">vs</span>}
         {playerB !== null && (
            <span className="truncate text-md text-gray-400 font-black">
               {playerB}
            </span>
         )}
         {playerB !== null && (
            <span className="text-xs text-gray-500 flex gap-2 absolute bottom-4 left-4">
               <svg
                  viewBox="0 0 10 10"
                  fill="none"
                  className="stroke-gray-500 w-4 h-4"
                  strokeWidth={1}
               >
                  <path d="M1 5Q5 9 9 5Q5 1 1 5z" />
                  <circle cx="5" cy="5" r="2" strokeWidth={0.5} />
               </svg>
               {observerCount}
            </span>
         )}
      </div>
   );
}
