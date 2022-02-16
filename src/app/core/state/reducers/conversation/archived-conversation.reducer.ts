import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

import { ConversationActions, ConversationActionTypes } from "../../actions/conversation.actions";
import { Archived_Conv_Collection } from "../../state.models/conversation/archived-conversation.interface";
// import { All_Conv_Collection } from "../../state.models/conversation/all-conversatio.interface";

export interface ArchivedConvState extends EntityState<Archived_Conv_Collection> {
count:number
nextlink:string
}

export const adapter:EntityAdapter<Archived_Conv_Collection>=createEntityAdapter<Archived_Conv_Collection>()

export const InitialState:ArchivedConvState = adapter.getInitialState({
    count:0,
    nextlink:""
})

export function ArchivedConversationReducer(state=InitialState,action:ConversationActions) : ArchivedConvState { 
    switch (action.type) {
        case ConversationActionTypes.LoadArchiveConv:
        return adapter.addMany(
            action.payload.archiveconv.archiveconv,
            {...state,count:action.payload.archiveconv.count,nextlink:action.payload.archiveconv.nextlink}
            )
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