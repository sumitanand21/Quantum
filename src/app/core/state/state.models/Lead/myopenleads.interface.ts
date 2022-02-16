

export interface MyOpenLeadsCollection {
    id?: any
    ActivityGroups?: ActivityGroup[]
    CreatedOn?: any
    IsNurture?: boolean
    LeadGuid?: string
    OverallLeadScore?: number
    Owner?: Owner
    Source?: Source
    Status?: Status
    Title?: string
    leadsourcecode?: string
    statecode?: number
}

export interface ActivityGroup {
    Guid?: string,
    Name?: string,
    CreatedOn?: any,
    Status?: number
}

export interface Status {
    Id?: number;
    status?: string;
}

export interface Source {
    Id?: number;
    Code?: string;
    Name?: string;
}

export interface Owner {
    HuntingRatio?: number;
    FullName?: string;
    ownerId?: string;
}

export interface LeadDetailsDataModel {
    id:any
    Account?: any
    Agp?: any
    isUserCanEdit?:any
    isOpportunityCreated?:any
    Attachments?: any
    Campaign?: any
    Conversation?: any
    CreatedOn?: string
    Currency?: any
    CustomerContacts?: any
    DealValue?: number
    DealValueInUSD?: number
    EnquiryType?: any
    IsNurture?: false
    IsProspect?: false
    LeadGuid?: any
    LeadOrder?: any
    isHistory?:boolean,
    LinkActivityGroupLead?: any
    Originator?: string
    OverallLeadScore?: 0
    Owner?: any
    SBU?: any
    ServiceLine?: any
    Status?: any
    StatusCodeValue?: string
    Title?: string
    Vertical?: any
    WiproParticipant?: any
    leadsourcecode?: string
    linkedOpportunity?: any
    statecode?: number
    userSysGuid?: string
    wipro_LeadSource?: any
    isAcceptable?:any
}