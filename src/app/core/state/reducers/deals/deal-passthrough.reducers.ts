import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
// import { HomeActions, HomeActionListTypes } from "../../actions/home.action";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export const InitialState: PassthroughList = {
    PassListData: undefined

};
export interface PassthroughList {
    PassListData: any
}

export function PassListReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.PassthroughListAction:
            return {
                passlistdata: action.payload.passthroughlist
            }
        default: {
            return state
        }
    }
}