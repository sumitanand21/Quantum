import { FarmingAccountTypes } from './../../actions/farming-account.action';
import { EntityState,EntityAdapter, createEntityAdapter } from "../../../../../../node_modules/@ngrx/entity";
import { AccountLandingFarming } from './../../state.models/accounts/accountLandingFarming.interface';
import { farmingAccountActionType } from "../../actions/farming-account.action";

export interface initialAccountState extends EntityState<AccountLandingFarming>{
    count:number;
    OdatanextLink:any;
}

export const adapter : EntityAdapter<AccountLandingFarming> = createEntityAdapter<AccountLandingFarming>()

export const initialFarmingState :initialAccountState =adapter.getInitialState({
    count :0,
    OdatanextLink: ""
})

export function FarmingAccountReducer(state=initialFarmingState,action :farmingAccountActionType):initialAccountState
{
 switch(action.type){
 case(FarmingAccountTypes.farmingAccountList):{
 return adapter.addMany(action.payload.FarmingListModel,{...state,count:action.payload.count,OdatanextLink:action.payload.OdatanextLink})
 }
 case FarmingAccountTypes.farmingRequestsClear:
    return initialFarmingState;
 default :
 return state;
 }
}