export interface CreateCampaign {
    ResponseObject: ResponseObject;
    IsError: boolean;
    Severity: number;
    ApiStatusCode: number;
    TotalRecordCount: number;
    CurrentPageNumber: number;
    Message: string;
}

export interface CustomerAccountCode {
    SysGuid: string;
}

export interface CampaignType {
    Id: number;
}

export interface Activity {
    Guid: string;
}

export interface SubActivity {
    Guid: string;
}

export interface Channel {
    Id: number;
}

export interface Platform {
    Id: number;
}

export interface Purpose {
    Id: number;
}

export interface Vertical {
    Code: string;
    Createdon: Date;
}

export interface Intrest {
    Id: string;
    Name: string;
}

export interface SBU {
    Code: string;
}

export interface ResponseObject {
    Id: string;
    Name: string;
    Description: string;
    customerAccountCode: CustomerAccountCode;
    CampaignType: CampaignType;
    Activity: Activity;
    SubActivity: SubActivity;
    Channel: Channel;
    Platform: Platform;
    Purpose: Purpose;
    Function: any[];
    Vertical: Vertical;
    StartDate: Date;
    EndDate: Date;
    DeadLine: Date;
    Industry: any[];
    Intrest: Intrest[];
    SBU: SBU;
}

