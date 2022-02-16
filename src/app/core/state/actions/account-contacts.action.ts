import { AccountContactsInterface } from './../state.models/accounts/accountContacts.interface';
import { Action } from '@ngrx/store';

export enum AccountContactsTypes{
    accountContactsList='[ACCOUNTCONTACTS]List'
}

export class AccountContactsAction implements Action{
    readonly type = AccountContactsTypes.accountContactsList;

    constructor(public payload:{AccountContactsListModel :AccountContactsInterface[] ,count:any,OdatanextLink:any}){
        
    }
}

export type AccountContactsActionType = AccountContactsAction;