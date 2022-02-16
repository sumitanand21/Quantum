import { createSelector } from "@ngrx/store";

export const DealParameterList = state => state.dealparameter;

export const DealParameter = createSelector(
    DealParameterList,
     List => List   
);