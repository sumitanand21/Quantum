import { CreateLead } from '../state.models/lead-create.interface'
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { LeadActions, LeadActionTypes } from '../actions/leads.action'

export const adapter: EntityAdapter<CreateLead> =
    createEntityAdapter<CreateLead>();


export interface LeadState extends EntityState<CreateLead> {

    LeadCreated: boolean;

}

export const initialLeadState: LeadState = adapter.getInitialState({
    LeadCreated: false
});


export function LeadReducer(state = initialLeadState, action: LeadActions): LeadState {

    switch (action.type) {
        case LeadActionTypes.LeadEdit:
            return adapter.updateOne(action.payload.Lead, state);
        case LeadActionTypes.LeadSave:
            return adapter.addOne(action.payload.Lead, state)
        default: {
            return state;
        }
    }
}


export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal,
    

} = adapter.getSelectors();
