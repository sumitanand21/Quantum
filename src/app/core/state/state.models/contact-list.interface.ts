export interface ContactListModel {
    Guid: string;
    FName: string;
    LName: string;
    Contact: any[];
    Email: string;
    isKeyContact: boolean;
    Designation: string;
    CustomerAccount: CustomerAccount;
    isLinkedinProfileAvail: boolean;
    CBU: CBU;
    isNewsFlashes: boolean;
    isInvitationforWebinars: boolean;
    isSurveyorResearch: boolean;
    isHolidaycard: boolean;
    isEligibility: boolean;
    isInfoonoffers: boolean;
    ReportingManager: ReportingManager;
    BusinessContact: boolean;
    ModifiedOn: Date;
}

export interface CustomerAccount {
    isProspect: boolean;
    IsPrimary: boolean;
}

export interface CBU {
    Name: string;
}

export interface ReportingManager {
    EmpNo: number;
    IsMale: boolean;
    FullName: string;
}