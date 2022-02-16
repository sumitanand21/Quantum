import { AccountContactsInterface } from './../../state.models/accounts/accountContacts.interface';
import { EntityState,EntityAdapter, createEntityAdapter } from "../../../../../../node_modules/@ngrx/entity";
import { AccountContactsActionType, AccountContactsTypes } from "../../actions/account-contacts.action";

export interface AccountContactsState extends EntityState<AccountContactsInterface>{
  count:number;
  OdatanextLink:any;
}
export const adapter : EntityAdapter<AccountContactsInterface> = createEntityAdapter<AccountContactsInterface>()

export const initialAccountContactsState : AccountContactsState = adapter.getInitialState({
 count : 0,
 OdatanextLink : ""
})

export function AccountContactsReducer(state=initialAccountContactsState,action :AccountContactsActionType):AccountContactsState
{
    switch(action.type){
        case(AccountContactsTypes.accountContactsList):{
            return adapter.addMany(action.payload.AccountContactsListModel,{...state,count:action.payload.count,OdatanextLink:action.payload.OdatanextLink})
        }
        default :
        return state;

    }
}