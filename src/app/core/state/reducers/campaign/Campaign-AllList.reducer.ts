import { CampaignList } from '../../state.models/campaign/Campaign-AllList.interface';
import { CampaignActionTypes, CampaignListActionTypes } from '../../actions/campaign-List.action'
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface initialCampaignState extends EntityState<CampaignList> {
    count: any;
    OdatanextLink: any;
}

export const adapter: EntityAdapter<CampaignList> = createEntityAdapter<CampaignList>()
export const initialState: initialCampaignState = adapter.getInitialState({
    count: 0,
    OdatanextLink: ""
})
export function AllCampaignreducer(state = initialState, action: CampaignListActionTypes): initialCampaignState {
    switch (action.type) {
        case CampaignActionTypes.AllCampaignList:
            return adapter.addMany(action.payload.AllCampaignModel, { ...state, count: action.payload.count, OdatanextLink: action.payload.OdatanextLink })
        case CampaignActionTypes.EditAllCampaign:
            return adapter.updateOne(action.payload.EditCampaignModel, state)
        case CampaignActionTypes.CreateCampaign:
            return adapter.addOne(action.payload.AllCampaignModel, state)
        case CampaignActionTypes.ClearCampaign:
            return adapter.removeAll(state)
        default:
            return state;
    }
}