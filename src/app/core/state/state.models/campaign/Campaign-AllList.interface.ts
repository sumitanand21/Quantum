
// export interface Owner {
//     EmpNo: number;
//     FullName: string;
//     IsMale: boolean;
//     ownerId: string;
// }

// export interface Function {
//     Id: number;
//     Name: string;
// }

// export interface CampaignList {
//     Id ?: any;
//     id? : any
//     Name: string;
//     OwnerTeam: string;
//     Owner: Owner;
//     Function?: Function[];
//     StartDate: Date;
//     EndDate: Date;
//     DeadLine: Date;
//     CampaignStatus: string;
//     index : string;
// }

export interface Owner {
    FullName: string;
    ownerId: string;
}

export interface Account {
    SysGuid: string;
    Name: string;
}

export interface CampaignType {
    Id: number;
    Name: string;
}

export interface Activity {
    ScheduleStart: Date;
    EndDate: Date;
    MeetingDate: Date;
    IsArchived: boolean;
    Guid: string;
    Name: string;
    CreatedOn: Date;
    IsMeeting: boolean;
}

export interface SubActivity {
    Guid: string;
}

export interface Channel {
    Id?: number;
    Name: string;
}

export interface Platform {
    Id: number;
    Name: string;
}

export interface Purpose {
    Id: number;
    Name: string;
}

export interface Function {
    Guid: string;
    Name: string;
    isExist: boolean;
}

export interface Vertical {
    Id: string;
    Name: string;
}

export interface Industry {
    Guid: string;
    Name: string;
    isExist: boolean;
}

export interface Intrest {
    Code: string;
    Name: string;
    isExist: boolean;
}

export interface SBU {
    Id: string;
    Name: string;
}

export interface CampaignList {
    Id?: any;
    id? : any;
    Code: string;
    Name: string;
    Description: string;
    OwnerTeam: string;
    Owner: Owner;
    Accounts: Account[];
    CampaignType: CampaignType;
    Activity: Activity;
    SubActivity: SubActivity;
    Channel: Channel;
    Platform: Platform;
    Purpose: Purpose;
    Function: Function[];
    Vertical: Vertical;
    StartDate: Date;
    EndDate: Date;
    DeadLine: Date;
    CampaignStatus: string;
    StatusCode: number;
    Industry: Industry[];
    Intrest: Intrest[];
    SBU: SBU;
    index : string
}

