import { createSelector } from "@ngrx/store";

export const DealOverviewList = state => state.dealoverview;

export const Dealoverview = createSelector(
    DealOverviewList,
     List => List   
);