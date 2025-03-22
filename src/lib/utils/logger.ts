/**Log arguments in console with date timestamp */
export const logger = (...args: unknown[]): void =>
   console.log(`${Date().split('(')[0].trim()}:`, ...args);
