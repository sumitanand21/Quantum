export interface GetActivity {
    ResponseObject: Activity[];
    IsError: boolean;
    Severity: number;
}

export interface Activity {
    Id: number;
    Value: string;
}

