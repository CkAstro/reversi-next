'use client';

import { useCallback, useEffect, useState } from 'react';
import { nameStore } from '@/store/nameStore';
import { Dropdown } from '@/ui/components/dropdown';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useOnMessage } from '@/hooks/useOnMessage';
import type { ResponsePayload } from '@/types/socket';

export default function Login() {
   const send = useSendMessage();

   const username = nameStore((s) => s.username);
   const usernameList = nameStore((s) => s.nameList);
   const setUsername = nameStore((s) => s.setUsername);

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

   const [selectedUser, setSelectedUser] = useState('');
   const [nameList, setNameList] = useState<string[]>([]);
   useEffect(() => {
      setSelectedUser(username);
   }, [username]);

   useEffect(() => {
      setNameList(usernameList);
   }, [usernameList]);

   const handleSelectUsername = (index: number) => {
      const name = usernameList[index];
      send('set:username', name);
      // setUsername(name);
   };

   useOnMessage('set:username', setUsername);

   const handleError: ResponsePayload['server:error'] = useCallback(
      (error, message) => {
         if (error === 'INVALID_USERNAME') setErrorMessage(message);
      },
      []
   );

   useOnMessage('server:error', handleError);

   return (
      <div className="flex flex-col gap-2 bg-gray-800 rounded-xl p-2">
         <span>
            {selectedUser === '' ? 'Welcome!' : `Welcome ${username}!`}
         </span>
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
            options={nameList}
            placeholder="--Previous Usernames--"
            onSelect={handleSelectUsername}
         />
      </div>
   );
}
