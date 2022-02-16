import { createFeatureSelector, createSelector } from "../../../../../../node_modules/@ngrx/store";
import {  initialAccountState } from "@app/core/state/reducers/account/reserveAccountList.reducer";

export const reserveRequestState = createFeatureSelector<initialAccountState>('ReserveRequest');

export const ReserveRequestState = createSelector(
    reserveRequestState,
    res=>res
)