import { createSelector, createFeatureSelector } from '@ngrx/store';
import { initialAccountState } from '@app/core/state/reducers/account/Create-HistoryList.reducer'


export const activeRequestState = createFeatureSelector<initialAccountState>('ActiveRequest'); //original selector name is ActiveRequest
export const ActiveRequestState = createSelector(
    activeRequestState,
    res => res
);