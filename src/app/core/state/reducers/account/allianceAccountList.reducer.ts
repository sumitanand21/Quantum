import { EntityState,EntityAdapter, createEntityAdapter } from "../../../../../../node_modules/@ngrx/entity";
import { AccountLandingAlliance } from "@app/core/state/state.models/accounts/allianceAccount.interface";
import { allianceAccountActionType, AllianceAccountTypes } from "@app/core/state/actions/alliance-account-list.action";

export interface initialAccountState extends EntityState<AccountLandingAlliance>{
  count:number;
  OdatanextLink:any;
}
export const adapter : EntityAdapter<AccountLandingAlliance> = createEntityAdapter<AccountLandingAlliance>()

export const initialAllianceState : initialAccountState = adapter.getInitialState({
 count : 0,
 OdatanextLink : ""
})

export function AllianceAccountReducer(state=initialAllianceState,action :allianceAccountActionType):initialAccountState
{
    switch(action.type){
        case(AllianceAccountTypes.allianceAccountList):{
            return adapter.addMany(action.payload.AllianceListModel,{...state,count:action.payload.count,OdatanextLink:action.payload.OdatanextLink})
        }
        default :
        return state;

    }
}