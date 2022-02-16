import { createFeatureSelector, createSelector } from "../../../../../../node_modules/@ngrx/store";
import { initialPlanState } from "@app/core/state/reducers/account/relationshipPlanList.reducer";

export const relationShipRequestState = createFeatureSelector<initialPlanState>('RelationPlanRequest');

export const RelationShipPlanRequestState = createSelector(
    relationShipRequestState,
    res=>res
)