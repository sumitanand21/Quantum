export interface GetDelinkComments {
    ResponseObject: DelinkComments[];
    IsError: boolean;
    Severity: number;
    ApiStatusCode: number,
    TotalRecordCount: number,
    CurrentPageNumber: number,
    Message: string
}

export interface DelinkComments {
    ActivityId: string;
}
