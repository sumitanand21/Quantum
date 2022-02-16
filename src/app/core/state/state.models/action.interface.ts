export type ActionState = {
    ApiStatusCode: 0
    IsError: boolean
    ResponseObject: ResponseObject[]
}



export interface ResponseObject  {
    ActivityId: any
    ActualEnd: any
    Conversation: any
    CreatedOn:any
    Description: any
    DueDate: any
    ModifiedOn: any
    Owners: any[]
    Priority:any
    PriorityCode:any
    State: any
    StateCode:any
    Status: any
    StatusCode:any
    Subject: any    
}
