import { EntityState,EntityAdapter, createEntityAdapter } from "../../../../../../node_modules/@ngrx/entity";
import { ModificationActiveList } from '@app/core/state/state.models/accounts/modificationActiveList.interface';
import { modificationActiveActionsType, ModificationActiveTypes } from "@app/core/state/actions/modification-active-list.actions";

export interface initialAccountState extends EntityState<ModificationActiveList>{
  count:number; 
  OdatanextLink:any;
}
export const adapter : EntityAdapter<ModificationActiveList> = createEntityAdapter<ModificationActiveList>()

export const initialModificationActiveState : initialAccountState = adapter.getInitialState({
 count : 0,
 OdatanextLink : "",

}) 

export function ModificationActiveReducer(state=initialModificationActiveState,action :modificationActiveActionsType):initialAccountState
{
    switch(action.type){
        case ModificationActiveTypes.modificationActiveList:
            console.log('in reducer',action.payload.ModificationActiveModel);
            return adapter.addMany(action.payload.ModificationActiveModel,{...state,count:action.payload.count,OdatanextLink:action.payload.OdatanextLink})
        
        case ModificationActiveTypes.modificationActiveRequestsClear:
            return initialModificationActiveState;
        // case ModificationActiveTypes.modificationActiveRequestsUpdate:
        //  return adapter.updateOne(action.payload.updateModificationActiveRequestDetails,state)
        default :
        return state;

    }
}