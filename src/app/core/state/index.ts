import {
    ActionReducer,
    ActionReducerMap,
    createFeatureSelector,
    createSelector,
    MetaReducer
  } from '@ngrx/store';
  import { environment } from '../../../environments/environment';

  
  
  export interface AppState {
  
  }
  
  export const AppStateReducers: ActionReducerMap<AppState> = {
  
  };
  
  
  export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [] : [];
  