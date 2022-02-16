import { CampaignActionTypes, CampaignListActionTypes } from '../../actions/campaign-List.action'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ActiveCampaign } from '../../state.models/campaign/Campaign-ActiveList.interface';

export interface initialActiveCampaignState extends EntityState<ActiveCampaign> {
    count: any;
    OdatanextLink: any;
}

export const adapter: EntityAdapter<ActiveCampaign> = createEntityAdapter<ActiveCampaign>()
export const initialState: initialActiveCampaignState = adapter.getInitialState({
    count: 0,
    OdatanextLink: ""
})
export function ActiveCampaignreducer(state = initialState, action: CampaignListActionTypes): initialActiveCampaignState {
    switch (action.type) {
        case CampaignActionTypes.ActiveCampaignList:
            return adapter.addMany(action.payload.ActiveCampaignModel, { ...state, count: action.payload.count, OdatanextLink: action.payload.OdatanextLink })
        case CampaignActionTypes.EditActiveCampaign:
            return adapter.updateOne(action.payload.EditActiveCampaignModel, state)
            case CampaignActionTypes.CreateCampaign:
                    return adapter.addOne(action.payload.AllCampaignModel, state)
            case CampaignActionTypes.ClearCampaign:
                return adapter.removeAll(state)
            default:
                return state;
    }
}