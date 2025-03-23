export const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? '';

if (socketUrl === '') console.warn('Socket URL was not found.');
