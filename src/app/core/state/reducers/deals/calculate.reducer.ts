import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export interface calculateDealState {
    calculateDeal: any
}
export const InitialState: calculateDealState = {
    calculateDeal: undefined
};
export function CalculateReducer(state = InitialState, action: DealsActions): calculateDealState {
    switch (action.type) {
        case DealsActionTypes.calculateDeal:
            return {
                calculateDeal: action.payload.calculateDeal
            }
        default: {
            return state
        }
    }
}