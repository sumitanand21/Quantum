import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { ContactDetailsCollection } from "../../state.models/contact-create.interface";
import { ContactActions, ContactActionTypes } from "../../actions/contact.action";



export interface ContactDetailsState extends EntityState<ContactDetailsCollection> {

}
export const adapter:EntityAdapter<ContactDetailsCollection>=createEntityAdapter<ContactDetailsCollection>()

export const InitialState:ContactDetailsState = adapter.getInitialState({

})

export function ContactDetailsReducer(state=InitialState,action:ContactActions) : ContactDetailsState {
    switch (action.type) {
        case ContactActionTypes.LoadContactDetails:
            return adapter.addOne(action.payload.contactDetails,state);
       case ContactActionTypes.UpdatedCustomerContactDetails:
            return adapter.updateOne(action.payload.contactdetailupdate,state) 
            case ContactActionTypes.ClearContactDetails:
                return adapter.removeMany(action.payload.ids,state)
                case ContactActionTypes.ClearContactsDataDetails: 
                return adapter.removeAll(state)
        default:{
            return state
        }
    }   
}