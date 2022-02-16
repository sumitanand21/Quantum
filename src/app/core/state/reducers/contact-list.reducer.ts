import { ContactListModel } from "../state.models/contact-list.interface";
import { ContactListActionTypes, ContactListActions } from "../actions/contact-list.action";
import { EntityAdapter, createEntityAdapter, EntityState } from "@ngrx/entity";


export interface ContactList_State extends EntityState<ContactListModel> {
    count: any
    OdatanextLink: any
}

export const adapter: EntityAdapter<ContactListModel> = createEntityAdapter<ContactListModel>()

export const InitialState: ContactList_State = adapter.getInitialState({
    count: 0,
    OdatanextLink:""
})

export function ContactReducer(state = InitialState, action: ContactListActions): ContactList_State {
    switch (action.type) {
        case ContactListActionTypes.ContactList:
            return adapter.addMany(action.payload.contactlistmodel, { ...state, count: action.payload.count, OdatanextLink: action.payload.OdatanextLink })
        default: {
            return state
        }
    }
}