// Meghana code starts 11/02/2019
import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { Observable, of } from 'rxjs';

import {
    AccountLandingFarming, AccountLandingReserve, ActiveRequests, History,
    CreationHistory, CreationActiveRequests, ActiveRequestsSBU, ActiveRequestsCSO,
    AccountLandingAlliance,
    ModificationActiveRequestsSBU,
    ModificationActiveRequestsCSO
} from '../models/account.model';
import { ApiServiceUI } from './api.service';
import { AccountTeamsComponent } from '@app/modules/account/pages/account-teams/account-teams.component';

const routes = {
    // account landing(3 tabs)
    accountsfarming: '/accountsfarming',
    accountsreserve: '/accountsreserve',
    accountsalliance: '/accountsalliance',

    //account merge table
    mergeReqSingleTable:'/mergeReqSingleTable',
    targetaccount: '/targetaccount',

    // account creation(2 tabs + based on login)
    creationactiverequests: '/creationactiverequests',
    activerequestssbu: '/activerequestssbu',
    activerequestscso: '/activerequestscso',
    creationhistory: '/creationhistory',

    // account modification(2 tabs + based on login)
    activerequests: '/activerequests',
    modificationactiverequestssbu: '/modificationactiverequestssbu',
    modificationactiverequestscso: '/modificationactiverequestscso',
    modificationhistory: '/modificationhistory',

    // account finder
    accountsearch: '/accountsearch',
    // account ownership
    // ownershiphistory:'/ownershiphistory',
    // account contracts(2 tabs)
    pendingrequests: '/pendingrequests',
    contractrepository: '/contractrepository',

    // account contacts(2 tabs)
    accountcontacts: '/accountcontacts',
    relationshipplan: '/relationshipplan',
   
    //account team
    accountteam: '/accountteam',

    //   account management log
    managementlog: '/managementlog',
    ownershiphistory: '/accountownershiphistory',

    //source account
    SourceAccount: '/SourceAccountTable'
};

// account landing(3 tabs)
export const headerfarming: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', isSortDisable: false},
    { id: 2, isFilter: false, name: 'Number', isFixed: false, order: 2, title: 'Number', isSortDisable: true },
    // { id: 3, isFilter: false, name: 'RANumber', isFixed: false, order: 3, title: 'RA Number', isSortDisable: true }, //chethana Bug 20374
    { id: 3, isFilter: false, name: 'Owner', isFixed: false, order: 3, title: 'Owner', isSortDisable: false, displayType: 'name' },
    { id: 4, isFilter: false, name: 'Type', isFixed: false, order: 4, title: 'Type', isSortDisable: false, displayType: 'name' },
    { id: 5, isFilter: false, name: 'Classification', isFixed: false, order: 5, title: 'Classification', isSortDisable: false, displayType: 'name' },
    { id: 6, isFilter: false, name: 'Sbu', isFixed: false, order: 6, title: 'SBU', isSortDisable: true },
    { id: 7, isFilter: false, name: 'Vertical', isFixed: false, order: 7, title: 'Vertical', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Subvertical', isFixed: false, order: 8, title: 'Sub-vertical', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Georeference', isFixed: false, order: 8, title: 'Geo', isSortDisable: true },//chethana Bug 20374
    { id: 10, isFilter: false, name: 'Country', isFixed: false, order: 10, title: 'Country', isSortDisable: false },
    { id: 11, isFilter: false, name: 'City', isFixed: false, order: 11, title: 'City region', isSortDisable: true, displayType: 'name' },
    { id: 12, isFilter: false, name: 'Parentaccount', isFixed: false, order: 12, title: 'Parent account', className: 'approvalstatus', isSortDisable: true },
   
   
  
   
    // { id: 10, isFilter: false, name: 'Primary', isFixed: false, order: 10, title: 'Primary', isSortDisable: true ,hideFilter:true},//chethana Bug 20374
   
    // { id: 14, isFilter: false, name: 'Countryreference', isFixed: false, order: 14, title: 'Country (Reference)', isSortDisable: true },//chethana Bug 20374
    // { id: 15, isFilter: false, name: 'Regionrefernce', isFixed: false, order: 15, title: 'Region (Reference)', isSortDisable: true },//chethana Bug 20374

    // { id: 16, isFilter: false, name: 'Georeference', isFixed: false, order: 16, title: 'Geo (Reference)', isSortDisable: true  },//chethana Bug 20374
   

];


// account merge header
export const mergeReqSingleTable: any[] = [
    { id: 1, isFilter: false, name: 'ReferenceNumber', isFixed: true, order: 1, title: 'Reference number', displayType: 'name', selectName:"Account Merge Request", isSortDisable: false, hideFilter: false },
    { id: 2, isFilter: false, name: 'MergeRequestName', isFixed: false, order: 2, title: 'Merge request name', isSortDisable: true, hideFilter: false },
    { id: 3, isFilter: false, name: 'RequestedDate', isFixed: false, order: 3, title: 'Requested date', isSortDisable: false, displayType: 'date', dateFormat: 'dd-MMM-yyyy', isHideColumnSearch: true },
    { id: 4, isFilter: false, name: 'RequestedBy', displayType: "name", isFixed: false, order: 4, title: 'Requested by', isSortDisable: false, hideFilter: false },
    { id: 5, isFilter: false, name: 'Status', displayType: "name", isFixed: false, order: 5, title: 'Status', isStatus: true, isSortDisable: false, hideFilter: false }
];
//helpdesk Target Account
export const headerTargetAccount: any[] = [
    { id: 1, name: 'Accountnumber', isFixed: true, hideFilter: true, order: 1, isFilter:false, title: 'Account number',tableName: 'Target Account', className:"notlinkcol black-text", displayType:"upperCase"},
    { id: 2, name: 'Accountname', isFixed: false, hideFilter: true, isFilter:false,  order: 2, title: 'Account name',displayType:"upperCase" },
    { id: 3, name: 'AccountOwner', isFixed: false, hideFilter: true, isFilter:false,  order: 3, title: 'Account Owner', displayType:"name" },
    { id: 4, name: 'Region', isFixed: false, isFilter:false, hideFilter: true,  order: 4, title: 'Region', displayType:"upperCase"},
    { id: 5, name: 'Accountclassification',isFixed: false, hideFilter: true, isFilter:false,  order: 5, title: 'Account classification', displayType:"name" },
    { id: 6, name: 'Hassubaccounts',isFixed: false, hideFilter: true, isFilter:false,  order: 6, title: 'Has sub accounts ?', displayType:"name", isSortDisable:true },
];



export const headerreserve: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', isSortDisable: false },
    { id: 2, isFilter: false, name: 'Number', isFixed: false, order: 2, title: 'Number', isSortDisable: true },
    { id: 3, isFilter: false, name: 'Status', isFixed: false, order: 3, title: 'Status', isStatus: true, isSortDisable: true },
    { id: 4, isFilter: false, name: 'Type', isFixed: false, order: 4, title: 'Type', isSortDisable: false, displayType: 'name' },
    { id: 5, isFilter: false, name: 'Owner', isFixed: false, order: 5, title: 'Owner', isSortDisable: false, displayType: 'name' },
    { id: 6, isFilter: false, name: 'Sbu', isFixed: false, order: 6, title: 'SBU', isSortDisable: true },
    { id: 7, isFilter: false, name: 'Vertical', isFixed: false, order: 7, title: 'Vertical', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Subvertical', isFixed: false, order: 8, title: 'Sub-vertical', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Geo', isFixed: false, order: 9, title: 'Geo', isSortDisable: true },
];
export const headeralliance: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', isSortDisable: false},
    { id: 2, isFilter: false, name: 'Number', isFixed: false, order: 2, title: 'Number', isSortDisable: true },
    { id: 3, isFilter: false, name: 'Status', isFixed: false, order: 3, title: 'Status', isStatus: true, isSortDisable: true },
    { id: 4, isFilter: false, name: 'Type', isFixed: false, order: 4, title: 'Type', isSortDisable: true, displayType: 'name' },
    { id: 5, isFilter: false, name: 'Owner', isFixed: false, order: 5, title: 'Owner', isSortDisable: false, displayType: 'name' },
    { id: 6, isFilter: false, name: 'Sbu', isFixed: false, order: 6, title: 'SBU', isSortDisable: true },
    { id: 7, isFilter: false, name: 'Vertical', isFixed: false, order: 7, title: 'Vertical', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Subvertical', isFixed: false, order: 8, title: 'Sub-vertical', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Geo', isFixed: false, order: 9, title: 'Geo', isSortDisable: true },
];
export const headerAnalystAdvisor: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', isSortDisable: false},
    { id: 2, isFilter: false, name: 'Number', isFixed: false, order: 2, title: 'Number', isSortDisable: true },
    { id: 3, isFilter: false, name: 'Status', isFixed: false, order: 3, title: 'Status', isStatus: true, isSortDisable: true },
    { id: 4, isFilter: false, name: 'Type', isFixed: false, order: 4, title: 'Type', isSortDisable: true, displayType: 'name' },
    { id: 5, isFilter: false, name: 'Owner', isFixed: false, order: 5, title: 'Owner', isSortDisable: false, displayType: 'name' },
    { id: 6, isFilter: false, name: 'Sbu', isFixed: false, order: 6, title: 'SBU', isSortDisable: true },
    { id: 7, isFilter: false, name: 'Vertical', isFixed: false, order: 7, title: 'Vertical', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Subvertical', isFixed: false, order: 8, title: 'Sub-vertical', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Geo', isFixed: false, order: 9, title: 'Geo', isSortDisable: true },
];

// account creation(2 tabs + based on login)
export const headercreationactiverequests: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', subProp: ['account', 'rejectReason'], isSortDisable: false},
    // { id: 2, isFilter: false, name: 'Number', isFixed: false, order: 2, title: 'Number', isSortDisable: true, hideFilter: true },
    { id: 2, isFilter: false, name: 'Requesttype', isFixed: false, order: 2, title: 'Request type', isSortDisable: true, displayType: 'name' },
    { id: 3, isFilter: false, name: 'Requestdate', isFixed: false, order: 3, title: 'Requested date', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isSortDisable: false, isHideColumnSearch: true },
    { id: 4, isFilter: false, name: 'Swapaccount', isFixed: false, order: 4, title: 'Swap account', displayType: 'name', className: 'approvalstatus', isSortDisable: true },
    { id: 5, isFilter: false, name: 'Status', isFixed: false, order: 5, title: 'Status', isStatus: true, isSortDisable: false },
    // { id: 7, isFilter: false, name: 'Pendingwith', isFixed: false, order: 7, title: 'Pending with', className: 'approvalstatus' },
    // { id: 7, isFilter: false, name: 'Type', isFixed: false, order: 8, title: 'Type', isSortDisable: true, displayType: 'name', },
    { id: 6, isFilter: false, name: 'Owner', isFixed: false, order: 6, title: 'Owner', isInfoStatus: true, isSortDisable: true, displayType: 'name' },
];


export const headercreationactiverequestspendingwith: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', subProp: ['account', 'rejectReason'], isSortDisable: false },
    // { id: 2, isFilter: false, name: 'Number', isFixed: false, order: 2, title: 'Number', isSortDisable: true, hideFilter: true },
    { id: 2, isFilter: false, name: 'Requesttype', isFixed: false, order: 2, title: 'Request type', isSortDisable: true, displayType: 'name' },
    { id: 3, isFilter: false, name: 'Requestdate', isFixed: false, order: 3, title: 'Requested date', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isSortDisable: false, isHideColumnSearch: true },
    { id: 4, isFilter: false, name: 'Swapaccount', isFixed: false, order: 4, title: 'Swap account', className: 'approvalstatus', isSortDisable: true, displayType: 'name' },
    { id: 5, isFilter: false, name: 'Status', isFixed: false, order: 5, title: 'Status', isStatus: true, isSortDisable: true },
    // { id: 7, isFilter: false, name: 'Type', isFixed: false, order: 7, title: 'Type', isSortDisable: true, displayType: 'name' },
    { id: 6, isFilter: false, name: 'Owner', isFixed: false, order: 6, title: 'Owner', isInfoStatus: true, isSortDisable: true, displayType: 'name' },
];
export const headeractiverequestssbu: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', subProp: ['account', 'rejectReason'], isSortDisable: false},
    // { id: 2, isFilter: false, name: 'Number', isFixed: false, order: 2, title: 'Number', isSortDisable: true, hideFilter: true },
    { id: 2, isFilter: false, name: 'Requesttype', isFixed: false, order: 2, title: 'Request type', isSortDisable: true, displayType: 'name' },
    { id: 3, isFilter: false, name: 'Requestdate', isFixed: false, order: 3, title: 'Requested date', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isSortDisable: false, isHideColumnSearch: true },
    { id: 4, isFilter: false, name: 'Swapaccount', isFixed: false, order: 4, title: 'Swap account', isSortDisable: true, displayType: 'name' },
    { id: 5, isFilter: false, name: 'Status', isFixed: false, order: 5, title: 'Status', isStatus: true, isSortDisable: false },
    // { id: 7, isFilter: false, name: 'Type', isFixed: false, order: 7, title: 'Type', isSortDisable: true, displayType: 'name' },
    { id: 6, isFilter: false, name: 'Owner', isFixed: false, order: 6, title: 'Owner', isInfoStatus: true, isSortDisable: true, displayType: 'name' },
    { id: 7, isFilter: false, name: 'Sbu', isFixed: false, order: 7, title: 'SBU', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Subvertical', isFixed: false, order: 9, title: 'Sub-vertical', isSortDisable: true },
    { id: 10, isFilter: false, name: 'Geo', isFixed: false, order: 10, title: 'Geo' },
];
export const headerassigactiverequestssbu: any[] = [
    // { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name',  subProp:['account','rejectReason']},
    { id: 1, isFilter: false, name: 'Number', isFixed: true, order: 1, title: 'Account number', isSortDisable: true },
    { id: 2, isFilter: false, name: 'Requesttype', isFixed: false, order: 2, title: 'Status', isStatus: true, isSortDisable: false },
    { id: 3, isFilter: false, name: 'Requestdate', isFixed: false, order: 3, title: 'Requested date', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isSortDisable: false, isHideColumnSearch: true },
    { id: 4, isFilter: false, name: 'Owner', isFixed: false, order: 4, title: 'Owner', isSortDisable: true, displayType: 'name' },
    { id: 5, isFilter: false, name: 'Vertical', isFixed: false, order: 5, title: 'Vertical', isSortDisable: true },
    { id: 6, isFilter: false, name: 'Subvertical', isFixed: false, order: 6, title: 'Sub-vertical', isSortDisable: true },
    { id: 7, isFilter: false, name: 'Geo', isFixed: false, order: 7, title: 'Geo', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Region', isFixed: false, order: 8, title: 'Region', isSortDisable: true },

];
export const headerassighistoryrequestssbu: any[] = [
    // { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name',  subProp:['account','rejectReason']},
    { id: 1, isFilter: false, name: 'Number', isFixed: true, order: 1, title: 'Account number', isSortDisable: false },
    { id: 2, isFilter: false, name: 'Requesttype', isFixed: false, toolTip: 'ApprovedRejectedBy', order: 2, title: 'Status', isStatus: true, isSortDisable: true },
    { id: 3, isFilter: false, name: 'Requestdate', isFixed: false, order: 3, title: 'Requested date', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isSortDisable: false, isHideColumnSearch: true },
    { id: 4, isFilter: false, name: 'Owner', isFixed: false, order: 4, title: 'Owner', isSortDisable: false, displayType: 'name' },
    { id: 5, isFilter: false, name: 'Vertical', isFixed: false, order: 5, title: 'Vertical', isSortDisable: true },
    { id: 6, isFilter: false, name: 'Subvertical', isFixed: false, order: 6, title: 'Sub-vertical', isSortDisable: true },
    { id: 7, isFilter: false, name: 'Geo', isFixed: false, order: 7, title: 'Geo', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Region', isFixed: false, order: 8, title: 'Region', isSortDisable: true },

];

export const headeractiverequestscso: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', subProp: ['account', 'rejectReason'], isSortDisable: false },
    // { id: 2, isFilter: false, name: 'Number', isFixed: false, order: 2, title: 'Number', isSortDisable: true },
    { id: 2, isFilter: false, name: 'Requesttype', isFixed: false, order: 2, title: 'Request type', isSortDisable: true },
    { id: 3, isFilter: false, name: 'Requestdate', isFixed: false, order: 3, title: 'Request date', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isSortDisable: false, isHideColumnSearch: true },
    { id: 4, isFilter: false, name: 'Swapaccount', isFixed: false, order: 4, title: 'Swap account', isInfoStatus: true, isSortDisable: true },
    { id: 5, isFilter: false, name: 'Status', isFixed: false, order: 5, title: 'Status', isStatus: true, isSortDisable: false },
    // { id: 7, isFilter: false, name: 'Type', isFixed: false, order: 7, title: 'Type', displayType: 'name', isSortDisable: true },
    { id: 6, isFilter: false, name: 'Owner', isFixed: false, order: 6, title: 'Owner', displayType: 'name', isSortDisable: true },
    { id: 7, isFilter: false, name: 'Sbu', isFixed: false, order: 7, title: 'SBU', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Subvertical', isFixed: false, order: 9, title: 'Sub-vertical', isSortDisable: true },
    { id:10, isFilter: false, name: 'Geo', isFixed: false, order: 10, title: 'Geo', isSortDisable: true },
];

export const headercreationhistory: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', isSortDisable: false },
    { id: 2, isFilter: false, name: 'Number', isFixed: false, order: 2, title: 'Number', isSortDisable: true },
    { id: 3, isFilter: false, name: 'Requesttype', displayType: 'name', isFixed: false, order: 3, title: 'Request type', isSortDisable: true },
    { id: 4, isFilter: false, name: 'Requestdate', isFixed: false, order: 4, title: 'Requested date', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isSortDisable: false, isHideColumnSearch: true },
    { id: 5, isFilter: false, name: 'Decisiondate', isFixed: false, order: 5, title: 'Decision date', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isSortDisable: false, isHideColumnSearch: true },
    { id: 6, isFilter: false, name: 'Status', isFixed: false, order: 6, title: 'Status', isStatus: true, toolTip: 'ApprovedRejStatus', isSortDisable: false },
    { id: 7, isFilter: false, name: 'Type', displayType: 'name', isFixed: false, order: 7, title: 'Type', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Owner', displayType: 'name', isFixed: false, order: 8, title: 'Owner', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Sbu', isFixed: false, order: 9, title: 'SBU', isSortDisable: true },
    { id: 10, isFilter: false, name: 'Vertical', isFixed: false, order: 10, title: 'Vertical', isSortDisable: true },
    { id: 11, isFilter: false, name: 'Requestor', displayType: 'name', isFixed: false, order: 11, title: 'Requestor', isSortDisable: true },
    { id: 12, isFilter: false, name: 'Subvertical', isFixed: false, order: 12, title: 'Sub-vertical', isSortDisable: true },
    { id: 13, isFilter: false, name: 'Geo', isFixed: false, order: 13, title: 'Geo', isSortDisable: true },
];

// account modification(2 tabs + based on login)
export const headeractiverequests: any[] = [
    { id: 1, isFilter: false, name: 'Name',isFixed: true, order: 1, title: 'Name', isSortDisable: false },
    { id: 2, isFilter: false, name: 'accountnumber',isFixed: true, order: 2, title: 'Number', isSortDisable: false },
    { id: 3, isFilter: false, name: 'Accountowner', displayType: 'name', isFixed: false, order: 3, title: 'Account owner', isSortDisable: true },
    { id: 4, isFilter: false, name: 'Accounttype', displayType: 'name', isFixed: false, order: 4, title: 'Account type', isSortDisable: true },
    { id: 5, isFilter: false, name: 'Requesttype', displayType: 'name', isFixed: false, order: 5, title: 'Request type', isSortDisable: true },
    { id: 6, isFilter: false, name: 'Approvalstatus', isFixed: false, order: 6, title: 'Approval status', isStatus: true, isSortDisable: false },
    { id: 7, isFilter: false, name: 'Sbu', isFixed: false, order: 7, title: 'SBU', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Subvertical', isFixed: false, order: 9, title: 'Sub-vertical', isSortDisable: true },
    { id: 10, isFilter: false, name: 'Geo', isFixed: false, order: 10, title: 'Geo', isSortDisable: true },
];
export const headermodificationactiverequestssbu: any[] = [
    { id: 1, isFilter: false, name: 'Name',isFixed: true, order: 1, title: 'Name', isSortDisable: false },
    { id: 2, isFilter: false, name: 'accountnumber',isFixed: true, order: 2, title: 'Number', isSortDisable: false },
    { id: 3, isFilter: false, name: 'Accountowner', displayType: 'name', isFixed: false, order: 3, title: 'Account owner', isSortDisable: true },
    { id: 4, isFilter: false, name: 'Accounttype', displayType: 'name', isFixed: false, order: 4, title: 'Account type', isSortDisable: true },
    { id: 5, isFilter: false, name: 'Requesttype', displayType: 'name', isFixed: false, order: 5, title: 'Request type', isSortDisable: true },
    { id: 6, isFilter: false, name: 'Approvalstatus', isFixed: false, order: 6, title: 'Approval status', isStatus: true, isSortDisable: false },
    { id: 7, isFilter: false, name: 'Sbu', isFixed: false, order: 7, title: 'SBU', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Subvertical', isFixed: false, order: 9, title: 'Sub-vertical', isSortDisable: true },
    { id: 10, isFilter: false, name: 'Geo', isFixed: false, order: 10, title: 'Geo', isSortDisable: true },
];
export const headermodificationactiverequestscso: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', isSortDisable: false },
    { id: 2, isFilter: false, name: 'accountnumber',isFixed: true, order: 2, title: 'Number', isSortDisable: false },
    { id: 3, isFilter: false, name: 'Accountowner', displayType: 'name', isFixed: false, order: 3, title: 'Account owner', isSortDisable: true },
    { id: 4, isFilter: false, name: 'Accounttype', displayType: 'name', isFixed: false, order: 4, title: 'Account type', isSortDisable: true },
    { id: 5, isFilter: false, name: 'Requesttype', displayType: 'name', isFixed: false, order: 5, title: 'Request type', isSortDisable: true },
    { id: 6, isFilter: false, name: 'Approvalstatus', isFixed: false, order: 6, title: 'Approval status', isStatus: true, isSortDisable: false },
    { id: 7, isFilter: false, name: 'Sbu', isFixed: false, order: 7, title: 'SBU', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Subvertical', isFixed: false, order: 9, title: 'Sub-vertical', isSortDisable: true },
    { id: 10, isFilter: false, name: 'Geo', isFixed: false, order: 10, title: 'Geo', isSortDisable: true },
];
export const headermodificationhistory: any[] = [
    { id: 1, isFilter: false, name: 'Name',  isFixed: true, order: 1, title: 'Name', isSortDisable: false },
    { id: 2, isFilter: false, name: 'Number', isFixed: false, order: 2, title: 'Number', isSortDisable: true },
    { id: 3, isFilter: false, name: 'Requesttype', isFixed: false, order: 3, title: 'Request type', isSortDisable: true },
    { id: 4, isFilter: false, name: 'Requestdate', isFixed: false, order: 4, title: 'Requested date', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isSortDisable: false, isHideColumnSearch: true },
    { id: 5, isFilter: false, name: 'Status', isFixed: false, order: 5, title: 'Status', isStatus: true, toolTip: 'ApprovedRejStatus', isSortDisable: false },
    { id: 6, isFilter: false, name: 'Type', displayType: 'name', isFixed: false, order: 6, title: 'Type', isSortDisable: true },
    { id: 7, isFilter: false, name: 'Owner', displayType: 'name', isFixed: false, order: 7, title: 'Owner', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Sbu', isFixed: false, order: 8, title: 'SBU', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Vertical', isFixed: false, order: 9, title: 'Vertical', isSortDisable: true },
    { id: 10, isFilter: false, name: 'Requestor', displayType: 'name', isFixed: false, order: 10, title: 'Requestor', isSortDisable: true },
    { id: 11, isFilter: false, name: 'Subvertical', isFixed: false, order: 11, title: 'Sub-vertical', isSortDisable: true },
    { id: 12, isFilter: false, name: 'Geo', isFixed: false, order: 12, title: 'Geo', isSortDisable: true },
];

// account finder
export const accountsearch: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name',isSortDisable: false },
    { id: 2, isFilter: false, name: 'Number', isFixed: false, order: 2, title: 'Number', isSortDisable: true },
    { id: 3, isFilter: false, name: 'Status', isFixed: false, order: 3, title: 'Status', isSortDisable: false, hideFilter: true },
    { id: 4, isFilter: false, name: 'Type', displayType: 'name', isFixed: false, order: 4, title: 'Type', isSortDisable: false },
    { id: 5, isFilter: false, name: 'Owner', displayType: 'name', isFixed: false, order: 5, title: 'Owner', isStatus: false },
    { id: 6, isFilter: false, name: 'SBU', isFixed: false, order: 6, title: 'SBU', isSortDisable: true },
    { id: 7, isFilter: false, name: 'Vertical', isFixed: false, order: 7, title: 'Vertical', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Subvertical', isFixed: false, order: 10, title: 'Sub-vertical', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Geo', isFixed: false, order: 11, title: 'Geo', isSortDisable: true },
    { id: 10, isFilter: false, name: 'AccountCategory', isFixed: false, order: 12, title: 'Account category', isSortDisable: true },
];


// account ownership
export const ownershiphistory: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name',isSortDisable: false, hideFilter: true },
    { id: 2, isFilter: false, name: 'Emailid', isFixed: false, order: 2, title: 'Email ID', isSortDisable: true, hideFilter: true },
    { id: 3, isFilter: false, name: 'Ownershipstartdate', isFixed: false, order: 3, title: 'Ownership start date', isSortDisable: false, hideFilter: true },
    { id: 4, isFilter: false, name: 'Ownershipenddate', displayType: "name", isFixed: false, order: 4, title: 'Ownership end date', isSortDisable: false, hideFilter: true },
]

// account contracts(2 tabs)
export const headerpendingrequests: any[] = [
    { id: 1, isFilter: false, name: 'Requestcode', isFixed: true, order: 1, title: 'Request code', className: 'notlinkcol' },
    { id: 2, isFilter: false, name: 'Requestname', displayType: 'name', isFixed: false, order: 2, title: 'Request name' },
    { id: 3, isFilter: false, name: 'Status', isFixed: false, order: 3, title: 'Status', isStatus: true },
    { id: 4, isFilter: false, name: 'Createdby', displayType: 'name', isFixed: false, order: 4, title: 'Created by' }
];

export const headercontractrepository: any[] = [
    { id: 1, isFilter: false, name: 'Agreementname', isFixed: true, order: 1, displayType: 'name', title: 'Agreement name', className: 'notlinkcol' },
    { id: 2, isFilter: false, name: 'Agreementcode', isFixed: false, order: 2, title: 'Agreement code' },
    { id: 3, isFilter: false, name: 'Status', isFixed: false, order: 3, title: 'Status', isStatus: true },
    { id: 4, isFilter: false, name: 'Createddate', isFixed: false, order: 4, title: 'Created date', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isHideColumnSearch: true },
    { id: 5, isFilter: false, name: 'Createdby', isFixed: false, order: 5, displayType: 'name', title: 'Created by' }
];

// account contacts(2 tabs)
export const headeraccountcontacts: any[] = [
    { id: 1, isFilter: false, name: 'Name', isFixed: true, order: 1, title: 'Name', routerLink: '/contacts/Contactdetailslanding/contactDetailsChild', popUpProperties: ['Name', 'manager', 'cbu'], tableName: 'Acount' },
    { id: 2, isFilter: false, name: 'job', isFixed: false, order: 2, displayType: 'name', title: 'Job title' },
    { id: 3, isFilter: false, name: 'email', isFixed: false, order: 3, title: 'Email' },
    { id: 4, isFilter: false, name: 'cbu', isFixed: false, order: 4, displayType: 'name', title: 'CBU' },
    { id: 5, isFilter: false, name: 'manager', isFixed: false, order: 5, displayType: 'name', title: 'Reporting manager' },
    { id: 6, isFilter: false, name: 'key', isFixed: false, order: 6, displayType: 'name', title: 'Key contact' },
    { id: 7, isFilter: false, name: 'modified', isFixed: false, order: 7, title: 'Modified on', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isSortDisable: true,isHideColumnSearch: true  },
    // { id: 4, isFilter: false, name: 'Requestdate', isFixed: false, order: 4, title: 'Requested date', displayType: 'date', dateFormat: 'dd-MMM-yyyy', isSortDisable: false, isHideColumnSearch: true },
];

export const headerrelationshipplan: any[] = [
    { id: 1, isFilter: false, name: 'Contactname', isFixed: true, order: 1, displayType: 'name', title: 'Contact name', className: 'notlinkcol', popUpProperties: ['Contactname', 'Keywiprocontact', 'Level'], tableName: 'Relationship', isSortDisable: false },
    { id: 2, isFilter: false, name: 'Title', isFixed: false, order: 2, displayType: 'name', title: 'Title', isSortDisable: false },
    // { id: 3, isFilter: false, name: 'Level', isFixed: false, order: 3, title: 'Level' },
    // { id: 4, isFilter: false, name: 'Score', isFixed: false, order: 4, title: 'Score' },
    { id: 5, isFilter: false, name: 'RelationshipOwner', isFixed: false, order: 5, displayType: 'name', title: 'Relationship Owner', isSortDisable: true },
    { id: 6, isFilter: false, name: 'Contactusingwiproservices', isFixed: false, displayType: 'name', order: 6, title: 'Contact Uses Wipro Services', isSortDisable: true },
    { id: 7, isFilter: false, name: 'Contactworkswithcompetition', isFixed: false, displayType: 'name', order: 7, title: 'Contact Works With Competition', isSortDisable: true },
    { id: 8, isFilter: false, name: 'Keywiprocontact', isModal: true, isFixed: false, order: 8, title: 'Key Wipro Contact Name', isSortDisable: true },
    { id: 9, isFilter: false, name: 'Relationshiptheme', isModal: true, isFixed: false, order: 9, title: 'Relationship Theme', isSortDisable: false },
    // { id: 8, isFilter: false, name: 'Relationshipindicator', isFixed: false, order: 8, title: 'Relationship indicator' },
    // { id: 10, isFilter: false, name: 'MeetingFrequency', isFixed: false, order: 10, title: 'Meeting Frequency' },
    // { id: 11, isFilter: false, name: 'Strategytoimproverelationship', isFixed: false, order: 11, title: 'Strategy to improve relationship' },

];

// account TeamsComponent(2 tabs)
// { id: 1, isFilter:false, name: 'Role', isFixed: true, order: 1, title: 'Role', controltype:'select', allias:'_Role', closePopUp:false, isDuplicateValidationReq : true},
// { id: 2, isFilter:false, name: 'Request', isFixed: false, order: 2, title: 'Request', controltype:'switch',closePopUp:false, toggleSwitch:true,hideFilter:true },
// { id: 3, isFilter:false, name: 'Username', isFixed: false, relationship:'Request', order: 3, title: 'Name', controltype:'autocomplete', allias:'_Username', isInitialColumn: true },
// { id: 4, isFilter:false, name: 'SAPcustomercode', isFixed: false, order: 4, title: 'Start date', controltype:'date', dateFormat:'dd-MMM-yyyy'},
// { id: 5, isFilter:false, name: 'SAPcustomername', isFixed: false, order: 5, title: 'End date/stage', controltype:'selectSwitchDate',dateFormat:'dd-MMM-yyyy', allias:'_SAPcustomername', isInlineStage:true, closePopUp:false },
// { id: 6, isFilter:false, name: 'Geo', isFixed: false, order: 6, title: 'Time allocated per week ', controltype:'select',allias:'_Geo',closePopUp:false },
// { id: 7, isFilter:false, name: 'Delivery', isFixed: false, order: 7, title: 'Delivery', controltype:'switch',closePopUp:false, toggleSwitch:true,hideFilter:true },
export const headernonincentiveuser: any[] = [
    { id: 1, isFilter: false, name: 'Username', isFixed: true, order: 1, title: 'Non-incentivized user name', controltype: 'autocomplete', validation: '&Username', IsRequired: true, ValidMsg: ['User name is required'], ErrorMessage: '#Username', closePopUp: false, allias: '_Username', isInitialColumn: true, popUpProperties: ['_Username'], tableName: 'Non-Incentives', isSortDisable: false },
    { id: 2, isFilter: false, name: 'IMSrole', isFixed: false, order: 2, title: 'Function', controltype: 'select', allias: '_IMSrole', validation: '&IMSrole', IsRequired: true, ValidMsg: ['Function is required'], ErrorMessage: '#IMSrole', isSortDisable: false },
    { id: 3, isFilter: false, name: 'Addedby', isFixed: false, order: 3, title: 'Added By', controltype: 'readonly', isSortDisable: false },

    // { id: 4, isFilter: false, name: 'SAPcustomername', isFixed: false, order: 4, title: 'SAP customer name', controltype: 'autocomplete', closePopUp: false, data: [] },
    // { id: 5, isFilter: false, name: 'Geo', isFixed: false, order: 5, title: 'Geo', controltype: 'autocomplete', closePopUp: false, data: [] },

];

export const headerincentiveuser: any[] = [
    { id: 1, isFilter: false, name: 'Username', isFixed: true, order: 1, title: 'Incentivized user name', displayType: 'name', isInitialColumn: true, isSortDisable: false },
    { id: 2, isFilter: false, name: 'IMSrole', isFixed: false, order: 2, title: 'IMS role', displayType: 'name', isSortDisable: false },
    { id: 3, isFilter: false, name: 'SAPcustomercode', isFixed: false, order: 3, title: 'Business unit', displayType: 'name', isSortDisable: false },
    { id: 4, isFilter: false, name: 'SAPcustomername', isFixed: false, order: 4, title: 'Group customer name', displayType: 'name', isSortDisable: false },
    { id: 5, isFilter: false, name: 'Geo', isFixed: false, order: 5, title: 'Geo', isSortDisable: false },

];
// account managemnet log
export const headermanagementlog: any[] = [
    { id: 1, isFilter: false, name: 'Meetingtype', isFixed: true, order: 1, title: 'Meeting type', displayType: 'name', className: 'notlinkcol', tableName: 'Mangement-Log', isSortDisable: true },
    { id: 2, isFilter: false, name: 'Dateofmeeting', isFixed: false, order: 2, title: 'Date of meeting', isSortDisable: false, isHideColumnSearch: true, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
    { id: 3, isFilter: false, name: 'Starttime', displayType: 'upperCase', isFixed: false, order: 3, title: 'Start time', isSortDisable: false, hideFilter: true },
    { id: 4, isFilter: false, name: 'Duration', isFixed: false, order: 4, title: 'Duration', isSortDisable: false, hideFilter: false },
    // { id: 4, isFilter: false, name: 'Timezone', isFixed: false, order: 4, title: 'Time zone' },
    // { id: 5, isFilter: false, name: 'Meetingtype', isFixed: false, order: 5, title: 'Meeting type' },
    { id: 5, isFilter: false, name: 'Meetingstage', isFixed: false, order: 5, title: 'Meeting stage', displayType: 'name', isSortDisable: false },
    { id: 6, isFilter: false, name: 'Chairpersoncoach', isFixed: false, order: 6, title: 'Chair person/ Coach', displayType: 'name', isSortDisable: false },
    { id: 7, isFilter: false, name: 'Createdby', isFixed: false, order: 7, displayType: 'name', title: 'Created By', isSortDisable: true },
    // { id: 8, isFilter: false, name: 'Mom', isFixed: false, order: 8, title: 'MOM', isImage: true },
];

//source account
export const SourceAccountHeader: any[] = [
    { id: 1, isFilter: false, hideFilter: true, name: 'AccountNumber', isFixed: true, order: 1, title: 'Account Number',tableName: 'Source Account', selectName: 'Source Account', displayType: 'name', },
    { id: 2, isFilter: false, hideFilter: true, name: 'AccountName', isFixed: false, order: 2, title: 'Account Name', isSortDisable: false, displayType: 'name' },
    { id: 3, isFilter: false, hideFilter: true, name: 'AccountOwner', isFixed: false, order: 3, title: 'Account Owner', displayType: 'name'},
    { id: 4, isFilter: false, hideFilter: true, name: 'Region', isFixed: false, order: 4, title: 'Region'},
    { id: 5, isFilter: false, hideFilter: true, name: 'AccountClassification', isFixed: false, order: 5, title: 'Account Classification', displayType: 'name'},
    { id: 6, isFilter: false, hideFilter: true, name: 'Isittop66', isFixed: false, order: 6, title: 'Is it top 66', displayType: 'name', isSortDisable:true},
    { id: 7, isFilter: false, hideFilter: true, name: 'Hassubaccounts', isFixed: false, order: 7, title: 'Has sub accounts?', isSortDisable:true},
];



@Injectable({
    providedIn: 'root'
})
export class AccountService {


    historyitems = [
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
        {
            'StatusName': 'Status: Account requested',
            'StatusData': '(12 Jan 2019 at 15:20)',
            'ReasonName': 'Reason code',
            'ReasonData': '-',
            'CommentsName': 'Comments',
            'CommentsData': 'Lorem ipsum dolor sit amet,  consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
        },
    ];
    loggedin_user = 'account_requestor';
    creation_modification = '';
    confirmapprovalmessage;
    confirmrejectionmessage;
    swapandcreatemessage;
    cachedArray = [];
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiServiceUI,
        /*private http : HttpClient*/) { }

    // ***********************************************Farming-account landing************************************************************
    getAllFarming(): Observable<AccountLandingFarming[]> {
        return this.apiService.get(routes.accountsfarming);
    }
    // ***********************************************Farming-account landing************************************************************

    // ***********************************************Reserve - account landing************************************************************
    getAllReserve(): Observable<AccountLandingReserve[]> {
        return this.apiService.get(routes.accountsreserve);
    }
    // ***********************************************Reserve - account landing************************************************************

    // ***********************************************alliance - account landing************************************************************
    getAllAlliance(): Observable<AccountLandingAlliance[]> {
        return this.apiService.get(routes.accountsalliance);
    }
    // ***********************************************alliance - account landing************************************************************

    // ***********************************************account requestor - account creation************************************************************
    getAllCreationActiveRequests(): Observable<CreationActiveRequests[]> {
        return this.apiService.get(routes.creationactiverequests);
    }
    // ***********************************************account requestor - account creation************************************************************

    // ***********************************************SBU - account creation************************************************************
    getAllActiveRequestsSBU(): Observable<ActiveRequestsSBU[]> {
        return this.apiService.get(routes.activerequestssbu);
    }
    // ***********************************************SBU - account creation************************************************************

    // ***********************************************CSO - account creation************************************************************
    getAllActiveRequestsCSO(): Observable<ActiveRequestsCSO[]> {
        return this.apiService.get(routes.activerequestscso);
    }
    // ***********************************************CSO - account creation************************************************************

    // ***********************************************History - account creation************************************************************
    getAllCreationHistory(): Observable<CreationHistory[]> {
        return this.apiService.get(routes.creationhistory);
    }
    // ***********************************************History - account creation************************************************************

    // ***********************************************account requestor - account modification************************************************************
    getAllActiveRequests(): Observable<ActiveRequests[]> {
        return this.apiService.get(routes.activerequests);
    }
    // ***********************************************account requestor - account modification************************************************************

    // ***********************************************SBU - account modification************************************************************
    getAllModificationActiveRequestsSBU(): Observable<ModificationActiveRequestsSBU[]> {
        return this.apiService.get(routes.modificationactiverequestssbu);
    }
    // ***********************************************SBU - account modification************************************************************

    // ***********************************************CSO - account modification************************************************************
    getAllModificationActiveRequestsCSO(): Observable<ModificationActiveRequestsCSO[]> {
        return this.apiService.get(routes.modificationactiverequestscso);
    }
    // ***********************************************CSO - account modification************************************************************

    // ***********************************************History - account modification************************************************************
    getAllModificationHistory(): Observable<History[]> {
        return this.apiService.get(routes.modificationhistory);
    }
    // ***********************************************History - account modification************************************************************

    // ***********************************************account finder************************************************************
    getAccountdata(): Observable<any[]> {
        return this.apiService.get(routes.accountsearch);
    }
    // ***********************************************account finder************************************************************

    // ***********************************************account contracts - pending requests************************************************************
    getAllPendingRequests(): Observable<any[]> {
        return this.apiService.get(routes.pendingrequests);
    }
    // ***********************************************account contracts - pending requests************************************************************

    // ***********************************************account contracts - contract repository************************************************************
    getAllContractRepository(): Observable<any[]> {
        return this.apiService.get(routes.contractrepository);
    }
    // ***********************************************account contracts - contract repository***********************************************************

    // ***********************************************account contacts - accounts contacts************************************************************
    getAllAccountContacts(): Observable<any[]> {
        return this.apiService.get(routes.accountcontacts);
    }
    // ***********************************************account contacts - relationship plan***********************************************************

    getAllRelationshipPlan(): Observable<any[]> {
        return this.apiService.get(routes.relationshipplan);
    }
    // ***********************************************account contacts - relationship plan***********************************************************

    // ***********************************************account teams - incentive***********************************************************

    getAllAccountTeams(): Observable<any[]> {
        return this.apiService.get(routes.accountteam);
    }
    // ***********************************************account teams - incentive***********************************************************

    // ***********************************************account management log ***********************************************************

    getAllManagementLog(): Observable<any[]> {
        return this.apiService.get(routes.managementlog);
    }
    // ***********************************************account management log***********************************************************

    // ***********************************************account merge log***********************************************************
    get_merge_req_singleTable(): Observable<any[]> {
        return this.apiService.get(routes.mergeReqSingleTable);
    }
    // ***********************************************account merge log***********************************************************
    //source acoount
    getSourceAccount(): Observable<any[]> {
        return this.apiService.get(routes.SourceAccount);
    }
    gettargetaccountdata(): Observable<any[]> {
        return this.apiService.get(routes.targetaccount);
    }



    // ***********************************************post***************************************************************************
    postAllCreationActiveRequests(item: CreationActiveRequests): Observable<CreationActiveRequests> {
        return this.apiService.post(routes.creationactiverequests, item);
    }
    postAllModificationActiveRequests(item: ActiveRequests): Observable<ActiveRequests> {
        return this.apiService.post(routes.activerequests, item);
    }
    getAllRecords(item: any): Observable<any> {
        return this.apiService.post(routes.accountteam, item);
    }

    getownershiphistory(): Observable<any[]> {
        return this.apiService.get(routes.ownershiphistory);
    }



}
export const AccountNameeAdvnHeader: any[] = [
    // { name: 'Name', title: 'Name' }
    { name: 'Name', title: 'Name' },
    { name: 'AccId', title: 'Account Number' },
    { name: 'Ownername', title: 'Account Owner' },
    { name: 'AccType', title: 'Account Type' }

];
export const ParentNameAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'AccId', title: 'Account Number' },
    { name: 'Ownername', title: 'Account Owner' },
    { name: 'AccType', title: 'Account Type' }

];
export const UltimateParentNameAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'AccId', title: 'Account Number' },
    { name: 'Ownername', title: 'Account Owner' },
    { name: 'AccType', title: 'Account Type' }

];
export const OwnerNameAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' }

];
export const AssignmentOwnerNameAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' }

];
export const SbuAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    // { name: 'Id', title: 'SBU Id' }
];
export const verticalAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'SBUData', title: 'SBU' }

    // { name: 'Id', title: 'Vertical Id' }
];
export const subVerticalAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'VerticalData', title: 'Vertical' }
];
export const currencyAdvnHeader: any[] = [
    // { name: 'Name', title: 'Name' },
    { name: 'Desc', title: 'Desc' },
    // {
    //     name: 'CurrencyRateValue', title: 'Currency Rate'
    // },

    {
        name: 'ISOCurrencyCode', title: 'ISO Currency'
    }
    // { name: 'Id', title: 'Id' },


    // { name: 'Id', title: 'Sub vertical Id' }
];
export const geoAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    // { name: 'Id', title: 'Sub vertical Id' }
];
export const regionAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'GeoData', title: 'Geo' }
    // { name: 'Id', title: 'Sub vertical Id' }
];
export const countryAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'GeoData', title: 'Geo' },
    { name: 'RegionData', title: 'Region' },
    // { name: 'Id', title: 'Sub vertical Id' }
];
export const stateAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'RegionData', title: 'Region' },
    { name: 'CountryData', title: 'Country' },

    // { name: 'Id', title: 'Sub vertical Id' }
];
export const cityAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'StateData', title: 'State' },

    // { name: 'Id', title: 'Sub vertical Id' }
];
export const AssignmentverticalAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'SBUData', title: 'SBU' }

    // { name: 'Id', title: 'Vertical Id' }
];
export const AssignmentsubVerticalAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'Vertical', title: 'Vertical' }
];
export const AssignmentgeoAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    // { name: 'Id', title: 'Sub vertical Id' }
];
export const AssignmentregionAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'GeoData', title: 'Geo' }
    // { name: 'Id', title: 'Sub vertical Id' }
];
export const AssignmentcountryAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'GeoData', title: 'Geo' },
    { name: 'RegionData', title: 'RegionData' },
    // { name: 'Id', title: 'Sub vertical Id' }
];
export const ClusterAdvnHeader: any[] = [
    { name: 'Name', title: 'Name' },
    // { name: 'Cluster', title: 'Cluster' }
    // { name: 'Id', title: 'Sub vertical Id' }
];

export const AccountNameListAdvnHeaders = {
    'accountNameSearch': AccountNameeAdvnHeader,
    'parentaccount': ParentNameAdvnHeader,
    'ultimateparent': UltimateParentNameAdvnHeader,
    'owner': OwnerNameAdvnHeader,
    'sbu': SbuAdvnHeader,
    'vertical': verticalAdvnHeader,
    'subvertical': subVerticalAdvnHeader,
    'currencyaccount': currencyAdvnHeader,
    'currency': currencyAdvnHeader,
    'geography': geoAdvnHeader,
    'region': regionAdvnHeader,
    'country': countryAdvnHeader,
    'state': stateAdvnHeader,
    'city': cityAdvnHeader,
    'Assignmentowner': AssignmentOwnerNameAdvnHeader,
    'Assignmentvertical': AssignmentverticalAdvnHeader,
    'Assignmentsubvertical': AssignmentsubVerticalAdvnHeader,
    'Assignmentgeography': AssignmentgeoAdvnHeader,
    'Assignmentregion': AssignmentregionAdvnHeader,
    'Assignmentcountry': AssignmentcountryAdvnHeader,
    'altowner': OwnerNameAdvnHeader,
    'cluster': ClusterAdvnHeader,
    'secondaryowner' : OwnerNameAdvnHeader
};
export const AccountAdvnNames = {

    'accountNameSearch': { name: 'Account Name', isCheckbox: false, isAccount: false },
    'parentaccount': { name: "Parent's Name", isCheckbox: false, isAccount: false },
    'ultimateparent': { name: 'Ultimate Parents Name', isCheckbox: false, isAccount: false },
    'owner': { name: 'Owner Name', isCheckbox: false, isAccount: false },
    'secondaryowner': { name: 'Secondary Owner Name', isCheckbox: false, isAccount: false },
    'sbu': { name: 'Sbu', isCheckbox: false, isAccount: false },
    'vertical': { name: 'Vertical', isCheckbox: false, isAccount: false },
    'subvertical': { name: 'Sub vertical', isCheckbox: false, isAccount: false },
    'currencyaccount': { name: 'Currency', isCheckbox: false, isAccount: false },
    'currency': { name: 'Currency', isCheckbox: false, isAccount: false },
    'geography': { name: 'Geo', isCheckbox: false, isAccount: false },
    'region': { name: 'Region', isCheckbox: false, isAccount: false },
    'country': { name: 'Country', isCheckbox: false, isAccount: false },
    'state': { name: 'State', isCheckbox: false, isAccount: false },
    'city': { name: 'City Region', isCheckbox: false, isAccount: false },
    'Assignmentowner': { name: 'Owner Name', isCheckbox: false, isAccount: false },
    'Assignmentvertical': { name: 'Vertical', isCheckbox: false, isAccount: false },
    'Assignmentsubvertical': { name: 'Sub Vertical', isCheckbox: false, isAccount: false },
    'Assignmentgeography': { name: 'Geo', isCheckbox: false, isAccount: false },
    'Assignmentregion': { name: 'Region', isCheckbox: false, isAccount: false },
    'Assignmentcountry': { name: 'Country', isCheckbox: false, isAccount: false },
    'altowner': { name: 'Alternative Account Owner', isCheckbox: false, isAccount: false },
    'cluster': { name: 'Cluster', isCheckbox: false, isAccount: false },





};


// Meghana code ends 11/02/2019



