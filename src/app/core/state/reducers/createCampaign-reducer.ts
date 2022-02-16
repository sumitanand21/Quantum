import { CreateCampaign } from '../state.models/CreateCampaign.interface';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import { CreateCampaignActionTypes, CreateCampaignActions } from '../actions/createCampaign.action';

export const adapter: EntityAdapter<CreateCampaign> = createEntityAdapter<CreateCampaign>();

export interface CampaignState extends EntityState<CreateCampaign> {
    CampaignCreated: boolean;
}
export const initialCampaignState :  CampaignState = adapter.getInitialState({CampaignCreated: false });
export function CampaignReducer(state = initialCampaignState , action: CreateCampaignActions): CampaignState {
    switch(action.type) {
      case CreateCampaignActionTypes.CampaignSave:
        return adapter.addOne(action.payload.CreateCampaignModel, state)
      default: {
        return state;
      }
    }
  }
  export const {
    selectAll,
    selectEntities,
    selectIds,
    selectTotal
  } = adapter.getSelectors();