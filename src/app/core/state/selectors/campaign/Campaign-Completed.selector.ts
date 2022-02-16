import { createSelector, createFeatureSelector } from '@ngrx/store';
import { initialCompletedCampaignState } from '@app/core/state/reducers/campaign/Campaign-CompletedList.reducer'

export const completedCampaignState = createFeatureSelector<initialCompletedCampaignState>('CompletedCampaign');
export const CompletedCampaignState = createSelector(
    completedCampaignState,
    res => res
);