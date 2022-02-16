export interface GetPlatform {
    ResponseObject: Platform[];
    IsError: boolean;
    Severity: number;
}
export interface Platform {
    Id: number;
    Value: string;
}