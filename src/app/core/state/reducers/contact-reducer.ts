import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { All_Contact_Collection } from "../state.models/contact-create.interface";
import { ContactActionTypes, ContactActions } from "../actions/contact.action";
export interface Contact_State extends EntityState<All_Contact_Collection> {
    count: any
    OdatanextLink: any
}

export const adapter: EntityAdapter<All_Contact_Collection> = createEntityAdapter<All_Contact_Collection>()

export const InitialState: Contact_State = adapter.getInitialState({
    count: 0,
    OdatanextLink: ""
}
)

export function ContactReducer(state = InitialState, action: ContactActions): Contact_State {
    switch (action.type) {
        case ContactActionTypes.LoadAllContacts:
            return adapter.addMany(action.payload.AllContacts,
                { ...state, count: action.payload.count, OdatanextLink: action.payload.nextlink }
             );
        case ContactActionTypes.CreateCustomerContact:
            return adapter.addOne(action.payload.AllContacts, state);

        case ContactActionTypes.UpdatedCustomerContact:
            return adapter.updateOne(action.payload.AllContacts, state);

        case ContactActionTypes.updateContactList:
            return adapter.updateOne(action.payload.UpdateContactlist, state);

        case ContactActionTypes.ClearContactList:
            return adapter.removeAll(state);

        case  ContactActionTypes.ClearRelationshipLog:
            return adapter.removeAll(state)

            

        default: {
            return state
        }
    }
}