import { EntityState,EntityAdapter, createEntityAdapter } from "../../../../../../node_modules/@ngrx/entity";
import { ModificationHistoryList } from '@app/core/state/state.models/accounts/modificationHistoryList.interface';
import { modificationHistoryActionsType, ModificationHistoryTypes } from "@app/core/state/actions/modification-history-list.actions";

export interface initialAccountState extends EntityState<ModificationHistoryList>{
  count:number; 
  OdatanextLink:any;
}
export const adapter : EntityAdapter<ModificationHistoryList> = createEntityAdapter<ModificationHistoryList>()

export const initialModificationHistoryState : initialAccountState = adapter.getInitialState({
 count : 0,
 OdatanextLink : "",

}) 

export function ModificationHistoryReducer(state=initialModificationHistoryState,action :modificationHistoryActionsType):initialAccountState
{
    switch(action.type){
        case(ModificationHistoryTypes.modificationHistoryList):{
           // console.log('in reducer',action.payload.ModificationHistoryModel);
            return adapter.addMany(action.payload.ModificationHistoryModel,{...state,count:action.payload.count,OdatanextLink:action.payload.OdatanextLink,})
        }
        case ModificationHistoryTypes.modificationHistoryRequestsClear:
                return initialModificationHistoryState;
        default :
        return state;

    }
}