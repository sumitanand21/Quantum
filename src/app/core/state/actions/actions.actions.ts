import { Action }
    from '@ngrx/store';

import { ActionState }
    from '../state.models/action.interface'

import { Update }
    from '@ngrx/entity';





export enum ActionTypes {

    ActionSave = '[Save Action] ActionSave',

    ActionEdit = '[Edit Action] ActionEdit'



}



export class ActionSaved implements Action {

    readonly type = ActionTypes.ActionSave;

    constructor(public payload: { Action: ActionState }) { }

}

export class ActionEdited implements Action {

    readonly type = ActionTypes.ActionEdit;

    constructor(public payload: { Action: Update<ActionState> }) { }

}









export type ActionCreate = ActionSaved | ActionEdited


