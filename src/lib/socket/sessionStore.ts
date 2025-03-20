import { getRandomId } from '@/lib/utils/getRandomId';

type SessionKey = string; // authkey:username
type PlayerId = string; // unique player id
const sessionStore: Record<SessionKey, PlayerId> = {};

const getSessionKey = (authKey: string, username: string | undefined) =>
   [authKey, username].join(':');

/** get playerId if auth:user combo exists, otherwise create one
 * @param authKey unique client identifier
 * @param username client-provided username
 *
 * note username will be blank at first - creating one
 * and calling getSession again will upgrade, while
 * calling a 3rd time with a different username will
 * create a second entry.
 *
 * @example getSession('uniqueKey', '') => {'uniqueKey:': 'pId-1'}
 * @example getSession('uniqueKey', 'user1') => {'uniqueKey:user1': 'pId-1'}
 * @example getSession('uniqueKey', 'user2') => {
 *    'uniqueKey:user1', 'pId-1',
 *    'uniqueKey:user2', 'pId-2',
 * }
 */
const getSession = (authKey: string, username = '') => {
   const sessionKey = getSessionKey(authKey, username);
   const blankKey = getSessionKey(authKey, undefined);

   const playerId =
      sessionKey in sessionStore
         ? sessionStore[sessionKey]
         : blankKey in sessionStore
         ? sessionStore[blankKey]
         : getRandomId();

   delete sessionStore[blankKey];
   sessionStore[sessionKey] = playerId;

   return playerId;
};

const deleteSession = (authKey: string, username: string) => {
   const sessionKey = getSessionKey(authKey, username);
   delete sessionStore[sessionKey];
};

export const sessions = {
   get: getSession,
   delete: deleteSession,
};
