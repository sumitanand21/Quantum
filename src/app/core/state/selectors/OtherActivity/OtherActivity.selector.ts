import { createSelector, createFeatureSelector } from '@ngrx/store';
import { initialCampaignState } from '@app/core/state/reducers/OtherActivity/OtherActivity-List.reducer';

export const otherActivityListState = createFeatureSelector<initialCampaignState>('OtherActivityList');
export const OtherActivityListState = createSelector(
    otherActivityListState,
    res => res
);