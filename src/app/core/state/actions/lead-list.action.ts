import { Action } from '@ngrx/store';
import { UnqualifiedLeads } from '@app/core/state/state.models/Lead/unqualifiedLeads.interface';
import { QualifiedLead } from '@app/core/state/state.models/Lead/qualifiedLeads.interface';
import { ArchivedLeads } from '@app/core/state/state.models/Lead/archivedLeads.interface';



export enum LeadsActionTypes {
    LoadUnqualifiedList = '[Lead] Load UnqulifiedList',
    LoadQualifiedList = '[Lead] Load QulifiedList',
    LoadArchivedList = '[Lead] Load ArchivedList',
    Update = '[Lead] Allconv',
}

export class CreateUnqualifiedLeads implements Action {
    readonly type = LeadsActionTypes.LoadUnqualifiedList;
    constructor(public payload:{CreateUnqualifiedLead:UnqualifiedLeads[],count:any, OdatanextLink: any}) { 
        console.log(payload)
    }
}

export class CreateQulifiedList implements Action {
    readonly type = LeadsActionTypes.LoadQualifiedList;
    constructor(public payload:{CreateQualifiedLead:QualifiedLead[],count:any, OdatanextLink: any}) { 
        console.log(payload)
    }
}

export type LeadsListActions = CreateUnqualifiedLeads | CreateQulifiedList 
