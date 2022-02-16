import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

import { MeetingDetailsModel } from "@app/core/state/state.models/activity/meeting-details.model";
import { MeetingActionTypes, ActivityActions } from "@app/core/state/actions/activities.actions";


export interface MeetingDetailsState extends EntityState<MeetingDetailsModel> {

}

export const adapter: EntityAdapter<MeetingDetailsModel> = createEntityAdapter<MeetingDetailsModel>({

})

export const InitialState: MeetingDetailsState = adapter.getInitialState({

})

export function MeetingDetailsReducer(state = InitialState, action: ActivityActions): MeetingDetailsState {
    switch (action.type) {
        case MeetingActionTypes.UpdateMeetingDetail:
            return adapter.updateOne(action.payload.Update_Meetingdetails, state)
        case MeetingActionTypes.LoadMeetingDetails:
            return adapter.addOne(action.payload.Load_Meetingdetails, state)
        case MeetingActionTypes.MeetingDetailsCustomerAdded:
            return adapter.updateOne(action.payload.customer, state)
        case MeetingActionTypes.ParticipantsAdded:
            return adapter.updateOne(action.payload.participant, state)
        case MeetingActionTypes.TagContactAdded:
            return adapter.updateOne(action.payload.Tags, state)
        case MeetingActionTypes.PotentialwiproAdded:
            return adapter.updateOne(action.payload.solutions, state)
        case MeetingActionTypes.LinkedCampaignsAdded:
            return adapter.updateOne(action.payload.LinkedCampaigns,state)
        case MeetingActionTypes.LinkedLeadsAdded:
            return adapter.updateOne(action.payload.LinkedLeads,state)
        case MeetingActionTypes.LinkedOpportunitiesOrder:
            return adapter.updateOne(action.payload.LinkedOpportunitiesOrder,state)
        case MeetingActionTypes.MeetingAttachment:
            return adapter.updateOne(action.payload.Attachment, state)
        case MeetingActionTypes.MeetingDetailsClear: 
            return adapter.removeAll(state)
        default: {
            return state
        }
    }
}

