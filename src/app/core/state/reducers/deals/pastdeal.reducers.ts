import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export const InitialState: PastDealState = {
  pastDeal: undefined
};
export interface PastDealState {
  pastDeal: any;
}

export function PastDealReducer(
  state = InitialState,
  action: DealsActions
): any {
  switch (action.type) {
    case DealsActionTypes.PastDeal:
      return {
        pastDeal: action.payload.pastDeal
      };
    default: {
      return state;
    }
  }
}
