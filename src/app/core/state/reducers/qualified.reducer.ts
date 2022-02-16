import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

import { LeadsListActions, LeadsActionTypes } from "../actions/lead-list.action";
import { QualifiedLead } from "@app/core/state/state.models/Lead/qualifiedLeads.interface";
export interface QualifiedLead_State extends EntityState<QualifiedLead> {
    count: any
    OdatanextLink: any
}

export const adapter: EntityAdapter<QualifiedLead> = createEntityAdapter<QualifiedLead>()

export const InitialState: QualifiedLead_State = adapter.getInitialState({
    count: 0,
    OdatanextLink:""
})

export function QualifiedReducer(state = InitialState, action: LeadsListActions): QualifiedLead_State {
    switch (action.type) {
        case LeadsActionTypes.LoadQualifiedList:
            return adapter.addMany(action.payload.CreateQualifiedLead, { ...state, count: action.payload.count, OdatanextLink: action.payload.OdatanextLink })
        default: {
            return state
        }
    }
}