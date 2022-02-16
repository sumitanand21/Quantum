import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AllConvState } from "../../reducers/conversation/all-conversation.reducer";

export const AllConversation = createFeatureSelector<AllConvState>("allConversation");

export const selectAllConv = createSelector (
    AllConversation,
    res=>res
)
   
