import { createSelector } from "@ngrx/store";

export const selectTaggedDeals = state => state.TaggedDeals;

export const taggedDealsList = createSelector(
    selectTaggedDeals,
    DealList => DealList   
);