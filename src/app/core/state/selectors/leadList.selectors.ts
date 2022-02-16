import { createSelector } from '@ngrx/store';


export const selectLeadState = state => state.Leads;


export const getConversationData = createSelector(
  selectLeadState,
  res => res.data
);


