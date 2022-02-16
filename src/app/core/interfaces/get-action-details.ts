export interface GetActionDetails {
    ResponseObject: ActionDetails[];
    IsError: boolean;
    Severity: number;
    ApiStatusCode: number,
    TotalRecordCount: number,
    CurrentPageNumber: number,
    Message: string
}

export interface ActionDetails {
    ActivityId: string;
}
