import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

import { ActivityDetailsCollection } from "../../state.models/activity/all-activity.model";
import { ActivityActions, ActivityActionTypes, MeetingActionTypes } from "../../actions/activities.actions";


export interface ActivityDetailsState extends EntityState<ActivityDetailsCollection> {

}

export const adapter: EntityAdapter<ActivityDetailsCollection> = createEntityAdapter<ActivityDetailsCollection>()

export const InitialState: ActivityDetailsState = adapter.getInitialState({

})

export function ActivityDetailsReducer(state = InitialState, action: ActivityActions): ActivityDetailsState {
    switch (action.type) {
        case ActivityActionTypes.LoadActivityDetails:
            //    return state
            return adapter.addOne(action.payload.activityDetails, state);
        case ActivityActionTypes.UpdateActivityGroupEdit:
            return adapter.updateOne(action.payload.UpdateActivity, state);
        case ActivityActionTypes.ClearActivityDetails:
            return adapter.removeAll(state)
        case ActivityActionTypes.ClearActivity:
            return adapter.removeAll(state)
        case MeetingActionTypes.MeetingDetailsClear :
            return adapter.removeAll(state)
        default: {
            return state
        }
    }
}