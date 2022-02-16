import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
// import { HomeActions, HomeActionListTypes } from "../../actions/home.action";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export const InitialState: RLSViewState = {
    RLSViewData: undefined

};
export interface RLSViewState {
    RLSViewData: any
}

export function RLSViewReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.RLSviewData:
            return {
                rlsviewdata: action.payload.RLSviewData
            }
        default: {
            return state
        }
    }
}