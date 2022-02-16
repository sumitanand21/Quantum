import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { MyOpenLeadsCollection } from "@app/core/state/state.models/Lead/myopenleads.interface";
import { LeadActions, LeadActionTypes } from "@app/core/state/actions/leads.action";
import { OpenLeadsCollection } from "@app/core/state/state.models/Lead/openleads.interface";


export interface OpenLeadListState extends EntityState<OpenLeadsCollection> {
    count: number,
    nextlink: string
}

export const adapter: EntityAdapter<OpenLeadsCollection> = createEntityAdapter<OpenLeadsCollection>({

})

export const InitialState: OpenLeadListState = adapter.getInitialState({
    count: 0,
    nextlink: ""
})

export function OpenLeadsListReducer(state = InitialState, action: LeadActions): OpenLeadListState {
    switch (action.type) {
        case LeadActionTypes.LoadOpenLeadList:
            return adapter.addMany(action.payload.openLeadList.listdata,
                { ...state, count: action.payload.openLeadList.count, nextlink: action.payload.openLeadList.nextlink }
            )
        case LeadActionTypes.updateNurtureLeads:
            return adapter.updateMany(action.payload.updateurture, state)
        case LeadActionTypes.updateQualifyLeads:
            return adapter.updateMany(action.payload.updatequalify, state)
        case LeadActionTypes.updateQualifyLeads:
            return adapter.updateMany(action.payload.updatequalify, state)
        case LeadActionTypes.clearOpenLeadState:
            return adapter.removeAll(state)
        case LeadActionTypes.LeadAccepted:
            return adapter.updateOne(action.payload.updateLeadAccept, state)
        case LeadActionTypes.updateLeadDetails:
        return adapter.updateOne(action.payload.updateleadDetais,state)
        case LeadActionTypes.LinkedLeadActivityAdded:
            return adapter.updateOne(action.payload.LinkedLeadActivity, state)
        default: {
            return state
        }
    }
}

