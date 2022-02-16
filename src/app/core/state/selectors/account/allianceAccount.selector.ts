import { createFeatureSelector, createSelector } from "../../../../../../node_modules/@ngrx/store";
import { initialAccountState } from "@app/core/state/reducers/account/allianceAccountList.reducer";

export const allianceRequestState = createFeatureSelector<initialAccountState>('AllianceRequest');

export const AllianceRequestState = createSelector(
    allianceRequestState,
    res=>res
)