import WebSocket from '@/app/games/WebSocket';

export default function Layout({ children }: { children: React.ReactNode }) {
   return (
      <>
         <WebSocket />
         {children}
      </>
   );
}
