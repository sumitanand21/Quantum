import { createFeatureSelector, createSelector } from "@ngrx/store";
import { ApprovalState } from "../../reducers/home/approval.reducer";


export const AllApprovalState = createFeatureSelector<ApprovalState>("ApprovalList")

export const selectApprovalTable = createSelector(

    AllApprovalState,
    res=>res

)
