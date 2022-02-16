

export interface OpenLeadsCollection {
    id?:any
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