import { AccountLandingFarming } from './../state.models/accounts/accountLandingFarming.interface';
import { Action } from '@ngrx/store';

export enum FarmingAccountTypes{
    farmingAccountList='[FARMINGACCOUNT]List',
    farmingRequestsClear = '[FARMINGREQUESTS]CLEAR'
}

export class farmingAccountAction implements Action{
    readonly type =FarmingAccountTypes.farmingAccountList;

    constructor(public payload:{FarmingListModel:AccountLandingFarming[],count:any,OdatanextLink:any})
    {

    }
}
export class farmingRequestsclear implements Action {
    readonly type = FarmingAccountTypes.farmingRequestsClear;
    constructor(public paylood: { FarmingListModel: {} }) { }
}
export type farmingAccountActionType = farmingAccountAction | farmingRequestsclear ;