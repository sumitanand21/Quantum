import { Action } from '@ngrx/store';
import { AllActionTablelist, ActionTable, ActionTableList } from '../state.models/action-list.interface';


export enum ActionListTypes {
    LoadAction = '[Load Action list] LoadActionList'
}

type ActionObject = {
    actionlist?:AllActionTablelist[],
    count?:number,
    nextlink?:string
}
export class LoadActionConv implements Action {
    readonly type = ActionListTypes.LoadAction;
    constructor(public payload:{ActionTableList:ActionObject}) { 
        console.log(payload)
    }
}

export type UpdateActionList = LoadActionConv
