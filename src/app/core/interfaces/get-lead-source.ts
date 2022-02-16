export interface GetLeadSource {
    ResponseObject: LeadSource[];
    IsError: boolean;
    Severity: number;
}

export interface LeadSource {
    Id: number;
    Value: string;
}
