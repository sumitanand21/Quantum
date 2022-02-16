import { createSelector } from "@ngrx/store";

export const dealCoOwners = state => state.dealCoOwners;

export const selectdealCoOwners = createSelector(
  dealCoOwners,
  dealCoOwners => dealCoOwners
);
