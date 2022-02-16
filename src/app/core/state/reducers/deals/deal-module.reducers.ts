import { Module } from '@app/core/models/module.model';
import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import { DealsActionTypes, DealsActions } from '../../actions/deals.actions';

export interface ModulesState  {
  ModuleList:any;
}
export interface RLSModuleDropdown  {
  RLSModuleDropdownList:any;
}
// export const adapter : EntityAdapter<any> =
//   createEntityAdapter<any>();


// export const initialModulesState: ModulesState = adapter.getInitialState({
//     allModulesLoaded: false
//     ModuleList:undefined
// });
export const initialModulesState: ModulesState = {ModuleList:undefined}
export const RLSModulesDropdown: RLSModuleDropdown = {RLSModuleDropdownList:undefined}
export function modulesReducer(state = initialModulesState , action: DealsActions): ModulesState {
  switch(action.type) {
     case DealsActionTypes.ModuleListAction:
       console.log('payload module list-->', action.payload.ModuleList)
     //  return adapter.addMany(action.payload.ModuleList, {...state, allModulesLoaded:true});
        return {
          ModuleList:action.payload.ModuleList
        }
    default: {
      return state;
    }
  }
}
// export const {
//   selectAll,
//   selectEntities,
//   selectIds,
//   selectTotal

// } = adapter.getSelectors();








