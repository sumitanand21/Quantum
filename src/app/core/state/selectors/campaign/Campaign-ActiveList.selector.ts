import { createSelector, createFeatureSelector } from '@ngrx/store';
import { initialActiveCampaignState } from '@app/core/state/reducers/campaign/Campaign-ActiveList.reducer'

export const activeCampaignState = createFeatureSelector<initialActiveCampaignState>('ActiveCampaign');
export const ActiveCampaignState = createSelector(
    activeCampaignState,
    res => res
);