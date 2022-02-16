import { Action } from '@ngrx/store';
import { All_Contact_Collection, ContactDetailsCollection } from '../state.models/contact-create.interface';
import { Update } from '@ngrx/entity';
import { RelationshipCollection } from '../state.models/ContactRelationship/relationship-detail';

export enum ContactActionTypes {
    LoadAllContacts = '[load All Contacts] LoadAllContacts',
    CreateCustomerContact = '[CreateContact] created',
    LoadContactDetails = '[Load Conatct Details] conatct details load',
    LoadMarketInfoDetails = '[Load Market Details] market details load',
    UpdatedCustomerContact = '[UpdatedContact] Updated',
    UpdatedCustomerContactDetails = '[UpdatedContactDetails] Update Details',
    UpdatedMarketInfoDetails = '[UpdatedMarketInfoDetails] Update market Details',
    // UpdatedMarketingInfo = '[UpdatedMarketInfo] Updated',
    updateContactList = '[Update Contact List] Update Contact List',
    ClearContactList = '[Clear Contact List] Clear Contact List',
    ClearContactDetails = '[Clear Cintact Details]',
    ClearRelationshipLog = '[Clear Relationship log count] Clear Relationship log count',
    ClearContactsDataDetails = '[ClearContactsDataDetails] Cleadr Contact data Details',
}

export enum RelationshipLogActionTypes {
    loadAllRelationshipCount = '[load All Relationship Count] All Relationship count',
    ClearRelationshipLog = "ClearRelationshipLog"
}

// ----------------------------------------------------All conv actions ----------------------------------------------------

type AllContactPOJO = {
    contacts: All_Contact_Collection[],
    count: number,
    nextlink: string
}
export class LoadAllContacts implements Action {
    readonly type = ContactActionTypes.LoadAllContacts;
    constructor(public payload: { AllContacts: All_Contact_Collection[], count: any, nextlink: any }) {
        console.log(payload)
    }
}


export class CreateContact implements Action {
    readonly type = ContactActionTypes.CreateCustomerContact;
    constructor(public payload: { AllContacts: All_Contact_Collection }) { }
}

// contact details by id dispatching (storing)
export class LoadContactDetailsById implements Action {               // state management for contact details 
    readonly type = ContactActionTypes.LoadContactDetails;
    constructor(public payload: { contactDetails: ContactDetailsCollection }) { }
}

export class UpdateContact implements Action {                   // this will update (edit) contact list
    readonly type = ContactActionTypes.UpdatedCustomerContact;
    constructor(public payload: { AllContacts: Update<All_Contact_Collection> }) { }

}

// market details by id dispatching (storing)
export class LoadMarketInfoDetailsById implements Action {               // state management for market details 
    readonly type = ContactActionTypes.LoadMarketInfoDetails;
    constructor(public payload: { marketDetails: ContactDetailsCollection }) { }
}

export class UpdateContactList implements Action {                   // this will update (edit) contact list
    readonly type = ContactActionTypes.updateContactList;
    constructor(public payload: { UpdateContactlist: Update<All_Contact_Collection> }) { }

}

export class ClearContactList implements Action {
    readonly type = ContactActionTypes.ClearContactList;
}


export class ClearContactsDataDetails implements Action {
    readonly type = ContactActionTypes.ClearContactsDataDetails
}


export class ClearRelationshipLogCount implements Action {
    readonly type = ContactActionTypes.ClearRelationshipLog;
}


export class ClearContactDetails implements Action {
    readonly type = ContactActionTypes.ClearContactDetails
    constructor (public payload:{ids:any[]}){}
   }


//-----------------------------------------------------------------Contact Details Actions --------------------------------------------------------

type UpdateContactDetailsPOJO  = {
    id:any,
    changes:any
}
//  this will update (edit) the contact details page
export class UpdateContactDetails implements Action {
    readonly type = ContactActionTypes.UpdatedCustomerContactDetails;
    constructor(public payload: { contactdetailupdate: Update<UpdateContactDetailsPOJO> }) { }

}

//-------------------------------Market Details Action----------------------
type UpdateMarketDetailsPOJO  = {
    id:any,
    changes:any
}
export class UpdateMarketDetails implements Action {
    readonly type = ContactActionTypes.UpdatedMarketInfoDetails;
    constructor(public payload: { marketdetailupdates: Update<UpdateMarketDetailsPOJO> }) { }

}

//------------------------------Relation ship Action --------------------------

export class LoadAllRelationshipCount implements Action {
    readonly type = RelationshipLogActionTypes.loadAllRelationshipCount;
    constructor(public payload: { AllRelationshiplogCount: RelationshipCollection }) {
        console.log("AllRelationshiplogCount",payload)
    }
}

export class ClearRelationshipCount implements Action { 
    readonly type = RelationshipLogActionTypes.ClearRelationshipLog;
}


export class DeleteContact implements Action { 
    readonly type = RelationshipLogActionTypes.ClearRelationshipLog;
}



export type ContactActions = LoadAllContacts | 
    CreateContact |
    LoadContactDetailsById |
    LoadMarketInfoDetailsById |
    UpdateContact |
    UpdateContactDetails |
    UpdateMarketDetails |
    UpdateContactList |
    ClearContactList |
    ClearRelationshipLogCount|
    LoadAllRelationshipCount | 
    ClearContactDetails|
    ClearRelationshipCount|
    ClearContactsDataDetails
