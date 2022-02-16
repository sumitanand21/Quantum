import { createSelector } from "@ngrx/store";

export const selectExistingDeals = state => state.ExistingDeals;

export const existingDealsList = createSelector(
     selectExistingDeals,
     ExistingDealList => ExistingDealList   
); 