export interface GetCampaignType {
    ResponseObject: CampaignType[];
    IsError: boolean;
    Severity: number;
}

export interface CampaignType {
    Id: number;
    Value: string;
}
