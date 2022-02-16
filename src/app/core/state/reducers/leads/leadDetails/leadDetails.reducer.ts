import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { MyOpenLeadsCollection, LeadDetailsDataModel } from "@app/core/state/state.models/Lead/myopenleads.interface";
import { LeadActions, LeadActionTypes } from "@app/core/state/actions/leads.action";


export interface LeadDetailsState extends EntityState<LeadDetailsDataModel> {

}

export const adapter: EntityAdapter<LeadDetailsDataModel> = createEntityAdapter<LeadDetailsDataModel>({

})

export const InitialState: LeadDetailsState = adapter.getInitialState({

})

export function LeadDetailsReducer(state = InitialState, action: LeadActions): LeadDetailsState {
    switch (action.type) {
        case LeadActionTypes.LeadDetails:
            return adapter.addOne(action.payload.details, state)
        case LeadActionTypes.updateLeadDetails:
            return adapter.updateOne(action.payload.updateleadDetais, state)
        case LeadActionTypes.updateNurtureLeads:
            return adapter.updateMany(action.payload.updateurture, state)
        case LeadActionTypes.updateQualifyLeads:
            return adapter.updateMany(action.payload.updatequalify, state)
        case LeadActionTypes.archivedRestoreleads:
            return adapter.removeMany(action.payload.ids, state)
        case LeadActionTypes.UpdateLeadsOwner:
            return adapter.updateOne(action.payload.updateOwner, state)
        case LeadActionTypes.UpdateLeadReqdata:
            return adapter.updateOne(action.payload.updateleadReqDetails, state)
        case LeadActionTypes.updateLeadCampaign:
            return adapter.updateOne(action.payload.updateleadCampaign, state)
        case LeadActionTypes.LinkedLeadActivityAdded:
            return adapter.updateOne(action.payload.LinkedLeadActivity, state)
        case LeadActionTypes.LinkedLeadOppAdded:
            return adapter.updateOne(action.payload.LinkedLeadOpp, state)
        case LeadActionTypes.LinkedLeadCampDelete:
            return adapter.updateOne(action.payload.LinkedLeadCamp, state)
        case LeadActionTypes.UpdateLeadReqContact:
            return adapter.updateOne(action.payload.updateleadcontact, state)
        case LeadActionTypes.LinkedLeadCustomer:
            return adapter.updateOne(action.payload.LinkedLeadCUstomer, state)
            case LeadActionTypes.UpdateHistoryFlag:
                return adapter.updateOne(action.payload.Historyflag,state)
                case LeadActionTypes.ClearAllLeadDetails:
                    return adapter.removeAll(state)

        default: {
            return state
        }
    }
}
