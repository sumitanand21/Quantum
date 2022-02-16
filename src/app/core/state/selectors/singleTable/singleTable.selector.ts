import { createFeatureSelector, createSelector } from "@ngrx/store";
// import { ActionConvState } from "../reducers/action-list.reducer";
import { SingleTableState } from "../../reducers/singleTable/singleTable.reducer";

export const getSingletableData = createFeatureSelector<SingleTableState>("Singletable");

export const selectTableHeadById = (id)=> createSelector (
    getSingletableData,
  res=> res.entities[id]
)

export const selectAllTableHead = createSelector (
    getSingletableData,
  res=> res
)