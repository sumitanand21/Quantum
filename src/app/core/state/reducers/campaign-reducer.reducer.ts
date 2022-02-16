import { Action } from '@ngrx/store';
import { CampaignSatate } from '../state.models/campaign.interface';
import { CampaignActions, CampaignActionTypes } from '../actions/campaign.actions';



export const initialState: CampaignSatate = {
status:false,
module:"empty this shd be updated with campaign models"
};

export function campaignReducer(state = initialState, action: CampaignActions): CampaignSatate {
  switch (action.type) {
  
      case CampaignActionTypes.Create:
          return {
              status: true,
              module: action.payload.CreateCampaign.module
          }
    default:
      return state;
  }
}
