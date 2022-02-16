import { createSelector, createFeatureSelector } from '@ngrx/store';
import { initialCampaignState } from '@app/core/state/reducers/campaign/Campaign-AllList.reducer'

export const allCampaignState = createFeatureSelector<initialCampaignState>('AllCampaign');
export const AllCampaignState = createSelector(
    allCampaignState,
    res => res
);