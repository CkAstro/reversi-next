import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, {
   TextEncoder,
   TextDecoder,
});

Object.assign(global.console, {
   warn: jest.fn(),
   error: jest.fn(),
});
