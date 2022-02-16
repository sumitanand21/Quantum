import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { LeadsListActions, LeadsActionTypes } from "../actions/lead-list.action"
import { UnqualifiedLeads } from "@app/core/state/state.models/Lead/unqualifiedLeads.interface";
export interface UnqualifiedLead_State extends EntityState<UnqualifiedLeads> {
    count: any
    OdatanextLink: any
}

export const adapter: EntityAdapter<UnqualifiedLeads> = createEntityAdapter<UnqualifiedLeads>()

export const InitialState: UnqualifiedLead_State = adapter.getInitialState({
    count: 0,
    OdatanextLink: ""
}
)

export function UnqualifiedReducer(state = InitialState, action: LeadsListActions): UnqualifiedLead_State {
    switch (action.type) {
        case LeadsActionTypes.LoadUnqualifiedList:
            return adapter.addMany(action.payload.CreateUnqualifiedLead, { ...state, count: action.payload.count, OdatanextLink: action.payload.OdatanextLink })
        default: {
            return state
        }
    }
}