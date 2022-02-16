import { Action } from '@ngrx/store';
import { AccountLandingAlliance } from '@app/core/state/state.models/accounts/allianceAccount.interface';

export enum AllianceAccountTypes{
    allianceAccountList='[ALLIANCEACCOUNT]List'
}

export class AllianceAccountAction implements Action{
    readonly type = AllianceAccountTypes.allianceAccountList;

    constructor(public payload:{AllianceListModel :AccountLandingAlliance[] ,count:any,OdatanextLink:any}){
        
    }
}

export type allianceAccountActionType = AllianceAccountAction;