import { createFeatureSelector, createSelector } from "@ngrx/store";
import { MyConvState } from "../../reducers/conversation/my-conversation.reducer";


export const MyConversation = createFeatureSelector<MyConvState>("myConversation");

export const selectAllMyConv = createSelector(
    MyConversation,
    res=> res
  );
   
