import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { JsonApiService } from './json-api.service';
import { Observable, of, Subject, from as fromPromise, throwError } from 'rxjs';
import { campaign } from '../models/campaign.model';
import { ApiService } from './api.service';
import { map } from 'rxjs/internal/operators/map';
import { DatePipe } from '@angular/common';
import { OfflineService } from './offline.services';
import { switchMap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '@env/environment';
import { EncrDecrService } from './encr-decr.service';
import { GetAccountDetails } from '@app/core/interfaces/get-account-details';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { Router } from '@angular/router';
import { EnvService } from './env.service';

const envADAL = new EnvService();

// Read environment variables from browser window

const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

// Assign environment variables from browser window to env
// In the current implementation, properties from env.js overwrite defaults from the EnvService.

// If needed, a deep merge can be performed here to merge properties instead of overwriting them.

for (const key in browserWindowEnv) {
  if (browserWindowEnv.hasOwnProperty(key)) {

    envADAL[key] = window['__env'][key];
  }
}

const l3oBaseUrl = envADAL.l3oBaseUrl;
const l2oBaseUrl = envADAL.l2oBaseUrl;
const camunda_BASE_URL = envADAL.camunda_BASE_URL;
const envName = envADAL.envName.toLowerCase();
const l2oFileUploadBaseUrl = envADAL.l2oFileUploadBaseUrl;
const BASE_URL = 'https://quapi-dev.wipro.com/L2O.DA.Api/'
// let camundaPortsDEV = {'create':,'modif':, 'assign':, 'reserve':};
// let camundaPortsUAT = {'create':,'modif':, 'assign':, 'reserve':};
// let camundaPort =  {'create':,'modif':, 'assign':, 'reserve':};


const routes = {
    /** ================= Sprint 3 API's Url's  *START*** *=============================================== */
    DeactivateReference: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/DeActivate',
    getAdvisoryAnalyst: 'v3/CustomerManagement_Sprint3Controller/SearchAdvisoryRAnalyst',
    addAdvisoryAnalyst: 'v3/CustomerManagement_Sprint3Controller/Account/AddAdvisorRAnalyst',
    AccountHistoryApi: 'v3/CustomerManagement_Sprint3Controller/CreationHistory',
    AssignmentRefHistory: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/History',
    ActiveRequest: 'v3/CustomerManagement_Sprint3Controller/ActiveRequests',
    AssigActiveRequests: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/ActiveRequests',
    ModificationActiveRequest: 'v3/CustomerManagement_Sprint3Controller/Account/ModificationActiveRequests',
    ModificationCreationHistoryRequest: 'v3/CustomerManagement_Sprint3Controller/Account/ModificationCreationHistory',
    GetAlliances: 'v3/CustomerManagement_Sprint3Controller/AllianceAccounts',
    getAdvisoryAnalystAccounts: 'v3/CustomerManagement_Sprint3Controller/AdvisoryRAnalystAccounts',
    getActiveAccount: 'v3/CustomerManagement_Sprint3Controller/ActiveAccounts',
    accountSearch: 'v3/CustomerManagement_Sprint3Controller/AccountSearch',
    Relationshipaccountsearch: 'v3/CustomerManagement_Sprint3Controller/Contact/SearchRelationshipPlan',
    SearchContactListByAccount: 'v3/CustomerManagement_Sprint3Controller/Contact/SearchContactListByAccount',
    SearchIncentivisedUser: 'v3/CustomerManagement_Sprint3Controller/SearchIncentivisedUser',
    SearchNonincentivisedUser: 'v3/CustomerManagement_Sprint3Controller/Teams/NonIncentivizeUser/search',
    reserveAccount: 'v3/CustomerManagement_Sprint3Controller/ReserveAccounts',
    createAssignmentReference: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference',
    detailsAssignmentReference: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/Details',
    editAssignmentReference: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/Edit',
    existingAccountSearch: 'v3/CustomerManagement_Sprint3Controller/ExistingAccountSearch',
    searchAccountinWiproDatabase: 'v3/CustomerManagement_Sprint3Controller/SearchAccountinWiproDatabase',
    GetRelationship: 'v3/CustomerManagement_Sprint3Controller/Contact/ContactRelationShipPlanList',
    DelRelationnship: 'v3/CustomerManagement_Sprint3Controller/Contact/DeleteRelationshipPlan',
    // ReworkAccountActivation: l3oBaseUrl + 'v3/CustomerManagement_Sprint3Controller/ReserveAccountActivation/Rework',
    PowerBIUrls: 'v3/CustomerManagement_Sprint3Controller/Account/PowerBIUrls',
    // ReviewNewAccountReworkRequest: l3oBaseUrl + 'v3/CustomerManagement_Sprint3Controller/Account/ReWorkAccount',
    AddRelationShipPlan: 'v3/CustomerManagement_Sprint3Controller/Account/AddRelationShipPlan',
    EditRelationShipPlan: 'v3/CustomerManagement_Sprint3Controller/Account/EditRelationShipPlan',
    DetailsRelationShipPlan: 'v3/CustomerManagement_Sprint3Controller/Account/DetailsRelationShipPlan',
    ReviewNewAccount: 'v3/CustomerManagement_Sprint3Controller/ActiveRequestDetails',
    AccountTransitionRequest: 'v3/CustomerManagement_Sprint3Controller/AccountTransition/Details',
    createAccountTransitionRequest: 'v3/CustomerManagement_Sprint3Controller/AccountTransitionCheckList/Create',
    createKTChecklistRequest: 'v3/CustomerManagement_Sprint3Controller/AccountKTCheckList/Create',
    updateTransitionRequest: 'v3/CustomerManagement_Sprint3Controller/AccountTransition/Update',
    CustomDropdown: 'v3/CustomerManagement_Sprint3Controller/Account/ListByRole',
    ManagmentLoglist: 'v3/CustomerManagement_Sprint3Controller/ManagementLog/List',
    draftCreate: 'v3/CustomerManagement_Sprint3Controller/Create',
    draftDetails: 'v3/CustomerManagement_Sprint3Controller/ActiveRequest/DraftDetails',
    // reserveAccountActivation1: l3oBaseUrl + "Account/ReserveAccountActivation",
    moreviewslist: 'v3/CustomerManagement_Sprint3Controller/moreviewslist',
    AccountOverviewDetails: 'v3/CustomerManagement_Sprint3Controller/AccountDetails',
    AddAlliance: 'v3/CustomerManagement_Sprint3Controller/Account/AddAlliance',
    DeLinkAlliance: 'v3/CustomerManagement_Sprint3Controller/Account/DeLinkAlliance',
    DeLinkAdvisory: 'v3/CustomerManagement_Sprint3Controller/Account/DeLinkAdvisoryRAnalyst',
    AddCompetitor: 'v3/CustomerManagement_Sprint3Controller/Account/AddCompetitor',
    DeLinkCompetitor: 'v3/CustomerManagement_Sprint3Controller/Account/DeLinkCompetitor',
    SearchCompetitor: 'v3/CustomerManagement_Sprint3Controller/Account/SearchCompetitor',
    GetVerticalandSBU: 'v3/CustomerManagement_Sprint3Controller/VerticalandSBU',
    CityByState: 'v3/CustomerManagement_Sprint3Controller/CityByState',
    StateByCountry: 'v3/CustomerManagement_Sprint3Controller/StateByCountry',
    CountryByGeo: 'v3/CustomerManagement_Sprint3Controller/CountryByGeo',
    CountryByRegion: 'v3/CustomerManagement_Sprint3Controller/CountryByRegion',
    FinancialYear: 'v3/CustomerManagement_Sprint3Controller/FinancialYear',
    SaveAccountRE: 'v3/CustomerManagement_Sprint3Controller/Account/AccountRE/Edit',
    // SearchSwapAccounts: 'v3/CustomerManagement_Sprint3Controller/SearchSwapAccounts',
    VerticalandSBU: 'v3/CustomerManagement_Sprint3Controller/VerticalandSBU',
    RegionByGeo: 'v3/CustomerManagement_Sprint3Controller/RegionByGeo',
    SaveAccountOverview: 'v3/CustomerManagement_Sprint3Controller/Account/Overview/Edit',
    SaveRelationShips: 'v3/CustomerManagement_Sprint3Controller/Account/RelationShips/Edit',
    SaveCustomerDetails: 'v3/CustomerManagement_Sprint3Controller/Account/CustomerDetails/Edit',
    AddCBU: 'v3/CustomerManagement_Sprint3Controller/Account/AddCBU',
    ActivateorDeActivateAccountCBU: 'v3/CustomerManagement_Sprint3Controller/Account/ActivateorDeActivateAccountCBU',
    SearchAllianceAccounts: 'v3/CustomerManagement_Sprint3Controller/Account/SearchAllianceAccounts',
    AccountAttributeComment: 'v3/CustomerManagement_Sprint3Controller/AccountAttributeComment',
    UltimateParentAccount: 'v3/CustomerManagement_Sprint3Controller/GetBothAccountProspectIdByName',
    searchADMs: '/v3/CustomerManagement_Sprint3Controller/AccountOwnerSearch',
    SeachDunsNumberByName: 'v3/CustomerManagement_Sprint3Controller/SeachDunsNumberByName',
    ParentDunsIdByParentAccount: 'v3/CustomerManagement_Sprint3Controller/ParentDunsIdByParentAccount',
    UltimateParentDunsIdByUltimateParentAccount: 'v3/CustomerManagement_Sprint3Controller/UltimateParentDunsIdByUltimateParentAccount',
    updateStandbyOwner: 'v3/CustomerManagement_Sprint3Controller/Account/UpdateStandByOwner',
    //region api 
    RegionName: 'v3/CustomerManagement_Sprint3Controller/RegionName',
    //reverse hierarchy for geo, region, country, state, city 
    GeographyByName: 'v3/CustomerManagement_Sprint3Controller/GeographyByName',
    StateByCity: 'v3/CustomerManagement_Sprint3Controller/StateByCity',
    CountryByState: 'v3/CustomerManagement_Sprint3Controller/CountryByState',
    RegionByCountry: 'v3/CustomerManagement_Sprint3Controller/RegionByCountry',
    GeoByRegion: 'v3/CustomerManagement_Sprint3Controller/GeoByRegion',
    CountryName: 'v3/CustomerManagement_Sprint3Controller/CountryName',
    StateName: 'v3/CustomerManagement_Sprint3Controller/StateName',
    CityName: 'v3/CustomerManagement_Sprint3Controller/CityName',
    /** Review/View Page GET API's START ** KKN** */
    UpdateCamundatoCRM: 'v3/CustomerManagement_Sprint3Controller/Prospect/UpdateCamundatoCRM',
    ModificationActiverequest_UpdateCamundatoCRM: 'v3/CustomerManagement_Sprint3Controller/ModificationActiverequest/UpdateCamundatoCRM',
    AssignUdateCamunddaCRM: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/UpdateCamundatoCRM',
    ActiverequestsReview: 'v3/CustomerManagement_Sprint3Controller/ActiveRequestDetails',
    AssignmentReferenceReview: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/Review',
    ModificationActiveRequestDetails: 'v3/CustomerManagement_Sprint3Controller/ModificationActiveRequestDetails',
    FetchReferenceAccountDetails: 'v3/CustomerManagement_Sprint3Controller/FetchReferenceAccountDetails',
    CheckAssignmentDuplication: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/Check',
    SearchAllBySubVerticalnSBU: 'v3/CustomerManagement_Sprint3Controller/SearchAllBySubVerticalnSBU',
    GetAllByCityNCountry: 'v3/CustomerManagement_Sprint3Controller/GetAllByCityNCountry',
    /** Review/View Page GET API's END ** KKN** */

    /** ================= Sprint 3 API's Url's  *END* ** *=============================================== */
    SBUByName: 'v1/CampaignManagement/SBUByName',
    GetVerticalbySBUID: 'v1/CampaignManagement/GetVerticalbySBUID',
    SearchVerticalAndSBU: 'v3/CustomerManagement_Sprint3Controller/SearchVerticalAndSBU',
    SubVerticalByVertical: 'v3/CustomerManagement_Sprint3Controller/SubVerticalByVertical',
    SearchAllBySubVertical: 'v3/CustomerManagement_Sprint3Controller/SearchAllBySubVertical',
    /** ================= Sprint 2 API's Url's  *START* ** *=============================================== */
    GetAccountContact: 'v3/CustomerManagement_Sprint3Controller/Contact/ContactListByAccount',
    RoleGuid: 'v1/EmployeeManagement/RoleGuid',
    RoleGuid_V1: 'v1/EmployeeManagement/RoleGuid_V1',
    /** ================= Sprint 2 API's Url's  *END* ** *=============================================== */


    /** ================= Sprint 3 Master API's Url's  *START* ** *=============================================== */

    DeleteContact: 'v1/AccountManagement/DeleteContact',
    getTimeZones: 'v1/MasterManagement/TimeZone',
    meetingType: 'v1/MasterManagement/MeetingType',
    meetingStage: 'v1/MasterManagement/MeetingStage',
    uploadDocUrl: l2oFileUploadBaseUrl,

    participant: 'v1/SearchManagement/SearchUser',
    participantNontrace: 'v3/CustomerManagement_Sprint3Controller/Contact/SearchNonTraceUser',
    manageLogAdd: 'v3/CustomerManagement_Sprint3Controller/Management/ManagementLogAdd',
    manageLogEdit: 'v3/CustomerManagement_Sprint3Controller/Management/ManagementLogEdit',
    manageLogDelete: 'v3/CustomerManagement_Sprint3Controller/Management/DeleteManagementLog',
    commentsNConclusionDelete: 'v3/CustomerManagement_Sprint3Controller/ManagementLog/DeleteCommentsNConclusion',
    accountNumSearch: 'v3/CustomerManagement_Sprint3Controller/SearchAccountNumber',
    manageLogDetails: 'v3/CustomerManagement_Sprint3Controller/Management/ManagementLogDetails',
    SearchAccountAndProspect: 'v3/CustomerManagement_Sprint3Controller/SearchAccountAndProspect',
    SearchAccountInDNB: 'v3/DNBController/SearchAccountInDNB',
    FilterDuration: 'v3/CustomerManagement_Sprint3Controller/ManagementLog/FilterDuration',
    /** ================= Sprint 3 Master API's Url's  *END* ** *=============================================== */
    //Spring 2

    /** account finder APi for search */
    // accountFinder: 'v3/CustomerManagement_Sprint3Controller/Account/AccountFinder',
    accountFinder: 'v3/CustomerManagement_Sprint3Controller/Account/AccountFinder_V1',
    gainAccess: 'v3/CustomerManagement_Sprint3Controller/Accounts/GainAccess',
    ///================================ Camunda API Url's  * START * KUNAL** ===============================
    createAccount: envADAL.camundaPorts.create + '/account/create',
    validateSbu: envADAL.camundaPorts.create + '/account/validateSbu',
    reviewCso: envADAL.camundaPorts.create + '/account/reviewCso',
    reworkOnProspect: envADAL.camundaPorts.create + '/account/reworkOnProspect',
    modification_reviewCso: envADAL.camundaPorts.modif + '/account/modification/reviewCso',
    modification_manualAccountModification: envADAL.camundaPorts.modif + '/account/modification/manualAccountModification',
    account_modification: envADAL.camundaPorts.modif + '/account/modification',
    modification_validateSbu: envADAL.camundaPorts.modif + '/account/modification/validateSbu',
    reserveAccount_activation_reviewCso: envADAL.camundaPorts.reserve + '/reserveAccount/activation/reviewCso',
    reserveAccount_activation_manualAccountModification: envADAL.camundaPorts.reserve + '/reserveAccount/activation/manualAccountModification',
    reserveAccount_activation: envADAL.camundaPorts.reserve + '/reserveAccount/activation',
    AssignmentReference: envADAL.camundaPorts.assign + '/assignment/reference',
    reference_sbuReview: envADAL.camundaPorts.assign + '/assignment/reference/sbuReview',
    reference_reviewCso: envADAL.camundaPorts.assign + '/assignment/reference/reviewCso',
    reference_reviewGcp: envADAL.camundaPorts.assign + '/assignment/reference/reviewGcp',
    reference_manualAccountModification: envADAL.camundaPorts.assign + '/assignment/reference/manualAccountModification',

    saveOnProspect: 'v3/CustomerManagement_Sprint3Controller/Prospect/SaveRework',
    saveOnAssignRef: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/Save',
    ///================================ Camunda API Url's  * END * KUNAL** ===============================
    List: 'v3/CustomerManagement_Sprint3Controller/Teams/NonIncentivizeUser/List',
    GetTeamsIncentivisedUserList: 'v3/CustomerManagement_Sprint3Controller/GetTeamsIncentivisedUserList',
    AddNonIncentivizeUser: 'v3/CustomerManagement_Sprint3Controller/Teams/NonIncentivizeUser/Add',
    Deleteuser: 'v3/CustomerManagement_Sprint3Controller/Teams/NonIncentivizeUser/Delete',
    UpdateNonIncentivizeUser: 'v3/CustomerManagement_Sprint3Controller/Teams/NonIncentivizeUser/Update',
    AllTabs_Edit: 'v3/CustomerManagement_Sprint3Controller/Account/AllTabs/Edit',
    EditFlag: 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/EditFlag',
    CreateSAPCustomer: 'v3/CustomerManagement_Sprint3Controller/Account/CreateSAPCustomer',
    //https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/CustomerManagement_Sprint3Controller/Teams/NonIncentivizeUser/Update
    //api/v3/CustomerManagement_Sprint3Controller/Teams/NonIncentivizeUser/Delete
    ////==================================Active Account Filter API's =========================////////////////////
    // SearchAccountName: 'v3/CustomerManagement_Sprint3Controller/SearchFilterAccountName',
    SearchRANumber: 'v3/CustomerManagement_Sprint3Controller/SearchRANumber',
    // SearchAccountNumber: 'v3/CustomerManagement_Sprint3Controller/SearchFilterAccountNumber',
    SearchFilterAccountNumber: 'v3/CustomerManagement_Sprint3Controller/SearchFilterAccountNumber',
    SearchAccounts: 'v3/CustomerManagement_Sprint3Controller/SearchAccounts',
    AccountOwnerSearch: 'v3/CustomerManagement_Sprint3Controller/AccountOwnerSearch',
    secondOwnerData: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/OwnerSearch',
    addSecondOwnerData: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/AddSecondaryOwner',
    SearchAccountType: 'v1/MasterManagement/AccountType',
    SearchAccountClassification: 'v1/MasterManagement/AccountClassification',
    // ActiveAccountsList: 'v3/DownloadExcellController/ActiveAccountsList',
    ////==================================AdvisorAnalyst Filter API's =========================////////////////////
    // AdvisorAnalystSearchAccountName: 'v3/CustomerManagement_Sprint3Controller/SearchAccountName',
    // AdvisorAnalystSearchAccountNumber: 'v3/CustomerManagement_Sprint3Controller/SearchAccountNumber',
    SearchAccountStatusCode: 'v1/MasterManagement/AccountStatusCode',
    ////==================================All  Filter API's =========================////////////////////
    FilterActiveAccounts: 'v3/CustomerManagement_Sprint3Controller/Account/FilterActiveAccounts',
    FilterAllianceAccounts: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAllianceAccounts',
    FilterAdvisorRAnalystAccounts: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAdvisorRAnalystAccounts',
    FilterReserveAccounts: 'v3/CustomerManagement_Sprint3Controller/Account/FilterReserveAccounts',
    FilterAccountFinderList: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountFinderList',
    FilterActiveRequests: 'v3/CustomerManagement_Sprint3Controller/Account/FilterActiveRequests',
    AssignmentReferenceRequestStatus: 'v1/MasterManagement/AssignmentReferenceRequestStatus',
    FilterAssignmentReferenceHistory: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAssignmentReferenceHistory',
    FilterCreationHistory: 'v3/CustomerManagement_Sprint3Controller/Account/FilterCreationHistory',
    FilterManagementLogList: 'v3/CustomerManagement_Sprint3Controller/Account/FilterManagementLogList',
    FilterModificationActiveRequests: 'v3/CustomerManagement_Sprint3Controller/Account/FilterModificationActiveRequests',
    FilterModificationCreationHistory: 'v3/CustomerManagement_Sprint3Controller/Account/FilterModificationCreationHistory',
    FilterNonIncentivizedUsers: 'v3/CustomerManagement_Sprint3Controller/Account/FilterNonIncentivizedUsers',

    ////==================================Active Request  Filter API's =========================////////////////////


    SearchProspectName: 'v3/CustomerManagement_Sprint3Controller/SearchProspectName',
    ProspectRequestType: 'v1/MasterManagement/ProspectRequestType',
    SearchFilterAccountName: 'v3/CustomerManagement_Sprint3Controller/SearchFilterAccountName',
    ProspectStatus: 'v1/MasterManagement/ProspectStatus',
    ProspectType: 'v1/MasterManagement/ProspectType',
    ModificationRequestType: 'v1/MasterManagement/ModificationRequestType',
    ModificationRequestStatus: 'v1/MasterManagement/ModificationRequestStatus',
    SearchUser: 'v1/SearchManagement/SearchUser',
    //    v1/SearchManagement/SearchUser
    AccountTeamsFunction: 'v1/MasterManagement/AccountTeamsFunction',
    SearchAccountNumber: 'v3/CustomerManagement_Sprint3Controller/SearchAccountNumber',
    TimeZone: 'v1/MasterManagement/TimeZone',
    MeetingType: 'v1/MasterManagement/MeetingType',
    MeetingStage: 'v1/MasterManagement/MeetingStage',
    Currency: 'v1/MasterManagement/Currency_V2', //currency
    GetGeographyByName: 'v1/AccountManagement/GetGeographyByName',
    // RegionByGeo: 'v3/CustomerManagement_Sprint3Controller/RegionByGeo',
    GetAllByRegion: 'v3/CustomerManagement_Sprint3Controller/GetAllByRegion',
    GetAllByCountry: 'v3/CustomerManagement_Sprint3Controller/GetAllByCountry',
    GetAllByState: 'v3/CustomerManagement_Sprint3Controller/GetAllByState',
    GetAllByCity: 'v3/CustomerManagement_Sprint3Controller/GetAllByCity',
    ActiveAccountsList: 'v3/DownloadExcellController/ActiveAccountsList',
    AllianceAccountsList: 'v3/DownloadExcellController/AllianceAccountsList',
    AdvisorRAnalystAccountsList: 'v3/DownloadExcellController/AdvisorRAnalystAccountsList',
    ReserveAccountsList: 'v3/DownloadExcellController/ReserveAccountsList',
    ManagementLogList: 'v3/DownloadExcellController/ManagementLogList',
    NonIncentivisedUsersList: 'v3/DownloadExcellController/NonIncentivisedUsersList',
    RelationShipPlanList: 'v3/DownloadExcellController/RelationShipPlanList',
    IncentivizedUserList: 'v3/DownloadExcellController/IncentivizedUserList',
    SearchFilterActiveAccountNumber: 'v3/CustomerManagement_Sprint3Controller/SearchFilterActiveAccountNumber',
    SearchFilterReserveAccountNumber: 'v3/CustomerManagement_Sprint3Controller/SearchFilterReserveAccountNumber',
    SearchFilterAllianceAccountNumber: 'v3/CustomerManagement_Sprint3Controller/SearchFilterAllianceAccountNumber',
    SearchFilterAdvisoryAccountNumber: 'v3/CustomerManagement_Sprint3Controller/SearchFilterAdvisoryAccountNumber',
    SearchFilterActiveAccountName: 'v3/CustomerManagement_Sprint3Controller/SearchFilterActiveAccountName',
    SearchFilterAllianceAccountName: 'v3/CustomerManagement_Sprint3Controller/SearchFilterAllianceAccountName',
    SearchFilterAdvisoryAccountName: 'v3/CustomerManagement_Sprint3Controller/SearchFilterAdvisoryAccountName',
    SearchFilterReserveAccountName: 'v3/CustomerManagement_Sprint3Controller/SearchFilterReserveAccountName',
    IncentivisedUserName: 'v3/CustomerManagement_Sprint3Controller/GetTeamsIncentivisedUserList/SearchColumnsList/IncentivisedUserName',
    IMSRole: 'v3/CustomerManagement_Sprint3Controller/GetTeamsIncentivisedUserList/SearchColumnsList/IMSRole',
    BuissenessUnit: 'v3/CustomerManagement_Sprint3Controller/GetTeamsIncentivisedUserList/SearchColumnsList/BuissenessUnit',
    GroupCustomerName: 'v3/CustomerManagement_Sprint3Controller/GetTeamsIncentivisedUserList/SearchColumnsList/GroupCustomerName',
    Geo: 'v3/CustomerManagement_Sprint3Controller/GetTeamsIncentivisedUserList/SearchColumnsList/Geo',
    FilterAndSort: 'v3/CustomerManagement_Sprint3Controller/GetTeamsIncentivisedUserList/FilterAndSort',
    SearchAccountName: 'v3/CustomerManagement_Sprint3Controller/SearchAccountName',
    SearchCustomerCompanyContact: 'v1/AccountManagement/SearchCustomerCompanyContact',
    Title: 'v3/CustomerManagement_Sprint3Controller/RelationShipPlan/Title',
    RelationshipTheme: 'v1/MasterManagement/RelationshipTheme',
    FilterAssignmentReferenceActiveRequests: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAssignmentReferenceActiveRequests',
    FilterRelationShipPlanList: 'v3/CustomerManagement_Sprint3Controller/Account/FilterRelationShipPlanList',
    ActiveRequests: 'v3/DownloadExcellController/ActiveRequests',
    AccountContactList: 'v3/DownloadExcellController/AccountContactList',
    CreationHistory: 'v3/DownloadExcellController/CreationHistory',
    ActiveModification: 'v3/DownloadExcellController/Modification/ActiveRequests',
    CreationHistoryModification: 'v3/DownloadExcellController/Modification/CreationHistory',
    ActiveRequestsAssignmentReference: 'v3/DownloadExcellController/AssignmentReference/ActiveRequests',
    CreationHistoryAssignmentReference: 'v3/DownloadExcellController/AssignmentReference/CreationHistory',
    RequestDate: 'v3/CustomerManagement_Sprint3Controller/Prospect/RequestDate',
    AssignmentRequestDate: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/RequestDate',
    RequestDatemodification: 'v3/CustomerManagement_Sprint3Controller/Modification/RequestDate',
    SearchProspectAccountNumber: 'v3/CustomerManagement_Sprint3Controller/SearchProspectAccountNumber',
    HistoryRequestDate: 'v3/CustomerManagement_Sprint3Controller/Prospect/HistoryRequestDate',
    SearchProspectHistoryName: 'v3/CustomerManagement_Sprint3Controller/SearchProspectHistoryName',
    ProspectHistoryStatus: 'v1/MasterManagement/ProspectHistoryStatus',
    AssignmentReferenceHistoryAccountNumber: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/HistoryAccountNumber',
    AssignmentReferenceHistoryRequestDate: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/HistoryRequestDate',
    AssignmentReferenceStatusHistoryStatus: 'v1/MasterManagement/AssignmentReferenceStatus/History',
    AssignmentReferenceActiveRequestStatus: 'v1/MasterManagement/AssignmentReferenceRequestStatus',
    AssignmentReferenceActiveRequestDate: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/ActiveRequestDate',
    AssignmentReferenceActiveAccountNumber: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/ActiveAccountNumber',
    ModificationActiveRequestFilterName: 'v3/CustomerManagement_Sprint3Controller/Modification/ActiveRequestFilterName',
    ModificationHistoryFilterName: 'v3/CustomerManagement_Sprint3Controller/Modification/HistoryFilterName',
    ModificationHistoryFilterNumber: 'v3/CustomerManagement_Sprint3Controller/Modification/HistoryFilterNumber',
    ModificationRequestDate: 'v3/CustomerManagement_Sprint3Controller/Modification/RequestDate',
    ModificationActiveRequestStatus: 'v1/MasterManagement/ModificationRequestStatus',
    ModificationRequestHistoryStatus: 'v1/MasterManagement/ModificationRequestHistoryStatus',
    ProspectTypeHistory: 'v1/MasterManagement/ProspectTypeHistory',
    FilterAccountContactCBU: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactCBU',
    FilterAccountContactName: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactName',
    FilterAccountContactEmail: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactEmail',
    FilterAccountContactJobTitle: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactJobTitle',
    FilterAccountContactModifiedOn: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactModifiedOn',
    FilterAccountContactReportingManager: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactReportingManager',
    FilterAccountContactList: 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactList',
    AccountHirerachy: 'v3/CustomerManagement_Sprint3Controller/AccountHirerachy',
    OwnerSearchUser: 'v1/SearchManagement/SearchUser',
    ManagementLogMeetingDate: 'v3/CustomerManagement_Sprint3Controller/Account/ManagementLogMeetingDate',
    // CityByState: 'v3/CustomerManagement_Sprint3Controller/CityByState',
    CheckSBUSESpocs: 'v3/CustomerManagement_Sprint3Controller/Accounts/CheckSBUSESpocs',
    clearAutoSaveData: 'v1/ActionManagement/DeleteCache',
    RequestTypeUpdated: 'v3/CustomerManagement_Sprint3Controller/Prospect/RequestType',
    StatusUpdated: 'v3/CustomerManagement_Sprint3Controller/Prospect/Status',
    ProspectTypeUpdated: 'v3/CustomerManagement_Sprint3Controller/Prospect/ProspectType',
    HistoryStatusUpdated: 'v3/CustomerManagement_Sprint3Controller/Prospect/HistoryStatus',
    ModificationRequestActiveAccountTypeUpdated: 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/ActiveAccountType',
    ModificationRequestHistoryAccountTypeUpdated: 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/HistoryAccountType',
    ModificationRequestActiveRequestTypeUpdated: 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/ActiveRequestType',
    ModificationRequestHistoryRequestTypeUpdated: 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/HistoryRequestType',
    ModificationRequestActiveStatusUpdated: 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/ActiveStatus',
    ModificationRequestHistoryStatusUpdated: 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/HistoryStatus',
    AssignmentReferenceActiveStatusUpdated: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/ActiveStatus',
    AssignmentReferenceHistoryStatusUpdated: 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/HistoryStatus',
    SearchCustomerContact: 'v3/CustomerManagement_Sprint3Controller/Account/CustomerContact',
    SearchTypeModificationRequestAccountOwner: 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/AccountOwner',
    SearchTypeModificationRequestSBU: 'v3/CustomerManagement_Sprint3Controller/Filter/SBU',
    SearchTypeVertical: 'v3/CustomerManagement_Sprint3Controller/Filter/Vertical',
    SearchTypeSubVertical: 'v3/CustomerManagement_Sprint3Controller/Filter/SubVertical',
    SearchTypeGeo: 'v3/CustomerManagement_Sprint3Controller/Filter/Geo',
    SearchTypeAccountType: 'v3/CustomerManagement_Sprint3Controller/Filter/AccountType',
    SearchTypeRequestor: 'v3/CustomerManagement_Sprint3Controller/Filter/Requestor',
    OwnerShipHistory: 'v3/CustomerManagement_Sprint3Controller/Account/OwnerShipHistory',
    Cluster: 'v3/CustomerManagement_Sprint3Controller/Prospect/Cluster',
    NotesCUD: 'v3/NotesAndDetailsController/NotesCUD',
    NotesAndDetailsControllerList: 'v3/NotesAndDetailsController/List',
    PinView: 'v3/CustomerManagement_Sprint3Controller/Account/PinView',
    FilterMyActiveAccounts: 'v3/CustomerManagement_Sprint3Controller/Account/FilterMyActiveAccounts',
    MyActiveAccountsList: 'v3/DownloadExcellController/MyActiveAccountsList',
    FilterApprovalList: 'v1/NotificationManagement/FilterApprovalList',
    SearchApprovalColumnDescription: 'v1/NotificationManagement/SearchApprovalColumnDescription',
    SearchApprovalColumnPriority: 'v1/NotificationManagement/SearchApprovalColumnPriority',
    getApprovallistDownload: 'v1/NotificationManagement/DownloadApprovalList',
    SearchFilterMyActiveAccountName: 'v3/CustomerManagement_Sprint3Controller/SearchFilterMyActiveAccountName',
    SearchFilterMyActiveAccountNumber: 'v3/CustomerManagement_Sprint3Controller/SearchFilterMyActiveAccountNumber',
    MyAccountFilterCity: 'v3/CustomerManagement_Sprint3Controller/MyAccount/FilterCity',
    MyAccountFilterCountry: 'v3/CustomerManagement_Sprint3Controller/MyAccount/FilterCountry',
    MyAccountFilterClassification: 'v3/CustomerManagement_Sprint3Controller/MyAccount/FilterClassification',
    MyActiveFilterParentAccount: 'v3/CustomerManagement_Sprint3Controller/MyActiveFilter/ParentAccount',
    RelationShipCustomerContact: 'v3/CustomerManagement_Sprint3Controller/Account/CustomerContact',
    MoreviewDelete: 'v3/CustomerManagement_Sprint3Controller/Moreview/Delete',
    StandByAccountOwnerSearch: 'v3/CustomerManagement_Sprint3Controller/StandByAccountOwnerSearch',
    AccountClassification: 'v1/MasterManagement/AccountClassification',
    AccountClassificationByType: 'v3/CustomerManagement_Sprint3Controller/AccountClassificationByType',
    ReportsUrl: 'v3/CustomerManagement_Sprint3Controller/Account/ReportsUrl',


    //     CityRegion -- api/v3/CustomerManagement_Sprint3Controller/MyAccount/FilterCity
    // Country -- api/v3/CustomerManagement_Sprint3Controller/MyAccount/FilterCountry
    // Classification--  api/v3/CustomerManagement_Sprint3Controller/MyAccount/FilterClassification

    // AccountListByRole:'v3/CustomerManagement_Sprint3Controller/Account/ListByRole'
    //https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/CustomerManagement_Sprint3Controller/Accounts/CheckSBUSESpocs
    // AccountTeamsFunction :'v1/MasterManagement/AccountTeamsFunction'

    // NonIncentivisedUsersList :'v3/DownloadExcellController/NonIncentivisedUsersList'
    // SearchAccountNumber : 
    // CountryByRegion: 'v3/CustomerManagement_Sprint3Controller/CountryByRegion',
    // AccountType : 'v1/SearchManagement/SearchUser'
    // SearchUser : 'v1/SearchManagement/SearchUser'

    // SearchAccountNumber : 'v1/MasterManagement/AssignmentReferenceRequestStatus
    // AccountOwnerSearch : 'https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/CustomerManagement_Sprint3Controller/AccountOwnerSearch'
    // AdvisorAnalystAccountType: 'v1/MasterManagement/AccountType',
    // AdvisorAnalystAccountOwnerSearch: 'v3/CustomerManagement_Sprint3Controller/AccountOwnerSearch',
    // AllianceSearchAccountName : ,
    // SearchAccountNumber : ,
    // AccountStatusCode : ,
    // AccountType : ,
    // AccountOwnerSearch



    //     1.https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/CustomerManagement_Sprint3Controller/SearchAccountName
    // 2.https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/CustomerManagement_Sprint3Controller/SearchAccountNumber
    // 3.https://quapi-dev.wipro.com/L2O.Sprint1_2.Api/api/v1/MasterManagement/AccountStatusCode
    // 4.https://quapi-dev.wipro.com/L2O.Sprint1_2.Api/api/v1/MasterManagement/AccountType
    // 5.https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/CustomerManagement_Sprint3Controller/AccountOwnerSearch
    //     1.https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/CustomerManagement_Sprint3Controller/SearchAccountName
    // 2.https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/CustomerManagement_Sprint3Controller/SearchAccountNumber
    // 3.https://quapi-dev.wipro.com/L2O.Sprint1_2.Api/api/v1/MasterManagement/AccountStatusCode
    // 4.https://quapi-dev.wipro.com/L2O.Sprint1_2.Api/api/v1/MasterManagement/AccountType
    // 5.https://quapi-dev.wipro.com/L2O.Sprint3.Api/api/v3/CustomerManagement_Sprint3Controller/AccountOwnerSearch

    /** Help desk api routes */
    CreateMergeRequest: 'v3/HelpDeskController/Account/CreateMergeRequest',
    MergeList: 'v3/HelpDeskController/Account/MergeList',
    MergeDetails: 'v3/HelpDeskController/Account/MergeRequestDetails',
    deleteMergeData: 'v3/HelpDeskController/Account/DeleteMergeRequest',
    MergeSummary: 'v3/HelpDeskController/Account/MergeRequest/Summary',
    sourceAccMergeDetails: 'v3/HelpDeskController/Merge/SourceAccountByVertical',
    targetAccMergeDetails: 'v3/HelpDeskController/Merge/TargetAccountByVertical',
    editMergeRequest: 'v3/HelpDeskController/Account/EditMergeRequest',
    HelpdeskAccountCreation: 'v3/HelpDeskController/Account/Create',
    SearchPrivateEquity: 'v3/HelpDeskController/Account/SearchPrivateEquity',
    GetAccountDetailChatUserList: 'v1/DigitalAssistant/GetAccountDetailChatUserList',
    GetChatUserList : 'v1/DigitalAssistant/GetChatUserList'
};


export const OwnerRE: any[] = [
    { name: 'FullName', title: 'Name' },
    { name: 'Email', title: 'Email' },
]
export const altOwnerRE: any[] = [
    { name: 'FullName', title: 'Name' },
    { name: 'Email', title: 'Email' },
]

export const StandByOwner: any[] = [
    { name: 'FullName', title: 'Username' },
    { name: 'Email', title: 'Email' },
]
export const cbuContactSearch: any[] = [
    { name: 'Name', title: 'Contact Name' },
    { name: 'Email', title: 'Email Id' },
    { name: 'accountName', title: 'Account Name' },
    { name: 'Designation', title: 'Designation(Job Title)' },
]
export const advisoryAnalystSearch: any[] = [
    { name: 'Name', title: 'Account Name' },
    { name: 'Number', title: 'Account Number' },
    { name: 'Owner', title: 'Account Owner' },
    // { name: 'Vertical', title: 'Vertical' },
    // { name: 'Region', title: 'Region' },
    { name: 'accountType', title: 'Account Type' },
]
export const CurrencySearch: any[] = [
    { name: 'Desc', title: 'Desc' },
    { name: 'ISOCurrencyCode', title: 'ISO Currency' }
]
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
export const CompetitorHeader: any[] = [
    { name: 'Name', title: 'Name' },
    // { name: 'Number', title: 'Number' },
    // { name: 'Owner', title: 'Account Owner' },
    // { name: 'accountType', title: 'Account Type' },
];
export const allianceContactSearch: any[] = [
    { name: 'Name', title: 'Name' },
    { name: 'Number', title: 'Number' },
    { name: 'Owner', title: 'Account Owner' },
    { name: 'accountType', title: 'Account Type' },
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
export const currentVerticalOwnerHeader: any[] = [
    { name: 'Name', title: 'Name' },
    // { name: 'StateData', title: 'State' },

    // { name: 'Id', title: 'Sub vertical Id' }
];
export const AccountNameeAdvnHeader: any[] = [
    // { name: 'Name', title: 'Name' }
    { name: 'Name', title: 'Name' },
    { name: 'AccId', title: 'Account Number' },
    { name: 'Ownername', title: 'Account Owner' },
    { name: 'AccType', title: 'Account Type' }

];
export const AccountHeaders = {
    'AccountOwnerSearch': OwnerRE,
    'StandByAccountOwnerSearch': StandByOwner,
    'BUContactSearch': cbuContactSearch,
    'AllianceContactSearch': allianceContactSearch,
    'AdvisoryAnalystSearch': advisoryAnalystSearch,
    'Currency': CurrencySearch,
    'Owner': OwnerRE,
    'SBU': SbuAdvnHeader,
    'Vertical': verticalAdvnHeader,
    'SubVertical': subVerticalAdvnHeader,
    'Competitor': CompetitorHeader,
    'ParentAccount': ParentNameAdvnHeader,
    'UltimateParentAccount': UltimateParentNameAdvnHeader,
    'alternativeOwner': altOwnerRE,
    'Geo': geoAdvnHeader,
    'Region': regionAdvnHeader,
    'CountryReference': countryAdvnHeader,
    'CountrySubDivisionReference': stateAdvnHeader,
    'CityRegionReference': cityAdvnHeader,
    'currency': CurrencySearch,
    'Privateequaitity': UltimateParentNameAdvnHeader,
    'CurrentVerticalOwner': currentVerticalOwnerHeader,
    'accountOwnerPageNameSearch': AccountNameeAdvnHeader,
}

export const AccountAdvNames = {
    'AccountOwnerSearch': { name: 'Account owner', isCheckbox: false, isAccount: false },
    'StandByAccountOwnerSearch': { name: 'StandBy account owner', isCheckbox: false, isAccount: false },
    'BUContactSearch': { name: 'CBU Contact', isCheckbox: false, isAccount: false },
    'AllianceContactSearch': { name: 'Alliance name', isCheckbox: false, isAccount: false },
    'AdvisoryAnalystSearch': { name: 'Advisory analyst', isCheckbox: false, isAccount: false },
    'Currency': { name: 'Currency', isCheckbox: false, isAccount: false },
    'Owner': { name: 'Account owner', isCheckbox: false, isAccount: false },
    'SBU': { name: 'SBU', isCheckbox: false, isAccount: false },
    'Vertical': { name: 'Vertical', isCheckbox: false, isAccount: false },
    'SubVertical': { name: 'Sub vertical', isCheckbox: false, isAccount: false },
    'Competitor': { name: 'Competitor', isCheckbox: false, isAccount: false },
    'ParentAccount': { name: "Parent's name", isCheckbox: false, isAccount: false },
    'UltimateParentAccount': { name: "Ultimate parent's name", isCheckbox: false, isAccount: false },
    'alternativeOwner': { name: 'Alternate account owner', isCheckbox: false, isAccount: false },
    'Geo': { name: 'Geo', isCheckbox: false, isAccount: false },
    'Region': { name: 'Region', isCheckbox: false, isAccount: false },
    'CountryReference': { name: 'Country', isCheckbox: false, isAccount: false },
    'CountrySubDivisionReference': { name: 'Country sub-division', isCheckbox: false, isAccount: false },
    'CityRegionReference': { name: 'City region', isCheckbox: false, isAccount: false },
    'currency': { name: 'Currency', isCheckbox: false, isAccount: false },
    'Privateequaitity': { name: 'Private Equity Account', isCheckbox: false, isAccount: false },
    'CurrentVerticalOwner': { name: 'Vertical', isCheckbox: false, isAccount: false },
    'accountOwnerPageNameSearch': { name: 'Account Name', isCheckbox: false, isAccount: false },
};

//manage log
export const reviewChairPerson: any[] = [
    { name: 'FullName', title: 'User name' },
    { name: 'Email', title: 'Email' },
];
export const nonTraceUsers: any[] = [
    { name: 'FullName', title: 'User name' },
    { name: 'Email', title: 'Email' },
];

export const manageLogHeaders = {
    'ChairPersonSearch': reviewChairPerson,
    'NonTraceUsers': nonTraceUsers
};

export const manageLogNames = {
    'ChairPersonSearch': { name: 'Review chair person/Coach', isCheckbox: false, isAccount: false },
    'NonTraceUsers': { name: 'Participants (Non-Trace)', isCheckbox: true, isAccount: false },
};

@Injectable({
    providedIn: 'root'
})

export class AccountListService {
    sourceAccountData = [];
    private subject = new Subject<any>();
    private sourceAccData = new BehaviorSubject([]);
    targetAccData = this.sourceAccData.asObservable();


    changeSourceData(srcData: any) {
        this.sourceAccData.next(srcData)
    }
    sendparentaccountdetails(data: any) {
        this.subject.next(data);
    }
    getparentaccountdetails() {
        return this.subject.asObservable();
    }
    private Navsubject = new Subject<any>();

    sendAccountName(data: any) {
        this.Navsubject.next(data);
    }
    getAccountName() {
        return this.Navsubject.asObservable();
    }

    private CustomerDetail = new Subject<any>();

    setCustomerDetail() {
        this.CustomerDetail.next();
    }
    getCustomerDetail() {
        return this.CustomerDetail.asObservable();

    }
    private Prospectaccount = new Subject<any>();

    sendProspectGuid(data: any) {
        this.Prospectaccount.next(data);
    }
    getProspectGuid() {
        return this.Prospectaccount.asObservable();
    }
    isAccount: boolean = false;
    // private subject = new BehaviorSubject({});
    userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    private ownershipArray = new BehaviorSubject([]);
    currentOwnershipArray = this.ownershipArray.asObservable();
    getOwnershipHistory(message: any) {
        console.log(message);
        this.ownershipArray.next(message)
    }
    private accountDetails = new BehaviorSubject([]);
    accountDetailsData = this.accountDetails.asObservable();
    getaccountDetailsData(message: any) {
        console.log(message);
        this.accountDetails.next(message)
    }
    tabList2;
    attachList: any = [];
    attachListView: any = [];

    cachedArray = [];
    Name: any;
    // tablist: Array<tabListInterface>;
    public readonly AccountChacheType = {
        Table: 'Table',
        Details: 'Details'
    };;
    constructor(
        private jsonApiService: JsonApiService,
        private apiService: ApiService, private datepipe: DatePipe,
        private offlineServices: OfflineService, private http: HttpClient,
        private EncrDecr: EncrDecrService,
        public master3Api: S3MasterApiService,
        private router: Router
    ) {
        //      switch(envName){
        //   case 'dev':
        //         camundaPort = camundaPortsDEV;
        //     return;
        //      case 'mobileqa':
        //         camundaPort = camundaPortsQA;
        //     return; 
        //     case 'prod':
        //         camundaPort = camundaPortsQA;
        //     return; 
        //     case 'preuat':
        //         camundaPort = camundaPortsUAT;        
        //     return;
        // }
    }

    getLookUpFilterDataRE(data): Observable<any> {
        switch (data.controlName) {
            case 'Geo':
                return this.getLookupCommondata(data, routes.GeographyByName, '');
            case 'UltimateParentAccount':
            case 'ParentAccount':
                return this.getLookupCommondata(data, routes.SearchAccounts, '');
            case 'alternativeOwner':
            case 'AccountOwnerSearch':
            case 'Owner':
                return this.getAccountOwnerData(data);
            // case 'StandByAccountOwnerSearch':
            //     return this.getStandByAccountOwnerData(data);
            // case 'BUContactSearch':
            //     return this.getBUData(data);
            // case 'Competitor':
            //     return this.getCompetitor(data);
            // case 'AllianceContactSearch':
            //     return this.getAllianceData(data);
            // case 'AdvisoryAnalystSearch':
            //     return this.getAdvisoryAnalystData(data);

            case 'Currency':
                return this.getLookupCommondata(data, routes.Currency, '');
            case 'SBU':
                return this.getLookupCommondata(data, routes.SBUByName, '');
            case 'Vertical':
                if (data.useFullData && data.useFullData.SbuId)
                    return this.getLookupCommondata(data, routes.GetVerticalbySBUID, data.useFullData.SbuId);
                else
                    return this.getLookupCommondata(data, routes.SearchVerticalAndSBU, '');
            case 'SubVertical':
                if (data.useFullData && data.useFullData.verticalId)
                    return this.getLookupCommondata(data, routes.SubVerticalByVertical, data.useFullData.verticalId);
                else
                    return this.getLookupCommondata(data, routes.SearchAllBySubVertical, '');

            case 'Region':
                if (data.useFullData && data.useFullData.geoId)
                    return this.getLookupCommondata(data, routes.RegionByGeo, data.useFullData.geoId);
                else
                    return this.getLookupCommondata(data, routes.GetAllByRegion, '');

            case 'CountryReference':
                if (data.useFullData && data.useFullData.regionId)
                    return this.getLookupCommondata(data, routes.CountryByRegion, data.useFullData.regionId);
                else
                    return this.getLookupCommondata(data, routes.GetAllByCountry, '');

            case 'CountrySubDivisionReference':
                if (data.useFullData && data.useFullData.countryId)
                    return this.getLookupCommondata(data, routes.StateByCountry, data.useFullData.countryId);
                else
                    return this.getLookupCommondata(data, routes.GetAllByState, '');


            case 'CityRegionReference':
                if (data.useFullData && data.useFullData.stateId) {
                    return this.getLookupCommondata(data, routes.CityByState, data.useFullData.stateId);
                } else {
                    return this.getLookupCommondata(data, routes.GetAllByCity, '');
                }

        }
    }



    // getChairPersonData(data): Observable<any> {
    //     if (data.isService) {
    //         return this.getParticipants(data.useFullData.searchVal).pipe(switchMap((res: any) => {
    //             if (res) {
    //                 return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterChairPersonSearch(res.ResponseObject) : [] } : []);
    //             } else {
    //                 return of([]);
    //             }
    //         }));

    //     } else {
    //         return of(this.filterChairPersonSearch(data.data));
    //     }
    // }
    // nonTraceUsersData(data): Observable<any> {
    //     if (data.isService) {

    //         return this.getParticipants(data.useFullData.searchVal).pipe(switchMap((res: any) => {
    //             if (res) {
    //                 return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filternonTraceUsersData(res.ResponseObject) : [] } : []);
    //             } else {
    //                 return of([]);
    //             }
    //         }));

    //     } else {
    //         return of(this.filternonTraceUsersData(data.data));
    //     }
    // }

    getAccountOwnerData(data): Observable<any> {
        if (data.isService) {
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }
            return this.master3Api.AccountOwnerSearchRE(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAccountOwnerSearch(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAccountOwnerSearch(data.data))
        }
    }


    filterAccountOwnerSearch(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Id': x.SysGuid,
                        'FullName': (x.FullName) ? x.FullName : 'NA',
                        'Email': (x.Email) ? x.Email : 'NA',

                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }

    // getAdvisoryAnalystData(data): Observable<any> {
    //     if (data.isService) {
    //         let body = {
    //             "SearchText": data.useFullData.searchVal,
    //             "PageSize": data.useFullData.recordCount,
    //             "OdatanextLink": data.useFullData.OdatanextLink,
    //             "RequestedPageNumber": data.useFullData.pageNo
    //         }
    //         return this.getAdvisoryAnalyst(body).pipe(switchMap(res => {
    //             if (res) {
    //                 return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvisorySearch(res.ResponseObject) : [] } : [])
    //             } else {
    //                 return of([])
    //             }
    //         }))

    //     } else {
    //         return of(this.filterAdvisorySearch(data.data))
    //     }
    // }


    // filterAdvisorySearch(data): Observable<any> {
    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {
    //                     ...x,
    //                     'Id': x.SysGuid,
    //                     'Name': (x.Name) ? x.Name : 'NA',
    //                     'Owner': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : 'NA' : 'NA',
    //                     'Number': (x.Number) ? x.Number : 'NA',
    //                     'Vertical': (x.Vertical) ? (x.Vertical.Name) ? x.Vertical.Name : 'NA' : 'NA',
    //                     'Region': (x.Address) ? (x.Address.Region.Name) ? x.Address.Region.Name : 'NA' : 'NA',
    //                     'accountType': (x.Type) ? (x.Type.Value) ? x.Type.Value : 'NA' : 'NA',

    //                 }
    //             })
    //         } else {
    //             return of([])
    //         }
    //     } else {
    //         return of([])
    //     }
    // }

    getStandByAccountOwnerData(data): Observable<any> {
        if (data.isService) {
            const accountOwnerGuid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountOwnerGuid'), 'DecryptionDecrip'); //localStorage.getItem("accountOwnerGuid")
            let body = {
                "SearchText": data.useFullData.searchVal,
                "PageSize": data.useFullData.recordCount,
                "OdatanextLink": data.useFullData.OdatanextLink,
                "RequestedPageNumber": data.useFullData.pageNo
            }

            return this.master3Api.StandByAccountOwnerSearch(data.useFullData.searchVal, accountOwnerGuid).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterStandBySearch(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterStandBySearch(data.data))
        }
    }


    filterStandBySearch(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Id': x.SysGuid,
                        'FullName': (x.FullName) ? x.FullName : 'NA',
                        'Email': (x.Email) ? x.Email : 'NA',

                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
    }
    getCompetitor(data): Observable<any> {
        console.log(data);

        if (data.isService) {
            // let Guid = localStorage.getItem('accountSysId') ? localStorage.getItem('accountSysId') : '';
            return this.SearchCompetitor(data.useFullData.searchVal).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterCompetitor(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterCompetitor(data.data));
        }
    }
    filterCompetitor(data): Observable<any> {
        if (data) {
            // debugger;
            if (data.length > 0) {
                return data.map(x => {
                    console.log(x);

                    return {
                        ...x,
                        'Name': (x.Name) ? x.Name : 'NA',
                        'Id': (x.SysGuid) ? x.SysGuid : 'NA',
                        // 'accountName': (x.CustomerAccount) ? (x.CustomerAccount.FullName) ? x.CustomerAccount.FullName : 'NA' : 'NA',

                    };
                });
            } else {
                return of([]);
            }
        } else {
            return of([]);
        }
    }
    getBUData(data): Observable<any> {
        if (data.isService) {
            let accountSysId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
            let Guid = accountSysId ? accountSysId : '';
            // let Guid = localStorage.getItem('accountSysId') ? localStorage.getItem('accountSysId') : '';
            return this.master3Api.getSearchCustomerCompanyContact(data.useFullData.searchVal, Guid, 'CustomerContact').pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterBUData(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterBUData(data.data));
        }
    }


    filterBUData(data): Observable<any> {
        if (data) {
            // debugger;
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        ...x,
                        'Name': (x.FullName) ? x.FullName : 'NA',
                        // 'accountName': (x.CustomerAccount) ? (x.CustomerAccount.FullName) ? x.CustomerAccount.FullName : 'NA' : 'NA',
                        'accountName': (x.CustomerAccount) ? x.CustomerAccount.Name : 'NA',
                        'Id': (x.Guid) ? x.Guid : '',
                        'Designation': x.Designation,
                        'Email': x.Email

                    };
                });
            } else {
                return of([]);
            }
        } else {
            return of([]);
        }
    }

    // getAllianceData(data): Observable<any> {
    //     if (data.isService) {
    //         const body = {
    //             'SearchText': data.useFullData.searchVal,
    //             'PageSize': data.useFullData.recordCount,
    //             'OdatanextLink': data.useFullData.OdatanextLink,
    //             'RequestedPageNumber': data.useFullData.pageNo
    //         }
    //         // let accountSysId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountSysId'), 'DecryptionDecrip');
    //         // let Guid = accountSysId ? accountSysId : '';
    //         return this.getSearchAllianceAccounts(data.useFullData.searchVal).pipe(switchMap(res => {
    //             if (res) {
    //                 return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAllianceData(res.ResponseObject) : [] } : [])
    //             } else {
    //                 return of([]);
    //             }
    //         }));

    //     } else {
    //         return of(this.filterAllianceData(data.data))
    //     }
    // }


    // filterAllianceData(data): Observable<any> {
    //     // debugger;
    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {
    //                     ...x,
    //                     'Name': (x.Name) ? x.Name : 'NA',
    //                     'Number': (x.Number) ? x.Number : 'NA',
    //                     // 'accountName': (x.CustomerAccount) ? (x.CustomerAccount.FullName) ? x.CustomerAccount.FullName : 'NA' : 'NA',
    //                     // 'Email': (x.Email) ? x.Email : 'NA',
    //                     // 'Designation': (x.Designation) ? (x.Designation) : 'NA',
    //                     'Id': x.SysGuid ? x.SysGuid : ''

    //                 };
    //             });
    //         } else {
    //             return of([]);
    //         }
    //     } else {
    //         return of([]);
    //     }
    // }

    // getAdvisoryAnalystData(data): Observable<any> {
    //     debugger
    //     if (data.isService) {
    //         let body = {
    //             "SearchText": data.useFullData.searchVal,
    //             "PageSize": 10,
    //             "OdatanextLink": "",
    //             "RequestedPageNumber": 1
    //         }
    //         return this.getAdvisoryAnalyst(body).pipe(switchMap(res => {
    //             if (res) {
    //                 return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterLinkLeads(res.ResponseObject) : [] } : [])
    //             } else {
    //                 return of([])
    //             }
    //         }))

    //     } else {
    //         return of(this.filterLinkLeads(data.data))
    //     }
    // }


    // filterLinkLeads(data): Observable<any> {
    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {
    //                     ...x,
    //                     'Name': (x.Name) ? x.Name : 'NA',
    //                     'Owner': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : 'NA' : 'NA',
    //                     'Number': (x.Number) ? x.Number : 'NA',

    //                 }
    //             })
    //         } else {
    //             return of([])
    //         }
    //     } else {
    //         return of([])
    //     }
    // }
    //get relaionship planf

    // public formatErrors(error: any): Observable<any> {
    //     console.log(error);

    //       return throwError(error.error);
    // }

    OwnerShipHistory(ReqBody, url): Observable<any> {
        return this.apiService.post(routes[url], ReqBody);
        //return this.http.post(routes.RoleGuid, { "SysGuid": ReqBody });
    }
    getRoles(ReqBody): Observable<any> {
        return this.apiService.post(routes.RoleGuid, { 'SysGuid': ReqBody });
        //return this.http.post(routes.RoleGuid, { "SysGuid": ReqBody });
    }
    getRoles_v1(ReqBody): Observable<any> {
        return this.apiService.post(routes.RoleGuid_V1, { 'SysGuid': ReqBody });
        //return this.http.post(routes.RoleGuid, { 'SysGuid": ReqBody });
    }
    //get Time Zones
    getTimeZones(): Observable<any> {
        // return this.http.post(routes.getTimeZones, {});
        return this.apiService.post(routes.getTimeZones, {});
    }
    //get Meeting types
    getMeetingTypes(): Observable<any> {
        // return this.http.post(routes.meetingType, {});
        return this.apiService.post(routes.meetingType, {});
    }
    //get Meeting stage
    getMeetingStage(): Observable<any> {
        // return this.http.post(routes.meetingStage, {});
        return this.apiService.post(routes.meetingStage, {});
    }
    //get upload document
    uploadDocument(): Observable<any> {
        return this.http.post(routes.uploadDocUrl, {});
    }
    //get upload document
    uploadDocumentUrl() {
        return routes.uploadDocUrl;
    }
    ktChecklistImg(file) {
        return this.http.post(routes.uploadDocUrl, file);
    }
    //get upload document
    getParticipants(ReqBody): Observable<any> {
        // return this.http.post(routes.participant, { "SearchText": ReqBody });
        // debugger;
        return this.apiService.post(routes.participant, { "SearchText": ReqBody });
    }
    //get partcipants non trace users
    getParticipantsNontrace(ReqBody): Observable<any> {
        // return this.http.post(routes.participant, { "SearchText": ReqBody });
        return this.apiService.post(routes.participantNontrace, { 'SearchText': ReqBody });
    }
    //get Management details
    getManagementLog(ReqBody): Observable<any> {
        // return this.http.post(routes.participant, { "SearchText": ReqBody });
        return this.apiService.post(routes.manageLogDetails, { 'SysGuid': ReqBody });
    }
    //Management Log Add
    manageLogAdd(ReqBody): Observable<any> {
        // return this.http.post(routes.manageLogAdd, ReqBody);
        return this.apiService.post(routes.manageLogAdd, ReqBody);
    }
    //Management Log Edit
    manageLogEdit(ReqBody): Observable<any> {
        // return this.http.post(routes.manageLogEdit, ReqBody);
        return this.apiService.post(routes.manageLogEdit, ReqBody);

    }
    //Management Log Delete
    manageLogDelete(ReqBody): Observable<any> {
        // return this.http.post(routes.manageLogEdit, ReqBody);
        return this.apiService.post(routes.manageLogDelete, ReqBody);

    }
    //Management Log comments delete
    commentsNConclusionDelete(ReqBody): Observable<any> {
        // return this.http.post(routes.manageLogEdit, ReqBody);
        return this.apiService.post(routes.commentsNConclusionDelete, { MapGuid: ReqBody });
    }

    //account finder search
    accountFinderApi(ReqBody): Observable<any> {
        return this.apiService.post(routes.accountFinder, ReqBody);
    }
    //gain access
    gainAccessApi(ReqBody): Observable<any> {
        return this.apiService.post(routes.gainAccess, ReqBody);
    }

    updateStandbyOwnerData(ReqBody): Observable<any> {
        return this.apiService.post(routes.updateStandbyOwner, ReqBody);
    }

    GetRelationshipPlaneList(ReqBody: AllAccountReq): Observable<any> {
        // return this.http.post(routes.GetRelationship, ReqBody);
        return this.apiService.post(routes.GetRelationship, ReqBody);
    }
    DeleteRelationnship(ReqBody: AllAccountReq): Observable<any> {
        //return this.http.post(routes.DelRelationnship, { "Guid": ReqBody });
        return this.apiService.post(routes.DelRelationnship, { 'Guid': ReqBody });
    }
    DeleteAccountcontact(ReqBody): Observable<any> {
        //return this.http.post(routes.DelRelationnship, { "Guid": ReqBody });
        return this.apiService.post(routes.DeleteContact, { 'Guid': ReqBody });
    }
    GetAccountContactList(ReqBody: AllAccountReq): Observable<any> {
        //return this.http.post(routes.GetAccountContact,ReqBody);
        return this.apiService.post(routes.FilterAccountContactList, ReqBody);
    }
    //Contact Relaonship Plane    
    //get AllAccounts 
    getALLAccountList(ReqBody: AllAccountReq): Observable<any> {
        // return this.apiService.post(routes.AccountHistoryApi, ReqBody);
        //return this.http.post(routes.AccountHistoryApi, ReqBody);
        return this.apiService.post(routes.FilterCreationHistory, ReqBody);
    }
    getAllAssignmentRefList(ReqBody: AllAccountReq): Observable<any> {
        return this.apiService.post(routes.AssignmentRefHistory, ReqBody);
    }
    getactiverequest(ReqBody: AllAccountReq): Observable<any> {
        if (ReqBody.RequestedPageNumber === 1) {
            ReqBody.OdatanextLink = '';
        }
        //return this.apiService.post(routes.ActiveRequest,ReqBody)
        //  return this.http.post(routes.ActiveRequest, ReqBody)
        return this.apiService.post(routes.FilterActiveRequests, ReqBody);
    }
    getassignactiverequest(ReqBody: AllAccountReq): Observable<any> {
        //return this.apiService.post(routes.ActiveRequest,ReqBody)
        //  return this.http.post(routes.ActiveRequest, ReqBody)
        return this.apiService.post(routes.AssigActiveRequests, ReqBody);
    }
    getModificationActiveRequest(ReqBody: AllAccountReq): Observable<any> {
        //return this.apiService.post(routes.ModificationActiveRequest,ReqBody)
        // return this.http.post(routes.ModificationActiveRequest, ReqBody)
        return this.apiService.post(routes.FilterModificationActiveRequests, ReqBody);
    }
    getModificationCreationHistoryRequest(ReqBody: AllAccountReq): Observable<any> {
        //return this.apiService.post(routes.ModificationActiveRequest,ReqBody)
        //return this.http.post(routes.ModificationCreationHistoryRequest, ReqBody)
        return this.apiService.post(routes.FilterModificationCreationHistory, ReqBody);
    }
    //get AllAlliances 
    getAllAlliance(ReqBody: AllAccountReq): Observable<any> {
        // let url;
        // if (isFilterAPICall) {
        //     url = routes.FilterAllianceAccounts;
        // } else {
        //     url = routes.GetAlliances;
        // }
        // return this.apiService.post(routes.GetAlliances, ReqBody);
        //return this.http.post(routes.GetAlliances, ReqBody);
        return this.apiService.post(routes.FilterAllianceAccounts, ReqBody);
    }
    getAdvisoryRAnalystAccounts(ReqBody: AllAccountReq): Observable<any> {
        // return this.apiService.post(routes.GetAlliances, ReqBody);
        //return this.http.post(routes.GetAlliances, ReqBody);
        return this.apiService.post(routes.FilterAdvisorRAnalystAccounts, ReqBody);
    }
    // GetActiveAccount
    getActiveAccount(ReqBody: AllAccountReq): Observable<any> {
        if (ReqBody.RequestedPageNumber === 1) {
            ReqBody.OdatanextLink = '';
        }
        return this.apiService.post(routes.FilterActiveAccounts, ReqBody)
        // return this.apiService.post(routes.ActiveAccount, ReqBody);
        //return this.http.post(routes.getActiveAccount, ReqBody);
    }
    // GetActiveAccount
    getAllActiveAccount(ReqBody: AllAccountReq): Observable<any> {
        if (ReqBody.RequestedPageNumber === 1) {
            ReqBody.OdatanextLink = '';
        }
        return this.apiService.post(routes.FilterMyActiveAccounts, ReqBody)
        // return this.apiService.post(routes.ActiveAccount, ReqBody);
        //return this.http.post(routes.getActiveAccount, ReqBody);
    }

    getAllReserve(ReqBody: AllAccountReq): Observable<any> {
        return this.apiService.post(routes.FilterReserveAccounts, ReqBody);
        //  return this.http.post(routes.reserveAccount, body);
    }
    getSearchAllianceAccounts(keyword): Observable<any> {
        return this.apiService.post(routes.SearchAllianceAccounts, { "SearchText": keyword, "PageSize": 10, "OdatanextLink": "", "RequestedPageNumber": 1 });
    }
    // reserveAccountActivation(payload): Observable<any> {
    //     return this.apiService.post(routes.reserveAccountActivation1, payload)
    // }


    getCustomDropdown(reqBody) {

        return new Promise((resolve, reject) => {
            this.apiService.post(routes.CustomDropdown, reqBody).subscribe((res) => {
                // res["ResponseObject"]["CustomViews"] = [];
                // res["ResponseObject"]["CustomViews"].push({
                //     "@odata.etag": "cvbcvb",
                //     "name": "Uday Account View",
                //     "fetchxml": "jfjfggjfj",
                //     "layoutjson": "jggjfj",
                //     "layoutxml": "jfgjggj",
                //     "_ownerid_value": "f2e55b46-c464-e911-a830-000d3aa058cb",
                //     "returnedtypecode": "account",
                //     "userqueryid": "5d8e8f42-31ca-e911-a836-000d3aa058cb"
                // });
                this.filterResCustom(res["ResponseObject"]);
                // console.log("------------> this is tablist in promise", this.tabList2)
                resolve(this.tabList2);
            })
        })
    }
    /** getAccountHirerachy */
    getAccountHirerachy(obj) {
        return this.apiService.post(routes.AccountHirerachy, obj);
    }
    // getCustomTitle(id) {
    //     let listdata;
    //     switch (id ? id : '') {
    //         case 10:
    //             listdata = 'My active accounts';
    //             break;
    //         case 11:
    //             listdata = 'All Accounts';
    //             break;
    //         case 12:
    //             listdata = 'All Alliance Accounts';
    //             break;
    //         case 13:
    //             listdata = 'All Advisory Accounts';
    //             break;
    //         case 14:
    //             listdata = 'All Reserve Accounts';
    //             break;
    //         default:
    //             listdata = 'My active accounts';
    //             break;

    //     }
    //     return listdata;
    // }


    filterResCustom(res) { // function a to create the tabs for system and custom views
        var dropdowndatasystem = [];
        var dropdowndatacustom = [];
        var dummyall = [];
        for (var value of res["SystemViews"]) {
            dropdowndatasystem.push({
                title: value.Value,
                id: value.Id,
                isPinned: value.IsPinned,
                PinId: value.PinId,
                SysGuid: value.SysGuid ? value.SysGuid : '',

            });
        }
        for (var value of res["CustomViews"]) {
            dropdowndatacustom.push({
                title: value.ViewName,
                id: value.Userqueryid,
                isHidePine: true

            });
        }
        dummyall.push({
            GroupLabel: 'System views',
            GroupData: dropdowndatasystem
        });
        dummyall.push({
            GroupLabel: 'Custom views',
            GroupData: dropdowndatacustom
        });
        this.tabList2 = dummyall;
    }

    filterRes(res) {

        let dropdowndata = [];
        const dummy = [];
        res.map((item) => {
            dropdowndata.push({
                title: item.Value,
                id: item.Id,
            });
        });
        // console.log("filtered dropdown data->", dropdowndata);
        dummy.push({
            GroupLabel: 'System views',
            GroupData: dropdowndata
        });
        this.tabList2 = dummy;
        console.log("new tab list->", this.tabList2);
    }
    //********* More Views - Custom Views */Obervable<SearchItem[]>
    getAllCustomViews(inpParam: any) {
        // this.apiService.post(routes.moreviewslist, inpParam).subscribe( data => {
        //    return data['ResponseObject'];
        // });
        return this.apiService.post(routes.moreviewslist, inpParam);
    }
    // account search api binding
    accountSearch(searchText, searchType, pageSize: number, OdatanextLink: string, RequestedPageNumber: number): Observable<any> {
        const search = {
            'SearchText': searchText,
            'SearchType': searchType,
            'PageSize': pageSize,
            'OdatanextLink': OdatanextLink,
            'RequestedPageNumber': RequestedPageNumber,
            'Guid': this.userId
        }
        return this.apiService.post(routes.accountSearch, search);
    }
    GetRelatioshipaccountSearch(searchText, searchType, pageSize: number, OdatanextLink: string, RequestedPageNumber: number): Observable<any> {
        // var accountSysId = localStorage.getItem("accountSysId");
        const accountSysId = (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';

        // console.log('guid is->', accountSysId)
        const search = {
            'SearchText': searchText,
            'SearchType': searchType,
            'PageSize': pageSize,
            'OdatanextLink': OdatanextLink,
            'RequestedPageNumber': RequestedPageNumber,
            'Guid': accountSysId
        };
        // console.log('in reqested search', search);
        return this.apiService.post(routes.Relationshipaccountsearch, search);
    }
    GetSearchContactListByAccount(searchText, searchType, pageSize: number, OdatanextLink: string, RequestedPageNumber: number): Observable<any> {
        // var accountSysId = localStorage.getItem("accountSysId")
        const accountSysId = (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';

        // console.log('Account contact Guid is->', accountSysId)
        const search = {
            'SearchText': searchText,
            'SearchType': searchType,
            'PageSize': pageSize,
            'OdatanextLink': OdatanextLink,
            'RequestedPageNumber': RequestedPageNumber,
            'Guid': accountSysId
        };
        // console.log('in reqested search', search);
        return this.apiService.post(routes.SearchContactListByAccount, search);
    }
    GetSearchIncentivisedUser(searchText, searchType, pageSize: number, OdatanextLink: string, RequestedPageNumber: number): Observable<any> {
        // var accountSysId = localStorage.getItem("accountSysId");
        //  accountSysId='D62FE6AB-5350-E911-A830-000D3AA058CB';
        const accountSysId = (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';

        // console.log('Account contact Guid is->', accountSysId)
        const search = {
            'SearchText': searchText,
            'SearchType': searchType,
            'PageSize': pageSize,
            'OdatanextLink': OdatanextLink,
            'RequestedPageNumber': RequestedPageNumber,
            'Guid': accountSysId
        };
        // console.log('in reqested search', search);
        return this.apiService.post(routes.SearchIncentivisedUser, search)
    }

    GetSearchNonincentivisedUser(searchText, searchType, pageSize: number, OdatanextLink: string, RequestedPageNumber: number): Observable<any> {
        // var accountSysId = localStorage.getItem("accountSysId")
        let accountSysId = (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';

        // console.log('Account contact Guid is->', accountSysId)
        const search = {
            'SearchText': searchText,
            'SearchType': searchType,
            'PageSize': pageSize,
            'OdatanextLink': OdatanextLink,
            'RequestedPageNumber': RequestedPageNumber,
            'Guid': accountSysId
        };
        // console.log('in reqested search', search);
        return this.apiService.post(routes.SearchNonincentivisedUser, search);
    }
    accountTransition(reqBody): Observable<any> {
        return this.apiService.post(routes.AccountTransitionRequest, reqBody);
    }

    // transitionOperationChecklistMaster(reqBody):Observable<any>{
    //     return this.http.post('https://quapi-dev.wipro.com/L2O.Sprint1_2.Api_NoEncrypt/api/Master/GetTransitionOperationCheckList',reqBody);
    // }

    // getKTCheckListMaster(reqBody):Observable<any>{
    //     return this.http.post('https://quapi-dev.wipro.com/L2O.Sprint1_2.Api_NoEncrypt/api/Master/GetKTCheckList',reqBody);
    // }

    // getResponsibilityMaster():Observable<any>{
    // let reqBody={};
    //     return this.http.post('https://quapi-dev.wipro.com/L2O.Sprint1_2.Api_NoEncrypt/api/Master/GetResponsibility',reqBody);
    // }
    commonPostObject(reqBody, url, inputType?): Observable<any> {
        // if (inputType === 'Existing') {
        //     return this.apiService.put(routes[url], reqBody);
        //     //  return this.http.post(camunda_BASE_URL + routes.createAccount, data);
        // } else {
        return this.apiService.post(routes[url], reqBody);


    }
    getReportUrls(reqBody, inputType?): Observable<any> {
        return this.apiService.post(routes.ReportsUrl, reqBody);
    }
    createAccountTransitionCheckList(reqBody): Observable<any> {
        return this.apiService.post(routes.createAccountTransitionRequest, reqBody);
    }

    draftCreate(ReqBody: any): Observable<any> {
        // return this.http.post(camunda_BASE_URL + routes.createAccount, data);
        return this.apiService.post(routes.draftCreate, ReqBody);
    }
    draftDetails(ReqBody: any): Observable<any> {
        // return this.http.post(camunda_BASE_URL + routes.createAccount, data);
        return this.apiService.post(routes.draftDetails, { SysGuid: ReqBody });
    }


    createKTChecklist(reqBody): Observable<any> {
        return this.apiService.post(routes.createKTChecklistRequest, reqBody);
    }

    accountTransitionUpdate(reqBody): Observable<any> {
        return this.apiService.post(routes.updateTransitionRequest, reqBody);
    }

    // reviewNewAccount(reqBody): Observable<any> {
    //     reqBody = "05aa56a2-a975-e911-a830-000d3aa058cb";
    //     return this.http.post(routes.ReviewNewAccount, { 'SysGuid': reqBody })
    // }

    // create assignment reference api binding
    createAssignmentRef(payload): Observable<any> {
        return this.apiService.post(routes.createAssignmentReference, payload);
    }
    // existing assignment reference details api binding
    detailsAssignmentRef(payload): Observable<any> {
        return this.apiService.post(routes.detailsAssignmentReference, { SysGuid: payload });
    }
    // create assignment reference api binding
    editAssignmentRef(payload): Observable<any> {
        return this.apiService.post(routes.editAssignmentReference, payload);
    }

    // Existing account search api binding
    existAccountSearch(payload: any): Observable<any> {
        return this.apiService.post(routes.searchAccountinWiproDatabase, payload);
    }
    SearchAccountAndProspect(payload: any): Observable<any> {
        return this.apiService.post(routes.SearchAccountAndProspect, payload);
    }
    SearchAccountAndDNB(payload: any): Observable<any> {
        return this.apiService.post(routes.SearchAccountInDNB, payload);
    }
    //to submit the reqork statusSearchAccountInDNB
    // submitReworkPostComment(ReqMessage: ReworkCommentReq): Observable<any> {
    //     return this.http.post(routes.ReworkAccountActivation, ReqMessage)
    // }

    // submitReviewNewAccountReworkRequest(ReqMessage: ReworkCommentReq): Observable<any> {
    //     return this.http.post(routes.ReviewNewAccountReworkRequest, ReqMessage)
    // }

    addRelationShipPlan(obj) {
        // return this.http.post(routes.AddRelationShipPlan, obj)
        return this.apiService.post(routes.AddRelationShipPlan, obj);
    }
    editRelationShipPlan(obj) {
        // return this.http.post(routes.EditRelationShipPlan, obj)
        return this.apiService.post(routes.EditRelationShipPlan, obj);
    }
    detailsRelationShipPlan(data) {
        return this.apiService.post(routes.DetailsRelationShipPlan, { Guid: data });
    }

    // Apis Related to Teams (Non-Incentivize Users List)
    getnonincentivizeuserlist(ReqBody: AllAccountReq): Observable<any> {
        return this.apiService.post(routes.List, ReqBody);
    }
    // Apis Related to Teams (Incentivize Users list)
    getincentivizeuserlist(ReqBody: AllAccountReq): Observable<any> {
        return this.apiService.post(routes.GetTeamsIncentivisedUserList, ReqBody);
    }

    AddNonIncentivizeUser(reqBody) {
        return this.apiService.post(routes.AddNonIncentivizeUser, reqBody);
    }
    // Apis Related to Teams (delete non-Incentivize Users)
    Deletenoninctivizeuser(reqbody) {
        return this.apiService.post(routes.Deleteuser, reqbody);
    }
    // Apis Related to Teams (update non-Incentivize Users)
    UpdateNonIncentivizeUser(reqbody) {
        return this.apiService.post(routes.UpdateNonIncentivizeUser, reqbody);
    }
    //Managment log 

    getManagementLogTableRequest(ReqBody: AllAccountReq) {
        // return this.http.post(routes.ManagmentLoglist, ReqBody)
        return this.apiService.post(routes.ManagmentLoglist, ReqBody);
    }
    /*--------------- start Offline integration------------*/
    // async getCachedActiveAlliance() {
    //     const TablePageData = await this.offlineServices.getAllActiveCampaignDetailsData()
    //     console.log("service ginthe quetry data")
    //     console.log(TablePageData)
    //     if (TablePageData.length > 0) {
    //         return TablePageData[0]
    //     } else {
    //         console.log("else condinti")
    //         return null
    //     }
    // }
    /*---------------End Offline integration------------*/


    async getCachedActiveAccount() {
        const TablePageData = await this.offlineServices.getActiveAccountDetailsData();
        // console.log("service ginthe quetry data")
        // console.log(TablePageData)
        if (TablePageData.length > 0) {
            return TablePageData[0];
        } else {
            // console.log("else condinti")
            return null;
        }
    }

    async getCachedAllianceAccount() {
        const TablePageData = await this.offlineServices.getAllianceAccountDetailsData();
        // console.log("service ginthe quetry data")
        // console.log(TablePageData)
        if (TablePageData.length > 0) {
            return TablePageData[0];
        } else {
            // console.log("else condinti")
            return null;
        }
    }

    async getCachedReserveAccount() {
        const TablePageData = await this.offlineServices.getReserveAccountDetailsData();
        // console.log("service ginthe quetry data")
        // console.log(TablePageData)
        if (TablePageData.length > 0) {
            return TablePageData[0];
        } else {
            // console.log("else condinti")
            return null;
        }
    }
    async getCachedCreationHistory() {
        const TablePageData = await this.offlineServices.getCreationHistoryDetailsData();
        // console.log("service ginthe quetry data")
        // console.log(TablePageData)
        if (TablePageData.length > 0) {
            return TablePageData[0];
        } else {
            // console.log("else condinti")
            return null;
        }
    }
    async getCachedActiveRequests() {
        const TablePageData = await this.offlineServices.getActiveRequestsDetailsData();
        // console.log("service ginthe quetry data")
        // console.log(TablePageData)
        if (TablePageData.length > 0) {
            return TablePageData[0];
        } else {
            // console.log("else condinti")
            return null;
        }
    }

    /* API's call** START ** KKN ===============================*/
    AllTabs_Edit(ReqBody: any): Observable<any> {
        // return this.http.post(camunda_BASE_URL + routes.createAccount, data);
        return this.apiService.post(routes.AllTabs_Edit, ReqBody);
    }
    EditFlag(ReqBody: any): Observable<any> {
        // return this.http.post(camunda_BASE_URL + routes.createAccount, data);
        return this.apiService.post(routes.EditFlag, ReqBody);
    }
    CreateSAPCustomer(ReqBody: any): Observable<any> {
        // return this.http.post(camunda_BASE_URL + routes.createAccount, data);
        return this.apiService.post(routes.CreateSAPCustomer, ReqBody);
    }


    /* camunda API definitions ** START ** KKN ===============================*/
    createAccount(ReqBody: any): Observable<any> {
        // return this.http.post(camunda_BASE_URL + routes.createAccount, data);
        return this.apiService.camunda_post(routes.createAccount, ReqBody);

    }
    validateSbu(ReqBody: any): Observable<any> {
        // return this.http.post(camunda_BASE_URL + routes.validateSbu, data);
        return this.apiService.camunda_post(routes.validateSbu, ReqBody);
    }
    reviewCso(ReqBody: any): Observable<any> {
        return this.apiService.camunda_post(routes.reviewCso, ReqBody);
        // return this.http.post(camunda_BASE_URL + routes.reviewCso, data);
    }
    reworkOnProspect(ReqBody: any): Observable<any> {
        return this.apiService.camunda_post(routes.reworkOnProspect, ReqBody);
        // return this.http.post(camunda_BASE_URL + routes.reworkOnProspect, data);
    }
    saveOnProspect(ReqBody: any): Observable<any> {
        return this.apiService.post(routes.saveOnProspect, ReqBody);
        // return this.http.post(camunda_BASE_URL + routes.reworkOnProspect, data);
    }
    saveOnAssignRef(ReqBody: any): Observable<any> {
        return this.apiService.post(routes.saveOnAssignRef, ReqBody);
    }
    modification_reviewCso(ReqBody: any): Observable<any> {
        return this.apiService.camunda_post(routes.modification_reviewCso, ReqBody);
        // return this.http.post(camunda_BASE_URL + routes.modification_reviewCso, data);
    }
    modification_manualAccountModification(ReqBody: any): Observable<any> {
        return this.apiService.camunda_post(routes.modification_manualAccountModification, ReqBody);
        // return this.http.post(camunda_BASE_URL + routes.modification_manualAccountModification, data);
    }
    account_modification(ReqBody: any): Observable<any> {
        return this.apiService.camunda_post(routes.account_modification, ReqBody);
        // return this.http.post(camunda_BASE_URL + routes.account_modification, data);
    }
    modification_validateSbu(ReqBody: any): Observable<any> {
        return this.apiService.camunda_post(routes.modification_validateSbu, ReqBody);
        // return this.http.post(camunda_BASE_URL + routes.account_modification, data);
    }
    reserveAccount_activation_reviewCso(ReqBody: any): Observable<any> {
        return this.apiService.camunda_post(routes.reserveAccount_activation_reviewCso, ReqBody);
        // return this.http.post(camunda_BASE_URL + routes.reserveAccount_activation_reviewCso, data);
    }
    reserveAccount_activation_manualAccountModification(ReqBody: any): Observable<any> {
        return this.apiService.camunda_post(routes.reserveAccount_activation_manualAccountModification, ReqBody);
        // return this.http.post(camunda_BASE_URL + routes.reserveAccount_activation_manualAccountModification, data);
    }
    reserveAccount_activation(ReqBody: any): Observable<any> {
        return this.apiService.camunda_post(routes.reserveAccount_activation, ReqBody);
        // return this.http.post(camunda_BASE_URL + routes.reserveAccount_activation, data);
    }
    AssignmentReference(ReqBody: any): Observable<any> {
        return this.apiService.camunda_post(routes.AssignmentReference, ReqBody);
        // return this.http.post(camunda_BASE_URL + routes.AssignmentReference, data);
    }

    reference_sbuReview(ReqBody: any): Observable<any> {
        return this.apiService.camunda_patch(routes.reference_sbuReview, ReqBody);
    }
    reference_reviewCso(ReqBody: any): Observable<any> {
        return this.apiService.camunda_patch(routes.reference_reviewCso, ReqBody);
    }
    reference_reviewGcp(ReqBody: any): Observable<any> {
        return this.apiService.camunda_post(routes.reference_reviewGcp, ReqBody);
    }
    reference_manualAccountModification(ReqBody: any): Observable<any> {
        return this.apiService.camunda_patch(routes.reference_manualAccountModification, ReqBody);
    }

    /* camunda API definitions ** END ** KKN ===============================*/
    FetchReferenceAccountDetails(id) {
        return this.apiService.post(routes.FetchReferenceAccountDetails, { 'SysGuid': id });
    }
    CheckAssignmentDuplication(reqbody) {
        return this.apiService.post(routes.CheckAssignmentDuplication, reqbody);
    }
    UpdateCamundatoCRM(ReqBody: any): Observable<any> {
        return this.apiService.post(routes.UpdateCamundatoCRM, ReqBody);

        // return this.http.post(l3oBaseUrl + routes.UpdateCamundatoCRM, data);
    }
    CheckSBUSESpocs(id, geoid, countryid) {
        return this.apiService.post(routes.CheckSBUSESpocs, { 'Guid': id, 'Geo': [geoid], 'Country': [countryid] });
    }

    ModificationActiverequest_UpdateCamundatoCRM(ReqBody: any): Observable<any> {
        return this.apiService.post(routes.ModificationActiverequest_UpdateCamundatoCRM, ReqBody);
    }
    AssignUdateCamunddaCRM(ReqBody: any): Observable<any> {
        return this.apiService.post(routes.AssignUdateCamunddaCRM, ReqBody);
        // return this.http.post(l3oBaseUrl + routes.UpdateCamundatoCRM, data);
    }
    ActiverequestsReview(ReqBody: any): Observable<any> {
        return this.apiService.post(routes.ActiverequestsReview, ReqBody);
        // return this.http.post(l3oBaseUrl + routes.ActiverequestsReview, obj);
    }
    ModificationActiveRequestDetails(ReqBody: any): Observable<any> {
        return this.apiService.post(routes.ModificationActiveRequestDetails, ReqBody);
    }
    AssignmentReferenceReview(ReqBody: any): Observable<any> {
        return this.apiService.post(routes.AssignmentReferenceReview, ReqBody);
        // return this.http.post(l3oBaseUrl + routes.AssignmentReferenceReview, obj);
    }

    getAccountOverviewDetails(ReqBody: any): Observable<any> {
        return this.apiService.post(routes.AccountOverviewDetails, ReqBody);
    }
    
    GetAccountDetailChatUserList(ReqBody: any) : Observable<any> {
        return this.apiService.daPost(routes.GetAccountDetailChatUserList, ReqBody);
    }
    
    GetChatUserList(ReqBody: any) : Observable<any> {
        return this.apiService.daPost(routes.GetChatUserList, ReqBody);
    }

    AddAlliance(data) {
        return this.apiService.post(routes.AddAlliance, data);
    }
    DeLinkAlliance(guid: string): Observable<any> {
        return this.apiService.post(routes.DeLinkAlliance, { 'MapGuid': guid });
    }
    DeLinkAdvisory(guid: string): Observable<any> {
        return this.apiService.post(routes.DeLinkAdvisory, { 'MapGuid': guid });
    }
    AddCompetitor(data) {
        return this.apiService.post(routes.AddCompetitor, data);
    }
    AccountAttributeComment(data) {
        return this.apiService.post(routes.AccountAttributeComment, data);
    }
    DeLinkCompetitor(guid: string): Observable<any> {
        return this.apiService.post(routes.DeLinkCompetitor, { 'MapGuid': guid });
    }
    SearchCompetitor(keyword): Observable<any> {
        return this.apiService.post(routes.SearchCompetitor, { 'SearchText': keyword });
    }
    deactivateReference(body): Observable<any> {
        return this.apiService.post(routes.DeactivateReference, body);
    }
    getSsecondAccountOwnerData(body): Observable<any> {
        return this.apiService.post(routes.secondOwnerData, body);
    }
    addsecondAccountOwnerData(body): Observable<any> {
        return this.apiService.post(routes.addSecondOwnerData, body);
    }
    /* API's call** END ** KKN ===============================*/

    /** Helpdesk account merge api start*/
    createMergeRequest(body): Observable<any> {
        return this.apiService.post(routes.CreateMergeRequest, body);
    }
    getMergeList(body): Observable<any> {
        return this.apiService.post(routes.MergeList, body);
    }
    getMergeDetails(body): Observable<any> {
        return this.apiService.post(routes.MergeDetails, body);
    }
    deleteMergeDetails(body): Observable<any> {
        return this.apiService.post(routes.deleteMergeData, body);
    }
    mergeSummary(body): Observable<any> {
        return this.apiService.post(routes.MergeSummary, body);
    }
    sourceMergeDetails(body): Observable<any> {
        return this.apiService.post(routes.sourceAccMergeDetails, body);
    }
    targetMergeDetails(body): Observable<any> {
        return this.apiService.post(routes.targetAccMergeDetails, body);
    }
    saveMergeRequest(body): Observable<any> {
        return this.apiService.post(routes.editMergeRequest, body);
    }
    /** Helpdesk account merge api end*/
    set attachmentList(attach) {
        this.attachList = attach;
    }

    get attachmentList() {
        return this.attachList;
    }
    set attachmentListView(attach) {
        this.attachListView = attach;
    }
    get attachmentListView() {
        return this.attachListView;
    }
    getFilterSwitchListData(data, activeList?, TypeofURL?): Observable<any> {
        if (activeList === 'approvaList') {
            switch (data.useFulldata.headerName) {
                case 'desc':
                    return this.getCommonFilterData(data, 'Description', 'v1/NotificationManagement/SearchApprovalColumnDescription');
                case 'priority':
                    return this.getCommonFilterData(data, 'priority', 'v1/NotificationManagement/SearchApprovalColumnPriority');
                case 'dueDate':
                    return this.getCommonFilterData(data, 'Requestdate', routes.ModificationRequestDate);
                default:
                    return of([]);
            }
        }

        else if (activeList === 'accountMerge') {
            switch (data.useFulldata.headerName) {
                case 'ReferenceNumber':
                    return this.getCommonFilterData(data, 'ReferenceNumber', 'v3/HelpDeskController/Account/Merge/FilterReferenceNumber');
                case 'RequestedBy':
                    return this.getCommonFilterData(data, 'RequestedBy', 'v3/HelpDeskController/Account/Merge/FilterRequestedBy');
                case 'MergeRequestName':
                    return this.getCommonFilterData(data, 'MergeRequestName', 'v3/HelpDeskController/Account/Merge/FilterRequestName');
                case 'Status':
                    return this.getCommonFilterData(data, 'MergeStatus', 'v3/HelpDeskController/Account/Merge/FilterStatus');
                case 'RequestedDate':
                    return this.getCommonFilterData(data, 'Requestdate', routes.ModificationRequestDate);
                default:
                    return of([]);
            }
        }

        else if (activeList === 'managementLog') {
            switch (data.useFulldata.headerName) {
                case 'Meetingtype':
                    return this.getCommonFilterData(data, 'Meetingtype', 'v3/CustomerManagement_Sprint3Controller/ManagementLog/FilterMeetingType');
                case 'Meetingstage':
                    return this.getCommonFilterData(data, 'Meetingstage', 'v3/CustomerManagement_Sprint3Controller/ManagementLog/FilterMeetingStage');
                case 'Createdby':
                    return this.getCommonFilterData(data, 'Createdby', 'v3/CustomerManagement_Sprint3Controller/ManagementLog/FilterCreatedBy');
                case 'Chairpersoncoach':
                    return this.getCommonFilterData(data, 'Createdby', 'v3/CustomerManagement_Sprint3Controller/ManagementLog/FilterReviewChairPerson');
                case 'Starttime':
                    return this.getCommonFilterData(data, 'Starttime', routes.ManagementLogMeetingDate);
                case 'Dateofmeeting':
                    return this.getCommonFilterData(data, 'Dateofmeeting', routes.ManagementLogMeetingDate);
                case 'Duration':
                    return this.getCommonFilterData(data, 'Duration', routes.FilterDuration);
                default:
                    return of([]);
            }
        } else if (activeList === 'AccountContact') {
            switch (data.useFulldata.headerName) {
                case 'Name':
                    return this.getIntensivedFilterData(data, 'Name', 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactName');
                case 'job':
                    return this.getIntensivedFilterData(data, 'job', 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactJobTitle');
                case 'email':
                    return this.getIntensivedFilterData(data, 'email', 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactEmail');
                case 'cbu':
                    return this.getIntensivedFilterData(data, 'cbu', 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactCBU');
                case 'manager':
                    return this.getIntensivedFilterData(data, 'manager', 'v3/CustomerManagement_Sprint3Controller/Account/FilterAccountContactReportingManager');
                // case 'modified':
                //     return this.getIntensivedFilterData(data, 'modified', routes.FilterAccountContactModifiedOn);
                case 'key':
                    return this.getIntensivedFilterData(data, 'key', 'v3/CustomerManagement_Sprint3Controller/AccountContact/FilterKeyContact');

                default:
                    return of([]);
            }
        } else if (activeList === 'nonIncentivized') {
            switch (data.useFulldata.headerName) {

                case 'Username':
                    return this.getCommonFilterData(data, 'NonIncentizedUsername', 'v3/CustomerManagement_Sprint3Controller/NonIncentivizedUser/FilterUserName');
                case 'IMSrole':
                    return this.getCommonFilterData(data, 'NonIncentizedIMSrole', 'v3/CustomerManagement_Sprint3Controller/NonIncentivizedUser/FilterFunction');
                case 'Addedby':
                    return this.getCommonFilterData(data, 'NonIncentizedAddedby', 'v3/CustomerManagement_Sprint3Controller/NonIncentivizedUser/FilterAddedBy');
                default:
                    return of([]);
            }
        } else if (activeList === 'relationShipPlan') {
            switch (data.useFulldata.headerName) {
                case 'Contactworkswithcompetition':
                    return this.getIntensivedFilterData(data, 'Contactworkswithcompetition', 'v3/CustomerManagement_Sprint3Controller/RelationShipPlan/FilterContactWorksWithComeptition');
                case 'Contactusingwiproservices':
                    return this.getIntensivedFilterData(data, 'Contactusingwiproservices', 'v3/CustomerManagement_Sprint3Controller/RelationShipPlan/FilterContactUsesWiproServices');
                case 'Contactname':
                    return this.getIntensivedFilterData(data, 'Contactname', 'v3/CustomerManagement_Sprint3Controller/Account/FilterRelationShipPlanContact');
                case 'Title':
                    return this.getIntensivedFilterData(data, 'Title', 'v3/CustomerManagement_Sprint3Controller/RelationShipPlan/FilterTitle');
                case 'Relationshiptheme':
                    return this.getIntensivedFilterData(data, 'Relationshiptheme', 'v3/CustomerManagement_Sprint3Controller/RelationShipPlan/FilterRelationshipTheme');
                case 'RelationshipOwner':
                    return this.getIntensivedFilterData(data, 'RelationshipOwner', 'v3/CustomerManagement_Sprint3Controller/RelationShipPlan/FilterOwner');
                case 'Keywiprocontact':
                    return this.getIntensivedFilterData(data, 'Keywiprocontact', 'v3/CustomerManagement_Sprint3Controller/RelationShipPlan/FilterKeyWiproContactName');
                default:
                    return of([]);
            }
        } else if (activeList === 'assignCreateHistory') {
            switch (data.useFulldata.headerName) {
                case 'Number':
                    return this.getCommonFilterData(data, 'Number', 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/HistoryAccountNumber');
                case 'Owner':
                    return this.getCommonFilterData(data, 'Owner', 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/Owner');
                case 'Requesttype':
                    return this.getCommonFilterData(data, 'Requesttype', 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/HistoryStatus');
                case 'Requestdate':
                    return this.getCommonFilterData(data, 'HistoryRequestdate', routes.AssignmentReferenceHistoryRequestDate);
                case 'Geo':
                    return this.getCommonFilterData(data, 'Geo', 'v3/CustomerManagement_Sprint3Controller/Filter/Geo');
                case 'Region':
                    return this.getCommonFilterData(data, 'Region', 'v3/CustomerManagement_Sprint3Controller/Filter/Region');
                case 'Vertical':
                    return this.getCommonFilterData(data, 'Vertical', 'v3/CustomerManagement_Sprint3Controller/Filter/Vertical');
                case 'Sbu':
                    return this.getCommonFilterData(data, 'Sbu', routes.SearchTypeModificationRequestSBU);
                case 'Subvertical':
                    return this.getCommonFilterData(data, 'Subvertical', 'v3/CustomerManagement_Sprint3Controller/Filter/SubVertical');
                default:
                    return of([]);
            }
        } else if (activeList === 'assignActiveRequest') {
            switch (data.useFulldata.headerName) {

                case 'Number':
                    return this.getCommonFilterData(data, 'Number', 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/ActiveAccountNumber');
                case 'Owner':
                    return this.getCommonFilterData(data, 'Owner', 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/Owner');
                case 'Requesttype':
                    return this.getCommonFilterData(data, 'Requesttype', 'v3/CustomerManagement_Sprint3Controller/AssignmentReference/ActiveStatus');
                case 'Requestdate':
                    return this.getCommonFilterData(data, 'HistoryRequestdate', routes.AssignmentReferenceActiveRequestDate);

                case 'Geo':
                    return this.getCommonFilterData(data, 'Geo', 'v3/CustomerManagement_Sprint3Controller/Filter/Geo');
                case 'Region':
                    return this.getCommonFilterData(data, 'Region', 'v3/CustomerManagement_Sprint3Controller/Filter/Region');
                case 'Vertical':
                    return this.getCommonFilterData(data, 'Vertical', 'v3/CustomerManagement_Sprint3Controller/Filter/Vertical');
                case 'Sbu':
                    return this.getCommonFilterData(data, 'Sbu', routes.SearchTypeModificationRequestSBU);
                case 'Subvertical':
                    return this.getCommonFilterData(data, 'Subvertical', 'v3/CustomerManagement_Sprint3Controller/Filter/SubVertical');
                default:
                    return of([]);
            }
        } else if (activeList === 'AccountActiveRequest') {
            switch (data.useFulldata.headerName) {

                case 'Swapaccount':
                    return this.getCommonFilterData(data, 'Swapaccount', 'v3/CustomerManagement_Sprint3Controller/Prospect/SwapAccount');
                case 'Name':
                    return this.getCommonFilterData(data, 'Name', 'v3/CustomerManagement_Sprint3Controller/SearchProspectName');
                case 'Status':
                    return this.getCommonFilterData(data, 'Status', 'v3/CustomerManagement_Sprint3Controller/Prospect/Status');
                case 'Requestor':
                    return this.getCommonFilterData(data, 'Requestor', routes.SearchUser);
                case 'Owner':
                    return this.getCommonFilterData(data, 'Owner', 'v3/CustomerManagement_Sprint3Controller/Prospect/Owner');
                case 'Type':
                    return this.getCommonFilterData(data, 'Type', 'v3/CustomerManagement_Sprint3Controller/Prospect/ProspectType');
                case 'Requesttype':
                    return this.getCommonFilterData(data, 'Requesttype', 'v3/CustomerManagement_Sprint3Controller/Prospect/RequestType');
                case 'Requestdate':
                    return this.getCommonFilterData(data, 'Requestdate', routes.RequestDate);

                default:
                    return of([]);
            }
        } else if (activeList === 'AccountcreateHistory') {
            switch (data.useFulldata.headerName) {
                case 'Name':
                    return this.getCommonFilterData(data, 'Name', routes.SearchProspectHistoryName);
                case 'Number':
                    return this.getCommonFilterData(data, 'Number', routes.SearchProspectAccountNumber);
                case 'Status':
                    return this.getCommonFilterData(data, 'Status', 'v3/CustomerManagement_Sprint3Controller/Prospect/HistoryStatus');
                case 'Requestor':
                    return this.getCommonFilterData(data, 'Requestor', 'v3/CustomerManagement_Sprint3Controller/Filter/Requestor');
                case 'Owner':
                    return this.getCommonFilterData(data, 'Owner', 'v3/CustomerManagement_Sprint3Controller/Prospect/Owner');
                case 'Type':
                    return this.getCommonFilterData(data, 'Type', 'v3/CustomerManagement_Sprint3Controller/Prospect/ProspectType');
                case 'Requesttype':
                    return this.getCommonFilterData(data, 'Requesttype', 'v3/CustomerManagement_Sprint3Controller/Prospect/RequestType');

                case 'Decisiondate':
                    return this.getCommonFilterData(data, 'Decisiondate', routes.HistoryRequestDate);
                case 'Requestdate':
                    return this.getCommonFilterData(data, 'Requestdate', routes.HistoryRequestDate);
                case 'Geo':
                    return this.getCommonFilterData(data, 'Geo', 'v3/CustomerManagement_Sprint3Controller/Filter/Geo');
                case 'Vertical':
                    return this.getCommonFilterData(data, 'Vertical', 'v3/CustomerManagement_Sprint3Controller/Filter/Vertical');
                case 'Sbu':
                    return this.getCommonFilterData(data, 'Sbu', 'v3/CustomerManagement_Sprint3Controller/Filter/SBU');
                case 'Subvertical':
                    return this.getCommonFilterData(data, 'Subvertical', 'v3/CustomerManagement_Sprint3Controller/Filter/SubVertical');
                default:
                    return of([]);
            }

        } else if (activeList === 'modificationCreateHistory') {
            switch (data.useFulldata.headerName) {
                case 'Name':
                    return this.getCommonFilterData(data, 'Name', 'v3/CustomerManagement_Sprint3Controller/Modification/HistoryFilterName');
                case 'Number':
                    return this.getCommonFilterData(data, 'Number', 'v3/CustomerManagement_Sprint3Controller/Modification/HistoryFilterNumber');
                case 'Status':
                    return this.getCommonFilterData(data, 'Status', 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/HistoryStatus');
                case 'Requestor':
                    return this.getCommonFilterData(data, 'Requestor', 'v3/CustomerManagement_Sprint3Controller/Filter/Requestor');
                case 'Owner':
                    return this.getCommonFilterData(data, 'Owner', 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/AccountOwner');
                case 'Type':
                    return this.getCommonFilterData(data, 'Type', 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/HistoryAccountType');
                case 'Requesttype':
                    return this.getCommonFilterData(data, 'Requesttype', 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/HistoryRequestType');
                case 'Requestdate':
                    return this.getCommonFilterData(data, 'Requestdate', routes.RequestDatemodification);
                case 'Georeference':
                    return this.getCommonFilterData(data, 'Georeference', 'v3/CustomerManagement_Sprint3Controller/Filter/Geo');
                case 'Geo':
                    return this.getCommonFilterData(data, 'Geo', 'v3/CustomerManagement_Sprint3Controller/Filter/Geo');
                case 'Vertical':
                    return this.getCommonFilterData(data, 'Vertical', 'v3/CustomerManagement_Sprint3Controller/Filter/Vertical');
                case 'Sbu':
                    return this.getCommonFilterData(data, 'Sbu', 'v3/CustomerManagement_Sprint3Controller/Filter/SBU');
                case 'Subvertical':
                    return this.getCommonFilterData(data, 'Subvertical', 'v3/CustomerManagement_Sprint3Controller/Filter/SubVertical');
                default:
                    return of([]);
            }
        } else if (activeList === 'modificationActiveRequest') {
            switch (data.useFulldata.headerName) {
                case 'Name':
                    return this.getCommonFilterData(data, 'ModName', 'v3/CustomerManagement_Sprint3Controller/Modification/ActiveRequestFilterName ');
                case 'Approvalstatus':
                    return this.getCommonFilterData(data, 'ModStatus', 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/ActiveStatus');
                case 'Accountowner':
                    return this.getCommonFilterData(data, 'ModOwner', 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/AccountOwner');
                case 'Accounttype':
                    return this.getCommonFilterData(data, 'ModType', 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/ActiveAccountType');
                case 'Requesttype':
                    return this.getCommonFilterData(data, 'ModRequesttype', 'v3/CustomerManagement_Sprint3Controller/ModificationRequest/ActiveRequestType');
                case 'Requestdate':
                    return this.getCommonFilterData(data, 'Requestdate', routes.ModificationRequestDate);
                case 'Georeference':
                    return this.getCommonFilterData(data, 'Georeference', 'v3/CustomerManagement_Sprint3Controller/Filter/Geo');
                case 'Geo':
                    return this.getCommonFilterData(data, 'Geo', 'v3/CustomerManagement_Sprint3Controller/Filter/Geo');
                case 'Vertical':
                    return this.getCommonFilterData(data, 'Vertical', 'v3/CustomerManagement_Sprint3Controller/Filter/Vertical');
                case 'Sbu':
                    return this.getCommonFilterData(data, 'Sbu', 'v3/CustomerManagement_Sprint3Controller/Filter/SBU');
                case 'Subvertical':
                    return this.getCommonFilterData(data, 'Subvertical', 'v3/CustomerManagement_Sprint3Controller/Filter/SubVertical');
                    case 'accountnumber':
                        return this.getCommonFilterData(data, 'Number', 'v3/CustomerManagement_Sprint3Controller/Modification/ActiveRequestFilterNumber');
                default:
                    return of([]);
            }
        } else if (activeList === 'SearchFilterAPIChange') {
            switch (data.useFulldata.headerName) {
                case 'Name':
                    return this.getCommonFilterData(data, 'Name', this.getparticularNameUrl(TypeofURL));
                case 'RANumber':
                    return this.getCommonFilterData(data, 'RANumber', routes.SearchRANumber);
                case 'Number':
                    return this.getCommonFilterData(data, 'Number', this.getparticularNumberUrl(TypeofURL));
                case 'Parentaccount':
                    return this.getCommonFilterData(data, 'Parentaccount', this.getParentAccount(TypeofURL));
                case 'Owner':
                    return this.getCommonFilterData(data, 'Owner', 'v3/CustomerManagement_Sprint3Controller/Account/FilterOwner');
                case 'Type':
                    return this.getCommonFilterData(data, 'Type', 'v3/CustomerManagement_Sprint3Controller/Account/FilterType');
                case 'Classification':
                    return this.getCommonFilterData(data, 'Classification', this.getClassification(TypeofURL));
                case 'Status':
                    return this.getCommonFilterData(data, 'Status', 'v3/CustomerManagement_Sprint3Controller/Account/FilterStatus');
                case 'Requesttype':
                    return this.getCommonFilterData(data, 'Requesttype', routes.ProspectRequestType);
                case 'City':
                    return this.getCommonFilterData(data, 'City', this.getCity(TypeofURL));
                case 'Country':
                    return this.getCommonFilterData(data, 'Country', this.getCountry(TypeofURL));
                case 'Georeference':
                    return this.getCommonFilterData(data, 'Georeference', 'v3/CustomerManagement_Sprint3Controller/Account/FilterGeo');
                case 'Geo':
                    return this.getCommonFilterData(data, 'Geo', 'v3/CustomerManagement_Sprint3Controller/Account/FilterGeo');
                case 'Regionrefernce':
                    return this.getCommonFilterData(data, 'Regionrefernce', routes.GetAllByRegion);
                case 'Vertical':
                    return this.getCommonFilterData(data, 'Vertical', 'v3/CustomerManagement_Sprint3Controller/Account/FilterVertical');
                case 'Sbu':
                    return this.getCommonFilterData(data, 'Sbu', 'v3/CustomerManagement_Sprint3Controller/Account/FilterSBU');
                case 'Subvertical':
                    return this.getCommonFilterData(data, 'Subvertical', 'v3/CustomerManagement_Sprint3Controller/Account/FilterSubVertical');
                case 'Countryreference':
                    return this.getCommonFilterData(data, 'Countryreference', 'v3/CustomerManagement_Sprint3Controller/Account/FilterCountry');
                default:
                    return of([]);
            }
        } else if (activeList === 'Incentivised') {
            switch (data.useFulldata.headerName) {
                case 'Username':
                    return this.getIntensivedFilterData(data, 'Username', routes.IncentivisedUserName);
                case 'IMSrole':
                    return this.getIntensivedFilterData(data, 'IMSrole', routes.IMSRole);
                case 'SAPcustomercode':
                    return this.getIntensivedFilterData(data, 'SAPcustomercode', routes.BuissenessUnit);
                case 'SAPcustomername':
                    return this.getIntensivedFilterData(data, 'SAPcustomername', routes.GroupCustomerName);
                case 'Geo':
                    return this.getIntensivedFilterData(data, 'IncentivesedGeo', routes.Geo);
                default:
                    return of([]);
            }
        } else if (activeList === 'accountfinder') {

            switch (data.useFulldata.headerName) {
                case 'Name':
                    return this.getCommonFilterData(data, 'Name', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterName');
                case 'RANumber':
                    return this.getCommonFilterData(data, 'RANumber', routes.SearchRANumber);
                case 'Number':
                    return this.getCommonFilterData(data, 'Number', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterNumber');
                case 'Parentaccount':
                    return this.getCommonFilterData(data, 'Parentaccount', routes.SearchAccounts);
                case 'Owner':
                    return this.getCommonFilterData(data, 'Owner', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterOwner');
                case 'Type':
                    return this.getCommonFilterData(data, 'Type', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterType');
                case 'Classification':
                    return this.getCommonFilterData(data, 'Classification', routes.SearchAccountClassification);
                case 'Status':
                    return this.getCommonFilterData(data, 'Status', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterStatus');
                case 'Requesttype':
                    return this.getCommonFilterData(data, 'Requesttype', routes.ProspectRequestType);
                case 'City':
                    return this.getCommonFilterData(data, 'City', routes.GetAllByCity);
                case 'Country':
                    return this.getCommonFilterData(data, 'Country', routes.GetAllByCountry);
                case 'Georeference':
                    return this.getCommonFilterData(data, 'Georeference', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterGeo');
                case 'Geo':
                    return this.getCommonFilterData(data, 'Geo', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterGeo');
                case 'Regionrefernce':
                    return this.getCommonFilterData(data, 'Regionrefernce', routes.GetAllByRegion);
                case 'Vertical':
                    return this.getCommonFilterData(data, 'Vertical', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterVertical');
                case 'Sbu':
                    return this.getCommonFilterData(data, 'Sbu', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterSBU');
                case 'SBU':
                    return this.getCommonFilterData(data, 'Sbu', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterSBU');
                case 'Subvertical':
                    return this.getCommonFilterData(data, 'Subvertical', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterSubVertical');
                case 'Countryreference':
                    return this.getCommonFilterData(data, 'Countryreference', routes.GetAllByCountry);
                case 'AccountCategory':
                    return this.getCommonFilterData(data, 'AccountCategory', 'v3/CustomerManagement_Sprint3Controller/AccountFinder/FilterCategory');

                default:
                    return of([]);
            }
        } else {
            switch (data.useFulldata.headerName) {
                case 'Name':

                    return this.getCommonFilterData(data, 'Name', routes.SearchFilterAccountName);

                case 'RANumber':
                    return this.getCommonFilterData(data, 'RANumber', routes.SearchRANumber);
                case 'Number':

                    return this.getCommonFilterData(data, 'Number', routes.SearchFilterAccountNumber);

                case 'Parentaccount':
                    return this.getCommonFilterData(data, 'Parentaccount', routes.SearchAccounts);
                case 'Owner':
                    return this.getCommonFilterData(data, 'Owner', routes.AccountOwnerSearch);
                case 'Type':
                    return this.getCommonFilterData(data, 'Type', routes.SearchAccountType);
                case 'Classification':
                    return this.getCommonFilterData(data, 'Classification', routes.SearchAccountClassification)
                case 'Status':
                    return this.getCommonFilterData(data, 'Status', routes.SearchAccountStatusCode);
                case 'Requesttype':
                    return this.getCommonFilterData(data, 'Requesttype', routes.ProspectRequestType);
                case 'City':
                    return this.getCommonFilterData(data, 'City', routes.GetAllByCity);
                case 'Country':
                    return this.getCommonFilterData(data, 'Country', routes.GetAllByCountry);
                case 'Georeference':
                    return this.getCommonFilterData(data, 'Georeference', routes.GeographyByName);
                case 'Geo':
                    return this.getCommonFilterData(data, 'Geo', routes.GeographyByName);
                case 'Regionrefernce':
                    return this.getCommonFilterData(data, 'Regionrefernce', routes.GetAllByRegion);
                case 'Vertical':
                    return this.getCommonFilterData(data, 'Vertical', routes.SearchVerticalAndSBU);
                case 'Sbu':
                    return this.getCommonFilterData(data, 'Sbu', routes.SBUByName);
                case 'SBU':
                    return this.getCommonFilterData(data, 'Sbu', routes.SBUByName);
                case 'Subvertical':
                    return this.getCommonFilterData(data, 'Subvertical', routes.SearchAllBySubVertical);
                case 'Countryreference':
                    return this.getCommonFilterData(data, 'Countryreference', routes.GetAllByCountry);

                default:
                    return of([]);
            }
        }
    }

    getParentAccount(url) {
        if (url === 'myactiveAccount') {
            return routes['MyActiveFilterParentAccount'];
        }
        else {
            return 'v3/CustomerManagement_Sprint3Controller/ActiveFilter/ParentAccount';
        }
    }
    getCountry(url) {
        if (url === 'myactiveAccount') {
            return routes['MyAccountFilterCountry'];
        }
        else {
            return 'v3/CustomerManagement_Sprint3Controller/Account/FilterCountry';
        }
    }
    getCity(url) {
        if (url === 'myactiveAccount') {
            return routes['MyAccountFilterCity'];
        }
        else {
            return 'v3/CustomerManagement_Sprint3Controller/Account/FilterCity';
        }
    }
    getClassification(url) {
        if (url === 'myactiveAccount') {
            return routes['MyAccountFilterClassification'];
        }
        else {
            return 'v3/CustomerManagement_Sprint3Controller/Account/FilterClassification';
        }
    }

    // MyAccountFilterCity :'v3/CustomerManagement_Sprint3Controller/MyAccount/FilterCity',
    // MyAccountFilterCountry :'v3/CustomerManagement_Sprint3Controller/MyAccount/FilterCountry',
    // MyAccountFilterClassification :'v3/CustomerManagement_Sprint3Controller/MyAccount/FilterClassification'
    getparticularNameUrl(url) {
        if (url === 'alliance') {
            return routes['SearchFilterAllianceAccountName'];
        } else if (url === 'activeAccount') {
            return routes['SearchFilterActiveAccountName'];
        } else if (url === 'reserve') {
            return routes['SearchFilterReserveAccountName'];

        } else if (url === 'advisor') {
            return routes['SearchFilterAdvisoryAccountName'];

        }
        else if (url === 'myactiveAccount') {
            return routes['SearchFilterMyActiveAccountName'];

        }
    }
    getparticularNumberUrl(url) {
        if (url === 'alliance') {
            return routes['SearchFilterAllianceAccountNumber'];
        } else if (url === 'activeAccount') {
            return routes['SearchFilterActiveAccountNumber'];
        } else if (url === 'reserve') {
            return routes['SearchFilterReserveAccountNumber'];

        } else if (url === 'advisor') {
            return routes['SearchFilterAdvisoryAccountNumber'];

        }
        else if (url === 'myactiveAccount') {
            return routes['SearchFilterMyActiveAccountNumber'];

        }

    }

    getCommonFilterData(data, category, url): Observable<any> {
        return this.getCommonApiCallFilter(data, url).pipe(switchMap(res => {
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterCommonColumndata(res.ResponseObject, category) } : [])
        }));
    }
    getCommonApiCallFilter(data, url, body?): Observable<any> {
        const reqbody = {
            ...data.columnFIlterJson,
            'UserGuid': data.useFulldata.guid ? data.useFulldata.guid : '',
            'Guid': data.useFulldata.guid ? data.useFulldata.guid : '',
            'ColumnSearchText': data.useFulldata.searchVal ? data.useFulldata.searchVal : '',
            'PageSize': data.useFulldata.pageSize ? data.useFulldata.pageSize : 10,
            'OdatanextLink': data.useFulldata.nextLink ? data.useFulldata.nextLink : '',
            'RequestedPageNumber': data.useFulldata.pageNo ? data.useFulldata.pageNo : 1,
            'SearchType': data.useFulldata.Searchtype ? data.useFulldata.Searchtype : '',
        };
        return this.apiService.post(url, (body) ? body : reqbody);
    }

    getIntensivedFilterData(data, category, url): Observable<any> {
        return this.getIntensivedApiCallFilter(data, url).pipe(switchMap(res => {
            return of((!res.IsError) ? { ...res, ResponseObject: this.filterCommonColumndata(res.ResponseObject, category) } : [])
        }));
    }
    getIntensivedApiCallFilter(data, url, body?): Observable<any> {
        const reqbody = {
            ...data.columnFIlterJson,
            'Guid': data.useFulldata.guid ? data.useFulldata.guid : '',
            'AccountGuid': data.useFulldata.guid ? data.useFulldata.guid : '',
            'ColumnSearchText': data.useFulldata.searchVal ? data.useFulldata.searchVal : '',
            'PageSize': data.useFulldata.pageSize ? data.useFulldata.pageSize : 10,
            'OdatanextLink': data.useFulldata.nextLink ? data.useFulldata.nextLink : '',
            'RequestedPageNumber': data.useFulldata.pageNo ? data.useFulldata.pageNo : 1,
            'SearchType': data.useFulldata.Searchtype ? data.useFulldata.Searchtype : ''

        };
        return this.apiService.post(url, (body) ? body : reqbody);
    }

    getAdvisoryAnalyst(reqBody) {
        return this.apiService.post(routes.getAdvisoryAnalyst, reqBody);
    }
    AddAdvisoryAnalyst(reqBody) {
        return this.apiService.post(routes.addAdvisoryAnalyst, reqBody);
    }
    filterCommonColumndata(data, category) {

        if (data) {
            // debugger
            if (data.length > 0) {

                switch (category) {

                    case 'AccountCategory':
                        return data.map(x => {
                            return {
                                id: x.Id || '',
                                name: x.Value || '',
                                isDatafiltered: false
                            };
                        });
                    case 'ReportName':
                        return data.map(x => {
                            return {
                                id: x.Title || '',
                                name: x.Title || '',
                                isDatafiltered: false
                            };
                        });
                    case 'Duration':
                        return data.map(x => {
                            return {
                                id: x.Id || '',
                                name: x.Name || '',
                                isDatafiltered: false
                            };
                        });
                    case 'Description':
                        return data.map(x => {
                            return {
                                id: (x.Description) ? x.Description : '',
                                name: (x.Description) ? x.Description : '',
                                isDatafiltered: false
                            };
                        });
                    case 'priority':
                        return data.map(x => {
                            return {

                                id: x.PriorityCode || '',
                                name: x.Priority || '',
                                isDatafiltered: false
                            };
                        });
                    case 'ReferenceNumber':
                        return data.map(x => {
                            return {
                                id: x.ReferenceNumber,
                                name: x.ReferenceNumber,
                                isDatafiltered: false
                            };
                        });
                    case 'RequestedBy':
                        return data.map(x => {
                            return {
                                id: x.RequestedBy.SysGuid,
                                name: x.RequestedBy.FullName,
                                isDatafiltered: false
                            };
                        });
                    case 'MergeRequestName':
                        return data.map(x => {
                            return {
                                id: x.Name,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Status':
                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Value,
                                isDatafiltered: false
                            };
                        });
                    case 'MergeStatus':
                        return data.map(x => {
                            return {
                                id: x.Status.Id,
                                name: x.Status.Value,
                                isDatafiltered: false
                            };
                        });
                    case 'Name':
                        return data.map(x => {
                            return {
                                id: this.getSymbol(x.Name),
                                name: this.getSymbol(x.Name) || this.getSymbol(x.FullName) || '',
                                encodedname: x.Name ? x.Name : 'NA',
                                isDatafiltered: false
                            };
                        });
                    case 'ModName':
                        return data.map(x => {
                            return {
                                id: this.getSymbol(x.Name),
                                name: this.getSymbol(x.Name),
                                encodedname: x.Name ? x.Name : 'NA',
                                isDatafiltered: false
                            };
                        });
                    case 'ModStatus':
                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'ModOwner':
                        return data.map(x => {
                            return {
                                id: x.SysGuid,
                                name: x.FullName,
                                isDatafiltered: false
                            };
                        });
                    case 'ModType':
                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Accounttype':
                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'ModRequesttype':
                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });

                    case 'RANumber':
                        return data.map(x => {
                            return {

                                id: x.Guid || x.RANumber,
                                name: x.RANumber,
                                isDatafiltered: false
                            };
                        });
                    case 'Number':
                        return data.map(x => {
                            return {

                                id: x.Guid || x.Number,
                                name: x.Number,
                                isDatafiltered: false
                            };
                        });
                    case 'Parentaccount':
                        return data.map(x => {
                            return {
                                id: x.SysGuid,
                                name: x.Name ? this.getSymbol(x.Name) : 'NA',
                                encodedname: x.Name ? x.Name : 'NA',
                                isDatafiltered: false
                            };
                        });
                    case 'Owner':
                        return data.map(x => {
                            return {
                                id: x.SysGuid,
                                name: x.FullName,
                                isDatafiltered: false
                            };
                        });
                    case 'Status':
                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Value,
                                isDatafiltered: false
                            };
                        });
                    case 'Classification':
                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Value,
                                isDatafiltered: false
                            };
                        });
                    case 'Contactname':
                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || x.Guid || '',
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Relationshiptheme':
                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || x.Guid || '',
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Title':
                        return data.map(x => {
                            return {
                                id: x.Name || '',
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Type':

                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || '',
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Requesttype':

                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || '',
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Swapaccount':

                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || '',
                                name: this.getSymbol(x.Name),
                                encodedname: x.Name ? x.Name : 'NA',
                                isDatafiltered: false
                            };
                        });

                    case 'NonIncentizedAddedby':

                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || '',
                                name: x.Name || x.FullName || '',
                                isDatafiltered: false
                            };
                        });
                    case 'Keywiprocontact':

                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || '',
                                name: x.Name || x.FullName || '',
                                isDatafiltered: false
                            };
                        });
                    case 'RelationshipOwner':

                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || '',
                                name: x.Name || x.FullName || '',
                                isDatafiltered: false
                            };
                        });


                    case 'NonIncentizedIMSrole':

                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || '',
                                name: x.Name || x.FullName || '',
                                isDatafiltered: false
                            };
                        });
                    case 'NonIncentizedUsername':

                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || '',
                                name: x.Name || x.FullName || '',
                                isDatafiltered: false
                            };
                        });
                    case 'Username':

                        return data.map(x => {
                            return {
                                id: x.UserName,
                                name: x.UserName,
                                isDatafiltered: false
                            };
                        });

                    case 'SAPcustomername':

                        return data.map(x => {
                            return {
                                id: x.GroupCustomerName,
                                name: x.GroupCustomerName,
                                isDatafiltered: false
                            };
                        });
                    case 'IMSrole':

                        return data.map(x => {
                            return {
                                id: x.IMSrole,
                                name: x.IMSrole,
                                isDatafiltered: false
                            };
                        });
                    case 'SAPcustomercode':

                        return data.map(x => {
                            return {
                                id: x.BusinessUnit,
                                name: x.BusinessUnit,
                                isDatafiltered: false
                            };
                        });
                    case 'IncentivesedGeo':

                        return data.map(x => {
                            return {
                                id: x.GEO,
                                name: x.GEO,
                                isDatafiltered: false
                            };
                        });


                    case 'Addedby':

                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Requestor':

                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || '',
                                name: x.FullName,
                                isDatafiltered: false
                            };
                        });
                    case 'Meetingtype':

                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Meetingstage':

                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Createdby':

                        return data.map(x => {
                            return {
                                id: x.Id || x.SysGuid || '',
                                name: x.Name || x.FullName || '',
                                isDatafiltered: false
                            };
                        });
                    case 'Requestdate':

                        return data.map(x => {
                            return {
                                id: x.RequestDate ? x.RequestDate : '',
                                name: (x.RequestDate) ? x.RequestDate : '',
                                date: (x.RequestDate) ? this.datepipe.transform(x.RequestDate, 'yyyy-MM-dd') : '',
                                isDatafiltered: false
                            };
                        });
                    case 'Decisiondate':

                        return data.map(x => {
                            return {
                                id: x.Decisiondate ? x.Decisiondate : '',
                                name: (x.Decisiondate) ? x.Decisiondate : '',
                                date: (x.Decisiondate) ? this.datepipe.transform(x.Decisiondate, 'yyyy-MM-dd') : '',
                                isDatafiltered: false
                            };
                        });
                    case 'HistoryRequestdate':

                        return data.map(x => {
                            return {
                                id: x.CreatedOn ? x.CreatedOn : '',
                                name: (x.CreatedOn) ? x.CreatedOn : '',
                                date: (x.CreatedOn) ? this.datepipe.transform(x.CreatedOn, 'yyyy-MM-dd') : '',
                                isDatafiltered: false
                            };
                        });

                    case 'City':

                        return data.map(x => {
                            return {
                                id: x.City.SysGuid,
                                name: x.City.Name,
                                isDatafiltered: false
                            };
                        });

                    case 'Countryreference':

                        return data.map(x => {
                            return {
                                id: x.Country.SysGuid,
                                name: x.Country.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Country':

                        return data.map(x => {
                            return {
                                id: x.Country.SysGuid,
                                name: x.Country.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Georeference':

                        return data.map(x => {
                            return {
                                id: x.SysGuid,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Geo':

                        return data.map(x => {
                            return {
                                id: x.SysGuid,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Regionrefernce':

                        return data.map(x => {
                            return {
                                id: x.Region.SysGuid,
                                name: x.Region.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Region':

                        return data.map(x => {
                            return {
                                id: x.Region.SysGuid,
                                name: x.Region.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Vertical':


                        return data.map(x => {
                            return {
                                id: x.Vertical.Id,
                                name: x.Vertical.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Subvertical':

                        return data.map(x => {
                            return {
                                id: x.SubVertical.Id,
                                name: x.SubVertical.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'Sbu':

                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'SBU':

                        return data.map(x => {
                            return {
                                id: x.Id,
                                name: x.Name,
                                isDatafiltered: false
                            };
                        });
                    case 'job':

                        return data.map(x => {
                            return {
                                id: x.Designation,
                                name: x.Designation,
                                isDatafiltered: false
                            };
                        });
                    case 'email':

                        return data.map(x => {
                            return {
                                id: x.Email,
                                name: x.Email,
                                isDatafiltered: false
                            };
                        });
                    case 'manager':

                        return data.map(x => {
                            return {
                                id: x.FullName,
                                name: x.FullName,
                                isDatafiltered: false
                            };
                        });
                    case 'cbu':

                        return data.map(x => {
                            return {
                                id: x.Guid ? x.Guid : '',
                                name: x.FullName,
                                isDatafiltered: false
                            };
                        });
                    case 'key':

                        return data.map(x => {
                            return {
                                id: x.KeyContactString,
                                name: x.KeyContactString,
                                value: x.isKeyContact,
                                isDatafiltered: false
                            };
                        });
                    case 'Contactusingwiproservices':

                        return data.map(x => {
                            return {
                                id: x.ContactUsingWiproServicesString,
                                name: x.ContactUsingWiproServicesString,
                                value: x.ContactUsingWiproServices,
                                isDatafiltered: false
                            };
                        });
                    case 'Contactworkswithcompetition':

                        return data.map(x => {
                            return {
                                id: x.ContactWorkswithCompetitionString,
                                name: x.ContactWorkswithCompetitionString,
                                value: x.ContactWorkswithCompetition,
                                isDatafiltered: false
                            };
                        });

                    // case 'modified':

                    //     return data.map(x => {
                    //         return {
                    //             id: x.ModifiedOn ? x.ModifiedOn : '',
                    //             name: (x.ModifiedOn) ? x.ModifiedOn : '',
                    //             ModifiedOn: (x.ModifiedOn) ? this.datepipe.transform(x.ModifiedOn, 'yyyy-MM-dd') : '',

                    //             isDatafiltered: false
                    //         };
                    //     });
                    case 'Dateofmeeting':

                        return data.map(x => {
                            return {
                                id: x.MeetingDate ? x.MeetingDate : '',
                                name: (x.MeetingDate) ? x.MeetingDate : '',
                                Dateofmeeting: (x.MeetingDate) ? this.datepipe.transform(x.MeetingDate, 'yyyy-MM-dd') : '',

                                isDatafiltered: false
                            };
                        });



                    case 'Starttime':

                        return data.map(x => {
                            return {
                                id: x.StartTime ? x.StartTime : '',
                                Starttime: (x.StartTime) ? this.datepipe.transform(x.StartTime, 'yyyy-MM-dd') : '',
                                name: (x.StartTime) ? x.StartTime : '',

                                isDatafiltered: false
                            };
                        });


                    default:
                        return of([]);
                }

            } else {
                return [];
            }
        } else {
            return [];
        }
    }
    getFilterList(body, downloadTrue, TypeOfFilter?) {
        let url;
        if (downloadTrue) {
            url = this.getTypeOfDownloadFilter(TypeOfFilter);
        } else {
            url = this.getTypeOfFilter(TypeOfFilter);
        }

        return this.apiService.post(url, body)
    }
    getTypeOfDownloadFilter(type) {
        return routes[type];
    }
    getTypeOfFilter(type) {
        return routes[type];
    }
    getsearchLookUpList(searchText, requestBody?, url?): Observable<any> {
        let urldata;
        if (url) {
            urldata = url;
        } else {
            urldata = routes.SearchAccounts;
        }
        const body = {
            'SearchText': searchText ? searchText : '',
            'PageSize': 10,
            'OdatanextLink': '',
            'RequestedPageNumber': 1
        };
        return this.apiService.post(urldata, (requestBody) ? requestBody : body);
    }
    getLookUpFilterData(data): Observable<any> {
        console.log(data);
        // debugger;
        // debugger
        const AssignmentRefFlag = data.assignmentRef ? data.assignmentRef : false;
        switch (data.controlName) {
            case 'accountNameSearch':
                return this.getLookupCommondata(data, routes.SearchAccounts, '');
            case 'Privateequaitity':
                return this.getLookupCommondata(data, routes.SearchPrivateEquity, '');
            case 'parentaccount':
            case 'UltimateParentAccount':
            case 'ParentAccount':
                return this.getLookupCommondata(data, routes.SearchAccounts, '');
            case 'ultimateparent':
                return this.getLookupCommondata(data, routes.SearchAccounts, '');
            case 'alternativeOwner':
            case 'altowner':
                if (data.useFullData && data.useFullData.SbuId) {
                    return this.getLookupCommondata(data, 'v3/CustomerManagement_Sprint3Controller/Alternate/AccountOwnerSearch', data.useFullData.SbuId);
                } else {
                    return this.getLookupCommondata(data, 'v3/CustomerManagement_Sprint3Controller/Alternate/AccountOwnerSearch', '');
                }
            // return this.getLookupCommondata(data, routes.AccountOwnerSearch,'');
            case 'owner':
                return this.getLookupCommondata(data, routes.AccountOwnerSearch, '');
            case 'secondaryowner':
                return this.getLookupCommondata(data, routes.secondOwnerData, '');
            case 'Assignmentowner':
                return this.getLookupCommondata(data, routes.participant, '');
            case 'SBU':
            case 'sbu':
                return this.getLookupCommondata(data, routes.SBUByName, '');
            case 'cluster':
                return this.getLookupCommondata(data, routes.Cluster, data.clusterId);
            case 'Vertical':
            case 'vertical':
            case 'CurrentVerticalOwner':
                if (data.useFullData && data.useFullData.SbuId)
                    return this.getLookupCommondata(data, routes.GetVerticalbySBUID, data.useFullData.SbuId);
                else
                    return this.getLookupCommondata(data, routes.SearchVerticalAndSBU, '');
            case 'Assignmentvertical':
                if (data.useFullData && data.useFullData.SbuId)
                    return this.getLookupCommondata(data, routes.GetVerticalbySBUID, data.useFullData.SbuId);
                else
                    return this.getLookupCommondata(data, routes.SearchVerticalAndSBU, '');
            case 'Assignmentsubvertical':
            case 'SubVertical':
            case 'subvertical':
                if (data.useFullData && data.useFullData.verticalId)
                    return this.getLookupCommondata(data, routes.SubVerticalByVertical, data.useFullData.verticalId);
                else
                    return this.getLookupCommondata(data, routes.SearchAllBySubVertical, '');
            case 'currencyaccount':
            case 'Currency':
            case 'currency':
                return this.getLookupCommondata(data, routes.Currency, '');
            case 'Assignmentgeography':
            case 'Geo':
            case 'geography':
                return this.getLookupCommondata(data, routes.GeographyByName, '');
            case 'Assignmentregion':
            case 'Region':
            case 'region':
                if (data.useFullData && data.useFullData.geoId) {
                    return this.getLookupCommondata(data, routes.RegionByGeo, data.useFullData.geoId);
                } else {
                    return this.getLookupCommondata(data, routes.GetAllByRegion, '');
                }
            case 'Assignmentcountry':
            case 'CountryReference':
            case 'country':
                if (data.useFullData && data.useFullData.regionId) {
                    return this.getLookupCommondata(data, routes.CountryByRegion, data.useFullData.regionId);
                } else {
                    return this.getLookupCommondata(data, routes.GetAllByCountry, '');
                }
            case 'CountrySubDivisionReference':
            case 'state':
                if (data.useFullData && data.useFullData.countryId) {
                    return this.getLookupCommondata(data, routes.StateByCountry, data.useFullData.countryId);
                } else {
                    return this.getLookupCommondata(data, routes.GetAllByState, '');
                }
            case 'CityRegionReference':
            case 'city':
                if (data.useFullData && data.useFullData.stateId) {
                    return this.getLookupCommondata(data, routes.CityByState, data.useFullData.stateId);
                } else {
                    return this.getLookupCommondata(data, routes.GetAllByCity, '');
                }
            case 'ChairPersonSearch':
                return this.getLookupCommondata(data, routes.participant, '');
            case 'NonTraceUsers':
                return this.getLookupCommondata(data, routes.participantNontrace, '');
            case 'AdvisoryAnalystSearch':
                return this.getLookupCommondata(data, routes.getAdvisoryAnalyst, '');
            case 'AllianceContactSearch':
                return this.getLookupCommondata(data, routes.SearchAllianceAccounts, '');
            case 'Competitor':
                return this.getLookupCommondata(data, routes.SearchCompetitor, '');
            // return this.getCompetitor(data);
            case 'BUContactSearch':
                const accountSysId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
                const Guid = accountSysId ? accountSysId : '';
                return this.getLookupCommondata(data, routes.SearchCustomerContact, Guid);
            case 'StandByAccountOwnerSearch':
                const accountSysIdData = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
                const GuidData = accountSysId ? accountSysId : '';
                return this.getLookupCommondata(data, routes.StandByAccountOwnerSearch, GuidData);
            case 'alternativeOwner':
            case 'AccountOwnerSearch':
            case 'Owner':
                return this.getLookupCommondata(data, routes.AccountOwnerSearch, '');
            case 'accountOwnerPageNameSearch':
                return this.getLookupCommondata(data, routes.searchAccountinWiproDatabase, '');

            default:
                return of([]);
        }

    }
    getLookupCommondata(data, url, id): Observable<any> {
        // debugger
        if (data.isService) {


            const requestparam = {
                'SearchText': data.useFullData.searchVal.length > 0 ? data.useFullData.searchVal : '',
                'Guid': id ? id : '',
                'PageSize': data.useFullData.recordCount,
                'OdatanextLink': data.useFullData.OdatanextLink,
                'RequestedPageNumber': data.useFullData.pageNo,
                'Id': id ? id : ''

            };


            return this.getsearchLookUpList(data.useFullData.searchVal, requestparam, url).pipe(switchMap((res: any) => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnAcc(res.ResponseObject, data.controlName, true) : [] } : [])
                } else {
                    return [];
                }
            }));

        } else {
            return of(this.filterAdvnAcc(data.data, data.controlName, false));
        }

    }

    // filternonTraceUsersData(data): Observable<any> {
    //     // debugger;
    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {
    //                     ...x,
    //                     'Id': x.Id ? x.Id : x.AdId,
    //                     'FullName': (x.FullName) ? x.FullName : 'NA',
    //                     'Email': (x.Email) ? x.Email : 'NA',

    //                 };
    //             });
    //         } else {
    //             return of([]);
    //         }
    //     } else {
    //         return of([]);
    //     }
    // }
    // filterChairPersonSearch(data): Observable<any> {
    //     if (data) {
    //         if (data.length > 0) {
    //             return data.map(x => {
    //                 return {
    //                     ...x,
    //                     'Id': x.SysGuid,
    //                     'FullName': (x.FullName) ? x.FullName : 'NA',
    //                     'Email': (x.Email) ? x.Email : 'NA',

    //                 }
    //             })
    //         } else {
    //             return of([])
    //         }
    //     } else {
    //         return of([])
    //     }
    // }
    filterAdvnAcc(data, controlName, fromAPI: boolean) {
        // debugger
        if (data) {
            if (data.length > 0) {
                switch (controlName) {
                    case 'StandByAccountOwnerSearch':
                        {
                            return data.map(x => {
                                return {
                                    ...x,
                                    'Id': x.SysGuid,
                                    'FullName': (x.FullName) ? x.FullName : 'NA',
                                    'Email': (x.Email) ? x.Email : 'NA',

                                }
                            })
                        }
                    case 'BUContactSearch':
                        {
                            return data.map(x => {
                                return {
                                    ...x,
                                    'Name': (x.FullName) ? x.FullName : 'NA',
                                    // 'accountName': (x.CustomerAccount) ? (x.CustomerAccount.FullName) ? x.CustomerAccount.FullName : 'NA' : 'NA',
                                    'accountName': (x.CustomerAccount) ? x.CustomerAccount.Name : 'NA',
                                    'Id': (x.Guid) ? x.Guid : '',
                                    'Designation': x.Designation,
                                    'Email': x.Email

                                };
                            });
                        }
                    case 'Competitor':
                        {
                            return data.map(x => {
                                console.log(x);

                                return {
                                    ...x,
                                    'Name': (x.Name) ? x.Name : 'NA',
                                    'Id': (x.SysGuid) ? x.SysGuid : 'NA',
                                    // 'accountName': (x.CustomerAccount) ? (x.CustomerAccount.FullName) ? x.CustomerAccount.FullName : 'NA' : 'NA',
                                    'Number': (x.Number) ? x.Number : 'NA',
                                    'Owner': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : 'NA' : 'NA',
                                    'accountType': (x.Type) ? (x.Type.Value) ? x.Type.Value : 'NA' : 'NA',
                                };
                            });
                        }
                    case 'AllianceContactSearch':
                        {
                            return data.map(x => {
                                return {
                                    ...x,
                                    'Name': (x.Name) ?  this.getSymbol(x.Name) : 'NA',
                                    'Number': (x.Number) ? x.Number : 'NA',
                                    // 'accountName': (x.CustomerAccount) ? (x.CustomerAccount.FullName) ? x.CustomerAccount.FullName : 'NA' : 'NA',
                                    // 'Email': (x.Email) ? x.Email : 'NA',
                                    // 'Designation': (x.Designation) ? (x.Designation) : 'NA',
                                    'Id': x.SysGuid ? x.SysGuid : '',
                                    'Owner': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : 'NA' : 'NA',
                                    'accountType': (x.Type) ? (x.Type.Value) ? x.Type.Value : 'NA' : 'NA',

                                };
                            });
                        }
                    case 'AdvisoryAnalystSearch':
                        {
                            return data.map(x => {
                                return {
                                    ...x,
                                    'Id': x.SysGuid,
                                    'Name': (x.Name) ?this.getSymbol(x.Name) : 'NA',
                                    'Owner': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : 'NA' : 'NA',
                                    'Number': (x.Number) ? x.Number : 'NA',
                                    'Vertical': (x.Vertical) ? (x.Vertical.Name) ? x.Vertical.Name : 'NA' : 'NA',
                                    'Region': (x.Address) ? (x.Address.Region.Name) ? x.Address.Region.Name : 'NA' : 'NA',
                                    'accountType': (x.Type) ? (x.Type.Value) ? x.Type.Value : 'NA' : 'NA',

                                }
                            })
                        }
                    case 'NonTraceUsers':
                        {
                            return data.map(x => {

                                return {
                                    ...x,
                                    'Id': x.Id ? x.Id : x.AdId,
                                    'FullName': (x.FullName) ? x.FullName : 'NA',
                                    'Email': (x.Email) ? x.Email : 'NA',

                                };

                            });
                        }
                    case 'ChairPersonSearch':
                        {
                            return data.map(x => {

                                return {
                                    ...x,
                                    'Id': x.SysGuid,
                                    'FullName': (x.FullName) ? x.FullName : 'NA',
                                    'Email': (x.Email) ? x.Email : 'NA',

                                };

                            });
                        }
                    case 'CountrySubDivisionReference':
                    case 'state':
                        {
                            if (data[0].State) {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.State.Name || x.State.FullName || '',
                                        'Id': x.State.Id || x.State.SysGuid || '',
                                        'RegionData': x.Region.Name || '',
                                        'CountryData': x.Country.Name || '',
                                        'SysGuid': x.State.Id || x.State.SysGuid || '',


                                    };

                                });
                            } else {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Name || x.FullName || '',
                                        'Id': x.Id || x.SysGuid || '',
                                        'SysGuid': x.Id || x.SysGuid || '',
                                        'CountryData': x.CountryName || '',
                                        'RegionData': x.Region.Name || '',
                                    };

                                });
                            }
                            // {
                        }
                    // }
                    case 'CityRegionReference':
                    case 'city':
                        {
                            if (data[0].City) {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.City.Name || x.FullName || '',
                                        'Id': x.City.Id || x.City.SysGuid || '',
                                        'StateData': x.State.Name || x.State.Name || '',
                                        'SysGuid': x.City.Id || x.City.SysGuid || '',
                                    };

                                });
                            } else {
                                return data.map(x => {

                                    return {
                                        // ...x,
                                        'Name': x.Name || '',
                                        'Id': x.Id || x.SysGuid || '',
                                        'StateData': x.StateName || x.StateName || '',
                                        'SysGuid': x.Id || x.SysGuid || '',

                                    };

                                });
                            }
                        }
                    case 'Assignmentowner':
                        {
                            return data.map(x => {

                                return {
                                    ...x,
                                    'Name': x.Name || x.FullName || x.contact || '',
                                    'Id': x.Id || x.SysGuid || '',
                                    'SysGuid': x.Id || x.SysGuid || '',


                                };

                            });
                        }
                    case 'alternativeOwner':
                    case 'AccountOwnerSearch':
                    case 'Owner':
                        {
                            return data.map(x => {
                                return {
                                    ...x,
                                    'Id': x.SysGuid,
                                    'FullName': (x.FullName) ? x.FullName : 'NA',
                                    'Email': (x.Email) ? x.Email : 'NA',

                                }
                            })
                        }
                    case 'altowner':
                    case 'owner':
                    case 'secondaryowner':
                        {
                            return data.map(x => {

                                return {
                                    ...x,
                                    'Name': x.Name || x.FullName || x.contact || '',
                                    'Id': x.Id || x.SysGuid || '',
                                    'SysGuid': x.Id || x.SysGuid || '',
                                    // 'Email': (x.Email) ? x.Email : 'NA',

                                };

                            });
                        }
                    case 'cluster':
                        {
                            return data.map(x => {

                                return {
                                    ...x,
                                    'Name': x.Name || x.FullName || x.contact || '',
                                    'Id': x.Id || x.SysGuid || '',
                                    'SysGuid': x.Id || x.SysGuid || '',

                                };

                            });
                        }
                    case 'currencyaccount':
                    case 'currency':
                    case 'Currency':
                        {
                            return data.map(x => {

                                return {
                                    ...x,
                                    'CurrencyRateValue': (x.CurrencyRateValue) ? x.CurrencyRateValue : '',
                                    'Desc': (x.Desc) ? this.getSymbol(x.Desc) : '',
                                    'ISOCurrencyCode': (x.ISOCurrencyCode) ? x.ISOCurrencyCode : '',
                                    'Id': x.SysGuid || x.Id || '',
                                    'SysGuid': x.Id || x.SysGuid || ''

                                }

                            });
                        }
                    case 'sbu':
                    case 'SBU':
                        {
                            return data.map(x => {

                                return {
                                    ...x,
                                    'Name': x.Name || x.FullName || '',
                                    'Id': x.SysGuid || x.Id || '',
                                    'SysGuid': x.Id || x.SysGuid || ''

                                };

                            });
                        }
                    case 'CurrentVerticalOwner':
                        {

                            if (data[0].Vertical) {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Vertical.Name || x.Vertical.FullName || '',
                                        // 'CurrentVerticalOwner': (x.SBU && x.SBU.Name) ? x.SBU.Name : '',
                                        'Id': x.Vertical.SysGuid || x.Vertical.Id || '',
                                        'SysGuid': x.Vertical.Id || x.Vertical.SysGuid || ''

                                    };

                                });
                            } else {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Name || x.FullName || '',
                                        // 'CurrentVerticalOwner': (x.SBU && x.SBU.Name) ? x.SBU.Name : '',
                                        'Id': x.SysGuid || x.Id || '',
                                        'SysGuid': x.Id || x.SysGuid || ''

                                    };

                                });
                            }
                        }
                    // case 'CurrentVerticalOwner':
                    case 'vertical':
                    case 'Vertical':
                        {

                            if (data[0].Vertical) {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Vertical.Name || x.Vertical.FullName || '',
                                        'SBUData': (x.SBU && x.SBU.Name) ? x.SBU.Name : '',
                                        'Id': x.Vertical.SysGuid || x.Vertical.Id || '',
                                        'SysGuid': x.Vertical.Id || x.Vertical.SysGuid || ''

                                    };

                                });
                            } else {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Name || x.FullName || '',
                                        'SBUData': (x.SBU && x.SBU.Name) ? x.SBU.Name : '',
                                        'Id': x.SysGuid || x.Id || '',
                                        'SysGuid': x.Id || x.SysGuid || ''

                                    };

                                });
                            }
                        }
                    case 'Assignmentvertical':
                        {

                            if (data[0].Vertical) {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Vertical.Name || x.Vertical.FullName || '',
                                        'SBU': (x.SBU.Name) ? x.SBU.Name : '',
                                        'Id': x.Vertical.SysGuid || x.Vertical.Id || '',
                                        'SysGuid': x.Vertical.Id || x.Vertical.SysGuid || ''

                                    };

                                });
                            } else {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Name || x.FullName || '',
                                        'SBU': (x.SBU.Name) ? x.SBU.Name : '',
                                        'Id': x.SysGuid || x.Id || '',
                                        'SysGuid': x.Id || x.SysGuid || ''

                                    };

                                });
                            }
                        }
                    case 'CountryReference':
                    case 'Assignmentcountry':
                    case 'country':
                        {
                            if (data[0].Country) {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Country.Name || x.Country.FullName || '',
                                        'Id': x.Country.SysGuid || x.Country.Id || '',
                                        'GeoData': x.Geo ? x.Geo.Name : '',
                                        'RegionData': (x.Region) ? x.Region.Name : '',
                                        'SysGuid': x.Country.Id || x.Country.SysGuid || ''

                                    };

                                });
                            } else {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Name || x.FullName || '',
                                        'Id': x.SysGuid || x.Id || '',
                                        'GeoData': x.Geo ? x.Geo.Name : '',
                                        'RegionData': (x.Region) ? x.Region.Name : '',
                                        'SysGuid': x.Id || x.SysGuid || ''

                                    };

                                });
                                // }
                            }
                        }
                    case 'Region':
                    case 'Assignmentregion':
                    case 'region':
                        {
                            if (data[0].Region) {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Region.Name || x.Region.FullName || '',
                                        'Id': x.Region.SysGuid || x.Region.Id || '',
                                        'GeoData': x.Geo.Name || x.Geo.FullName || '',
                                        'SysGuid': x.Region.Id || x.Region.SysGuid || ''

                                    };

                                });
                            } else {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Name || x.FullName || '',
                                        'Id': x.SysGuid || x.Id || '',
                                        'GeoData': x.GeoName || '',
                                        'SysGuid': x.Id || x.SysGuid || ''

                                    };

                                });
                            }
                        }
                    case 'subvertical':
                    case 'SubVertical':
                        {
                            if (data[0].SubVertical) {

                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.SubVertical && (x.SubVertical.Name || x.SubVertical.FullName) || '',
                                        'VerticalData': x.Vertical && (x.Vertical.Name || x.Vertical.FullName) || '',
                                        'Id': x.SubVertical && (x.SubVertical.Id || x.SubVertical.SysGuid) || '',
                                        'SysGuid': x.SubVertical && (x.SubVertical.Id || x.SubVertical.SysGuid) || ''

                                    };

                                });
                            } else {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Name || x.FullName || '',
                                        'Id': x.SysGuid || x.Id || '',
                                        'VerticalData': (x.Vertical) ? x.Vertical.Name : '' || (x.FullName) ? x.Vertical.FullName : '' || '',
                                        'SysGuid': x.Id || x.SysGuid || ''

                                    };

                                });
                            }
                        }
                    case 'Assignmentsubvertical':
                        {
                            if (data[0].SubVertical) {

                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.SubVertical && (x.SubVertical.Name || x.SubVertical.FullName) || '',
                                        'Vertical': x.Vertical && (x.Vertical.Name || x.Vertical.FullName) || '',
                                        'Id': x.SubVertical && (x.SubVertical.Id || x.SubVertical.SysGuid) || '',
                                        'SysGuid': x.SubVertical && (x.SubVertical.Id || x.SubVertical.SysGuid) || ''

                                    };

                                });
                            } else {
                                return data.map(x => {

                                    return {
                                        ...x,
                                        'Name': x.Name || x.FullName || '',
                                        'Id': x.SysGuid || x.Id || '',
                                        'Vertical': x.Vertical && (x.Vertical.Name || x.Vertical.FullName) || '',
                                        'SysGuid': x.Id || x.SysGuid || ''

                                    };

                                });
                            }
                        }

                    case 'accountOwnerPageNameSearch':
                        {
                            return data.map(x => {

                                return {
                                    ...x,
                                    'Name': (x.Name) ? this.getSymbol(x.Name) : '',
                                    'Id': (x.SysGuid) ? x.SysGuid : '',
                                    'AccId': (x.Number) ? x.Number : '',
                                    'Ownername': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : "" : '',
                                    'AccType': (x.Type) ? (x.Type.Value) ? x.Type.Value : '' : '',
                                    'SysGuid': x.Id || x.SysGuid || ''
                                };

                            });
                        }
                    case 'accountNameSearch':
                        {
                            return data.map(x => {

                                return {
                                    ...x,
                                    'Name': (x.Name) ? this.getSymbol(x.Name) : '',
                                    'Id': (x.SysGuid) ? x.SysGuid : '',
                                    'AccId': (x.Number) ? x.Number : '',
                                    'Ownername': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : "" : '',
                                    'AccType': (x.Type) ? (x.Type.Value) ? x.Type.Value : '' : '',
                                    'SysGuid': x.Id || x.SysGuid || ''
                                };

                            });
                        }
                    case 'UltimateParentAccount':
                    case 'ParentAccount':
                    case 'Privateequaitity':
                    case 'parentaccount':
                        {
                            return data.map(x => {

                                return {
                                    ...x,
                                    'Name': (x.Name) ? this.getSymbol(x.Name) : '',
                                    'Id': x.Id || x.SysGuid || '',
                                    'AccId': (x.Number) ? x.Number : '',
                                    'Ownername': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : "" : '',
                                    'AccType': (x.Type) ? (x.Type.Value) ? x.Type.Value : '' : '',
                                    'SysGuid': x.Id || x.SysGuid || ''
                                };

                            });
                        }
                    case 'ultimateparent':
                        {
                            return data.map(x => {

                                return {
                                    ...x,
                                    'Name': (x.Name) ? this.getSymbol(x.Name) : '',
                                    'Id': x.Id || x.SysGuid || '',
                                    'AccId': (x.Number) ? x.Number : '',
                                    'Ownername': (x.Owner) ? (x.Owner.FullName) ? x.Owner.FullName : "" : '',
                                    'AccType': (x.Type) ? (x.Type.Value) ? x.Type.Value : '' : '',
                                    'SysGuid': x.Id || x.SysGuid || ''
                                };

                            });
                        }
                    case 'Geo':
                    case 'Assignmentgeography':
                    case 'geography':
                        {
                            return data.map(x => {
                                return {
                                    // ...x,
                                    'Name': x.Name || x.FullName || '',
                                    'Id': x.SysGuid || x.Id || '',
                                    'SysGuid': x.Id || x.SysGuid || ''

                                };
                            });
                        }
                    default:
                        {
                            return data.map(x => {

                                return {
                                    // ...x,
                                    'Name': this.getSymbol(x.Name) || this.getSymbol(x.FullName) || '',
                                    'Id': x.SysGuid || x.Id || '',
                                    'SysGuid': x.Id || x.SysGuid || ''

                                };

                            });
                        }
                }

            } else {
                return [];
            }
        } else {
            return [];
        }

    }
    // filterAdvnLeadSrc(data) {
    //     debugger
    //     if (data.length > 0) {
    //         return []
    //     } else {
    //         return []
    //     }
    // }
    setHeaderPixes(length, isAccount): string {
        this.isAccount = false;
        if (length === 5) {
            return '775px';
        } else if (length === 4) {
            return '952px';
        } else if (length === 3) {
            this.isAccount = isAccount;
            return '727px';
        } else if (length === 2) {
            this.isAccount = isAccount;
            return '500px';
        } else {
            return '500px';
        }
    }
    getSymbol(data) {
        // console.log(data)
        if (data) {
            return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
        } else {
            return '';
        }

    }
    // getEncodedSymbol(data) {
    //     // console.log(data)
    //     return escape(JSON.parse('"' + data + '"')).replace(/\ /g, '+');
    // }

    getPowerBIUrls() {
        return this.apiService.post(routes.PowerBIUrls, {});
    }

    getHierarchicalData(data) {
        let postObj = { "SearchText": data.keyword, "Guid": "", "PageSize": 10, "RequestedPageNumber": 1, "ODatanextLink": "" };
        switch (data.key) {
            case 'sbu':
                return this.apiService.post(routes.SBUByName, postObj);
            case 'vertical':
                if (data.parentsIds && data.parentsIds.sbu) {
                    postObj['Guid'] = data.parentsIds.sbu;
                    return this.apiService.post(routes.GetVerticalbySBUID, postObj);
                }
                else return this.apiService.post(routes.SearchVerticalAndSBU, postObj);
            case 'subvertical':
                if (data.parentsIds && data.parentsIds.vertical) {
                    postObj['Guid'] = data.parentsIds.vertical;
                    return this.apiService.post(routes.SubVerticalByVertical, postObj);
                }
                else if (data.parentsIds && data.parentsIds.sbu) {
                    postObj['Guid'] = data.parentsIds.sbu;
                    return this.apiService.post(routes.SearchAllBySubVerticalnSBU, postObj);
                }
                else return this.apiService.post(routes.SearchAllBySubVertical, postObj);
            case 'geo':
                return this.apiService.post(routes.GeographyByName, postObj);
            case 'region':
                if (data.parentsIds && (data.parentsIds.geo || data.parentsIds.geography)) {
                    postObj['Guid'] = data.parentsIds.geo || data.parentsIds.geography;
                    return this.apiService.post(routes.RegionByGeo, postObj);
                }
                else return this.apiService.post(routes.GetAllByRegion, postObj);
            case 'country':
                if (data.parentsIds && data.parentsIds.region) {
                    postObj['Guid'] = data.parentsIds.region;
                    return this.apiService.post(routes.CountryByRegion, postObj);
                }
                else return this.apiService.post(routes.GetAllByCountry, postObj);
            case 'state':
                if (data.parentsIds && data.parentsIds.country) {
                    postObj['Guid'] = data.parentsIds.country;
                    return this.apiService.post(routes.StateByCountry, postObj);
                }
                else return this.apiService.post(routes.GetAllByState, postObj);
            case 'city':
                if (data.parentsIds && data.parentsIds.state) {
                    postObj['Guid'] = data.parentsIds.state;
                    return this.apiService.post(routes.CityByState, postObj);
                }
                else if (data.parentsIds && data.parentsIds.country) {
                    postObj['Guid'] = data.parentsIds.country;
                    return this.apiService.post(routes.GetAllByCityNCountry, postObj);
                }
                else return this.apiService.post(routes.GetAllByCity, postObj);
        }
    }
    clearAutoSaveData(key) {

        const obj = {
            //  ADId: (data=="empty")?"empty":JSON.stringify(data),
            CacheKey: key
        }
        return this.apiService.post(routes.clearAutoSaveData, obj);
    }

    HelpdeskAccountCreation(reqbody) {
        return this.apiService.post(routes.HelpdeskAccountCreation, reqbody)
    }
    setUrlParamsInStorage(route_from, id) {
        const obj = { 'route_from': route_from, 'Id': id };
        localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))
    }
    getUrlParamsInStorage() {
        let obj;
        if (localStorage.getItem('routeParams'))
            obj = JSON.parse(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('routeParams'), 'DecryptionDecrip'));
        return obj;
    }
    getSession(keyName) {
        try {
            return JSON.parse(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem(keyName), 'DecryptionDecrip'));
        }
        catch (e) {
            return null;
        }
    }
    setSession(keyName, value) {
        return (sessionStorage.setItem(keyName, this.EncrDecr.set("EncryptionEncryptionEncryptionEn", JSON.stringify(value), "DecryptionDecrip")));
    }
    goBack(url) {
        this.router.navigate([url]);
    }
    // setPinnedListingPage(AccountViewType) {
    //     const userID = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    //     const Obj = {
    //         'SysGuid': userID,
    //         'AccountViewType': AccountViewType
    //     };
    //     this.apiService.post(routes.PinView, Obj);
    // }

    getADMs(reqbody): Observable<any> {
        return this.apiService.post(routes.searchADMs, reqbody);
    }
}


interface AllrelaionshipReq {
    PageSize?: number,
    OdatanextLink?: string,
    RequestedPageNumber?: number
}
interface AllAccountReq {
    PageSize?: number,
    OdatanextLink?: string,
    RequestedPageNumber?: number,
    Guid?: string
}

interface ReworkCommentReq {
    SysGuid?: string,
    Comment?: string,

}

// export interface tabListInterface {
//     GroupLabel: string,
//     GroupData: Array<GroupDataItem>
// }
// export interface GroupDataItem {

//     title: string,
//     id: number

// }
