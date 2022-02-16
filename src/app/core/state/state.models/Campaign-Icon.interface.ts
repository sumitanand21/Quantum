
export type CampaignIconState  = {
    status : boolean,
    module : any,
    data : CampaignIconData[]
}

export interface CampaignIconData {
    accountId : any,
    accountName : any,
    tableName :  any;
}