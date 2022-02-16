export interface GetStatusCode {
    ResponseObject: StatusCode[];
    IsError: boolean;
    Severity: number;
}

export interface StatusCode {
    Id : number;
    Value: string
}
