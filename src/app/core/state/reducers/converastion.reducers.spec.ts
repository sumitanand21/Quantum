import { Converastionreducer, initialConversationState } from './conversation.reducers';

describe('ConvReducer Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = Converastionreducer(initialConversationState, action);

      expect(result).toBe(initialConversationState);
    });
  });
});
