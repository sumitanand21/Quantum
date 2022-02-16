export interface GetSubActivity {
    ResponseObject: SubActivity[];
    IsError: boolean;
    Severity: number;
}

export interface SubActivity {
    Id: number;
    Value: string;
}

