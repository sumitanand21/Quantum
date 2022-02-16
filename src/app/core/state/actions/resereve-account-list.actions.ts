import { Action } from '@ngrx/store';
import { AccountLandingReserve } from '@app/core/state/state.models/accounts/ReserveAccount.interface';

export enum ReserveAccountTypes{
    reserveAccountList='[RESERVEACCOUNT]List',
    reserveAccountClear = '[RESERVEACCOUNT]CLEAR',
    reserveAccountUpdate = '[RESERVEACCOUNT]UPDATE'
}



export class reserveAccountAction implements Action{
    readonly type = ReserveAccountTypes.reserveAccountList;

    constructor(public payload:{ReserveListModel :AccountLandingReserve[] ,count:any,OdatanextLink:any}){
        
    }
}

export class reserveAccountClear implements Action {
    readonly type = ReserveAccountTypes.reserveAccountClear;
    constructor(public payload: { ReserveListModel: {} }) { }
}




export type reserveAccountActionType = reserveAccountAction | reserveAccountClear;