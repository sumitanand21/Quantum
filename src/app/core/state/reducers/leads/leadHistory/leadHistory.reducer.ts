import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { LeadActions, LeadActionTypes } from "@app/core/state/actions/leads.action";


export interface LeadHistoryState extends EntityState<History> {

}

export const adapter: EntityAdapter<History> = createEntityAdapter<History>({

})

export const InitialState: LeadHistoryState = adapter.getInitialState({

})

export function LeadHistoryReducer(state = InitialState, action: LeadActions): LeadHistoryState {
    switch (action.type) {
        case LeadActionTypes.LeadHistory:
            return adapter.addOne(action.payload.history.data, state)
        default: {
            return state
        }
    }
}