import { Action } from '@ngrx/store';
import { CreationActiveRequests } from '../state.models/accounts/ActiveRequests.interface';
import { AssignmentRefCreationHistory } from '../state.models/accounts/assigmentRefHistory.interface';


export enum AssignmentRefActionTypes {
    AssignmentRefHistoryList = '[CREATIONHISTORY] CreationHistory',
    AssignmentRefActiveRequestList = '[ACTIVEREQUEST] ActiveRequest',
    AssignmentRefActiveRequestsClear = '[ACTIVEREQUESTS]CLEAR',
    AssignmentRefHistoryRequestsClear = '[HISTORYREQUESTS]CLEAR'

}

export class assignmentRefCreationHistoryLists implements Action {
    readonly type = AssignmentRefActionTypes.AssignmentRefHistoryList;
    constructor(public payload: { AssignmentCreationHistoryModel: AssignmentRefCreationHistory[], count: any, OdatanextLink: any }) {
        console.log('the payload when dispatched', payload);
    }
}

export class assignmentRefActiveRequestList implements Action {
    readonly type = AssignmentRefActionTypes.AssignmentRefActiveRequestList;
    constructor(public payload: { AssignActiveRequestModel: CreationActiveRequests[], count: any, OdatanextLink: any }) { }

}

export class assignmentRefActiveRequestsclear implements Action {
    readonly type = AssignmentRefActionTypes.AssignmentRefActiveRequestsClear;
    constructor(public paylood: { AssignclearActiveRequestModel: {} }) { }
}

export class assignmentRefHistoryRequestsclear implements Action {
    readonly type = AssignmentRefActionTypes.AssignmentRefHistoryRequestsClear;
    constructor(public paylood: { AssignmentCreationHistoryModel: {} }) { }
}

export type AssignmentRefListActionTypes = assignmentRefCreationHistoryLists | assignmentRefActiveRequestList | assignmentRefActiveRequestsclear | assignmentRefHistoryRequestsclear;