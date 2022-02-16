import { createFeatureSelector, createSelector } from "@ngrx/store";

export const HomeData = state => state.HomeList;

export const selecthomeData = createSelector (
    HomeData,
    res=>res
)
   
