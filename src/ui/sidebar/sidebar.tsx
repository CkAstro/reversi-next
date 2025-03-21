import History from '@/ui/sidebar/history';
import Login from '@/ui/sidebar/login';

export default function Sidebar() {
   return (
      <div className="w-100 flex flex-col gap-2">
         <Login />
         <History />
      </div>
   );
}
