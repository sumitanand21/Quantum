import { CampaignActionTypes, CampaignListActionTypes } from '../../actions/campaign-List.action'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { CompletedCampaign } from '../../state.models/campaign/Campaign-CompletedList.interface';

export interface initialCompletedCampaignState extends EntityState<CompletedCampaign> {
   count : any;
   OdatanextLink : any;
}

export const adapter : EntityAdapter<CompletedCampaign> = createEntityAdapter<CompletedCampaign>() 
export const initialState : initialCompletedCampaignState = adapter.getInitialState({
    count : 0,
    OdatanextLink : ""
})
export function CompletedCampaignreducer(state = initialState, action: CampaignListActionTypes): initialCompletedCampaignState {
    switch (action.type) {
        case CampaignActionTypes.CompletedCampaignList:
            return adapter.addMany(action.payload.CompletedCampaignModel, { ...state, count : action.payload.count,OdatanextLink : action.payload.OdatanextLink})
            case CampaignActionTypes.ClearCampaign:
                return adapter.removeAll(state)
            default:
                return state;
    }
}