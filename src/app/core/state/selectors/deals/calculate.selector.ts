import { createSelector } from "@ngrx/store";

export const calculateDeals = state => state.Calculate

export const calculate = createSelector(
    calculateDeals,
    calculate => calculate 
);