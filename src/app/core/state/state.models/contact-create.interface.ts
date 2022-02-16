export interface CreateContactmodel {
    ResponseObject: All_Contact_Collection[];
    IsError: boolean;
    Severity: number;
    ApiStatusCode: number;
    TotalRecordCount: number;
    CurrentPageNumber: number;
    Message: string;
}

export interface All_Contact_Collection {
    id?:string
    BusinessContact?: boolean
    ProfileImage?:string;
    CBU?: Array<any>
    Contact?: Array<any>
    CustomerAccount?: Array<any>
    Designation?: string
    Email?: string
    FName?: string
    Guid?: string
    LName?: string
    ModifiedOn?: string
    ReportingManager?: Array<any>
    index?: number
    isEligibility?: boolean
    isHolidaycard?: boolean
    isInfoonoffers?: boolean
    isInvitationforWebinars?: boolean
    isKeyContact?: boolean
    isLinkedinProfileAvail?: boolean
    isNewsFlashes?: boolean
    isSurveyorResearch?: boolean
}




// detail contact

    export interface Salutation {
        Id: number;
        Value: string;
    }

    export interface Contact {
        ContactType: string;
        ContactNo: string;
        MapGuid: string;
    }

    export interface CustomerAccount {
        SysGuid: string;
        Name: string;
    }

    export interface Relationship {
        Id: number;
        Name: string;
    }

    export interface Category {
        Id: number;
        Name: string;
    }

    export interface CBU {
        SysGuid: string;
        Name: string;
    }

    export interface ReportingManager {
        SysGuid: string;
        FullName: string;
    }

    export interface City {
    }

    export interface Country {
    }

    export interface CustomerAddress {
        City: City;
        Country: Country;
        ZipCode: string;
    }

    export interface Industry {
        isExist: boolean;
    }

    export interface Function {
        isExist: boolean;
    }

    export interface Interest {
        Id: number;
        isExist: boolean;
    }

    export interface MarketingDetail {
        Industry: Industry;
        Solicit: boolean;
        Function: Function;
        Interest: Interest;
        Referenceable: boolean;
    }

    export interface ReferenceType {
        Id: number;
        MapGuid: string;
        Name: string;
        LinkActionType: number;
        statecode: number;
    }

    export interface ContactDetailsCollection {

        id?:string;
        ProfileImage?:string;
        Guid?: string;
        Salutation?: Salutation;
        FName?: string;
        LName?: string;
        Contact?: Contact[];
        Email?: string;
        isKeyContact?: boolean;
        Referenceable?: boolean;
        ReferenceType?: ReferenceType;
        Category?:Category;
        Designation?: string;
        BusinessCardImage? : string
        CustomerAccount?: CustomerAccount;
        Relationship?: Relationship;
        isLinkedinProfileAvail?: boolean;
        TwitterUrl?: string;
        LinkedinUrl?: string;
        CBU?: CBU;
        isNewsFlashes?: boolean;
        isInvitationforWebinars?: boolean;
        isSurveyorResearch?: boolean;
        isHolidaycard?: boolean;
        isEligibility?: boolean;
        isInfoonoffers?: boolean;
        ReportingManager?: ReportingManager;
        CustomerAddress?: CustomerAddress;
        MarketingDetail?: MarketingDetail;
        BusinessContact?: boolean;
        isUserCanEdit?:boolean;

           isAllowToDeActivate?: boolean;
            ModuleLabel?: string;
            Owner?: Owner;
            isPrivate?: boolean;
            ProfileBase64string?: string;
            Module?: number;
            ReferenceMode?: ReferenceMode;
            Status?: number;

    }

    interface ReferenceMode {
     }

interface Owner {
  SysGuid: string;
  FullName: string;
}






