import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export const InitialState: CriteriaState = {
    CriteriaList: undefined

};
export interface CriteriaState {
    CriteriaList: any
}

export function DealCriteriaReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.DealCriteria:
            return {
                dealcurrency: action.payload.dealcriterialist
            }
        default: {
            return state
        }
    }
}