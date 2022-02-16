export interface SearchCustomerOrCompanyContact {
    ResponseObject: Contacts[];
    IsError: boolean;
    Severity: number;
}

export interface Contacts {
    ContactId: string;
    FullName: string;
}
