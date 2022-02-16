import { Action } from '@ngrx/store';
import { ModificationActiveList } from '@app/core/state/state.models/accounts/modificationActiveList.interface';
import {Update} from '@ngrx/entity';

export enum ModificationActiveTypes{
    modificationActiveList='[MODIFICATIONACTIVE]List',
    modificationActiveRequestsUpdate = '[ACTIVEREQUESTS]UPDATE',
    modificationActiveRequestsClear = '[MODIFICATIONACTIVEREQUESTS]CLEAR',
}

type UpdateModificationActiveRequestBody={
    id:any,
    changes:ModificationActiveList
  }

export class ModificationActiveActions implements Action{
    readonly type = ModificationActiveTypes.modificationActiveList;

    constructor(public payload:{ModificationActiveModel :ModificationActiveList[] ,count:any,OdatanextLink:any}){
        console.log('in action->',payload.ModificationActiveModel);
    }
}

export class ModificationActiveRequestsupdate implements Action {
    readonly type = ModificationActiveTypes.modificationActiveRequestsUpdate;
    constructor(public payload: {updateModificationActiveRequestDetails: Update<UpdateModificationActiveRequestBody>} ) { }
}
export class ModificationActiveRequestsClear implements Action {
    readonly type =  ModificationActiveTypes.modificationActiveRequestsClear;
    constructor(public payload: { ModificationActiveModel: {} }) { }
}


export type modificationActiveActionsType = ModificationActiveActions | ModificationActiveRequestsupdate | ModificationActiveRequestsClear;