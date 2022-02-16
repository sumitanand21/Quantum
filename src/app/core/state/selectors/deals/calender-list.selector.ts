import { createSelector } from "@ngrx/store";

export const calenderActionList = state => state.calenderActionList;

export const CalenderActionList = createSelector(
    calenderActionList,
     List => List   
);