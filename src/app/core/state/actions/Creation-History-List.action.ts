import { Action } from '@ngrx/store';
import { CreationHistory } from '../state.models/accounts/creationHistory.interface';
import { CreationActiveRequests } from '../state.models/accounts/ActiveRequests.interface';
import {Update} from '@ngrx/entity';


export enum AccountActionTypes {
    CreationHistoryList = '[CREATIONHISTORY] CreationHistory',
    ActiveRequestList = '[ACTIVEREQUEST] ActiveRequest',
    ActiveRequestsClear = '[ACTIVEREQUESTS]CLEAR',
    ActiveRequestsUpdate = '[ACTIVEREQUESTS]UPDATE'
}

type UpdateActiveRequestBody={
    id:any,
    changes:any
  }

export class creationHistoryLists implements Action {
    readonly type = AccountActionTypes.CreationHistoryList;
    constructor(public payload: { CreationHistoryModel: CreationHistory[], count: any, OdatanextLink: any }) {
        console.log('the payload when dispatched', payload);
    }
}

export class activeRequestList implements Action {
    readonly type = AccountActionTypes.ActiveRequestList;
    constructor(public payload: { ActiveRequestModel: CreationActiveRequests[], count: any, OdatanextLink: any }) { }

}

export class activeRequestsclear implements Action {
    readonly type = AccountActionTypes.ActiveRequestsClear;
    constructor(public payload: { ActiveRequestModel: {} }) { }
}

export class activeRequestsupdate implements Action {
    readonly type = AccountActionTypes.ActiveRequestsUpdate;
    constructor(public payload: {updateActiveRequestDetais: Update<UpdateActiveRequestBody>} ) { }
}

export type AccountListActionTypes = creationHistoryLists | activeRequestList | activeRequestsclear | activeRequestsupdate;