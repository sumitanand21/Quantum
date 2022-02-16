import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ActionConvState } from "../reducers/action-list.reducer";

export const getActionListData = createFeatureSelector<ActionConvState>("actionList");

export const selectActionList = createSelector (
  getActionListData,
  res=> res
)