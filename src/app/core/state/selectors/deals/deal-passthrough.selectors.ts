import { createSelector } from "@ngrx/store";

export const PassList = state => state.PassList;

export const PassListData = createSelector(
    PassList,
    passlistdata => passlistdata   
);