'use client';

import { useEffect, useState } from 'react';
import { useSocket } from '@/app/games/useSocket';
import { Dropdown } from '@/ui/components/dropdown';
import type { ServerError } from '@/types/socket';

export default function Login() {
   const send = useSocket((s) => s.send);
   const subscribe = useSocket((s) => s.sub);
   const unsubscribe = useSocket((s) => s.unsub);

   const [errorMessage, setErrorMessage] = useState<string | null>(null);

   const handleSubmitUsername = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const username = formData.get('username');

      if (typeof username !== 'string') return;
      send('set:username', username);
   };

   const handleKeyDown = () => {
      if (errorMessage) setErrorMessage(null);
   };

   useEffect(() => {
      const handleError = (error: ServerError, message: string) => {
         if (error === 'INVALID_USERNAME') setErrorMessage(message);
      };

      subscribe('server:error', handleError);
      return () => {
         unsubscribe('server:error', handleError);
      };
   }, [subscribe, unsubscribe]);

   return (
      <div className="flex flex-col gap-2 bg-gray-800 rounded-xl p-2">
         <span>Welcome!</span>
         <form onSubmit={handleSubmitUsername} className="relative">
            <input
               className="bg-gray-700 rounded px-2 w-full"
               id="username"
               type="text"
               name="username"
               placeholder="choose a username.."
               pattern="[a-z0-9\s]+"
               minLength={4}
               maxLength={20}
               title="Numbers, letters, and spaces"
               required
               onKeyDown={handleKeyDown}
            />
            {errorMessage && (
               <div
                  id="username-error"
                  aria-live="polite"
                  aria-atomic="true"
                  className="absolute top-full left-0 right-0 mt-2 border-2 bg-gray-800 border-gray-700 rounded"
               >
                  <p className="px-2 py-1 text-sm text-red-500">
                     {errorMessage}
                  </p>
               </div>
            )}
         </form>
         <Dropdown
            options={[
               '--Previous Usernames--',
               'option 1',
               'option 2',
               'option 3',
            ]}
            onSelect={() => undefined}
         />
      </div>
   );
}
