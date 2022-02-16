export interface GetPriorityCode {
    ResponseObject: PriorityCode[];
    IsError: boolean;
    Severity: number;
}

export interface PriorityCode {
    Id : number;
    Value: string
}
