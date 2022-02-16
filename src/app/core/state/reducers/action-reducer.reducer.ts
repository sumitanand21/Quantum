import { ActionState }
    from '../state.models/action.interface'

import {
    createEntityAdapter,
    EntityAdapter, EntityState
}
    from '@ngrx/entity';

import {
    ActionCreate,
    ActionTypes
}
    from '../actions/actions.actions'



export const adapter: EntityAdapter<ActionState> = createEntityAdapter<ActionState>();


export interface ActionState1 extends EntityState<ActionState> {
    ActionCreated: boolean;
}

export const initialActionState: ActionState1 = adapter.getInitialState({

        ActionCreated: false

    });





export function
    LeadReducer(state =
        initialActionState,
        action: ActionCreate):
    ActionState1 {



    switch (action.type) {

        case ActionTypes.ActionEdit:

            return adapter.updateOne(action.payload.Action, state);

        case ActionTypes.ActionSave:

            return adapter.addOne(action.payload.Action,state)

        default: {

            return state;

        }

    }

}





export const {

    selectAll,

    selectEntities,

    selectIds,

    selectTotal



} = adapter.getSelectors();
