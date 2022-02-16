export interface ArchivedLeads {
    LeadGuid: string;
    Title: string;
    CreatedOn: Date;
    Status: Status;
    OverallLeadScore: number;
    Account: Account;
    IsProspect: boolean;
    IsNurture: boolean;
    Source: Source;
    Owner: Owner;
    wipro_archivingpromptdate: Date;
    leadsourcecode: string;
    Conversation: Conversation[];
}

export interface Status {
    Id: number;
    status: string;
}

export interface Account {
    SysGuid: string;
    Name: string;
    isProspect: boolean;
    IsPrimary: boolean;
}

export interface Source {
    Id: number;
    Code: string;
    Name: string;
}

export interface Owner {
    EmpNo: number;
    FullName: string;
    IsMale: boolean;
    ownerId: string;
}

export interface Conversation {
    Conversation_Guid: string;
    Name: string;
    HasConsentToRecord: boolean;
    HasSensitiveInfo: boolean;
    Type: number;
    CreatedOn: Date;
    MeetingDate: Date;
    IsArchived: boolean;
}