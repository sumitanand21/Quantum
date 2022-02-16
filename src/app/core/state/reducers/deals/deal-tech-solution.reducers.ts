import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";

export interface DealTectSolutionListState {
    dealTechSolution: any
}

export const InitialState: DealTectSolutionListState = {
    dealTechSolution: {
        id: '',
        indxparent: '',
        module: '',
        author: '',
        appReq: '',
        approver: '',
        status: '',
        escalation: '',
        subData: '',
        submissionDate: '',
        template: '',
        templateType: '',
        path: '',
        totalCount: '',
        isLock: '',
        isDelete: '',
        index: '',
    }
}

export function DealTechSolutionReducers(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.GetDealTechSolutionList:
            return {
                dealTechSolution: action.payload.dealTechArrayList
            }
        default: {
            return state
        }
    }
}