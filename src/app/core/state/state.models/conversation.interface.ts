export type ConversationState = {
    Tablelist: ConvTableList
}

export interface TableConversation {
    count: number,
    data: AllConversationTablelist[],
    nextlink: string
}
export interface ConvTableList {
    MyConversation: TableConversation,
    AllConversation: TableConversation,
    ArchivedConversation: TableConversation,
}

export type ConversastionSatemodel = {
    id?: String
    Name?: String
    Owner?: String
    Account?: String
    DateCreated?: String
    Trailid?: String
    Leadname?: []
    Linkedopp?: []
    accountSysGuid?: String
    index?: Number
    Isprospect?: Boolean
    ownerId?: String
    OpprtunityForGuid?: []
    LeadForGiud?: []
    Campaign?: []
}

export interface AllConversationTablelist {
    Account: string
    DateCreated: string
    Isprospect: boolean
    Leadname: Array<any>
    Linkedopp: Array<any>
    Name: string
    Owner: string
    Trailid: string
    accountSysGuid: string
    id: string
    index: number
    ownerId: string
}
// ----------------------------------------------- All Conversation------------------------------------------------------------------
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