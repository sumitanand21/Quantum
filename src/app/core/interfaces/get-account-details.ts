export interface GetAccountDetails {
  ResponseObject: AccountDetails[];
  IsError: boolean;
  ApiStatusCode: number;
}

export interface AccountDetails {
  sysGuid: string;
  DUNSID: string;
  Name: string;
  Number: string;
  isProspect: boolean;
  AccountAlliance: AccountAllianceDetails[];
  AccountCategory: genValueObj;
  AccountClassification: genValueObj;
  ActiveAccountCompetitors: sysGuardsObj[]; 
  Address: AddressDetails;
  AdvisoryRAnalyst: sysGuardsObj;
  Contact: any;
  CoverageLevel: genValueObj;
  Currency: genValueObj;
  CustomerBusinessUnit: CustomerBusinessUnitDetails[];
  DeliveryManagerADHVDH: any;
  Geo: sysGuardsObj;
  GrowthCategory: genValueObj;
  KeyFinancials: financialDetails[];
  LegalStructure: genValueObj;
  LifeCycleStage: genValueObj;
  OrganizationType: genValueObj;
  Owner: sysGuardsFullObj;
  ParentAccount: sysGuardsObj;
  ProposedAccountClassification: genValueObj;
  ProposedAccountType: genValueObj;
  Region: sysGuardsObj;
  RelationShipStatus: genValueObj;
  RevenueCategory: genValueObj;
  SAPDetails: SAPDetailsObj;
  SBU: genValueObj;
  SIC: sysGuardsObj;
  StandByAccountOwner: sysGuardsFullObj;
  SubVertical: genValueObj;
  TerritoryFlag: genValueObj;
  TrendsNAnalysis: TrendsNAnalysisDetails;
  Type: genValueObj;
  UltimateParentAccount: sysGuardsObj;
  Vertical: genValueObj;
  CreditScore: number;
  CreditScoreCommentary: number;
  HeadQuarters: string;
  StockExchange: string;
  StockSymbol: string;
  ITLandScape: string;
  PrimaryVendor: boolean;
  IsNewAgeBusiness: boolean;
  IsGovAccount: boolean;
  WebsiteUrl: string;

}
export interface AddressDetails {
  Address1: string;
  Address2: string;
  Region: sysGuardsObj;
  City: sysGuardsObj;
  Country: sysGuardsObj;
  State_Province: string;
  SubDivision: sysGuardsObj;
}
export interface financialDetails{
  FinancialYear: sysGuardsObj;
  Revenue: number;
  OperatingMargin: number;
  MarketCap: number;
  Employees: number;
  ReturnOnEquity: number;
  YOYRevenueGrowth: number;
}
export interface TrendsNAnalysisDetails{
  CompanyBrief: string;
  NoOfCBU: number;
  Forbes1000Rank: number;
  Priofit: number;
  CompanyNews: string;
  IndustryTrends: string;
  Outlook: string;
  Swot: string;
}
export interface CustomerBusinessUnitDetails{
  Name: string;
  CustomerContact: sysGuardsFullObj;
  BDM: sysGuardsFullObj;
  Status: genValueObj;
}
export interface AccountAllianceDetails{
  MapGuid: string;
  Name: string;
  CustomerContact: sysGuardsFullObj;
}
export interface SAPDetailsObj{
  SAPGroupCustomerNumber: string;
  SAPCustomerCode: string;
  SAPCustomerName: string;
  SAPGroupCustomerName: string;
}
export interface sysGuardsObj {
  SysGuid: string;
  Name: string;
}
export interface sysGuardsFullObj {
  SysGuid: string;
  FullName: string;
}
export interface genValueObj {
  Id: string;
  Value: string;
}
