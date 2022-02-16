import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
// import { HomeActions, HomeActionListTypes } from "../../actions/home.action";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export const InitialState: Dealoverview = {
    OverviewData: undefined

};
export interface Dealoverview {
    OverviewData: any
}

export function DealOverviewReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.Dealoverview:
            return {
                dealoverview: action.payload.dealoverview
            }
        default: {
            return state
        }
    }
}