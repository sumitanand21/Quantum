export interface OtherActivityModel {
    id?:any,
    Guid?: string;
    Subject?: string;
    ScheduleStart?: Date;
    scheduledstartTime?: Date;
    EndDate?: Date;
    EndDateTime?: Date;
    Description?: string;
    Account?: Account;
    MeetingType?: MeetingType;
    ActivityGroup?: ActivityGroup;
    Lead?: Lead[];
    Opportunity?: Opportunity[];
    CreatedOn?: Date;
    CustomerContactLink?: string;
    LeadsLinks?: string;
    OpportunityLink?: string;
    WiproContactLink?: string;
    TagUserLinkLink?: string;
    LeadCount?: string;
    OpportunityCount?: string;
    TaggedUserCount?: string;
    wiproUserCount?: string;
    CustomerContactCount?: string;
    CustomerContacts?: any[];
    TagUserToView?: any[];
    WiproParticipant?: WiproParticipant[];
    index?:any
}

export interface Account {
    SysGuid: string;
    Name: string;
    isSwapAccount: boolean;
    FortuneRanking: number;
}

export interface MeetingType {
    Id: number;
    Value: string;
}

export interface ActivityType {
    Id: number;
    Name: string;
}

export interface ActivityGroup {
    Guid: string;
    Name: string;
    ActivityType: ActivityType;
    CreatedOn: Date;
}

export interface Lead {
    MapGuid: string;
    LeadGuid: string;
    Title: string;
}

export interface Opportunity {
    MapGuid: string;
    OpporGuid: string;
    Title: string;
}

export interface WiproParticipant {
    MapGuid: string;
    SysGuid: string;
    FullName: string;
}


