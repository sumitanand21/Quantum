import { Action } from '@ngrx/store';
import { CampaignList } from '../state.models/campaign/Campaign-AllList.interface';
import { ActiveCampaign } from '../state.models/campaign/Campaign-ActiveList.interface';
import { CompletedCampaign } from '../state.models/campaign/Campaign-CompletedList.interface';
import { Update } from '@ngrx/entity';

export enum CampaignActionTypes {
    AllCampaignList = '[CAMPAIGN] AllCampaign',
    ActiveCampaignList = '[CAMPAIGN] ActiveCampaign',
    CompletedCampaignList = '[CAMPAIGN] CompletedCampaign',
    EditAllCampaign = '[CAMPAIGN] Edit All Campaign',
    CreateCampaign = '[CAMPAIGN] Created',
    EditActiveCampaign = '[CAMPAIGN] Edit Active Campaign',
    ClearCampaign = '[CAMPAIGN] Clear Campaign'
}
export class AllCampaignLists implements Action {
    readonly type = CampaignActionTypes.AllCampaignList;
    constructor(public payload:{AllCampaignModel:CampaignList[],count: any,OdatanextLink : any}){
    }
}
export class ActiveCampaignLists implements Action {
    readonly type = CampaignActionTypes.ActiveCampaignList;
    constructor(public payload:{ActiveCampaignModel:ActiveCampaign[],count: any,OdatanextLink : any}){
    }
}
export class CompletedCampaignLists implements Action {
    readonly type = CampaignActionTypes.CompletedCampaignList;
    constructor(public payload:{CompletedCampaignModel:CompletedCampaign[],count: any,OdatanextLink : any}){
    }
}
export class EditAllCampaign implements Action {
    readonly type = CampaignActionTypes.EditAllCampaign;
    constructor(public payload: { EditCampaignModel: Update<CampaignList> }) {
    }
}

export class EditActiveCampaign implements Action {
    readonly type = CampaignActionTypes.EditActiveCampaign;
    constructor(public payload: { EditActiveCampaignModel: Update<ActiveCampaign> }) {
    }
}

export class CampainCreated implements Action {
    readonly type = CampaignActionTypes.CreateCampaign;
    constructor(public payload: { AllCampaignModel: CampaignList }) {
    }
  }

  export class ClearCampaign implements Action {
    readonly type = CampaignActionTypes.ClearCampaign;
    
  }
export type CampaignListActionTypes = AllCampaignLists | ActiveCampaignLists | CompletedCampaignLists | EditAllCampaign | EditActiveCampaign  | ClearCampaign | CampainCreated