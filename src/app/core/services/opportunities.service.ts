import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { MatDialog, MatSnackBar } from "@angular/material";
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ApiServiceUI, ApiService, ApiServiceOpportunity } from './api.service';
import { switchMap,debounceTime } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
export const linkedLeadNames = {

    'linkedLeads': { name: 'Linked leads', isCheckbox: true, isAccount: false },
    'alliances': { name: 'Alliances', isCheckbox: false, isAccount: false },
      'account': { name: 'Account', isCheckbox: false, isAccount: false },
      'IP': { name: 'IP', isCheckbox: false, isAccount: false },
      'assign': { name: 'Assign', isCheckbox: false, isAccount: false },
      'shareAssign': { name: 'User', isCheckbox: true, isAccount: false },
       'linkedActivity': { name: 'Activities', isCheckbox: true, isAccount: false },
       'changeVer': { name: 'Vertical owner', isCheckbox: false, isAccount: false },
       'changeNewVer': { name: 'Vertical owner', isCheckbox: false, isAccount: false },
       

}
export const linkedLeadHeader: any[] = [
  { name: 'leadName', title: 'Lead name' },
  { name: 'leadOwner', title: 'Lead owner' },
   { name: 'accountName', title: 'Account name' }
]

export const allianceFinderHeader: any[] = [
  { name: 'accountName', title: 'Account name' },
  { name: 'accountOwner', title: 'Account Owner' }
]

export const accountFinderHeader: any[] = [
  { name: 'accountName', title: 'Account name' },
  { name: 'accountOwner', title: 'Account owner' },
     { name: 'vertical', title: 'Vertical' },
    { name: 'region', title: 'Region' },
    { name: 'sysNumber', title: 'Account number'}
]
export const ipFinderHeader: any[] = [

    { name: 'name', title: 'Name' },
     
     { name: 'owner', title: 'Owner' },
     { name: 'type', title: 'Type' }

]
export const assignHeader: any[] = [
    { name: 'name', title: 'Full name' },
    { name: 'email', title: 'Email' }

]

// shinder
export const verticalHeader: any[] = [
    { name: 'name', title: 'Vertical owner name' },
    { name: 'email', title: 'Email' }

]

export const linkedActivitiesHeader: any[] = [
    { name: 'name', title: 'Activity name' },
    { name: 'owner', title: 'Activity owner' }

]

export const linkedLeadsHeaders = {
    'linkedLeads': linkedLeadHeader,
    'alliances':  allianceFinderHeader,
    'account':  accountFinderHeader,
    'IP':  ipFinderHeader,
     'assign':  assignHeader,
      'shareAssign':  assignHeader,
     'linkedActivity':linkedActivitiesHeader,
     'changeVer' :  verticalHeader,
     changeNewVer:  verticalHeader,

}


const routes = {
     DaAPi:'OpportunityRetagging/MakeOpportunityRecordEntry',
    pinChangeApi:'v1/MasterManagement/Opportunity/PinView',
    checkresultstable:'Helpdesk/UpdateVerticalSalesOwner',
    searchVerApi:'/Helpdesk/GetVerticalFromOpp',
  getchangeVerData:'Helpdesk/CurrentOppVSO',
  getNewchangeVerData:'Common/GetAccountOwnerLookup',
  closureDetailsApi:'OpportunitySummary/GetClosuredetails',
  pricingDetailsApi:'OpportunitySummary/GetPricingdetails',
  shareRoute:'Common/Share',
  shareRoutee:'Common/ShareWithGainAccess',
  renewalFilter:'OpportunityRetagging/GetBFMApprovedOrderColmnsFilter',
  downloadOpportunities:'OpportunityListing/DownloadList',
  downloadCommitment:'OpportunityCommitmentRegister/DownloadList',
  getFGeographyName:'OpportunityFinder/GetOpportunityFinderGeography',
  getAllVertical:'OpportunityListing/SearchColumnOpportunityVertical',
  getFStage:'v1/MasterManagement/GetOpportunityStages',
  getFaccountName:'Common/GetAccountLookUp',
  getFCreatedOn:'OpportunityFinder/GetOpportunityFinderCreatedOn',
   getFAdvisorName:'OpportunityFinder/GetOpportunityFinderAdvisor',
  getFCurrency:'/OpportunityFinder/GetOpportunityFinderTCV',
  getFOpportunityNumber:'OpportunityFinder/GetOpportunityFinderNumber',
  getFOpportunityName:'OpportunityFinder/GetOpportunityFinderName',
  getRorderDataFilterData:'OpportunityRetagging/GetSearchOrderNumber',
  getRnameFilterData: 'OpportunityRetagging/GetSearchOpportunityName',
  getRIdFilterData:'OpportunityRetagging/GetSearchOpportunityId',
  getRpricingFilterData: 'v1/MasterManagement/GetWiproPricingType',
  getRsapData:'common/GetSapCodeDetails',
  currLookUp:'Common/GetTransactionCurrency',
  getRendDate: 'OpportunityRetagging/GetOrderSearchStartandEnddate',
  typeLookUp:'v1/MasterManagement/GetOpportunityType',
  dateLookUp:'OpportunityListing/SearchColumnOpportunityEstClouserDate',
  tcvLookUp:'OpportunityListing/SearchColumnOpportunityTCV',
  nameLookUp:'OpportunityListing/SearchColumnOpportunityName',
  IdLookUp:'OpportunityListing/SearchColumnOpportunityNumber',
   filterLisingApi:'OpportunityListing/ListingFilter',
   filterLisingFinderApi:'OpportunityRetagging/GetBFMApprovedOrderFilterList',
   filterLisingFinderrApi:'OpportunityFinder/GetSearchOpportunityFinderFilter',
  checkSupervisor:'Common/GetSupervisors',
  opportunityQualifier:'v1/MasterManagement/GetQualificationStatus',
  saveQualifier:'OpportunitySummary/UpdateQualificationStatus',
  getRsStatus:'OpportunitySummary/GetRSSummarydetails',
  finderAllianceLookup :'Common/GetAccountLookUp',
  finderChangeAllianceLookup:'Common/GetAccountCategogyList',
  finderIpLookup :'Common/GetIPSolutionProductLookup',
  linkedLeadRoute:'Common/GetLeadOpportunityLookup',
  assignLookup:'v1/LeadManagement/SearchOwner',
  activityLookup:'Common/GetActivitiesOpportuntyLookupUrl',
  toolkit:'OpportunitySummary/GetRSStatus',
  getCloudDetails:'BusinessSolution/CheckCloudMandatory',
  ipData:'BusinessSolution/GetAllActiveIPProductDetails',
  roleApi  :'Common/GetUserRoles',
  accessApi:'OpportunityFinder/GetOppAllAccessRights',
  manualProbability:'v1/MasterManagement/GetManualProbability',
  forecastData:'v1/MasterManagement/ForeCast',
  opportunityStatusData:'v1/MasterManagement/GetOpportunityStatus',
  opportunityStatusViewData:'v1/MasterManagement/GetStatusDetails',
  orderfinder: '/orderfinder',
  opportunityfinder: '/opportunityFinder',
  wiproContact: '/OpportunityCreate/GetContactList',
  getPOAHolders: 'OrderBooking/GetPOAHolders',
  wiproLinkedAGP: '/wiproLinkedAGP',
  linkLead: '/linkLead',
  leadActivities: '/leadActivities',
  serviceLineBDM: '/wiproslbdm',
  getOpportunitCompetitor: 'OpportunityCompetitor/GetOpportunityCompetitors',
  deleteOpportunitCompetitor: 'OpportunityCompetitor/DeleteOpportunityCompetitor',
  searchOpportunitCompetitor: 'Common/GetCompetitor',
  getDefaultCompetitorDisableUrl: 'Common/GetDefaultCompetitor',
  saveOpportunityCompetitor: 'OpportunityCompetitor/SaveOpportunityCompetitors',
  saveIpData:'BusinessSolution/SaveIPDetails',
  saveServiceLineDetailIndividual:'BusinessSolution/SaveServiceLineDetails',
  SlBdm: 'OpportunityCreate/GetServiceLineBDMList',
  getCbuList: 'OpportunityCreate/GetAccountCBUList',
  getAccountNameUrl: 'v1/SearchManagement/SearchAccount',
  getAccountNameOnSelect: 'OpportunityCreate/GetAccountRelatedFields',
  getCurrency:'Common/GetTransactionCurrency',
  getCustomerDMaiker:'/OpportunityCreate/GetContactList',
  GetBFMApprovedOrderList:'OpportunityRetagging/GetBFMApprovedOrderList',
  getRenewal:'OpportunityRetagging/RenewalOpportunity',
  getSap:'Common/GetSapCode',
  //Opportunity Overview API URL start*
  getCompanyEntity:'OpportunityCreate/GetSapcodeCompanyEntity',
  getOppOverviewDetail: 'OpportunityRetagging/GetoppOverviewdetails',
  getCBUData:'OpportunityCreate/GetAccountCBUList',
  addCBU:"Common/CreateCBU",
  getAdvisorData:'Common/GetAccountLookUp',
  getAccountRelatedFiels:'OpportunityCreate/GetAccountRelatedFields',
  getRegionList:'Common/GetRegions',
  saveOpportunityData :'OpportunityCreate/CreateOpportunity',
  getDomainTribe: 'OpportunityCreate/GetDomainList',
  getChapter: 'OpportunityCreate/GetAllChapter',
  getTargetArea: 'OpportunityCreate/GetAllTargetedArea',
  getAdvisorName: 'common/GetAccountCategogyList',
  getAdvisorContact: '/OpportunityCreate/GetContactList',
 //getConversations:'Common/GetActivityGroup',
   getActivities:'Common/GetActivitiesOpportuntyLookupUrl',
  //getLinkedLeads:'v1/LeadManagement/Search',
  getLinkedLeads:'Common/GetLeadOpportunityLookup',
  //getVerticalsalesOwner:'Common/GetVerticalSalesOwner',
  getAccountList:'Search/SearchAccount',
 getverticalSalesOwner:'Common/GetAccountBDMLookUp',
 getverticalSalesOwnerAPI:'Common/GetVerticalSalesOwners',
 getDealDashboardData:'DealDashboard/GetOpportunityDashboardDetail',
 deleteDecisionConatct:'OpportunityCreate/DeleteOppDecisionMaker',
 deleteConversation:'OpportunitySummary/DeactiveLinkActivitiesOpportunity',
 deleteLeads:'OpportunitySummary/DeactiveLeadOpportunity',
//getSapCode:'Common/GetSapCode',
 getSapCode:'Common/GetSapCodeDetails',
 getCurrencyData:'Common/GetTransactionCurrency',
 getSource:"v1/MasterManagement/GetWiproSource",
 getLeadSource:"v1/MasterManagement/GetLeadSource",
 getSAPCodeDetails : "OpportunityCreate/GetSAPCode",
 uploadSapCodeDoc : "OpportunityCreate/SAPCodeRequest",
 createEmail: "OpportunityCreate/CreateEmail",
 getRegion: "OpportunityCreate/GetRegion",
 getLeadSrcDtlsAdvisor : "v1/MasterManagement/GetLeadSourceDetailsAdvisor",
 getLeadSrcDtlsAlliance : "v1/MasterManagement/GetLeadSourceDetailsAlliance",
 getLeadSrcDtlsMarketing : "v1/MasterManagement/GetLeadSourceDetailsMarketing",
 getLeadSrcDtlsSL : "v1/MasterManagement/GetLeadSourceDetailsServiceLine",
 getAdvAccountLookup : "Common/GetAccountCategogyList",
 getCampaignDataUrl :"OpportunityCreate/GetAccountBasedCampaign",//"Deal_Influencer/GetCampaign",
 getEventData : "OpportunityCreate/GetAccountBasedEvents",// "Deal_Influencer/GetEvents",
 getOriginatingLead : "Common/GetOrginatingLead",
 getProposalType:"v1/MasterManagement/GetProposalType",
 getDigitalBigBets:"v1/MasterManagement/GetWiproDigitalbigbets",
   getEngModel:'v1/MasterManagement/GetEngagementModel',
 //getCountryList:'Common/GetCountry',
getCountryList:'Common/GetCountryLookUp',
 //getStateList:'Common/GetStates',
 getStateList:'Common/GetStateLookUp',
 //getCityList:'Common/GetCity',
 getCityList:'Common/GetCityLookUp',
 getCurrencyStatus:'Common/GetDynamicCurrencyExchangeRate',
 getWiproAGP:'v1/MasterManagement/GetAccountAGPDetails',//?AccountId=',
 deleteAGP:'BusinessSolution/DeleteBSPDetails',
 getContactDetails:'Common/GetAdvisorcontactLookup',
 getAllViewQuery:'Common/GetPersonalQuery',
 deleteViewQuery:'Common/DeletePersonalQuery',
 getCountryForSap:'OpportunityCreate/GetCountry',
 updateStageAPI:'Helpdesk/UpdatePipelinestage',
 getUserID_DA:'Common/GetOpportunityTaggedUser',
 getEmailID_DA:'Common/GetUserDetailsTaggedUser',
  //Opportunity Overview API URL end*
  //additional ip and solution details API URL start*
getAdditionalIpDetails:'BusinessSolution/GetRelatedIPAdditionalDetails',
getCloudDetailsIp:'BusinessSolution/GetRelatedIPCloudDetails',
getAdditionalSolutionDetails:'BusinessSolution/GetRelatedServiceLineAdditionalDetails',
saveAdditionalIpDetails:'BusinessSolution/UpdateIPAdditional',
saveIpCloudDetails:'BusinessSolution/SaveCloudDetails',
deleteIpAdditionDetails:'BusinessSolution/DeleteBSPDetails',
getServiceLineCloud:'BusinessSolution/GetRelatedServiceLineCloudDetails',
saveServiceLineDetail:'BusinessSolution/SaveAdditionalServiceLineDetails',
getFunction:"v1/MasterManagement/GetWiproFunction",
getCategory:"v1/MasterManagement/GetWiproCategory",
getServiceProvider:"v1/MasterManagement/GetWiproServiceProvider",
getTechnology:"v1/MasterManagement/GetWiproTechnology",
getStaffingDetails:"OpportunitySummary/UpdateStaffing",
   //additional ip and soluion details API URL end*

  GetLossCategory: 'EndSalesCycle/GetLossCategory',
  LossReason: 'EndSalesCycle/GetLossReason',
  GetEndSalesCycleReason: 'EndSalesCycle/GetEndSalesCycleReason',
  getOppCloudValidationConfigsUrl:'EndSalesCycle/GetOppCloudValidationConfigs',
  checkOppMandatoryAttributeUrl:'EndSalesCycle/CheckOppMandatoryAttribute',
  checkCityCountUrl:'EndSalesCycle/CheckCityCount',

  //Url declaration by sumit
  saveBusinessSolutionUrl:'BusinessSolution/SaveBusinessSolutionPage',
  getBusinessSolutionsUrl: 'BusinessSolution/GetBusinessSolutions',
  saveCIOUrl:"BusinessSolution/UpdateCIODetails",
  //credit Allocation Url declaration
  // getServiceLineUrl: (Oppid: string) => `OpportunityCreditAllocations/GetServicelineDropdown?Oppid=${Oppid}`,
  // getPracticeUrl: (Oppid:string,SLId:string)=> `OpportunityCreditAllocations/GetPracticeDropdown?Oppid=${Oppid}&SLId=${SLId}`,
  // getSubpracticeUrl: (Oppid:string,SLId:string,PracId:string)=>`OpportunityCreditAllocations/GetSubPracticeDropdown?Oppid=${Oppid}&SLId=${SLId}&PracId=${PracId}`,
  getServiceLineUrl: 'OpportunityCreditAllocations/GetServicelineDropdown',
  getPracticeUrl: 'OpportunityCreditAllocations/GetPracticeDropdown',
  getSubpracticeUrl: 'OpportunityCreditAllocations/GetSubPracticeDropdown',
  getServiceLineBDMSlUrl: 'OpportunityCreditAllocations/GetSLBDMSPS',
  getServiceLineBDMVerticalUrl: 'OpportunityCreditAllocations/GetVBDM',
  deleteCreaditAllocationUrl: 'OpportunityCreditAllocations/DeactivateCreditAllocation',
  CreateUpdateCreditAllocationUrl: 'OpportunityCreditAllocations/CreateOppCreditAllocation',
  getCreditAllocationDetails: 'OpportunityCreditAllocations/GetAllCreditAllocation',
  creditTypeUrl:'v1/MasterManagement/GetCreditAllocationType',


  //Solutions URl declaration
  SolutionNameTypeUrl: 'BusinessSolution/GetAllSolutionProduct',
  SolutionOtherNameTypeUrl: 'BusinessSolution/GetAllAllianceProductDetails',
  SolutionBDMNameUrl: 'Common/GetActiveEmployees',
  serviceTypeUrl:'v1/MasterManagement/GetWiproServiceType',
  InfluenceTypeUrl:'v1/MasterManagement/GetWiproInfluenceType',
  solutionTypeUrl: 'v1/MasterManagement/GetSolutionType',
  getOwnerForSolution:'Common/GetAccountOwnerLookup',
  //IP Solution URl declaration
  IpDropDownUrl: 'BusinessSolution/GetAllActiveIPProductDetails',
  IpDropDownUrlHolmesBDM: 'Common/GetActiveEmployees',
  IPHolmesBDMAPI:'Common/GetProductBDMLookUp',
  IpModuleUrl: 'BusinessSolution/GetAllProductModulesDetails',


  // IP and Service LineAPi
  IpPracticeUrl: 'Common/GetPractice',
  IpSLBDMUrl: 'OpportunityCreate/GetServiceLineBDMList',
  IpServiceLIneUrl: 'Common/GetServiceLines',
  IpServiceLIneUrlUpdated:'BusinessSolution/GetServicelineLookup',
  SLSubpracticeUrl: 'OpportunityCreate/GetSubPracticeList',
  EngagementModelUrl:'v1/MasterManagement/GetEngagementModel',
  dualCreditUrl:'v1/MasterManagement/GetDualCredit',

  //business solution panel Url
  deleteSLIPSolutionUrl:'BusinessSolution/DeleteBSPDetails',
  getBusinessSolutionPanelUrl: 'BusinessSolution/GetOppBSPDetails',
  getTCVComparisonData:'BusinessSolution/CompareWithDPSSL',

  //TCV PopUP
  getTCVPopUpUrl: 'BusinessSolution/GetTVSetails',
  saveTCVPopUpUrl: 'BusinessSolution/SaveTCVDetails',
  getChangeOccuredUrl:'v1/MasterManagement/GetTCVChangeoccurred',

  //End of Url declaration by Sumit

  accountNameData: 'v1/SearchManagement/SearchAccount',
  ServiceLine: 'Common/GetServiceLines',
  serviceLineNew: 'BusinessSolution/GetServicelineLookup',
  getPractice: 'Common/GetPractice',
  getSubPractice: 'OpportunityCreate/GetSubPracticeList',
  alliance: 'Common/GetAccountCategogyList',
  serviceLines: 'Common/GetServiceLines',
  practice: 'Common/GetPractice',
  vertical: 'Common/GetVerticals',
  subVertical: 'Common/GetSubVerticals',
  geo: 'Common/GetGeography',
  // geo: 'v1/MasterManagement/GetParentGeographyName',
  region: 'Common/GetRegion',
  competitor: 'Common/GetCompetitor',
  tableData: 'OpportunityFinder/GetSearchOpportunityFinder',
  checkAccess: 'OpportunityFinder/GetAccountAccessRights',
  getTemplate: 'OpportunityFinder/GetTeamTemplate',
  confirmApi: 'OpportunityFinder/AddAccessUserTeam',
  profileSummary: 'OpportunitySummary/GetOpportunitySummary',
  saveProbability: 'OpportunitySummary/UpdateOpportunityManual',
  forexValue: 'Common/GetDynamicCurrencyExchangeRate',
  activityData: 'OpportunitySummary/GetOpportunityLinkedActivities',
  activityDataModal: 'Common/GetActivityGroup',
  deleteActivityData: 'OpportunitySummary/DeactiveLinkActivitiesOpportunity',
  saveActivty: 'OpportunitySummary/AddUpdateLinkActivitiesOpportunity',
  leadDataModal: 'v1/LeadManagement/Search',
  leadData: 'OpportunitySummary/GetOpportunityLeads',
  deleteLeadData: 'OpportunitySummary/DeactiveLeadOpportunity',
  saveLead: 'OpportunitySummary/api/v1/LeadManagement/LinkOpportunityAndOrders',
  estimateCloseDate: 'OpportunityListing/UpdateEstimatedClosureDate',
  searchOwner: 'Common/GetActiveEmployees',
  saveAssign: 'OpportunityListing/AssignOpportunities',
  saveSuspend: 'OpportunityListing/SuspendOpportunity',
  estimate: 'OpportunityListing/UpdateEstimatedClosureDate',
  reopenSave: 'OpportunityListing/ReOpenonDateOpportunity',
  reopenSavee: 'OpportunityListing/ReOpenOpportunity',


  getCampaignData: 'EndSalesCycle/GetEndSalesCycleOpportunity',
  getEndSaleOpportunity: 'EndSalesCycle/GetEndSalesCycle',
  createSaveEndSalesCycle: 'EndSalesCycle/CreateForEndSalesCycle',

  updateOpportunityStatus: 'EndSalesCycle/UpdateOpportunityStatus',
  updateLossOpportunity: 'EndSalesCycle/UpdateLoseOpportunity',
  getOpportunityStatus: 'EndSalesCycle/GetEndSalesCycleStatus',
  searchpoa: '/searchpoa',
   //Help-Desk
  gethelpDeskTrack:'Helpdesk/TrackOpportunity',

 //Insights
  getSolutionUrl:'OpportunityInsight/GetSolutions',
  getClientSuccessUrl:'OpportunityInsight/GetClientSuccessStories',
  getRUCInsightsUrl:'OpportunityInsight/GetRUC',
  getCaseStudySuccessUrl:'OpportunityInsight/GetCaseStudies', 
  //getSolutionAsset:'OpportunityInsight/GetSolutionsAsset',

  opportunityStatusOptionSetUrl: '/v1/MasterManagement/GetOpportunityStatus',
  opportunityStateCodeOptionUrl: 'v1/MasterManagement/GetOpportunityStateCode',
  opportunityDecisionTakenOptionSetUrl: 'v1/MasterManagement/GetOpportunityDecisionTaken',
  opportunityInformationSourceOptionSetUrl: 'v1/MasterManagement/GetOpportunityInformationSource',
  opportunityReasonValuesOptionSetUrl: 'v1/MasterManagement/GetOpportunityReasonValues',
  opportunityStagesUrl: 'v1/MasterManagement/GetOpportunityStages',
  opportunityCommentTypeOptionSetUrl: 'v1/MasterManagement/GetOpportunityCommentType',
  wiproExcludedOptionSetUrl: 'v1/MasterManagement/GetWiproStages',
  //smart search
  searchUsingText:'BusinessSolution/GetBSPSmartSearch',
    //emaillandingpage
    emailLanding: '/emaillanding',

    //add alliance
  searchUsingTextForAllaince:'Common/GetAccountCategogyList',
  getInfluenceTypeValues:'v1/MasterManagement/GetWiproInfluenceType',
  getServiceTypeValues:'v1/MasterManagement/GetWiproServiceType',
  getTCV:'BusinessSolution/GetOverAllTVSetails',
  saveAlliance:'BusinessSolution/SaveSolutionDetails',

  //summary delivery team
   deliveryTeamApi:'OpportunitySummary/GetDeliveryTeam',

   //opportunity snapshot
   getOpenRequests:'OpportunitySnapshot/GetOpportunityTeaming',
   getCoachDetails:'OpportunitySummary/GetAutoCoachDetails',
   getSLBDMList: 'Common/GetServiceLineBDMList1',

   //won opportunity api
   wonOpportunity:'Common/UpdateWinOpportunity',


//saurav 

   proceedCloseUrl: 'EndSalesCycle/CheckOppMandatoryAttribute',

};

export const searchpoaheader: any[] = [
  { id: 1, isFilter: false, name: 'POAName', isFixed: true, order: 1, title: 'Name', isLink: true, displayType:"name" ,hideFilter: true},
  { id: 2, isFilter: false, name: 'EmailId', isFixed: false, order: 2, title: 'Email Id' ,hideFilter: true},
  { id: 3, isFilter: false, name: 'BU', isFixed: false, order: 3, title: 'BU',hideFilter: true},
  { id: 4, isFilter: false, name: 'CompanyCode', isFixed: false, order: 4, title: 'Company Code',hideFilter: true },
  { id: 5, isFilter: false, name: 'Category', isFixed: false, order: 5, title: 'Category',hideFilter: true},
  { id: 6, isFilter: false, name: 'Location', isFixed: false, order: 6, title: 'Location', displayType:"capsFirstCase",hideFilter: true}
]

export const orderFinderHeader: any[] = [
  { id: 1, isFilter: false, name: 'OrderID', isFixed: true, order: 1, title: 'Order/ Amendment ID', className: "notlinkcol", displayType:"upperCase" },
  { id: 2, isFilter: false, name: 'Type', isFixed: false, order: 2, title: 'Type', displayType:"capsFirstCase" },
  { id: 3, isFilter: false, name: 'Account', isFixed: false, order: 3, title: 'Account name', isLink: true },
  { id: 4, isFilter: false, name: 'Startdate', isFixed: false, order: 4, title: 'Start date', displayType:"date", dateFormat:'dd-MMM-yyyy' },
  { id: 5, isFilter: false, name: 'Status', isFixed: false, order: 5, title: 'Status', isLink: true },
  { id: 6, isFilter: false, name: 'OpportunityName', isFixed: false, order: 6, title: 'Opportunity name', isLink: true, displayType:"capsFirstCase" },
  { id: 7, isFilter: false, name: 'OpportunityID', isFixed: false, order: 7, title: 'Opportunity ID', displayType:"upperCase" }
]

// export const opportunityFinderHeader: any[] = [
//   { id: 1, isFilter: false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name' },
//   { id: 2, isFilter: false, name: 'ID', isFixed: false, order: 2, title: 'ID' },
//   { id: 3, isFilter: false, name: 'Type', isFixed: false, order: 3, title: 'Type' },
//   { id: 4, isFilter: false, name: 'Account', isFixed: false, order: 4, title: 'Account', isLink: true },
//   { id: 5, isFilter: false, name: 'Owner', isFixed: false, order: 5, title: 'Owner' },
//   { id: 6, isFilter: false, name: 'Stage', isFixed: false, order: 6, title: 'Stage' },
//   { id: 7, isFilter: false, name: 'Estclosuredate', isFixed: false, order: 7, title: 'Est.closure date' },
//   { id: 8, isFilter: false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical' },
//   { id: 9, isFilter: false, name: 'EstTCV', isFixed: false, order: 9, title: 'Est.TCV ' },
//   { id: 10, isFilter: false, name: 'Currency', isFixed: false, order: 10, title: 'Currency' },
//   { id: 11, isFilter: false, name: 'ProposalType', isFixed: false, order: 11, title: 'Proposal type' },
//   { id: 12, isFilter: false, name: 'Status', isFixed: false, order: 12, title: 'Status', isStatus: true }

// ]


export const opportunityFinderHeader: any[] = [
  { SortId:"0" ,id: 1, isFilter: false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',isLink: true, },
  { SortId:23 ,id: 2, isFilter: false, name: 'OpportunityNumber', isFixed: false, order: 2, title: 'Opportunity number' },
  { SortId:27 ,id: 3, isFilter: false, name: 'Currency', isFixed: false, order: 3, title: 'TCV' , displayType:"currency",hideFilter: true},
  { SortId:41 ,id: 4, isFilter: false, name: 'AdvisorName', isFixed: false, order: 4, title: 'Advisor'  },
  { SortId:3 ,id: 5, isFilter: false, name: 'CreatedOn', isFixed: false, order: 5, title: 'Created on' , displayType:"date", dateFormat: 'dd-MMM-yyyy'  },
  { SortId:2 ,id: 6, isFilter: false, name: 'accountName', isFixed: false, order: 6, title: 'Account name' },
  { SortId:46 ,id: 7, isFilter: false, name: 'AccountOwnerName', isFixed: false, order: 7, title: 'Account owner', displayType:"name" },
  { SortId:39 ,id: 8, isFilter: false, name: 'GeographyName', isFixed: false, order: 8, title: 'Geography' },
  { SortId:38 ,id: 9, isFilter: false, name: 'ProposalTypeName', isFixed: false, order: 9, title: 'Proposal type' },
  { SortId:40 ,id: 10, isFilter: false, name: 'OpportunityOwnerName', isFixed: false, order: 10, title: 'Opportunity owner', displayType:"name" },
  { SortId:7 ,id: 11, isFilter: false, name: 'statusName', isFixed: false, order: 11, title: 'Status',isStatus:true   },
   { SortId:30 ,id: 12, isFilter: false, name: 'Stage', isFixed: false, order: 11, title: 'Stage'  }

]

//vaishali
  export const emailHeader: any[] = [
  { id: 1, isFilter: false, name: 'OrderNumber', isFixed: true, order: 1, title: 'Order Number', displayType:"upperCase",hideFilter: true },
  { id: 2, isFilter: false, name: 'Subject', isFixed: false, order: 2, title: 'Subject',hideFilter: true},
//  { id: 3, isFilter: false, name: 'Emailstatus', isFixed: false, order: 3, title: 'Email Status',hideFilter: true},
  { id: 3, isFilter: false, name: 'CreatedOn', isFixed: false, order: 3, title: 'Created On',hideFilter: true},
 // { id: 4, isFilter: false, name: 'From', isFixed: false, order: 4, title: 'From', displayType:"date", dateFormat:'dd-MMM-yyyy'},
 // { id: 5, isFilter: false, name: 'Sendon', isFixed: false, order: 5, title: 'Send On', displayType:"date", dateFormat:'dd-MMM-yyyy'},
]
//vaishali
export const retagOrders: any[] = [
  { id: 1, isFilter: false, name: 'POAName', isFixed: true, order: 1, title: 'Name', isLink: true, displayType:"name" },
  { id: 2, isFilter: false, name: 'EmailId', isFixed: false, order: 2, title: 'Email Id' },
  { id: 3, isFilter: false, name: 'BU', isFixed: false, order: 3, title: 'BU'},
  { id: 4, isFilter: false, name: 'CompanyCode', isFixed: false, order: 4, title: 'Company Code' },
  { id: 5, isFilter: false, name: 'Category', isFixed: false, order: 5, title: 'Category'},
  { id: 6, isFilter: false, name: 'Location', isFixed: false, order: 6, title: 'Location', displayType:"capsFirstCase"}
]
//Advanced Look Up Code Start*
export const DecisionMakerHeaders: any[] = [
  { name: 'Name', title: 'Contact name' },
  { name: 'AccountName', title: 'Account name' },
  { name: 'Designation', title: 'Designation'}
]
export const SapCodeHeaders: any[] = [
  { name: 'Name', title: 'SAP customer name' },
  { name: 'WiproSapCustomerNumber', title: 'SAP customer number' },
  { name: 'WiproSapCompanyCode', title: 'SAP company code'}
]
export const AdvisorHeaders: any[] = [
  { name: 'Name', title: 'Account name' },
  { name: 'OwnerName', title: 'Account owner' }
]
export const AdvisorContactHeaders: any[] = [
  { name: 'Name', title: 'Contact name' },
  { name: 'AccountName', title: 'Account name' },
]
export const CurrencyHeaders: any[] = [
  { name: 'Name', title: 'Currency name' },
  { name: 'Type', title: 'Currency symbol' },
  { name: 'SysNumber', title: 'Exchange rate' },
  { name: 'IsoCurrencyCode', title: 'ISO currency code' },
  //{ name: 'SysGuid', title: 'transactioncurrencyid' },
]
export const VerticalSalesOwnerHeaders: any[] = [
  { name: 'Name', title: 'Username' },
  { name: 'EmailID', title: 'Email id' },
]
export const CountryHeaders: any[] = [
  { name: 'CountryName', title: 'Country name' },
  { name: 'RegionName', title: 'Region name' },
  { name: 'GeoName', title: 'Geo name' },
]
export const StateHeaders: any[] = [
  { name: 'Name', title: 'State name' },
  { name: 'MapName', title: 'Country name' },

]
export const CityHeaders: any[] = [
  { name: 'Name', title: 'City name' },
   { name: 'MapName', title: 'State name' },
    { name: 'CountryName', title: 'Country name' },

]
export const CbuHeaders: any[] = [
  { name: 'Name', title: 'CBU name' },
   { name: 'AccountName', title: 'Account name' },
]
export const SlBdmHeaders: any[] = [
  { name: 'Name', title: 'Username' },
  { name: 'EmailID', title: 'Email id' }
]

export const leadDetailsHeader : any[] = [
  // { name: 'accNumber', title: 'Account number' },
  // { name: 'name', title: 'Name' }
  { name: 'accountName', title: 'Account Name' },
    { name: 'accountOwner', title: ' Account Owner (primary)' },
]

export const OriginatingLeadHeaders : any[] = [
    { name: 'LeadName', title: 'Lead Name' },
    { name: 'Owner', title: 'Owner'}
]
export const CompanyEntityHeaders:any[]=[
    { name: 'CompanyName', title: 'Company Name' },
    { name: 'CompanyCode', title: 'Company Code' },
    { name: 'Location', title: 'Location' }
]
export const  CampaignHeader: any[] = [
  //   { name: 'code', title: 'Code' },
  // { name: 'name', title: 'Name' }
  { name: 'CampaignName', title: 'Campaign Name' },
  { name: 'CampaignOwner', title: 'Campaign Owner' },
  { name: 'CampaignCode', title: 'Campaign Code' },
]

export const  EventHeader: any[] = [
  //   { name: 'code', title: 'Code' },
  // { name: 'name', title: 'Name' }
  { name: 'CampaignName', title: 'Event Name' },
  { name: 'CampaignOwner', title: 'Event Owner' },
  { name: 'CampaignCode', title: 'Event Code' },
]

export const opportunityAdvnHeaders = {
  'DecisionMakers':DecisionMakerHeaders,
  'SapCode':SapCodeHeaders,
  'AdvisorName':AdvisorHeaders,
  'Currency':CurrencyHeaders,
  'AdvisorContact':AdvisorContactHeaders,
  'PrimaryContact':DecisionMakerHeaders,
  'Vertical_Owner':VerticalSalesOwnerHeaders,
  'Contractingcountry':CountryHeaders,
  'state':StateHeaders,
  'city':CityHeaders,
  'Cbu':CbuHeaders,
  'SlBdmValue' : SlBdmHeaders,
  'account':  accountFinderHeader,
  'leaddetails' : leadDetailsHeader,
  'campaign' : CampaignHeader,
  'event' : EventHeader,
  'OriginatingLead' : OriginatingLeadHeaders,
  'CompanyEntity':CompanyEntityHeaders,
}

export const opportunityAdvnNames = {
  'DecisionMakers' : {name :'Decision makers' , isCheckbox : true,isAccount : false },
  'SapCode':{name :'SAP code' , isCheckbox : false,isAccount : false },
  'AdvisorName':{name :'Advisor' , isCheckbox : false,isAccount : false },
  'Currency':{name :'Currency' , isCheckbox : false,isAccount : false },
  'AdvisorContact':{name :'Advisor contact' , isCheckbox : false,isAccount : false },
  'PrimaryContact':{name :'Primary contact' , isCheckbox : false,isAccount : false },
  'Vertical_Owner':{name :'Vertical sales owner' , isCheckbox : false,isAccount : false },
  'Contractingcountry':{name :'Contracting country' , isCheckbox : false,isAccount : false },
  'state':{name :'State' , isCheckbox : false,isAccount : false },
  'city':{name :'City' , isCheckbox : false,isAccount : false },
  'Cbu':{name :'CBU' , isCheckbox : false,isAccount : false },
  'SlBdmValue':{name :'SL BDM' , isCheckbox : false,isAccount : false },
  'account': { name: 'Account', isCheckbox: false, isAccount: false },
  'leaddetails' : { name: 'Lead details', isCheckbox: false, isAccount: false },
  'campaign' : { name: 'Campaign', isCheckbox: false, isAccount: false },
  'event' : { name: 'Event', isCheckbox: false, isAccount: false },
  'OriginatingLead': { name: 'Originating lead', isCheckbox: false, isAccount: false },
  'CompanyEntity': { name: 'Company entity', isCheckbox: false, isAccount: false },
}

export const opportunityEndSales: any[] = [
  { name: 'oppId', title: 'Opportunity ID' },
  { name: 'oppName', title: 'Opportunity name' },
  { name: 'oppOwner', title: 'Opportunity owner' },
]
export const opportunityHeaders = {
  'opportunity' : opportunityEndSales,
}

export const opportunityNames = {
  'opportunity' : {name :'opportunity' , isCheckbox : false,isAccount : false } ,
}

//Advanced Look Up Code End*
@Injectable({
  providedIn: 'root'
})
export class OpportunitiesService {
     winReasonSave:boolean;
    initiateObButton:boolean=false;
    summaryOppTab:boolean=true;
    ordershow:boolean=false;
    proceedTocloseStart:boolean=false;
    orderpagestart:boolean=false;
    winreasonNavigate1:boolean=false;
    winreasonNavigate2:boolean=false;
    restTab:boolean=false;
  SLObjForCloud:Object = {};
  IPObjForCloud:Object = {};
  assignButton=false;
  opportunityId;
  opportunityName = '';
  sbuId: string = '68c4eb75-7250-e911-a830-000d3aa058cb';
  verticalId: string = '3a35f187-7250-e911-a830-000d3aa058cb';
  estDate: string;
  smartsearch:boolean=false;
  accountName: any;
  orderstatus: boolean;
  editProject: boolean;
  approvalStatus: boolean;
  uploadHidden: boolean;
  private uploadBehavior = new BehaviorSubject(null);
  uploadStatus = this.uploadBehavior.asObservable();
  //oppoverview form declarations start*
  //private proceedtoQualifyChanges = new Subject<{ tabChange: boolean }>();
  private estimatedDateChange = new Subject<{ estdate: string }>();
  private saveButtonStateChange = new Subject<{ enableSaveButton: boolean }>();
  //simple to normal deal
  private proceedtoNormal = new Subject<{ simpledeal: boolean }>();
//order created
private ordercreated = new Subject<{ ordersave: boolean }>();
//proceedtoclose done
private proceedtoclose = new Subject<{ closedone: boolean }>();
// public partialConversion = new Subject<{ partialconversion: boolean }>();
public partialConversion = new Subject();
//proceedtoclose done
private proceedtoclosetrue = new Subject<{ closestart: boolean }>();
// //for modify order for sumit subject
 private modifyorder = new Subject<{ modifyorder1: boolean }>();

//order submit and order summary call

private ordersubmited = new Subject<{ ordersubmit: boolean }>();
//order assigned to other person

private orderassignedother = new Subject<{ orderassigned: boolean }>();


//proceedtoclose

private ordertabStart = new Subject<{ ordertabenabled: boolean }>();

amendmentcreate:boolean=false;
  currentState; //: string = 'Create';
  subscription = new Subject();
  subscriptionMoreOptions = new Subject();
  subscriptionAccessRights=new Subject();
  subscriptionUser=new Subject();
  count = 0; //for showing stages
  createdDate;
  statecode;
  ProceedQualify: boolean = false;
  ordercreatesuccess: boolean = false;
  ordercreatesuccess1:boolean=false;
  modifyordervalue:boolean=false;
  savingSuccess:boolean;

  accessRight:boolean;
  ordersummarytab:boolean=true;
  wipro_pipelinestage =
  [
    { "Value": 184450000, "Label": "Create  " },
    { "Value": 184450001, "Label": "Qualify " },
    { "Value": 184450002, "Label": "Pursue  " },
    { "Value": 184450003, "Label": "Secure  " },
    { "Value": 184450004, "Label": "Close   " }]
  //oppoverview form declarations end*
  private CompetitorSave = new Subject<{ CompetitorData: boolean }>();
  //save button check for change

  navigateToOrder = new Subject<any>();


  //click on save
  private proceedtoSave = new Subject<{ saveCliked: boolean }>();
  constructor(   public datepipe: DatePipe,public matSnackBar: MatSnackBar,private EncrDecr: EncrDecrService,
    private apiService: ApiServiceUI, private apiServiceSprint1: ApiService, private apiServiceOpportunity: ApiServiceOpportunity) { }
  public uploadStatusChange(data) {
    this.uploadBehavior.next(data);
  }

  action: any;

  sendNavigateToOrder(navigateToOrder) {
    this.navigateToOrder.next({ navigateToOrder: navigateToOrder });
  }

  getNavigateToOrder(): Observable<any> {
    return this.navigateToOrder.asObservable();
  }

  displayerror(statuscode) {
    if (statuscode == 401) {
      this.throwError("Unauthorized login");
    }
    else if (statuscode == 400) {
      this.throwError("Bad request");
    }
    else if (statuscode == 403) {
      this.throwError("Access is forbidden to the requested page");
    }
    else if (statuscode == 404) {
      this.throwError("Resource not found");
    } else if (statuscode == 500) {
      this.throwError("Internal server error occured");
    } else {
      this.throwError("Internal server error occured");
    }
  }

  displayMessageerror(message) {
    this.throwError(message);
  }

  throwError(message) {
    this.matSnackBar.open(message, this.action, {
      duration: 6000
    });
  }




  // Competitor Save
  setCompetitorChanges(CompetitorData: boolean) {
    this.CompetitorSave.next({ CompetitorData: CompetitorData });
  }
  getCompetitorChanges(): Observable<any> {
    return this.CompetitorSave.asObservable();
  }

//submit approval and amendment need to call order summary api
setordersubmit(ordersubmit: boolean) {
  this.ordersubmited.next({ ordersubmit: ordersubmit });
}

clearordersubmit() {
  this.ordersubmited.next();
}
getordersubmit(): Observable<any> {
  return this.ordersubmited.asObservable();
}

  //when click on save

  setsaveCliked(saveCliked: boolean) {
    this.proceedtoSave.next({ saveCliked: saveCliked });
  }

  clearsaveCliked() {
    this.proceedtoSave.next();
  }
  getsaveCliked(): Observable<any> {
    return this.proceedtoSave.asObservable();
  }


  getAll(): Observable<any[]> {
    return this.apiService.get(routes.opportunityfinder);
  }

  getParentHeaderData(): Observable<any[]> {
    return of(opportunityFinderHeader);
  }

  getwiproLinkedAGP(): Observable<any[]> {
    return this.apiService.get(routes.wiproLinkedAGP);
  }

  getsearchpoa(): Observable<any[]> {
    return this.apiService.get(routes.searchpoa);
  }

  getPOAHolders(payload): Observable<any[]>{
    return this.apiService.post(routes.getPOAHolders, payload);
  }
//private modifyorder = new Subject<{ modifyorder1: boolean }>();
setmodifyorder(modifyorder1: boolean) {
  this.modifyorder.next({ modifyorder1: modifyorder1 });
}

clearmodifyorder() {
  this.modifyorder.next();
}
getmodifyorder(): Observable<any> {
  return this.modifyorder.asObservable();
}


//closedone
setproceedtoclose(closedone: boolean) {
  this.proceedtoclose.next({ closedone: closedone });
}

clearproceedtoclose() {
  this.proceedtoclose.next();
}
getproceedtoclose(): Observable<any> {
  return this.proceedtoclose.asObservable();
}
//ordersave
setordersave(ordersave: boolean) {
  this.ordercreated.next({ ordersave: ordersave });
}

clearordersave() {
  this.ordercreated.next();
}
getordersave(): Observable<any> {
  return this.ordercreated.asObservable();
}
//ordersave ordertrue
setordersave1(closestart: boolean) {
  this.proceedtoclosetrue.next({ closestart: closestart });
}

clearordersave1() {
  this.proceedtoclosetrue.next();
}
getordersave1(): Observable<any> {
  return this.proceedtoclosetrue.asObservable();
}
//order assign to another person private orderassignedother = new Subject<{ orderassigned: boolean }>();
setorderassign(orderassigned: boolean) {
  this.orderassignedother.next({ orderassigned: orderassigned });
}

clearorderassign() {
  this.orderassignedother.next();
}
getorderassign(): Observable<any> {
  return this.orderassignedother.asObservable();
}
//private ordertabStart = new Subject<{ ordertabenabled: boolean }>();
//order tab open
setordertab(ordertabenabled: boolean) {
    this.ordertabStart.next({ ordertabenabled: ordertabenabled });
  }

  clearordertab() {
    this.ordertabStart.next();
  }
  getordertab(): Observable<any> {
    return this.ordertabStart.asObservable();
  }
//isadvisor function or isteambuilder section true set partial access

setpartialAccess() {
  // partialconversion
  // this.partialConversion.next({ partialconversion: partialconversion });
  this.partialConversion.next();
}

teamSubscription = new Subject();
reloadTeamPage() {
  this.teamSubscription.next();
}
overviewSubscription = new Subject();
reloadoverviewpage() {
  this.overviewSubscription.next();
}
validateFormForSaveCall =new Subject();
CallOverviewPageToValidateForm(){
  this.validateFormForSaveCall.next();
}
clearpartialAccess() {
  this.partialConversion.next();
}
getpartialAccess(): Observable<any> {
  return this.partialConversion.asObservable();
}
   // sprint-7 table starts here

   getEmailHeaderData(): Observable<any[]> {
    return this.apiService.get(routes.emailLanding);
    // return of(emailHeader);
  }

  getPOAHolderHeaderData(): Observable<any[]> {
     return of(searchpoaheader);
  }
   // sprint-7 table ends here

  getwiproContact(): Observable<any[]> {

    var body = {

      "SearchText": ""
    }
    return this.apiServiceOpportunity.post(routes.wiproContact, body);
  }
  GetLossCategories() {

    var body = {
      "SearchText": ""
    }
    return this.apiServiceOpportunity.post(routes.GetLossCategory, body);
  }

  lossReason(data2): Observable<any> {
    var body = {
      "Guid": data2
    }
    return this.apiServiceOpportunity.post(routes.LossReason, body);
  }

  GetEndSalesCycleReason1(data): Observable<any> {
    var body = {
      "Statuscode": data
    }

    return this.apiServiceOpportunity.post(routes.GetEndSalesCycleReason, body);

  }
 getHelpDeskTrackOpp(oppid) {
    var body = {
        "SearchText": oppid
    }
    return this.apiServiceOpportunity.post(routes.gethelpDeskTrack, body);
   }

    getSolutionInsight(oppid) {
     var body = {
         "OpportunityNumber": oppid
     }
     return this.apiServiceOpportunity.post(routes.getSolutionUrl, body);
 }
 getClientSuccess(oppid) {
    var body = {
        "OpportunityNumber": oppid
    }
    return this.apiServiceOpportunity.post(routes.getClientSuccessUrl, body);
}
getRUCInsights(oppid) {
    var body = {
        "OpportunityNumber": oppid
    }
    return this.apiServiceOpportunity.post(routes.getRUCInsightsUrl, body);
}


getCaseStudies(oppid) {
    var body = {
        "OpportunityNumber": oppid
    }
    return this.apiServiceOpportunity.post(routes.getCaseStudySuccessUrl, body);
}

//  getSolutionAssetInsight(oppid) {
//      var body = {
//          "OpportunityNumber": oppid
//      }
//      return this.apiServiceOpportunity.post(routes.getSolutionAsset, body);
//  }

     getOppCloudValidationConfigs(){
    var body = null;
    return this.apiServiceOpportunity.post(routes.getOppCloudValidationConfigsUrl, body);
  }

  checkOppMandatoryAttribute(id,thankyou){
    var body = {
        "Guid": id,
        "SendThankYouNote":thankyou,
        "IsProceedToClose":false
      }
    return this.apiServiceOpportunity.post(routes.checkOppMandatoryAttributeUrl, body);
  }

  checkOppMandatoryAttributeOverview(obj){
    return this.apiServiceOpportunity.post(routes.checkOppMandatoryAttributeUrl, obj);
  }

  checkCityCount(id){
    var body = {
        "Guid": id
      }
    return this.apiServiceOpportunity.post(routes.checkCityCountUrl, body);
  }



  getEngModel(data){

   var body={
     "Id":data
   }

    return this.apiServiceOpportunity.post(routes.getEngModel, body);
  }



  getAdvisorContact(data1,data2) {

    var body = {
      "SearchText": data1.searchValue,
      "AccountId":data2

    }
    return this.apiServiceOpportunity.post(routes.getAdvisorContact, body);
  }


  getSap(obj){

   return this.apiServiceOpportunity.post(routes.getSap, obj);

  }



  getServiceLine(sbuId : string) {
    let body = {
      "Guid": sbuId
    }
    return this.apiServiceOpportunity.post(routes.serviceLineNew,body);

  }


  getPractice(data): Observable<any> {

    var body = {
      "GUID": data
    }
    return this.apiServiceOpportunity.post(routes.getPractice, body);
  }


  getSubPractice(data): Observable<any> {

    var body = {
      "PracticeId": data
    }
    return this.apiServiceOpportunity.post(routes.getSubPractice, body);
  }

  getSlBdm(data1, data2, data3) {
    var body = {
      "ServiceLineId": data1,
      "PracticeId": data2,
      "SubPracticeId": data3
    }
    return this.apiServiceOpportunity.post(routes.SlBdm, body);

  }






  getCurrency(data) {
    var body = {

      "SearchText": data.searchValue
    }

    return this.apiServiceOpportunity.post(routes.getCurrency, body);

  }



  getverticalSalesOwner(data1, data2, data3) {
    var body = {
      "SearchText": data1.searchValue,
      "Id": data2,
      "Guid": data3
    }
    return this.apiServiceOpportunity.post(routes.getverticalSalesOwner, body);
  }



  getLead(): Observable<any[]> {
    return this.apiService.get(routes.linkLead);
  }

  getleadActivities(): Observable<any[]> {
    return this.apiService.get(routes.leadActivities);
  }

  getserviceLineBDM(): Observable<any[]> {
    return this.apiService.get(routes.linkLead);
  }

  getAllOrder(): Observable<any[]> {
    return this.apiService.get(routes.orderfinder);
  }

  getOpportunitCompetitor(postBody: Object) {
    return this.apiServiceOpportunity.post(routes.getOpportunitCompetitor, postBody);
  }

  getAccountName1(data,accountId) {
    var body = {
      "SearchText": data.searchValue,
      "AccountId":accountId

    }

    return this.apiServiceOpportunity.post(routes.wiproContact, body);
    // dont changeeee.....
  }

  //Opprtunity overview form methods and API call start*
  getOppOverviewDetail(oppOverview: Object) {
    return this.apiServiceOpportunity.post(routes.getOppOverviewDetail, oppOverview);
  }
  getCompanyEntity(entity:Object){
   return this.apiServiceOpportunity.post(routes.getCompanyEntity, entity);
  }
  //save opportunity overview data API
  saveOpportunityData(saveData: Object) {
    return this.apiServiceOpportunity.post(routes.saveOpportunityData, saveData);
  }
  getCBUData(data) {
    return this.apiServiceOpportunity.post(routes.getCBUData,data);
  }
//won opp id wonOpportunity


getwonOpportunity(data) {
    return this.apiServiceOpportunity.post(routes.wonOpportunity,data);
  }

 getAdvisorData(advisorData: Object) {
    return this.apiServiceOpportunity.post(routes.getAdvisorData, advisorData);
  }
  addCBU(CBU:Object){
    return this.apiServiceOpportunity.post(routes.addCBU, CBU);
  }
  getAccountRelatedFiels(accountObject: Object) {
    return this.apiServiceOpportunity.post(routes.getAccountRelatedFiels, accountObject);
  }
  getRegionList(accountId){
    let obj={
        "AccountGUID":accountId
    }
    return this.apiServiceOpportunity.post(routes.getRegionList, obj);
  }
  getCountryForSap(data){
       let obj={
        "Id":data
    }
    return this.apiServiceOpportunity.post(routes.getCountryForSap, obj);
  }
  updateStageAPI(data){
   return this.apiServiceOpportunity.post(routes.updateStageAPI, data);
  }
  //Advisor Contact
  getContactList(data) {
    return this.apiServiceOpportunity.post(routes.getContactDetails, data);
  }

   //Conversations
  getActivities(data) {
    return this.apiServiceOpportunity.post(routes.getActivities, data);
  }
  //Linked Leads
  getLinkedLeads(data) {
    return this.apiServiceOpportunity.post(routes.getLinkedLeads, data);
  }
  //accountlist
  getAccountNameArray(data) {
    let obj = {
      "SearchText": data
    }
    return this.apiServiceSprint1.post(routes.getAccountList, obj);
  }
  getDomainTribe() {
    var body = {
      "SearchText": ""
    }
    return this.apiServiceOpportunity.post(routes.getDomainTribe, body);
  }
  getChapter(data) {
    var body = {
      "Id": data
    }
    return this.apiServiceOpportunity.post(routes.getChapter, body);
  }

  getTargetArea(data) {
    var body = {
      "Id": data
    }
    return this.apiServiceOpportunity.post(routes.getTargetArea, body);
  }

//simple to normal
setproceedtonormal(simpledeal: boolean) {
  this.proceedtoNormal.next({ simpledeal: simpledeal });
}

clearproceedtonormal() {
  this.proceedtoNormal.next();
}
getproceedtonormals(): Observable<any> {
  return this.proceedtoNormal.asObservable();
}

//proceed to qualify
  // setproceedtoQualifyChanges(tabChange: boolean) {
  //   this.proceedtoQualifyChanges.next({ tabChange: tabChange });
  // }

  // clearproceedtoQualifyChanges() {
  //   this.proceedtoQualifyChanges.next();
  // }
  // getproceedtoQualifyChanges(): Observable<any> {
  //   return this.proceedtoQualifyChanges.asObservable();
  // }

  //estimated closure date change check start

  setEstimatedDateCheck(estdate: string) {
    this.estimatedDateChange.next({ estdate: estdate });
  }
  clearEstimatedDateCheck() {
    this.estimatedDateChange.next();
  }
  getEstimatedDateCheck(): Observable<any> {
    return this.estimatedDateChange.asObservable();
  }

  //estimated closure date change check end
  //save button check
  setsaveButtonState(status: boolean) {
    this.saveButtonStateChange.next({ enableSaveButton: status });
  }

  clearsaveButtonState() {
    this.saveButtonStateChange.next();
  }
  getsaveButtonState(): Observable<any> {
    return this.saveButtonStateChange.asObservable();
  }
  getVerticalsalesOwnerList(verticalsalesOwner: Object) {
    return this.apiServiceOpportunity.post(routes.getverticalSalesOwnerAPI, verticalsalesOwner);  }

  deleteDecisionConatct(oppDecisionId:Object){
return this.apiServiceOpportunity.post(routes.deleteDecisionConatct, oppDecisionId);
}
deleteConversation(Guid:Object){
return this.apiServiceOpportunity.post(routes.deleteConversation, Guid);
}
deleteLeads(Guid:Object){
return this.apiServiceOpportunity.post(routes.deleteLeads, Guid);
}
getSapCode(sapObj:Object){
return this.apiServiceOpportunity.post(routes.getSapCode, sapObj);
}
getCurrencyData(currency:Object){
return this.apiServiceOpportunity.post(routes.getCurrencyData, currency);
}
getSource(){
   return this.apiServiceOpportunity.get(routes.getSource);
}
getLeadSource() {
  return this.apiServiceOpportunity.get(routes.getLeadSource);
}
getSAPCodeDetails(body) {
  return this.apiServiceOpportunity.post(routes.getSAPCodeDetails,body);
}
UploadSapCodeDoc(body) {
  return this.apiServiceOpportunity.post(routes.uploadSapCodeDoc,body);
}
createEmail(body) {
  return this.apiServiceOpportunity.post(routes.createEmail,body);
}
getRegion(body) {
  return this.apiServiceOpportunity.post(routes.getRegion,body);
}
getLeadSrcDtlsAdvisor() {
  return this.apiServiceOpportunity.get(routes.getLeadSrcDtlsAdvisor);
}

getLeadSrcDtlsAlliance() {
  return this.apiServiceOpportunity.get(routes.getLeadSrcDtlsAlliance);
}
getLeadSrcDtlsMarketing() {
  return this.apiServiceOpportunity.get(routes.getLeadSrcDtlsMarketing);
}
getLeadSrcDtlsSL() {
  return this.apiServiceOpportunity.get(routes.getLeadSrcDtlsSL);
}
getAdvAccountLookup(body) {
  return this.apiServiceOpportunity.post(routes.getAdvAccountLookup,body);
}
getCampaignData(body) {
  return this.apiServiceOpportunity.post(routes.getCampaignDataUrl,body);
}
getEventData(body) {
  return this.apiServiceOpportunity.post(routes.getEventData,body);
}
getOriginatingLead(body) {
  return this.apiServiceOpportunity.post(routes.getOriginatingLead,body);
}
getDigitalBigBets(){
   return this.apiServiceOpportunity.get(routes.getDigitalBigBets);
}
getSLBDMDataAPI(body: any): Observable<any> {
  return this.apiServiceOpportunity.post(routes.getSLBDMList, body);
}
getCountryList(data) {
    return this.apiServiceOpportunity.post(routes.getCountryList, data);
  }
getStateList(data) {
    return this.apiServiceOpportunity.post(routes.getStateList, data);
  }
 getCityList(data) {
    return this.apiServiceOpportunity.post(routes.getCityList, data);
  }
  getUserID_DA(data){
  return this.apiServiceOpportunity.post(routes.getUserID_DA, data);  
}
getEmailID_DA(data){
return this.apiServiceOpportunity.post(routes.getEmailID_DA, data);
}
  getWiproAGPData(data){
    console.log("accountid",data)
    let body =
    {
      "AccountId":data
      }
      
  return this.apiServiceOpportunity.post(routes.getWiproAGP,body);
}
getStaffingDetails(data){
  return this.apiServiceOpportunity.post(routes.getStaffingDetails,data);
}
deleteAGP(data){
  return this.apiServiceOpportunity.post(routes.deleteAGP, data);
}
getAllViewQuery(obj){
  return this.apiServiceOpportunity.post(routes.getAllViewQuery, obj);
}
deleteViewQuery(obj){
  return this.apiServiceOpportunity.post(routes.deleteViewQuery, obj);
}
getAdvisorName(data) {
    return this.apiServiceOpportunity.post(routes.getAdvisorName, data);
  }
//Opportunity overview form methods and API call end*
getCurrencyStatus(status){
  var data={
    "Guid":status
  }
  console.log(data);
  return this.apiServiceOpportunity.post(routes.getCurrencyStatus,data);
}
//additional solution and IP details method start*
getAdditionalIpDetails(Guid:Object){
return this.apiServiceOpportunity.post(routes.getAdditionalIpDetails, Guid);
}
getCloudDetailsIp(Guid:Object){
return this.apiServiceOpportunity.post(routes.getCloudDetailsIp, Guid);
}
saveAdditionalIpDetails(saveIpObject:Object){
return this.apiServiceOpportunity.post(routes.saveAdditionalIpDetails, saveIpObject);
}
saveIpCloudDetails(saveIpCloudObject:Object){
return this.apiServiceOpportunity.post(routes.saveIpCloudDetails, saveIpCloudObject);
}
deleteIpAdditionDetails(deleteObj:Object){
return this.apiServiceOpportunity.post(routes.deleteIpAdditionDetails, deleteObj);
}
getAdditionalSolutionDetails(Guid:Object){
return this.apiServiceOpportunity.post(routes.getAdditionalSolutionDetails, Guid);
}
getServiceLineCloud(Guid:Object){
return this.apiServiceOpportunity.post(routes.getServiceLineCloud, Guid);
}
saveServiceLineDetail(data:Object){
 return this.apiServiceOpportunity.post(routes.saveServiceLineDetail, data);
}
getFunction(){
   return this.apiServiceOpportunity.get(routes.getFunction);
}
getCategory(){
   return this.apiServiceOpportunity.get(routes.getCategory);
}
getServiceProvider(){
   return this.apiServiceOpportunity.get(routes.getServiceProvider);
}
getTechnology(){
   return this.apiServiceOpportunity.get(routes.getTechnology);
}

//additional solution and IP details method end*
 public stageSave() {

        this.subscription.next();

    }
    public moreOptions() {

        this.subscriptionMoreOptions.next();

    }
    public accessRights() {

      this.subscriptionAccessRights.next();

  }

  public userDataa () {

    this.subscriptionUser.next();
  }
  getAccountName(data) {
    debugger;
    var body = {
      "SearchText": data.searchValue
    }

    return this.apiServiceOpportunity.post(routes.getAdvisorName, body);

  }


  getAccountNameOnSelect(data,userGuid) {
    var body = {
      "AccountId": data,
      "UserGuid": userGuid

    }

    return this.apiServiceOpportunity.post(routes.getAccountNameOnSelect, body);

  }


  getCustomerDMaiker(data) {

    // var body = {
    //     "SearchText": data
    //   }
    return this.apiServiceOpportunity.post(routes.getCustomerDMaiker, data);

  }


  getCbuList(data) {

    var body = {
      "SearchText": "",
      "AccountId": data
    }
    return this.apiServiceOpportunity.post(routes.getCbuList, body);

  }
  GetBFMApprovedOrderList(oppNaNo, orderNo, accId,pageNo, pageSize,searchOppo) {

    var body = {

      "OrderNumber": orderNo,
      "OrderStatus": "",
      "OpportunityNumber": oppNaNo,
      "OpportunityName": "",
      "AccountId": accId,
      "page": pageNo,
      "count": pageSize,
       "SearchText": searchOppo
    }

    return this.apiServiceOpportunity.post(routes.GetBFMApprovedOrderList, body);

  }

getRenewalOpp( orderNumber,data1, data2,data3,data4,ownerName,OwnerEmailID) {

    var body = {
      "PrimaryOrderId":orderNumber ,
      "PrimaryOppId": data2,
      "OppType":data3,
      "UserId":data4,
      "OwnerName":ownerName,
      "OwnerEmailId":OwnerEmailID,
      PrimaryOrderGuid:data1
    }

    return this.apiServiceOpportunity.post(routes.getRenewal, body);

  }

  getRenewal(orderNumber,data1, data2,data3,data4,ownerName,OwnerEmailID) {



    var body = {
  "PrimaryOrderId": orderNumber,
  "PrimaryOppId": data2,
  "OppType": 3,
  "UserId": data4,
  "OwnerName": ownerName,
  "OwnerEmailId": OwnerEmailID,
  "PrimaryOrderGuid": data1
}

    return this.apiServiceOpportunity.post(routes.getRenewal, body);

  }



  deleteOpportunitCompetitor(postBody: Object) {
    return this.apiServiceOpportunity.post(routes.deleteOpportunitCompetitor, postBody);
  }

  searchOpportunitCompetitor(postBody: Object) {
    return this.apiServiceOpportunity.post(routes.searchOpportunitCompetitor, postBody);
  }
  
  getDefaultCompetitorDisable(num) {
    var body = {
      "Status Code": num
    }
    return this.apiServiceOpportunity.post(routes.getDefaultCompetitorDisableUrl, body);
  }

  saveOpportunityCompetitor(postBody: Object) {
    return this.apiServiceOpportunity.post(routes.saveOpportunityCompetitor, postBody);
  }

  saveIpData(postBody: Object) {
    return this.apiServiceOpportunity.post(routes.saveIpData, postBody);
  }
  saveServiceLineDetailIndividual(postBody: Object){
    return this.apiServiceOpportunity.post(routes.saveServiceLineDetailIndividual, postBody);
  }

  //Services for Business Solutions Page by Sumit

  saveBusinessSolution(SaveBody:Object){
    return this.apiServiceOpportunity.post(routes.saveBusinessSolutionUrl, SaveBody);

  }

  saveCIOData(SaveBody:Object){
    return this.apiServiceOpportunity.post(routes.saveCIOUrl, SaveBody);

  }
  // ***********************************************************TCV Pop Up Api's****************************************//


  getChangeOccured() {
    return this.apiServiceOpportunity.get(routes.getChangeOccuredUrl);
  }

  getBusinessSolutionTCVPopUp(OppId: string) {
    let body = {
      "Guid": OppId,
    }
    return this.apiServiceOpportunity.post(routes.getTCVPopUpUrl, body);
  }

  saveBusinessSolutionTCVPopUp(Savebody: Object) {
    return this.apiServiceOpportunity.post(routes.saveTCVPopUpUrl, Savebody);
  }
  // ***********************************************************Business Solution Panel Api's****************************************//
  getBusinessSolutionPanel(OppId: string) {
    let body = {
      "Guid": OppId,

    }
    return this.apiServiceOpportunity.post(routes.getBusinessSolutionPanelUrl, body);
  }
  

  getDataForComparison(OppId: string,PricingId: string)
  {
    let body = {
        "PricingId":PricingId,
        "Id":OppId
        }
    return this.apiServiceOpportunity.post(routes.getTCVComparisonData, body);
  }

  deleteSLSolution(Id: string, SearchText: string) {
    let body = {
      Guid: Id,
      SearchText: SearchText
    }
    return this.apiServiceOpportunity.post(routes.deleteSLIPSolutionUrl, body);
  }

  deleteIp(IpId: string, SearchText: string,remarks) {
    let body = {
      Guid: IpId,
      SearchText: SearchText,
      statecode:1,
      statuscode:2,
      wipro_remarks:remarks
    }
    return this.apiServiceOpportunity.post(routes.deleteSLIPSolutionUrl, body);
  }



  // ***********************************************************Service Line Api's****************************************//
  getSLSLBDM(serviceLineId: string, practiceId: string, subPracticeId: string) {
    let body = {
      "ServiceLineId": serviceLineId,
      "PracticeId": practiceId,
      "SubPracticeId": subPracticeId,

    }
    return this.apiServiceOpportunity.post(routes.IpSLBDMUrl, body);
  }

  getSLSubPractice(PracticeId: string) {
    let body = {
      "PracticeId": PracticeId
    }
    return this.apiServiceOpportunity.post(routes.SLSubpracticeUrl, body);
  }

  getEngagementModelData(servicelineId: string) {
    let body = {
      "Id": servicelineId
    }
    return this.apiServiceOpportunity.post(routes.EngagementModelUrl, body);
  }

  getDualCredit() {
    return this.apiServiceOpportunity.get(routes.dualCreditUrl);
  }


  // ***********************************************************Ip Api's****************************************//
  getIpandHolmes(searchText: string) {
    debugger;
    let body = {
      "SearchText": searchText
    }
    return this.apiServiceOpportunity.post(routes.IpDropDownUrl, body);
  }
  getIpandHolmesBDM(holmesObj: Object) {
    return this.apiServiceOpportunity.post(routes.IPHolmesBDMAPI, holmesObj);
  }

  getIpModule(IpproductId: string, searchText: string) {
    let body = {
      "Guid": IpproductId,
      "SearchText": searchText
    }
    return this.apiServiceOpportunity.post(routes.IpModuleUrl, body);
  }
  getIpPractice(IpServiceLineId: string) {
    let body = {
      "Guid": IpServiceLineId
    }
    return this.apiServiceOpportunity.post(routes.IpPracticeUrl, body);
  }
  getIpSLBDM(serviceLineId: string, practiceId: string) {
    let body = {
      "ServiceLineId": serviceLineId,
      "PracticeId": practiceId,
    }
    return this.apiServiceOpportunity.post(routes.IpSLBDMUrl, body);
  }
  getIpServiceLine() {
    return this.apiServiceOpportunity.get(routes.IpServiceLIneUrl);
  }
     getIpServiceLineUpdated(obj) {
    return this.apiServiceOpportunity.post(routes.IpServiceLIneUrlUpdated,obj);
  }
  // ***********************************************************Solutions Api's****************************************//
  getSolutonTypeName(searchText: string) {
    let body = {
      "SearchText": searchText
    }
    return this.apiServiceOpportunity.post(routes.SolutionNameTypeUrl, body);
  }

  getOtherTypeName(SearchText: string, SearchType: string) {
    let body = {
      SearchText: SearchText,
      SearchType: SearchType
    }
    return this.apiServiceOpportunity.post(routes.SolutionOtherNameTypeUrl, body);
  }

  getsolutionBDM(SearchText: string) {
    let body = {
      SearchText: SearchText
    }
    return this.apiServiceOpportunity.post(routes.SolutionBDMNameUrl, body);
  }

  getServiceType(){
    return this.apiServiceOpportunity.get(routes.serviceTypeUrl);
  }

  getInfluenceType(){
    return this.apiServiceOpportunity.get(routes.InfluenceTypeUrl);
  }


  getSolutionType(){
    return this.apiServiceOpportunity.get(routes.solutionTypeUrl);
  }
  getOwner(body)
  {
      return this.apiServiceOpportunity.post(routes.getOwnerForSolution,body);
  }


  // ***********************************************************Solutions Api's End****************************************//
  // ***********************************************************Creadit Allocation Api's****************************************//

  getCreditType(){
    return this.apiServiceOpportunity.get(routes.creditTypeUrl);
  }

  getBusinessSolutions(OppId: string) {
    let body = { "Guid": OppId }
    return this.apiServiceOpportunity.post(routes.getBusinessSolutionsUrl, body);
  }



  deleteCreditAllocation(CreditAllocationId: string) {
    let body = { CreditAllocationId: CreditAllocationId };
    return this.apiServiceOpportunity.post(routes.deleteCreaditAllocationUrl, body);
  }

  getCreditAllocation(OppId: string) {
    let body = { Oppid: OppId };
    return this.apiServiceOpportunity.post(routes.getCreditAllocationDetails, body);
  }


  getserviceLineCA(OppId: string) {
    let body = {
      "OpportunityID": OppId
    }
    return this.apiServiceOpportunity.post(routes.getServiceLineUrl, body);
  }
  getPracticeCA(OppId: string, SLId: string) {
    let body = {
      "OpportunityID": OppId,
      "ServicelineId": SLId

    }
    return this.apiServiceOpportunity.post(routes.getPracticeUrl, body);
  }

  getSubPracticeCA(OppId: string, SLId: string, PracId: string) {
    let body = {
      "OpportunityID": OppId,
      "ServicelineId": SLId,
      "PracticeId": PracId

    }
    return this.apiServiceOpportunity.post(routes.getSubpracticeUrl, body);
  }

  getServiceLineBDMVerticalCA(SearchText: string) {
    let body = {
      "SearchText": SearchText
    }

    return this.apiServiceOpportunity.post(routes.getServiceLineBDMVerticalUrl, body);
  }

  getServiceLineBDMSLCA(ServiceLineID: string, PracticeID: string, SubPracticeID: string, SearchText: string) {
    let body = {
      "ServiceLineID": ServiceLineID,
      "PracticeID": PracticeID,
      "SubPracticeID": SubPracticeID,
      "SearchText": SearchText
    }

    return this.apiServiceOpportunity.post(routes.getServiceLineBDMSlUrl, body);
  }

  // ***********************************************************Creadit Allocation Api's****************************************//

  //End of Services for Business Solutions Page by Sumit


  //  accountNameData(data) {
  //   let obj = {
  //     "SearchText": data.searchValue

  //   }
  //   return this.apiServiceSprint1.post(routes.accountNameData, obj);
  // }


  // alliance(data) {
  //   let obj = {
  //     "SearchText": data.searchValue,
  //     "SearchType": 6
  //   }
  //   return this.apiServiceOpportunity.post(routes.alliance, obj);
  // }

  serviceLines() {

    return this.apiServiceOpportunity.get(routes.serviceLines);
  }

  practice(data) {
    let obj = {
      "SearchText": "",
      "Guid": data
    }
    return this.apiServiceOpportunity.post(routes.practice, obj);
  }
  vertical() {

    return this.apiServiceOpportunity.get(routes.vertical);
  }

  subVertical(data) {

    let body = {

      "Guid": data
    }

    return this.apiServiceOpportunity.post(routes.subVertical, body
    );
  }




  geo() {

    return this.apiServiceOpportunity.get(routes.geo);
  }

  region(data) {

    let body = {
      "Guid": data
    }

    return this.apiServiceOpportunity.post(routes.region, body);
  }

  tableData(body) {

    return this.apiServiceOpportunity.post(routes.tableData, body);

  }


  competitor() {
    let body = { "SearchText": "%" };
    return this.apiServiceOpportunity.post(routes.competitor, body);
  }

 checkAccess(accountId){
  let body= {"Guid":accountId,
  "UserGuid": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip') }
return this.apiServiceOpportunity.post(routes.checkAccess,body);
}

  getTemplate(data) {
    let body = { "SearchText": data }
    return this.apiServiceOpportunity.post(routes.getTemplate, body);
  }

  opportunityConfirm(body) {
    return this.apiServiceOpportunity.post(routes.confirmApi, body);
  }
  accountConfirm(body) {
    return this.apiServiceOpportunity.post(routes.confirmApi, body);
  }

  profileSummary(body) {
    return this.apiServiceOpportunity.post(routes.profileSummary, body);
  }

  saveProbability(body) {
    return this.apiServiceOpportunity.post(routes.saveProbability, body);
  }
manualProbability(){
return this.apiServiceOpportunity.get(routes.manualProbability);
}
forecastData(){
return this.apiServiceOpportunity.get(routes.forecastData);
}
  forexValue(body) {
    return this.apiServiceOpportunity.post(routes.forexValue, body);
  }

  activityData(body) {
    return this.apiServiceOpportunity.post(routes.activityData, body);
  }

  leadData(body) {
    return this.apiServiceOpportunity.post(routes.leadData, body);

  }

  // activityDataModal(body) {
  //   return this.apiServiceOpportunity.post(routes.activityDataModal, body);

  // }

  leadDataModal(body) {
    return this.apiServiceSprint1.post(routes.leadDataModal, body);
  }


  deleteActivityData(body) {
    return this.apiServiceOpportunity.post(routes.deleteActivityData, body);
  }
  getDealDashboardData(postBody: Object) {
    return this.apiServiceOpportunity.post(routes.getDealDashboardData, postBody);
  }



  deleteLeadData(body) {
    return this.apiServiceOpportunity.post(routes.deleteLeadData, body);
  }

  saveActivty(body) {
    return this.apiServiceOpportunity.post(routes.saveActivty, body);
  }


  saveLead(body) {
    return this.apiServiceOpportunity.post(routes.saveLead, body);
  }

  estimateCloseDate(body) {
    return this.apiServiceOpportunity.post(routes.estimateCloseDate, body);
  }

  searchOwner(body) {
    return this.apiServiceOpportunity.post(routes.searchOwner, body);
  }

  saveAssign(body) {
    return this.apiServiceOpportunity.post(routes.saveAssign, body);
  }
  saveSuspend(body) {

    return this.apiServiceOpportunity.post(routes.saveSuspend, body);
  }
  estimate(body) {
    return this.apiServiceOpportunity.post(routes.estimate, body);
  }

  reopenSave(body) {
    return this.apiServiceOpportunity.post(routes.reopenSave, body);
  }

  reopenSavee(body) {
    return this.apiServiceOpportunity.post(routes.reopenSavee, body);
  }


   //************************* end sales end here*/

  ///*************************************** */
  isAccount : boolean =  false;

  // Please use the global function written in global.service.ts file
  // setHeaderPixes(length,isAccount): string {
  //     this.isAccount = false;
  //     if(length == 5){
  //         return '775px'
  //     }
  //     else if(length == 4) {
  //         return '952px'
  //     }
  //     else if (length == 3) {
  //         this.isAccount = isAccount;
  //        return '727px'
  //     }
  //     else if( length == 2){
  //         this.isAccount = isAccount;
  //        return '500px'
  //    }
  //   }


    //*********** advance look up */
  // resp;
// wiproeventtype;
getopportynityEndSalesData(data) : Observable<any> {

  console.log("opp end sales: ",data);

  debugger;
    if (data.isService) {
      let body = {
          "SearchText": data.useFullData.searchVal,
          "PageSize": data.useFullData.recordCount,
          "OdatanextLink": data.useFullData.OdatanextLink,
          "RequestedPageNumber": data.useFullData.pageNo,
          "Guid": data.accID,
          "OpportunityID":data.oppID
      }
    var accId=data.accID;
    var oppID=data.oppID;
    return this.getCampaign(body, accId, oppID).pipe(switchMap(res=>{
      debugger;
      if (res) {
        console.log(res)

          return of((res.IsError== false) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterCampaignEvent(res.ResponseObject):[] } : [])

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


            // var x1= {...x,
            //   'oppId': (x.OpportunityNumber) ? x.OpportunityNumber : '',
            //   'oppName' : (x.Name) ? x.Name : '',
            //   'oppOwner' : (x.OwnerIdName) ? x.OwnerIdName : '',
            //   'oppNumber': (x.OpportunityNumber) ? x.OpportunityNumber : '',
            //   'ownerId': (x.OwnerIdValue) ? x.OwnerIdValue : '',
            //   'id': (x.OpportunityId) ? x.OpportunityId : '',
            //   }
            // console.log("x1: ",x1);
              return {...x,
                'oppId': (x.OpportunityNumber) ? x.OpportunityNumber : '-',
                'oppName' : (x.Name) ? x.Name : '-',
                'oppOwner' : (x.OwnerIdName) ? x.OwnerIdName : '-',
                'oppNumber': (x.OpportunityNumber) ? x.OpportunityNumber : '-',
                'ownerId': (x.OwnerIdValue) ? x.OwnerIdValue : '-',
                'Id': (x.OpportunityId) ? x.OpportunityId : '-',
              }
          })
      } else {
          return of([])
      }
  } else {
      return of([])
  }
}


  // ***** advance look up ends *******
  getCampaign(data,accID,oppID) {

    console.log(data);

    var body;
    console.log("typeOf: ", typeof data);
    var dataType = typeof data;
    if( dataType =="string"){
       body = { "SearchText": data,
                "PageSize":"10",
                "RequestedPageNumber":"1",
                "OdatanextLink": "",
                "Guid":accID,//  account id
                "OpportunityID":oppID
      }
      console.log("campainObj : ", body);
    }
    else if( dataType == "object"){
      body = data;
      console.log("campainObj : ", body);
    }

    // var body = {
    //   "SearchText": data,
    //   "PageSize": "10",
    //   "RequestedPageNumber": "1",
    //   "OdatanextLink": null
    // }
    return this.apiServiceOpportunity.post(routes.getCampaignData, body);
  }

  getEndSalesOpportuity(opportunityId) {
    // console.log(data);

    var body = {
      "Guid": opportunityId
    }
    return this.apiServiceOpportunity.post(routes.getEndSaleOpportunity, body);

  }

  createEndSalesRecord(body) {
    ///var body = body
    return this.apiServiceOpportunity.post(routes.createSaveEndSalesCycle, body);
  }

  createEndSalesRecord1(body) {
        ///var body = body
        return this.apiServiceOpportunity.post(routes.createSaveEndSalesCycle, body);
    }

  getOpportunityStatus(stage, reason, guid) {

    var body =
      {
        "SearchText": stage,
        "Statuscode": reason,
        "Guid": guid
      }
    return this.apiServiceOpportunity.post(routes.getOpportunityStatus, body);
  }



  updateLossOpportunity(status, opportunityId) {

    var body =
      {
        "Status": status,
        "OpportunityId": opportunityId
      }
    return this.apiServiceOpportunity.post(routes.updateLossOpportunity, body);
  }

  updateOpporStatus(opportunityId) {

    var body =
      {
        "Guid": opportunityId
      }
    return this.apiServiceOpportunity.post(routes.updateOpportunityStatus, body);
  }

    opportunityStatusOptionSet(){
      return this.apiServiceOpportunity.get(routes.opportunityStatusOptionSetUrl);
    }
    stateOptionSet(){
      return this.apiServiceOpportunity.get(routes.opportunityStateCodeOptionUrl);
    }

    decisionTakenOptionSet(){
      return this.apiServiceOpportunity.get(routes.opportunityDecisionTakenOptionSetUrl);
    }

    informationSourceOptionSet(){
      return this.apiServiceOpportunity.get(routes.opportunityInformationSourceOptionSetUrl);
    }

    reasonValuesOptionSet(){
      return this.apiServiceOpportunity.get(routes.opportunityReasonValuesOptionSetUrl);
    }

    stageOptionSet(){
      return this.apiServiceOpportunity.get(routes.opportunityStagesUrl);
    }

    commentTypeOptionSet(){
      return this.apiServiceOpportunity.get(routes.opportunityCommentTypeOptionSetUrl);
    }
    wiproExcludedStageOptionSet(){
      return this.apiServiceOpportunity.get(routes.wiproExcludedOptionSetUrl);
    }
//************************* end sales end here*/
    //smart Search

    searchWithText(body){
      return this.apiServiceOpportunity.post(routes.searchUsingText,body);
    }
     //add allaince
    searchAllianceNameWithText(body){
      return this.apiServiceOpportunity.post(routes.searchUsingTextForAllaince,body);
    }

    getInfluenceTypeForalliance()
    {
      return this.apiServiceOpportunity.get(routes.getInfluenceTypeValues);
    }
    getServiceTypeForalliance()
    {
       return this.apiServiceOpportunity.get(routes.getServiceTypeValues);
    }
    getTCVForAlliance(body)
    {
       return this.apiServiceOpportunity.post(routes.getTCV,body);
    }
    saveAllianceData(body)
    {
      return this.apiServiceOpportunity.post(routes.saveAlliance,body);
    }



   setSession(keyName,value){
    //    var valuee=value;
    //    if(typeof(value) == "string"){
    //       valuee = JSON.parse( JSON.stringify(value) )
    //    }
    //    else{
    //       valuee = JSON.stringify(value)
    //    }

   return (sessionStorage.setItem(keyName,this.EncrDecr.set("EncryptionEncryptionEncryptionEn",JSON.stringify(value) , "DecryptionDecrip") ));
   }

   getSession(keyName){
     try{
 return JSON.parse( this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem(  keyName ), 'DecryptionDecrip'))
     }
     catch(e){
       return null;
     }
   }

clearSession(keyName){
  return sessionStorage.removeItem(keyName);
}


accessApi(AdvisorOwnerId){

  let body= {"OppId":  this.getSession('opportunityId') ,
   "UserId":this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
   AdvisorOwnerId:AdvisorOwnerId
 }

 return this.apiServiceOpportunity.post(routes.accessApi, body);
}



roleApi(){
 let body={"Guid":this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
}
   return this.apiServiceOpportunity.post(routes.roleApi, body);
}

roleAssignApi(userId){
 let body={"Guid": userId
}
   return this.apiServiceOpportunity.post(routes.roleApi, body);
}

// ipData(data){

//     let obj = {
//       "SearchText": data.searchValue,

//     }
//     return this.apiServiceOpportunity.post(routes.ipData, obj);


// }

getCloudDetails(body){

    return this.apiServiceOpportunity.post(routes.getCloudDetails, body);
  }

  //deliveryteam
  deliveryTeam(body): Observable<any> {
    return this.apiServiceOpportunity.post(routes.deliveryTeamApi, body);
  }


toolkitData(body){
  let obj =  {"Guid": body }
 return this.apiServiceOpportunity.post(routes.toolkit, obj);
}

//opportunity snapshot
getOpenRequests(body)
{
  let obj =  {"Guid": body }
  return this.apiServiceOpportunity.post(routes.getOpenRequests, obj);
}

getCoachDetails(body)
{
  let obj =  {"Guid": body }
  return this.apiServiceOpportunity.post(routes.getCoachDetails, obj);
}
//advance look up method start
         getCbuDetails(data) : Observable<any> {
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo,
            "AccountId":data.useFullData.Id
        }
       return this.getCBUData(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterCbu(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterCbu(data.data))
    }
  }
   filterCbu(data): Observable<any> {
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'Name' : (x.Name) ? x.Name : '-',
                      'AccountName':(x.AccountName) ? x.AccountName : '-',
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
  
    getCompanyEntityDetails(data) : Observable<any> {
        debugger;
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo,
        }
       return this.getCompanyEntity(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterEntity(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterEntity(data.data))
    }
  }
   filterEntity(data): Observable<any> {
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'CompanyName' : (x.CompanyName) ? x.CompanyName : 'NA',
                      'CompanyCode':(x.CompanyCode) ? x.CompanyCode : 'NA',
                      'Location': (x.Location) ? x.Location : 'NA',
                      'Name': (x.CompanyCode) ? x.CompanyCode : 'NA',
                      'Id':(x.wipro_companycodesid) ? x.wipro_companycodesid : '',
                  }
              })
          } else {
              return of([])
          }
      } else {
          return of([])
      }
  }
              getCityDetails(data) : Observable<any> {
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo,
            "Id":data.useFullData.stateId
        }
       return this.getCityList(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterCity(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterCity(data.data))
    }
  }
   filterCity(data): Observable<any> {
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'CountryName': (x.CountryName) ? x.CountryName : '-',
                      'MapName':(x.MapName) ? x.MapName : '-',
                      'Name' : (x.Name) ? x.Name : '-',
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
          getStateDetails(data) : Observable<any> {
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo,
            "Id":data.useFullData.countryId
        }
       return this.getStateList(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterState(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterState(data.data))
    }
  }
   filterState(data): Observable<any> {
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'MapName': (x.MapName) ? x.MapName : '-',
                      'Name' : (x.Name) ? x.Name : '-',
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
          getCountryDetails(data) : Observable<any> {
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo,
        }
       return this.getCountryList(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterCountry(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterCountry(data.data))
    }
  }
   filterCountry(data): Observable<any> {
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'CountryName': (x.CountryName) ? x.CountryName : '-',
                      'RegionName' : (x.RegionName) ? x.RegionName : '-',
                      'GeoName': (x.GeoName) ? x.GeoName : '-',
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
      getVerticalOwnerDetails(data) : Observable<any> {
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo,
            "VerticalID": data.useFullData.Vertical,
            "RegionidID":data.useFullData.RegionidID,
            "GEOGuid":data.useFullData.geography,
            "SBUGuid":data.useFullData.WiproSbu,
            "Guid":data.useFullData.Id
        }
       return this.getVerticalsalesOwnerList(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterVerticalOwner(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterVerticalOwner(data.data))
    }
  }
   filterVerticalOwner(data): Observable<any> {
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'Name': (x.UserName) ? x.UserName : '-',
                      'EmailID' : (x.EmailId) ? x.EmailId : '-',
                      'Id': (x.UserId) ? x.UserId : '',
                  }
              })
          } else {
              return of([])
          }
      } else {
          return of([])
      }
  }
        getPrimaryContactDetails(data) : Observable<any> {
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": 10,
            "OdatanextLink": null,
            "RequestedPageNumber": data.useFullData.pageNo,
            "Guid": data.useFullData.Id,
        }
       return this.getContactList(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterPrimaryContact(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterPrimaryContact(data.data))
    }
  }
   filterPrimaryContact(data): Observable<any> {
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                     'Name': (x.Name) ? x.Name : '-',
                      'AccountName' : (x.AccountName) ? x.AccountName : '-',
                      'Designation': (x.Designation) ? x.Designation : '-',
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

          getDecisionMakerData(data) : Observable<any> {
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": 10,
            "OdatanextLink": null,
            "RequestedPageNumber": data.useFullData.pageNo,
             "SearchType": 1,
              "Guid": data.useFullData.Id,

        }
       return this.getContactList(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterDecisionMakers(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterDecisionMakers(data.data))
    }
  }
   filterDecisionMakers(data): Observable<any> {
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'Name': (x.Name) ? x.Name : '-',
                      'AccountName' : (x.AccountName) ? x.AccountName : '-',
                      'Designation': (x.Designation) ? x.Designation : '-',
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

  getOriginatingLeadDetails(data) : Observable<any> {
              debugger;
      if (data.isService) {
        let body =  {
      "AccountId": data.useFullData.accountId,//"30C20B80-117E-E111-A9F2-001A643446E0",
      "SearchText": data.useFullData.SearchText,
      "PageSize": 10,
      "RequestedPageNumber": data.useFullData.pageNo,
      "OdatanextLink": data.useFullData.OdatanextLink
    }
       return this.getOriginatingLead(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterOriginatingLeads(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterOriginatingLeads(data.data))
    }
  }
filterOriginatingLeads(data): Observable<any> {
     debugger;
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'LeadName': (x.LeadName) ? x.LeadName : '-',
                      'Owner' : (x.OwnerName) ? x.OwnerName : '-',
                      'Id' : (x.LeadId) ? x.LeadId : ''
                  }
              })
          } else {
              return of([])
          }
      } else {
          return of([])
      }
  }

getEventDetails(data) : Observable<any> {
              debugger;
      if (data.isService) {
        let body = {
            "AccountId": data.useFullData.accountId,
            "SearchText": data.useFullData.SearchText,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo
        }
       return this.getEventData(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterCampaign(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterCampaign(data.data))
    }
  }
getCampaignDetails(data) : Observable<any> {
              debugger;
      if (data.isService) {
        let body = {
          "AccountId" : data.useFullData.accountId,
            "SearchText": data.useFullData.SearchText,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo
        }
       return this.getCampaignData(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterCampaign(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterCampaign(data.data))
    }
  }
   filterCampaign(data): Observable<any> {
     debugger;
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'CampaignCode': (x.CodeName) ? x.CodeName : '-',
                      'CampaignOwner': (x.OwnerId) ? x.OwnerId : '-',
                      'CampaignName' : (x.Name) ? x.Name : '-',
                      'Id' : (x.CampaignId) ? x.CampaignId : ''
                  }
              })
          } else {
              return of([])
          }
      } else {
          return of([])
      }
  }


  getLeadDetails(data) : Observable<any> {
              debugger;
      if (data.isService) {
        let body = {
            "SearchType" : data.useFullData.searchType,
            "SearchText": data.useFullData.SearchText,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo
        }
       return this.getAdvAccountLookup(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterLeadDetails(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterLeadDetails(data.data))
    }
  }
   filterLeadDetails(data): Observable<any> {
     debugger;
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      // 'accNumber': (x.SysNumber) ? x.SysNumber : 'NA',
                      'accountName' :  (x.Name) ? x.Name=this.getSymbol(x.Name) : '-',
                      'accountOwner': (x.MapName) ? x.MapName : '-',
                      'Id' : (x.SysGuid) ? x.SysGuid : ''
                  }
              })
          } else {
              return of([])
          }
      } else {
          return of([])
      }
  }


            getSapCodeData(data) : Observable<any> {
              debugger;
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo,
            "Id":data.useFullData.Id
        }
       return this.getSapCode( body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filtergetSapCode(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filtergetSapCode(data.data))
    }
  }
   filtergetSapCode(data): Observable<any> {
     debugger;
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'Name': (x.Name) ? x.Name=this.getSymbol(x.Name) : '-',
                      'WiproSapCustomerNumber' : (x.WiproSapCustomerNumber) ? x.WiproSapCustomerNumber : '-',
                      'WiproSapCompanyCode': (x.WiproSapCompanyCode) ? x.WiproSapCompanyCode : '-',
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
              getAdvisorDetails(data) : Observable<any> {
              debugger;
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "SearchType": 7,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo
        }
       return this.getAdvisorName(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filtergetAdvisorData(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filtergetAdvisorData(data.data))
    }
  }
   filtergetAdvisorData(data): Observable<any> {
     debugger;
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'Name': (x.Name) ? x.Name=this.getSymbol(x.Name) : '-',
                      'OwnerName' : (x.MapName) ? x.MapName : '-',
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
              getCurrencyDetails(data) : Observable<any> {
              debugger;
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": 10,
            "OdatanextLink": data.useFullData.OdatanextLink,
            "RequestedPageNumber": data.useFullData.pageNo
        }
       return this.getCurrencyData( body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterCurrency(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
      }))

     } else {
        return of(this.filterCurrency(data.data))
    }
  }
   filterCurrency(data): Observable<any> {
     debugger;
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'Name': (x.Name) ? x.Name=this.getSymbol(x.Name) : '-',
                      'Type' : (x.Type) ? x.Type=this.getSymbol(x.Type) : '-',
                      'SysNumber': (x.SysNumber) ? x.SysNumber : '-',
                      //'IsoCurrencyCode': (x.IsoCurrencyCode) ? x.IsoCurrencyCode : '',
                      'SysGuid': (x.SysGuid) ? x.SysGuid : '',
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
   getAdvisorContactDetails(data) : Observable<any> {
              debugger;
      if (data.isService) {
        let body = {
            "SearchText": data.useFullData.searchVal,
            "PageSize": 10,
            "OdatanextLink": null,
            "RequestedPageNumber": data.useFullData.pageNo,
            "Guid":data.useFullData.advisorSysGuid
        }
       return this.getContactList(body).pipe(switchMap(res=>{
        if (res) {
          console.log(res)
            return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterAdvisorContact(res.ResponseObject):[] } : [])
        } else {
            return of([])
        }
       }))

    } else {
        return of(this.filterAdvisorContact(data.data))
    }
  }
   filterAdvisorContact(data): Observable<any> {
     debugger;
      if (data) {
          if (data.length > 0) {
              return data.map(x => {
                  return {...x,
                      'Name': (x.Name) ? x.Name : '-',
                      'AccountName' : (x.AccountName) ? x.AccountName : '-',
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

 getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }


    getLookUpFilterData(data): Observable<any> {

        debugger
        switch (data.controlName) {
            case 'linkedLeads':
                return this.getLinkedLeadData(data)
             case 'alliances':
                return this.getAllianceFinderData(data)
                 case 'account':
                return this.getAccountData(data)
                 case 'IP':
                return this.getIpData(data)
                   case 'assign':
                return this.getAssignData(data)
                  case 'changeVer':
                return this.changeVerData(data)
                
                case 'changeNewVer':
                return this.changeNewVerData(data)
                case 'shareAssign':
                return this.getAssignData(data)
                   case 'linkedActivity':
                return this.getActivityData(data)
                  case 'DecisionMakers':
            return this.getDecisionMakerData(data);
            case 'SapCode':
            return this.getSapCodeData(data);
            case 'AdvisorName':
            return this.getAdvisorDetails(data);
            case 'Currency':
            return this.getCurrencyDetails(data);
            case 'AdvisorContact':
            return this.getAdvisorContactDetails(data);
             case 'PrimaryContact':
            return this.getPrimaryContactDetails(data);
             case 'Vertical_Owner':
            return this.getVerticalOwnerDetails(data);
            case 'Contractingcountry':
            return this.getCountryDetails(data);
            case 'state':
            return this.getStateDetails(data);
             case 'city':
            return this.getCityDetails(data);
             case 'Cbu':
            return this.getCbuDetails(data);
            case 'opportunity':
              return this.getopportynityEndSalesData(data);
            case 'SlBdmValue' :
              return this.getSLBDMDropDownList(data);
            case 'leaddetails' :
            return this.getLeadDetails(data);
            case 'campaign' :
            return this.getCampaignDetails(data);
             case 'event' :
            return this.getEventDetails(data);
            case 'OriginatingLead' :
            return this.getOriginatingLeadDetails(data);
            case 'CompanyEntity' :
            return this.getCompanyEntityDetails(data);
             default:
                return of([])

        }

    }

   getLinkedLeadData(data: any): Observable<any> {

debugger
        if (data.isService) {

            let body = {


     "Id": data.useFullData.Id,
     "Searchtext":data.useFullData.Searchtext?data.useFullData.Searchtext:'',
     "pagesize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
     "OdatanextLink":data.useFullData.OdatanextLink

            }




            return this.getLinkedLeadSearchData(body).pipe(switchMap(res => {

                if (res) {

                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnLinkedLeads(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnLinkedLeads(data.data))
        }
    }



getLinkedLeadSearchData(body): Observable<any>{


  return this.apiServiceOpportunity.post(routes.linkedLeadRoute, body);

}

   filterAdvnLinkedLeads(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {

                return data.map(x => {




                    return {
                        ...x,
                        'leadName': (x.Name) ? x.Name : '-',
                        'leadOwner': (x.OwnerName) ? x.OwnerName : '-',
                        'accountName': (x.AccountName) ? x.AccountName : '-',
                        'Id': (x.LeadGuid) ? x.LeadGuid : '',
                        'mapGuid':'',
                         'ownerr':(x.OwnerId) ? x.OwnerId : '-',
                         'ownerN':(x.OwnerName) ? x.OwnerName : '-',

                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }



   getAllianceFinderData(data: any): Observable<any> {

debugger
        if (data.isService) {

            let body = {



     "SearchText":data.useFullData.Searchtext?data.useFullData.Searchtext:'',
     "SearchType":6,
     "PageSize":10,
   "RequestedPageNumber":data.useFullData.RequestedPageNumber,
     "OdatanextLink":data.useFullData.OdatanextLink

            }


            return this.getAllianceFinderSearchData(body).pipe(switchMap(res => {

                if (res) {

                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnAllianceFinder(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnAllianceFinder(data.data))
        }
    }



getAllianceFinderSearchData(body): Observable<any>{


  return this.apiServiceOpportunity.post(routes.finderChangeAllianceLookup, body);

}

   filterAdvnAllianceFinder(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {

                return data.map(x => {




                    return {
                        ...x,
                        'accountName': (x.Name) ? x.Name=this.getSymboll(x.Name) : '-',
                        'accountOwner': (x.MapName) ? x.MapName : '-',
                        'Id':(x.SysGuid) ? x.SysGuid : '',

                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }




   getAccountData(data: any): Observable<any> {

debugger
        if (data.isService) {

            let body = {



     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
   "RequestedPageNumber":data.useFullData.RequestedPageNumber,
     "OdatanextLink":data.useFullData.OdatanextLink,
     IsFinder: data.useFullData.IsFinder?data.useFullData.IsFinder:undefined

            }


            return this.getAccountSearchData(body).pipe(switchMap(res => {

                if (res) {

                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnAccount(res.ResponseObject,data.isService) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnAccount(data.data,data.isService))
        }
    }



getAccountSearchData(body): Observable<any>{


  return this.apiServiceOpportunity.post(routes.finderAllianceLookup, body);

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

   filterAdvnAccount(data,isService): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {

                return data.map(x => {




                    return {
                        ...x,
                        'accountName': (x.Name) ? x.Name=  isService?this.getSymboll(x.Name):x.Name  : '-',
                        'accountOwner': (x.OwnerName) ? x.OwnerName : '-',
                        'vertical':(x.VerticalName) ? x.VerticalName : '-',
                        'region': (x.RegionName) ? x.RegionName : '-',
                        'Id':(x.SysGuid) ? x.SysGuid : '',
                        'sysNumber': (x.SysNumber) ? x.SysNumber : '-'

                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }

   getIpData(data: any): Observable<any> {

debugger
        if (data.isService) {

            let body = {

     "SearchText":data.useFullData.Searchtext?data.useFullData.Searchtext:'',
     "PageSize":10,
   "RequestedPageNumber":data.useFullData.RequestedPageNumber,
     "OdatanextLink":data.useFullData.OdatanextLink

            }


            return this.getIpSearchData(body).pipe(switchMap(res => {

                if (res) {

                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnIp(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnIp(data.data))
        }
    }



getIpSearchData(body): Observable<any>{


  return this.apiServiceOpportunity.post(routes.finderIpLookup, body);

}

   filterAdvnIp(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {

                return data.map(x => {




                    return {
                        ...x,
                        'name': (x.Name) ?x.Name=this.getSymboll(x.Name) : '-',
                        'type': (x.ProductTypeCodeName) ? x.ProductTypeCodeName : '-',
                         'owner':(x.WiproSoultionOwner) ? x.WiproSoultionOwner : '-',
                         'Id':(x.ProductId) ? x.ProductId : '',

                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }


   getAssignListData(data: any): Observable<any> {

debugger
        if (data.isService) {

   let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 6,
    "FilterSearchText" : data.useFullData.FilterSearchText,
      "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }

            return this.getAssignListSearchData(body).pipe(switchMap(res => {

                if (res) {

                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnListAssign(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnListAssign(data.data,1))
        }
    }


getAssignListSearchData(body): Observable<any>{


  return this.apiServiceOpportunity.post(routes.nameLookUp, body);

}


   filterAdvnListAssign(data,pageNo): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {

                return data.map((x,index) => {

                    return {
                        'name': (x.OpportunityOwnerName) ? x.OpportunityOwnerName : 'NA',
                         isDatafiltered:false ,
                        'id': x.OpportunityOwnerName?(x.OpportunityOwnerName).replace(/\s/g,''):''
                             }
                             
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }
}






   getAssignFinderData(data: any,sortId): Observable<any> {

debugger
        if (data.isService) {

            let body = {
      ...data.columnFIlterJson,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    "SearchOppo": data.SearchOppo,
     "pageNumber": data.useFullData.RequestedPageNumber,
    "pageCount": 10,
    "opportunityName": data.opportunityName,
    "opportunityNumber": data.opportunityNumber,
    "opportunityStatus": data.opportunityStatus,
    "serviceLineId": data.serviceLineId,
    "practiceId": data.practiceId,
    "verticalId": data.verticalId,
    "subVerticalId": data.subVerticalId,
    "geograpyId": data.geograpyId,
    "regionId": data.regionId,
    "accountName": data.accountName,
    "parrentAccountId": data.parrentAccountId,
    "accountNumber": data.accountNumber,
    "wiproAccountCompetitorId": data.wiproAccountCompetitorId,
    "wiproAllianceAccountId": data.wiproAllianceAccountId,
    "opportunityIpId": data.opportunityIpId,
    "UserId": data.UserId,
    'SortBy':sortId

            }


            return this.getAssignFinderSearchData(body).pipe(switchMap(res => {

                if (res) {

                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterFinderAdvnAssign(res.ResponseObject,sortId,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterFinderAdvnAssign(data.data,sortId,1))
        }
    }



getAssignFinderSearchData(body): Observable<any>{


  return this.apiServiceOpportunity.post(routes.getFOpportunityName, body);

}

   filterFinderAdvnAssign(data,sort,pageNo): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {
                if(sort==46){
                return data.map((x,index) => {
                 return {

                        'name': (x.Account) ? x.Account.OwnerName : 'NA',
                        'email': (x.Email) ? x.Email : '',
                        'Id': (x.ownerId) ? x.ownerId : '',
                       'id':(x.Account) ? (x.Account.OwnerName).replace(/\s/g,'') : '',
                        'Name':(x.FullName) ? x.FullName : '',
                        'ownerId':(x.ownerId) ? x.ownerId : ''
               }
                })}
              else{
                 return data.map(x => {
                 return {

                        'name': (x.OpportunityOwnerName) ? x.OpportunityOwnerName : 'NA',
                        'email': (x.Email) ? x.Email : '',
                        'Id': (x.ownerId) ? x.ownerId : '',
                        'id': (x.OpportunityOwnerId) ? x.OpportunityOwnerId : '',
                        'Name':(x.FullName) ? x.FullName : '',
                        'ownerId':(x.ownerId) ? x.ownerId : ''
               }
            })}



            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }




   getAssignRenewalData(data: any): Observable<any> {

debugger
        if (data.isService) {

     let body = {
    ...data.columnFIlterJson,
    "OrderNumber": data.OrderNumber,
    "OrderStatus": data.OrderStatus,
    "OpportunityNumber": data.OpportunityNumber,
    "OpportunityName": data.OpportunityName,
    "AccountId": data.AccountId,
    "page": data.useFullData.RequestedPageNumber,
    "count": 10,
    "SearchText": data.searchOppo,
    "FilterSearchText": data.useFullData.SearchText?data.useFullData.SearchText:'' ,
    "SortBy": 6
     }


            return this.getRenewalAssignSearchData(body).pipe(switchMap(res => {

                if (res) {

                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterRenewalAdvnAssign(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterRenewalAdvnAssign(data.data,1))
        }
    }



getRenewalAssignSearchData(body): Observable<any>{


  return this.apiServiceOpportunity.post(routes.renewalFilter, body);

}

   filterRenewalAdvnAssign(data,pageNo): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {

                return data.map((x,index) => {




                    return {

                        'name': (x.OrderOwner) ? x.OrderOwner : '',

                'id':(x.OrderOwner) ? (x.OrderOwner).replace(/\s/g,'') : '',
                         isDatafiltered:false ,

                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }


  changeNewVerData(data: any): Observable<any> {


        if (data.isService) {

        let body =
    {
    "Guid": data.useFullData.Guid,     
    "SearchText": data.useFullData.SearchText?data.useFullData.SearchText:'',
    "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "PageSize":10
    }

         



            return this.getNewchangeVerData(body).pipe(switchMap(res => {

                if (res) {

                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterchangeNewVerData(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterchangeNewVerData(data.data))
        }
    }


getNewchangeVerData(body): Observable<any>{


  return this.apiServiceOpportunity.post(routes.getNewchangeVerData, body);

}

   filterchangeNewVerData(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {

                return data.map(x => {




                    return {

                        'name': (x.Name) ? x.Name : '-',
                        'email': (x.EmailID) ? x.EmailID : '-',
                        'Id': (x.SysGuid) ? x.SysGuid : '',
                        'id': (x.SysGuid) ? x.SysGuid : '',
                        'Name': (x.Name) ? x.Name : '-',
                       'ownerId': (x.SysGuid) ? x.SysGuid : '',


                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }

  changeVerData(data: any): Observable<any> {


        if (data.isService) {

        let body =
    {
    "SearchText": data.useFullData.SearchText?data.useFullData.SearchText:'',
    "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "PageSize":10
    }


            return this.getchangeVerData(body).pipe(switchMap(res => {

                if (res) {

                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterchangeVerData(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterchangeVerData(data.data))
        }
    }


getchangeVerData(body): Observable<any>{


  return this.apiServiceOpportunity.post(routes.getchangeVerData, body);

}

   filterchangeVerData(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {

                return data.map(x => {




                    return {

                        'name': (x.fullname) ? x.fullname : '-',
                        'email': (x.internalemailaddress) ? x.internalemailaddress : '-',
                        'Id': (x.ownerid) ? x.ownerid : '',
                        'id': (x.ownerid) ? x.ownerid : '',
                       'Name': (x.fullname) ? x.fullname : '-',
                       'ownerId': (x.ownerid) ? x.ownerid : '',
                       


                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }


   getAssignData(data: any): Observable<any> {

debugger
        if (data.isService) {

            let body = {
     "Searchtext":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "SearchType":6,
     "PageSize":10,
   "RequestedPageNumber":data.useFullData.RequestedPageNumber,
     "OdatanextLink":data.useFullData.OdatanextLink

            }


            return this.getAssignSearchData(body).pipe(switchMap(res => {

                if (res) {

                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnAssign(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnAssign(data.data))
        }
    }



getAssignSearchData(body): Observable<any>{


  return this.apiServiceOpportunity.post(routes.assignLookup, body);

}

   filterAdvnAssign(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {

                return data.map(x => {




                    return {

                        'name': (x.FullName) ? x.FullName : '-',
                        'email': (x.Email) ? x.Email : '-',
                        'Id': (x.ownerId) ? x.ownerId : '',
                        'id': (x.ownerId) ? x.ownerId : '',
                        'Name':(x.FullName) ? x.FullName : '-',
                        'ownerId':(x.ownerId) ? x.ownerId : '',
                        'FullName':(x.FullName) ? x.FullName : '-',


                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }





   getActivityData(data: any): Observable<any> {

debugger
        if (data.isService) {

            let body = {
   "Id":data.useFullData.Id,
 "Searchtext":data.useFullData.Searchtext?data.useFullData.Searchtext:'',
     "pagesize":10,
   "RequestedPageNumber":data.useFullData.RequestedPageNumber,
     "OdatanextLink":data.useFullData.OdatanextLink


            }


            return this.getActivitySearchData(body).pipe(switchMap(res => {

                if (res) {

                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnActivity(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

        } else {
            return of(this.filterAdvnActivity(data.data))
        }
    }



getActivitySearchData(body): Observable<any>{


  return this.apiServiceOpportunity.post(routes.activityLookup, body);

}

   filterAdvnActivity(data): Observable<any> {
        debugger
        if (data) {
            if (data.length > 0) {

                return data.map(x => {




                    return {
                        ...x,
                        'name': (x.Subject) ? x.Subject : '-',
                        'owner': (x.OwnerName) ? x.OwnerName : '-',
                        'Id': (x.ActivityId) ? x.ActivityId : '',
                       'AppointmentOpportunityId':'',
                       'Name':(x.Subject) ? x.Subject : '-',
                         'ownerr':(x.OwnerId) ? x.OwnerId : '',
                         'ownerN':(x.OwnerName) ? x.OwnerName : '-',
                    }
                })
            } else {
                return of([])
            }
        } else {
            return of([])
        }

    }


opportunityQualifier(){
  return this.apiServiceOpportunity.get(routes.opportunityQualifier);

}

getRsStatus(body){
  return this.apiServiceOpportunity.post(routes.getRsStatus,body);

}
saveQualifier(body){
  return this.apiServiceOpportunity.post(routes.saveQualifier,body);

}

accessModifyApi(AdvisorOwnerId,email){

  let body= {"OppId":  this.getSession('opportunityId') ,
   "UserId":this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
   AdvisorOwnerId:AdvisorOwnerId,
    UserEmail :email
 }

 return this.apiServiceOpportunity.post(routes.accessApi, body);
}

getSLBDMDropDownList(data) : Observable<any> {
  if (data.isService) {
    let body =  {
    "SBUGuid": data.useFullData.sbuGuid,
    "ServiceLineID": data.useFullData.serviceLineId,
    "GEOGuid": data.useFullData.geoGuid,
    "VerticalID": data.useFullData.verticalId,
    "PracticeID": data.useFullData.practiceId,
    "RegionidID": data.useFullData.regionId,
    "SearchText": data.useFullData.searchVal,
    "PageSize": 10,
    "RequestedPageNumber": data.useFullData.pageNo,
    "OdatanextLink": data.useFullData.OdatanextLink
  }

   return this.getSLBDMDataAPI(body).pipe(switchMap(res=>{
    if (res) {
      console.log(res)
        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length>0)?this.filterSlBdmList(res.ResponseObject):[] } : [])
    } else {
        return of([])
    }
   }))

} else {
    return of(this.filterSlBdmList(data.data))
}
}

filterSlBdmList(data): Observable<any> {
  if (data) {
    if (data.length > 0) {
        return data.map(x => {
            return {
                'SysGuid': (x.SysGuid) ? x.SysGuid : '',
                'Name': (x.Name) ? x.Name : '-',
                'EmailID': (x.EmailID) ? x.EmailID : '-',
                'Id': (x.SysGuid) ? x.SysGuid : ''
            }
        })
    } else {
        return of([])
    }
} else {
    return of([])
}
}

checkSupervisor(body){
 return this.apiServiceOpportunity.post(routes.checkSupervisor, body);
}


// export const allopportunityheader: any[] = [
//     { SortId: 0,id: 1, isFilter:false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name',selectName: "Opportunitie"},
//     { SortId: 23,id: 2, isFilter:false, name: 'ID', isFixed: false, order: 2, title: 'ID', displayType:"upperCase"  },
//     { SortId: 26,id: 3, isFilter:false, name: 'Type', isFixed: false, order: 3, title: 'Type',isHideColumnSearch: true , displayType:"capsFirstCase" },
//     { SortId: 2,id: 4, isFilter:false, name: 'Account', isFixed: false, order: 4, title: 'Account',isLink:true ,className:'approvalstatus' },
//     { SortId: 6,id: 5, isFilter:false, name: 'Owner', isFixed: false, order: 5, title: 'Owner', displayType:"name" },
//     { SortId: 30,id: 6, isFilter:false, name: 'Stage', isFixed: false, order: 6, title: 'Stage',isHideColumnSearch: true , displayType:"capsFirstCase" },
//     { SortId: 31,id: 7, isFilter:false, name: 'Estclosuredate', isFixed: false, order: 7, title: 'Est. closure date',isHideColumnSearch: true, displayType:"date" },
//     { SortId: 25,id: 8, isFilter:false, name: 'Vertical', isFixed: false, order: 8, title: 'Vertical' },
//     { SortId: 27,id: 9, isFilter:false, name: 'EstTCV', isFixed: false, order: 9, title: 'Est. TCV ',isHideColumnSearch: true },
//     { SortId: 32,id: 10, isFilter:false, name: 'Currency', isFixed: false, order: 10, title: 'Currency' },
//     { SortId: 38,id: 11, isFilter:false, name: 'ProposalType', isFixed: false, order:11,title: 'Proposal type',isHideColumnSearch: true },
//     { id: 12, isFilter:false, name: 'Status', isFixed: false, order: 12, title: 'Status',isStatus:true,hideFilter: true,isSortDisable:true }
// ]

// ProposalTypeName
// TransactionCurrencyValue




//
//    manualProb
//   isHardClose
//    geoId
//    actualRev
//   Status
//    hardCloseDate
//    actualCloseDate
//    oppForecast


       getStatusReasonFilter(data: any): Observable<any> {
             let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 56,
    "FilterSearchText" : data.useFullData.FilterSearchText,
    "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
            return this.getStatusReasonDataFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterStatusReasonFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))


    }



getStatusReasonDataFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

   filterStatusReasonFilter(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {


                        'name': x.StatusReason?x.StatusReason:'NA',
                        isDatafiltered:false ,
                        'id':x.StatusReasonId || x.StatusReasonId==='0' || x.StatusReasonId=== 0?x.StatusReasonId:''
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
    }



       getmanualProbFilter(data: any): Observable<any> {
             let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":50,
     "RequestedPageNumber":1,
    "Statuscode": data.Statuscode,
     "SortBy": 57,
    "FilterSearchText" : data.useFullData.FilterSearchText,
    "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
            return this.getmanualProbDataFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filtermanualProbFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))


    }



getmanualProbDataFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

   filtermanualProbFilter(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {


                        'name': x.ManualProbabilityForFilters || x.ManualProbabilityForFilters === 0 || x.ManualProbabilityForFilters === '0'?x.ManualProbabilityForFilters:'NA',
                        isDatafiltered:false ,
                        'id':x.ManualProbabilityWining?x.ManualProbabilityWining:''
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
    }




       getisHardCloseFilter(data: any): Observable<any> {
             let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 53,
    "FilterSearchText" : data.useFullData.FilterSearchText,
    "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
            return this.getisHardDataCloseFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterisHardCloseFilter(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))


    }



getisHardDataCloseFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

   filterisHardCloseFilter(data,pageNo): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {
                    return {


                        'name': x.IsHardClosedValue?x.IsHardClosedValue:'NA',
                        isDatafiltered:false ,
                        'id':x.IsHardClosedValue?(x.IsHardClosedValue).replace(/\s/g,''):'',
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
    }


       geoIdFilter(data: any): Observable<any> {
             let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 39,
    "FilterSearchText" : data.useFullData.FilterSearchText,
    "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
            return this.getgeoIdCloseFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filtergeoIdFilter(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))


    }



getgeoIdCloseFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

   filtergeoIdFilter(data,pageNo): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {
                    return {


                        'name': x.GeographyName?x.GeographyName:'NA',
                        isDatafiltered:false ,
                          'id': x.GeographyName?(x.GeographyName).replace(/\s/g,''):'',
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
    }


  actualRevFilter(data: any): Observable<any> {
             let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 58,
    "FilterSearchText" : data.useFullData.FilterSearchText

            }
            return this.getactualRevFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filteractualRevFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))


    }



getactualRevFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

   filteractualRevFilter(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {


                        'name': x.Account?x.Account.Name:'NA',
                        isDatafiltered:false ,
                        'id':x.Account?x.Account.AccountId:''
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
    }


  statusFilter(data: any): Observable<any> {
             let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 7,
    "FilterSearchText" : data.useFullData.FilterSearchText,
    "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
            return this.getStatusFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filtergetStatusFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))


    }



getStatusFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

   filtergetStatusFilter(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {


                        'name': x.StateCode?x.StateCode:'NA',
                        isDatafiltered:false ,
                        'id':x.StateCodeId || x.StateCodeId===0 || x.StateCodeId === '0'?x.StateCodeId:''
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
    }


  hardCloseDateFilter(data: any): Observable<any> {
             let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 54,
    "FilterSearchText" : data.useFullData.FilterSearchText

            }
            return this.getCloseDateFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterCloseDateFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))


    }



getCloseDateFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

   filterCloseDateFilter(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {


                        'name': x.Account?x.Account.Name:'NA',
                        isDatafiltered:false ,
                        'id':x.Account?x.Account.AccountId:''
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
    }

  actualCloseDateFilter(data: any): Observable<any> {
             let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 55,
    "FilterSearchText" : data.useFullData.FilterSearchText

            }
            return this.getActualCloseDateFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterActualCloseDateFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))


    }



getActualCloseDateFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

   filterActualCloseDateFilter(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {


                        'name': x.Account?x.Account.Name:'NA',
                        isDatafiltered:false ,
                        'id':x.Account?x.Account.AccountId:''
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
    }


  oppForecastFilter(data: any): Observable<any> {
             let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 59,
    "FilterSearchText" : data.useFullData.FilterSearchText,

    "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
            return this.getForecastFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filtertForecastFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))


    }



getForecastFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

   filtertForecastFilter(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {


                        'name': x.Forecast?x.Forecast:'NA',
                        isDatafiltered:false ,
                        'id':x.ForecastId?x.ForecastId:''
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
    }





    getListConfigData(data): Observable<any>{
        switch (data.filterData.headerName) {

            case 'oppForecast':
               return this.oppForecastFilter(data)

            case 'actualCloseDate':
               return this.actualCloseDateFilter(data)

            case 'hardCloseDate':
               return this.hardCloseDateFilter(data)
            case 'Status':
               return this.statusFilter(data)

            case 'actualRev':
               return this.actualRevFilter(data)
            case 'geoId':
               return this.geoIdFilter(data)
            case 'isHardClose':
               return this.getisHardCloseFilter(data)
            case 'manualProb':
                return this.getmanualProbFilter(data)
            case 'statusReason':
                return this.getStatusReasonFilter(data)
           case 'Account':
                return this.getAccountDataFilter(data)
           case 'OpportunityName':
                return this.getNameFilter(data)
           case 'ID':
                return this.getIdFilter(data)
        //    case 'Estclosuredate':
        //         return this.getDateFilter(data)
           case 'Vertical':
                return this.AllVertical(data)
           case 'EstTCV':
                return this.getTcvFilter(data)
           case 'Type':
                return this.getTypeFilter(data)
           case 'Owner':
                return this.getAssignListData(data)
           case 'Stage':
               return this.FlistStage(data)
           case 'Currency':
                return this.getCurrencyLookUpData(data)
           case 'ProposalType':
                return this.getListProposalTypeFilter(data)
           default:
                return of([])
        }
    }




    getrenewalListConfigData(data): Observable<any>{
        switch (data.filterData.headerName) {
           case 'Order':
                return this.getRorderDataFilter(data)
           case 'Name':
                return this.getRnameFilter(data)
           case 'OpportunityID':
                return this.getRIdFilter(data)
           case 'Owner':
                return this.getAssignRenewalData(data)
           case 'Pricingtype':
                return this.getRpricingFilter(data)
           case 'Sap':
                return this.getRsapFilter(data)
           case 'Startdate':
                return this.getRendDateData(data,'startDate')
           case 'enddate':
                return this.getRendDateData(data,'endDate')
           case 'ProposalType':
                return this.getRenProposalTypeFilter(data)

           default:
                return of([])
        }
    }



FiltergetFCurrency(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {
                         'name':  this.getTcv(x.EstimatedTCV)  || this.getTcv(x.EstimatedTCV)==='0'? this.getTcv(x.EstimatedTCV) : 'NA',
                         isDatafiltered:false ,
                        'Name': x.EstimatedTCVvalue,
                        'id':x.OpportunityId?x.OpportunityId:''

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}

   getFCurrency(body){
   return this.apiServiceOpportunity.post(routes.getFOpportunityName ,body);
}





 FCurrency(data: any): Observable<any> {
          let body = {
       ...data.columnFIlterJson,
      "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    "SearchOppo": data.SearchOppo,
     "pageNumber": data.useFullData.RequestedPageNumber,
    "pageCount": 10,
    "opportunityName": data.opportunityName,
    "opportunityNumber": data.opportunityNumber,
    "opportunityStatus": data.opportunityStatus,
    "serviceLineId": data.serviceLineId,
    "practiceId": data.practiceId,
    "verticalId": data.verticalId,
    "subVerticalId": data.subVerticalId,
    "geograpyId": data.geograpyId,
    "regionId": data.regionId,
    "accountName": data.accountName,
    "parrentAccountId": data.parrentAccountId,
    "accountNumber": data.accountNumber,
    "wiproAccountCompetitorId": data.wiproAccountCompetitorId,
    "wiproAllianceAccountId": data.wiproAllianceAccountId,
    "opportunityIpId": data.opportunityIpId,
    "UserId": data.UserId,
   'SortBy':27
            }
            return this.getFCurrency(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.FiltergetFCurrency(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}

FiltergetFOpportunityNumber(data,pageNo){
    if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {

                    return {

                        'name': (x.OpportunityNumber) ? x.OpportunityNumber : 'NA',
                        isDatafiltered:false ,
                       'id':(x.OpportunityNumber) ? (x.OpportunityNumber).replace(/\s/g,'') : 'NA',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}

   getFOpportunityNumber(body){
   return this.apiServiceOpportunity.post(routes.getFOpportunityName ,body);
}






 FOpportunityNumber(data: any): Observable<any> {
          let body = {
    ...data.columnFIlterJson,
    "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    "SearchOppo": data.SearchOppo,
     "pageNumber": data.useFullData.RequestedPageNumber,
    "pageCount": 10,
    "opportunityName": data.opportunityName,
    "opportunityNumber": data.opportunityNumber,
    "opportunityStatus": data.opportunityStatus,
    "serviceLineId": data.serviceLineId,
    "practiceId": data.practiceId,
    "verticalId": data.verticalId,
    "subVerticalId": data.subVerticalId,
    "geograpyId": data.geograpyId,
    "regionId": data.regionId,
    "accountName": data.accountName,
    "parrentAccountId": data.parrentAccountId,
    "accountNumber": data.accountNumber,
    "wiproAccountCompetitorId": data.wiproAccountCompetitorId,
    "wiproAllianceAccountId": data.wiproAllianceAccountId,
    "opportunityIpId": data.opportunityIpId,
    "UserId": data.UserId,
   'SortBy':23
            }
            return this.getFOpportunityNumber(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.FiltergetFOpportunityNumber(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

}


FiltergetFOpportunityName(data,pageNo){
    if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {

                    return {

                        'name': (x.OpportunityName) ? this.getSymboll( x.OpportunityName) : 'NA',
                        isDatafiltered:false ,
                       'id':(x.OpportunityName) ? (x.OpportunityName).replace(/\s/g,'') : 'NA',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}

   getFOpportunityName(body){
   return this.apiServiceOpportunity.post(routes.getFOpportunityName,body);
}

FiltergetFGeographyName(data,pageNo){
if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {

                    return {

                        'name': (x.GeographyName) ? x.GeographyName : 'NA',
                        isDatafiltered:false ,
                        'id':(x.GeographyName) ? (x.GeographyName).replace(/\s/g,'') : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}

   getFGeographyName(body){
   return this.apiServiceOpportunity.post(routes.getFOpportunityName,body);
}

FGeographyName(data){
          let body = {
        ...data.columnFIlterJson,
       "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    "SearchOppo": data.SearchOppo,
     "pageNumber": data.useFullData.RequestedPageNumber,
    "pageCount": 10,
    "opportunityName": data.opportunityName,
    "opportunityNumber": data.opportunityNumber,
    "opportunityStatus": data.opportunityStatus,
    "serviceLineId": data.serviceLineId,
    "practiceId": data.practiceId,
    "verticalId": data.verticalId,
    "subVerticalId": data.subVerticalId,
    "geograpyId": data.geograpyId,
    "regionId": data.regionId,
    "accountName": data.accountName,
    "parrentAccountId": data.parrentAccountId,
    "accountNumber": data.accountNumber,
    "wiproAccountCompetitorId": data.wiproAccountCompetitorId,
    "wiproAllianceAccountId": data.wiproAllianceAccountId,
    "opportunityIpId": data.opportunityIpId,
    "UserId": data.UserId,
    "SortBy":39
}
            return this.getFGeographyName(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.FiltergetFGeographyName(res.ResponseObject, data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))


}




 FOpportunityName(data: any): Observable<any> {
          let body = {
      ...data.columnFIlterJson,
    "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    "SearchOppo": data.SearchOppo,
     "pageNumber": data.useFullData.RequestedPageNumber,
    "pageCount": 10,
    "opportunityName": data.opportunityName,
    "opportunityNumber": data.opportunityNumber,
    "opportunityStatus": data.opportunityStatus,
    "serviceLineId": data.serviceLineId,
    "practiceId": data.practiceId,
    "verticalId": data.verticalId,
    "subVerticalId": data.subVerticalId,
    "geograpyId": data.geograpyId,
    "regionId": data.regionId,
    "accountName": data.accountName,
    "parrentAccountId": data.parrentAccountId,
    "accountNumber": data.accountNumber,
    "wiproAccountCompetitorId": data.wiproAccountCompetitorId,
    "wiproAllianceAccountId": data.wiproAllianceAccountId,
    "opportunityIpId": data.opportunityIpId,
    "UserId": data.UserId,
    "SortBy":0
}
            return this.getFOpportunityName(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.FiltergetFOpportunityName(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

}


FilterFAdvisorName(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {

                        'name': (x.AdvisorName) ? x.AdvisorName : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.AdvisorId) ? x.AdvisorId : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}
   getFAdvisorName(body){
   return this.apiServiceOpportunity.post(routes.getFOpportunityName,body);
}


 FAdvisorName(data: any): Observable<any> {
          let body = {
       ...data.columnFIlterJson,
       "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    "SearchOppo": data.SearchOppo,
     "pageNumber": data.useFullData.RequestedPageNumber,
    "pageCount": 10,
    "opportunityName": data.opportunityName,
    "opportunityNumber": data.opportunityNumber,
    "opportunityStatus": data.opportunityStatus,
    "serviceLineId": data.serviceLineId,
    "practiceId": data.practiceId,
    "verticalId": data.verticalId,
    "subVerticalId": data.subVerticalId,
    "geograpyId": data.geograpyId,
    "regionId": data.regionId,
    "accountName": data.accountName,
    "parrentAccountId": data.parrentAccountId,
    "accountNumber": data.accountNumber,
    "wiproAccountCompetitorId": data.wiproAccountCompetitorId,
    "wiproAllianceAccountId": data.wiproAllianceAccountId,
    "opportunityIpId": data.opportunityIpId,
    "UserId": data.UserId,
    'SortBy':41
}
            return this.getFAdvisorName(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.FilterFAdvisorName(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}

FilterFCreatedOn(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {

                       'name': (x.CreatedOn) ? this.datepipe.transform(x.CreatedOn,"dd-MMM-yyyy") : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.OpportunityId) ? x.OpportunityId : '',
                        'Name':(x.CreatedOn)

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}
   getFCreatedOn(body){
   return this.apiServiceOpportunity.post(routes.getFCreatedOn,body);
}





 FCreatedOn(data: any): Observable<any> {
          let body = {
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    "SearchOppo": data.SearchOppo,
     "pageNumber": data.useFullData.RequestedPageNumber,
    "pageCount": 10,
    "opportunityName": data.opportunityName,
    "opportunityNumber": data.opportunityNumber,
    "opportunityStatus": data.opportunityStatus,
    "serviceLineId": data.serviceLineId,
    "practiceId": data.practiceId,
    "verticalId": data.verticalId,
    "subVerticalId": data.subVerticalId,
    "geograpyId": data.geograpyId,
    "regionId": data.regionId,
    "accountName": data.accountName,
    "parrentAccountId": data.parrentAccountId,
    "accountNumber": data.accountNumber,
    "wiproAccountCompetitorId": data.wiproAccountCompetitorId,
    "wiproAllianceAccountId": data.wiproAllianceAccountId,
    "opportunityIpId": data.opportunityIpId,
    "UserId": data.UserId
}
            return this.getFCreatedOn(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.FilterFCreatedOn(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}


FilterFaccountName(data,column){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {
                  if(column=='account'){
                    return {

                      'name': (x.Account) ?(x.Account.Name)  : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.Account) ? x.Account.AccountId : '',
                    }
                }
                else{
                 return {

                       'name': (x.OwnerName) ?(x.OwnerName)  : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.Id) ? x.Id : '',
                    }
                }
                })}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}
   getFaccountName(body){
   return this.apiServiceOpportunity.post(routes.getFOpportunityName ,body);
}






 FaccountName(data: any,column): Observable<any> {
          let body ={
       ...data.columnFIlterJson,
         "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    "SearchOppo": data.SearchOppo,
     "pageNumber": data.useFullData.RequestedPageNumber,
    "pageCount": 10,
    "opportunityName": data.opportunityName,
    "opportunityNumber": data.opportunityNumber,
    "opportunityStatus": data.opportunityStatus,
    "serviceLineId": data.serviceLineId,
    "practiceId": data.practiceId,
    "verticalId": data.verticalId,
    "subVerticalId": data.subVerticalId,
    "geograpyId": data.geograpyId,
    "regionId": data.regionId,
    "accountName": data.accountName,
    "parrentAccountId": data.parrentAccountId,
    "accountNumber": data.accountNumber,
    "wiproAccountCompetitorId": data.wiproAccountCompetitorId,
    "wiproAllianceAccountId": data.wiproAllianceAccountId,
    "opportunityIpId": data.opportunityIpId,
    "UserId": data.UserId,
    'SortBy':2
     }
            return this.getFaccountName(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.FilterFaccountName(res.ResponseObject,column) : [] } : [])
                } else {
                    return of([])
                }
            }))

}



FlistStage(data): Observable<any> {
       let body = {
      ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy":30,
    "FilterSearchText" : data.useFullData.FilterSearchText,
      "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
         return this.getFlistStage(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.FiltergetListFStage(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}
getFlistStage(body){
  return this.apiServiceOpportunity.post(routes.nameLookUp,body);
}
FiltergetListFStage(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {

                        'name': (x.Stage) ? x.Stage : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.StageId) ? x.StageId : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}



FStage(data): Observable<any> {
   let body = {
       ...data.columnFIlterJson,
         "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    "SearchOppo": data.SearchOppo,
     "pageNumber": data.useFullData.RequestedPageNumber,
    "pageCount": 10,
    "opportunityName": data.opportunityName,
    "opportunityNumber": data.opportunityNumber,
    "opportunityStatus": data.opportunityStatus,
    "serviceLineId": data.serviceLineId,
    "practiceId": data.practiceId,
    "verticalId": data.verticalId,
    "subVerticalId": data.subVerticalId,
    "geograpyId": data.geograpyId,
    "regionId": data.regionId,
    "accountName": data.accountName,
    "parrentAccountId": data.parrentAccountId,
    "accountNumber": data.accountNumber,
    "wiproAccountCompetitorId": data.wiproAccountCompetitorId,
    "wiproAllianceAccountId": data.wiproAllianceAccountId,
    "opportunityIpId": data.opportunityIpId,
    "UserId": data.UserId,
    'SortBy':30
}
         return this.getFStage(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.FiltergetFStage(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}
getFStage(body){
  return this.apiServiceOpportunity.post(routes.getFOpportunityName ,body);
}
FiltergetFStage(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {

                        'name': (x.Stage) ? x.Stage : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.StageId) ? x.StageId : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}

// export const opportunityFinderHeader: any[] = [
//   { SortId:0 ,id: 1, isFilter: false, name: 'OpportunityName', isFixed: true, order: 1, title: 'Opportunity name', className: "notlinkcol" },
//   { SortId:23 ,id: 2, isFilter: false, name: 'OpportunityNumber', isFixed: false, order: 2, title: 'Opportunity number',displayType:"upperCase" },
//   { SortId:27 ,id: 3, isFilter: false, name: 'Currency', isFixed: false, order: 3, title: 'TCV' , displayType:"currency"},
//   { SortId:41 ,id: 4, isFilter: false, name: 'AdvisorName', isFixed: false, order: 4, title: 'Advisor', isLink: true , displayType:"capsFirstCase"  },
//   { SortId:3 ,id: 5, isFilter: false, name: 'CreatedOn', isFixed: false, order: 5, title: 'Created on' , displayType:"date" },
//   { SortId:2 ,id: 6, isFilter: false, name: 'accountName', isFixed: false, order: 6, title: 'Account name', displayType:"capsFirstCase" },
//   { SortId:46 ,id: 7, isFilter: false, name: 'AccountOwnerName', isFixed: false, order: 7, title: 'Account owner', displayType:"name" },
//   { SortId:39 ,id: 8, isFilter: false, name: 'GeographyName', isFixed: false, order: 8, title: 'Geography' },
//   { SortId:38 ,id: 9, isFilter: false, name: 'ProposalTypeName', isFixed: false, order: 9, title: 'Proposal type' , displayType:"capsFirstCase"  },
//   { SortId:40 ,id: 10, isFilter: false, name: 'OpportunityOwnerName', isFixed: false, order: 10, title: 'Opportunity owner', displayType:"name" },
//   { SortId:7 ,id: 11, isFilter: false, name: 'statusName', isFixed: false, order: 11, title: 'Status',isStatus:true , displayType:"capsFirstCase"  },
//    { SortId:30 ,id: 12, isFilter: false, name: 'Stage', isFixed: false, order: 11, title: 'Stage', displayType:"capsFirstCase"  }

// ]
       getFinderFilterData(data): Observable<any>{
        switch (data.filterData.headerName) {
           case 'OpportunityName':
                return this.FOpportunityName(data)
           case 'OpportunityNumber':
                return this.FOpportunityNumber(data)
           case 'Currency':
                return this.FCurrency(data)
           case 'AdvisorName':
                return this.FAdvisorName(data)
           case 'CreatedOn':
                return this.FCreatedOn(data)
           case 'accountName':
                return this.FaccountName(data,'account')
           case 'AccountOwnerName':
                return this.getAssignFinderData(data,46)
           case 'GeographyName':
                return this.FGeographyName(data)
           case 'ProposalTypeName':
                return this.getFinderProposalTypeFilter(data)
            case 'OpportunityOwnerName':
                return this.getAssignFinderData(data,40)
           case 'statusName':
                return this.getFinderStageData(data)
           case 'Stage':
                return this.FStage(data)

           default:
                return of([])
        }
    }


filterGetRendDate(data,date){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {
                  if(date=='startDate'){
                    return {

                        'name': (x.EngamentStartDate) ? this.datepipe.transform(x.EngamentStartDate,"dd-MMM-yyyy") : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.OpportunityId) ? x.OpportunityId : '',
                        'Name':(x.EngamentStartDate)

                    }
                    }
                    else{
                        return {

                         'name': (x.EngagementEndDate) ? this.datepipe.transform(x.EngagementEndDate,"dd-MMM-yyyy") : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.OpportunityId) ? x.OpportunityId : '',
                         'Name':(x.EngagementEndDate)

                    }
                    }
                })}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}

   getRendDate(body){
   return this.apiServiceOpportunity.post(routes.getRendDate,body);
}

     getRendDateData(data: any,date): Observable<any> {
          let body = {

     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "page":data.useFullData.RequestedPageNumber,
     "count":10,
     "OrderNumber": data.OrderNumber,
    "OrderStatus": data.OrderStatus,
    "OpportunityNumber": data.OpportunityNumber,
    "OpportunityName": data.OpportunityName,
    "AccountId": data.AccountId,
            }
            return this.getRendDate(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterGetRendDate(res.ResponseObject,date) : [] } : [])
                } else {
                    return of([])
                }
            }))

}


filterGetRsapData(data,pageNo){
    if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {

                    return {

                        'name': (x.SapName) ? x.SapName : 'NA',
                        isDatafiltered:false ,
                        'id':(x.SapName) ? (x.SapName).replace(/\s/g,'') : '', 

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}

   getRsapData(body){
   return this.apiServiceOpportunity.post(routes.renewalFilter,body);
}

 getRsapFilter(data: any): Observable<any> {
           let body = {
      ...data.columnFIlterJson,
    "OrderNumber": data.OrderNumber,
    "OrderStatus": data.OrderStatus,
    "OpportunityNumber": data.OpportunityNumber,
    "OpportunityName": data.OpportunityName,
    "AccountId": data.AccountId,
    "page": data.useFullData.RequestedPageNumber,
    "count": 10,
    "SearchText": data.searchOppo,
    "FilterSearchText": data.useFullData.SearchText?data.useFullData.SearchText:'' ,
    "SortBy": 44
     }
            return this.getRsapData(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterGetRsapData(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

}



filterGetRpricing(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {

                        'name': (x.PricingType) ? x.PricingType : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.PricingTypeId) ? x.PricingTypeId : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}

   getRpricingFilterData(body){
   return this.apiServiceOpportunity.post(routes.renewalFilter,body);
}

        getRpricingFilter(data): Observable<any> {
                let body = {
     ...data.columnFIlterJson,
    "OrderNumber": data.OrderNumber,
    "OrderStatus": data.OrderStatus,
    "OpportunityNumber": data.OpportunityNumber,
    "OpportunityName": data.OpportunityName,
    "AccountId": data.AccountId,
    "page": data.useFullData.RequestedPageNumber,
    "count": 10,
    "SearchText": data.searchOppo,
    "FilterSearchText": data.useFullData.SearchText?data.useFullData.SearchText:'' ,
    "SortBy": 43
     }

            return this.getRpricingFilterData(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterGetRpricing(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}








filterGetRIdFilter(data,pageNo){
    if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {

                    return {

                        'name': (x.OpportunityNumber) ? x.OpportunityNumber : 'NA',
                        isDatafiltered:false ,
                       'id':(x.OpportunityNumber) ? (x.OpportunityNumber).replace(/\s/g,'') : 'NA'

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}

   getRIdFilterData(body){
   return this.apiServiceOpportunity.post(routes.renewalFilter,body);
}



    getRIdFilter(data: any): Observable<any> {
           let body = {
     ...data.columnFIlterJson,
    "OrderNumber": data.OrderNumber,
    "OrderStatus": data.OrderStatus,
    "OpportunityNumber": data.OpportunityNumber,
    "OpportunityName": data.OpportunityName,
    "AccountId": data.AccountId,
    "page": data.useFullData.RequestedPageNumber,
    "count": 10,
    "SearchText": data.searchOppo,
    "FilterSearchText": data.useFullData.SearchText?data.useFullData.SearchText:'' ,
    "SortBy": 23
     }
            return this.getRIdFilterData(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterGetRIdFilter(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

}



filterGetRnameFilterData(data,pageNo){
    if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {

                    return {

                        'name': (x.OpportunityName) ?  this.getSymboll( x.OpportunityName) : 'NA',
                        isDatafiltered:false ,
                       'id':(x.OpportunityName) ? (x.OpportunityName).replace(/\s/g,'') : 'NA',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}

   getRnameFilterData(body){
   return this.apiServiceOpportunity.post(routes.renewalFilter,body);
}

    getRnameFilter(data: any): Observable<any> {
            let body = {
    ...data.columnFIlterJson,
    "OrderNumber": data.OrderNumber,
    "OrderStatus": data.OrderStatus,
    "OpportunityNumber": data.OpportunityNumber,
    "OpportunityName": data.OpportunityName,
    "AccountId": data.AccountId,
    "page": data.useFullData.RequestedPageNumber,
    "count": 10,
    "SearchText": data.searchOppo,
    "FilterSearchText": data.useFullData.SearchText?data.useFullData.SearchText:'' ,
    "SortBy": 0
     }
            return this.getRnameFilterData(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterGetRnameFilterData(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

}




filterGetRorderDataFilterData(data,pageNo){
    if (data) {
            if (data.length > 0) {
                return data.map((x,index)=> {

                    return {

                        'name': (x.OrderNumber) ? x.OrderNumber : 'NA',
                        isDatafiltered:false ,
                       'id':(x.OrderNumber) ? (x.OrderNumber).replace(/\s/g,'') : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}

   getRorderDataFilterData(body){
   return this.apiServiceOpportunity.post(routes.renewalFilter,body);
}





    getRorderDataFilter(data: any): Observable<any> {
          let body = {
     ...data.columnFIlterJson,
    "OrderNumber": data.OrderNumber,
    "OrderStatus": data.OrderStatus,
    "OpportunityNumber": data.OpportunityNumber,
    "OpportunityName": data.OpportunityName,
    "AccountId": data.AccountId,
    "page": data.useFullData.RequestedPageNumber,
    "count": 10,
    "SearchText": data.searchOppo,
    "FilterSearchText": data.useFullData.SearchText?data.useFullData.SearchText:'' ,
    "SortBy": 42
     }
            return this.getRorderDataFilterData(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterGetRorderDataFilterData(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

}


    getCurrencyLookUpData(data: any): Observable<any> {
           let body = {
      ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 32,
    "FilterSearchText" : data.useFullData.FilterSearchText,
      "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
            return this.getCurrencySearchDataFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnCurrencyFilter(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

}
getCurrencySearchDataFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

filterAdvnCurrencyFilter(data,pageNo){
    if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {
                    return {


                        'name': (x.TransactionCurrencyValue) ? x.TransactionCurrencyValue : 'NA',
                        isDatafiltered:false ,
                       'id':(x.TransactionCurrencyValue) ? (x.TransactionCurrencyValue).replace(/\s/g,'') : 'NA',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}


getFinderStageData(data: any): Observable<any> {
           let body = {
       ...data.columnFIlterJson,
      "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    "SearchOppo": data.SearchOppo,
     "pageNumber": data.useFullData.RequestedPageNumber,
    "pageCount": 10,
    "opportunityName": data.opportunityName,
    "opportunityNumber": data.opportunityNumber,
    "opportunityStatus": data.opportunityStatus,
    "serviceLineId": data.serviceLineId,
    "practiceId": data.practiceId,
    "verticalId": data.verticalId,
    "subVerticalId": data.subVerticalId,
    "geograpyId": data.geograpyId,
    "regionId": data.regionId,
    "accountName": data.accountName,
    "parrentAccountId": data.parrentAccountId,
    "accountNumber": data.accountNumber,
    "wiproAccountCompetitorId": data.wiproAccountCompetitorId,
    "wiproAllianceAccountId": data.wiproAllianceAccountId,
    "opportunityIpId": data.opportunityIpId,
    "UserId": data.UserId,
    'SortBy':7
}

         return this.opportunityFinderStatusData(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterFinderAdvnStageFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}
opportunityFinderStatusData(body){
  return this.apiServiceOpportunity.post(routes.getFOpportunityName,body);
}
filterFinderAdvnStageFilter(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {

                        'name': (x.StatusName) ? x.StatusName : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.StatusId) ? x.StatusId : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}


getStageData(data: any): Observable<any> {
         return this.opportunityStatusData().pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnStageFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}
opportunityStatusData(){
  return this.apiServiceOpportunity.get(routes.opportunityStatusData);
}

opportunityStatusViewData(){
  return this.apiServiceOpportunity.get(routes.opportunityStatusViewData);
}
filterAdvnStageFilter(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {

                        'name': (x.Name) ? x.Name : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.Id) ? x.Id : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}



getTypeFilter(data: any): Observable<any> {
       let body = {
      ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 26,
    "FilterSearchText" : data.useFullData.FilterSearchText,
    "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned


            }

            return this.getTypeSearchDataFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnTypeFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}
getTypeSearchDataFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp,body);
}

filterAdvnTypeFilter(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {


                        'name': x.OpportunityType? x.OpportunityType.Value:'NA',
                        isDatafiltered:false ,
                        'id': x.OpportunityType?x.OpportunityType.Id:''

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}


getListProposalTypeFilter(data: any): Observable<any> {
          let body = {
      ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy":38,
    "FilterSearchText" : data.useFullData.FilterSearchText,
      "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
            return this.getListProposalType(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterListProposalTypeFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}

getListProposalType(body){
   return this.apiServiceOpportunity.post(routes.nameLookUp,body);
}

filterListProposalTypeFilter(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {

                        'name': (x.ProposalTypeName) ? x.ProposalTypeName : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.ProposalType) ? x.ProposalType : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}


getFinderProposalTypeFilter(data: any): Observable<any> {

             let body = {
       ...data.columnFIlterJson,
       "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    "SearchOppo": data.SearchOppo,
     "pageNumber": data.useFullData.RequestedPageNumber,
    "pageCount": 10,
    "opportunityName": data.opportunityName,
    "opportunityNumber": data.opportunityNumber,
    "opportunityStatus": data.opportunityStatus,
    "serviceLineId": data.serviceLineId,
    "practiceId": data.practiceId,
    "verticalId": data.verticalId,
    "subVerticalId": data.subVerticalId,
    "geograpyId": data.geograpyId,
    "regionId": data.regionId,
    "accountName": data.accountName,
    "parrentAccountId": data.parrentAccountId,
    "accountNumber": data.accountNumber,
    "wiproAccountCompetitorId": data.wiproAccountCompetitorId,
    "wiproAllianceAccountId": data.wiproAllianceAccountId,
    "opportunityIpId": data.opportunityIpId,
    "UserId": data.UserId,
    'SortBy':38
}

            return this.getFinderProposalType(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterFinderProposalTypeFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}

getFinderProposalType(body){
   return this.apiServiceOpportunity.post(routes.getFOpportunityName,body);
}

filterFinderProposalTypeFilter(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {

                        'name': (x.ProposalTypeName) ? x.ProposalTypeName : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.ProposalType) ? x.ProposalType : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}




getRenProposalTypeFilter(data): Observable<any> {

               let body = {
      ...data.columnFIlterJson,
    "OrderNumber": data.OrderNumber,
    "OrderStatus": data.OrderStatus,
    "OpportunityNumber": data.OpportunityNumber,
    "OpportunityName": data.OpportunityName,
    "AccountId": data.AccountId,
    "page": data.useFullData.RequestedPageNumber,
    "count": 10,
    "SearchText": data.searchOppo,
    "FilterSearchText": data.useFullData.SearchText?data.useFullData.SearchText:'' ,
    "SortBy": 38
     }
            return this.getRenewalProposalType(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterRenewalProposalTypeFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}

getRenewalProposalType(body){
   return this.apiServiceOpportunity.post(routes.renewalFilter,body);
}

filterRenewalProposalTypeFilter(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {

                        'name': (x.OpportunitySource) ? x.OpportunitySource : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.ProposalTypeId) ? x.ProposalTypeId : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}



getProposalTypeFilter(): Observable<any> {

            return this.getProposalType().pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterProposalTypeFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}

getProposalType(){
   return this.apiServiceOpportunity.get(routes.getProposalType);
}

filterProposalTypeFilter(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {

                    return {

                        'name': (x.Name) ? x.Name : 'NA',
                        isDatafiltered:false ,
                        'id':  (x.Id) ? x.Id : '',

                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}


getTcvFilter(data: any): Observable<any> {
          let body = {
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode
            }
            return this.getTcvSearchDataFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnTcvFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}
getTcvSearchDataFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.tcvLookUp, body);
}

filterAdvnTcvFilter(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        'name':  this.getTcv(x.EstimatedTCV)  || this.getTcv(x.EstimatedTCV)==='0'? this.getTcv(x.EstimatedTCV) : 'NA',
                        isDatafiltered:false ,
                        'namee':  x.EstimatedTCVvalue ,
                        'id':''
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}


getTcv(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    }


getDateFilter(data: any): Observable<any> {
          let body = {
      ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 31,
    "FilterSearchText" : data.useFullData.FilterSearchText

            }
            return this.getDateSearchDataFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnDateFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))

}
getDateSearchDataFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.dateLookUp, body);
}

filterAdvnDateFilter(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {


                        'name': (x.EstimatedCloseDate) ? this.datepipe.transform(x.EstimatedCloseDate,"dd-MMM-yyyy") : 'NA',
                        isDatafiltered:false ,
                        'id': '',
                        'Name': x.EstimatedCloseDate ,
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}




getIdFilter(data: any): Observable<any> {
    //       let body = {
    //   "UserGuid": data.userGuid,
    //  "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    //  "PageSize":10,
    //  "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    // "Statuscode": data.Statuscode
    //         }
       let body = {
      ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 23,
    "FilterSearchText" : data.useFullData.FilterSearchText,
    "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
            return this.getIdSearchDataFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnIdFilter(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

}

getIdSearchDataFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

filterAdvnIdFilter(data,pageNo){
    if (data) {
            if (data.length > 0) {
                return data.map( (x,index) => {
                    return {

                        'name': (x.OpportunityNumber) ? x.OpportunityNumber : 'NA',
                        isDatafiltered:false ,
                       'id':(x.OpportunityNumber) ? (x.OpportunityNumber).replace(/\s/g,'') : 'NA',
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}




getAllVertical(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

FiltergetAllVertical(data){
    if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {

                        'name': !(x.Vertical) ? 'NA':x.Vertical.Name ?x.Vertical.Name :'NA',
                        isDatafiltered:false ,
                        'id':(x.Vertical) ? x.Vertical.Id : '',
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}



AllVertical(data: any): Observable<any> {
         let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 25,
    "FilterSearchText" : data.useFullData.FilterSearchText,
    "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
            return this.getAllVertical(body).pipe( debounceTime(500), switchMap(res => {
                if(data.useFullData.FilterSearchText== res.SearchText){
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.FiltergetAllVertical(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
              }
            }))

}


getNameFilter(data: any): Observable<any> {
        let body = {
      ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 0,
    "FilterSearchText" : data.useFullData.FilterSearchText,
    "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
    //       let body = {
    //   "UserGuid": data.userGuid,
    //  "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
    //  "PageSize":10,
    //  "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    // "Statuscode": data.Statuscode
    //         }
            return this.getNameSearchDataFilter(body).pipe( debounceTime(500), switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnNameFilter(res.ResponseObject,data.useFullData.RequestedPageNumber) : [] } : [])
                } else {
                    return of([])
                }
            }))

}

getNameSearchDataFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

filterAdvnNameFilter(data,pageNo){
    if (data) {
            if (data.length > 0) {
                return data.map((x,index) => {
                    return {

                        'name': (x.OpportunityName) ? this.getSymboll(x.OpportunityName) : 'NA',
                        isDatafiltered:false ,
                     'id':(x.OpportunityName) ? (x.OpportunityName).replace(/\s/g,'') : 'NA',
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
}
       getAccountDataFilter(data: any): Observable<any> {
             let body = {
       ...data.columnFIlterJson,
      "UserGuid": data.userGuid,
     "SearchText":data.useFullData.SearchText?data.useFullData.SearchText:'',
     "PageSize":10,
     "RequestedPageNumber":data.useFullData.RequestedPageNumber,
    "Statuscode": data.Statuscode,
     "SortBy": 2,
    "FilterSearchText" : data.useFullData.FilterSearchText,
    "IsOverDue" :data.useFullData.IsOverDue,
    "MyOwned": data.useFullData.MyOwned

            }
            return this.getAccountSearchDataFilter(body).pipe(switchMap(res => {
                if (res) {
                    return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAdvnAccountFilter(res.ResponseObject) : [] } : [])
                } else {
                    return of([])
                }
            }))


    }



getAccountSearchDataFilter(body): Observable<any>{
  return this.apiServiceOpportunity.post(routes.nameLookUp, body);
}

   filterAdvnAccountFilter(data): Observable<any> {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {


                        'name': x.Account?x.Account.Name:'NA',
                        isDatafiltered:false ,
                        'id':x.Account?x.Account.AccountId:''
                    }})}
                     else {
                return of([])
            }
        } else {
            return of([])
        }
    }


    sendPageSize: any;
    set sendPageSizeData(value: any) {
        this.sendPageSize = value;
    }
    get sendPageSizeData() {
        return this.sendPageSize
    }

    sendPageNumber: any;
    set sendPageNumberData(value: any) {
        this.sendPageNumber = value;
    }
    get sendPageNumberData() {
        return this.sendPageNumber
    }


filterLisingApi(body){

return this.apiServiceOpportunity.post(routes.filterLisingApi, body);
}
filterLisingFinderApi(body){
return this.apiServiceOpportunity.post(routes.filterLisingFinderApi, body);

}
filterLisingFinderrApi(body){
return this.apiServiceOpportunity.post(routes.filterLisingFinderrApi, body);

}
 pluckParticularKey(array, key) {
     if(array){
      return array.map(function(item) { return (item[key]) });
     }
     else{
         return []
     }

      }

downloadOpportunities(req): Observable<any> {
        return this.apiServiceOpportunity.post(routes.downloadOpportunities, req)
    }
downloadCommitment(req): Observable<any> {
        return this.apiServiceOpportunity.post(routes.downloadCommitment, req)
    }

shareApi(body){
  return this.apiServiceOpportunity.post(routes.shareRoute, body)
}

shareApii(body){
  return this.apiServiceOpportunity.post(routes.shareRoutee, body)
}


  closureDetailsApi(body){
  return this.apiServiceOpportunity.post(routes.closureDetailsApi, body)
  }
  pricingDetailsApi(body){
  return this.apiServiceOpportunity.post(routes.pricingDetailsApi, body)
  }


 searchVerApi(body){
  return this.apiServiceOpportunity.post(routes.searchVerApi, body)
  }

 checkresultstable(body){
  return this.apiServiceOpportunity.post(routes.checkresultstable, body)
  }

  
 pinChangeApi(body){
  return this.apiServiceOpportunity.post(routes.pinChangeApi, body)
  }

//saurav 
  proceedCloseBsp(body){
       return this.apiServiceOpportunity.post(routes.proceedCloseUrl, body)
  }

 DaAPi(){

let body=  {  "OppId":this.getSession('opportunityId')
}
  return this.apiServiceOpportunity.post(routes.DaAPi, body)
      
  }

}
