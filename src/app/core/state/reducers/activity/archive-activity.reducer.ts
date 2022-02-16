import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { ActivityActions, ActivityActionTypes } from "../../actions/activities.actions";
import { ArchiveActivityCollection } from "../../state.models/activity/archive-activity.model";


export interface ArchiveActivityState extends EntityState<ArchiveActivityCollection> {
    count: number,
    nextlink: string
}

export const adapter: EntityAdapter<ArchiveActivityCollection> = createEntityAdapter<ArchiveActivityCollection>({

})

export const InitialState: ArchiveActivityState = adapter.getInitialState({
    count: 0,
    nextlink: ""
})

export function ArchiveActivityReducer(state = InitialState, action: ActivityActions): ArchiveActivityState {
    switch (action.type) {
        case ActivityActionTypes.LoadArchiveActivity:
            return adapter.addMany(action.payload.archiveActivity.archiveActivity,
                { ...state, count: action.payload.archiveActivity.count, nextlink: action.payload.archiveActivity.nextlink })
        case ActivityActionTypes.RestoreActivity:
            const change = { ...state, count: state.count - 1 }
            return adapter.removeOne(action.payload.id, change);
        case ActivityActionTypes.UpdateArchiveActivity:
            return adapter.addMany(action.payload.archiveActivity.archiveActivity,
                { ...state, count: state.count + action.payload.archiveActivity.count })
        case ActivityActionTypes.ClearActivity:
            return adapter.removeAll(state)
        default: {
            return state
        }
    }
}

