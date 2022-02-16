import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { HomeActions, HomeActionListTypes } from "../../actions/home.action";
import { approvalListCollection } from "../../state.models/home/approval.interface";

export interface ApprovalState extends EntityState<approvalListCollection> {
    count: number,
    nextlink: string
}

export const adapter: EntityAdapter<approvalListCollection> = createEntityAdapter<approvalListCollection>()

export const InitialState: ApprovalState = adapter.getInitialState({
    count: 0,
    nextlink: ""
})

export function ApprovalReducer(state = InitialState, action: HomeActions): ApprovalState {
    switch (action.type) {
        case HomeActionListTypes.LoadApprovalList:
            return adapter.addMany(action.payload.approvalList.approvalListData, { ...state, count: action.payload.approvalList.count, nextlink: action.payload.approvalList.nextlink })
        default: {
            return state
        }
    }
}