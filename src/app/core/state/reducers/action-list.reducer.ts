import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { ActionListTypes, LoadActionConv } from "../actions/action-list.actions";
import { AllActionTablelist } from "../state.models/action-list.interface";

export interface ActionConvState extends EntityState<AllActionTablelist> {
    count: number,
    nextlink:string
}

export const adapter:EntityAdapter<AllActionTablelist>=createEntityAdapter<AllActionTablelist>()

export const InitialState:ActionConvState = adapter.getInitialState( {
    count: 0,
    nextlink:""
})

export function ActionReducer(state=InitialState, action:LoadActionConv) : ActionConvState {
    switch (action.type) {
        case ActionListTypes.LoadAction:
        return adapter.addMany(action.payload.ActionTableList.actionlist, {...state, count: action.payload.ActionTableList.count,nextlink:action.payload.ActionTableList.nextlink})
        default:{
            return state
        }
    }   
}