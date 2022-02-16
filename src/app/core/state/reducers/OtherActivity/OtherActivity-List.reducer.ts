import { Action } from '@ngrx/store';
import { CreateOtherActivityListActionTypes,CreateOtherActivityActionTypes } from '../../actions/createOtherActivity-list.action';
import { OtherActivityModel } from '../../state.models/OtherActivity/OtherActivity-List.interface';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface initialCampaignState extends EntityState<OtherActivityModel> {
    count : any;
    OdatanextLink : any;
 }

 export const adapter : EntityAdapter<OtherActivityModel> = createEntityAdapter<OtherActivityModel>() 
 export const initialState : initialCampaignState = adapter.getInitialState({
    count : 0,
    OdatanextLink : ""
})
export function OtherActivityListreducer(state = initialState, action: CreateOtherActivityActionTypes): initialCampaignState {
    switch (action.type) {
        case CreateOtherActivityListActionTypes.OtherActivityList:
            return adapter.addMany(action.payload.OtherActivityModel, { ...state, count : action.payload.count, OdatanextLink : action.payload.OdatanextLink})
        default:
            return state;
    }
}