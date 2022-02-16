import { createFeatureSelector, createSelector } from "@ngrx/store";
import { Archived_State } from "../reducers/leads/ArchivedLeads/archiveliead.list.reducer";
export const ArchivedLeads = createFeatureSelector<Archived_State>("ArchivedLead");
export const archivedLeadsSelector = createSelector(
    ArchivedLeads,
    res => res
)