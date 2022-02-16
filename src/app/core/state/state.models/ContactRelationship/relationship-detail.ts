
 export interface RelationshipModel {
    RelationshipCollection?: RelationshipCollection;
    IsError: boolean;
    ApiStatusCode: number;
}

export interface RelationshipCollection {
    id?:any;
    Leads?: Leads;
    AcivityGroups?: AcivityGroups;
    Campaigns?: Campaigns;
    Opportunities?: Opportunities;
}

    export interface Leads {
        TotalLeads?: number;
        ArchivedLeads?: number;
        OpenLeads?: number;
        MyOpenLeads?: number;
        ClosedLeads?: number;
    }

    export interface AcivityGroups {
        TotalActivities?: number;
        ArchieveActivities?: number;
        ActiveActivities?: number;
    }

    export interface Campaigns {
        TotalCampaigns?: number;
        // ActiveCampaigns?: number;
        CompletedCampaigns?: number;
        MyActiveCampaigns?: number;
        AllCampaigns?: number;
    }

    export interface Opportunities {
        OpenOpportunities?: number;
        SuspendedOpportunities?: number;
        WonOpportunities?: number;
        TerminatedOpportunities?: number;
        LostOpportunities?: number;
        TotalOpportunities?: number;
        AllOpportunities?: number;
        MyOwnedOpportunities?: number;
        MyOpenOpportunities?: number;
        OverDueOpportunities?: number;


    }

   

   