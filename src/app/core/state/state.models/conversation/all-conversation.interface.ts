export interface All_Conv_Collection {
    id:string
    Account?: Account
    Appointment_Guid: string
    Campaign: Array<any>
    Conversation_Guid: string
    CreatedOn: string
    HasConsentToRecord: boolean
    HasSensitiveInfo: boolean
    IsArchived: boolean
    IsPrivate: boolean
    IsProspect: boolean
    Leads: Array<any>
    MeetingDate: string
    Name: string
    Opportunities: Array<any>
    Owner?: Owner
    PotentialWiproSolution: string
    PotentialWiproSolutionId: string
    TrailId: string
    Type: number,
    index?:number
}

export interface Account {
    Name?: string
    SysGuid?: string
}
export interface Owner {
    EmpNo?: number
    FullName?: string
    IsMale?: boolean
    ownerId?: string

}