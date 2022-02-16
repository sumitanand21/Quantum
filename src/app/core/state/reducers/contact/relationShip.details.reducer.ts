import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { RelationshipCollection } from "../../state.models/ContactRelationship/relationship-detail";
import { ContactActions, RelationshipLogActionTypes } from "../../actions/contact.action";


export interface RelationshipLogDetailsState extends EntityState<RelationshipCollection> {
}

export const adapter:EntityAdapter<RelationshipCollection>=createEntityAdapter<RelationshipCollection>()

export const InitialState:RelationshipLogDetailsState = adapter.getInitialState({

})

export function RelationshipLogDetailsReducer(state=InitialState,action:ContactActions) : RelationshipLogDetailsState {
    switch (action.type) {
        case RelationshipLogActionTypes.loadAllRelationshipCount:
        console.log("ActionPay", action.payload.AllRelationshiplogCount)
       return adapter.addOne(action.payload.AllRelationshiplogCount,state);
       case RelationshipLogActionTypes.ClearRelationshipLog:
       return adapter.removeAll(state)
        default:{
            return state
        }
    }     
}
