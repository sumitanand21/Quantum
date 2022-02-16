export interface QualifiedLead {
    id: string;
    LeadGuid: string;
    Title: string;
    CreatedOn: Date;
    Status: Status;
    OverallLeadScore: number;
    IsProspect: boolean;
    IsNurture: boolean;
    Source: Source;
    Owner: Owner;
    wipro_archivingpromptdate: Date;
    leadsourcecode: string;
    index?:number;
}

export interface Status {
    Id: number;
    status: string;
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
