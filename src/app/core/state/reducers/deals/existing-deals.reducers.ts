import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
// import { HomeActions, HomeActionListTypes } from "../../actions/home.action";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";
import { ExistingDealsList } from '../../state.models/deals/existing-deals.interface'

export interface ExistingDealsListState {
    existingDeals: any
}
export const InitialState: ExistingDealsListState  = {
    existingDeals: undefined
};
export function ExistingDealsReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.ExistingListAction:
            return {
                existingDeals: action.payload.existingDealslist
            }
        default: {
            return state
        }
    }
}