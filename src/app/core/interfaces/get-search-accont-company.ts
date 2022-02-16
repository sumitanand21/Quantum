export interface GetSearchAccountCompany {
  ResponseObject: SearchAccountCompany[];
  IsError: boolean;
  Severity: number;
  ApiStatusCode: number;
}

export interface SearchAccountCompany {
  sysGuid: string;
  Name: string;
  isProspect: boolean;
}