export interface GetUpdateActionDetails {
    ResponseObject: UpdateActionDetails[];
    IsError: boolean;
    Severity: number;
    ApiStatusCode: number,
    TotalRecordCount: number,
    CurrentPageNumber: number,
    Message: string,
    OdatanextLink: any
}

export interface UpdateActionDetails {
    ActivityId: string,
    ConversationName: string,
    Subject: string,
    PriorityCode: number,
    StatusCode: number,
    StateCode: number,
    DueDate: string,
    Description: string,
    ParentId: string,
    parenSystemId: string
}
