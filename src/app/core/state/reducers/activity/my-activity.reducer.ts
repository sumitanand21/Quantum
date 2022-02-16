import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { ActivityActions, ActivityActionTypes } from "../../actions/activities.actions";
import { MyActivityCollection } from "../../state.models/activity/my-activity.models";


export interface MyActivityState extends EntityState<MyActivityCollection> {
    count: number,
    nextlink: string
}

export const adapter: EntityAdapter<MyActivityCollection> = createEntityAdapter<MyActivityCollection>({

})

export const InitialState: MyActivityState = adapter.getInitialState({
    count: 0,
    nextlink: ""
})

export function MyActivityReducer(state = InitialState, action: ActivityActions): MyActivityState {
    switch (action.type) {
        case ActivityActionTypes.LoadMyActivity:

            return adapter.addMany(action.payload.myactivity.myactivity,
                { ...state, count: action.payload.myactivity.count, nextlink: action.payload.myactivity.nextlink })
        case ActivityActionTypes.UpdateActivityGroupEdit:
            return adapter.updateOne(action.payload.UpdateActivity, state);
        case ActivityActionTypes.ClearActivity:
            return adapter.removeAll(state)
        default: {
            return state
        }
    }
}

