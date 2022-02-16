export interface ArchiveActivityCollection {
    id?:any
    Account?: Account
    Actioncount?: string
    CreatedOn?: string
    Guid?:any
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
export interface ActivityType{
    Id:number
    Name:string
}

export interface ArchivedDetailsCollection{
    id:any
    Account?: Account
    Actioncount?: string
    ActivityType?: ActivityType
    CreatedOn?: string
    Guid?: string
    Leads?:leads[]
    MeetingCount?: string
    Name?: string
    Opportunities?:Opportunities[]
    OthersCount?: string
    Owner?: Owner
    Prospect?: Prospect,
    parentid?:any
}