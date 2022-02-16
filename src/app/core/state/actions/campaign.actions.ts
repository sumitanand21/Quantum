import { Action } from '@ngrx/store';
import { CampaignSatate } from '../state.models/campaign.interface';


export enum CampaignActionTypes {
    Create = '[CONVERSATION] Create',

}

export class CreateCampaign implements Action {
    readonly type = CampaignActionTypes.Create;
    constructor(public payload:{CreateCampaign:CampaignSatate}){}
}


export type CampaignActions = CreateCampaign
