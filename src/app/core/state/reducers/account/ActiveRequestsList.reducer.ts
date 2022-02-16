
import { AccountActionTypes, AccountListActionTypes } from "../../actions/Creation-History-List.action"
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CreationActiveRequests } from "../../state.models/accounts/ActiveRequests.interface";
import { State } from "@ngrx/store";
//import { adapter } from "../qualified.reducer";


export interface initialAccountState extends EntityState<CreationActiveRequests>{
    count : number;
    OdatanextLink: any;
}
export  const adapter : EntityAdapter<CreationActiveRequests> = createEntityAdapter<CreationActiveRequests>()
export  const initialState : initialAccountState  = adapter.getInitialState({
    count : 0,
    OdatanextLink : "" 
})

export function  ActiveRequestreducer(state = initialState, action : AccountListActionTypes ){

    switch(action.type)
    {   
        case  AccountActionTypes.ActiveRequestList :
           return adapter.addMany(action.payload.ActiveRequestModel, {...state, count : action.payload.count, OdatanextLink : action.payload.OdatanextLink })
        case AccountActionTypes.ActiveRequestsClear:
           return initialState;
        default :
        return state;
    } 
}