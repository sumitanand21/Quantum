import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export const InitialState: DealAccessState = {
    DealAccessList: undefined

};
export interface DealAccessState {
    DealAccessList: any
}

export function DealAccessReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.DealAccess:
            return {
                dealaccess: action.payload.dealaccessList
            }
        default: {
            return state
        }
    }
}