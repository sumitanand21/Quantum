import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export interface coOwners {
  dealCoOwnersList: any;
}

export const InitialState: coOwners = {
  dealCoOwnersList: undefined
};

export function DealCoOwnersReducer(
  state = InitialState,
  action: DealsActions
): any {
  switch (action.type) {
    case DealsActionTypes.dealCoOwners:
      return {
        dealCoOwnersList: action.payload.dealCoOwnersList
      };
    default: {
      return state;
    }
  }
}
