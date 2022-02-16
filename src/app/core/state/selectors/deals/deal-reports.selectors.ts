import { createSelector } from "@ngrx/store";

export const ReportsData = state => state.Reports;

export const ReportsDaTaList = createSelector(
    ReportsData,
     reportsdata => reportsdata   
);