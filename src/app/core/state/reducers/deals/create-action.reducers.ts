import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
// import { HomeActions, HomeActionListTypes } from "../../actions/home.action";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";
import { ExistingDealsList } from '../../state.models/deals/existing-deals.interface'

export interface CreateActionListState {
    createactionlist: any;
    count:number;
}
export const InitialState: CreateActionListState  = {
    createactionlist: undefined,
    count:0
};
export function CreateActionReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
            case DealsActionTypes.CreateActionList:
                return {
                    CreateActionList: action.payload.CreateActionList,
                    count:action.payload.count
                }
        default: {
            return state
        }
    }
}