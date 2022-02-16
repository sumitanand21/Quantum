import { CreationHistory } from '../../state.models/accounts/creationHistory.interface';
import { AccountActionTypes, AccountListActionTypes } from '../../actions/Creation-History-List.action';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface initialAccountState extends EntityState<CreationHistory> {
    count : any;
    OdatanextLink : any;
 }
 export const adapter : EntityAdapter<CreationHistory> = createEntityAdapter<CreationHistory>()
 export const initialState : initialAccountState = adapter.getInitialState({
    count : 0,
    OdatanextLink : ""
})

export function CreationHistoryreducer(state = initialState, action: AccountListActionTypes): initialAccountState {
    switch (action.type) {
        case AccountActionTypes.CreationHistoryList:
        ///this.state = action.payload.CreationHistoryModel;
      
        console.log('state of reducer',adapter.addMany(action.payload.CreationHistoryModel, { ...state, count : action.payload.count, OdatanextLink : action.payload.OdatanextLink}));
 
            return adapter.addMany(action.payload.CreationHistoryModel, { ...state, count : action.payload.count, OdatanextLink : action.payload.OdatanextLink})
                   default:
        // return adapter.updateOne(actions.p.syndas,data)
            return state;

        case AccountActionTypes.ActiveRequestsClear:
         return initialState;

        case AccountActionTypes.ActiveRequestsUpdate:
         return adapter.updateOne(action.payload.updateActiveRequestDetais,state)
    }
}