import { createFeatureSelector, createSelector } from "@ngrx/store";
import {UnqualifiedLead_State} from "../reducers/unqualified.reducer"
export const UnqualifiedLeads = createFeatureSelector<UnqualifiedLead_State>("UnqualifiedLead");
export const unqualifiedLeads = createSelector (
    UnqualifiedLeads,
    res=>res
)
   
