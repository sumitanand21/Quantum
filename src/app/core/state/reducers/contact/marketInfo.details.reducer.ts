import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { ContactDetailsCollection } from "../../state.models/contact-create.interface";
import { ContactActions, ContactActionTypes } from "../../actions/contact.action";



export interface MarketInfoDetailsState extends EntityState<ContactDetailsCollection> {

}
export const adapter:EntityAdapter<ContactDetailsCollection>=createEntityAdapter<ContactDetailsCollection>()

export const InitialState:MarketInfoDetailsState = adapter.getInitialState({

})

export function MarketInfoDetailsReducer(state=InitialState,action:ContactActions) : MarketInfoDetailsState {
    switch (action.type) {
        case ContactActionTypes.LoadMarketInfoDetails:
    //    return state
       return adapter.addOne(action.payload.marketDetails,state);
       case ContactActionTypes.UpdatedMarketInfoDetails:
       return adapter.updateOne(action.payload.marketdetailupdates,state)
       case ContactActionTypes.ClearContactDetails:
            return adapter.removeMany(action.payload.ids,state)
        default:{
            return state
        }
    }   
}