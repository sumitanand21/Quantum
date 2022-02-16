import { createSelector } from "@ngrx/store";

export const uploadrlsDeals = state => state.UploadRLS

export const uploadrlsList = createSelector(
    uploadrlsDeals,
    uploadRLSList => uploadRLSList 
);