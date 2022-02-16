import { Action } from '@ngrx/store';
import { OtherActivityModel } from '../state.models/OtherActivity/OtherActivity-List.interface';

export enum CreateOtherActivityListActionTypes {
    OtherActivityList = '[OTHER-ACTIVITY] OtherActivityList',

}

export class OtherActivityLists implements Action {
    readonly type = CreateOtherActivityListActionTypes.OtherActivityList;
    constructor(public payload:{OtherActivityModel:OtherActivityModel[],count: any,OdatanextLink : any}){
    }
}
export type CreateOtherActivityActionTypes = OtherActivityLists