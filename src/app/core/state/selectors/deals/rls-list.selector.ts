import { createSelector } from "@ngrx/store";

export const RLSList = state => state.RLSList;

export const RLSListData = createSelector(
    RLSList,
    rlslistdata => rlslistdata   
);