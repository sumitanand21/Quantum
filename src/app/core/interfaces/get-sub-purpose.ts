export interface GetSubPurpose {
    ResponseObject: SubPurpose[];
        IsError: boolean;
        Severity: number;
}

export interface SubPurpose {
    Id: number;
    Value: string;
}
