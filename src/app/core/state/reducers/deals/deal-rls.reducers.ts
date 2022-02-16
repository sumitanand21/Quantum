import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
// import { HomeActions, HomeActionListTypes } from "../../actions/home.action";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export const InitialState: RLSList = {
    RLSListData: undefined

};
export interface RLSList {
    RLSListData: any
}

export function RLSListReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.RLSListAction:
            return {
                rlslistdata: action.payload.rlslist
            }
        default: {
            return state
        }
    }
}