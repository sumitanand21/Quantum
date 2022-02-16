import { Conversation } from '@app/core/models/conversation.model';
import { ConversationActions, ConversationActionTypes } from '../actions/conversation.actions';
import { ConversationState } from '../state.models/conversation.interface';



export const initialConversationState:ConversationState  = {

    Tablelist:{
        MyConversation:{
            count:0,
            data:[],
            nextlink:""
        },
        AllConversation:{
            count:0,
            data:[],
            nextlink:""
        },
        ArchivedConversation:{
            count:0,
            data:[],
            nextlink:""
        },

    }

    
};

export function Converastionreducer(state=initialConversationState, action: ConversationActions): ConversationState {
    switch (action.type) {

        case ConversationActionTypes.Create:
        return {
            ...state,
            Tablelist:{
                ...state.Tablelist,
                AllConversation:action.payload.CreateConv
            }
        }
        case ConversationActionTypes.UpdateAllConv:
        return {
            ...state,
            Tablelist:{
                ...state.Tablelist,
                AllConversation:action.payload.AllConv
            }
        }

        default:
            return state;
    }
}


