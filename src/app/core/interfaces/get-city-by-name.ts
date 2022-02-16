export interface GetCityByName {
    ResponseObject: CityByName[];
    IsError: boolean;
    Severity: number;
}

export interface CityByName {
    Code: number;
    address2_addresstypecode: string;
    merged: boolean;
    statecode: number;
    numberofemployees: number;
    modifiedon: Date;
    donotpostalmail: boolean;
    accountratingcode: number;
    marketingonly: boolean;
    revenue_base: number;
    preferredcontactmethodcode: number;
    customersizecode: number;
    openrevenue_date: Date;
    businesstypecode: number;
    donotemail: boolean;
    address2_shippingmethodcode: number;
    revenue: number;
    address2_freighttermscode: number;
    statuscode: number;
    createdon: Date;
    donotsendmm: boolean;
    donotfax: boolean;
    donotbulkpostalmail: boolean;
    versionnumber: number;
    creditonhold: boolean;
    donotphone: boolean;
    wipro_name: string;
    CityId: string;
}