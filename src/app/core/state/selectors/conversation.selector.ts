import {createSelector} from '@ngrx/store';


export const selectConversationState = state => state.conversation;


export const getConversationData = createSelector(
    selectConversationState,
  res => res.Tablelist.AllConversation.data
);


export const getConversationTableData = createSelector(
  selectConversationState,
res => res.Tablelist.AllConversation
);