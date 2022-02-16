import { createSelector, createFeatureSelector } from '@ngrx/store';
import { initialAccountState } from '../../reducers/account/modificationHistoryList.reducer';


export const modificationHistoryRequestState = createFeatureSelector<initialAccountState>('modificationHistoryRequest'); 
export const ModificationHistoryRequestState = createSelector(
    modificationHistoryRequestState, 
    res => res
); 