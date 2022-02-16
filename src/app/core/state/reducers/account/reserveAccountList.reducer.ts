import { EntityState, EntityAdapter, createEntityAdapter } from "../../../../../../node_modules/@ngrx/entity";
import { AccountLandingReserve } from "@app/core/state/state.models/accounts/ReserveAccount.interface";
import { reserveAccountActionType, ReserveAccountTypes } from "@app/core/state/actions/resereve-account-list.actions";

export interface initialAccountState extends EntityState<AccountLandingReserve> {
    count: number;
    OdatanextLink: any;
}
export const adapter: EntityAdapter<AccountLandingReserve> = createEntityAdapter<AccountLandingReserve>()

export const initialReserveState: initialAccountState = adapter.getInitialState({
    count: 0,
    OdatanextLink: ""
})

export function ReserveAccountReducer(state = initialReserveState, action: reserveAccountActionType): initialAccountState {
    switch (action.type) {
        case (ReserveAccountTypes.reserveAccountList): {
            return adapter.addMany(action.payload.ReserveListModel, { ...state, count: action.payload.count, OdatanextLink: action.payload.OdatanextLink })
        }
        case ReserveAccountTypes.reserveAccountClear: {
            return initialReserveState;
        }
        default:
            return state;

    }
}