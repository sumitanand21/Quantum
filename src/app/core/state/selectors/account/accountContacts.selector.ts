import { AccountContactsState } from './../../reducers/account/accountContacts.reducer';
import { createFeatureSelector, createSelector } from "../../../../../../node_modules/@ngrx/store";

export const accountContactsRequestState = createFeatureSelector<AccountContactsState>('AccountContactsRequest');

export const AccountContactsRequestState = createSelector(
    accountContactsRequestState,
    res=>res
)