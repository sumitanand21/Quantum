export interface GetCommentsOnAction {
    ResponseObject: CommentsOnAction[];
    IsError: boolean;
    Severity: number;
    ApiStatusCode: number,
    TotalRecordCount: number,
    CurrentPageNumber: number,
    Message: string
}

export interface CommentsOnAction {
    ActivityId: string;
}
