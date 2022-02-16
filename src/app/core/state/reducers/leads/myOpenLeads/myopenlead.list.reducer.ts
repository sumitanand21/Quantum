import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { MyOpenLeadsCollection } from "@app/core/state/state.models/Lead/myopenleads.interface";
import { LeadActions, LeadActionTypes } from "@app/core/state/actions/leads.action";


export interface MyOpenLeadListState extends EntityState<MyOpenLeadsCollection> {
    count: number,
    nextlink: string
}

export const adapter: EntityAdapter<MyOpenLeadsCollection> = createEntityAdapter<MyOpenLeadsCollection>({

})

export const InitialState: MyOpenLeadListState = adapter.getInitialState({
    count: 0,
    nextlink: ""
})

export function MyOpenLeadsListReducer(state = InitialState, action: LeadActions): MyOpenLeadListState {
    switch (action.type) {
        case LeadActionTypes.LoadMyOpenLeads:
            return adapter.addMany(action.payload.myOpenLeads.listdata,
                { ...state, count: action.payload.myOpenLeads.count, nextlink: action.payload.myOpenLeads.nextlink }
            )
        case LeadActionTypes.updateNurtureLeads:
            return adapter.updateMany(action.payload.updateurture, state)
        case LeadActionTypes.updateQualifyLeads:
            return adapter.updateMany(action.payload.updatequalify, state)
        case LeadActionTypes.disqualifyLeads:
            return adapter.removeMany(action.payload.ids,state)
        case LeadActionTypes.clearMyopenlead:
            return adapter.removeAll(state)
        case LeadActionTypes.LeadAccepted:
            return adapter.updateOne(action.payload.updateLeadAccept, state)
        case LeadActionTypes.updateQualifyLeads:
            return adapter.updateMany(action.payload.updatequalify, state)
            case LeadActionTypes.updateLeadDetails:
        return adapter.updateOne(action.payload.updateleadDetais,state)
        case LeadActionTypes.LinkedLeadActivityAdded:
            return adapter.updateOne(action.payload.LinkedLeadActivity, state)
        default: {
            return state
        }
    }
}

