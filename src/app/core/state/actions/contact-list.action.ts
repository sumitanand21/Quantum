import { Action } from '@ngrx/store';
import { ContactListModel } from '../state.models/contact-list.interface';

export enum ContactListActionTypes {
    ContactList = '[Contact] Contact List',

}

export class CreateContactLists implements Action {
    readonly type = ContactListActionTypes.ContactList;
    constructor(public payload:{contactlistmodel:ContactListModel[],count:any, OdatanextLink: any}) { 
        console.log(payload)
    }
}


export type ContactListActions = CreateContactLists