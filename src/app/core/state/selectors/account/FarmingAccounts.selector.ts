import { initialAccountState } from './../../reducers/account/farmingAccountList.reducer';

    
import { createFeatureSelector, createSelector } from"../../../../../../node_modules/@ngrx/store";

export const famingRequestState= createFeatureSelector<initialAccountState>('FarmingRequest');

export const farmingRequestState = createSelector(
  famingRequestState,
  res=>res
)



