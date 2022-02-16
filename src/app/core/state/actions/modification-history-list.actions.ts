import { Action } from '@ngrx/store';
import { ModificationHistoryList } from '@app/core/state/state.models/accounts/modificationHistoryList.interface';

export enum ModificationHistoryTypes{
    modificationHistoryList='[MODIFICATIONHISTORY]List',
    modificationHistoryRequestsClear ='[MODIFICATIONHISTORYREQUESTS]CLEAR',
}

export class ModificationHistoryActions implements Action{
    readonly type = ModificationHistoryTypes.modificationHistoryList;

    constructor(public payload:{ModificationHistoryModel :ModificationHistoryList[] ,count:any,OdatanextLink:any}){
        console.log('in action->',payload.ModificationHistoryModel);
    }
} 
export class modificationHistoryRequestsClear implements Action {
    readonly type =  ModificationHistoryTypes.modificationHistoryRequestsClear;
    constructor(public payload: { ModificationHistoryModel: {} }) { }
}
export type modificationHistoryActionsType = ModificationHistoryActions | modificationHistoryRequestsClear;