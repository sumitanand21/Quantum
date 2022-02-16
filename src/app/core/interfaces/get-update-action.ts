export interface GetUpdateAction {
    ResponseObject: UpdateAction[];
    IsError: boolean;
    Severity: number;
    ApiStatusCode: number,
    TotalRecordCount: number,
    CurrentPageNumber: number,
    Message: string
}

export interface UpdateAction {
    ActivityId: string;
    Comments: string;
    AdId: string
}
