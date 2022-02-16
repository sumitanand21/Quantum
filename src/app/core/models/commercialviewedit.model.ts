
    export interface MasterData {
        PricingId: string;
        TraceOppId: string;
        DealId: string;
        DealWonLoss?: any;
        DealHeaderNumber: string;
        DealVersionId: string;
        DealHeaderName: string;
        DealValue?: any;
        DOEmailId: string;
        ModuleCount: string;
        ModuleOwnerEmailId: string;
        ModuleBFMEmailId: string;
        ModulePSPOCEmailId: string;
        ModuleId?: any;
        ModuleNumber?: any;
        ModuleVersionId?: any;
        ModuleName?: any;
        ModuleStatusCode?: any;
        ServiceLines?: any;
        OptionId: string;
        OptionNumber: string;
        OptionName: string;
        OptionVersionId: string;
        OptionStatusCode: string;
        DealStatus?: any;
        RLSId?: any;
        RLSVersionId?: any;
        SourcePage: string;
        MachineIp: string;
        GroupCode?: any;
        RoleId?: any;
        CurrencyCode: string;
        MsaRequired: string;
        AmendmentNo?: any;
        BFM_PSPOC_Vertical?: any;
        ModuleTeamEmailID?: any;
        AddModuleVisible: string;
        AddModuleMessage: string;
        FileName: string;
        FilePath: string;
        lnkbtnDownload?: any;
        RLSStatusCode?: any;
        CFOApproval: string;
        TreasuryApproval: string;
        CustomerTemplateFileName: string;
        BillingRateType?: any;
        ContingencyPerc?: any;
        IsLatamDeal?: any;
        RookieAndBulgeData?: any;
    }

    export interface BindHeaderDetail {
        CFOTRSUploadFlag: string;
        CFOApproval?: any;
        TreasuryApproval?: any;
        OppId_AmendNo: string;
        DealSpoc: string;
        DealName: string;
        SBU: string;
        TraceSBUCode: string;
        OpportunityName: string;
        BFM?: any;
        CustomerName: string;
        Vertical: string;
        VersionNo: string;
        Currency: string;
        Status: string;
        PricingApprovalStatus: string;
        IsAppirioDeal?: any;
    }

    export interface ManageInfo {
        AssetTakeOverYN: string;
        AssetTakeOverValue: string;
        PeopleTakeOverYN: string;
        PeopleTakeOverValue: string;
        MsaDiscountYN: string;
        MsaDiscount: string;
        NicheSkillDiscountYN: string;
        NicheSkillDiscount: string;
        DealDiscount: string;
        VolumeDiscount: string;
        VolumeDiscountYN: string;
        MsaPaymentTermsYN: string;
        PaymentTerms: string;
        UnBilledRevenueYN: string;
        FinComments: string;
        BayAreaRateDiscYN: string;
        BayAreaOMDiscYN: string;
        BayAreaRateDiscVal: string;
        BayAreaOMDiscVal: string;
        LatamVisible: string;
    }

    export interface SalaryInflation2 {
        DealHeaderId: string;
        CountryName: string;
        CountryCode: string;
        LocationClassification: string;
        MasterCostInflation: string;
        EditMasterCostInflation: string;
        CostInflation: string;
        EditCostInflation: string;
    }

    export interface SalaryInflation {
        SalaryInflationStartQuarter: string;
        SalaryInflationInterval: string;
        SalaryInflations: SalaryInflation2[];
    }

    export interface RateInflation {
        DealHeaderId: string;
        CountryName: string;
        CountryCode: string;
        LocationClassification: string;
        MasterRateInflation: string;
        EditMasterRateInflation: string;
        RateInflation: string;
        EditRateInflation: string;
    }

    export interface StandardBillingHour {
        DealHeaderId: string;
        LocationName: string;
        LocationClassification: string;
        StandardBillingHours: string;
        EditStandardBillingHours: string;
        MasterStandardBillingHours: string;
        EditMasterStandardBillingHours: string;
        LMCountryLocationId: string;
        CountryName: string;
    }

    export interface DealParameter {
        OptionID: string;
        OptionParameterID: string;
        MasterPriceFactorsName: string;
        CountryName: string;
        CurrencyCode: string;
        LocationClassificationName: string;
        UOMTName: string;
        DataType: string;
        ElementType: string;
        MasterData: string;
        DATA: string;
        ShiftName: string;
        IsEditable: string;
        IsIncreasable: string;
        IsDecreasable: string;
        MasterPriceFactorsCode: string;
        MsaRequired?: any;
        IsLargeDeal?: any;
    }

    export interface Warnings {
        TotRevDealCurrTotRev: string;
        TotRevINRTotRev: string;
        TotRevUSDTotRev: string;
        INRTotOMPerc1: string;
        ServiceOMPercData1: string;
        ServicesOM: string;
        SummaryUpdate: string;
        TotOM: string;
        DealCurrTotOMPerc: string;
        ServiceOM: string;
        SummaryUpdateForeColor: string;
        ThresholdDecision: string;
        TCVWarning: string;
        CheckCostWarnings: string;
        PaymentTermsWarning: string;
        AssetWarning: string;
        PeopleWarning: string;
        UnbilledRevWarning: string;
        ContactBFM: string;
        Message: string;
        MileStoneWarnings: string;
        NicheSkillWarning: string;
        SubmitForApprovalWarning: string;
    }

    export interface GridData {
        LabelName: string;
        DealCurrValue: string;
        INRValue: string;
        USDValue: string;
    }

    export interface ListData {
        RookiePercData: string;
        BlugePercData: string;
        OffEffortsPercData: string;
        OffRevPercData: string;
        OnsiteManMnthsData: string;
        OffshoreManMnthsData: string;
        OnsRateRealzData: string;
        OffRateRealzData: string;
        OnsSalDealCurrData: string;
        OnsSalDealUSDData: string;
        OffShoreSalINRData: string;
        OnsEffortsPercData: string;
    }

    export interface Calculate {
        Warnings: Warnings;
        GridData: GridData[];
        ListData: ListData;
    }

    export interface BtnUpload {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnDeleteFile {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnUploadCFOTreasury {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnDeleteCFOTreasury {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnAddModule {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnCalculate {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnDealClose {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnDealTeam {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnDeleteModule {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnEditLineItem {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnFreezeForOppDeals {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnMngEditForex {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnMngFinTeam {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnMngMilestones {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnMileStoneUpload {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnEditMSLineItem {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnRequestSpoc {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnRevertDeal {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnRevertModule {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnSaveManageParameters {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnSaveManageTab {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnSaveModule {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnSubmitALL {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnSubmitForApproval {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnSynchMasters {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface BtnViewReports {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface ChkAssignDealBFM {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface ChkAssignModule {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface DdlWonLoseStatus {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface LblDealDiscount {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface LblsalaryInflationInterval {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface LblSalaryInflationStartQuarter {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface LblVolumeDiscount {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface LblWonClose {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface PnlDealOnsiteSalParam {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface PnlMngGVCostInflation {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface PnlMngGVRateInflation {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface PnlShowAllDealCalc {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface PnlShowTotRevDealCalc {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface TxtDealDiscount {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface TxtFinComments {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface TxtsalaryInflationInterval {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface TxtSalaryInflationStartQuarter {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface TxtVolumeDiscount {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface LblOPPStatus {
        Visible: string;
        Edit: string;
        Read: string;
    }

    export interface ValidationFlag {
        btnUpload: BtnUpload;
        btnDeleteFile: BtnDeleteFile;
        btnUploadCFOTreasury: BtnUploadCFOTreasury;
        btnDeleteCFOTreasury: BtnDeleteCFOTreasury;
        btnAddModule: BtnAddModule;
        btnCalculate: BtnCalculate;
        btnDealClose: BtnDealClose;
        btnDealTeam: BtnDealTeam;
        btnDeleteModule: BtnDeleteModule;
        btnEditLineItem: BtnEditLineItem;
        btnFreezeForOppDeals: BtnFreezeForOppDeals;
        btnMngEditForex: BtnMngEditForex;
        btnMngFinTeam: BtnMngFinTeam;
        btnMngMilestones: BtnMngMilestones;
        btnMileStoneUpload: BtnMileStoneUpload;
        btnEditMSLineItem: BtnEditMSLineItem;
        btnRequestSpoc: BtnRequestSpoc;
        btnRevertDeal: BtnRevertDeal;
        btnRevertModule: BtnRevertModule;
        btnSaveManageParameters: BtnSaveManageParameters;
        btnSaveManageTab: BtnSaveManageTab;
        btnSaveModule: BtnSaveModule;
        btnSubmitALL: BtnSubmitALL;
        btnSubmitForApproval: BtnSubmitForApproval;
        btnSynchMasters: BtnSynchMasters;
        btnViewReports: BtnViewReports;
        chkAssignDealBFM: ChkAssignDealBFM;
        chkAssignModule: ChkAssignModule;
        ddlcategoryofproject?: any;
        ddlWonLoseStatus: DdlWonLoseStatus;
        lblDealDiscount: LblDealDiscount;
        lblsalaryInflationInterval: LblsalaryInflationInterval;
        lblSalaryInflationStartQuarter: LblSalaryInflationStartQuarter;
        lblVolumeDiscount: LblVolumeDiscount;
        lblWonClose: LblWonClose;
        pnlDealOnsiteSalParam: PnlDealOnsiteSalParam;
        pnlMngGVCostInflation: PnlMngGVCostInflation;
        pnlMngGVRateInflation: PnlMngGVRateInflation;
        pnlShowAllDealCalc: PnlShowAllDealCalc;
        pnlShowTotRevDealCalc: PnlShowTotRevDealCalc;
        txtDealDiscount: TxtDealDiscount;
        txtFinComments: TxtFinComments;
        txtsalaryInflationInterval: TxtsalaryInflationInterval;
        txtSalaryInflationStartQuarter: TxtSalaryInflationStartQuarter;
        txtVolumeDiscount: TxtVolumeDiscount;
        lblOPPStatus: LblOPPStatus;
    }

    export interface DealCriteriaModel {
        ReturnFlag: string;
        ReturnMessage: string;
        MasterData: MasterData;
        BindHeaderDetail: BindHeaderDetail;
        ManageInfo: ManageInfo;
        SalaryInflation: SalaryInflation;
        RateInflations: RateInflation[];
        StandardBillingHours: StandardBillingHour[];
        DealParameters: DealParameter[];
        Calculate: Calculate;
        ValidationFlag: ValidationFlag;
    }

    export interface DealCalculation {
        ReturnFlag: "S";
        ReturnMessage: "SUCCESS";
        MasterData: MasterData;
        BindHeaderDetail: BindHeaderDetail;
        ManageInfo: ManageInfo;
        SalaryInflation: SalaryInflation;
        RateInflations: RateInflation[];
        StandardBillingHours: StandardBillingHour[];
        DealParameters: DealParameter[];
        Calculate: Calculate;
        ValidationFlag: ValidationFlag;
    }


