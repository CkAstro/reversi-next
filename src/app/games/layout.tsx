import Sidebar from '@/ui/sidebar/sidebar';
import GameRouter from './GameRouter';

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <div className="w-full h-full overflow-x-scroll p-2 flex justify-center bg-gray-900">
         <div className="flex gap-2 flex-col md:flex-row w-full max-w-full sm:max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg">
            {children}
            <Sidebar />
            <GameRouter />
         </div>
      </div>
   );
}
