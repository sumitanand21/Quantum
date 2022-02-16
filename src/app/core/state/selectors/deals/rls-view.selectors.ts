import { createSelector } from "@ngrx/store";

export const RLSviewData = state => state.RLSView;

export const RLSviewDataList = createSelector(
    RLSviewData,
    rlsviewdata => rlsviewdata   
);