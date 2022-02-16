import { createFeatureSelector, createSelector } from "@ngrx/store";
import * as fromArchived from '../../reducers/conversation/archived-conversation.reducer';
import { ArchivedConvState } from "../../reducers/conversation/archived-conversation.reducer";

export const ArchivedConversation = createFeatureSelector<ArchivedConvState>("archivedConversation");

export const selectAllArchived = createSelector(
    ArchivedConversation,
    res=> res
  );
   
