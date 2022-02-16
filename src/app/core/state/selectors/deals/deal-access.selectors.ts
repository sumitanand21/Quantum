import { createSelector } from "@ngrx/store";

export const DealAccessList = state => state.dealAccess;

export const DealAccess = createSelector(
    DealAccessList,
     List => List   
);