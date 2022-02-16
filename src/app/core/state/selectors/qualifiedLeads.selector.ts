import { createFeatureSelector, createSelector } from "@ngrx/store";
import { QualifiedLead_State } from "../reducers/qualified.reducer"
export const QualifiedLeads = createFeatureSelector<QualifiedLead_State>("QualifiedLead");
export const qualifiedLeadsSelector = createSelector(
    QualifiedLeads,
    res => res
)

