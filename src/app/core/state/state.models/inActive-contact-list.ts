

    // export interface CustomerAccount {
    //     SysGuid?: string;
    //     Name?: string;
    //     isProspect?: boolean;
    // }

    // export interface CBU {
    //     Name?: string;
    // }

    // export interface ReportingManager {
    //     FullName?: string;
    // }

    // export interface InActivateContactmodel {
    //     id?:any
    //     Guid?: string;
    //     FName?: string;
    //     LName?: string;
    //     isAllowToDeActivate?: boolean;
    //     MobileListUrl?: string;
    //     Contact?: any[];
    //     Email?: string;
    //     isKeyContact?: boolean;
    //     Designation?: string;
    //     CustomerAccount?: CustomerAccount;
    //     CBU?: CBU;
    //     ReportingManager?: ReportingManager;
    //     ModifiedOn?: Date;
    // }



    //-----------DeActivate contacts list start-------------------


    export interface InActiveCollection {
        ResponseObject?: InActivateContactmodel[];
        IsError: boolean;
        ApiStatusCode: number;
        OdatanextLink: string;
        TotalRecordCount: number;
        CurrentPageNumber: number;
    }

    export interface InActivateContactmodel {
        id?:any
        Guid?: string;
        FName?: string;
        LName?: string;
        Owner?: Owner;
        isAllowToDeActivate?: boolean;
        isUserCanEdit?: boolean;
        MobileListUrl?: string;
        Contact?: Contact[];
        Email?: string;
        isKeyContact?: boolean;
        Designation?: string;
        CustomerAccount?: CustomerAccount;
        CBU?: CBU;
        ReportingManager?: ReportingManager;
        ModifiedOn?: Date;
    }

    export interface Owner {
        SysGuid: string;
        FullName: string;
    }

    export interface Contact {
        ContactType: string;
        ContactNo: string;
        MapGuid: string;
        SysGuid: string;
    }

    export interface CustomerAccount {
        SysGuid: string;
        Name: string;
        isProspect: boolean;
    }

    export interface CBU {
        Name: string;
    }

    export interface ReportingManager {
        FullName: string;
    }

  
 















