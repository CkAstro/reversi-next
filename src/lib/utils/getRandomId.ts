/** a random 10-digit string */
export const getRandomId = (): string => {
   // for n as a multiple of 3, we get an 4n base64 number
   const charCodes = crypto.getRandomValues(new Uint8Array(12)); // 3n->4n, 12->16
   const base64 = btoa(String.fromCharCode(...charCodes));
   return base64.replace(/[^a-zA-Z0-9]/g, '').slice(0, 10); // remove +/ chars, clip
};
