
import {createFeatureSelector, createSelector} from '@ngrx/store';
import * as fromModule from '../../reducers/deals/deal-module.reducers';
import { ModulesState } from '../../reducers/deals/deal-module.reducers';

export const selectModulesState = createFeatureSelector<ModulesState>("modules");
export const selectAllModules = createSelector(
  selectModulesState,
  // fromModule.selectAll
  ModuleList=>ModuleList
);

// export const    allModulesLoaded = createSelector(
//   selectModulesState,
//    res => res
// );
