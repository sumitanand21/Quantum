import { createSelector } from "@ngrx/store";

export const DealCriteriaList = state => state.dealCriteria;

export const DealCriteria = createSelector(
    DealCriteriaList,
     List => List   
);