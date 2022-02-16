export type ActionListState = {
    Tablelist: ActionTableList
}

export interface ActionTable {
    count: number,
    data: AllActionTablelist[],
    nextlink: string
}

export interface ActionTableList {
    Action: ActionTable
}

export interface AllActionTablelist {
    id?:string
    ActivityId?:string
    Subject?: string
    Description?: string
    Priority?: string
    PriorityCode?:number
    DueDate?: string
    CreatedOn?: string
    ModifiedOn?: string
    Status?:string
    StateCode?: number
    StatusCode?: number
    Owners?:Array<any>
    count?: number,
    data?: Array<any>,
    nextlink?: string
}