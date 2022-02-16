import { createSelector, createFeatureSelector } from '@ngrx/store';
import { initialAccountState } from '@app/core/state/reducers/account/Create-HistoryList.reducer'



export const creationHistoryState = createFeatureSelector<initialAccountState>('CreationHistory');
export const CreationHistoryState = createSelector(
    creationHistoryState,
    res => res
);