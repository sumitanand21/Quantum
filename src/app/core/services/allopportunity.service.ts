import { Injectable } from '@angular/core';

import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import { allopportunity } from '../models/allopportunity.model';
import { ApiServiceUI,ApiServiceOpportunity } from './api.service';

const routes = {
    getListCount:'OpportunityListing/GetOpportunityDataCount',
    allopportunitiesTab: '/allopportunityTab',
    AllOpportunitiesDetails: '/AllOpportunitiesDetails',
    openopportunities:'/openOpportunities',
    reopenApproval:'/reopenApproval',
    revokeAccess:'/revokeAccess',
    obforecast:'/obforecast',
    getAllOpportunitiesUrl:'OpportunityListing/GetOpportunityData'
    
};

export const allrevokeaccessheader: any[] = [
    { id: 1, name: 'Name', isFixed: true, order: 1, title: 'Name',displayType:"name",className:"approvalstatus"},
    { id: 2, name: 'EmailID', isFixed: false, order: 2, title: 'Email ID',displayType:"name" },
    { id: 3, name: 'Designation', isFixed: false, order: 3, title: 'Designation'},
    { id: 4, name: 'GainAccessDate', isFixed: false, order: 4, title: 'Gain access date'},
    { id: 5, name: 'SBU',isFixed: false, order: 5, title: 'SBU' },
    { id: 6, name: 'Vertical',isFixed: false, order: 6, title: 'Vertical'}
]

export const allobforecast: any[] = [
    { id: 1, name: 'Name', isFixed: true, order: 1, title: 'Opportunity name',displayType:"name",className:"approvalstatus"},
    { id: 2, name: 'ID', isFixed: false, order: 2, title: 'ID',displayType:"name" },
    { id: 3, name: 'Type', isFixed: false, order: 3, title: 'Type'},
    { id: 4, name: 'Account', isFixed: false, order: 4, title: 'Account',className:"approvalstatus"},
    { id: 5, name: 'Owner',isFixed: false, order: 5, title: 'Owner' },
    { id: 6, name: 'Stage',isFixed: false, order: 6, title: 'Stage'},
    { id: 7, name: 'Closuredate',isFixed: false, order: 7, title: 'Est. closure date'}
]






export const wonAccountHeader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 26,id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type',isHideColumnSearch: true , displayType:"capsFirstCase" },
    // { SortId: 2,id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 6,id: 4, isFilter:false, name: 'Owner', isFixed: false, order: 4, title: 'Owner', displayType:"name" },
    { SortId: 53, id: 5, isFilter:false, name: 'isHardClose', isFixed: false, order: 5, title: 'Is hard close?' },
    {SortId: 54, id: 6, isFilter:false, name: 'hardCloseDate', isFixed: false, order: 6, title: 'Hard close date' ,isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 55,id: 7, isFilter:false, name: 'actualCloseDate', isFixed: false, order: 7, title: 'Actual close date' ,isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 25,id: 8, isFilter:false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical' },
    { SortId: 27,id: 9, isFilter:false, name: 'EstTCV', isFixed: false, order: 9, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true,isSortDisable:true },
    { SortId: 32,id: 10, isFilter:false, name: 'Currency', isFixed: false, order: 10, title: 'Currency' },
    { SortId: 38,id: 11, isFilter:false, name: 'ProposalType', isFixed: false, order:11,title: 'Proposal type',isHideColumnSearch: true },
    { id: 12, isFilter:false, name: 'Status', isFixed: false, order: 12, title: 'Status',isStatus:true,hideFilter: true,isSortDisable:true }
]


export const allopportunitiesAccountListheader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    // { SortId: 2,id: 3, isFilter:false, name: 'Account', isFixed: false, order: 3, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 25,id: 3, isFilter:false, name: 'Vertical', isFixed: false, order: 3, title: 'Vertical' },
    { SortId: 31,id: 4, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 4, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 27,id: 5, isFilter:false, name: 'EstTCV', isFixed: false, order: 5, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true,isSortDisable:true },
    {SortId: 58, id: 6, isFilter:false, name: 'actualRev', isFixed: false, order: 6, title: 'Actual revenue',isHideColumnSearch: true,hideFilter: true ,isSortDisable:true},
    { SortId: 7,id: 7, isFilter:false, name: 'Status', isFixed: false, order: 7, title: 'Status',isStatus:true },
    {SortId: 56, id: 8, isFilter:false, name: 'statusReason', isFixed: false, order: 8, title: 'Status reason' },
    { SortId: 57,id: 9, isFilter:false, name: 'manualProb', isFixed: false, order: 9, title: 'Manual probability' },
     {SortId: 59, id: 10, isFilter:false, name: 'oppForecast', isFixed: false, order: 10, title: 'Opportunity forecast' },
    { SortId: 53,id: 11, isFilter:false, name: 'isHardClose', isFixed: false, order: 11, title: 'Is hard close?' },
     {SortId: 39, id: 12, isFilter:false, name: 'geoId', isFixed: false, order: 12, title: 'Geography' },
     { SortId: 6,id: 13, isFilter:false, name: 'Owner', isFixed: false, order: 13, title: 'Owner', displayType:"name" },
     { SortId: 30,id: 14, isFilter:false, name: 'Stage', isFixed: false, order: 14, title: 'Stage',isHideColumnSearch: true , displayType:"capsFirstCase" }
 
    
]






export const overdueTabAccountheader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    // { SortId: 2,id: 3, isFilter:false, name: 'Account', isFixed: false, order: 3, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 25,id: 3, isFilter:false, name: 'Vertical', isFixed: false, order: 3, title: 'Vertical' },
    { SortId: 31,id: 4, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 4, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 27,id: 5, isFilter:false, name: 'EstTCV', isFixed: false, order: 5, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true,isSortDisable:true },
    {SortId: 7, id: 6, isFilter:false, name: 'Status', isFixed: false, order: 6, title: 'Status',isStatus:true },
    {SortId: 57, id: 7, isFilter:false, name: 'manualProb', isFixed: false, order: 7, title: 'Manual probability' },
    { SortId: 59,id: 8, isFilter:false, name: 'oppForecast', isFixed: false, order: 8, title: 'Opportunity forecast' },
    { SortId: 6,id: 9, isFilter:false, name: 'Owner', isFixed: false, order: 9, title: 'Owner', displayType:"name" }
   
]





export const allopportunityAccountheader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 26,id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type',isHideColumnSearch: true , displayType:"capsFirstCase" },
    // { SortId: 2,id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 6,id: 4, isFilter:false, name: 'Owner', isFixed: false, order: 4, title: 'Owner', displayType:"name" },
    { SortId: 30,id: 5, isFilter:false, name: 'Stage', isFixed: false, order: 5, title: 'Stage',isHideColumnSearch: true , displayType:"capsFirstCase" },
    { SortId: 31,id: 6, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 6, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 25,id: 7, isFilter:false, name: 'Vertical', isFixed: false, order: 7, title: 'Vertical' },
    { SortId: 27,id: 8, isFilter:false, name: 'EstTCV', isFixed: false, order: 8, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true },
    { SortId: 32,id: 9, isFilter:false, name: 'Currency', isFixed: false, order: 9, title: 'Currency' },
    { SortId: 38,id: 10, isFilter:false, name: 'ProposalType', isFixed: false, order:10,title: 'Proposal type',isHideColumnSearch: true },
    { id: 11, isFilter:false, name: 'Status', isFixed: false, order: 11, title: 'Status',isStatus:true,hideFilter: true,isSortDisable:true },
    { SortId: 57,id: 12, isFilter:false, name: 'manualProb', isFixed: false, order: 12, title: 'Manual probability' },
    {SortId: 59, id: 13, isFilter:false, name: 'oppForecast', isFixed: false, order: 13, title: 'Opportunity forecast' },
  
]

export const allopportunityheader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 26,id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type',isHideColumnSearch: true , displayType:"capsFirstCase" },
    { SortId: 2,id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 6,id: 5, isFilter:false, name: 'Owner', isFixed: false, order: 5, title: 'Owner', displayType:"name" },
    { SortId: 30,id: 6, isFilter:false, name: 'Stage', isFixed: false, order: 6, title: 'Stage',isHideColumnSearch: true , displayType:"capsFirstCase" },
    { SortId: 31,id: 7, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 7, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 25,id: 8, isFilter:false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical' },
    { SortId: 27,id: 9, isFilter:false, name: 'EstTCV', isFixed: false, order: 9, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true },
    { SortId: 32,id: 10, isFilter:false, name: 'Currency', isFixed: false, order: 10, title: 'Currency' },
    { SortId: 38,id: 11, isFilter:false, name: 'ProposalType', isFixed: false, order:11,title: 'Proposal type',isHideColumnSearch: true },
    { id: 12, isFilter:false, name: 'Status', isFixed: false, order: 12, title: 'Status',isStatus:true,hideFilter: true,isSortDisable:true },
    { SortId: 57,id: 13, isFilter:false, name: 'manualProb', isFixed: false, order: 13, title: 'Manual probability' },
     {SortId: 59, id: 14, isFilter:false, name: 'oppForecast', isFixed: false, order: 14, title: 'Opportunity forecast' },
       

]




export const suspendheader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 26,id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type',isHideColumnSearch: true , displayType:"capsFirstCase" },
    { SortId: 2,id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 6,id: 5, isFilter:false, name: 'Owner', isFixed: false, order: 5, title: 'Owner', displayType:"name" },
    { SortId: 30,id: 6, isFilter:false, name: 'Stage', isFixed: false, order: 6, title: 'Stage',isHideColumnSearch: true , displayType:"capsFirstCase" },
    { SortId: 31,id: 7, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 7, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 25,id: 8, isFilter:false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical' },
    { SortId: 27,id: 9, isFilter:false, name: 'EstTCV', isFixed: false, order: 9, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true },
    { SortId: 32,id: 10, isFilter:false, name: 'Currency', isFixed: false, order: 10, title: 'Currency' },
    { SortId: 38,id: 11, isFilter:false, name: 'ProposalType', isFixed: false, order:11,title: 'Proposal type',isHideColumnSearch: true },
    { id: 12, isFilter:false, name: 'Status', isFixed: false, order: 12, title: 'Status',isStatus:true,hideFilter: true,isSortDisable:true },
    { SortId: 61,id: 13, isFilter:false, name: 'NextReviewDate', isFixed: false, order: 13, title: 'Next review date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 62,id: 14, isFilter:false, name: 'SuspendStartDate', isFixed: false, order: 14, title: 'Suspended date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
     

]

export const suspendAccountheader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 26,id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type',isHideColumnSearch: true , displayType:"capsFirstCase" },
    // { SortId: 2,id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 6,id: 4, isFilter:false, name: 'Owner', isFixed: false, order: 4, title: 'Owner', displayType:"name" },
    { SortId: 30,id: 5, isFilter:false, name: 'Stage', isFixed: false, order: 5, title: 'Stage',isHideColumnSearch: true , displayType:"capsFirstCase" },
    { SortId: 31,id: 6, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 6, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 25,id: 7, isFilter:false, name: 'Vertical', isFixed: false, order: 7, title: 'Vertical' },
    { SortId: 27,id: 8, isFilter:false, name: 'EstTCV', isFixed: false, order: 8, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true },
    { SortId: 32,id: 9, isFilter:false, name: 'Currency', isFixed: false, order: 9, title: 'Currency' },
    { SortId: 38,id: 10, isFilter:false, name: 'ProposalType', isFixed: false, order:10,title: 'Proposal type',isHideColumnSearch: true },
    { id: 11, isFilter:false, name: 'Status', isFixed: false, order: 11, title: 'Status',isStatus:true,hideFilter: true,isSortDisable:true },
    { SortId: 61,id: 12, isFilter:false, name: 'NextReviewDate', isFixed: false, order: 12, title: 'Next review date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 62,id: 13, isFilter:false, name: 'SuspendStartDate', isFixed: false, order: 13, title: 'Suspended date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    

]



export const terminatedAccountheader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 26,id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type',isHideColumnSearch: true , displayType:"capsFirstCase" },
    // { SortId: 2,id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 6,id: 4, isFilter:false, name: 'Owner', isFixed: false, order: 4, title: 'Owner', displayType:"name" },
    { SortId: 30,id: 5, isFilter:false, name: 'Stage', isFixed: false, order: 5, title: 'Stage',isHideColumnSearch: true , displayType:"capsFirstCase" },
    { SortId: 31,id: 6, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 6, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 25,id: 7, isFilter:false, name: 'Vertical', isFixed: false, order: 7, title: 'Vertical' },
    { SortId: 27,id: 8, isFilter:false, name: 'EstTCV', isFixed: false, order: 8, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true },
    { SortId: 32,id: 9, isFilter:false, name: 'Currency', isFixed: false, order: 9, title: 'Currency' },
    { SortId: 38,id: 10, isFilter:false, name: 'ProposalType', isFixed: false, order:10,title: 'Proposal type',isHideColumnSearch: true },
    { id: 11, isFilter:false, name: 'Status', isFixed: false, order: 11, title: 'Status',isStatus:true,hideFilter: true,isSortDisable:true },
    { SortId: 57,id: 12, isFilter:false, name: 'manualProb', isFixed: false, order: 12, title: 'Manual probability' },
    {SortId: 59, id: 13, isFilter:false, name: 'oppForecast', isFixed: false, order: 13, title: 'Opportunity forecast' },
    { SortId: 55,id: 14, isFilter:false, name: 'actualCloseDate', isFixed: false, order: 14, title: 'Actual close date' ,isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    {SortId: 56, id: 15, isFilter:false, name: 'statusReason', isFixed: false, order: 15, title: 'Status reason' },
   
]

export const terminatedheader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 26,id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type',isHideColumnSearch: true , displayType:"capsFirstCase" },
    { SortId: 2,id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 6,id: 5, isFilter:false, name: 'Owner', isFixed: false, order: 5, title: 'Owner', displayType:"name" },
    { SortId: 30,id: 6, isFilter:false, name: 'Stage', isFixed: false, order: 6, title: 'Stage',isHideColumnSearch: true , displayType:"capsFirstCase" },
    { SortId: 31,id: 7, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 7, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 25,id: 8, isFilter:false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical' },
    { SortId: 27,id: 9, isFilter:false, name: 'EstTCV', isFixed: false, order: 9, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true },
    { SortId: 32,id: 10, isFilter:false, name: 'Currency', isFixed: false, order: 10, title: 'Currency' },
    { SortId: 38,id: 11, isFilter:false, name: 'ProposalType', isFixed: false, order:11,title: 'Proposal type',isHideColumnSearch: true },
    { id: 12, isFilter:false, name: 'Status', isFixed: false, order: 12, title: 'Status',isStatus:true,hideFilter: true,isSortDisable:true },
    { SortId: 57,id: 13, isFilter:false, name: 'manualProb', isFixed: false, order: 13, title: 'Manual probability' },
     {SortId: 59, id: 14, isFilter:false, name: 'oppForecast', isFixed: false, order: 14, title: 'Opportunity forecast' },
    { SortId: 55,id: 15, isFilter:false, name: 'actualCloseDate', isFixed: false, order: 15, title: 'Actual close date' ,isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    {SortId: 56, id: 16, isFilter:false, name: 'statusReason', isFixed: false, order: 16, title: 'Status reason' },
        

]


export const wonHeader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 26,id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type',isHideColumnSearch: true , displayType:"capsFirstCase" },
    { SortId: 2,id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 6,id: 5, isFilter:false, name: 'Owner', isFixed: false, order: 5, title: 'Owner', displayType:"name" },
    { SortId: 53, id: 6, isFilter:false, name: 'isHardClose', isFixed: false, order: 6, title: 'Is hard close?' },
    {SortId: 54, id: 7, isFilter:false, name: 'hardCloseDate', isFixed: false, order: 7, title: 'Hard close date' ,isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 55,id: 8, isFilter:false, name: 'actualCloseDate', isFixed: false, order: 8, title: 'Actual close date' ,isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 25,id: 9, isFilter:false, name: 'Vertical', isFixed: false, order: 9, title: 'Vertical' },
    { SortId: 27,id: 10, isFilter:false, name: 'EstTCV', isFixed: false, order: 10, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true,isSortDisable:true },
    { SortId: 32,id: 11, isFilter:false, name: 'Currency', isFixed: false, order: 11, title: 'Currency' },
    { SortId: 38,id: 12, isFilter:false, name: 'ProposalType', isFixed: false, order:12,title: 'Proposal type',isHideColumnSearch: true },
    { id: 13, isFilter:false, name: 'Status', isFixed: false, order: 13, title: 'Status',isStatus:true,hideFilter: true,isSortDisable:true }
]


export const allopportunitiesListheader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 2,id: 3, isFilter:false, name: 'Account', isFixed: false, order: 3, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 25,id: 4, isFilter:false, name: 'Vertical', isFixed: false, order: 4, title: 'Vertical' },
    { SortId: 31,id: 5, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 5, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 27,id: 6, isFilter:false, name: 'EstTCV', isFixed: false, order: 6, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true,isSortDisable:true },
    {SortId: 58, id: 7, isFilter:false, name: 'actualRev', isFixed: false, order: 7, title: 'Actual revenue',isHideColumnSearch: true,hideFilter: true ,isSortDisable:true},
    { SortId: 7,id: 8, isFilter:false, name: 'Status', isFixed: false, order: 8, title: 'Status',isStatus:true },
    {SortId: 56, id: 9, isFilter:false, name: 'statusReason', isFixed: false, order: 9, title: 'Status reason' },
    { SortId: 57,id: 10, isFilter:false, name: 'manualProb', isFixed: false, order: 10, title: 'Manual probability' },
     {SortId: 59, id: 11, isFilter:false, name: 'oppForecast', isFixed: false, order: 11, title: 'Opportunity forecast' },
    { SortId: 53,id: 12, isFilter:false, name: 'isHardClose', isFixed: false, order: 12, title: 'Is hard close?' },
     {SortId: 39, id: 13, isFilter:false, name: 'geoId', isFixed: false, order: 13, title: 'Geography' },
     { SortId: 6,id: 14, isFilter:false, name: 'Owner', isFixed: false, order: 14, title: 'Owner', displayType:"name" },
    { SortId: 30,id: 15, isFilter:false, name: 'Stage', isFixed: false, order: 15, title: 'Stage',isHideColumnSearch: true , displayType:"capsFirstCase" }

    
]



export const allopportunitiesOwnerList: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 2,id: 3, isFilter:false, name: 'Account', isFixed: false, order: 3, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 25,id: 4, isFilter:false, name: 'Vertical', isFixed: false, order: 4, title: 'Vertical' },
    { SortId: 31,id: 5, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 5, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 27,id: 6, isFilter:false, name: 'EstTCV', isFixed: false, order: 6, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true,isSortDisable:true },
    {SortId: 58, id: 7, isFilter:false, name: 'actualRev', isFixed: false, order: 7, title: 'Actual revenue',isHideColumnSearch: true,hideFilter: true ,isSortDisable:true},
    { SortId: 7,id: 8, isFilter:false, name: 'Status', isFixed: false, order: 8, title: 'Status',isStatus:true },
    {SortId: 56, id: 9, isFilter:false, name: 'statusReason', isFixed: false, order: 9, title: 'Status reason' },
    { SortId: 57,id: 10, isFilter:false, name: 'manualProb', isFixed: false, order: 10, title: 'Manual probability' },
     {SortId: 59, id: 11, isFilter:false, name: 'oppForecast', isFixed: false, order: 11, title: 'Opportunity forecast' },
    { SortId: 53,id: 12, isFilter:false, name: 'isHardClose', isFixed: false, order: 12, title: 'Is hard close?' },
     {SortId: 39, id: 13, isFilter:false, name: 'geoId', isFixed: false, order: 13, title: 'Geography' },
     { SortId: 6,id: 14, isFilter:false, name: 'Owner', isFixed: false, order: 14, title: 'Owner', displayType:"name" }
    
    ]


export const allopportunitiesOwnerAccountList: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 25,id: 3, isFilter:false, name: 'Vertical', isFixed: false, order: 3, title: 'Vertical' },
    { SortId: 31,id: 4, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 4, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 27,id: 5, isFilter:false, name: 'EstTCV', isFixed: false, order: 5, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true,isSortDisable:true },
    {SortId: 58, id: 6, isFilter:false, name: 'actualRev', isFixed: false, order: 6, title: 'Actual revenue',isHideColumnSearch: true,hideFilter: true ,isSortDisable:true},
    { SortId: 7,id: 7, isFilter:false, name: 'Status', isFixed: false, order: 7, title: 'Status',isStatus:true },
    {SortId: 56, id: 8, isFilter:false, name: 'statusReason', isFixed: false, order: 8, title: 'Status reason' },
    { SortId: 57,id: 9, isFilter:false, name: 'manualProb', isFixed: false, order: 9, title: 'Manual probability' },
     {SortId: 59, id: 10, isFilter:false, name: 'oppForecast', isFixed: false, order: 10, title: 'Opportunity forecast' },
    { SortId: 53,id: 11, isFilter:false, name: 'isHardClose', isFixed: false, order: 11, title: 'Is hard close?' },
     {SortId: 39, id: 12, isFilter:false, name: 'geoId', isFixed: false, order: 12, title: 'Geography' },
     { SortId: 6,id: 13, isFilter:false, name: 'Owner', isFixed: false, order: 13, title: 'Owner', displayType:"name" },
    
    ]



export const overdueTabheader: any[] = [
    { SortId: "0",id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
    { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
    { SortId: 2,id: 3, isFilter:false, name: 'Account', isFixed: false, order: 3, title: 'Account',isLink:true ,className:'approvalstatus' },
    { SortId: 25,id: 4, isFilter:false, name: 'Vertical', isFixed: false, order: 4, title: 'Vertical' },
    { SortId: 31,id: 5, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 5, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date", dateFormat: 'dd-MMM-yyyy' },
    { SortId: 27,id: 6, isFilter:false, name: 'EstTCV', isFixed: false, order: 6, title: 'Est. TCV ',isHideColumnSearch: true,hideFilter: true,isSortDisable:true },
    {SortId: 7, id: 7, isFilter:false, name: 'Status', isFixed: false, order: 7, title: 'Status',isStatus:true },
    {SortId: 57, id: 8, isFilter:false, name: 'manualProb', isFixed: false, order: 8, title: 'Manual probability' },
    { SortId: 59,id: 9, isFilter:false, name: 'oppForecast', isFixed: false, order: 9, title: 'Opportunity forecast' },
    { SortId: 6,id: 10, isFilter:false, name: 'Owner', isFixed: false, order: 10, title: 'Owner', displayType:"name" }
   
]









export const AllOpportunitiesheader: any[] = [
    { id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie", displayType:"capsFirstCase"},
    { id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase" },
    { id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type', displayType:"capsFirstCase" },
    { id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true },
    { id: 5, isFilter:false, name: 'Owner', isFixed: false, order: 5, title: 'Owner', displayType:"name" },
    { id: 6, isFilter:false, name: 'Stage', isFixed: false, order: 6, title: 'Stage', displayType:"capsFirstCase" },
    { id: 7, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 7, title: 'Est. closure date', displayType:"date", dateFormat:'dd-MMM-yyyy' },
    { id: 8, isFilter:false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical'},
    { id: 9, isFilter:false, name: 'EstTCV', isFixed: false, order: 9, title: 'Est. TCV ', displayType:"currency",isSortDisable:true },
    { id: 10, isFilter:false, name: 'Currency', isFixed: false, order: 10, title: 'Currency', displayType:"capsFirstCase" },
    { id: 11, isFilter:false, name: 'ProposalType', isFixed: false, order:11,title: 'Proposal type' },
    { id: 12, isFilter:false, name: 'Status', isFixed: false, order: 12, title: 'Status',isStatus:true, displayType:"capsFirstCase" }
  ]

  export const openOpportunityheader: any[] = [
    { id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie", displayType:"capsFirstCase"},
    { id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase" },
    { id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type', displayType:"capsFirstCase" },
    { id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true },
    { id: 5, isFilter:false, name: 'Owner', isFixed: false, order: 5, title: 'Owner', displayType:"name" },
    { id: 6, isFilter:false, name: 'Stage', isFixed: false, order: 6, title: 'Stage', displayType:"capsFirstCase" },
    { id: 7, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 7, title: 'Est. closure date', displayType:"date", dateFormat:'dd-MMM-yyyy' },
    { id: 8, isFilter:false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical'},
    { id: 9, isFilter:false, name: 'EstTCV', isFixed: false, order: 9, title: 'Est. TCV ', displayType:"currency" },
    { id: 10, isFilter:false, name: 'Currency', isFixed: false, order: 10, title: 'Currency', displayType:"capsFirstCase" },
    { id: 11, isFilter:false, name: 'ProposalType', isFixed: false, order:11,title: 'Proposal type'},
    { id: 12, isFilter:false, name: 'Status', isFixed: false, order: 12, title: 'Status',isStatus:true, displayType:"capsFirstCase" }
]



export const ReopenApprovalheader: any[] = [
    { id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie", displayType:"capsFirstCase"},
    { id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase" },
    { id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type', displayType:"capsFirstCase" },
    { id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true},
    { id: 5, isFilter:false, name: 'Owner', isFixed: false, order: 5, title: 'Owner', displayType:"name" },
    { id: 6, isFilter:false, name: 'Stage', isFixed: false, order: 6, title: 'Stage', displayType:"capsFirstCase" },
    { id: 7, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 7, title: 'Est. closure date', displayType:"date", dateFormat:'dd-MMM-yyyy' },
    { id: 8, isFilter:false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical' },
    { id: 9, isFilter:false, name: 'EstTCV', isFixed: false, order: 9, title: 'Est. TCV ', displayType:"currency" },
    { id: 10, isFilter:false, name: 'Currency', isFixed: false, order: 10, title: 'Currency', displayType:"capsFirstCase" },
    { id: 11, isFilter:false, name: 'ProposalType', isFixed: false, order:11,title: 'Proposal type' },
    { id: 12, isFilter:false, name: 'Status', isFixed: false, order: 12, title: 'Status',isStatus:true, displayType:"capsFirstCase" }
]


@Injectable({
    providedIn: 'root'
})
export class allopportunityService {
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiServiceUI,private apiServiceOpportunity:ApiServiceOpportunity) { }

    getAll(): Observable<allopportunity[]> {
        return this.apiService.get(routes.allopportunitiesTab);
    }

    getAllOpportunities(): Observable<any[]> {
        return this.apiService.get(routes.AllOpportunitiesDetails);
    }

    getOpenOpportunity():Observable<any[]> {
        return this.apiService.get(routes.openopportunities);
    }

    getAllReopenApproval():Observable<any[]> {
        return this.apiService.get(routes.reopenApproval);
    }

    getAllOpportunitiesLanding(reqBody){
        return this.apiServiceOpportunity.post(routes.getAllOpportunitiesUrl,reqBody);
    }
    
    getListCount(reqBody){
        return this.apiServiceOpportunity.post(routes.getListCount,reqBody);
    }
    getAllRevokeAccess():Observable<any[]> {
        return this.apiService.get(routes.revokeAccess);
    }

    getAllobforecast():Observable<any[]> {
        return this.apiService.get(routes.obforecast);
    }
    

}
