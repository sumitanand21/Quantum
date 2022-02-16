import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ActivityState } from '../../reducers/activity/activity.reducer';
import { ActivityDetailsState } from '../../reducers/activity/activity.details.reducer';
import { MyActivityState } from '../../reducers/activity/my-activity.reducer';
import { ArchiveActivityState } from '../../reducers/activity/archive-activity.reducer';
import { MyOpenLeadListState } from '../../reducers/leads/myOpenLeads/myopenlead.list.reducer';
import { OpenLeadListState } from '../../reducers/leads/openLeads/openlead.list.reducer';
import { LeadDetailsState } from '../../reducers/leads/leadDetails/leadDetails.reducer';

export const MyopenLeadsList = createFeatureSelector<MyOpenLeadListState>('MyOpenleadList');
export const openLeadsList = createFeatureSelector<OpenLeadListState>('OpenleadList');

export const LeadDetails = createFeatureSelector<LeadDetailsState>('LeadDetails');

export const getMyOpenLeadsList = createSelector(
    MyopenLeadsList,
    res => res
)


export const getMyOpenLeadById = (leadid: number) => createSelector(
    MyopenLeadsList,
    res => res.entities[leadid]
);

// --------------------------------------------------------------Open Lead Selectors ---------------------------------------------------------
export const getOpenLeadsList = createSelector(
    openLeadsList,
    res => res
)
//-----------------------------------------------------------------Lead Details Selectors -----------------------------------------------------


export const getLeadsDetails =(leadid:any)=> createSelector(
    LeadDetails,
    res => res.entities[leadid]
)