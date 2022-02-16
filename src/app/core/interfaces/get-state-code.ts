export interface GetStateCode {
    ResponseObject: StateCode[];
    IsError: boolean;
    Severity: number;
}

export interface StateCode {
    Id : number;
    Value: string
}
