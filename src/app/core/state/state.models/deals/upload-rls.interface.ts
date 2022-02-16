export interface UploadList {
    ModuleNumber: string,
    ModuleStatus: string,
    ModuleName: string,
    ModuleOwner: string,
    PricingCategory: string,
    TypeofDeal: string,
    SubmissionDate: any,
    ModuleBFM: any,
    RateInflationStartQuarter: any,
    RateInflationInterval: any,
    CostInflationStartQuarter: any,
    CostInflationInterval: any,
    ModuleVersion: any,
    DealHeaderID: any,
    ModuleID: any,
    ModuleOwnerEmailID: string,
    DealTeamEmailID: string,
    ModuleTeamEmailID: string,
    expanded: boolean,
    panelOpenState: boolean,
    RLSList: [
        {
            RLSId: any,
            RLSNumber: any,
            RLSName: any,
            RLSStatus: any,
            RLSVersion: any,
            RLSStatusCode: any,
            RLSType: any,
            isRLSUploadEnabled: any,
            isRevertEnabled: any,
            isDeleteRLSEnabled: any
        }
    ]
}
