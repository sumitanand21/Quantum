import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { ConversationActions, ConversationActionTypes } from "../../actions/conversation.actions";
import { All_Conv_Collection } from "../../state.models/conversation/all-conversation.interface";

export interface AllConvState extends EntityState<All_Conv_Collection> {
count:number,
nextlink:string
}

export const adapter:EntityAdapter<All_Conv_Collection>=createEntityAdapter<All_Conv_Collection>()

export const InitialState:AllConvState = adapter.getInitialState({
    count:0,
    nextlink:""
})

export function AllConversationReducer(state=InitialState,action:ConversationActions) : AllConvState {
    switch (action.type) {
        case ConversationActionTypes.LoadAllConv:
        return adapter.addMany(action.payload.allconv.allconv,
            {...state,count:action.payload.allconv.count,nextlink:action.payload.allconv.nextlink}
            )
        default:{
            return state
        }
    }   
}