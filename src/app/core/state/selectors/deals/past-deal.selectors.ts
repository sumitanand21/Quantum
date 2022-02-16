import { createSelector } from "@ngrx/store";

export const PastDealData = state => state.PastDeal;

export const PastDataList = createSelector(
  PastDealData,
  pastdealsdata => pastdealsdata
);
