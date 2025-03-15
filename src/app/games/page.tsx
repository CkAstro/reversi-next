import Lobby from '@/app/games/Lobby';

export default function Page() {
   return (
      <div className="w-full h-full bg-gray-900 flex gap-2 justify-center overflow-x-scroll p-2">
         <Lobby />
      </div>
   );
}
