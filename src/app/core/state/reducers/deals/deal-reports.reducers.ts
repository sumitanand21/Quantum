import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
// import { HomeActions, HomeActionListTypes } from "../../actions/home.action";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export const InitialState: Reports = {
    ReportData: {}

};
export interface Reports {
    ReportData: any
}

export function ReportsReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.Reports:
            return {
                reportsdata: action.payload.ReportsData
            }
        default: {
            return state
        }
    }
}