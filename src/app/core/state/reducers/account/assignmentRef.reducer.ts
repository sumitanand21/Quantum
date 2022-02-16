import { AssignmentRefCreationHistory } from '../../state.models/accounts/assigmentRefHistory.interface';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { AssignmentRefListActionTypes, AssignmentRefActionTypes } from '../../actions/assignmentRef.action';

export interface initialAccountState extends EntityState<AssignmentRefCreationHistory> {
    count : any;
    OdatanextLink : any;
 }
 export const adapter : EntityAdapter<AssignmentRefCreationHistory> = createEntityAdapter<AssignmentRefCreationHistory>()
 export const initialState : initialAccountState = adapter.getInitialState({
    count : 0,
    OdatanextLink : ""
})

export function AssignmentRefreducer(state = initialState, action: AssignmentRefListActionTypes): initialAccountState {
    console.log('action type',action.type)
    // debugger;
    console.log('case',AssignmentRefActionTypes.AssignmentRefHistoryList);
    switch (action.type) {
        case AssignmentRefActionTypes.AssignmentRefHistoryList:
        ///this.state = action.payload.CreationHistoryModel;
      
        console.log('state of reducer',adapter.addMany(action.payload.AssignmentCreationHistoryModel, { ...state, count : action.payload.count, OdatanextLink : action.payload.OdatanextLink}));
 
            return adapter.addMany(action.payload.AssignmentCreationHistoryModel, { ...state, count : action.payload.count, OdatanextLink : action.payload.OdatanextLink})
                   default:
        // return adapter.updateOne(actions.p.syndas,data)
            return state;

        case AssignmentRefActionTypes.AssignmentRefHistoryRequestsClear:
         return initialState;
    }
}