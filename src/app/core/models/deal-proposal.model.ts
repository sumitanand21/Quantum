export class DealProposalModelAPI {
    Id: number;
    Name: string;
    Path: string;   
    SPUniqueId: string;
    CreatedBy: string;
    ModifiedBy: string;
    Deal: any;
    Author: TeamMemberModelAPI[];
    Approver: TeamMemberModelAPI[];
    UserID: string;
    User: string;
    StatusName: string;
    Escalation: string;
    IsApprovalReq?: boolean;
    TemplateType?: any;
    Template: string;
    TemplateUrl: string;
    ApproverName: string;
    ProposalStatus: any;
    IsLock: boolean;
    IsActive: boolean;
    IsApprover?: boolean;
    SubmissionDate: Date;
    Sections: any[];
    TotalCount: number;
    EditButton: boolean;
    DownalodButton: boolean;
    SubmitButton: boolean;
    ApprovedButton: boolean;
    SentForReworkButton: boolean;
    ActionId: any;

}

export class DealSectionModelAPI {
    Id: number;
    ParentId: number;
    ParentIds: string;
    Name: string;     
    CreatedBy: string;
    ModifiedBy: string;
    Deal: any;
    Author: TeamMemberModelAPI[];
    Approver: TeamMemberModelAPI[];
    UserID: string;
    User: string;
    StatusName: string;
    Escalation: string;
    IsApprovalReq?: boolean;
    TemplateType?: any;
    Template: string;
    TemplateUrl: string;
    ApproverName: string;
    ProposalStatus: any;
    IsLock: boolean;
    IsActive: boolean;
    IsApprover?: boolean;
    SubmissionDate: Date;
    Sections: any[];
    TotalCount: number;
    EditButton: boolean;
    DownalodButton: boolean;
    SubmitButton: boolean;
    ApprovedButton: boolean;
    SentForReworkButton: boolean;
    ActionId: any;

}

export class TeamMemberModelAPI {
    Id: number;
    Employee: any;
    TaskStatus?: any;
    CreatedBy: string;
}