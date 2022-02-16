// Meghana code starts 11/02/2019
// account landing
export class AccountLandingFarming {
    Name: string;
    Number: string;
    RANumber: string;
    Parentaccount: string;
    Owner: string;
    City: string;
    Country;
    Classification: string;
    Type: string;
    Primary: string;
    Sbu: string;
    Vertical: string;
    Subvertical: string;
    CountryReference: string;
    RegionReference: string;
    GeoReference: string;
    isCheccked: boolean;
}
export class AccountLandingReserve {
    Name: string;
    Number: string;
    Status: string;
    Classification: string;
    Owner: string;
    Sbu: string;
    Vertical: string;
    Subvertical: string;
    Geo: string;
    isCheccked: boolean;
}
export class AccountLandingAlliance {
    Name: string;
    Number: string;
    Status: string;
    Classification: string;
    Owner: string;
    Sbu: string;
    Vertical: string;
    Subvertical: string;
    Geo: string;
    isCheccked: boolean;
}

// account creation
export class CreationActiveRequests {
    id: number;
    Name: string;
    Number: string;
    Requesttype: string;
    Requestdate: string;
    Swapaccount: string;
    Status: string;
    Classification: string;
    Owner: string;
    Sbu: string;
    Vertical: string;
    Subvertical: string;
    Geo: string;
    isCheccked: boolean;
    isExpanded: boolean;
    viewBtnVisibility: boolean;
    reviewBtnVisibility: boolean;
    rejectBtnVisibility: boolean;
    approveBtnVisibility: boolean;
    viewmoreBtnVisibility: boolean;
    statusclass: string;
}
export class ActiveRequestsSBU {
    id: number;
    Name: string;
    Accountowner: string;
    Accounttype: string;
    Swapaccount: string;
    Approvalstatus: string;
    Sbu: string;
    Vertical: string;
    Subvertical: string;
    Geo: string;
    isCheccked: boolean;
    isExpanded: boolean;
    desp_cntnt: boolean;
    cmnts_cntnt: boolean;
    expand_section_cmnt: boolean;
    acc_creator: boolean;
    acc_sbu: boolean;
    acc_cso: boolean;
}
export class ActiveRequestsCSO {
    id: number;
    Name: string;
    Accountowner: string;
    Accounttype: string;
    Swapaccount: string;
    Approvalstatus: string;
    Sbu: string;
    Vertical: string;
    Subvertical: string;
    Geo: string;
    isCheccked: boolean;
    isExpanded: boolean;
    desp_cntnt: boolean;
    cmnts_cntnt: boolean;
    expand_section_cmnt: boolean;
    acc_creator: boolean;
    acc_sbu: boolean;
    acc_cso: boolean;
}

export class CreationHistory {
    id: number;
    Name: string;
    Number: string;
    Requesttype: string;
    Requestdate: string;
    Decisiondate: string;
    Swapaccount: string;
    Status: string;
    Classification: string;
    Owner: string;
    Sbu: string;
    Vertical: string;
    Subvertical: string;
    Geo: string;
    isCheccked: boolean;
    isExpanded: boolean;
    desp_cntnt: boolean;
}

// account modification
export class ActiveRequests {
    id: number;
    Name: string;
    Number: string;
    Requesttype: string;
    Requestdate: string;
    Swapaccount: string;
    Status: string;
    Classification: string;
    Owner: string;
    Sbu: string;
    Vertical: string;
    Subvertical: string;
    Geo: string;
    isCheccked: boolean;
    isExpanded: boolean;
    desp_cntnt: boolean;
    cmnts_cntnt: boolean;
    expand_section_cmnt: boolean;
    acc_creator: boolean;
    acc_sbu: boolean;
    acc_cso: boolean;
}
export class ModificationActiveRequestsSBU {
    id: number;
    Name: string;
    Accountowner: string;
    Accounttype: string;
    Swapaccount: string;
    Approvalstatus: string;
    Sbu: string;
    Vertical: string;
    Subvertical: string;
    Geo: string;
    isCheccked: boolean;
    isExpanded: boolean;
    desp_cntnt: boolean;
    cmnts_cntnt: boolean;
    expand_section_cmnt: boolean;
    acc_creator: boolean;
    acc_sbu: boolean;
    acc_cso: boolean;
}
export class ModificationActiveRequestsCSO {
    id: number;
    Name: string;
    Accountowner: string;
    Accounttype: string;
    Swapaccount: string;
    Approvalstatus: string;
    Sbu: string;
    Vertical: string;
    Subvertical: string;
    Geo: string;
    isCheccked: boolean;
    isExpanded: boolean;
    desp_cntnt: boolean;
    cmnts_cntnt: boolean;
    expand_section_cmnt: boolean;
    acc_creator: boolean;
    acc_sbu: boolean;
    acc_cso: boolean;
}
export class History {
    id: number;
    Name: string;
    Number: string;
    Requesttype: string;
    Requestdate: string;
    Swapaccount: string;
    Status: string;
    Classification: string;
    Owner: string;
    Sbu: string;
    Vertical: string;
    Subvertical: string;
    Geo: string;
    isCheccked: boolean;
    isExpanded: boolean;
    desp_cntnt: boolean;
}

// account finder
export class accountsearch {
    Name: string;
    Number: string;
    Status: string;
    Type: string;
    Owner: string;
    SBU: string;
    Vertical: string;
    Subvertical: string;
    Geo: string;
}

// Meghana code ends 11/02/2019

// Account Modification EDIT ** KKN **

export class accountModification {

    accountname: string;
    accountid: string;
    accounttype: number;
    proposedaccounttype: number;
    parentaccount: string;
    ultimateParent: string;
    newclassification: number;
    proposedclassification:number;
    sbu: string;
    vertical: string;
    subvertical: string;
    adhvdh:string;
    geography:string;
    region: string;
    creditdelinquencyscore: string;
    governmentaccount:boolean;
    newagebusinessacc:boolean;
    city: string;
    country: string;
    mainphone:string;
    url: string;
    sic: string;
    stockindexmembership: string;
    fortuneranking: number;
    operatingmargin: number;
    entitytype: number;
    tickersymbol: string;
    itlandscape:string;
    noofemployees: string;
    marketvalueinmn:number;
    revenueinmn:number;
    coveragelevel:number;
    accountcategory:number;
    standbyaccountowner: string;
    countrycode: string;
    parentsdunsnumber:string;
    address: string;
    businessdescription: string;
    websiteurl: string;
    grossprofit: number;
    currency: number;
    isswap:boolean;
    swapaccount:string;
    isownermodified: boolean;
    requestedby: string;
}