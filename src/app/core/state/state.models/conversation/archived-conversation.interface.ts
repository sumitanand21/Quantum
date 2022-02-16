export interface Archived_Conv_Collection {
    id:string
    Account: Account
    Conversation_Guid: string
    CreatedOn: string
    HasConsentToRecord: boolean
    HasSensitiveInfo: boolean
    IsArchived: boolean
    Leads: Array<any>
    MeetingDate: string
    Name: string
    Opportunities: Array<any>
    Owner: Owner
    TrailId: string
    Type: number
    index?:number
}

export interface Account {
    Name: string
}
export interface Owner {
    EmpNo: number,
    FullName: string,
    IsMale: boolean
}