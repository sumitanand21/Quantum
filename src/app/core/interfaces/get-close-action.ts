export interface GetCloseAction {
  [x: string]: any;
    ResponseObject: CloseAction[];
    IsError: boolean;
    Severity: number;
    ApiStatusCode: number,
    TotalRecordCount: number,
    CurrentPageNumber: number,
    Message: string,
    OdatanextLink: any
}

export interface CloseAction {
    ActivityId: string;
}
