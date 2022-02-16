import { createSelector, createFeatureSelector } from '@ngrx/store';
import { initialAccountState } from '@app/core/state/reducers/account/modificationActiveList.reducer'


export const modificationActiveRequestState = createFeatureSelector<initialAccountState>('modificationActiveRequest'); 
export const ModificationActiveRequestState = createSelector(
    modificationActiveRequestState, 
    res => res
);