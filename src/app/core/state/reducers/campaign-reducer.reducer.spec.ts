import { campaignReducer, initialState } from './campaign-reducer.reducer';

describe('CampaignReducer Reducer', () => {
  describe('an unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = campaignReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
});
