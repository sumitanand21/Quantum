import { Action } from '@ngrx/store'; 
import { CreateCampaign } from '../state.models/CreateCampaign.interface';

export enum CreateCampaignActionTypes {
    CampaignSave = '[CAMPAIGN] Save',
    CampaignEdit = '[CAMPAIGN] Update'
}

export class CreateCampaignAction implements Action {
    readonly type = CreateCampaignActionTypes.CampaignSave;
    constructor(public payload:{CreateCampaignModel:CreateCampaign}){}
}

// export class UpdateCampaignAction implements Action {
//     readonly type = CreateCampaignActionTypes.CampaignSave;
//     constructor(public payload:{UpdateCampaignModel:CreateCampaign}){}
// }

export type CreateCampaignActions = CreateCampaignAction 