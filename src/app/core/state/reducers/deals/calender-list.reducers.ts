import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
// import { HomeActions, HomeActionListTypes } from "../../actions/home.action";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export interface CreateActionListState {
    calenderActionList: any;
}
export const InitialState: CreateActionListState  = {
    calenderActionList: undefined,
};
export function CalenderActionListReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
            case DealsActionTypes.calenderActionList:
                return {
                    calenderActionList: action.payload.CalenderActionList,
                }
        default: {
            return state
        }
    }
}