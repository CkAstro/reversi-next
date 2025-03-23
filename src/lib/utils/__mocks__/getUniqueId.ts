const mockIds = [
   '43f080c6-6fc1-4ee3-bc18-236b885b88a1',
   '3ba76522-c8c7-4ff5-956a-6d504d748fb1',
   '108104f7-b9a5-435c-b9e0-db6bcfe2b973',
];

export const getUniqueId = jest.fn(() => mockIds.pop());
