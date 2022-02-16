import { Action } from '@ngrx/store';
import { InActivateContactmodel } from '../state.models/inActive-contact-list';

export enum inActivateContactActionTypes {

    LoadAllDeActivateContacts = '[load All InActivate Contacts] LoadAllDeActivateContacts',
    ClearDeActivateContactList = '[Clear DeActivateContact List] Clear DeActivate ContactList',

}


type AllDeActivateContactPOJO = {
    contactlist: InActivateContactmodel[],
    count: number,
    nextlink: string
}


export class LoadAllDeActivateContacts implements Action {
    debugger
    readonly type = inActivateContactActionTypes.LoadAllDeActivateContacts;
    constructor(public payload: { allInActivateContacts: AllDeActivateContactPOJO}) {
        console.log(payload)
    }
}

// Clear DeActivate contact
export class ClearDeActivateContactList implements Action {
    readonly type = inActivateContactActionTypes.ClearDeActivateContactList;
}


export type InActivateContactActions = 
      LoadAllDeActivateContacts |
        ClearDeActivateContactList
 
