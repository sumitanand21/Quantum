import { Action } from '@ngrx/store';
import { Conversation } from '@app/core/models/conversation.model';
import { ConversastionSatemodel, ConversationState, TableConversation, All_Conv_Collection } from '../state.models/conversation.interface';
import { My_Conv_Collection } from '../state.models/conversation/my-conversation.interface';
import { Archived_Conv_Collection } from '../state.models/conversation/archived-conversation.interface';


export enum ConversationActionTypes {
    Create = '[CONVERSATION] Create',
    UpdateAllConv = '[CONVERSATION] Allconv',
    LoadAllConv = '[load All Conversation] all Conv',
    LoadMyConv = '[load My Conversation] my Conv',
    LoadArchiveConv = '[load Archive Conversation] archive Conv',
}

export class CreateCoversation implements Action {
    readonly type = ConversationActionTypes.Create;
    constructor(public payload:{CreateConv:TableConversation}) { 
        console.log(payload)
    }
}

export class UpdateAllCoversation implements Action {
    readonly type = ConversationActionTypes.UpdateAllConv;
    constructor(public payload:{AllConv:TableConversation}) { 
        console.log(payload)
    }
}

// ----------------------------------------------------All conv actions ----------------------------------------------------

type AllConvPOJO = {
    allconv:All_Conv_Collection[],
    count:number,
    nextlink:string
} 
export class LoadAllConv implements Action {
    readonly type = ConversationActionTypes.LoadAllConv;
    constructor(public payload:{allconv:AllConvPOJO}) { 
        console.log(payload)
    }
}

// -----------------------------------------------------My Conv Actions --------------------------------------------------------

type MyConvPOJO = {
    MyConv:My_Conv_Collection[],
    count:number,
    nextlink:string
}

export class LoadMyConv implements Action {
    readonly type  = ConversationActionTypes.LoadMyConv
    constructor (public payload:{myconv:MyConvPOJO}){
        console.log(payload)
    }
}

// ------------------------------------------------------Archived Conv Actions----------------------------------------------------


type ArchivedPOJO = {
    archiveconv:Archived_Conv_Collection[],
    count:number,
    nextlink:string
}
export class LoadArchiveConv implements Action{
    
    readonly type = ConversationActionTypes.LoadArchiveConv
    constructor(public payload:{archiveconv:ArchivedPOJO}){}
}


export type ConversationActions = CreateCoversation | UpdateAllCoversation | LoadAllConv | LoadArchiveConv | LoadMyConv
