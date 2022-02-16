import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";


import { ArchivedLeads } from "@app/core/state/state.models/Lead/archivedLeads.interface";
// import { LeadsListActions, LeadsActionTypes } from "@app/core/state/actions/lead-list.action";
import { LeadActions, LeadActionTypes } from "@app/core/state/actions/leads.action";
export interface Archived_State extends EntityState<ArchivedLeads> {
    count: any
    OdatanextLink: any
}

export const adapter: EntityAdapter<ArchivedLeads> = createEntityAdapter<ArchivedLeads>()

export const InitialState: Archived_State = adapter.getInitialState({
    count: 0,
    OdatanextLink:""
})

export function ArchivedReducer(state = InitialState, action: LeadActions): Archived_State {
    switch (action.type) {
        case LeadActionTypes.LoadArchivedList:
            return adapter.addMany(action.payload.CreateArchivedLead, { ...state, count: action.payload.count, OdatanextLink: action.payload.OdatanextLink })
        case LeadActionTypes.archivedRestoreleads:
        return adapter.removeMany(action.payload.ids,state)
        case LeadActionTypes.clearArchivedLeadState:
        return adapter.removeAll(state)
            default: {
            return state
        }
    }
}