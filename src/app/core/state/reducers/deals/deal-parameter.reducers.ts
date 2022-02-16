import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
// import { HomeActions, HomeActionListTypes } from "../../actions/home.action";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export const InitialState: DealParameter = {
    DealparameterData: undefined

};
export interface DealParameter {
    DealparameterData: any
}

export function DealParameterReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.DealParameter:
            return {
                dealparameterList: action.payload.dealparameterList
            }
        default: {
            return state
        }
    }
}