export class allopportunity {
    Name: string;
    ID: string;
    Type: string;
    Account: string;
    Vertical: string;
    Stage: string;
    Owner: string;
    Closedate: string;
    Tcv: string;
    Currency: string;
    Status: string;
    Proposaltype: string;

}

export interface creditTypeInterface {
    ID: string
    Name: string
}



export interface creditServiceLineInterface {
    ServicelineId: string
    ServicelineIdName: string
    ErrorResponse: any
}



export interface creditPracticeInterface {
    PracticeId: string
    PracticeIdName: string
    ErrorResponse: any
}

export interface creditSubPracticeInterface {
    SubPracticeId: string
    SubPracticeIdName: string
    ErrorResponse: any
}

export interface creditAllocationInterface {
    SLCAID:string
    WiproOpportunityId: string
    PracticeId: string
    ServicelineId: string
    SubPracticeId: string
    ServicelineBDMId: string
    ServicelineBDMName: string
    WiproTypeId: any
    WiproValue: string
    Contribution: string
    WiproIsDefault : boolean
    WiproOpportunityCreditAllocationID: string
    statecode:number
}

export class creditAllocationDetails {

    creditAllocation: creditAllocationInterface

    bdmDD: any[]
    practiceDD: creditPracticeInterface[]
    subPracticeDD: creditSubPracticeInterface[]
    selectedCABDM:any[]
    bdmNameSwitch: boolean
    editFlag:boolean
    creditTypeName: string
    BDMName: string
    sLName: string
    practiceName: string
    subPracticeName: string
    valueName: string
    contributionName: string

    constructor(creditAllocation, bdmDD, practiceDD, subPracticeDD, selectedCABDM, bdmNameSwitch, editFlag, creditTypeName, BDMName, sLName, practiceName, subPracticeName, valueName, contributionName) {

        this.creditAllocation = creditAllocation
        this.bdmDD = bdmDD;
        this.practiceDD = practiceDD;
        this.subPracticeDD = subPracticeDD;
        this.selectedCABDM = selectedCABDM;
        this.bdmNameSwitch = bdmNameSwitch;
        this.editFlag=editFlag;
        this.creditTypeName = creditTypeName;
        this.BDMName = BDMName;
        this.sLName = sLName;
        this.practiceName = practiceName;
        this.subPracticeName = subPracticeName;
        this.valueName = valueName;
        this.contributionName = contributionName;
    }
}


export interface solutionsInterface {
    OwnerIdValue: string
    OwnerIdValueName: string
    WiproAccountNameValue: string
    WiproInfluenceType: any
    WiproInfluenceTypeName: string
    selectedInfluenceType: any
    WiproAccountname: string
    WiproOpportunitySolutionDetailId: string
    WiproPercentage: boolean
    WiproPercentageOfTCV: string
    WiproServiceType: any
    WiproServiceTypeName: string
    WiproCurrency: string
    WiproSolutionBDMValue: string
    WiproSolutionBDMName: string
    WiproType: any
    WiproTypeName: string
    WiproValue: string
    WiproOpportunityId: string
    statecode:number
    showOrangeBorderFlagSolution: boolean
    accountNameLoaderSolution: boolean
    accountOwnerLoaderSolution: boolean
    solutionBDMLoaderSolution: boolean
    DealRegistration: any
}

export class solutionDetails {

    solutions: solutionsInterface

    nameDD: any[]
    solutionBDMDD: any[]
    ownerDD: any[]
    selectedSolName:any[]
    selectedOwnerName:any[]
    selectedSolBDM:any[]
    solbdmNameSwitch: boolean
    solNameSwitch: boolean
    solOwnerSwitch:boolean
    solutionTypeName: string
    solutionNmName: string
    solutionOwnerName: string
    solutionPerName: string
    solutionTCVName: string
    solutionValueName: string
    solutionBDMName: string
    solutionInfName: string
    solutionSTName: string

    constructor(solutions,
        nameDD,
        solutionBDMDD,
        ownerDD,
        selectedSolName,
        selectedOwnerName,
        selectedSolBDM,
        solbdmNameSwitch,
        solNameSwitch,
        solOwnerSwitch,
        solutionTypeName,
        solutionNmName,
        solutionOwnerName,
        solutionPerName,
        solutionTCVName,
        solutionValueName,
        solutionBDMName,
        solutionInfName,
        solutionSTName) {

        this.solutions = solutions;
        this.nameDD = nameDD;
        this.solutionBDMDD = solutionBDMDD;
        this.ownerDD=ownerDD;
        this.selectedSolName = selectedSolName;
        this.selectedOwnerName = selectedOwnerName;
        this.selectedSolBDM = selectedSolBDM;
        this.solbdmNameSwitch = solbdmNameSwitch;
        this.solNameSwitch = solNameSwitch;
        this.solOwnerSwitch = solOwnerSwitch;
        this.solutionTypeName = solutionTypeName;
        this.solutionNmName = solutionNmName;
        this.solutionOwnerName = solutionOwnerName;
        this.solutionPerName = solutionPerName;
        this.solutionTCVName = solutionTCVName;
        this.solutionValueName = solutionValueName;
        this.solutionBDMName = solutionBDMName;
        this.solutionInfName = solutionInfName;
        this.solutionSTName = solutionSTName;
    }
}
export interface solutionsInterfaceAlliance {
    OwnerIdValue: string
    OwnerIdValueName: string
    WiproAccountNameValue: string
    WiproInfluenceType: any
    WiproAccountname: string
    WiproOpportunitySolutionDetailId: string
    WiproPercentage: boolean
    WiproPercentageOfTCV: string
    WiproServiceType: any
    WiproSolutionBDMValue: string
    WiproSolutionBDMName: string
    WiproType: any
    WiproValue: string
    WiproOpportunityId: string
    statecode:number    
    nameCheck:boolean
    tcvPerCheck:boolean
    tcvValueCheck:boolean
    ownerCheck:boolean,
    influenceCheck:boolean,
    serviceTypeCheck:boolean,
    dealRegisterCheck:boolean,
    DealRegistration:any
}

export class solutionDetailsAlliance {

    solutions: solutionsInterfaceAlliance

    nameDD: any[]
    solutionBDMDD: any[]
    ownerDD: any[]
    selectedSolName:any[]
    selectedOwnerName:any[]
    selectedSolBDM:any[]
    solbdmNameSwitch: boolean
    solNameSwitch: boolean
    solOwnerSwitch:boolean
    solutionTypeName: string
    solutionNmName: string
    solutionOwnerName: string
    solutionPerName: string
    solutionTCVName: string
    solutionValueName: string
    solutionBDMName: string
    solutionInfName: string
    solutionSTName: string

    constructor(solutions,
        nameDD,
        solutionBDMDD,
        ownerDD,
        selectedSolName,
        selectedOwnerName,
        selectedSolBDM,
        solbdmNameSwitch,
        solNameSwitch,
        solOwnerSwitch,
        solutionTypeName,
        solutionNmName,
        solutionOwnerName,
        solutionPerName,
        solutionTCVName,
        solutionValueName,
        solutionBDMName,
        solutionInfName,
        solutionSTName) {

        this.solutions = solutions;
        this.nameDD = nameDD;
        this.solutionBDMDD = solutionBDMDD;
        this.ownerDD=ownerDD;
        this.selectedSolName = selectedSolName;
        this.selectedOwnerName = selectedOwnerName;
        this.selectedSolBDM = selectedSolBDM;
        this.solbdmNameSwitch = solbdmNameSwitch;
        this.solNameSwitch = solNameSwitch;
        this.solOwnerSwitch = solOwnerSwitch;
        this.solutionTypeName = solutionTypeName;
        this.solutionNmName = solutionNmName;
        this.solutionOwnerName = solutionOwnerName;
        this.solutionPerName = solutionPerName;
        this.solutionTCVName = solutionTCVName;
        this.solutionValueName = solutionValueName;
        this.solutionBDMName = solutionBDMName;
        this.solutionInfName = solutionInfName;
        this.solutionSTName = solutionSTName;
    }
}


export interface IPInterface {
    IpId: string
    IpName: string
    WiproModuleValue: string
    WiproModuleName: string
    WiproServiceline: string
    WiproServicelineName:string
    WiproPractice: string
    WiproPracticeName: string
    WiproSlbdmValue: string
    WiproSlbdmName: string
    WiproLicenseValue: string
    WiproCurrency: string
    WiproAmcvalue: string
    WiproCloud: boolean
    WiproAcceptip: boolean
    WiproHolmesbdmID: string
    WiproHolmesbdmName: string
    TaggedamcValue: string,
    TaggedLicenseValue: string,
    WiproOpportunityIdValue: string
    WiproOpportunityIpId: string
    AdditionalSLDetails: any[]
    CloudDetails: any[]
    statecode:number
    WiproModuleContactId:string
    WiproModuleContactIdName:string
    IPAccountLoader: boolean
    IPModuleLoader: boolean
    IPSLBDMLoader: boolean
    IPHolmesBDMLoader: boolean
}

export class IpDetails {

    IP: IPInterface
    IpNameDD: IpandHolmesInterface[]
    IpModuleDD: any[]
    IppracticeDD: any[]
    IpslBDMDD: any[]
    IpHolmesDD: any[]
    selectedIP       :any[]
    selectedModule:any[]
    selectedIPSLBDM:any[]
    selectedHomesBDM:any[]
    IpHolmesbdmNameSwitch: boolean
    IpSLBDMNameSwitch: boolean
    IpModuleNameSwitch: boolean
    IpNameSwitch: boolean
    AcceptIpUI: boolean
    AcceptIpDisable: boolean
    AcceptIPfrombackend: boolean
    CloudDisabled: boolean
    ModuleDisabled:boolean
    HolmesDisable: boolean
    CloudTCV:number
    IpNmName: string
    IpModuleName: string
    IpSLName: string
    IpPracticeName: string
    IpSLBDmName: string
    IpLValueName: string
    IpAMCValueName: string
    IpCloudName: string
    IpAcceptIpName: string
    IpHolmesBDMName: string

    constructor(
        IP,
        IpNameDD,
        IpModuleDD,
        IppracticeDD,
        IpslBDMDD,
        IpHolmesDD,
        selectedIP,
        selectedModule,
        selectedIPSLBDM,
        selectedHomesBDM,
        IpHolmesbdmNameSwitch,
        IpSLBDMNameSwitch,
        IpModuleNameSwitch,
        IpNameSwitch,
        AcceptIpUI,
        AcceptIpDisable,
        AcceptIPfrombackend,
        CloudDisabled,
        ModuleDisabled,
        HolmesDisable,
            CloudTCV,
        IpNmName,
        IpModuleName,
        IpSLName,
        IpPracticeName,
        IpSLBDmName,
        IpLValueName,
        IpAMCValueName,
        IpCloudName,
        IpAcceptIpName,
        IpHolmesBDMName) {


        this.IP = IP;
        this.IpNameDD = IpNameDD;
        this.IpModuleDD = IpModuleDD;
        this.IppracticeDD = IppracticeDD;
        this.IpslBDMDD = IpslBDMDD;
        this.IpHolmesDD = IpHolmesDD;
        this.selectedIP       = selectedIP;
        this.selectedModule=     selectedModule;
        this.selectedIPSLBDM=     selectedIPSLBDM;
        this.selectedHomesBDM=     selectedHomesBDM;
        this.IpHolmesbdmNameSwitch = IpHolmesbdmNameSwitch;
        this.IpSLBDMNameSwitch = IpSLBDMNameSwitch;
        this.IpModuleNameSwitch = IpModuleNameSwitch;
        this.IpNameSwitch = IpNameSwitch;
        this.AcceptIpUI = AcceptIpUI;
        this.AcceptIpDisable = AcceptIpDisable;
        this.AcceptIPfrombackend = AcceptIPfrombackend;
        this.CloudDisabled = CloudDisabled;
        this.ModuleDisabled = ModuleDisabled;
        this.HolmesDisable = HolmesDisable;
        this.CloudTCV =  CloudTCV;
        this.IpNmName = IpNmName;
        this.IpModuleName = IpModuleName;
        this.IpSLName = IpSLName;
        this.IpPracticeName = IpPracticeName;
        this.IpSLBDmName = IpSLBDmName;
        this.IpLValueName = IpLValueName;
        this.IpAMCValueName = IpAMCValueName;
        this.IpCloudName = IpCloudName;
        this.IpAcceptIpName = IpAcceptIpName;
        this.IpHolmesBDMName = IpHolmesBDMName;

    }
}

export interface IpandServiceLineSL {
    ActivityGuid: string
    LeadGuid: string
    LinkActionType: number
    MapGuid: string
    MapName: string
    Name: string
    ParentId: string
    SysGuid: string
    SysNumber: string
    Type: string
}

export interface IpandHolmesInterface {
    name: string
    productid: string
}



export interface serviceLineBSnterface {
    Cloud: boolean
    SLCAID:string
    WiproDualCredit: string
    WiproDualCreditName: string
    WiproEngagementModel: string
    WiproEngagementModelName: string
    WiproOpportunityServicelineDetailId: string
    WiproPercentageOftcv: string
    WiproPracticeId: string
    WiproPracticeName:string
    WiproSubpracticeid: string
    WiproSubpracticeName:string
    TransactioncurrencyidValue:string
    checkforAppirio:string
    WiproSlbdmid: string
    WiproSlbdmidValueName: string
    WiproServicelineidValue: string
    WiproServicelineidValueName:string
    WiproEstsltcv: string
    isAccepted: boolean
    TaggedTCV:number
    wiproTaggedStatus: boolean,
    AdditionalServiceLinesDetails: any[]
    AdditionalServiceLinesCloudDetails: any[]
    OpportunityId:string
    statecode:number
    SLBDMLoaderSL: boolean,
    index:number
}

export class serviceLineBSDetails {
    BSServiceLine: serviceLineBSnterface
    SlpracticeDD: any[]
    SlSubpracticeDD: any[]
    SlSLBDMDD: any[]
    EngagementModelDD: any[]
    selectedSLBDM:any[]
    SLSLBDMSwitchName: boolean
    CloudDisabled: boolean
    cloudFlag:boolean
    DisableSLPracSP:boolean
        CloudTCV:number
    SLSLName: string
    SLPracticeName: string
    SLSubPracticeName: string
    SLSLBDMName: string
    PercTCVName: string
    SLTCVName: string
    SLCloudName: string
    SLEngagementName: string
    SLDualCreditName: string

    constructor(
        BSServiceLine,
        SlpracticeDD,
        SlSubpracticeDD,
        SlSLBDMDD,
        EngagementModelDD,
        selectedSLBDM,
        SLSLBDMSwitchName,
        CloudDisabled,
        cloudFlag,
        DisableSLPracSP,
            CloudTCV,
        SLSLName,
        SLPracticeName,
        SLSubPracticeName,
        SLSLBDMName,
        PercTCVName,
        SLTCVName,
        SLCloudName,
        SLEngagementName,
        SLDualCreditName) {
debugger;
        this.BSServiceLine = BSServiceLine;
        this.SlpracticeDD = SlpracticeDD;
        this.SlSubpracticeDD = SlSubpracticeDD;
        this.SlSLBDMDD = SlSLBDMDD;
        this.EngagementModelDD = EngagementModelDD;
        this.selectedSLBDM = selectedSLBDM;
        this.SLSLBDMSwitchName = SLSLBDMSwitchName;
        this.CloudDisabled = CloudDisabled;
        this.cloudFlag = cloudFlag;
        this.DisableSLPracSP = DisableSLPracSP;
        this.CloudTCV = CloudTCV;
        this.SLSLName = SLSLName;
        this.SLPracticeName = SLPracticeName;
        this.SLSubPracticeName = SLSubPracticeName;
        this.SLSLBDMName = SLSLBDMName;
        this.PercTCVName = PercTCVName;
        this.SLTCVName = SLTCVName;
        this.SLCloudName = SLCloudName;
        this.SLEngagementName = SLEngagementName;
        this.SLDualCreditName = SLDualCreditName;

    }
}
//Order Interfaace and calsses//

export interface OrderserviceLineBSnterface {
    Cloud: boolean
    SLCAID:string
    WiproDualCredit: any
    WiproEngagementModel: string
    WiproOpportunityServicelineDetailId: string
    WiproPercentageOftcv: string
    WiproPracticeId: string
    WiproSubpracticeid: string
    WiproSlbdmid: string
    WiproSlbdmidValueName: string
    PricingTypeId : string
    PricingTypeName : string
    WiproServicelineidValue: string
    WiproServicelineidValueName:string
    WiproPracticeName:string
    WiproSubpracticeName:string
    WiproEngagementModelName:string
    WiproDualCreditName:string
    WiproEstsltcv: string
    AdditionalServiceLinesCloudDetails: any[]
    OpportunityId:string
    statecode:number
    wiproOrderid:string
    WiproOpportunityServicelineOrderDetailId:string

}
export class OrderserviceLineBSDetails {
    BSServiceLine: OrderserviceLineBSnterface
    SlpracticeDD: any[]
    SlSubpracticeDD: any[]
    SlSLBDMDD: any[]
    SlPricingTypeDD: any[]
    EngagementModelDD: any[]
    selectedSLBDM:any[]
    selectedSLPricingType:any[]
    SLSLBDMSwitchName: boolean
    SLPricingTypeSwitchName: boolean
    CloudDisabled: boolean
    cloudFlag:boolean
    addedByDualCreditbtn:boolean
    CloudTCV:number
    SLSLName: string
    SLPracticeName: string
    SLSubPracticeName: string
    SLSLBDMName: string
    PercTCVName: string
    SLTCVName: string
    SLCloudName: string
    SLPricingTypeName: string
    SLEngagementName: string
    SLDualCreditName: string


    constructor(
        BSServiceLine,
        SlpracticeDD,
        SlSubpracticeDD,
        SlSLBDMDD,
        SlPricingTypeDD,
        EngagementModelDD,
        selectedSLBDM,
        selectedSLPricingType,
        SLSLBDMSwitchName,
        SLPricingTypeSwitchName,
        CloudDisabled,
        cloudFlag,
        addedByDualCreditbtn,
        CloudTCV,
        SLSLName,
        SLPracticeName,
        SLSubPracticeName,
        SLSLBDMName,
        PercTCVName,
        SLTCVName,
        SLCloudName,
        SLPricingTypeName,
        SLEngagementName,
        SLDualCreditName) {

        this.BSServiceLine = BSServiceLine;
        this.SlpracticeDD = SlpracticeDD;
        this.SlSubpracticeDD = SlSubpracticeDD;
        this.SlSLBDMDD = SlSLBDMDD;
        this.SlPricingTypeDD = SlPricingTypeDD;
        this.EngagementModelDD = EngagementModelDD;
        this.selectedSLBDM = selectedSLBDM;
        this.selectedSLPricingType = selectedSLPricingType;
        this.SLSLBDMSwitchName = SLSLBDMSwitchName;
        this.SLPricingTypeSwitchName = SLPricingTypeSwitchName;
        this.CloudDisabled = CloudDisabled;
        this.cloudFlag = cloudFlag;
        this.addedByDualCreditbtn = addedByDualCreditbtn;
        this.CloudTCV = CloudTCV;
        this.SLSLName = SLSLName;
        this.SLPracticeName = SLPracticeName;
        this.SLSubPracticeName = SLSubPracticeName;
        this.SLSLBDMName = SLSLBDMName;
        this.PercTCVName = PercTCVName;
        this.SLTCVName = SLTCVName;
        this.SLCloudName = SLCloudName;
        this.SLPricingTypeName = SLPricingTypeName;
        this.SLEngagementName = SLEngagementName;
        this.SLDualCreditName = SLDualCreditName;


    }
}

export interface OrderIPInterface {
    IpId: string
    IpName: string
    WiproModuleValue: string
    WiproModuleName: string
    WiproServiceline: any
    WiproPractice: any
    WiproSlbdmValue: string
    WiproSlbdmName: string
    PricingTypeId : string
    PricingTypeName : string
    WiproLicenseValue: string
    WiproAmcvalue: string
    WiproCloud: boolean
    WiproHolmesbdmID: string
    WiproHolmesbdmName: string
    WiproOpportunityIpId: string
    AdditionalSLDetails: any[]
    CloudDetails: any[]
    OpportunityId:string
    wiproOrderid:string
    statecode:number
    WiproModuleContactId:string
    WiproModuleContactIdName:string
    WiproServicelineName:string
    WiproPracticeName:string
    OrderIpId:string

}

export class OrderIpDetails {

    IP: OrderIPInterface
    IpNameDD: IpandHolmesInterface[]
    IpModuleDD: any[]
    IppracticeDD: any[]
    IpslBDMDD: any[]
    IPPricingTypeDD : any[]
    IpHolmesDD: any[]
    selectedIP       :any[]
    selectedModule:any[]
    selectedIPSLBDM:any[]
    selectedIPPricingType :any[]
    selectedHomesBDM:any[]
    IpHolmesbdmNameSwitch: boolean
    IpSLBDMNameSwitch: boolean
    IPPricingTypeSwitchName:boolean
    IpModuleNameSwitch: boolean
    IpNameSwitch: boolean
    CloudDisabled: boolean
    ModuleDisabled:boolean
    HolmesDisable: boolean
        CloudTCV:number
    IpNmName: string
    IpModuleName: string
    IpSLName: string
    IpPracticeName: string
    IpSLBDmName: string
    IpPricingTypeName: string
    IpLValueName: string
    IpAMCValueName: string
    IpCloudName: string
    IpHolmesBDMName: string

    constructor(
        IP,
        IpNameDD,
        IpModuleDD,
        IppracticeDD,
        IpslBDMDD,
        IPPricingTypeDD,
        IpHolmesDD,
        selectedIP,
        selectedModule,
        selectedIPSLBDM,
        selectedIPPricingType,
        selectedHomesBDM,
        IpHolmesbdmNameSwitch,
        IpSLBDMNameSwitch,
        IPPricingTypeSwitchName,
        IpModuleNameSwitch,
        IpNameSwitch,
        CloudDisabled,
        ModuleDisabled,
        HolmesDisable,
        CloudTCV,
        IpNmName,
        IpModuleName,
        IpSLName,
        IpPracticeName,
        IpSLBDmName,
        IpPricingTypeName,
        IpLValueName,
        IpAMCValueName,
        IpCloudName,
        IpHolmesBDMName) {


        this.IP = IP;
        this.IpNameDD = IpNameDD;
        this.IpModuleDD = IpModuleDD;
        this.IppracticeDD = IppracticeDD;
        this.IpslBDMDD = IpslBDMDD;
        this.IPPricingTypeDD = IPPricingTypeDD;
        this.IpHolmesDD = IpHolmesDD;
        this.selectedIP = selectedIP
        this.selectedModule = selectedModule;
        this.selectedIPSLBDM = selectedIPSLBDM;
        this.selectedIPPricingType = selectedIPPricingType;
        this.selectedHomesBDM = selectedHomesBDM;
        this.IpHolmesbdmNameSwitch = IpHolmesbdmNameSwitch;
        this.IpSLBDMNameSwitch = IpSLBDMNameSwitch;
        this.IPPricingTypeSwitchName = IPPricingTypeSwitchName;
        this.IpModuleNameSwitch = IpModuleNameSwitch;
        this.IpNameSwitch = IpNameSwitch;
        this.CloudDisabled = CloudDisabled;
        this.ModuleDisabled = ModuleDisabled;
        this.HolmesDisable = HolmesDisable;
        this.CloudTCV = CloudTCV;
        this.IpNmName = IpNmName;
        this.IpModuleName = IpModuleName;
        this.IpSLName = IpSLName;
        this.IpPracticeName = IpPracticeName;
        this.IpSLBDmName = IpSLBDmName;
        this.IpPricingTypeName = IpPricingTypeName;
        this.IpLValueName = IpLValueName;
        this.IpAMCValueName = IpAMCValueName;
        this.IpCloudName = IpCloudName;
        this.IpHolmesBDMName = IpHolmesBDMName;

    }
}

export interface OrdersolutionsInterface {
    OwnerIdValue: string
    OwnerIdValueName: string
    WiproAccountNameValue: string
    WiproInfluenceType: any
    WiproAccountname: string
    WiproOpportunitySolutionDetailId: string
    WiproPercentage: boolean
    WiproPercentageOfTCV: string
    WiproServiceType: any
    WiproSolutionBDMValue: string
    WiproSolutionBDMName: string
    WiproType: any
    WiproValue: string
    WiproOpportunityId: string
    wiproOrderid:string
    statecode:number
    WiproTypeName:string
    WiproInfluenceTypeName:string
    WiproServiceTypeName:string
    OrderSolutionId:string
    IsDealRegistered : any
    DealRegistrationYes : any
    DealRegistrationNo : any
}
export class OrdersolutionDetails {
    
        solutions: OrdersolutionsInterface
        nameDD: any[]
        ownerDD:any[]
        solutionBDMDD: any[]
        selectedSolName:any[]
        selectedOwnerName:any[]
        selectedSolBDM:any[]
        solbdmNameSwitch: boolean
        solNameSwitch: boolean
        solOwnerSwitch:boolean
        solutionTypeName: string
        solutionNmName: string
        solutionOwnerName: string
        solutionPerName: string
        solutionTCVName: string
        solutionValueName: string
        solutionBDMName: string
        solutionInfName: string
        solutionSTName: string
        solutionDealPricingName: string
    
        constructor(solutions,
            nameDD,
            ownerDD,
            solutionBDMDD,
            selectedSolName,
            selectedOwnerName,
            selectedSolBDM,
            solbdmNameSwitch,
            solNameSwitch,
            solOwnerSwitch,
            solutionTypeName,
            solutionNmName,
            solutionOwnerName,
            solutionPerName,
            solutionTCVName,
            solutionValueName,
            solutionBDMName,
            solutionInfName,
            solutionSTName,
            solutionDealPricingName) {
    
            this.solutions = solutions;
            this.nameDD = nameDD;
            this.ownerDD = ownerDD;
            this.solutionBDMDD = solutionBDMDD;
            this.selectedSolName = selectedSolName;
            this.selectedOwnerName = selectedOwnerName;
            this.selectedSolBDM = selectedSolBDM;
            this.solbdmNameSwitch = solbdmNameSwitch;
            this.solNameSwitch = solNameSwitch;
            this.solOwnerSwitch = solOwnerSwitch;
            this.solutionTypeName = solutionTypeName;
            this.solutionNmName = solutionNmName;
            this.solutionOwnerName = solutionOwnerName;
            this.solutionPerName = solutionPerName;
            this.solutionTCVName = solutionTCVName;
            this.solutionValueName = solutionValueName;
            this.solutionBDMName = solutionBDMName;
            this.solutionInfName = solutionInfName;
            this.solutionSTName = solutionSTName;
            this.solutionDealPricingName = solutionDealPricingName;
        }
    }
    
    export interface OrdercreditAllocationInterface {
            SLCAID:any
            PracticeId: string
            ServicelineId: string
            SubPracticeId: string
            ServicelineBDMId: string
            ServicelineBDMName: string
            WiproTypeId: any
            WiproValue: string
            Contribution: string
            WiproIsDefault : boolean
            WiproOpportunityCreditAllocationID: string
            WiproOpportunityId: string
            wiproOrderid:string
            statecode:number
            WiproTypeName:string
            ServicelineName:string
            PracticeName:string
            SubPracticeName:string
            WiproOrderCreditAllocationID:string
        
        }
        
        export class OrdercreditAllocationDetails {
        
            creditAllocation: OrdercreditAllocationInterface
        
            bdmDD: any[]
            practiceDD: creditPracticeInterface[]
            subPracticeDD: creditSubPracticeInterface[]
            selectedCABDM:any[]
            bdmNameSwitch: boolean
            creditTypeName: string
            BDMName: string
            sLName: string
            practiceName: string
            subPracticeName: string
            valueName: string
            contributionName: string
        
            constructor(creditAllocation, bdmDD, practiceDD, subPracticeDD,selectedCABDM, bdmNameSwitch, creditTypeName, BDMName, sLName, practiceName, subPracticeName, valueName, contributionName) {
        
                this.creditAllocation = creditAllocation
                this.bdmDD = bdmDD;
                this.practiceDD = practiceDD;
                this.subPracticeDD = subPracticeDD;
                this.selectedCABDM = selectedCABDM;
                this.bdmNameSwitch = bdmNameSwitch;
                this.creditTypeName = creditTypeName;
                this.BDMName = BDMName;
                this.sLName = sLName;
                this.practiceName = practiceName;
                this.subPracticeName = subPracticeName;
                this.valueName = valueName;
                this.contributionName = contributionName;
            }
        }
        




