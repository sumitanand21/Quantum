import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject, Subject } from 'rxjs';
import { headerArchived, accountheaderArchived } from './archived-leads.service';
import { headerQualified, accountheaderQualified } from './qualified-leads.service';
import { unqualifiedheader, accountunqualifiedheader } from './UnqualifiedLeads.service';
import { campaignheader, activecampaignheader, completedcampaignheader, myactivecampaignheader } from './campaign.service';
import { contactheader } from './contact.service';
import { contactConversationheader } from './contactconversation.service';
import { contactLeadheader } from './contactlead.service';

import { contactCampaignheader } from './contactcampaign.service';
import { conversationheader, accountconversationheader } from './conversation.service';
import { archivedheader, accountarchivedheader } from './archivedConversation.service';
import { childConversationheader } from './threadList.service';
import { Location } from '@angular/common';
import { ExpandHeader } from './actionList.service';
import { ExpandHeaderOthers } from './others-list.service';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { ExpandHeaderSync } from './sync-activity.service';
import { approvalheader } from './approval.service';
import { taskheader } from './task.service';
import { Router } from '@angular/router';

import { contactarchiveheader } from './contactarchive.service';
import { contactcompletecampaignheader, contactallcampaignheader } from './contactcompletecampign.service';
import { contactopenleadheader } from './contactopenlead.service';
import { contactarchiveleadheader } from './contactarchivelead.service';
import { ngxCsv } from 'ngx-csv/ngx-csv';
import { AccountService, headeractiverequestssbu, headeractiverequestscso, headermodificationactiverequestscso, headermodificationactiverequestssbu, headeralliance, headercreationactiverequestspendingwith, headerpendingrequests, headercontractrepository, headeraccountcontacts, headerrelationshipplan, headerincentiveuser, headermanagementlog, headernonincentiveuser, headerassigactiverequestssbu, headerassighistoryrequestssbu, headerAnalystAdvisor, ownershiphistory, mergeReqSingleTable } from '@app/core/services/account.service';

// sprint 3 header imports starts here
import { headeractiverequests, headercreationactiverequests, headerfarming, headerreserve, headermodificationhistory, headercreationhistory, accountsearch, SourceAccountHeader, headerTargetAccount } from './account.service';
// sprint 3 header imports ends here

//  sprint 4 + sprint 7 starts here

import { suspendheader,suspendAccountheader,terminatedheader,terminatedAccountheader,allopportunitiesOwnerList,allopportunitiesOwnerAccountList,allopportunityAccountheader, overdueTabAccountheader, allopportunitiesAccountListheader, wonAccountHeader, wonHeader, overdueTabheader, allopportunitiesListheader, allopportunityheader, AllOpportunitiesheader, openOpportunityheader, ReopenApprovalheader, allrevokeaccessheader, allobforecast } from './allopportunity.service';
import { renewalheader } from './renewal.service';
import { headerteamopportunity } from './team.service';
import { opportunityFinderHeader, orderFinderHeader, searchpoaheader, emailHeader, OpportunitiesService } from './opportunities.service';
import { commitmentheader } from './commitmentregister.service';
import { changeOpportunityHeader } from './changeOpportunity.service';
import { PendingRequestHeader, ContractRepositoryHeader } from './contracts.service';
import { OrderHeader, CreateAmendmentHeader, OrderHeaderBFM, OrderHeaderADH, OrderHeaderDMWT, OrderHeaderDMNONWT, OrderHeaderRetag, OrderHeaderAccount } from './order.service';
//  sprint 4 + sprint 7 ends here

import { taggedHeader, existingDealsHeader, searchDealHeader, teamdealHeader, MilestoneHeader, dealService, attached1DocsHeader, calandarDealsHeader, IntellectualHeader, ProductHeader, WCSHeader, dealcontractHeader, PastDealHeader, RLSDealHeader } from './deals.service';

import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { EncrDecrService } from './encr-decr.service';
import { ApiServiceOpportunity, ApiService } from './api.service';
import { deactivatedcontactheader } from './dectivatedcontacts.service';
import { headerdisqualified, accountheaderdisqualified } from './disqualifiedlead.service';
import { switchMap } from 'rxjs/internal/operators/switchMap';
import { ErrorMessage } from './error.services';
import { Store } from '@ngrx/store';
import { AppState } from '../state';
import { ClearActivityDetails, ClearActivity } from '../state/actions/activities.actions';
import { ClearTaskList } from '../state/actions/home.action';
import { ClearRelationshipCount, ClearContactsDataDetails, ClearContactList } from '../state/actions/contact.action';
import { ClearDeActivateContactList } from '../state/actions/InActivateContact.action';
import { ClearMyopenlead, ClearOpenLeadState, ClearAllLeadDetails } from '../state/actions/leads.action';
import { ClearCampaign } from '../state/actions/campaign-List.action';
import { contactclosedleadheader } from './offline/contactclosedlead.service';
import { AvailableReportsHeader } from './reports/reports.service';

export const campaginEvent: any[] = [
    { name: 'CampaignName', title: 'Campaign Name' },
    { name: 'CampaignOwner', title: 'Campaign Owner' },
    { name: 'CampaignCode', title: 'Campaign Code' },
]

export const NewAgeBusinessPartnerName: any[] = [
    { name: 'accountName', title: 'Account Name' },
    { name: 'accountOwner', title: ' Account Owner (primary)' },
]
export const NewAgeBusinessPartnerOwner: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'EmailID', title: 'EmailID' }
]

export const allianceBdm: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'EmailId', title: ' Email' },
]

export const deliveryLed: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'EmailId', title: ' Email' },
]

export const eventTypeName: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'Owner', title: 'Owner' },
]
export const serviceLine: any[] = [
    { name: 'Name', title: 'Name' }

]

export const campaignHeaders = {
    'Campaign Event': campaginEvent,
    'New age business partner': NewAgeBusinessPartnerName,
    'Alliance Bdm': allianceBdm,
    'Delivery lead': deliveryLed,
    'Event type': eventTypeName,
    'Service line': serviceLine,
    'New age business partner owner': NewAgeBusinessPartnerOwner,
}

export const campaignNames = {
    'Campaign Event': { name: 'Campaign Event', isCheckbox: false, isAccount: false },
    'New age business partner': { name: 'New age business partner', isCheckbox: false, isAccount: false },
    'New age business partner owner': { name: 'Owner', isCheckbox: false, isAccount: false },
    'Alliance Bdm': { name: 'Alliance Bdm', isCheckbox: false, isAccount: false },
    'Delivery lead': { name: 'Delivery lead', isCheckbox: false, isAccount: false },
    'Event type': { name: 'Event type', isCheckbox: false, isAccount: false },
    'Service line': { name: 'Service line', isCheckbox: false, isAccount: false }
}

const routes = {
    SetCacheData: 'v1/ActionManagement/InsertCache',
    GetCacheData: 'v1/ActionManagement/GetCache',
    deleteCacheData: "v1/ActionManagement/DeleteCache"
}

const singleTable = {
    normalCol: {
        'fixedClass1': 391,
        'fixedClass2': 527,
        'fixedClass3': 663,
    },
    worstCol: {
        'fixedClass1': 281,
        'fixedClass2': 361,
        'fixedClass3': 441,
    },
};
const editableTable = {
    normalCol: {
        'fixedClass1': 331,
        'fixedClass2': 531,
        'fixedClass3': 731,
    },
    worstCol: {
        'fixedClass1': 320,
        'fixedClass2': 480,
        'fixedClass3': 581,
    },
};
const syncTable = {
    normalCol: {
        'fixedClass1': 300,
        'fixedClass2': 500,
        'fixedClass3': 700,
    },
    worstCol: {
        'fixedClass1': 320,
        'fixedClass2': 480,
        'fixedClass3': 581,
    },
};
@Injectable({
    providedIn: 'root'
})
export class DataCommunicationService {

    MobileDevice = window.innerWidth < 800 ? true : false;
    minusTrack: any;

    constructor(private location: Location, private store: Store<AppState>, public router: Router, public service: AccountService, public httpClient: HttpClient, private apiServiceOpportunity: ApiServiceOpportunity,
        private EncrDecr: EncrDecrService, private OpportunitiesService: OpportunitiesService, private _dealservice: dealService, private apiService: ApiService, private PopUp: ErrorMessage, ) { }
    seachInputText = ''
    requestCampaign = true;
    hidehelpdesknav = true;
    hidehelpdeskmain = false;
    overlay = false;
    oval = false;
    noneditpart = true;
    editpart = false;
    noneditprofile = true;
    editprofile = false;
    navcontent: String;
    chatbotDA = false;
    hideMobileButton = true;

    arrowScrollTop = false;
    ttip: boolean = true;

    selectclick: boolean = false;
    message = false;
    messagesend = false;
    messagecreate = false;
    leadDetails = true;
    leadArchive = false;
    leadNuture = false;
    sideNavForAcList: boolean = false;
    popupShow: boolean = false;
    sideTrans: boolean = false;
    chatBot: boolean = false;
    userManual = false;
    activatePlanning = false;
    budgetspend = false;
    gcpselect = true;
    gcpList = false;
    fiscal = false
    loader = true;
    status_pending: boolean;
    userheader: any[];
    selArray = [];
    cachedArray = [];
    converArchive: boolean = false;
    filename: string;
    filesList = [];
    uploadedFiles=[];
    fileUpload: boolean = false;
    convernonArchive = false;
    header = true;
    dropclicked = false;
    loaderDA = true;
    loaderhome = false;
    archiveTag: boolean;
    nurtureTag: boolean;
    convActionTag: boolean = false
    allConversationLists: any
    messagecancel = false;
    messagesubmit = false;
    messageconfirm = false;
    messageswap = false;
    messagedone = false;
    tableRecordsChecked: boolean = false;
    messagesaved = false;
    messagereject = false;
    isExpanded: boolean = false;
    shareConversationFormThread = [];
    allCampaignService: boolean = false;
    isComplete: boolean = false;
    value: any;
    serviceSearchItem: string;
    pseudoFilter = [] //Used for Filter data in all tables
    editableCachedRow = []; //pseudo row
    Summary_window: boolean;
    edited: boolean = false;
    // for guidelines tab
    Competitortab = true;
    Teambuildingtab = false;
    Probabiltytab = false;
    sidebartabindex: string = "1";
    leadDetailsArr: any;
    ActionColumnFixed: boolean;
    // for back routing in account details and account creation page
    selectedTabValue:String;
    //for tabchange validations
    public dirtyflag = false;

    // for saving data
    subscription = new Subject();
    sendProspectAccount: boolean = false;
    // for uniform placeholder
    getSelectedClass(selectedValue) {
        return selectedValue == '' ? 'setPlaceholderColor' : '';
    }
    // for uniform placeholder

    public onSave() {
        this.subscription.next();
    }
    //Opportunities to Deal communications
    newOpportunities: boolean = false;
    topbuttons: boolean = false;
    GlobalSearchdata: any
    //allCampaignService : boolean = false;
    CsvOptions = {
        fieldSeparator: ',',
        quoteStrings: '"',
        decimalseparator: '.',
        showLabels: true,
        showTitle: true,
        title: '',
        useBom: true,
        noDownload: false,
        headers: []
    };
    editTheProfile() { }
    checkFalse() {

        this.tableRecordsChecked = false;
        this.topbuttons = false

    }
    private managementLogData = new BehaviorSubject({});
    private ErrorLoading = new BehaviorSubject({});
    private LeadCancelSave = new Subject<any>()
    private showLeadDetailsBtn = new BehaviorSubject(null)
    private LeadParentActionBtn = new Subject<{ status }>()
    leadHistryDetails = new Subject();


    CreateOpprtunityData(data) {
        debugger
        console.log(data)
        return {
            "Lead Name": data.Title,
            "Account/ Prospect Name": data.Account,
            "Contracting Country": data.Country,
            "SBU": data.SBU,
            "Vertical": data.Vertical,
            "Originating Source": data.Source,
            "Currency": data.Currency,
            "Lead Owner": data.Owner,
            "AGP Link": data.Agp,
            "Est. Closure Date": data.EstimatedCloseDate,
            "Associated Service Lines": data.ServiceLine,
            "Estimated Deal Value ": data.DealValue,
            "Opportunity ID": data.OpportunitiesOrOrders,
            "Primary Customer Contact": data.CustomerContacts,
            "Contacts": (data.CustomerContacts) ? data.CustomerContacts : [],
            "Desc": (data.EnquiryDesc) ? data.EnquiryDesc : ""
        }
    }
    // leaddetails(data){
    //     this.leadDetailsArr =
    //     console.log("leadDetailsToOpp", this.leadDetailsArr);
    // }

    manageLog(data) {
        this.managementLogData.next({ resData: data });
    }
    getManageLog() {
        return this.managementLogData.asObservable();
    }

    sendLeadParentActionBtn(data) {
        this.LeadParentActionBtn.next({ status: data })
    }

    getLeadParentActionBtn() {
        return this.LeadParentActionBtn.asObservable()
    }

    sendErrorLoading(flag: boolean) {
        this.ErrorLoading.next(flag);
    }
    getErrorLoading() {
        return this.ErrorLoading.asObservable();
    }


    sendLeadCancelSave(flag: boolean) {
        this.LeadCancelSave.next(flag)
    }

    getLeadCancelSave() {
        return this.LeadCancelSave.asObservable()
    }

    sendShowEditBtn(falg) {
        this.showLeadDetailsBtn.next(falg)
    }

    getShowEditBtn() {
        return this.showLeadDetailsBtn.asObservable()
    }

    //Side Bar For Account Details
    private sideBar = new BehaviorSubject({});

    setSideBarData(data) {
        this.sidebartabindex = data;
        this.sideBar.next({ tabIndex: data });
    }
    getSideBarData() {
        return this.sideBar.asObservable();
    }


    showchat() {
        this.loaderDA = true;
        this.chatbotDA = !this.chatbotDA;
        var that = this;
        // setTimeout(
        //     this.findWidth          
        // , 1500);
    }

    loadconver() {
        this.loaderhome = true;
        var that = this;
        setTimeout(function () {
            that.loaderhome = false;
        }, 1000);
    }
    showToast() {
        var that = this;
        this.message = true;
        setTimeout(function () {
            that.message = false;
        }, 3500);
    }
    goBack() {
        if (this.router.url === "/opportunity/opportunityview/overview") {
            this.router.navigate(['/opportunity/allopportunity']);
        }
        else {
            if (this.router.url == '/deals/createDeal') {
                localStorage.removeItem('oppList')
            }
            this.location.back();
            this.tableRecordsChecked = false;
        }
    }
    converarchiv() {
        this.converArchive = true;
        this.convernonArchive = false;
    }
    convernonarchiv() {
        this.convernonArchive = true;
        this.converArchive = false;
    }
    archived() {
        this.leadArchive = true;
        this.leadNuture = false;
        this.leadDetails = false;

    }
    nurtured() {
        this.leadArchive = false;
        this.leadNuture = true;
        this.leadDetails = false;

    }
    details() {
        this.leadArchive = false;
        this.leadNuture = false;
        this.leadDetails = true;
    }

    removeDuplicates(myArray, Prop) {
        return myArray.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[Prop]).indexOf(obj[Prop]) === pos;
        });
    }


    CheckFilterFlag(data) {

        let p = { ...data.filterData.filterColumn }
        let resultdata = []
        for (var key in p) {
            if (p.hasOwnProperty(key)) {
                (p[key].length == 0) ? resultdata.push(false) : resultdata.push(true)

            }
        }
        return resultdata.some(x => x == true)
    }


    /***************    get table data start       *************/

    checkFilterListApiCall(data) {

        if (data.filterData.order.length > 0 || data.filterData.sortColumn != "") {
            return true;
        }
        else {
            return false
        }
    }
    getCollectionValue(collection, actualProp, reqProp, selectedValue): String {
        let selObj = selectedValue ? collection.filter(x => x[actualProp] == selectedValue) : [];
        return selObj.length == 0 ? '' : selObj[0][reqProp];
    }
    getTableData(value: string): Observable<any[]> {


        var tableData = value;
        switch (tableData) {

            case 'archivelead': {
                if (this.router.url.includes('/accounts/accountleads')) {
                    return of(accountheaderArchived)
                } else {
                    return of(headerArchived);
                }
            }
            case 'qualified': {
                if (this.router.url.includes('/accounts/accountleads')) {
                    return of(accountheaderQualified)
                } else {
                    return of(headerQualified);
                }
            }
            case 'unqualified': {
                if (this.router.url.includes('/accounts/accountleads')) {
                    return of(accountunqualifiedheader)
                } else {
                    return of(unqualifiedheader);
                }
            }
            case 'campaigns': {
                return of(campaignheader);
            }
            case 'activecampaigns': {
                return of(activecampaignheader);
            }
            case 'completedcampaigns': {
                return of(completedcampaignheader);
            }
            case 'action': {
                return of(ExpandHeader);
            }
            case 'othersConvo': {
                return of(ExpandHeaderOthers);
            }

            case 'contacts': {
                return of(contactheader);
            }
            case 'contactConversation': {
                return of(contactConversationheader);
            }
            case 'contactLead': {
                return of(contactLeadheader);
            }
            case 'ContactClosedLead': {
                return of(contactclosedleadheader);
            }
            case 'contactCampaign': {
                return of(contactCampaignheader);
            }
            case 'contactAllCampaign': {
                return of(contactallcampaignheader);
            }
            case 'conversation': {
                if (this.router.url.includes('/accounts/accountactivities')) {
                    return of(accountconversationheader)
                } else {
                    return of(conversationheader);
                }
            }
            case 'archived': {
                if (this.router.url.includes('/accounts/accountactivities')) {
                    return of(accountarchivedheader)
                } else {
                    return of(archivedheader);
                }
            }
            case 'childConversation': {
                return of(childConversationheader);
            }
            case 'syncactivity': {
                return of(ExpandHeaderSync);
            }
            case 'approval': {
                return of(approvalheader);
            }
            case 'task': {
                return of(taskheader);
            }

            case 'contactarchive': {
                return of(contactarchiveheader);
            }
            case 'contactarchivelead': {
                return of(contactarchiveleadheader);
            }

            case 'contactcompletecampaign': {
                return of(contactcompletecampaignheader);
            }
            case 'contactopenlead': {
                return of(contactopenleadheader);
            }
            case 'deactivatedcontacts': {
                return of(deactivatedcontactheader);
            }
            // case 'contactmoreview': {
            //     return of(deactivatedcontactheader);
            // }
            case 'myactivecampaigns':
                {
                    return of(myactivecampaignheader)
                }
            case 'disqualifiedlead':

                {
                    if (this.router.url.includes('/accounts/accountleads')) {
                        return of(accountheaderdisqualified)
                    } else {
                        return of(headerdisqualified);
                    }
                }

            // sprint 3 header cases starts here
            // account landing
            case 'AccountCreationActiveRequests': {
                return of(headerfarming);
            }
            case 'AccountCreationReserveRequests': {
                return of(headerreserve);
            }
            case 'AccountCreationAlliance': {
                return of(headeralliance);
            }
            case 'AccountCreationAnalystAdvisor': {
                return of(headerAnalystAdvisor);
            }

            case 'TargetAccount':
                {
                    return of(headerTargetAccount);
                }

            //    account creation
            case 'ModificationActiveRequest': {

                if (this.service.loggedin_user == 'sbu') {
                    return of(headermodificationactiverequestssbu);
                }
                if (this.service.loggedin_user == 'cso') {
                    return of(headermodificationactiverequestscso);
                }
                else {
                    return of(headeractiverequests);
                }
            }
            case 'CreationHistory':
                {
                    return of(headercreationhistory);
                }

            //    account modification
            case 'CreationActiveRequest': {
                if (this.service.loggedin_user == 'sbu') {
                    return of(headeractiverequestssbu);
                }
                else if (this.service.loggedin_user == 'cso') {
                    return of(headeractiverequestscso);
                }
                else if (this.service.loggedin_user == 'pendingwith') {
                    return of(headercreationactiverequestspendingwith);
                }
                else {
                    return of(headercreationactiverequests);
                }
            }
            case 'CreationAssigActiveRequest': {
                // if (this.service.loggedin_user == 'sbu') {
                return of(headerassigactiverequestssbu);
                // }
                // else if (this.service.loggedin_user == 'cso') {
                //     return of(headeractiverequestscso);
                // }
                // else if (this.service.loggedin_user == 'pendingwith') {
                //     return of(headercreationactiverequestspendingwith);
                // }
                // else {
                //     return of(headercreationactiverequests);
                // }
            }


            case 'CreationAssigHistoryRequest': {
                // if (this.service.loggedin_user == 'sbu') {
                return of(headerassighistoryrequestssbu);
                // }
                // else if (this.service.loggedin_user == 'cso') {
                //     return of(headeractiverequestscso);
                // }
                // else if (this.service.loggedin_user == 'pendingwith') {
                //     return of(headercreationactiverequestspendingwith);
                // }
                // else {
                //     return of(headercreationactiverequests);
                // }
            }

            case 'ModificationHistory':
                {
                    return of(headermodificationhistory);
                }

            // account finder
            case 'accountsearch': {
                return of(accountsearch);
            }

            case 'ownershiphistory': {
                return of(ownershiphistory);
            }


            // account contracts - pending requests
            case 'PendingRequest':
                {
                    return of(headerpendingrequests);
                }
            case 'ContractRepository':
                {
                    return of(headercontractrepository);
                }

            // account contacts - account contacts
            case 'AccountContacts':
                {
                    return of(headeraccountcontacts);
                }
            case 'RelationshipPlan':
                {
                    return of(headerrelationshipplan);
                }

            // account teams - incentive tab
            case 'AccountTeams':
                {
                    return of(headerincentiveuser);
                }

            case 'AccountTeamsNon-incentivised':
                {
                    return of(headernonincentiveuser);
                }

            // account management log
            case 'ManagementLog':
                {
                    return of(headermanagementlog);
                }
           // Reports module starts here
            case 'AvailableReports':{
                return of(AvailableReportsHeader)
            }

            //  sprint 4 + sprint 7 starts here
            case 'RevokeAccess': {
                return of(allrevokeaccessheader);
            }

            case 'OBforecast': {
                return of(allobforecast);
            }
            case 'allopportunity': {
                return of(allopportunityheader);
            }
            case 'renewal': {
                return of(renewalheader);
            }
            case 'allopportunities': {
                return of(AllOpportunitiesheader)
            }
            case 'allopportunityfinder': {
                return of(opportunityFinderHeader);
            }
            case 'allorderfinder': {
                return of(orderFinderHeader);
            }
            case 'OpportunityTeams': {
                return of(headerteamopportunity);
            }

        
            case 'allopportunitiesTab': {
                return of(allopportunityheader);
            }

            case 'overdueTab': {
                return of(overdueTabheader);
            }

            case 'allopportunitiesList': {
                return of(allopportunitiesListheader);
            }
            case 'allopportunitiesOwnerList': {
                return of(allopportunitiesOwnerList);
            }

            case 'wonTab': {
                return of(wonHeader);
            }


            case 'allopportunitiesAccountTab': {
                return of(allopportunityAccountheader);
            }

            case 'overdueAccountTab': {
                return of(overdueTabAccountheader);
            }

            case 'allopportunitiesAccountList': {
                return of(allopportunitiesAccountListheader);
            }

            case 'allopportunitiesOwnerAccountList': {
                return of(allopportunitiesOwnerAccountList);
            }

            case 'terminatedAccountheader': {
                return of(terminatedAccountheader);
            }
            
            case 'terminatedheader': {
                return of(terminatedheader);
            }

            case 'suspendheader': {
                return of(suspendheader);
            }
            case 'suspendAccountheader': {
                return of(suspendAccountheader);
            }

            case 'wonAccountTab': {
                return of(wonAccountHeader);
            }




            case 'openopportunityTab': {
                return of(openOpportunityheader);
            }
            case 'CommitmentRegister': {
                return of(commitmentheader);
            }
            case 'changeOpportunity': {
                return of(changeOpportunityHeader);
            }
            case 'pendingRequest': {
                return of(PendingRequestHeader);
            }
            case 'ContractRepository': {
                return of(ContractRepositoryHeader);
            }
            case 'reopenApproval': {
                return of(ReopenApprovalheader);
            }
            case 'allorders': {
                return of(OrderHeader);
            }
            case 'accountOrders': {
                return of(OrderHeaderAccount);
            }
            case 'allordersbfm': {
                return of(OrderHeaderBFM);
            }
            case 'allordersadh': {
                return of(OrderHeaderADH);
            }
            case 'allordersdmwt': {
                return of(OrderHeaderDMWT);
            }
            case 'allordersdmnonwt': {
                return of(OrderHeaderDMNONWT);
            }
            case 'allordersretag': {
                return of(OrderHeaderRetag);
            }
            case 'createamendmentname': {
                return of(CreateAmendmentHeader);
            }
            case 'searchpoa': {
                return of(searchpoaheader);
            }
            case 'emailtable': {
                return of(emailHeader);
            }
            case 'mergeReqSingleTable': {
                return of(mergeReqSingleTable);
            }

            //  sprint 4 + sprint 7 starts here
            // Sprint 5 start

            case 'taggedDeals': {
                return of(taggedHeader);
            }
            case 'existingDeals': {
                return of(existingDealsHeader);
            }
            case 'searchDeals': {
                return of(searchDealHeader);
            }
            case 'teamDeal': {
                return of(teamdealHeader);
            }
            case 'mileStone': {
                return of(MilestoneHeader);
            }
            case 'rLs': {
                return of(this._dealservice.RLSeHeader);
            }
            case 'attchedDocs': {
                return of(attached1DocsHeader);
            }
            case 'INTellectual': {
                return of(IntellectualHeader);
            }
            case 'passProduct': {
                return of(ProductHeader);
            }
            case 'WCS': {
                return of(WCSHeader);
            }
            case 'dealContract': {
                return of(dealcontractHeader);
            }
            case 'pastDeals': {
                return of(PastDealHeader);
            }
            case 'rlsDeals': {
                return of(RLSDealHeader);
            }
            case 'calandarData': {
                return of(calandarDealsHeader);
            }
            // Sprint 5 ends

            //source account table Sprint 4
            case 'SourceAccount': {
                return of(SourceAccountHeader);
            }
        }
    }





    /****************    get table data end       ************/
    /****************    get table data end       ************/
    /****************    get table data end       ************/






    // account module all the toast messages ends
    // sprint 3 dynamic toast message ends here
    toast() {

        var that = this;
        this.message = true;
        setTimeout(function () {
            that.message = false;
        }, 3500);

    }
    toastsend() {
        var that = this;
        this.messagesend = true;
        setTimeout(function () {
            that.messagesend = false;
        }, 3500);
    }
    toastcreate() {
        var that = this;
        this.messagecreate = true;
        setTimeout(function () {
            that.messagecreate = false;
        }, 3500);
    }
    toastcancel() {
        var that = this;
        this.messagecancel = true;
        setTimeout(function () {
            that.messagecancel = false;
        }, 3500);
    }

    toastsubmit() {
        var that = this;
        this.messagesubmit = true;
        setTimeout(function () {
            that.messagesubmit = false;
        }, 3500);
    }
    toastconfirm() {
        var that = this;
        this.messageconfirm = true;
        setTimeout(function () {
            that.messageconfirm = false;
        }, 3500);
    }
    toastswap() {
        var that = this;
        this.messageswap = true;
        setTimeout(function () {
            that.messageswap = false;
        }, 3500);
    }
    toastdone() {
        var that = this;
        this.messagedone = true;
        setTimeout(function () {
            that.messagedone = false;
        }, 3500);
    }
    messageReject() {
        var that = this;
        this.messagereject = true;
        setTimeout(function () {
            that.messagereject = false;
        }, 3500);
    }
    toastsaved() {
        var that = this;
        this.messagesaved = true;
        setTimeout(function () {
            that.messagesaved = false;
        }, 3500);
    }

    closeToast() {
        this.message = false;
        this.messagesend = false;
        this.messagecreate = false;
        this.messagecancel = false;
        this.messagesubmit = false;
        this.messageconfirm = false;
        this.messageswap = false;
        this.messagedone = false;
        this.messagereject = false;

    }

    validateAllFormFields(formGroup: any) {
        //debugger
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {
                control.markAsTouched({ onlySelf: true });
            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            } else if (control instanceof FormArray) {
                this.validateAllFormFields(control);
            }
        });
    }



    ///&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  delivery led Bdm  &&&&&&&

    getDeliveryLedUrl = "v1/LeadManagement/SearchOwner";

    public getDeliveryLed(data) {
        debugger;
        console.log("data: ", data);

        var campainObj;

        console.log("typeOf: ", typeof data);
        var dataType = typeof data;
        if (dataType == "string") {
            campainObj = {
                "PageSize": "10",
                "SearchText": data,
                "SearchType": 6,
                "RequestedPageNumber": "1",
                "OdatanextLink": ""
            }

            console.log("campainObj : ", campainObj);
        }
        else if (dataType == "object") {
            data.SearchType = 6;
            campainObj = data;
            console.log("campainObj : ", campainObj);
        }

        return this.apiServiceOpportunity.post(this.getDeliveryLedUrl, campainObj);
    }

    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& delivery led end &&&&&

    ///&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Alliance Bdm  &&&&&&&

    getAllianceBdmUrl = "Common/GetAccountOwnerLookup";//"Common/GetAccountBDMLookUp";

    public getAllianceBdm(data, sysGuid) {
        debugger;
        console.log("data: ", data);

        var campainObj;
        console.log("typeOf: ", typeof data);
        var dataType = typeof data;
        if (dataType == "string") {
            // campainObj = {
            //     "Id": sysGuid,
            //     "PageSize": "10",
            //     "SearchText": data,
            //     "RequestedPageNumber": "1",
            //     "OdatanextLink": ""
            // }

            campainObj = {
                "Guid": sysGuid,
                "SearchText": data,
                "PageSize": 10,
                "RequestedPageNumber": 1,
                "OdatanextLink": null
            }
            console.log("campainObj : ", campainObj);
        }
        else if (dataType == "object") {
            // data.Id = sysGuid;
            // campainObj = data;
            data.Guid = sysGuid;
            campainObj = data;
            console.log("campainObj : ", campainObj);
        }
        return this.apiServiceOpportunity.post(this.getAllianceBdmUrl, campainObj);
    }

    //&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&& alliance bdm end &&&&&
    // oppId= "4c4ce32e-5455-e911-a830-000d3aa058cb";
    //obj = {"Guid":"11750929-197d-e911-a831-000d3aa058cb"}
    getDealInfluencerDataUrl = "Deal_Influencer/GetOpportunityDeal_Influencer";
    obj;

    public getDealInfluencerData(opportunityId) {
        this.obj = { "Guid": opportunityId }
        return this.apiServiceOpportunity.post(this.getDealInfluencerDataUrl, this.obj);
    }
    // getCampaignDataUrl = "Deal_Influencer/GetInfluencingCampaign";
    // getCampaignDataUrl = "Deal_Influencer/GetInfluencingCampaign?name=cp"
    // getCampaignDataUrl = "Deal_Influencer/GetCampaign";
    // getEventDataUrl = "Deal_Influencer/GetEvents";

    public getCampaignData(data, url) {
        debugger;
        console.log("data: ", data);
        console.log("url: ", url);
        var campainObj;

        console.log("typeOf: ", typeof data);
        var dataType = typeof data;
        if (dataType == "string") {
            campainObj = {
                "SearchText": data,
                "PageSize": "10",
                "RequestedPageNumber": "1",
                "OdatanextLink": ""
            }
            console.log("campainObj : ", campainObj);
        }
        else if (dataType == "object") {
            campainObj = data;
            console.log("campainObj : ", campainObj);
        }

        return this.apiServiceOpportunity.post(url, campainObj);
    }

    peOwnedEventDetails = "Deal_Influencer/GetPrivateEquityAccount";
    public getPEOwnedDetails(data, eventType) {
        debugger;
        console.log("data: ", data);
        console.log("event type: ", eventType);
        var body = {
            "SearchText": eventType
        }
        console.log("typeOf: ", typeof data);
        var dataType = typeof data;

        return this.apiServiceOpportunity.post(this.peOwnedEventDetails, body);
    }


    getDeleteUrl = "Deal_Influencer/DeleteOpportunityDealInfluencer";

    public deleteRow(id) {
        var deleteObj = { "Guid": id };
        console.log(deleteObj);

        return this.apiServiceOpportunity.post(this.getDeleteUrl, deleteObj);
    }

    saveDealUrl = "Deal_Influencer/SaveOpportunityDealInfluencer";

    public saveDeal(data) {

        return this.apiServiceOpportunity.post(this.saveDealUrl, data);
    }


    //**** Deal influencer option Sets */

    eventTypeEntityOptionSetUrl = "v1/MasterManagement/EeventTypeEntityName";
    public eventTypeEntityNameOptionSet() {

        return this.apiServiceOpportunity.get(this.eventTypeEntityOptionSetUrl);
    }

    getInfluencingUnitOptionSetUrl = "v1/MasterManagement/GetInfluencingUnit";
    public getInfluencingUnitOptionSet() {

        return this.apiServiceOpportunity.get(this.getInfluencingUnitOptionSetUrl);
    }

    endrosementTypeOptionSetUrl = "v1/MasterManagement/EndorsementType";
    public endrosementTypeOptionSet() {

        return this.apiServiceOpportunity.get(this.endrosementTypeOptionSetUrl);
    }


    getAccountUrl = "Deal_Influencer/GeDeal_InfluencerAccount";
    public getPeOwnedAccount(data) {

        var body = {
            "SearchText": data,
            "PageSize": 10,
            "RequestedPageNumber": 1,
            "OdatanextLink": ""
        }

        var obj;
        if (typeof data == "object") {
            obj = data;
        }
        if (typeof data == "string") {
            obj = body;
        }
        console.log("obj : ", obj);
        return this.apiServiceOpportunity.post(this.getAccountUrl, obj);
    }

    getServiceLineValuesUrl = "Deal_Influencer/GetServiceLine";
    public getServiceLineValues(data) {
        var body = { "SearchText": data }
        return this.apiServiceOpportunity.post(this.getServiceLineValuesUrl, body);
    }


    accountCategoryUrl = "Common/GetAccountCategogyList";
    public getAccountCategory(type, data, odataLink, userguid) {

        console.log("data: ", data);
        var body = {
            "SearchText": data,//User input
            "SearchType": type,//Account category Type
            "PageSize": 10, //number of record per page
            "RequestedPageNumber": 1,
            "OdatanextLink": odataLink,//based on the previous response pass odatanextLink
            "UserGuid": userguid
        }
        var obj;
        if (typeof data == "object") {
            obj = data;
        }
        if (typeof data == "string") {
            obj = body;
        }
        return this.apiServiceOpportunity.post(this.accountCategoryUrl, obj);
    }

    serviceLineUrl = "BusinessSolution/GetServicelineLookup";
    getServiceLineLookup(sbuId, searchText) {
        var body = {
            "Guid": sbuId,
            "SearchText": searchText,
            "PageSize": 10,
            "RequestedPageNumber": 1,
            "OdatanextLink": null
        }

        var obj;
        if (typeof sbuId == "object") {
            obj = sbuId;
        }
        if (typeof sbuId == "string") {
            obj = body;
        }

        return this.apiServiceOpportunity.post(this.serviceLineUrl, obj);
    }

    //************************************ */

    getLookUpFilterData(data): Observable<any> {
        switch (data.controlName) {
            case 'Campaign Event':
                return this.getCampaignEventData(data);
            case 'New age business partner':
                return this.getNewAgeBusinessName(data);
            case 'New age business partner owner':
                return this.getNewAgeBusinessOwnerName(data);
            case 'Alliance Bdm':
                return this.getAllianceBdmData(data);
            case 'Delivery lead':
                return this.getDeliveryLedData(data);
            case 'Event type':
                return this.getEventType(data);
            case 'Service line':
                return this.getEventType(data);
        }
    }

    wiproevent = [];
    getEventType(data): Observable<any> {
        console.log("event type data: ", data);
        debugger;
        console.log(" data.rowdata: ", data.rowData);
        var searchType = "";

        if (data.rowData.WiproInfluencingunitValue.toUpperCase() == "ALLIANCE") {
            searchType = "6";
        }
        else if (data.rowData.WiproInfluencingunitValue.toUpperCase() == "ANALYST") {
            searchType = "10";
        }

        if (data.rowData.WiproInfluencingunitValue.toUpperCase() == "ALLIANCE" || data.rowData.WiproInfluencingunitValue.toUpperCase() == "ANALYST") {
            if (data.isService) {
                let body = {
                    "SearchText": data.useFullData.searchVal,
                    "SearchType": searchType,
                    "PageSize": data.useFullData.recordCount,
                    "RequestedPageNumber": data.useFullData.pageNo,
                    "OdatanextLink": data.useFullData.OdatanextLink,
                    "UserGuid": data.useFullData.userId
                }
                this.wiproevent = [];
                return this.getAccountCategory(searchType, body, data.useFullData.OdatanextLink, data.useFullData.userId).pipe(switchMap(res => {
                    debugger;
                    if (res) {

                        console.log("res: ", res);
                        for (var i = 0; i < res.ResponseObject.length; i++) {

                            var obj = {};
                            
                            Object.assign(obj, { index: i });
                            Object.assign(obj, {title:   res.ResponseObject[i].Name? this.getSymboll(res.ResponseObject[i].Name):'-'  });
                            Object.assign(obj, { mapName: res.ResponseObject[i].MapName });
                            Object.assign(obj, { mapGuid: res.ResponseObject[i].MapGuid });
                            Object.assign(obj, { sysNumber: res.ResponseObject[i].SysNumber ? res.ResponseObject[i].SysNumber : "" });
                            Object.assign(obj, { sysGuid: res.ResponseObject[i].SysGuid });
                            console.log("obj: ", obj);
                            this.wiproevent.push(obj);
                        }
                        console.log(res);
                        console.log("wiproevent: ", this.wiproevent);
                        return of((res.IsError == false) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterEventType(this.wiproevent) : [] } : [])
                    } else {
                        return of([])
                    }
                })
                )
            }
            else {
                return of(this.filterEventType(data.data))
            }
        }
        if (data.rowData.WiproInfluencingunitValue.toUpperCase() == "PE OWNED ENTITY") {
            if (data.isService) {
                let body = {
                    "SearchText": data.useFullData.searchVal,
                    //"SearchType": searchType,
                    "PageSize": data.useFullData.recordCount,
                    "RequestedPageNumber": data.useFullData.pageNo,
                    "OdatanextLink": data.useFullData.OdatanextLink,
                    // "UserGuid":  data.useFullData.userId
                }

                this.wiproevent = [];
                return this.getPeOwnedAccount(body).pipe(switchMap(res => {
                    debugger;
                    if (res) {

                        console.log("res: ", res);
                        for (var i = 0; i < res.ResponseObject.length; i++) {

                            var obj = {};

                            Object.assign(obj, { index: i });
                            Object.assign(obj, { title: res.ResponseObject[i].Name });
                            Object.assign(obj, { mapName: res.ResponseObject[i].OwnerName });
                            Object.assign(obj, { mapGuid: res.ResponseObject[i].OwnerId });
                            Object.assign(obj, { sysGuid: res.ResponseObject[i].AccountId });
                            // Object.assign(obj, {mapGuid: this.eventData.ResponseObject[i].mapGuid});
                            console.log("obj: ", obj);
                            this.wiproevent.push(obj);
                        }
                        console.log(res);
                        console.log("wiproevent: ", this.wiproevent);
                        return of((res.IsError == false) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterEventType(this.wiproevent) : [] } : [])
                    } else {
                        return of([])
                    }
                })
                )
            }
            else {
                return of(this.filterEventType(data.data))
            }
        }

        if (data.rowData.WiproInfluencingunitValue.toUpperCase() == "SERVICE LINE") {
            if (data.isService) {
                console.log("data.sbuId: ", data.sbuId);
                let body = {
                    "Guid": data.sbuId,
                    "SearchText": data.useFullData.searchVal,
                    "PageSize": data.useFullData.recordCount,
                    "RequestedPageNumber": data.useFullData.pageNo,
                    "OdatanextLink": data.useFullData.OdatanextLink,
                }

                this.wiproevent = [];
                return this.getServiceLineLookup(body, "").pipe(switchMap(res => {
                    debugger;
                    if (res && res.IsError == false) {
                        if (res) {

                            console.log("res: ", res);
                            for (var i = 0; i < res.ResponseObject.length; i++) {

                                var obj = {};

                                Object.assign(obj, { index: i });
                                Object.assign(obj, { title: res.ResponseObject[i].Name });
                                // Object.assign(obj, {mapName: res.ResponseObject[i].OwnerName});
                                // Object.assign(obj, {mapGuid: res.ResponseObject[i].OwnerId});
                                Object.assign(obj, { sysGuid: res.ResponseObject[i].SysGuid });
                                // Object.assign(obj, {mapGuid: this.eventData.ResponseObject[i].mapGuid});
                                console.log("obj: ", obj);
                                this.wiproevent.push(obj);
                            }
                            console.log(res);
                            console.log("wiproevent: ", this.wiproevent);
                            return of((res.IsError == false) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterServiceLine(this.wiproevent) : [] } : [])
                        } else {
                            return of([])
                        }
                    }

                })
                )
            }
            else {
                return of(this.filterServiceLine(data.data))
            }
        }
    }

    filterEventType(data): Observable<any> {
        console.log(data);
        debugger;
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.title) ? x.title : '',
                        'Owner': (x.mapName) ? x.mapName : '',
                        'sysGuid': (x.sysGuid) ? x.sysGuid : '',
                        'mapGuid': (x.mapGuid) ? x.mapGuid : '',
                        'Id': (x.sysGuid) ? x.sysGuid : '',
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }


    filterServiceLine(data): Observable<any> {
        console.log(data);
        debugger;
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.title) ? x.title : '',
                        'Id': (x.sysGuid) ? x.sysGuid : '',
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }

    getCampaignEventData(data): Observable<any> {
        console.log("CampaignData: ", data);
        console.log("CampaignData: ", data.url);
        debugger;
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }
            return this.getCampaignData(body, data.url).pipe(switchMap(res => {
                debugger;
                if (res) {
                    console.log(res);
                    console.log((res.IsError == false) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterCampaignEvent(res.ResponseObject) : [] } : []);
                    return of((res.IsError == false) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterCampaignEvent(res.ResponseObject) : [] } : [])
                } else {

                    return of([])
                }
            })
            )
        }
        else {
            return of(this.filterCampaignEvent(data.data))
        }
    }

    filterCampaignEvent(data): Observable<any> {
        console.log(data);
        debugger;
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'CampaignName': (x.Name) ? x.Name : '',
                        'CampaignOwner': (x.OwnerId) ? x.OwnerId : '',
                        'CampaignCode': (x.CodeName) ? x.CodeName : '',
                        'CampaignId': (x.CampaignId) ? x.CampaignId : '',
                        'OwnerIdValue': (x.OwnerIdValue) ? x.OwnerIdValue : '',
                        'Id': (x.CampaignId) ? x.CampaignId : '',
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }

    getNewAgeBusinessName(data): Observable<any> {
        console.log("CampaignData: ", data);
        debugger;
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo,
                "UserGuid": data.userId,
            }
            return this.getAccountCategoryList(body, data.useFullData.OdatanextLink, data.userId).pipe(switchMap(res => {
                debugger;
                if (res) {
                    console.log(res);
                    return of((res.IsError == false) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterNewAgeBusinessPartnerName(res.ResponseObject,true) : [] } : [])
                } else {
                    return of([])
                }
            })
            )
        }
        else {
            return of(this.filterNewAgeBusinessPartnerName(data.data,false))
        }
    }

    getNewAgeBusinessOwnerName(data): Observable<any> {
        console.log("CampaignData: ", data.data);
        debugger;
        if (data.isService) {
            let body = {
                "Guid": data.data.WiproAccountNameValue,
                "SearchText": data.useFullData.searchVal,
                "PageSize": 10,
                "RequestedPageNumber": 1
            }
            return this.getAccountOwnerForLookup(body).pipe(switchMap(res => {
                debugger;
                if (res) {
                    console.log(res);
                    return of((res.IsError == false) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterNewAgeBusinessPartnerOwner(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            })
            )
        }
        else {
            return of(this.filterNewAgeBusinessPartnerOwner(data.data))
        }
    }

    filterNewAgeBusinessPartnerName(data,isEncode): Observable<any> {
        console.log(data);
        debugger;
        if (data) {
            if (data.length > 0 && isEncode) {
                return data.map(x => {
                    return {
                        ...x,
                        'accountName': (x.Name) ? this.getsymbolNew(x.Name) : '',
                        'accountOwner': (x.MapName) ? x.MapName : '',
                        'ownerId': (x.MapGuid) ? x.MapGuid : '',
                        'systemNo': (x.SysNumber) ? x.SysNumber : '',
                        //'regionName': (x.RegionName) ? x.RegionName : '',
                        //'verticalName': (x.VerticalName) ? x.VerticalName : '',
                        'Id': (x.SysGuid) ? x.SysGuid : '',
                    }
                })
            } 
            else if(data.length > 0 && !isEncode)
            {
                 return data.map(x => {
                    return {
                        ...x,
                        'accountName': (x.Name) ? (x.Name) : '',
                        'accountOwner': (x.MapName) ? x.MapName : '',
                        'ownerId': (x.MapGuid) ? x.MapGuid : '',
                        'systemNo': (x.SysNumber) ? x.SysNumber : '',
                        //'regionName': (x.RegionName) ? x.RegionName : '',
                        //'verticalName': (x.VerticalName) ? x.VerticalName : '',
                        'Id': (x.SysGuid) ? x.SysGuid : '',
                    }
                })
            }
            else
            {
               return of([])
            }
        } else {
            return of([])
        }
    }

    getsymbolNew(data) {
        data = this.escapeSpecialChars(data);
        return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
      }
      
    filterNewAgeBusinessPartnerOwner(data): Observable<any> {
        console.log(data);
        debugger;
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.Name) ? x.Name : '',
                        'EmailID': (x.EmailID) ? x.EmailID : '',
                        'Id': (x.SysGuid) ? x.SysGuid : '',
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }


    getAllianceBdmData(data): Observable<any> {
        console.log("CampaignData: ", data);
        debugger;
        if (data.isService) {
            // let body = {
            //     "SearchText": data.useFullData.searchVal,
            //     "PageSize": data.useFullData.recordCount,
            //     "OdatanextLink": data.useFullData.OdatanextLink,
            //     "RequestedPageNumber": data.useFullData.pageNo
            // }

            let body = {
                "Guid": data.useFullData.searchVal,
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "RequestedPageNumber": data.useFullData.pageNo,
                "OdatanextLink": data.useFullData.OdatanextLink,
            }

            return this.getAllianceBdm(body, data.sysGuid).pipe(switchMap(res => {
                debugger;
                if (res) {
                    console.log(res);

                    return of((res.IsError == false) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAllianceBdm(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            })
            )
        }
        else {
            return of(this.filterAllianceBdm(data.data))
        }
    }

    filterAllianceBdm(data): Observable<any> {
        console.log(data);
        debugger;
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.Name) ? x.Name : '',
                        'EmailId': (x.EmailID) ? x.EmailID : '',
                        'Id': (x.SysGuid) ? x.SysGuid : '',
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }

    getDeliveryLedData(data): Observable<any> {
        console.log("CampaignData: ", data);
        debugger;
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }
            return this.getDeliveryLed(body).pipe(switchMap(res => {
                debugger;
                if (res) {
                    console.log(res);
                    return of((res.IsError == false) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterDeliveryLed(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            })
            )
        }
        else {
            return of(this.filterDeliveryLed(data.data))
        }
    }

    filterDeliveryLed(data): Observable<any> {
        console.log(data);
        debugger;
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.FullName) ? x.FullName : '',
                        'EmailId': (x.Email) ? x.Email : '',
                        'ownerId': (x.ownerId) ? x.ownerId : '',
                        'Id': (x.ownerId) ? x.ownerId : '',
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }



    //********* */
    // saveNewAgeBusinessPartnerUrl = "BusinessSolution/SaveSolutionDetails";
    // public saveNewAgeBusinessPartner(newAgeBusinessPartnerObj){
    //    var body = newAgeBusinessPartnerObj;
    //     return this.apiServiceOpportunity.post(this.getServiceTypeUrl, body);
    // }
    //************************ */
    //***************** OPP INSIGHTS */
    //   oppId1 = "2538a524-6472-e911-a830-000d3aa058cb";
    //   getDealDataOppInsights = "OpportunityInsight/GetOpportunityInsights?Oppid="+ this.oppId1;
    getDealDataOppInsights;
    public getDealData(oppId1) {

        this.getDealDataOppInsights = "OpportunityInsight/GetOpportunityInsights"; //?Oppid="+ oppId1;
        var body = {
            OpportunityID: oppId1
        }
        return this.apiServiceOpportunity.post(this.getDealDataOppInsights, body);
        // return this.apiServiceOpportunity.get();
    }

    getOppInsightUrl;
    public getoppInsight(oppId1, solutionDetails, serviceLineDetails, verticalId, subId) {
        this.getOppInsightUrl = "OpportunityInsight/GetOppInsights"; //?Oppid="+ oppId1;
        // var body = {
        //     "SBUId": "4FC63FE4-EF39-E811-811F-000D3A803BD6",
        //     "VerticalId": "4FC63FE4-EF39-E811-811F-000D3A803BD6",
        //     "SubVerticalId": "4FC63FE4-EF39-E811-811F-000D3A803BD6",
        //     "": [
        //         {
        //             "WiproServicelineidValue": "11D155B1-4EDD-E611-80E0-000D3A803BD6",
        //             "WiproPracticeId": "11D155B1-4EDD-E611-80E0-000D3A803BD6",
        //             "WiproSubpracticeid": "11D155B1-4EDD-E611-80E0-000D3A803BD6"
        //         },
        //         {
        //             "WiproServicelineidValue": "11D155B1-4EDD-E611-80E0-000D3A803BD6",
        //             "WiproPracticeId": "11D155B1-4EDD-E611-80E0-000D3A803BD6",
        //             "WiproSubpracticeid": "11D155B1-4EDD-E611-80E0-000D3A803BD6"
        //         }
        //     ],
        //     "WiproBusinessSolutionDtls": [
        //         {
        //             "WiproServiceType": 184450001,
        //             "WiproOpportunitySolutionDetailId": "11D155B1-4EDD-E611-80E0-000D3A803BD6"
        //         },
        //         {
        //             "WiproServiceType": 184450001,
        //             "WiproOpportunitySolutionDetailId": "11D155B1-4EDD-E611-80E0-000D3A803BD6"
        //         }
        //     ]
        // }

        var body = {
            "OpportunityId": oppId1,
            "SBUId": subId,
            "VerticalId": verticalId,
            "SubVerticalId": null,
            "WiproServiceLineDtls": serviceLineDetails,
            "WiproBusinessSolutionDtls": solutionDetails,
        }

        console.log("body: ", body);
        return this.apiServiceOpportunity.post(this.getOppInsightUrl, body);
        // return this.apiServiceOpportunity.get();

    }

    getBusinessSolutionUrl;
    public businessSolutionDetails(oppId1) {

        this.getBusinessSolutionUrl = "BusinessSolution/GetAllBusinessSolutionDetails"; //?Oppid="+ oppId1;
        var body = {
            Guid: oppId1
        }
        return this.apiServiceOpportunity.post(this.getBusinessSolutionUrl, body);
        // return this.apiServiceOpportunity.get();

    }

    getServiceLineUrl;
    public getServiceLineDetails(oppId1) {

        this.getServiceLineUrl = "BusinessSolution/GetAllServiceLineDetails"; //?Oppid="+ oppId1;
        var body = {
            Guid: oppId1
        }
        return this.apiServiceOpportunity.post(this.getServiceLineUrl, body);
        // return this.apiServiceOpportunity.get();
    }

    getSolutionOwnerContactUrl;
    public getSolutionOwnerContact(oppId1) {
        //   {
        //     "Guid": "D455D89F-21C0-E911-A836-000D3AA058CB", // Opportunity Id
        //     "SearchType": 184450001, // opportunity type
        //     "RequestedPageNumber": 1, // requested page number
        //     "PageSize": 10 // records per page
        // }
        // OpportunityInsight/GetOppoSolutionInsights

        this.getSolutionOwnerContactUrl = "OpportunityInsight/GetOppoSolutionInsights";
        var body = {
            "Guid": oppId1,
            "SearchType": 184450001,
            "RequestedPageNumber": 1,
            "PageSize": 5
        }
        return this.apiServiceOpportunity.post(this.getSolutionOwnerContactUrl, body);
        // return this.apiServiceOpportunity.get();
    }

    //****************NEW AGE BUSINESS PARTNER */
    // getNameforNewAgeBusinessPartnerUrl = "Common/GetAccountLookUp";
    getAccountCategoryUrl = "Common/GetAccountCategogyList";
    public getAccountCategoryList(data, odataLink, userId) {
        debugger;
        var body;
        console.log("data: ", data);
        var dataType = typeof data;
        if (dataType == "string") {
            body = {
                "SearchText": data,
                "SearchType": 15,
                "PageSize": 10,
                "RequestedPageNumber": 1,
                "OdatanextLink": odataLink,
                "UserGuid": userId
            }
            console.log("body : ", body);
        }
        else if (dataType == "object") {
            data.SearchType = 15;
            // data.UserGuid = userId
            body = data;
            console.log("body : ", body);
        }
        return this.apiServiceOpportunity.post(this.getAccountCategoryUrl, body);
    }

    getAccountOwnerUrl = "Common/GetAccountOwnerLookup";
    public getAccountOwner(data,searchText) {
        debugger;
        var body;
        console.log("data: ", data);

        body = {
            "Guid": data,//Account ID
            "SearchText":searchText,
            "PageSize": 10,
            "RequestedPageNumber": 1
        }
        console.log("body : ", body);
        return this.apiServiceOpportunity.post(this.getAccountOwnerUrl, body);
    }

    public getAccountOwnerForLookup(data) {


        return this.apiServiceOpportunity.post(this.getAccountOwnerUrl, data);
    }

    getSolutionBDMUrl = "Common/GetActiveEmployees";
    public getSolutionBDM(searchText) {
        var body = { "SearchText": searchText }
        return this.apiServiceOpportunity.post(this.getSolutionBDMUrl, body);
    }

    getInfluencingTypeUrl = "v1/MasterManagement/GetWiproInfluenceType";
    public getWiproInfluencingType() {

        return this.apiServiceOpportunity.get(this.getInfluencingTypeUrl);
    }
    getServiceTypeUrl = "v1/MasterManagement/GetWiproServiceType";
    public getWiproServiceType() {

        return this.apiServiceOpportunity.get(this.getServiceTypeUrl);
    }

    saveNewAgeBusinessPartnerUrl = "BusinessSolution/SaveSolutionDetails";
    public saveNewAgeBusinessPartner(newAgeBusinessPartnerObj) {

        var body = newAgeBusinessPartnerObj;
        return this.apiServiceOpportunity.post(this.saveNewAgeBusinessPartnerUrl, body);
    }

    tcvSolutionValueUrl = "BusinessSolution/GetOverAllTVSetails";
    public getTcvAndSolutionValue(oppId) {
        var body = { "Guid": oppId }
        return this.apiServiceOpportunity.post(this.tcvSolutionValueUrl, body);
    }




    //********************************** */
    downloadAsCsv(data, filename: string, properties, headers, sortBy: boolean, orderName: string, selectedTab?: string, orderType?: string): boolean {
        debugger
        var csvFileName = selectedTab ? selectedTab.trim().length > 0 ? this.TitleCaseSelectedTab(selectedTab) : this.TitleCase(filename) : this.TitleCase(filename)
        console.log('filename', filename)
        this.CsvOptions.title = csvFileName;
        orderName = orderName ? orderName : properties[0];
        let filterData = []
        try {
            data.map((x, i) => {
                filterData.push(this.pick(x, properties))
            })
            if (orderType == "Number") {
                filterData.sort(function (a, b) {
                    if (sortBy == true) {
                        return a[orderName] - b[orderName];
                    }
                    else {
                        return b[orderName] - a[orderName];
                    }
                })
            }
            else {
                if (sortBy == true) {
                    filterData.sort((a, b) => (b[orderName]).localeCompare(a[orderName]));
                }
                else if (sortBy == false) {
                    filterData.sort((a, b) => (a[orderName]).localeCompare(b[orderName]))
                }
                else {
                    filterData.sort((a, b) => (a[orderName]).localeCompare(b[orderName]))
                }
            }
            filterData = this.ConverToUpperCase(filterData, orderName)
            this.CsvOptions.headers = headers;
            new ngxCsv(filterData, csvFileName, this.CsvOptions);
            return true

        } catch (error) {

            return false
        }
    }
    ConverToUpperCase(data, orderName): any {
        return data.map(x => orderName in x ? x = { ...x, [orderName]: x[orderName].toString().charAt(0).toUpperCase() + x[orderName].toString().slice(1) } : x)
    }
    // Function for converting string to title case
    TitleCase(string) {
        console.log('string-->', string)
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    // Function for converting selected tab to title case
    TitleCaseSelectedTab(str) {
        return str.toLowerCase().split(' ').map(function (word) {
            return (word.charAt(0).toUpperCase() + word.slice(1));
        }).join(' ');
    }
    getValue(data) {
        if (Array.isArray(data)) {
            var splitData = data.toString().replace(/,/g, ' / ');
            data = splitData;
        }
        else if (typeof data === 'object') {
            var splitData1 = data
            data = splitData1.name;
        }
        return data;
    }
    pick(obj, keys) {
        return keys.map(k => k in obj ? { [k]: this.getValue(obj[k]) } : {})
            .reduce((res, o) => Object.assign(res, o), {});
    }

    pluckParticularKey(array, key) {
        return array.map(function (item) { return (item[key]) });
    }
    /****************    get table data end       ************/
    // sprint 3 dynamic toast message starts here
    // account module all the toast messages starts
    toastmessage = "";
    accountmessage = false;
    accounttoast(messagedata) {
        var that = this;
        this.accountmessage = true;
        this.toastmessage = messagedata;
        setTimeout(function () {
            that.accountmessage = false;
        }, 3500);
    }
    AccountcloseToast() {
        // debugger;
        this.accountmessage = false;
    }

    windowScroll() {
        window.scrollTo(0, 0);
    }

    /* KKN ** validate object ** */
    validateKeyInObj(obj, key) {
        key = key.toString();
        var properties = key.split(",");
        // Iterate through properties, returning undefined if object is null or property doesn't exist
        for (var i = 0; i < properties.length; i++) {
            if (properties[i] == 0 || typeof properties[i] == 'number' || typeof properties[i] == 'boolean') properties[i] = properties[i] + "";
            if (!obj || !obj.hasOwnProperty(properties[i])) {
                return;
            }
            obj = obj[properties[i]];
        }
        // Nested property found, so return the value
        return obj;
    }
    // verifyObject(obj, key){
    //     if(typeof obj[key] === 'object'){

    //     }
    // }
    findObjectByLabel(obj, label) {
        if (obj.label === label) { console.log(obj); return obj; }
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                var foundLabel = this.findObjectByLabel(obj[i], label);
                if (foundLabel) {
                    console.log(foundLabel);

                    return foundLabel;
                }
            }
        }
        return null;
    };

    getValueFromNestedObject(obj) {

        const iterate = (obj) => {
            Object.keys(obj).forEach(key => {
                console.log(`key: ${key}, value: ${obj[key]}`)

                if (typeof obj[key] === 'object') {
                    iterate(obj[key])
                }
                else {
                    return obj[key];
                }
            })
        }

        console.log(obj);
        // const iterate = (obj) => {
        // let keys = Object.keys(obj);

        // // keys.forEach(k=>{
        // //     let temp = k;
        // //     if (typeof obj[k] === 'object') {

        // //     }
        // // });
        // let key = obj[keys[0]];
        // while (typeof key === 'object') {
        //     key = Object.keys(key)[0];
        //     if (typeof key != 'object') {
        //         return key;
        //     }
        // }

        // Object.keys(obj).forEach(key => {
        //     while (typeof obj[key] === 'object') {
        //         if (typeof obj[key] === 'object') {
        //             this.getValueFromNestedObject(obj[key]);
        //         } else {
        //             return obj[key] || '';
        //         }
        //     }
        // })
    }
    isEmptyObject(obj) {
        for (var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    searchFieldValidator(value) {
        if (value) {
            let val = value.toString().trim();
            if (val != '' && val.length > 0) { return true; }
            else { return false; }
        }
        else { return false; }
    }
    /* KKN END */

    // Start link navigations

    LinkedNavigation(item, caseValue, route) {
        debugger
        switch (caseValue) {
            case 'linkedactivity': {
                this.getActivityDetails(item, route)
                return
            }

            case 'linkedcampaign': {
                this.getCampaignDetails(item, route)
                return
            }

            //  case 'linkedcustomerContact': {
            //    this.getCustomerDetails(item)
            //    return
            //  }

            case 'linkedOppAndOrder': {
                if (item.Type == 'Opportunity') {
                    this.getOppAndOrderDetsails(item)
                }
                return
            }
        }
    }

    getOppAndOrderDetsails(data) {
        debugger
        this.OpportunitiesService.setSession('opportunityId', data.Guid);
        this.router.navigate(['opportunity/opportunityview/overview'])
    }
    getActivityDetails(data, route) {
        sessionStorage.setItem('MeetingListRowId', JSON.stringify(this.EncrDecr.set('EncryptionEncryptionEncryptionEn', data.Guid, 'DecryptionDecrip')));
        sessionStorage.setItem('navigation', JSON.stringify(route))
        this.router.navigate(['activities/meetingInfo'])
    }

    getCampaignDetails(data, route) {
        debugger
        if (JSON.parse(sessionStorage.getItem('RequestCampaign'))) {
            let reqCamp = JSON.parse(sessionStorage.getItem("RequestCampaign"))
            sessionStorage.setItem('RequestCampaign', JSON.stringify({ ...reqCamp, Id: data['Id'], isAccountPopulate: false, isCampaignEdit: true }));
        } else {
            sessionStorage.setItem('RequestCampaign', JSON.stringify({ Id: data['Id'], isAccountPopulate: false, isCampaignEdit: true }));
        }
        sessionStorage.setItem('tableName', JSON.stringify("LinkedCampaign"))
        sessionStorage.setItem('leadRoute', JSON.stringify(route))
        this.router.navigate(['campaign/RequestCampaign'])
    }
    //   getCustomerDetails(data){
    //       localStorage.setItem('contactEditId', JSON.stringify(data.SysGuid));
    //       this.router.navigate(['contacts/Contactdetailslanding/contactDetailsChild'])
    //     }

    isAccount: boolean = false;

    setHeaderPixes(length, isAccount): string {
        this.isAccount = false;
        if (length == 6) {
            return '1210px'
        }
        else if (length == 5) {
            return '1180px'
        }
        else if (length == 4) {
            return '952px'
        }
        else if (length == 3) {
            this.isAccount = isAccount;
            return '727px'
        }
        else if (length == 2) {
            this.isAccount = isAccount;
            return '500px'
        }
        else if (length == 1) {
            this.isAccount = isAccount;
            return '400px'
        } else {
            return '500px'
        }
    }

    nameCapitalized(name) {
        return name.charAt(0).toUpperCase() + name.slice(1);
    }
    validationErrorMessage() {
        this.PopUp.throwError('Please enter mandatory fields!');
    }

    //---------------------More Views ------------------------
    getLeadMoreViewURL = 'v1/LeadManagement/MoreViewsList';
    getLeadMoreViews(moduleName): Observable<any> {
        return this.apiService.post(this.getLeadMoreViewURL, { "EntityName": moduleName });
    }
    deleteMoreViewURL = '/v1/LeadManagement/DeleteMoreView';
    deleteMoreView(data): Observable<any> {
        return this.apiService.post(this.deleteMoreViewURL, data);
    }

    SetRedisCacheData(data, key) {
        let obj = {
            ADId: (data == "empty") ? "empty" : JSON.stringify(data),
            CacheKey: key
        }
        return this.apiService.post(routes.SetCacheData, obj)
    }
    GetRedisCacheData(key) {
        return this.apiService.post(routes.GetCacheData, { CacheKey: key })
    }

    deleteRedisCacheData(key) {
        return this.apiService.post(routes.deleteCacheData, { CacheKey: key })
    }


    clearAllState() {
        //campaigns
        this.store.dispatch(new ClearActivityDetails())
        this.store.dispatch(new ClearActivity())
        this.store.dispatch(new ClearTaskList())
        this.store.dispatch(new ClearCampaign())
        //activities
        this.store.dispatch(new ClearActivity())
        this.store.dispatch(new ClearActivityDetails())
        this.store.dispatch(new ClearTaskList())
        this.store.dispatch(new ClearContactList())
        this.store.dispatch(new ClearRelationshipCount());
        //contacts
        this.store.dispatch(new ClearDeActivateContactList());
        this.store.dispatch(new ClearContactsDataDetails())
        this.store.dispatch(new ClearRelationshipCount());
        this.store.dispatch(new ClearTaskList());
        //leads
        this.store.dispatch(new ClearMyopenlead())
        this.store.dispatch(new ClearOpenLeadState())
        this.store.dispatch(new ClearContactList())
        this.store.dispatch(new ClearRelationshipCount());
        this.store.dispatch(new ClearAllLeadDetails())
    }

    /////-----------session, local encryption and decryption -----------/////
    encSetItem(data) {
        return this.EncrDecr.set("EncryptionEncryptionEncryptionEn", data, "DecryptionDecrip")
    }

    encGetItem(data) {
        return this.EncrDecr.get("EncryptionEncryptionEncryptionEn", data, "DecryptionDecrip")
    }
    sessionStorageSetItem(key: string, value: any) {
        let data = this.encSetItem(value)
        sessionStorage.setItem(key, data)
    }

    sessionStorageGetItem(key: string) {
        let data = sessionStorage.getItem(key)
        return this.encGetItem(data)
    }

    localStorageSetItem(key: string, value: any) {
        let data = this.encSetItem(value)
        localStorage.setItem(key, data)
    }

    localStorageGetItem(key: string) {
        let data = localStorage.getItem(key)
        return this.encGetItem(data)
    }

    dateModifier(dateConvert) {
        var dateToConvert = new Date(dateConvert);
        var getMmonth = (dateToConvert.getMonth() + 1) < 10 ? ("0" + (dateToConvert.getMonth() + 1)) : (dateToConvert.getMonth() + 1);
        var getDate = dateToConvert.getDate() < 10 ? "0" + dateToConvert.getDate() : dateToConvert.getDate();
        var convertedDate = dateToConvert.getFullYear() + '-' + getMmonth + '-' + getDate;

        var timeToConvert = new Date(dateToConvert);
        var getHours = timeToConvert.getHours() < 10 ? "0" + timeToConvert.getHours() : timeToConvert.getHours();
        var getMinutes = timeToConvert.getMinutes() < 10 ? "0" + timeToConvert.getMinutes() : timeToConvert.getMinutes();
        var getStartTime = getHours + ':' + getMinutes + ':' + "00";
        var finalModifiedDate = convertedDate + 'T' + getStartTime + '.000Z';
        console.log("date only", finalModifiedDate);
        return finalModifiedDate;
    }

    mergeDateTimeModifier(dateConvert, timeConvert) {
        var dateToConvert = new Date(dateConvert);
        var getMmonth = (dateToConvert.getMonth() + 1) < 10 ? ("0" + (dateToConvert.getMonth() + 1)) : (dateToConvert.getMonth() + 1);
        var getDate = dateToConvert.getDate() < 10 ? "0" + dateToConvert.getDate() : dateToConvert.getDate();
        var convertedDate = dateToConvert.getFullYear() + '-' + getMmonth + '-' + getDate;

        var timeToConvert = new Date(timeConvert);
        var getHours = timeToConvert.getHours() < 10 ? "0" + timeToConvert.getHours() : timeToConvert.getHours();
        var getMinutes = timeToConvert.getMinutes() < 10 ? "0" + timeToConvert.getMinutes() : timeToConvert.getMinutes();
        var getStartTime = getHours + ':' + getMinutes + ':' + "00";
        var finalModifiedDate = convertedDate + 'T' + getStartTime + '.000Z';
        console.log("merged date", finalModifiedDate);
        return finalModifiedDate;
    }

    getSymbol(data) {
        // console.log(data)
        if (data) {
            return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
        } else {
            return '';
        }

    }

    getSymboll(data) {
        data = this.escapeSpecialChars(data);
        return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
      }
      
      escapeSpecialChars(jsonString) {
        return jsonString.replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t")
            .replace(/\f/g, "\\f");
      
      }
      
    private loadLeadHistrysubject = new Subject<any>();
    sendLeadHistry(message: boolean) {
        this.loadLeadHistrysubject.next(message);
    }

    clearloadLeadHistry() {
        this.loadLeadHistrysubject.next();
    }

    getloadLeadHistry(): Observable<any> {
        return this.loadLeadHistrysubject.asObservable();
    }

    leadToOpp() {
        return [{
            name: '',
            message: 'You will be redirected to opportunity module for opportunity creation.',
            //Your current Account linked does not exist, please create the account to continue to opportunity creation process.
            header: 'Create Opportunity',  //Opportunity - account
            bottomName: 'Create Opportunity',
            routerLink: '/opportunity/newopportunity'
        },
        {
            name: '',
            message: 'This lead is currently linked to a prospect account. Kindly create hunting account for the same to proceed with the opportunity creation.',
            header: 'Cannot convert to opportunity',
            bottomName: 'Create account',
            routerLink: '/accounts/accountcreation/createnewaccount'
        },
        {
            name: '',
            message: 'This lead is linked to a reserved account. Kindly activate this account to proceed with opportunity creation.',
            header: 'Activate the account',
            bottomName: 'Activate',
            routerLink: ''
        }]
    }

    trackWidth: any;
    track: any;
    getFixedClass: any;
    checktableWidth: any = 0;
    railWidth: any = 0;
    minLength: any = 1;
    findWidth(status?) {
        if (!this.MobileDevice) {
            let TableName;
            let perfectTagElement;
            let tableTagElement;
            let detectTable = document.getElementsByTagName('app-single-table').length;
            let detectTableD = document.getElementsByTagName('app-single-dragable-table').length;
            let detectSyncTable = document.getElementsByTagName('app-sync-editable-table').length;
            if (detectTable == 1 || detectTableD) {
                TableName = singleTable;
                perfectTagElement = <HTMLElement>document.querySelector("#scoll_top >  perfect-scrollbar");
                tableTagElement = <HTMLElement>document.querySelector("#scoll_top >  perfect-scrollbar > .ps > .ps-content > table");
                this.getFixedClass = perfectTagElement ? perfectTagElement.classList : '';
                this.track = <HTMLElement>document.querySelector("#scoll_top > perfect-scrollbar > .ps > .ps__rail-x > .ps__thumb-x");
            }
            else if (detectSyncTable == 1) {
                this.ActionColumnFixed = true;
                TableName = syncTable;
                perfectTagElement = <HTMLElement>document.querySelector("#scoll_top >  perfect-scrollbar");
                tableTagElement = <HTMLElement>document.querySelector("#scoll_top >  perfect-scrollbar > .ps > .ps-content > table");
                this.getFixedClass = perfectTagElement ? perfectTagElement.classList : '';
                this.track = <HTMLElement>document.querySelector("#scoll_top > perfect-scrollbar > .ps > .ps__rail-x > .ps__thumb-x");
            }
            else {
                TableName = editableTable;
                perfectTagElement = <HTMLElement>document.querySelector("#Editable_Exp >  perfect-scrollbar");
                tableTagElement = <HTMLElement>document.querySelector("#Editable_Exp >  perfect-scrollbar > .ps > .ps-content > table");
                this.getFixedClass = perfectTagElement ? perfectTagElement.classList : '';
                this.track = <HTMLElement>document.querySelector("#Editable_Exp > perfect-scrollbar > .ps > .ps__rail-x > .ps__thumb-x");
            }
            // let perfectTagElement = <HTMLElement>document.querySelector("#scoll_top >  perfect-scrollbar");
            // let tableTagElement = <HTMLElement>document.querySelector("#scoll_top >  perfect-scrollbar > .ps > .ps-content > table");
            // this.getFixedClass = perfectTagElement ? perfectTagElement.classList : '';
            // this.track = <HTMLElement>document.querySelector("#scoll_top > perfect-scrollbar > .ps > .ps__rail-x > .ps__thumb-x");
            if (tableTagElement.offsetWidth != this.checktableWidth || perfectTagElement.offsetWidth != this.railWidth) {
                if (this.ActionColumnFixed == true || status == true) {
                    if (this.getFixedClass.contains("fixedClass1")) {
                        this.trackWidth = ((perfectTagElement.offsetWidth / tableTagElement.offsetWidth) * perfectTagElement.offsetWidth) - TableName.normalCol.fixedClass1;
                        if (this.trackWidth < this.minLength) {
                            perfectTagElement.classList.add("worstCase");
                            this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - TableName.worstCol.fixedClass1;
                        }
                        else {
                            perfectTagElement.classList.remove("worstCase");
                            this.trackWidth = ((perfectTagElement.offsetWidth / tableTagElement.offsetWidth) * perfectTagElement.offsetWidth) - TableName.normalCol.fixedClass1;
                        }
                    }
                    if (this.getFixedClass.contains("fixedClass2")) {
                        this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - TableName.normalCol.fixedClass2;

                        if (this.trackWidth < this.minLength) {
                            perfectTagElement.classList.add("worstCase");
                            debugger
                            this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - TableName.worstCol.fixedClass2;
                        }
                        else {
                            perfectTagElement.classList.remove("worstCase");
                            this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - TableName.normalCol.fixedClass2;
                        }
                    }
                    if (this.getFixedClass.contains("fixedClass3")) {
                        this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - TableName.normalCol.fixedClass3;

                        if (this.trackWidth < this.minLength) {
                            perfectTagElement.classList.add("worstCase");
                            this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - TableName.worstCol.fixedClass3;
                        }
                        else {
                            perfectTagElement.classList.remove("worstCase");
                            this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - TableName.normalCol.fixedClass3;
                        }
                    }
                }
                else {
                    if (this.getFixedClass == "fixedClass1") {
                        this.trackWidth = this.track.style.width.split('p')[0] - 200;
                    }
                    if (this.getFixedClass == "fixedClass2") {
                        this.trackWidth = this.track.style.width.split('p')[0] - 336;
                    }
                    if (this.getFixedClass == "fixedClass3") {
                        this.trackWidth = this.track.style.width.split('p')[0] - 472;
                    }
                    if (this.getFixedClass.contains("fixedClass1")) {
                        this.trackWidth = ((perfectTagElement.offsetWidth / tableTagElement.offsetWidth) * perfectTagElement.offsetWidth) - 200;
                        if (this.trackWidth < this.minLength) {
                            perfectTagElement.classList.add("worstCase");
                            this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - 120;
                        }
                        else {
                            perfectTagElement.classList.remove("worstCase");
                            this.trackWidth = ((perfectTagElement.offsetWidth / tableTagElement.offsetWidth) * perfectTagElement.offsetWidth) - 200;
                        }
                    }
                    if (this.getFixedClass.contains("fixedClass2")) {
                        this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - 336;

                        if (this.trackWidth < this.minLength) {
                            perfectTagElement.classList.add("worstCase");
                            debugger
                            this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - 201;
                        }
                        else {
                            perfectTagElement.classList.remove("worstCase");
                            this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - 336;
                        }
                    }
                    if (this.getFixedClass.contains("fixedClass3")) {
                        this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - 472;

                        if (this.trackWidth < this.minLength) {
                            perfectTagElement.classList.add("worstCase");
                            this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - 281;
                        }
                        else {
                            perfectTagElement.classList.remove("worstCase");
                            this.trackWidth = (perfectTagElement.offsetWidth / tableTagElement.offsetWidth * perfectTagElement.offsetWidth) - 472;
                        }
                    }
                }
            }
            this.railWidth = perfectTagElement.offsetWidth;
            this.checktableWidth = tableTagElement.offsetWidth;
            this.track.style.maxWidth = this.trackWidth + 'px';
        }
    }

    Base64Download(data) {  
        var fileType;
        if(data.MimeType) {
            fileType = data.MimeType;
        }  else {
            fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        }
        var a = document.createElement("a"); //Create <a>
        a.href = "data:" + fileType + ";base64," + data.Base64String; //Image Base64 Goes here
        a.download = data.Name; //File name Here
        a.click(); //Downloaded file
      }

      getDuration(diffDays,diffHours,diffMinutes) {
        var dayns = '';  var minutens = '';  var hourns = '';
        if (Number(diffDays) > 0) {
          if (Number(diffDays) == 1) { 
            dayns = diffDays + ' ' + "Day ";
          } else {
            dayns = diffDays + ' ' + "Days ";
          }
        }
        if (Number(diffHours) > 0) {
          if (Number(diffHours) == 1) {  
            hourns = diffHours + ' ' + "Hour ";
          } else {
            hourns = diffHours + ' ' + "Hours ";
          }
        }
        if (Number(diffMinutes) > 0) {
          if (Number(diffMinutes) == 1) {  
            minutens = diffMinutes + ' ' + "Minute ";
          } else {
            minutens = diffMinutes + ' ' + "Minutes ";
          }
        }

        return dayns + hourns + minutens;
      }

      getRoleAccess() {
          if (localStorage.getItem('RoleInfo')) {
            let data =  JSON.parse(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('RoleInfo'), 'DecryptionDecrip'));
            if (data[0].IsExportExcel) {
                return data[0].IsExportExcel
            } else {
                return false
            }
          } else {
              return false
          }
      }

      TempEditLeadDetails() {
        let lead = JSON.parse(sessionStorage.getItem('TempEditLeadDetails'));
        if (lead) {
            sessionStorage.setItem('TempEditLeadDetails',JSON.stringify({...lead, isMeetingCreate:false}));
        }
      }
}
