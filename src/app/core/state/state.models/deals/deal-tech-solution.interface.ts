export interface IDealTechSolutionList {
    Id: number;
    Name: string;
    Approver: string;
    Escalation: string;
    Module: any;
    Status: string;
    IsApprovalReq: boolean;
    ParentId: number;
    IsLock: boolean;
    IsActive: boolean;
    TotalCount: number;
}