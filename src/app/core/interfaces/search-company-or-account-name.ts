export interface SearchCompanyOrAccountName {
    ResponseObject: company[];
    IsError: boolean;
    Severity: number;
}
export interface company {
    AccountId: string;
    Name: string;
}