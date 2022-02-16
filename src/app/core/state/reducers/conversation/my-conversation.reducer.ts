import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
// import { All_Conv_Collection } from "../../state.models/conversation.interface";
import { ConversationActions, ConversationActionTypes } from "../../actions/conversation.actions";
import { My_Conv_Collection } from "../../state.models/conversation/my-conversation.interface";

export interface MyConvState extends EntityState<My_Conv_Collection> {
count:number,
nextlink:string
}

export const adapter:EntityAdapter<My_Conv_Collection>=createEntityAdapter<My_Conv_Collection>()

export const InitialState:MyConvState = adapter.getInitialState({
    count:0,
    nextlink:""
})

export function MyConversationReducer(state=InitialState,action:ConversationActions):MyConvState {
    switch (action.type) {
        case ConversationActionTypes.LoadMyConv:
        return adapter.addMany(action.payload.myconv.MyConv,
            {...state,count:action.payload.myconv.count,nextlink:action.payload.myconv.nextlink})
        default:{
            return state
        }
    }   
}

export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
  
  } = adapter.getSelectors();