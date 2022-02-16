import { createSelector } from "@ngrx/store";

export const selectDealTechSolution = state => state.DealTechSolution;

export const selectDealTechSolutionList = createSelector(
    selectDealTechSolution,
    DocumentList => DocumentList   
);