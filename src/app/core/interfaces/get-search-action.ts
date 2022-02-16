export interface GetSearchAction {
    ResponseObject: SearchAction[];
    IsError: boolean;
    Severity: number;
    ApiStatusCode: number,
    TotalRecordCount: number,
    CurrentPageNumber: number,
    Message: string
}

export interface SearchAction {
    PageSize: number,
    SearchText: string,
    OdatanextLink: any
}
