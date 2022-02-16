import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { AllActivityCollection } from "../../state.models/activity/all-activity.model";
import { ActivityActions, ActivityActionTypes } from "../../actions/activities.actions";


export interface ActivityState extends EntityState<AllActivityCollection> {
    count: number,
    nextlink: string
}

export const adapter: EntityAdapter<AllActivityCollection> = createEntityAdapter<AllActivityCollection>({

})

export const InitialState: ActivityState = adapter.getInitialState({
    count: 0,
    nextlink: ""
})

export function AllActivityReducer(state = InitialState, action: ActivityActions): ActivityState {
    switch (action.type) {
        case ActivityActionTypes.LoadAllActivity:
            return adapter.addMany(action.payload.activity.allactivity,
                { ...state, count: action.payload.activity.count, nextlink: action.payload.activity.nextlink }
            )
        case ActivityActionTypes.CreateActivityGroup:
            return adapter.addOne(action.payload.activity, state);
        case ActivityActionTypes.ReplicateActivity:
            return adapter.addOne(action.payload.activity, state);
        case ActivityActionTypes.UpdateActivityGroupEdit:
            return adapter.updateOne(action.payload.UpdateActivity, state);
        case ActivityActionTypes.UpdateAllActivity:
            const changes = { ...state, count: state.count + 1 }
            return adapter.addOne(action.payload.activity, changes);
        case ActivityActionTypes.ArchiveActivity:
            console.log('archive activity--->', action.payload.ids)
            const change = { ...state, count: state.count - (action.payload.ids).length }
            return adapter.removeMany(action.payload.ids, change)
        case ActivityActionTypes.ClearActivity:
            return adapter.removeAll(state)
        default: {
            return state
        }
    }
}

