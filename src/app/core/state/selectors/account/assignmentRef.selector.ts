import { createSelector, createFeatureSelector } from '@ngrx/store';
import { initialAccountState } from '../../reducers/account/assignmentRef.reducer';



export const creationHistoryState = createFeatureSelector<initialAccountState>('CreationHistoryAssignmentRef');
export const AssignmentRefHistoryState = createSelector(
    creationHistoryState,
    res => res
);