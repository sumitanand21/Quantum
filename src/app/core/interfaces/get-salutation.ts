export interface GetSalutation {
    ResponseObject: Salutation[];
    IsError: boolean;
    Severity: number;
}

export interface Salutation {
    Id: number;
    Value: string;
}
