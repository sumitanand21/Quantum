export interface AllActivityCollection {
    id?:any
    Account?: Account
    Actioncount?: string
    CreatedOn?: string
    Guid?:string
    Leads?: leads[]
    MeetingCount?: string
    Name?: string
    Opportunities?: Opportunities[]
    OthersCount?: string
    Owner?:Owner
    Prospect?: Prospect
    index?:number
    AccountType?: any
}

export interface Account {
    Name?: string
    SysGuid?: string
}
export interface Owner {
    FullName?: string
}
export interface Prospect{
    Name:string
    OwnershipType:number
}
export interface leads 
{
    Title:string
}
export interface Opportunities{
    Title:string
}

export interface ActivityDetailsCollection{
    id?:any
    Account?: Account
    Actioncount?: string
    CreatedOn?: string
    Guid?: string
    Leads?:leads[]
    MeetingCount?: string
    Name?: string
    OpportunityOrOrders?: any
    OthersCount?: string
    Owner?: Owner
    Prospect?: Prospect,
    parentid?:any
}