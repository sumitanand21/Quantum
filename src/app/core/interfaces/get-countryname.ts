 export interface GetCountryByName {
    ResponseObject: CountryByName[];
    IsError: boolean;
    Severity: number;
  }
  
 export interface CountryByName {
    Code: string;
    address2_addresstypecode: number;
    merged: boolean;
    statecode: number;
    numberofemployees: number;
    modifiedon: string;
    donotpostalmail: boolean;
    accountratingcode: number;
    marketingonly: boolean;
    revenue_base: number;
    preferredcontactmethodcode: number;
    customersizecode: number;
    openrevenue_date: string;
    businesstypecode: number;
    donotemail: boolean;
    address2_shippingmethodcode: number;
    revenue: number;
    address2_freighttermscode: number;
    statuscode: number;
    createdon: string;
    donotsendmm: boolean;
    donotfax: boolean;
    donotbulkpostalmail: boolean;
    versionnumber: number;
    creditonhold: boolean;
    donotphone: boolean;
    wipro_name: string;
    CountryId: string;
  }