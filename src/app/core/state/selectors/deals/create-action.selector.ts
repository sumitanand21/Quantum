import { createSelector } from "@ngrx/store";

export const createActionSelector = state => state.CreateAction;

export const CreateActionList = createSelector(
    createActionSelector,
     List => List   
);