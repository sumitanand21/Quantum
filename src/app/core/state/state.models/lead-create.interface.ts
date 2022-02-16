export interface CreateLead {
    ResponseObject: ResponseObject;
    IsError: boolean;
    Severity: number;
    ApiStatusCode: number;
    TotalRecordCount: number;
    CurrentPageNumber: number;
    Message: string;
}

export interface Account {
    SysGuid: string;
    Name: string;
}

export interface EnquiryType {
    Id: number;
    Name: string;
}

export interface Currency {
    Id: number;
    CurrencyRateValue: number;
}

export interface WiproLeadSource {
    sysGuid: string;
    Name: string;
}

export interface SBU {
    Id: string;
    Name: string;
}

export interface Vertical {
    Id: string;
    Name: string;
    Createdon: Date;
}

export interface Agp {
    Guid: string;
    Name: string;
}

export interface Owner {
    EmpNo: number;
    FullName: string;
    IsMale: boolean;
    ownerId: string;
}

export interface ResponseObject {
    LeadGuid: string;
    userSysGuid: string;
    Title: string;
    CreatedOn: Date;
    Account: Account;
    IsProspect: boolean;
    EnquiryType: EnquiryType;
    Currency: Currency;
    DealValue: number;
    DealValueInUSD: number;
    Originator: string;
    wipro_LeadSource: WiproLeadSource;
    SBU: SBU;
    Vertical: Vertical;
    Agp: Agp;
    Owner: Owner;
    wipro_archivingpromptdate: Date;
}





