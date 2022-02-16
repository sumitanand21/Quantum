import { Injectable } from '@angular/core';
import { MatDialog, MatSnackBar } from "@angular/material";
import { Observable,forkJoin, of, Subject, BehaviorSubject,throwError } from 'rxjs';
import { ApiServiceUI } from './api.service';
import { ApiServiceOrder, ApiServiceOpportunity, ApiService } from './api.service';
import { map, tap, switchMap } from 'rxjs/operators';
import { catchError } from "rxjs/operators";
import { EncrDecrService } from "./encr-decr.service";
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders, HttpParams, HttpBackend } from '@angular/common/http';
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
const BASE_URL = envADAL.l2oBaseUrl;


const routes = {
  allorder: '/allorder',
  allorderbfm: '/allorderbfm',
  allorderadh: '/allorderadh',
  allorderdmwt: '/allorderdmwt',
  allorderdmnonwt: '/allorderdmnonwt',
  createamendemnt: '/createamendemnt',
  getExistingOrders: 'OrderBooking/GetExisitingOrdersForListingPage',
  updateApprovalComment: 'OrderApproval/UpdateApprovalComment',
  orderSummary: 'OrderSummary/GetOrderSummary',
  approvalSummary: 'OrderSummary/GetApprovalSummary',
  getAuditHistory: 'MoreOptions/AuditHistory',
  //assignOrderToUser: 'MoreOptions/AssignOrderToUser',
  getOrderLandingListUrl: 'OrderApproval/GetOrderForListingPage',
  sapCustomerCode: 'Common/GetSapCode',
  getTransactionCurrency: 'Common/GetTransactionCurrency',
  getVerticalSalesOwner: 'Common/GetVerticalSalesOwner',
  getCountry: 'Common/GetCountry',
  getStates: 'Common/GetStates',
  getCity: 'Common/GetCity',
  getOpportunityContractDetails: 'OrderBooking/GetOpportunityContractDetails',
  getSalesOrderDetails: 'OrderBooking/GetSalesOrderDetails',
  getOppOverviewDetail: 'OpportunityRetagging/GetoppOverviewdetails',
  getAccountCategogyList: '/Common/GetAccountCategogyList',
  getWiproOrderType: 'v1/MasterManagement/GetWiproOrderType',
  getWiproClassification: '/v1/MasterManagement/GetWiproClassification',
  GetWiproPricingType: '/v1/MasterManagement/GetWiproPricingType',
  GetAccountRelatedFields: 'OpportunityCreate/GetAccountRelatedFields',
  getDealRegistrationStatusUrl: 'v1/MasterManagement/GetDealRegistrationStatus',
  getDealRegistrationReasonUrl: 'v1/MasterManagement/GetDealRegistrationStatusReason',
  // getAuditHistory: 'MoreOptions/AuditHistory',
  // assignOrderToUser: 'MoreOptions/AssignOrderToUser',
  // getOrderApprovalLog: 'OrderApproval/GetOrderApprovalLog',
  getPOAHolders: 'OrderBooking/GetPOAHoldersList',
  getPOAHoldersDD: 'OrderBooking/POAHoldersDDs',
  createOrder: 'OrderBooking/SaveOrder',
  checkOrderBookingId: 'OrderBooking/GetActiveOrderForParentOrderLookup',
  updateOrderLOIDetails: 'OrderBooking/UpdateOrderLOIDetails',
  getOrderAttachments: 'OrderBooking/GetOrderAttachments',
  deleteOrderAttachments: 'OrderBooking/DeleteOrderLOIDetails',
  deletePODetails: 'OrderBooking/DeletePODetails',
  CheckNonBPO: 'OrderApproval/CheckNonBPO',
  UpdateNonWTurl: 'OrderBooking/UpdateNonWTFalg',
  createOrderAmendmentFlag: 'OrderBookingAmendment/CreateOrderAmendmentFlag',
  createOpportunityAmendmentFlag: 'OrderBookingAmendment/CreateOpportunityAmendmentFlag',
  orderAccountDetails: 'OrderSummary/GetAccountDetails',
  PricingApprovalSummary: 'OrderSummary/GetPricingApprovalSummary',
  updateOMPercentage: 'OrderSummary/SaveOrderOMPercentage',
  BudgetDetails: 'OrderSummary/GetBudgetDetails',
  FinancialDetails1: 'OrderSummary/GetFinancialDetails',
  FinancialDetails2: 'OrderSummary/GetDynamicCurrencyExchangeRate',
  amendmentSummary: 'OrderSummary/GetAmendmentSummary',
  activeTeamForWtOpportunity: 'OrderApproval/CheckNonBPO',//OrderApproval/GetAllActiveTeamsforBFMforWTOpportunity
  getAccountForDMTeamById: 'OrderApproval/GetOrderApproversDM',
  OrderApproversADHBDH: 'OrderApproval/GetOrderApproversADHBDH',
  BFMForNonWTOpportunityFm: 'OrderApproval/CheckNonBPO',//OrderApproval/GetBFMForNonWTOpportunity
  BFMForNonWTOpportunityDm: 'OrderApproval/GetAllActiveAccountDMTeamsByAccountId  ',
  createSalesOrderApproval: envADAL.camundaPorts.salesOrder + '/salesOrder/create',
  createAdhOrderApproval: envADAL.camundaPorts.salesOrder + '/salesOrder/DHApproval',
  acceptAdhApproval: envADAL.camundaPorts.salesOrder + '/salesOrder/DHApproval',
  acceptDMApproval: envADAL.camundaPorts.salesOrder + '/salesOrder/DMApproval',
  foreclosureRequest: envADAL.camundaPorts.IFandCO + '/IFandCO/create',
  invoiceRequest: envADAL.camundaPorts.IFandCO + '/IFandCO/create',
  GetUserRoleForOrderListing: 'Common/GetUserRoleForOrderListing',
  foreClosureDMApproval: envADAL.camundaPorts.IFandCO + '/IFandCO/DMApproval',
  createConfirmedOrder: envADAL.camundaPorts.IFandCO + '/IFandCO/create',
  //Variable declaration by sumit Starts
  getOrderBusinessSolutionsUrl: 'BusinessSolution/GetBusinessSolutions',
  getDPSOBAllocationUrl: 'OrderSolution/GetOrderAllocationDetailsFromDPS',
  getOBAllocationUrl: 'OrderSolution/GetOrderAllocationEntities',
  getSLPracSubpracUrl: 'OrderApproval/GetServiceLines',
  saveOBAllocationUrl: 'OrderSolution/SaveProjection',
  getModificationRequestsForSalesOrder: 'Modify/GetModificationRequestsForSalesOrder',
  rolebasedforOrderUrl: 'OrderBooking/GetOppBaseOrderOwner',
  rolebaseHierarchyurl: 'OrderBooking/GetOppBaseOrderOwner',

  //Modification Url
  getOrderOBAllocationModificationUrl: 'Modify/GetOrderModificationDetail',
  saveModifyOBAllocationUrl: 'Modify/SaveOrderModificationDetail',
  submitModifiedApprovalSAPUrl: envADAL.camundaPorts.orderModification + '/orderModification/ICTeamApproval',
  submitModifiedApprovalNonSAPUrl: envADAL.camundaPorts.orderModification + '/orderModification/BFMApproval',
  submitModifiedApprovalExpediteUrl: 'Modify/ExpediateRequest',
  //Variable declaration by sumit Ends


  //  Knowlwdgement Management
  getKMOverviewDetails: 'OrderBookingKnowledgeManagement/GetOverViewTab',
  getKMDocumentDetails: 'OrderBookingKnowledgeManagement/GetKMDocumentDetails',
  getKMDocumentDetailType: 'v1/MasterManagement/GetDocumentTypeOptionSet',
  delKMDocument: 'OrderBookingKnowledgeManagement/DeactivateKMDocument',
  createUpdateKMDocument: 'OrderBookingKnowledgeManagement/CreateUpdateKMDocument',
  updateKMAttachment: 'OrderBookingKnowledgeManagement/CreateUpdateKMAttachment',
  getKMWinCategory: 'OrderBookingOpportunityClosure/GetActiveOpportunityWinDetails',
  getKMLossCategory: 'OrderBookingOpportunityClosure/GetActiveOpportunityLossDetails',
  // getSME: 'OrderBookingContract/GetUserForLookup',
  getSME: 'OrderBookingContract/GetSMEUserForLoopkup',
  getSMEDetails: 'OrderBookingKnowledgeManagement/GetKMSMEDetails',
  createUpdateSME: 'OrderBookingKnowledgeManagement/CreateUpdateKMSMEDetails',
  deleteSME: 'OrderBookingKnowledgeManagement/DeactivateKMSMEDetails',
  getDocSanitized: 'OrderBookingKnowledgeManagement/GetDocumentSanityDetails',
  updateDocSanitized: 'OrderBookingKnowledgeManagement/UpdateDocumentSanityDetails',
  roleBaseAccees: 'OrderBooking/GetOppBaseOrderOwner',
  createResidualOpp: 'OpportunityRetagging/RenewalOpportunity',

  // PO deatils
  getOrderPOdetails: 'OrderBooking/GetOrderPODetails',
  savePOdetails: 'OrderBooking/SavePODetails',


  // BFM Approval
  getOrderApprovalLog: 'OrderApproval/GetOrderApprovalLog',
  getOrderReviewUrl: 'OrderApproval/GetOrderVerificationChecksDetails',
  createApprovalCommentCheck: 'OrderApproval/CreateUpdateApprovalComments',
  rejectBFMAppOrder: envADAL.camundaPorts.salesOrder + '/salesOrder/BFMApproval',
  salesOrderOwnwerReview: envADAL.camundaPorts.salesOrder + '/salesOrder/orderOwnerReview',
  invocingbyBFM: envADAL.camundaPorts.IFandCO + '/IFandCO/BFMApproval',
  confirmOrderbyBFM: envADAL.camundaPorts.IFandCO + '/IFandCO/BFMApproval',
  confirmOrderOwnerReview: envADAL.camundaPorts.IFandCO + '/IFandCO/orderOwnerReview',
  resetBFMVerificationChecks: 'OrderApproval/ResetBFMVerificationChecks',
  getOnHoldReasons: 'v1/MasterManagement/GetOnHoldReasons',
  getExceptionApproval: 'v1/MasterManagement/GetExceptionApproval',
  getApprovalDoc: 'v1/MasterManagement/GetApprovalDoc',
  getApprovelCountry: 'OrderApproval/GetConfluenceLocationCountry',
  getApprovalCity: 'OrderApproval/GetConfluenceLocationCity',
  getApprovalPlant: 'OrderApproval/GetConfluenceLocationPlant',
  getApprovalLocation: 'OrderApproval/GetConfluenceLocation',
  searchApprovalLocation: 'OrderApproval/SearchConfluenceLocation',

  submitOrderModification: envADAL.camundaPorts.orderModification + '/orderModification/create',
  //order-hierarchy
  getOrderhierarchyTree: 'MoreOptions/GetOrderHierarchy',

  //Email history
  getEmailHistory: 'MoreOptions/EmailHistory',
  getViewEmailhistory: 'MoreOptions/EmailHistoryView',
  getOrderbooking: '/MoreOptions/ProjectDetails',
  getServiceline: '/OrderSolution/GetOrderAllocationEntities',
  getIP_line: '/OrderSolution/GetOrderAllocationEntities',
  getSolution_line: '/OrderSolution/GetOrderAllocationEntities',
  getAllocation: '/OrderSolution/GetOrderAllocationEntities',
  getBookHierarchy: '/OrderBooking/GetSalesOrderDetails',

  ////saurav code starts

  // amendment saurav
  getAmendmentType: 'v1/MasterManagement/GetAmendmentType',
  getOpportunityType: 'v1/MasterManagement/GetOpportunityType',

  //negative amendment

  approveNegativeAmend: 'OrderApproval/NegativeAmendBFMCreateAutoApprove',



  //more views (saurav)
  getMoreViews: 'MoreOptions/MoreViewsList',
  delMoreView: 'MoreOptions/DeleteMoreView',




  //resons
  getReason: 'v1/MasterManagement/GetOrderModificationChangeReason',
  //getVertical:''
  uploadDocuments: 'OrderBooking/CUDOrderModificationDocuments',
  getDocuments: 'OrderBooking/GetOrderModificationDocuments',
  getOrderContractStatus: 'OrderBooking/GetOrderContractStatus',
  //assign order
  ListOforderType: 'v1/MasterManagement/GetWiproOrderType',
  ListOfStartdates: 'OrderApproval/GetOrderStartEndAndCreatedDateColumn',
  ListOfEnddates: 'OrderApproval/GetOrderStartEndAndCreatedDateColumn',
  ListOfAccountname: 'Common/GetAccountLookUp',
  ListOfPricingtype: 'v1/MasterManagement/GetWiproPricingType',
  AssignOrderToUser: 'MoreOptions/AssignOrderToUser',
  ListOfStatus: 'OrderApproval/GetOrderStatusColumn',
  GetOrderForListingPageFilter: 'OrderApproval/GetOrderForListingPageFilter',
  SearchOrderIdColumn: 'OrderApproval/SearchOrderIdColumn',
  SearchOrderTCVColumn: 'OrderApproval/SearchOrderTCVColumn',
  fetchAprovalTypesForFilter: 'OrderApproval/GetOrderApprovalTypeColumn',

  ListOfSapCustomerCode: 'OrderApproval/GetOrderSapCustomerCodeColumn',
  ListOfOrderOwner: 'v1/LeadManagement/SearchOwner',
  ListOfOpportunityNames: 'OrderApproval/GetOrderOpportunityNameColumn',
  ListOpportunityId: 'OrderApproval/GetOrderOpportunityIdColumn',
  ListOfCreatedOn: 'OrderApproval/GetOrderStartEndAndCreatedDateColumn',

  GetBFMForRequestInvoicing: 'OrderApproval/GetVerticalBFMUsers',

  downloadOrders: 'OrderApproval/GetOrderForListingPageDownload',
  GetSessionDetailsForUI: 'OrderBooking/GetSessionDetailsForUI',

  // LOI
  deleteLOIAttachmentsUrl: 'OrderBooking/DeleteAttachments',

  // Order retag
  fetchOrdersListForRetag: 'OrderRetag/List',
  RetagOrder: 'OrderRetag/RetagOrder',
  RetagColumns: 'OrderRetag/RetagColumns',
  RetagListFilter: 'OrderRetag/RetagListFilter',


  //prachi helpdesk track order
  helpdeskTrackOrder: 'OrderHelpDesk/TrackOrder',
  helpdeskTrackOpportuinity: 'Helpdesk/TrackOpportunity',
  // Order listing filters
  fetchColumnFilterList: 'OrderApproval/OrderColumnFilter',

  //hard close saurav
  hardCloseOppUrl: 'OrderApproval/UpdateOpportunityHardClose',
  // hardCloseOpp : 'OrderApproval/UpdateOpportunityHardClose',

  //saurav upload contracts 
  deleteAttachments: 'OrderBooking/DeleteAttachments',
  saveAttachments: 'OrderBooking/SaveOrderAttachments',
  getAttachments: 'OrderBooking/GetOrderAttachments',

  //saurav Da chat  starts
  getUserId: 'OrderBooking/GetOrderTaggedUsers',
  getEmailId: 'Common/GetUserDetailsTaggedUser',


  ////saurav code ends

  // Task reminder
  setTaskReminder: envADAL.camundaPorts.reminder + '/taskReminder/create',
  rescheduleTaskReminder: envADAL.camundaPorts.reminder + '/taskReminder/reschedule',
  cancelTaskReminder: envADAL.camundaPorts.reminder + '/taskReminder/cancel',
  getTaskDetails: 'OrderApproval/GetTaskReminderDetails',
  GetTaskRescheduleDetails: 'OrderApproval/GetTaskRescheduleDetails',

  //Pending with contract execution

  UpdateOrderPendingWithContract: 'OrderApproval/UpdateOrderPendingWithContract',

  // Pending with deal owner

  UpdateOrderPendingWithDealOwner: 'OrderApproval/UpdateOrderPendingWithDealOwner',
  DeleteOrderApprovalLog: 'OrderApproval/DeleteOrderApprovalLog',



  //prachi helpdesk Change Vertical Owner search for Current Vertical owner
  verticalOwnerSearch: 'OrderHelpDesk/CurrentOrderVSO',

  //prachi helpdesk Vertical Owner Change Search 
  verticalOwnerSearchBtn: 'OrderHelpDesk/OrderVerticalSearch',

  //prachi helpdesk New Vertical Owner
  newVerticalOwner: 'Common/GetAccountsOwnerLookup',

  //prachi helpdesk Update Button
  verticalOwnerUpdateBtn: 'OrderHelpDesk/UpdateOrderVSO',

  //summary saurav starts
  deliveryTeamUrl: 'OrderSummary/GetDeliveryTeam',
  //summary saurav ends

  // Kirti GetCrmReference
  helpDeskCrm: 'OrderHelpDesk/CRMReference',

  // kirti amendment-to-order for search and convert. 
  amendmenttoorder: 'Common/GetOrderAmendment',
  //getdatafromapi: 'Common/GetOrderAmendment',
  amendmentorderconvert: 'OrderHelpDesk/TransferOrder',

  // kirti one-amendment-to-other
  oneamendmentorder: 'OrderRetag/List',

  // helpdesk order amendment transfer (order to amendment) rishi
  childorderAmendment: 'Common/GetOrderAmendment',
  parentorderAmendment: 'OrderRetag/List',
  convertAction: 'OrderHelpDesk/TransferOrder',

  //helpdesk Transfer of SLBDM
  getAllActiveSearviceline: 'Common/GetServiceLines',
  practiseSlBdm: 'Common/GetPractice',
  subPracticeSLBDM: 'OpportunityCreate/GetSubPracticeList',
  oppoSearchBtn: 'Helpdesk/OpportunitySLBDMSearch',
  transferBtn: 'OrderHelpDesk/TransferSLBDM',
  orderSLBDMSearch: 'OrderHelpDesk/OrderSLBDMSearch',

  //Retag Button check
  ChkBaseOrderRetag: 'OrderBooking/CheckBaseOrderTag',

  // manual push ris
  manualPush: 'OrderHelpDesk/OrderCPROPush',
  viewBaseRecords :'OrderHelpDesk/ViewBaseOrder',  // manual push- View details
  viewAdhVdhSdh : 'OrderHelpDesk/OrderViewDH', // ViewDetails ADH/VDH/SDH
  itacPush: 'OrderHelpDesk/ITACPush',

  //modify order ICM check
  validateContractStatus: 'Modify/ValidateContractStatus',

  //Icertis changes
  getOrderIcmValues : 'OrderBooking/GetOrderIcmValues',
};



export const OrderHeader: any[] = [
  { id: 1, isHideColumnSearch: false, isFilter: false, name: 'OrderId', isFixed: true, order: 1, title: 'ID', SortId: 42, displayType: 'upperCase', selectName: "Order" },
  { id: 2, isHideColumnSearch: true, isFilter: false, name: 'Type', isFixed: false, order: 2, title: 'Order type', SortId: 45, displayType: 'capsFirstCase' },
  { id: 3, isHideColumnSearch: true, isFilter: false, hideFilter: true, name: 'OrderTcv', isFixed: false, order: 3, title: 'Order TCV', SortId: 27 },
  { id: 7, isHideColumnSearch: false, isFilter: false, name: 'Status', isFixed: false, order: 7, title: 'Status', isStatus: true, SortId: 30 },
  { id: 14, isHideColumnSearch: false, isFilter: false, name: 'OrderOwner', isFixed: false, order: 14, title: 'Order owner', SortId: 6, displayType: 'name' },
  { id: 4, isHideColumnSearch: true, isFilter: false, name: 'StartDate', isFixed: false, order: 4, title: 'Start date', SortId: 18, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 5, isHideColumnSearch: true, isFilter: false, name: 'EndDate', isFixed: false, order: 5, title: 'End date', SortId: 19, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  // { id: 6, isHideColumnSearch: false, isFilter: false, name: 'ApprovalType', isFixed: false, order: 6, title: 'Approval type', displayType: 'capsFirstCase' },
  { id: 8, isHideColumnSearch: false, isFilter: false, name: 'AccountName', isFixed: false, order: 8, title: 'Account name', className: "approvalstatus", isLink: true, SortId: 2 },
  { id: 9, isHideColumnSearch: true, isFilter: false, name: 'PricingType', isFixed: false, order: 9, title: 'Pricing type', SortId: 43 },
  { id: 10, isHideColumnSearch: false, isFilter: false, name: 'OpportunityName', isFixed: false, order: 10, title: 'Opportunity name', className: "approvalstatus", isLink: true, SortId: 0, displayType: 'capsFirstCase' },
  { id: 11, isHideColumnSearch: false, isFilter: false, name: 'OpportunityId', isFixed: false, order: 11, title: 'Opportunity ID', SortId: 23, displayType: 'upperCase' },
  { id: 12, isHideColumnSearch: false, isFilter: false, name: 'SAPCustomerCode', isFixed: false, order: 12, title: 'SAP customer code', SortId: 44, displayType: 'capsFirstCase' },
  { id: 13, isHideColumnSearch: true, isFilter: false, name: 'CreatedOn', isFixed: false, order: 13, title: 'Created on', SortId: 3, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },

];

export const OrderHeaderAccount: any[] = [
  { id: 1, isHideColumnSearch: false, isFilter: false, name: 'OrderId', isFixed: true, order: 1, title: 'ID', SortId: 42, displayType: 'upperCase', selectName: "Order" },
  { id: 2, isHideColumnSearch: true, isFilter: false, name: 'Type', isFixed: false, order: 2, title: 'Order type', SortId: 45, displayType: 'capsFirstCase' },
  { id: 3, isHideColumnSearch: true, isFilter: false, hideFilter: true, name: 'OrderTcv', isFixed: false, order: 3, title: 'Order TCV', SortId: 27, displayType: 'currency' },
  { id: 7, isHideColumnSearch: false, isFilter: false, name: 'Status', isFixed: false, order: 7, title: 'Status', isStatus: true, SortId: 30 },
  { id: 14, isHideColumnSearch: false, isFilter: false, name: 'OrderOwner', isFixed: false, order: 14, title: 'Order owner', SortId: 6, displayType: 'name' },
  { id: 4, isHideColumnSearch: true, isFilter: false, name: 'StartDate', isFixed: false, order: 4, title: 'Start date', SortId: 18, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 5, isHideColumnSearch: true, isFilter: false, name: 'EndDate', isFixed: false, order: 5, title: 'End date', SortId: 19, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  // { id: 8, isHideColumnSearch: false, isFilter: false, hideFilter: true, name: 'AccountName', isFixed: false, order: 8, title: 'Account name', className: "approvalstatus", isLink: true, SortId: 2 },
  { id: 9, isHideColumnSearch: true, isFilter: false, name: 'PricingType', isFixed: false, order: 9, title: 'Pricing type', SortId: 43 },
  { id: 10, isHideColumnSearch: false, isFilter: false, name: 'OpportunityName', isFixed: false, order: 10, title: 'Opportunity name', className: "approvalstatus", isLink: true, SortId: 0, displayType: 'capsFirstCase' },
  { id: 11, isHideColumnSearch: false, isFilter: false, name: 'OpportunityId', isFixed: false, order: 11, title: 'Opportunity ID', SortId: 23, displayType: 'upperCase' },
  { id: 12, isHideColumnSearch: false, isFilter: false, name: 'SAPCustomerCode', isFixed: false, order: 12, title: 'SAP customer code', SortId: 44, displayType: 'capsFirstCase' },
  { id: 13, isHideColumnSearch: true, isFilter: false, name: 'CreatedOn', isFixed: false, order: 13, title: 'Created on', SortId: 3, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },

]

export const OrderHeaderRetag = [
  { id: 1, isHideColumnSearch: false, isSortDisable: false, hideFilter: false, isFilter: false, name: 'OrderId', isFixed: true, order: 1, title: 'Order/Amendment no', SortId: 42, displayType: 'upperCase', selectName: "Order" },
  { id: 2, isHideColumnSearch: false, isSortDisable: false, hideFilter: false, isFilter: false, name: 'OpportunityId', isFixed: false, order: 2, title: 'Opportunity no', SortId: 23, displayType: 'upperCase' },
  { id: 3, isHideColumnSearch: false, isSortDisable: false, hideFilter: false, isFilter: false, name: 'OrderOwner', isFixed: false, order: 3, title: 'Order owner', SortId: 6, displayType: 'name' },
  { id: 4, isHideColumnSearch: false, isSortDisable: true, hideFilter: true, isFilter: false, name: 'SAPCustomerCode', isFixed: false, order: 4, title: 'SAP customer code', SortId: 44, displayType: 'capsFirstCase' },
  { id: 4, isHideColumnSearch: false, isSortDisable: true, hideFilter: true, isFilter: false, name: 'SAPCustomerCodes', isFixed: false, order: 5, title: 'SAP customer Number', SortId: 48, displayType: 'capsFirstCase' },
  { id: 5, isHideColumnSearch: false, isSortDisable: false, hideFilter: false, isFilter: false, name: 'ProjectCode', isFixed: false, order: 6, title: 'Project code', SortId: 52, displayType: 'upperCase' },
  { id: 6, isHideColumnSearch: true, isSortDisable: false, hideFilter: false, isFilter: false, name: 'StartDate', isFixed: false, order: 7, title: 'Start date', SortId: 18, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 7, isHideColumnSearch: true, isSortDisable: false, hideFilter: false, isFilter: false, name: 'EndDate', isFixed: false, order: 8, title: 'End date', SortId: 19, displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 8, isHideColumnSearch: false, isSortDisable: false, hideFilter: false, isFilter: false, name: 'PricingId', isFixed: false, order: 9, title: 'Pricing ID', SortId: 5, displayType: 'upperCase' },
  { id: 9, isHideColumnSearch: false, isSortDisable: true, hideFilter: true, isFilter: false, name: 'PricingType', isFixed: false, order: 10, title: 'Pricing type', SortId: 43 }
]

export const OrderHeaderBFM: any[] = [
  { id: 1, isFilter: false, name: 'OrderIdBFM', isFixed: true, order: 1, title: 'ID', displayType: 'upperCase', selectName: "Order" },
  { id: 2, isFilter: false, name: 'ApprovalType', isFixed: false, order: 2, title: 'Approval type', displayType: 'capsFirstCase' },
  { id: 3, isFilter: false, name: 'OrderTcv', isFixed: false, hideFilter: true, order: 3, title: 'Order TCV', displayType: 'currency' },
  { id: 4, isFilter: false, name: 'AccountName', isFixed: false, order: 4, title: 'Account name', className: "approvalstatus", isLink: true },
  { id: 5, isFilter: false, name: 'OpportunityNameBFM', isFixed: false, order: 5, title: 'Opportunity name', className: "approvalstatus", isLink: true, displayType: 'capsFirstCase' },
  { id: 6, isFilter: false, name: 'StartDate', isFixed: false, order: 6, title: 'Start date', displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 7, isFilter: false, name: 'EndDate', isFixed: false, order: 7, title: 'End date', displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 8, isFilter: false, name: 'PricingType', isFixed: false, order: 8, title: 'Pricing type', displayType: 'capsFirstCase' },
  { id: 9, isFilter: false, name: 'Status', isFixed: false, order: 9, title: 'Status', isStatus: true, displayType: 'capsFirstCase' },
]

export const OrderHeaderADH: any[] = [
  { id: 1, isFilter: false, name: 'OrderId', isFixed: true, order: 1, title: 'ID', displayType: 'upperCase', selectName: "Order" },
  { id: 2, isFilter: false, name: 'ApprovalType', isFixed: false, order: 2, title: 'Approval type', displayType: 'capsFirstCase' },
  { id: 3, isFilter: false, name: 'OrderTcv', isFixed: false, hideFilter: true, order: 3, title: 'Order TCV', displayType: 'currency' },
  { id: 4, isFilter: false, name: 'AccountName', isFixed: false, order: 4, title: 'Account name', className: "approvalstatus", isLink: true },
  { id: 5, isFilter: false, name: 'OpportunityNameADH', isFixed: false, order: 5, title: 'Opportunity name', className: "approvalstatus", isLink: true, displayType: 'capsFirstCase' },
  { id: 6, isFilter: false, name: 'StartDate', isFixed: false, order: 6, title: 'Start date', displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 7, isFilter: false, name: 'EndDate', isFixed: false, order: 7, title: 'End date', displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 8, isFilter: false, name: 'PricingType', isFixed: false, order: 8, title: 'Pricing type', displayType: 'capsFirstCase' },
  { id: 9, isFilter: false, name: 'Status', isFixed: false, order: 9, title: 'Status', isStatus: true, displayType: 'capsFirstCase' },
]


export const OrderHeaderDMWT: any[] = [
  { id: 1, isFilter: false, name: 'OrderId', isFixed: true, order: 1, title: 'ID', displayType: 'upperCase', selectName: "Order" },
  { id: 2, isFilter: false, name: 'ApprovalType', isFixed: false, order: 2, title: 'Approval type', displayType: 'capsFirstCase' },
  { id: 3, isFilter: false, name: 'OrderTcv', hideFilter: true, isFixed: false, order: 3, title: 'Order TCV', displayType: 'currency' },
  { id: 4, isFilter: false, name: 'StartDate', isFixed: false, order: 4, title: 'Start date', displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 5, isFilter: false, name: 'EndDate', isFixed: false, order: 5, title: 'End date', displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 6, isFilter: false, name: 'AccountName', isFixed: false, order: 6, title: 'Account name', className: "approvalstatus", isLink: true },
  { id: 7, isFilter: false, name: 'OppName', isFixed: false, order: 7, title: 'Opportunity name', className: "approvalstatus", isLink: true, displayType: 'capsFirstCase' },
  { id: 8, isFilter: false, name: 'PricingType', isFixed: false, order: 8, title: 'Pricing type', displayType: 'capsFirstCase' },
  { id: 9, isFilter: false, name: 'Status', isFixed: false, order: 9, title: 'Status', isStatus: true, displayType: 'capsFirstCase' },
]


export const OrderHeaderDMNONWT: any[] = [
  { id: 1, isFilter: false, name: 'OrderId', isFixed: true, order: 1, title: 'ID', displayType: 'upperCase', selectName: "Order" },
  { id: 2, isFilter: false, name: 'ApprovalType', isFixed: false, order: 2, title: 'Approval type', displayType: 'capsFirstCase' },
  { id: 3, isFilter: false, name: 'OrderTcv', hideFilter: true, isFixed: false, order: 3, title: 'Order TCV', displayType: 'currency' },
  { id: 4, isFilter: false, name: 'StartDate', isFixed: false, order: 4, title: 'Start date', displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 5, isFilter: false, name: 'EndDate', isFixed: false, order: 5, title: 'End date', displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 6, isFilter: false, name: 'AccountName', isFixed: false, order: 6, title: 'Account name', className: "approvalstatus", isLink: true },
  { id: 7, isFilter: false, name: 'OppName', isFixed: false, order: 7, title: 'Opportunity name', className: "approvalstatus", isLink: true, displayType: 'capsFirstCase' },
  { id: 8, isFilter: false, name: 'PricingType', isFixed: false, order: 8, title: 'Pricing type', displayType: 'capsFirstCase' },
  { id: 9, isFilter: false, name: 'Status', isFixed: false, order: 9, title: 'Status', isStatus: true, displayType: 'capsFirstCase' },
]
export const CreateAmendmentHeader: any[] = [
  { id: 1, isFilter: false, name: 'OrderNumber', isFixed: true, order: 1, title: 'Order number', className: "notlinkcol", displayType: 'upperCase' },
  { id: 2, isFilter: false, name: 'OpportunityName', isFixed: false, order: 2, title: 'Opportunity name', className: "approvalstatus", isLink: true, displayType: 'capsFirstCase' },
  { id: 3, isFilter: false, name: 'OpportunityId', isFixed: false, order: 2, title: 'Opportunity ID', displayType: 'upperCase' },
  { id: 4, isFilter: false, name: 'OrderOwner', isFixed: false, order: 3, title: 'Order owner', displayType: 'name' },
  { id: 5, isFilter: false, name: 'PricingType', isFixed: false, order: 4, title: 'Pricing type', displayType: 'capsFirstCase' },
  { id: 6, isFilter: false, name: 'SAPCode', isFixed: false, order: 6, title: 'SAP code', displayType: 'capsFirstCase' },
  { id: 7, isFilter: false, name: 'StartDate', isFixed: false, order: 7, title: 'Start date', displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 8, isFilter: false, name: 'EndDate', isFixed: false, order: 8, title: 'End date', displayType: 'date', dateFormat: 'dd-MMM-yyyy' },
  { id: 9, isFilter: false, name: 'Source', isFixed: false, order: 9, title: 'Source', displayType: 'capsFirstCase' }
]

export const KMSMEHeaders: any[] = [
  { name: 'Name', title: 'Contact name' },
  { name: 'AccountName', title: 'Account name' },
  { name: 'Designation', title: 'Designation' }
]

//prachi
export const CurrentVerticalowner: any[] = [
  { name: 'Name', title: 'Username' },
  { name: 'EmailID', title: 'Email id' },
]
// rishi adv look up
export const ChildOrder: any[] = [
  { name: 'Name', title: 'Order Number' },
  { name: 'OwnerName', title: 'Order Owner' },
]
export const ParentOrder: any[] = [
  { name: 'Name', title: 'Order Number' },
  { name: 'OrderOwner', title: 'Order Owner' },
]
export const ChildOrderAdvnHeaders = {
  'ChildOrder': ChildOrder,
  'ParentOrder': ParentOrder
}

export const ChildOrderAdvnNames = {
  'ChildOrder': { name: 'Child Order', isCheckbox: false, isAccount: false },
  'ParentOrder': { name: 'Parent Order', isCheckbox: false, isAccount: false }
}
// Kirti Advancedlookupforamendmentorder
export const Amendment: any[] = [
  { name: 'OrderNumber', title: 'Ordernumber' },
  { name: 'Ownername', title: 'OwnerName' },
]
export const TargetAmendment: any[] = [
  { name: 'OrderNumber', title: 'Ordernumber' },
  { name: 'Ownername', title: 'OwnerName' },
]

export const OrderAdvndHeaders = {
  'Amendment': Amendment,
  'TargetAmendment': TargetAmendment,
  // 'ChildOrder': ChildOrder,
  // 'ParentOrder': ParentOrder
}

export const OrderAdvndNames = {
  'Amendment': { name: 'Amendment', isCheckbox: false, isAccount: false },
  'TargetAmendment': { name: 'TargetAmendment', isCheckbox: false, isAccount: false },
  // 'ChildOrder': { name : 'Child Order', isCheckbox : false, isAccount : false},
  // 'ParentOrder': { name : 'Parent Order', isCheckbox : false, isAccount : false}
}

export const KMSMEHeadersData = {
  'SMEMaker': KMSMEHeaders
}

export const KMSMEAdvNames = {
  'SMEMaker': { name: 'SME contact', isCheckbox: true, isAccount: false }
}

//Advance lookup Current Vertical Owner Helpdesk
export const OrderAdvnHeaders = {
  'CurrentVerticalOwner': CurrentVerticalowner,
  'Childorder': CurrentVerticalowner
}

export const OrderAdvnNames = {
  'CurrentVerticalOwner': { name: 'Current Vertical owner', isCheckbox: false, isAccount: false },
  'Childorder': { name: 'Childorder', isCheckbox: false, isAccount: false }
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  LOIpopupDetails = new Subject<any>();
  amendmentDetails = new Subject<any>();
  orderDetails = new Subject<any>();
  deleteSuccessPo = new Subject<any>();
  newAmendmentDetails: any = "";
  parentOrderId: any = "";
  amendmentInProcess: any = false;
  CIS = "CLOUD & INFRASTRUCTURE SERVICES (CIS)";
  CRS = "CYBERSECURITY & RISK SERVICES (CRS)";
  action: any;

  constructor(private http: HttpClient, private encService: EncrDecrService,
        
        private httpClient: HttpClient,
    private apiService: ApiServiceUI, private apiServiceOrder: ApiServiceOrder,
    private apiServiceOpportunity: ApiServiceOpportunity, private commundaService: ApiService, public matSnackBar: MatSnackBar) { }
fileListToInsert=[];
  sendOrderDetails(data) {
    this.orderDetails.next({ data: data });
  }

  getOrderDetails(): Observable<any> {
    return this.orderDetails.asObservable();
  }

  onDeleteSuccessPo(data) {
    this.deleteSuccessPo.next({ data: data });
  }

  deleteSuccessPoDetails(): Observable<any> {
    return this.deleteSuccessPo.asObservable();
  }

  sendLOIpopupDetails(data) {
    this.LOIpopupDetails.next({ data: data });
  }

  getLOIpopupDetails(): Observable<any> {
    return this.LOIpopupDetails.asObservable();
  }

  sendAmendmentDetails(data) {
    this.amendmentDetails.next({ data: data });
  }

  getAmendmentDetails(): Observable<any> {
    return this.amendmentDetails.asObservable();
  }

  getAll(): Observable<any[]> {
    return this.apiService.get(routes.allorder);
  }

  getAllBFM(): Observable<any[]> {
    return this.apiService.get(routes.allorderbfm);
  }

  getAllDMWT(): Observable<any[]> {
    return this.apiService.get(routes.allorderdmwt);
  }

  getAllDMNONWT(): Observable<any[]> {
    return this.apiService.get(routes.allorderdmnonwt);
  }

  getAllADH(): Observable<any[]> {
    return this.apiService.get(routes.allorderadh);
  }
  getcreateamendment(): Observable<any[]> {
    return this.apiService.get(routes.createamendemnt);
  }

  getExistingOrders(): Observable<any> {
    return this.apiServiceOrder.post(routes.getExistingOrders);
  }

  downloadOrders(body): Observable<any> {
    return this.apiServiceOrder.post(routes.downloadOrders, body);
  }

  updateApprovalComment(jsonObj): Observable<any> {
    return this.apiServiceOrder.post(routes.updateApprovalComment, jsonObj);
  }
  //Order summary
  summaryOrder(body): Observable<any> {
    return this.apiServiceOrder.post(routes.orderSummary, body);
  }
  approvalSummary(body): Observable<any> {
    return this.apiServiceOrder.post(routes.approvalSummary, body);
  }

  // in more options for order booking
  getOrderbooking(body): Observable<any> {
    return this.apiServiceOrder.post(routes.getOrderbooking, body);
  }
  // order IP hierarchy
  getIP_line(body): Observable<any> {
    return this.apiServiceOrder.post(routes.getIP_line, body);
  }
  // order allocation hierarchy
  getAllocation(body): Observable<any> {
    return this.apiServiceOrder.post(routes.getAllocation, body);
  }
  // order solution hierarchy
  getSolution_line(body): Observable<any> {
    return this.apiServiceOrder.post(routes.getSolution_line, body);
  }
  // order service line hierarchy
  getServiceline(body): Observable<any> {
    return this.apiServiceOrder.post(routes.getServiceline, body);
  }
  // order booking hierarchy
  getBookHierarchy(body): Observable<any> {
    return this.apiServiceOrder.post(routes.getBookHierarchy, body);
  }
  //order hierarchy treeview
  getOrderhierarchyTree(body): Observable<any> {
    return this.apiServiceOrder.post(routes.getOrderhierarchyTree, body);
  }

  // @return array of search SAP name
  sapCustomerCode(payload): Observable<any[]> {
    return this.apiServiceOpportunity.post(routes.sapCustomerCode, payload);
  }

  // @return array of search Currency name
  currencyCode(data): Observable<any[]> {
    const payload = {
      PageSize: '5',
      SearchText: data.searchValue
    };
    return this.apiServiceOpportunity.post(routes.getTransactionCurrency, payload);
  }

  // @return array of search getCountry
  getCountryList(payload): Observable<any[]> {
    return this.apiServiceOpportunity.post(routes.getCountry, payload);
  }

  // @return array of search get states
  getStates(payload): Observable<any[]> {
    return this.apiServiceOpportunity.post(routes.getStates, payload);
  }

  // @return array of search get city
  getCity(payload): Observable<any[]> {
    return this.apiServiceOpportunity.post(routes.getCity, payload);
  }

  // @return array of search Vertical sales owner
  verticalCode(payload): Observable<any[]> {
    return this.apiServiceOpportunity.post(routes.getVerticalSalesOwner, payload);
  }

  // @return array of search contract details
  getOpportunityContractDetails(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.getOpportunityContractDetails, payload);
  }

  // @return order details if order created
  getSalesOrderDetails(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.getSalesOrderDetails, payload);
  }

  // @return array of overview details
  getoppOverviewdetails(payload): Observable<any[]> {
    return this.apiServiceOpportunity.post(routes.getOppOverviewDetail, payload);
  }

  // @return array of search Vertical sales owner
  advisorCode(data): Observable<any[]> {
    const payload = {
      PageSize: '4',
      SearchType: '7',
      SearchText: data.searchValue
    };
    return this.apiServiceOpportunity.post(routes.getAccountCategogyList, payload);
  }
  getAdvisor(body): Observable<any[]> {
    return this.apiServiceOpportunity.post(routes.getAccountCategogyList, body);
  }

  // Get order Type
  getOrderType(): Observable<any[]> {
    return this.apiServiceOpportunity.get(routes.getWiproOrderType);
  }

  // Get Classification
  getClassification(): Observable<any[]> {
    return this.apiServiceOpportunity.get(routes.getWiproClassification);
  }

  // Get Pricing Type
  getPricingType(): Observable<any[]> {
    return this.apiServiceOpportunity.get(routes.GetWiproPricingType);
  }

  // @return array of Contracting country
  getAccountRelatedFields(payload): Observable<any[]> {
    return this.apiServiceOpportunity.post(routes.GetAccountRelatedFields, payload);
  }

  // @return array of POA Holders
  getPOAHolders(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.getPOAHolders, payload);
  }
  getPOAHoldersFilters(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.getPOAHoldersDD, payload);
  }
  // @return PO details
  getOrderPOdetails(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.getOrderPOdetails, payload);
  }

  // save/update PO details
  savePOdetails(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.savePOdetails, payload);
  }

  // create order APi
  orderOverviewSave(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.createOrder, payload);
  }

  // checking for order creation
  checkOrderBookingId(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.checkOrderBookingId, payload);
  }

  // update upload details
  updateOrderLOIDetails(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.updateOrderLOIDetails, payload);
  }

  getOrderAttachments(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.getOrderAttachments, payload);
  }

  deleteOrderAttachmentsFile(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.deleteOrderAttachments, payload);
  }


  deleteLOIAttachments(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.deleteLOIAttachmentsUrl, payload);
  }



  deletePODetails(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.deletePODetails, payload);
  }

  getWTstatus(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.CheckNonBPO, payload);
  }

  setNonWTstatus(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.UpdateNonWTurl, payload);
  }

  //
  // GetSessionDetailsForUI
  GetSessionDetailsForUI(obj): Observable<any[]> {
    return this.apiServiceOrder.post(routes.GetSessionDetailsForUI, obj);
  }

  // order api end

  // create amendment starts here

  // OrderAmendmentFlag
  createOrderAmendmentFlag(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.createOrderAmendmentFlag, payload);
  }

  createOpportunityAmendmentFlag(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.createOpportunityAmendmentFlag, payload);
  }

  getAmendmentType(): Observable<any[]> {
    return this.apiServiceOpportunity.get(routes.getAmendmentType);
  }

  getOpportunityType(): Observable<any[]> {
    return this.apiServiceOpportunity.get(routes.getOpportunityType);
  }

  //negative approval

  approveNegativeAmend(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.approveNegativeAmend, payload);
  }

  // create amendment ends here



  getOderSL(OderId: string): Observable<any> {
    let body = {

    }
    return this.apiServiceOrder.post(routes.approvalSummary, body);
  }
  getOderIp(OderId: string): Observable<any> {
    let body = {

    }
    return this.apiServiceOrder.post(routes.approvalSummary, body);
  }
  getOderSolution(OderId: string): Observable<any> {
    let body = {

    }
    return this.apiServiceOrder.post(routes.approvalSummary, body);
  }
  getOderCA(OderId: string): Observable<any> {
    let body = {

    }
    return this.apiServiceOrder.post(routes.approvalSummary, body);
  }

  getAuditHistory(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getAuditHistory, body);
  }

  assignOrderToUser(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.AssignOrderToUser, body);
  }

  getOrderLandingList(PageSize: string, RequestedPageNumber: string, SearchText: string, Role: string, Status: string, UserGuid: string, ViewId: string): Observable<any> {
    let jsonObj = {
      "PageSize": PageSize.toString(),
      "RequestedPageNumber": RequestedPageNumber.toString(),
      "SearchText": SearchText ? SearchText : "",
      "RoleId": Role ? Role : "",
      "Status": Status ? Status : "",
      "UserGuid": UserGuid,
      "ViewId": ViewId ? ViewId : ""
    }
    console.log("asdf", jsonObj);
    return this.apiServiceOrder.post(routes.getOrderLandingListUrl, jsonObj);
  }

  //Order

  orderAccountDetails(body): Observable<any> {
    return this.apiServiceOrder.post(routes.orderAccountDetails, body);
  }

  // Pricing approval summary
  getPricingApprovalSummary(body): Observable<any> {
    return this.apiServiceOrder.post(routes.PricingApprovalSummary, body)
  }

  updateOMPercentage(body): Observable<any> {
    return this.apiServiceOrder.post(routes.updateOMPercentage, body)
  }
  //orderAccountDetails

  GetBudgetDetails(body): Observable<any> {
    return this.apiServiceOrder.post(routes.BudgetDetails, body);
  }
  //Financial Details
  GetFinancialDetails(body): Observable<any> {
    return this.apiServiceOrder.post(routes.FinancialDetails1, body);
  }
  GetFinancialDetails2(body): Observable<any> {
    return this.apiServiceOrder.post(routes.FinancialDetails2, body);
  }
  GetAmendment(body): Observable<any> {
    return this.apiServiceOrder.post(routes.amendmentSummary, body);
  }

  //***********************************************Modification Page Function Calls Start by Sumit********************//
  getOrderOBAllocationModification(OrderId: string, ModificationId: string): Observable<any> {
    let body = {
      OrderModificationID: ModificationId,
      SalesOrderID: OrderId
    }  //"68a69ab5-2e6e-e911-a830-000d3aa058cb"
    return this.apiServiceOrder.post(routes.getOrderOBAllocationModificationUrl, body);
  }
  submitModifiedApprovalSAP(body): Observable<any> {
    return this.commundaService.camunda_post(routes.submitModifiedApprovalSAPUrl, body);
  }

  submitModifiedApprovalNonSAP(body): Observable<any> {
    return this.commundaService.camunda_post(routes.submitModifiedApprovalNonSAPUrl, body);
  }

  submitModifiedApprovalExpedite(body): Observable<any> {
    return this.apiServiceOrder.post(routes.submitModifiedApprovalExpediteUrl, body);
  }

  //***********************************************Modification Page Function Calls End by Sumit********************//

  //***********************************************Order page Function Calls Start by Sumit********************//


  RoleBasedAccesssOrder(OrderId: string, UserId): Observable<any> {
    let body = {
      UserGuid: UserId,
      Guid: OrderId
    }
    return this.apiServiceOrder.post(routes.rolebasedforOrderUrl, body);
  }

  Rolebasedhierarchy(OrderId: string, UserId): Observable<any> {
    let body = {
      UserGuid: UserId,
      Guid: OrderId
    }
    return this.apiServiceOrder.post(routes.rolebaseHierarchyurl, body);
  }

  // order Modification Starts
  getOrderOBAllocationModificationDetails(OrderId: string, ModificationId: string, WTFlag): Observable<any> {
    let body = {
      OrderModificationID: ModificationId,
      SalesOrderID: OrderId
    }  //"68a69ab5-2e6e-e911-a830-000d3aa058cb"
    return this.getOrderOBAllocationModificationAPI(body).pipe(switchMap(res => {
      if (res) {
        console.log(res)
        return of((res && !res.IsError) ? { ...res, ResponseObject: (res.ResponseObject) ? this.filterOrderOBAllocationModification(res.ResponseObject, WTFlag) : [] } : null)
      } else {
        return of(null)
      }
    }))
  }

  getOrderOBAllocationModificationAPI(body) {
    return this.apiServiceOrder.post(routes.getOrderOBAllocationModificationUrl, body);
  }

  filterOrderOBAllocationModification(response, WTFlag): Observable<any> {
    if (response) {
      let SLTCV: any = '0.00';
      let IPTCV: any = '0.00';
      response.showAddDualCredit = false;
      response.showWTCIS = false;
      response.showWTCRS = false;
      //create Sl structure
      if (response.ServiceLineModificationDetails && response.ServiceLineModificationDetails.length > 0) {
        response.ServiceLineModificationDetails = response.ServiceLineModificationDetails.map(OrderBSPSL => {
          SLTCV = ((SLTCV ? parseFloat(SLTCV) : 0) + ((!OrderBSPSL.DualCredit && OrderBSPSL.ESTSLTCV) ? parseFloat(OrderBSPSL.ESTSLTCV) : 0)).toFixed(2);
          if (WTFlag == true && (OrderBSPSL.ServiceLineName == this.CIS || OrderBSPSL.ServiceLineName == this.CRS)) {
            response.showAddDualCredit = true;
            if (!OrderBSPSL.DualCredit) {
              if (OrderBSPSL.ServiceLineName == this.CIS) {
                response.showWTCRS = true;
              } else if (OrderBSPSL.ServiceLineName == this.CRS) {
                response.showWTCIS = true;
              }
            }
          }
          return Object.assign({
            wiproOrderid: '',
            statecode: 0,
            OpportunityId: '',
            SLCAID: OrderBSPSL.UniqueID ? OrderBSPSL.UniqueID : "",
            WiproOpportunityServicelineDetailId: OrderBSPSL.OrderServicelineDetailModificationId ? OrderBSPSL.OrderServicelineDetailModificationId : '',
            WiproOpportunityServicelineOrderDetailId: OrderBSPSL.OrderServicelineDetailId ? OrderBSPSL.OrderServicelineDetailId : '',
            WiproServicelineidValue: OrderBSPSL.ServicelineID ? OrderBSPSL.ServicelineID : "",
            WiproServicelineidValueName: OrderBSPSL.ServicelineName ? OrderBSPSL.ServicelineName : "",
            WiproPracticeId: OrderBSPSL.PracticeId ? OrderBSPSL.PracticeId : "",
            WiproPracticeName: OrderBSPSL.WiproPracticeName ? OrderBSPSL.WiproPracticeName : "",
            WiproSubpracticeid: OrderBSPSL.SubpracticeId ? OrderBSPSL.SubpracticeId : "",
            WiproSubpracticeName: OrderBSPSL.WiproSubpracticeName ? OrderBSPSL.WiproSubpracticeName : "",
            WiproSlbdmidValueName: OrderBSPSL.SLBDMName ? OrderBSPSL.SLBDMName : "",
            WiproSlbdmid: OrderBSPSL.SLBDMId ? OrderBSPSL.SLBDMId : "",
            PricingTypeId: OrderBSPSL.PricingTypeId ? OrderBSPSL.PricingTypeId : "",
            PricingTypeName: OrderBSPSL.PricingTypeName ? OrderBSPSL.PricingTypeName : "",
            WiproPercentageOftcv: OrderBSPSL.PercentageOfTCV ? (parseFloat(OrderBSPSL.PercentageOfTCV).toFixed(2)) : "",
            WiproEstsltcv: OrderBSPSL.ESTSLTCV ? (parseFloat(OrderBSPSL.ESTSLTCV).toFixed(2)) : "",
            Cloud: OrderBSPSL.Cloud ? JSON.parse(OrderBSPSL.Cloud) : false,
            WiproEngagementModel: OrderBSPSL.EngagementModel ? parseInt(OrderBSPSL.EngagementModel) : "",
            WiproEngagementModelName: OrderBSPSL.WiproEngagementModelName ? OrderBSPSL.WiproEngagementModelName : "",
            WiproDualCredit: OrderBSPSL.DualCredit ? parseInt(OrderBSPSL.DualCredit) : "",
            WiproDualCreditName: OrderBSPSL.WiproDualCreditName ? OrderBSPSL.WiproDualCreditName : "",
            AdditionalServiceLinesCloudDetails: OrderBSPSL.AdditionalCloudDetails ? (OrderBSPSL.AdditionalCloudDetails.map(it => {
              return {
                CategoryId: it.Category ? parseInt(it.Category) : "",
                Functionid: it.Function ? parseInt(it.Function) : "",
                OpenSource: it.OpenSource ? JSON.parse(it.OpenSource) : false,
                Remarks: it.Remarks ? it.Remarks : "",
                ServiceProviderId: it.Serviceprovider ? parseInt(it.Serviceprovider) : "",
                TechnologyId: it.Technology ? parseInt(it.Technology) : "",
                Value: it.Value ? parseFloat(it.Value).toFixed(2) : "",
                CloudDetailsID: it.CloudModificationID ? it.CloudModificationID : "",
                OrderCloudDetailsId: it.CloudDetailsID ? it.CloudDetailsID : "",
                CloudStatecode: 0,
                Function: it.Function ? it.Function : "",
                Category: it.Category ? it.Category : "",
                ServiceProvider: it.ServiceProvider ? it.ServiceProvider : "",
                Technology: it.Technology ? it.Technology : "",
                Name: "",
                cloudtype: 1
              }
            })) : []

          })
        })
      }

      //create IP structure
      if (response.IPModificationDetails && response.IPModificationDetails.length > 0) {
        response.IPModificationDetails = response.IPModificationDetails.map(OrderBSPIP => {
          IPTCV = (((IPTCV) ? parseFloat(IPTCV) : 0) + ((OrderBSPIP.AMCValue) ? parseFloat(OrderBSPIP.AMCValue) : 0) + ((OrderBSPIP.LicenseValue) ? parseFloat(OrderBSPIP.LicenseValue) : 0)).toFixed(2);
          return Object.assign({
            wiproOrderid: '',
            OpportunityId: '',
            statecode: 0,
            WiproOpportunityIpId: OrderBSPIP.IPModificationID ? OrderBSPIP.IPModificationID : "",
            OrderIpId: OrderBSPIP.OrderIpId ? OrderBSPIP.OrderIpId : "",
            IpId: OrderBSPIP.IPValue ? OrderBSPIP.IPValue : "",
            IpName: OrderBSPIP.IPName ? OrderBSPIP.IPName : "",
            WiproModuleValue: OrderBSPIP.ModuleID ? OrderBSPIP.ModuleID : "",
            WiproModuleName: OrderBSPIP.ModuleName ? OrderBSPIP.ModuleName : "",
            WiproServiceline: OrderBSPIP.ServiceLineId ? OrderBSPIP.ServiceLineId : "",
            WiproServicelineName: OrderBSPIP.WiproServicelineName ? OrderBSPIP.WiproServicelineName : "",
            WiproPractice: OrderBSPIP.PracticeID ? OrderBSPIP.PracticeID : "",
            WiproPracticeName: OrderBSPIP.WiproPracticeName ? OrderBSPIP.WiproPracticeName : "",
            WiproSlbdmName: OrderBSPIP.SLBDMName ? OrderBSPIP.SLBDMName : "",
            WiproSlbdmValue: OrderBSPIP.SLBDMId ? OrderBSPIP.SLBDMId : "",
            PricingTypeId: OrderBSPIP.PricingTypeId ? OrderBSPIP.PricingTypeId : "",
            PricingTypeName: OrderBSPIP.PricingTypeName ? OrderBSPIP.PricingTypeName : "",
            WiproLicenseValue: OrderBSPIP.LicenseValue ? (parseFloat(OrderBSPIP.LicenseValue).toFixed(2)) : "",
            WiproAmcvalue: OrderBSPIP.AMCValue ? (parseFloat(OrderBSPIP.AMCValue).toFixed(2)) : "",
            WiproCloud: OrderBSPIP.Cloud ? JSON.parse(OrderBSPIP.Cloud) : false,
            WiproHolmesbdmID: OrderBSPIP.HolmesBDMID ? OrderBSPIP.HolmesBDMID : "",
            WiproHolmesbdmName: OrderBSPIP.HolmesBDMName ? OrderBSPIP.HolmesBDMName : "",
            WiproModuleContactId: OrderBSPIP.ModuleContactID ? OrderBSPIP.ModuleContactID : "",
            WiproModuleContactIdName: OrderBSPIP.ModuleContactName ? OrderBSPIP.ModuleContactName : "",
            disableHolmesBDM: (OrderBSPIP.ProductTypeId && OrderBSPIP.ProductTypeId == 4) ? false : true,
            disableModule: OrderBSPIP.ModuleId ? false : true,
            AdditionalSLDetails: OrderBSPIP.AdditionalIPDetails ? (OrderBSPIP.AdditionalIPDetails.map(IPadd => {
              return Object.assign({
                wipro_ordernumber: "",
                wipro_additionalsolutionvalue: IPadd.AdditionalSolutionValue ? IPadd.AdditionalSolutionValue : "",
                wipro_additionalvalueoftcv: IPadd.AdditionalValueOfTCV ? IPadd.AdditionalValueOfTCV : "",
                wipro_customizationcomments: IPadd.CustomizationComment ? IPadd.CustomizationComment : "",
                wipro_customizationvalue: IPadd.CustomizationValue ? IPadd.CustomizationValue : "",
                wipro_implementationcomment: IPadd.ImplementationComment ? IPadd.ImplementationComment : "",
                wipro_implementationvalues: IPadd.ImplementationValue ? IPadd.ImplementationValue : "",
                wipro_percentageoftcv: IPadd.PercentageofTCV ? IPadd.PercentageofTCV : "",
                wipro_professionalservicescomment: IPadd.ProfessionalServiceComment ? IPadd.ProfessionalServiceComment : "",
                wipro_professionalservicesvalues: IPadd.ProfessionalServiceValue ? IPadd.ProfessionalServiceValue : "",
                wipro_transactioncurrencyid: IPadd.TransactionCurrencyID ? IPadd.TransactionCurrencyID : "",
                wipro_name: IPadd.Name ? IPadd.Name : "",
                statecode: 0,
                OrderIPId: OrderBSPIP.IPModificationID ? OrderBSPIP.IPModificationID : "",
                wipro_orderipadditionaldetailid: IPadd.OrderAdditionalDetailModificationid ? IPadd.OrderAdditionalDetailModificationid : '',
                OrderIpAdditionalDetailsId: IPadd.IPAdditionalDetailsID ? IPadd.IPAdditionalDetailsID : '',

              })
            })) : [],
            CloudDetails: OrderBSPIP.AdditionalCloudDetails ? (OrderBSPIP.AdditionalCloudDetails.map(it => {
              return Object.assign({
                Functionid: it.Function ? parseInt(it.Function) : "",
                CategoryId: it.Category ? parseInt(it.Category) : "",
                ServiceProviderId: it.Serviceprovider ? parseInt(it.Serviceprovider) : "",
                TechnologyId: it.Technology ? parseInt(it.Technology) : "",
                OpenSource: it.OpenSource ? JSON.parse(it.OpenSource) : false,
                Value: it.Value ? parseFloat(it.Value).toFixed(2) : "",
                Remarks: it.Remarks ? it.Remarks : "",
                CloudStatecode: 0,
                Function: it.FunctionName ? it.FunctionName : "",
                Category: it.CategoryName ? it.CategoryName : "",
                ServiceProvider: it.ServiceProviderName ? it.ServiceProviderName : "",
                Technology: it.TechnologyName ? it.TechnologyName : "",
                Name: "",
                cloudtype: 2,
                CloudDetailsID: it.CloudModificationID ? it.CloudModificationID : "",
                OrderCloudDetailsId: it.CloudDetailsID ? it.CloudDetailsID : "",
              });
            })) : []

          })
        })
      }
      //create Solution structure
      if (response.SolutionModificationDetails && response.SolutionModificationDetails.length > 0) {
        response.SolutionModificationDetails = response.SolutionModificationDetails.map(OrderBSPSol => {
          let tempIsDealRegistered =  OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 ? OrderBSPSol.OrderModDealRegistration[0].IsDealRegistered : "";
          return Object.assign({
            wiproOrderid: '',
            WiproOpportunityId: '',
            statecode: 0,
            WiproOpportunitySolutionDetailId: OrderBSPSol.SolutionModificationID ? OrderBSPSol.SolutionModificationID : "",
            OrderSolutionId: OrderBSPSol.OrderSolutionId ? OrderBSPSol.OrderSolutionId : "",
            WiproType: OrderBSPSol.Type ? OrderBSPSol.Type : "",
            WiproTypeName: OrderBSPSol.WiproTypeName ? OrderBSPSol.WiproTypeName : "",
            WiproAccountNameValue: OrderBSPSol.AccountID ? OrderBSPSol.AccountID : "",
            WiproAccountname: OrderBSPSol.AccountName ? OrderBSPSol.AccountName : "",
            OwnerIdValue: OrderBSPSol.OwnerID ? OrderBSPSol.OwnerID : "",
            OwnerIdValueName: OrderBSPSol.OwnerName ? OrderBSPSol.OwnerName : "",
            WiproPercentage: OrderBSPSol.Percentage ? JSON.parse(OrderBSPSol.Percentage) : false,
            WiproPercentageOfTCV: OrderBSPSol.TCVPercentage ? (parseFloat(OrderBSPSol.TCVPercentage).toFixed(2)) : "",
            WiproValue: OrderBSPSol.Value ? (parseFloat(OrderBSPSol.Value).toFixed(2)) : "",
            WiproSolutionBDMValue: OrderBSPSol.BDMID ? OrderBSPSol.BDMID : "",
            WiproSolutionBDMName: OrderBSPSol.BDMName ? OrderBSPSol.BDMName : "",
            WiproInfluenceType: OrderBSPSol.InfluenceType ? OrderBSPSol.InfluenceType : "",
            WiproInfluenceTypeName: OrderBSPSol.WiproInfluenceTypeName ? OrderBSPSol.WiproInfluenceTypeName : "",
            WiproServiceType: OrderBSPSol.ServiceType ? OrderBSPSol.ServiceType : "",
            WiproServiceTypeName: OrderBSPSol.WiproServiceTypeName ? OrderBSPSol.WiproServiceTypeName : "",
            IsDealRegistered : tempIsDealRegistered,
            DealRegistrationYes : new Array(Object.assign({
              DealRegistrationId: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].ModDealRegistrationId ? OrderBSPSol.OrderModDealRegistration[0].ModDealRegistrationId : "",
              OrderDealRegistrationId : OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].OrderDealRegistrationId ? OrderBSPSol.OrderModDealRegistration[0].OrderDealRegistrationId : "",
              IsDealRegistered: tempIsDealRegistered,
              SolutionId: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].ModSolutionId  ? OrderBSPSol.OrderModDealRegistration[0].ModSolutionId : "",
              PartnerPortalId: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].PartnerPortalId && tempIsDealRegistered === true ? OrderBSPSol.OrderModDealRegistration[0].PartnerPortalId : "",
              RegisteredValue: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].RegisteredValue && tempIsDealRegistered === true ? OrderBSPSol.OrderModDealRegistration[0].RegisteredValue.toFixed(2) : "",
              RegistrationStatus: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].RegistrationStatus && tempIsDealRegistered === true ? OrderBSPSol.OrderModDealRegistration[0].RegistrationStatus : "",
              RegistrationStatusName: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].RegistrationStatusName && tempIsDealRegistered === true ? OrderBSPSol.OrderModDealRegistration[0].RegistrationStatusName : "",
              RegistrationStatusReason: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].RegistrationStatusReason && tempIsDealRegistered === true ? OrderBSPSol.OrderModDealRegistration[0].RegistrationStatusReason : "",
              RegistrationStatusReasonName: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].RegistrationStatusReasonName && tempIsDealRegistered === true ? OrderBSPSol.OrderModDealRegistration[0].RegistrationStatusReasonName : "",
              Remarks: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].Remarks && tempIsDealRegistered === true ? OrderBSPSol.OrderModDealRegistration[0].Remarks : "",
              Statecode: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].ModDealRegistrationId ? 2 : 0,
          })) ,
          
            DealRegistrationNo : new Array(Object.assign({
              DealRegistrationId: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].ModDealRegistrationId ? OrderBSPSol.OrderModDealRegistration[0].ModDealRegistrationId : "",
              OrderDealRegistrationId : OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].OrderDealRegistrationId ? OrderBSPSol.OrderModDealRegistration[0].OrderDealRegistrationId : "",
              IsDealRegistered: tempIsDealRegistered,
              SolutionId: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].ModSolutionId  ? OrderBSPSol.OrderModDealRegistration[0].ModSolutionId : "",
              PartnerPortalId: "",
              RegisteredValue: "",
              RegistrationStatus: "",
              RegistrationStatusName: "",
              RegistrationStatusReason: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].RegistrationStatusReason && tempIsDealRegistered === false ? OrderBSPSol.OrderModDealRegistration[0].RegistrationStatusReason : "",
              RegistrationStatusReasonName: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].RegistrationStatusReasonName && tempIsDealRegistered === false ? OrderBSPSol.OrderModDealRegistration[0].RegistrationStatusReasonName : "",
              Remarks: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].Remarks && tempIsDealRegistered === false ? OrderBSPSol.OrderModDealRegistration[0].Remarks : "",
              Statecode: OrderBSPSol.OrderModDealRegistration && OrderBSPSol.OrderModDealRegistration.length > 0 && OrderBSPSol.OrderModDealRegistration[0].ModDealRegistrationId ? 2 : 0,
          }))


          })

        })

      }
      //create CA structure
      if (response.CreditAllocationModificationDetails && response.CreditAllocationModificationDetails.length > 0) {
        response.CreditAllocationModificationDetails = response.CreditAllocationModificationDetails.map(OrderBSPCA => {
          return Object.assign({
            wiproOrderid: '',
            WiproOpportunityId: '',
            statecode: 0,
            WiproOpportunityCreditAllocationID: OrderBSPCA.CreditAllocationModificationID ? OrderBSPCA.CreditAllocationModificationID : "",
            WiproOrderCreditAllocationID: OrderBSPCA.CreditAllocationvalue ? OrderBSPCA.CreditAllocationvalue : "",
            SLCAID: OrderBSPCA.UniqueId ? OrderBSPCA.UniqueId : "",
            WiproIsDefault: OrderBSPCA.IsDefault ? JSON.parse(OrderBSPCA.IsDefault) : false,
            WiproTypeId: OrderBSPCA.Type ? OrderBSPCA.Type : "",
            WiproTypeName: OrderBSPCA.WiproTypeName ? OrderBSPCA.WiproTypeName : "",
            ServicelineId: OrderBSPCA.ServiceLineId ? OrderBSPCA.ServiceLineId : "",
            ServicelineName: OrderBSPCA.ServicelineName ? OrderBSPCA.ServicelineName : "",
            PracticeId: OrderBSPCA.PracticeID ? OrderBSPCA.PracticeID : "",
            PracticeName: OrderBSPCA.PracticeName ? OrderBSPCA.PracticeName : "",
            SubPracticeId: OrderBSPCA.SubpracticeID ? OrderBSPCA.SubpracticeID : "",
            SubPracticeName: OrderBSPCA.SubPracticeName ? OrderBSPCA.SubPracticeName : "",
            ServicelineBDMId: OrderBSPCA.SLBDMId ? OrderBSPCA.SLBDMId : "",
            ServicelineBDMName: OrderBSPCA.SLBDMName ? OrderBSPCA.SLBDMName : "",
            WiproValue: OrderBSPCA.ValueBase ? parseFloat(OrderBSPCA.ValueBase).toFixed(2) : "",
            Contribution: OrderBSPCA.Contribution ? (parseFloat(OrderBSPCA.Contribution).toFixed(2)) : ""
          })

        })

      }
      response.OrderSltcv = SLTCV
      response.OrderIpTcv = IPTCV
      response.OrderOverallTcv = ((IPTCV ? parseFloat(IPTCV) : 0) + (SLTCV ? parseFloat(SLTCV) : 0)).toFixed(2);


      return response;
    } else {
      return of(null)
    }
  }



  // Order Modification Ends

  // Order OB Allocation Starts
  getOBAllocation(OrderId: string): Observable<any> {
    let body = { "OrderId": OrderId }  //"68a69ab5-2e6e-e911-a830-000d3aa058cb"
    return this.apiServiceOrder.post(routes.getOBAllocationUrl, body);
  }

  getOrderOBAllocationDetails(OrderId: string, WTFlag, amendmenttype?): Observable<any> {
    let body = { "OrderId": OrderId }  //"68a69ab5-2e6e-e911-a830-000d3aa058cb"
    return this.getOrderOBAllocation(body).pipe(switchMap(res => {
      if (res) {
        console.log(res)
        return of((res && !res.IsError) ? { ...res, ResponseObject: (res.ResponseObject) ? this.filterOrderOBAllocation(res.ResponseObject, WTFlag, amendmenttype) : [] } : null)
      } else {
        return of(null)
      }
    }))
  }

  getOrderOBAllocation(body) {
    return this.apiServiceOrder.post(routes.getOBAllocationUrl, body);
  }

  filterOrderOBAllocation(response, WTFlag, amendmenttype?): Observable<any> {
    if (response) {
      let SLTCV: any = '0.00';
      let IPTCV: any = '0.00';
      response.showAddDualCredit = false;
      response.showWTCIS = false;
      response.showWTCRS = false;
      //create Sl structure
      if (response.ServiceLineDetails && response.ServiceLineDetails.orderServicelineDetails && response.ServiceLineDetails.orderServicelineDetails.length > 0) {
        response.ServiceLineDetails.orderServicelineDetails = response.ServiceLineDetails.orderServicelineDetails.map(OrderBSPSL => {
          SLTCV = ((SLTCV ? parseFloat(SLTCV) : 0) + ((!OrderBSPSL.WiproDualCredit && OrderBSPSL.WiproEstsltcv) ? parseFloat(OrderBSPSL.WiproEstsltcv) : 0)).toFixed(2);
          if (WTFlag == true && (OrderBSPSL.ServiceLineName == this.CIS || OrderBSPSL.ServiceLineName == this.CRS)) {
            response.showAddDualCredit = true;
            if (!OrderBSPSL.WiproDualCredit) {
              if (OrderBSPSL.ServiceLineName == this.CIS) {
                response.showWTCRS = true;
              } else if (OrderBSPSL.ServiceLineName == this.CRS) {
                response.showWTCIS = true;
              }
            }
          }
          return Object.assign({
            wiproOrderid: '',
            statecode: 0,
            OpportunityId: '',
            SLCAID: OrderBSPSL.UniqueId ? OrderBSPSL.UniqueId : "",
            WiproOpportunityServicelineDetailId: OrderBSPSL.WiproOpportunityServicelineDetailId ? OrderBSPSL.WiproOpportunityServicelineDetailId : '',
            WiproOpportunityServicelineOrderDetailId: OrderBSPSL.WiproOpportunityServicelineDetailId ? OrderBSPSL.WiproOpportunityServicelineDetailId : '',
            WiproServicelineidValue: OrderBSPSL.ServiceLineId ? OrderBSPSL.ServiceLineId : "",
            WiproServicelineidValueName: OrderBSPSL.ServiceLineName ? OrderBSPSL.ServiceLineName : "",
            WiproPracticeId: OrderBSPSL.WiproPracticeId ? OrderBSPSL.WiproPracticeId : "",
            WiproPracticeName: OrderBSPSL.PracticeName ? OrderBSPSL.PracticeName : "",
            WiproSubpracticeid: OrderBSPSL.WiproSubpracticeid ? OrderBSPSL.WiproSubpracticeid : "",
            WiproSubpracticeName: OrderBSPSL.SubpracticeName ? OrderBSPSL.SubpracticeName : "",
            WiproSlbdmidValueName: OrderBSPSL.WiproSlbdmidValueName ? OrderBSPSL.WiproSlbdmidValueName : "",
            WiproSlbdmid: OrderBSPSL.WiproSlbdmid ? OrderBSPSL.WiproSlbdmid : "",
            PricingTypeId: OrderBSPSL.PricingTypeId ? OrderBSPSL.PricingTypeId : "",
            PricingTypeName: OrderBSPSL.PricingTypeName ? OrderBSPSL.PricingTypeName : "",
            WiproPercentageOftcv: OrderBSPSL.WiproPercentageOftcv && (!amendmenttype || amendmenttype == 184450006) ? (parseFloat(OrderBSPSL.WiproPercentageOftcv).toFixed(2)) : "",
            WiproEstsltcv: OrderBSPSL.WiproEstsltcv && (amendmenttype == 184450006 || !amendmenttype) ? (amendmenttype == 184450006 && OrderBSPSL.WiproEstsltcv > 0 ? parseFloat('-' + OrderBSPSL.WiproEstsltcv).toFixed(2) : parseFloat(OrderBSPSL.WiproEstsltcv).toFixed(2)) : "",
            Cloud: OrderBSPSL.Cloud && (!amendmenttype || amendmenttype == 184450006) ? JSON.parse(OrderBSPSL.Cloud) : false,
            WiproEngagementModel: OrderBSPSL.WiproEngagementModel ? parseInt(OrderBSPSL.WiproEngagementModel) : "",
            WiproEngagementModelName: OrderBSPSL.EngagementModelDisplay ? OrderBSPSL.EngagementModelDisplay : "",
            WiproDualCredit: OrderBSPSL.WiproDualCredit ? parseInt(OrderBSPSL.WiproDualCredit) : "",
            WiproDualCreditName: OrderBSPSL.WiproDualCreditDisplay ? OrderBSPSL.WiproDualCreditDisplay : "",
            addedByDualCreditbtn: (WTFlag == true && OrderBSPSL.WiproDualCredit) ? true : false,
            AdditionalServiceLinesCloudDetails: OrderBSPSL.ServiceLineCloudDetails && (!amendmenttype || amendmenttype == 184450006) ? (OrderBSPSL.ServiceLineCloudDetails.map(it => {
              return {
                CategoryId: it.CategoryId ? parseInt(it.CategoryId) : "",
                Functionid: it.Functionid ? parseInt(it.Functionid) : "",
                OpenSource: it.OpenSource ? JSON.parse(it.OpenSource) : false,
                Remarks: it.Remarks ? it.Remarks : "",
                ServiceProviderId: it.ServiceProviderId ? parseInt(it.ServiceProviderId) : "",
                TechnologyId: it.TechnologyId ? parseInt(it.TechnologyId) : "",
                Value: it.Value && (amendmenttype == 184450006 || !amendmenttype) ? (amendmenttype == 184450006 && it.Value > 0 ? parseFloat('-' + it.Value).toFixed(2) : parseFloat(it.Value).toFixed(2)) : "",
                CloudDetailsID: it.CloudDetailsID ? it.CloudDetailsID : "",
                OrderCloudDetailsId: it.CloudDetailsID ? it.CloudDetailsID : "",
                CloudStatecode: 0,
                Function: it.Function ? it.Function : "",
                Category: it.Category ? it.Category : "",
                ServiceProvider: it.ServiceProvider ? it.ServiceProvider : "",
                Technology: it.Technology ? it.Technology : "",
                Name: "",
                cloudtype: 1
              }
            })) : []

          })
        })
      }

      //create IP structure
      if (response.OrderIPDetails && response.OrderIPDetails.orderIPDetail && response.OrderIPDetails.orderIPDetail.length > 0) {
        response.OrderIPDetails.orderIPDetail = response.OrderIPDetails.orderIPDetail.map(OrderBSPIP => {
          IPTCV = (((IPTCV) ? parseFloat(IPTCV) : 0) + ((OrderBSPIP.AMCValue) ? parseFloat(OrderBSPIP.AMCValue) : 0) + ((OrderBSPIP.LicenseValue) ? parseFloat(OrderBSPIP.LicenseValue) : 0)).toFixed(2);
          return Object.assign({
            wiproOrderid: '',
            OpportunityId: '',
            statecode: 0,
            WiproOpportunityIpId: OrderBSPIP.wipro_ordersipid ? OrderBSPIP.wipro_ordersipid : "",
            OrderIpId: OrderBSPIP.wipro_ordersipid ? OrderBSPIP.wipro_ordersipid : "",
            IpId: OrderBSPIP.IPId ? OrderBSPIP.IPId : "",
            IpName: OrderBSPIP.Name ? OrderBSPIP.Name : "",
            WiproModuleValue: OrderBSPIP.ModuleId ? OrderBSPIP.ModuleId : "",
            WiproModuleName: OrderBSPIP.Module ? OrderBSPIP.Module : "",
            WiproServiceline: OrderBSPIP.ServicelineId ? OrderBSPIP.ServicelineId : "",
            WiproServicelineName: OrderBSPIP.Serviceline ? OrderBSPIP.Serviceline : "",
            WiproPractice: OrderBSPIP.PracticeId ? OrderBSPIP.PracticeId : "",
            WiproPracticeName: OrderBSPIP.Practice ? OrderBSPIP.Practice : "",
            WiproSlbdmName: OrderBSPIP.SLBDM ? OrderBSPIP.SLBDM : "",
            WiproSlbdmValue: OrderBSPIP.SLBDMId ? OrderBSPIP.SLBDMId : "",
            PricingTypeId: OrderBSPIP.PricingTypeId ? OrderBSPIP.PricingTypeId : "",
            PricingTypeName: OrderBSPIP.PricingTypeName ? OrderBSPIP.PricingTypeName : "",
            WiproLicenseValue: OrderBSPIP.LicenseValue && (amendmenttype == 184450006 || !amendmenttype) ? (amendmenttype == 184450006 && OrderBSPIP.LicenseValue > 0 ? parseFloat('-' + OrderBSPIP.LicenseValue).toFixed(2) : parseFloat(OrderBSPIP.LicenseValue).toFixed(2)) : "",
            WiproAmcvalue: OrderBSPIP.AMCValue && (amendmenttype == 184450006 || !amendmenttype) ? (amendmenttype == 184450006 && OrderBSPIP.AMCValue > 0 ? parseFloat('-' + OrderBSPIP.AMCValue).toFixed(2) : parseFloat(OrderBSPIP.AMCValue).toFixed(2)) : "",
            WiproCloud: OrderBSPIP.Cloud && (!amendmenttype || amendmenttype == 184450006) ? JSON.parse(OrderBSPIP.Cloud) : false,
            WiproHolmesbdmID: OrderBSPIP.HolmesBDMId ? OrderBSPIP.HolmesBDMId : "",
            WiproHolmesbdmName: OrderBSPIP.HolmesBDM ? OrderBSPIP.HolmesBDM : "",
            WiproModuleContactId: OrderBSPIP.ModuleContractId ? OrderBSPIP.ModuleContractId : "",
            WiproModuleContactIdName: OrderBSPIP.ModuleContractName ? OrderBSPIP.ModuleContractName : "",
            disableHolmesBDM: (OrderBSPIP.ProductTypeId && OrderBSPIP.ProductTypeId == 4) ? false : true,
            disableModule: OrderBSPIP.ModuleId ? false : true,
            AdditionalSLDetails: OrderBSPIP.IPAdditionalDetails && (!amendmenttype || amendmenttype == 184450006) ? (OrderBSPIP.IPAdditionalDetails.map(IPadd => {
              return Object.assign({
                wipro_ordernumber: "",
                wipro_additionalsolutionvalue: IPadd.AdditionalSolutionValue ? IPadd.AdditionalSolutionValue : "",
                wipro_additionalvalueoftcv: IPadd.AdditionalValueOfTCV ? IPadd.AdditionalValueOfTCV : "",
                wipro_customizationcomments: IPadd.CustomizationComments ? IPadd.CustomizationComments : "",
                wipro_customizationvalue: IPadd.CustomizationValue ? IPadd.CustomizationValue : "",
                wipro_implementationcomment: IPadd.ImplementationComment ? IPadd.ImplementationComment : "",
                wipro_implementationvalues: IPadd.ImplementationValues ? IPadd.ImplementationValues : "",
                wipro_percentageoftcv: IPadd.PercentageOfTCV ? IPadd.PercentageOfTCV : "",
                wipro_professionalservicescomment: IPadd.ProfessionalServicesComment ? IPadd.ProfessionalServicesComment : "",
                wipro_professionalservicesvalues: IPadd.ProfessionalServicesValues ? IPadd.ProfessionalServicesValues : "",
                wipro_transactioncurrencyid: IPadd.TransactionCurrencyId ? IPadd.TransactionCurrencyId : "",
                wipro_name: IPadd.Name ? IPadd.Name : "",
                statecode: 0,
                OrderIPId: OrderBSPIP.wipro_ordersipid ? OrderBSPIP.wipro_ordersipid : "",
                wipro_orderipadditionaldetailid: IPadd.OrderIPAdditionalDetailId ? IPadd.OrderIPAdditionalDetailId : '',
                OrderIpAdditionalDetailsId: IPadd.OrderIPAdditionalDetailId ? IPadd.OrderIPAdditionalDetailId : '',
              })
            })) : [],
            CloudDetails: OrderBSPIP.IPCloudDetails && (!amendmenttype || amendmenttype == 184450006) ? (OrderBSPIP.IPCloudDetails.map(it => {
              return Object.assign({
                Functionid: it.Functionid ? parseInt(it.Functionid) : "",
                CategoryId: it.CategoryId ? parseInt(it.CategoryId) : "",
                ServiceProviderId: it.ServiceProviderId ? parseInt(it.ServiceProviderId) : "",
                TechnologyId: it.TechnologyId ? parseInt(it.TechnologyId) : "",
                OpenSource: it.OpenSource ? JSON.parse(it.OpenSource) : false,
                Value: it.Value && (amendmenttype == 184450006 || !amendmenttype) ? (amendmenttype == 184450006 && it.Value > 0 ? parseFloat('-' + it.Value).toFixed(2) : parseFloat(it.Value).toFixed(2)) : "",
                Remarks: it.Remarks ? it.Remarks : "",
                CloudStatecode: 0,
                Function: it.Function ? it.Function : "",
                Category: it.Category ? it.Category : "",
                ServiceProvider: it.ServiceProvider ? it.ServiceProvider : "",
                Technology: it.Technology ? it.Technology : "",
                Name: "",
                cloudtype: 2,
                CloudDetailsID: it.wipro_orderclouddetailsid ? it.wipro_orderclouddetailsid : "",
                OrderCloudDetailsId: it.wipro_orderclouddetailsid ? it.wipro_orderclouddetailsid : ""
              });
            })) : []

          })
        })
      }
      //create Solution structure
      if (response.Solutions && response.Solutions.order_Solution && response.Solutions.order_Solution.length > 0) {
        response.Solutions.order_Solution = response.Solutions.order_Solution.map(OrderBSPSol => {
          let tempIsDealRegistered =  OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 ? OrderBSPSol.DealRegistration[0].IsDealRegistered : "";
          return Object.assign({
            wiproOrderid: '',
            WiproOpportunityId: '',
            statecode: 0,
            WiproOpportunitySolutionDetailId: OrderBSPSol.WiproOpportunitySolutionDetailId ? OrderBSPSol.WiproOpportunitySolutionDetailId : "",
            OrderSolutionId: OrderBSPSol.WiproOpportunitySolutionDetailId ? OrderBSPSol.WiproOpportunitySolutionDetailId : "",
            WiproType: OrderBSPSol.WiproType ? OrderBSPSol.WiproType : "",
            WiproTypeName: OrderBSPSol.WiproTypeDisplay ? OrderBSPSol.WiproTypeDisplay : "",
            WiproAccountNameValue: OrderBSPSol.WiproAccountNameValue ? OrderBSPSol.WiproAccountNameValue : "",
            WiproAccountname: OrderBSPSol.WiproAccountname ? OrderBSPSol.WiproAccountname : "",
            OwnerIdValue: OrderBSPSol.OwnerIdValue ? OrderBSPSol.OwnerIdValue : "",
            OwnerIdValueName: OrderBSPSol.OwnerIdValueName ? OrderBSPSol.OwnerIdValueName : "",
            WiproPercentage: OrderBSPSol.WiproPercentage ? JSON.parse(OrderBSPSol.WiproPercentage) : false,
            WiproPercentageOfTCV: OrderBSPSol.WiproPercentageOfTCV && (!amendmenttype || amendmenttype == 184450006) ? (parseFloat(OrderBSPSol.WiproPercentageOfTCV).toFixed(2)) : "",
            WiproValue: OrderBSPSol.WiproValue && (amendmenttype == 184450006 || !amendmenttype) ? (amendmenttype == 184450006 && OrderBSPSol.WiproValue > 0 ? parseFloat('-' + OrderBSPSol.WiproValue).toFixed(2) : parseFloat(OrderBSPSol.WiproValue).toFixed(2)) : "",
            WiproSolutionBDMValue: OrderBSPSol.WiproSolutionBDMValue ? OrderBSPSol.WiproSolutionBDMValue : "",
            WiproSolutionBDMName: OrderBSPSol.WiproSolutionBDMName ? OrderBSPSol.WiproSolutionBDMName : "",
            WiproInfluenceType: OrderBSPSol.WiproInfluenceType ? OrderBSPSol.WiproInfluenceType : "",
            WiproInfluenceTypeName: OrderBSPSol.WiproInfluenceTypeDisplay ? OrderBSPSol.WiproInfluenceTypeDisplay : "",
            WiproServiceType: OrderBSPSol.WiproServiceType ? OrderBSPSol.WiproServiceType : "",
            WiproServiceTypeName: OrderBSPSol.WiproServiceTypeDisplay ? OrderBSPSol.WiproServiceTypeDisplay : "",
            IsDealRegistered : tempIsDealRegistered,
            DealRegistrationYes : new Array(Object.assign({
              DealRegistrationId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? OrderBSPSol.DealRegistration[0].DealRegistrationId : "",
              OrderDealRegistrationId : OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? OrderBSPSol.DealRegistration[0].DealRegistrationId : "",
              IsDealRegistered: tempIsDealRegistered,
              SolutionId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].SolutionId  ? OrderBSPSol.DealRegistration[0].SolutionId : "",
              PartnerPortalId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].PartnerPortalId && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].PartnerPortalId : "",
              RegisteredValue: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegisteredValue && tempIsDealRegistered === true && (amendmenttype == 184450006 || !amendmenttype) ? (amendmenttype == 184450006 && OrderBSPSol.DealRegistration[0].RegisteredValue > 0 ? parseFloat('-' + OrderBSPSol.DealRegistration[0].RegisteredValue).toFixed(2) : parseFloat(OrderBSPSol.DealRegistration[0].RegisteredValue).toFixed(2)) : "",
              RegistrationStatus: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatus && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].RegistrationStatus : "",
              RegistrationStatusName: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatusName && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].RegistrationStatusName : "",
              RegistrationStatusReason: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatusReason && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].RegistrationStatusReason : "",
              RegistrationStatusReasonName: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatusReasonName && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].RegistrationStatusReasonName : "",
              Remarks: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].Remarks && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].Remarks : "",
              Statecode: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? 2 : 0,
          })) ,
          
            DealRegistrationNo : new Array(Object.assign({
              DealRegistrationId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? OrderBSPSol.DealRegistration[0].DealRegistrationId : "",
              OrderDealRegistrationId : OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? OrderBSPSol.DealRegistration[0].DealRegistrationId : "",
              IsDealRegistered: tempIsDealRegistered,
              SolutionId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].SolutionId  ? OrderBSPSol.DealRegistration[0].SolutionId : "",
              PartnerPortalId: "",
              RegisteredValue: "",
              RegistrationStatus: "",
              RegistrationStatusName: "",
              RegistrationStatusReason: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatusReason && tempIsDealRegistered === false ? OrderBSPSol.DealRegistration[0].RegistrationStatusReason : "",
              RegistrationStatusReasonName: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatusReasonName && tempIsDealRegistered === false ? OrderBSPSol.DealRegistration[0].RegistrationStatusReasonName : "",
              Remarks: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].Remarks && tempIsDealRegistered === false ? OrderBSPSol.DealRegistration[0].Remarks : "",
              Statecode: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? 2 : 0,
          }))
          })

        })

      }
      //create CA structure
      if (response.CreaditAllocations && response.CreaditAllocations.AllocationsDatas && response.CreaditAllocations.AllocationsDatas.length > 0) {
        response.CreaditAllocations.AllocationsDatas = response.CreaditAllocations.AllocationsDatas.map(OrderBSPCA => {
          return Object.assign({
            wiproOrderid: '',
            WiproOpportunityId: '',
            statecode: 0,
            WiproOpportunityCreditAllocationID: OrderBSPCA.CreditAlloactionId ? OrderBSPCA.CreditAlloactionId : "",
            WiproOrderCreditAllocationID: OrderBSPCA.CreditAlloactionId ? OrderBSPCA.CreditAlloactionId : "",
            SLCAID: OrderBSPCA.UniqueId ? OrderBSPCA.UniqueId : "",
            WiproIsDefault: OrderBSPCA.IsDefault ? JSON.parse(OrderBSPCA.IsDefault) : false,
            WiproTypeId: OrderBSPCA.WiproTypeId ? OrderBSPCA.WiproTypeId : "",
            WiproTypeName: OrderBSPCA.WiproTypeDisplay ? OrderBSPCA.WiproTypeDisplay : "",
            ServicelineId: OrderBSPCA.ServicelineId ? OrderBSPCA.ServicelineId : "",
            ServicelineName: OrderBSPCA.ServicelineDisplay ? OrderBSPCA.ServicelineDisplay : "",
            PracticeId: OrderBSPCA.PracticeId ? OrderBSPCA.PracticeId : "",
            PracticeName: OrderBSPCA.PracticeDisplay ? OrderBSPCA.PracticeDisplay : "",
            SubPracticeId: OrderBSPCA.SubPracticeId ? OrderBSPCA.SubPracticeId : "",
            SubPracticeName: OrderBSPCA.SubPracticeDisplay ? OrderBSPCA.SubPracticeDisplay : "",
            ServicelineBDMId: OrderBSPCA.ServicelineBDMId ? OrderBSPCA.ServicelineBDMId : "",
            ServicelineBDMName: OrderBSPCA.ServicelineBDMName ? OrderBSPCA.ServicelineBDMName : "",
            WiproValue: OrderBSPCA.WiproValue && (amendmenttype == 184450006 || !amendmenttype) ? (amendmenttype == 184450006 && OrderBSPCA.WiproValue > 0 ? parseFloat('-' + OrderBSPCA.WiproValue).toFixed(2) : parseFloat(OrderBSPCA.WiproValue).toFixed(2)) : "",
            Contribution: OrderBSPCA.Contribution ? (parseFloat(OrderBSPCA.Contribution).toFixed(2)) : ""
          })

        })

      }

      response.OrderSltcv = SLTCV && (!amendmenttype || amendmenttype == 184450006) ? (amendmenttype == 184450006 && SLTCV > 0 ? ('-' + SLTCV) : SLTCV) : ""
      response.OrderIpTcv = IPTCV && (!amendmenttype || amendmenttype == 184450006) ? (amendmenttype == 184450006 && IPTCV > 0 ? ('-' + IPTCV) : IPTCV) : ""
      let OverallTCV: any = ((IPTCV ? parseFloat(IPTCV) : 0) + (SLTCV ? parseFloat(SLTCV) : 0)).toFixed(2);
      response.OrderOverallTcv = OverallTCV && (!amendmenttype || amendmenttype == 184450006) ? (amendmenttype == 184450006 && OverallTCV > 0 ? ('-' + OverallTCV) : OverallTCV) : ""
      return response;
    } else {
      return of(null)
    }
  }

  // Order OB Allocation Ends

  //DPS Code starts
  getDPSOBAllocation(OrderId: string, PricingId: any): Observable<any> {
    let body = {
      "PricingId": PricingId,
      "OrderId": OrderId
    }  //"68a69ab5-2e6e-e911-a830-000d3aa058cb"
    return this.apiServiceOrder.post(routes.getDPSOBAllocationUrl, body);
  }

  getOrderOBAllocationDPSDetails(OpportunityId: string, OrderId: string, PricingId: any, VSOId: any, VSOName: any): Observable<any> {
    let body = {
      "PricingId": PricingId ? PricingId : null,
      "OrderId": OrderId ? OrderId : null,
      "OpportunityId": OpportunityId ? OpportunityId : null
    }  //"68a69ab5-2e6e-e911-a830-000d3aa058cb"
    return this.getOrderOBAllocationDPS(body).pipe(switchMap(res => {
      if (res) {
        console.log(res)
        return of((res && !res.IsError) ? { ...res, ResponseObject: (res.ResponseObject) ? this.filterOrderOBAllocationDPS(res.ResponseObject, VSOId, VSOName) : [] } : null)
      } else {
        return of(null)
      }
    }))
  }

  getOrderOBAllocationDPS(body) {
    return this.apiServiceOrder.post(routes.getDPSOBAllocationUrl, body);
  }

  filterOrderOBAllocationDPS(response, VSOId: any, VSOName: any): Observable<any> {
    if (response) {
      let SLTCV: any = '0.00';
      let IPTCV: any = '0.00';
      response.showAddDualCredit = false;
      response.showWTCIS = false;
      response.showWTCRS = false;
      //create Sl structure
      if (response.ServiceLineDetails && response.ServiceLineDetails.orderServicelineDetails && response.ServiceLineDetails.orderServicelineDetails.length > 0) {
        response.ServiceLineDetails.orderServicelineDetails = response.ServiceLineDetails.orderServicelineDetails.map(OrderBSPSL => {
          SLTCV = ((SLTCV ? parseFloat(SLTCV) : 0) + ((!OrderBSPSL.WiproDualCredit && OrderBSPSL.WiproEstsltcv) ? parseFloat(OrderBSPSL.WiproEstsltcv) : 0)).toFixed(2);
          if (OrderBSPSL.ServiceLineName == this.CIS || OrderBSPSL.ServiceLineName == this.CRS) {
            response.showAddDualCredit = true;
            if (!OrderBSPSL.WiproDualCredit) {
              if (OrderBSPSL.ServiceLineName == this.CIS) {
                response.showWTCRS = true;
              } else if (OrderBSPSL.ServiceLineName == this.CRS) {
                response.showWTCIS = true;
              }
            }
          }
          return Object.assign({
            wiproOrderid: '',
            statecode: 0,
            OpportunityId: '',
            SLCAID: Math.random().toString(36).substring(2),
            WiproOpportunityServicelineDetailId: OrderBSPSL.WiproOpportunityServicelineDetailId ? OrderBSPSL.WiproOpportunityServicelineDetailId : '',
            WiproOpportunityServicelineOrderDetailId: OrderBSPSL.WiproOpportunityServicelineDetailId ? OrderBSPSL.WiproOpportunityServicelineDetailId : '',
            WiproServicelineidValue: OrderBSPSL.ServiceLineId ? OrderBSPSL.ServiceLineId : "",
            WiproServicelineidValueName: OrderBSPSL.ServiceLineName ? OrderBSPSL.ServiceLineName : "",
            WiproPracticeId: OrderBSPSL.WiproPracticeId ? OrderBSPSL.WiproPracticeId : "",
            WiproPracticeName: OrderBSPSL.PracticeName ? OrderBSPSL.PracticeName : "",
            WiproSubpracticeid: OrderBSPSL.WiproSubpracticeid ? OrderBSPSL.WiproSubpracticeid : "",
            WiproSubpracticeName: OrderBSPSL.SubpracticeName ? OrderBSPSL.SubpracticeName : "",
            WiproSlbdmidValueName: OrderBSPSL.WiproSlbdmidValueName ? OrderBSPSL.WiproSlbdmidValueName : "",
            WiproSlbdmid: OrderBSPSL.WiproSlbdmid ? OrderBSPSL.WiproSlbdmid : "",
            PricingTypeId: OrderBSPSL.PricingTypeId ? OrderBSPSL.PricingTypeId : "",
            PricingTypeName: OrderBSPSL.PricingTypeName ? OrderBSPSL.PricingTypeName : "",
            WiproPercentageOftcv: OrderBSPSL.WiproPercentageOftcv ? (parseFloat(OrderBSPSL.WiproPercentageOftcv).toFixed(2)) : "",
            WiproEstsltcv: OrderBSPSL.WiproEstsltcv ? (parseFloat(OrderBSPSL.WiproEstsltcv).toFixed(2)) : "",
            Cloud: OrderBSPSL.Cloud ? JSON.parse(OrderBSPSL.Cloud) : false,
            WiproEngagementModel: OrderBSPSL.WiproEngagementModel ? parseInt(OrderBSPSL.WiproEngagementModel) : "",
            WiproEngagementModelName: OrderBSPSL.EngagementModelDisplay ? OrderBSPSL.EngagementModelDisplay : "",
            WiproDualCredit: OrderBSPSL.WiproDualCredit ? parseInt(OrderBSPSL.WiproDualCredit) : "",
            WiproDualCreditName: OrderBSPSL.WiproDualCreditDisplay ? OrderBSPSL.WiproDualCreditDisplay : "",
            AdditionalServiceLinesCloudDetails: OrderBSPSL.ServiceLineCloudDetails ? (OrderBSPSL.ServiceLineCloudDetails.map(it => {
              return {
                CategoryId: it.CategoryId ? parseInt(it.CategoryId) : "",
                Functionid: it.Functionid ? parseInt(it.Functionid) : "",
                OpenSource: it.OpenSource ? JSON.parse(it.OpenSource) : false,
                Remarks: it.Remarks ? it.Remarks : "",
                ServiceProviderId: it.ServiceProviderId ? parseInt(it.ServiceProviderId) : "",
                TechnologyId: it.TechnologyId ? parseInt(it.TechnologyId) : "",
                Value: it.Value ? parseFloat(it.Value).toFixed(2) : "",
                CloudDetailsID: it.CloudDetailsID ? it.CloudDetailsID : "",
                OrderCloudDetailsId: it.CloudDetailsID ? it.CloudDetailsID : "",
                CloudStatecode: 0,
                Function: it.Function ? it.Function : "",
                Category: it.Category ? it.Category : "",
                ServiceProvider: it.ServiceProvider ? it.ServiceProvider : "",
                Technology: it.Technology ? it.Technology : "",
                Name: "",
                cloudtype: 1
              }
            })) : []

          })
        })
      }
      //create IP structure
      if (response.OrderIPDetails && response.OrderIPDetails.orderIPDetail && response.OrderIPDetails.orderIPDetail.length > 0) {
        response.OrderIPDetails.orderIPDetail = response.OrderIPDetails.orderIPDetail.map(OrderBSPIP => {
          IPTCV = (((IPTCV) ? parseFloat(IPTCV) : 0) + ((OrderBSPIP.AMCValue) ? parseFloat(OrderBSPIP.AMCValue) : 0) + ((OrderBSPIP.LicenseValue) ? parseFloat(OrderBSPIP.LicenseValue) : 0)).toFixed(2);
          return Object.assign({
            wiproOrderid: '',
            OpportunityId: '',
            statecode: 0,
            WiproOpportunityIpId: OrderBSPIP.wipro_ordersipid ? OrderBSPIP.wipro_ordersipid : "",
            OrderIpId: OrderBSPIP.wipro_ordersipid ? OrderBSPIP.wipro_ordersipid : "",
            IpId: OrderBSPIP.IPId ? OrderBSPIP.IPId : "",
            IpName: OrderBSPIP.Name ? OrderBSPIP.Name : "",
            WiproModuleValue: OrderBSPIP.ModuleId ? OrderBSPIP.ModuleId : "",
            WiproModuleName: OrderBSPIP.Module ? OrderBSPIP.Module : "",
            WiproServiceline: OrderBSPIP.ServicelineId ? OrderBSPIP.ServicelineId : "",
            WiproServicelineName: OrderBSPIP.Serviceline ? OrderBSPIP.Serviceline : "",
            WiproPractice: OrderBSPIP.PracticeId ? OrderBSPIP.PracticeId : "",
            WiproPracticeName: OrderBSPIP.Practice ? OrderBSPIP.Practice : "",
            WiproSlbdmName: OrderBSPIP.SLBDM ? OrderBSPIP.SLBDM : "",
            WiproSlbdmValue: OrderBSPIP.SLBDMId ? OrderBSPIP.SLBDMId : "",
            PricingTypeId: OrderBSPIP.PricingTypeId ? OrderBSPIP.PricingTypeId : "",
            PricingTypeName: OrderBSPIP.PricingTypeName ? OrderBSPIP.PricingTypeName : "",
            WiproLicenseValue: OrderBSPIP.LicenseValue ? (parseFloat(OrderBSPIP.LicenseValue).toFixed(2)) : "",
            WiproAmcvalue: OrderBSPIP.AMCValue ? (parseFloat(OrderBSPIP.AMCValue).toFixed(2)) : "",
            WiproCloud: OrderBSPIP.Cloud ? JSON.parse(OrderBSPIP.Cloud) : false,
            WiproHolmesbdmID: OrderBSPIP.HolmesBDMId ? OrderBSPIP.HolmesBDMId : "",
            WiproHolmesbdmName: OrderBSPIP.HolmesBDM ? OrderBSPIP.HolmesBDM : "",
            WiproModuleContactId: OrderBSPIP.ModuleContractId ? OrderBSPIP.ModuleContractId : "",
            WiproModuleContactIdName: OrderBSPIP.ModuleContractName ? OrderBSPIP.ModuleContractName : "",
            disableHolmesBDM: (OrderBSPIP.ProductTypeId && OrderBSPIP.ProductTypeId == 4) ? false : true,
            disableModule: OrderBSPIP.ModuleId ? false : true,
            AdditionalSLDetails: OrderBSPIP.IPAdditionalDetails ? (OrderBSPIP.IPAdditionalDetails.map(IPadd => {
              return Object.assign({
                wipro_ordernumber: "",
                wipro_additionalsolutionvalue: IPadd.AdditionalSolutionValue ? IPadd.AdditionalSolutionValue : "",
                wipro_additionalvalueoftcv: IPadd.AdditionalValueOfTCV ? IPadd.AdditionalValueOfTCV : "",
                wipro_customizationcomments: IPadd.CustomizationComments ? IPadd.CustomizationComments : "",
                wipro_customizationvalue: IPadd.CustomizationValue ? IPadd.CustomizationValue : "",
                wipro_implementationcomment: IPadd.ImplementationComment ? IPadd.ImplementationComment : "",
                wipro_implementationvalues: IPadd.ImplementationValues ? IPadd.ImplementationValues : "",
                wipro_percentageoftcv: IPadd.PercentageOfTCV ? IPadd.PercentageOfTCV : "",
                wipro_professionalservicescomment: IPadd.ProfessionalServicesComment ? IPadd.ProfessionalServicesComment : "",
                wipro_professionalservicesvalues: IPadd.ProfessionalServicesValues ? IPadd.ProfessionalServicesValues : "",
                wipro_transactioncurrencyid: IPadd.TransactionCurrencyId ? IPadd.TransactionCurrencyId : "",
                wipro_name: IPadd.Name ? IPadd.Name : "",
                statecode: 0,
                OrderIPId: OrderBSPIP.wipro_ordersipid ? OrderBSPIP.wipro_ordersipid : "",
                wipro_orderipadditionaldetailid: IPadd.OrderIPAdditionalDetailId ? IPadd.OrderIPAdditionalDetailId : '',
                OrderIpAdditionalDetailsId: IPadd.OrderIPAdditionalDetailId ? IPadd.OrderIPAdditionalDetailId : ''
              })
            })) : [],
            CloudDetails: OrderBSPIP.IPCloudDetails ? (OrderBSPIP.IPCloudDetails.map(it => {
              return Object.assign({
                Functionid: it.Functionid ? parseInt(it.Functionid) : "",
                CategoryId: it.CategoryId ? parseInt(it.CategoryId) : "",
                ServiceProviderId: it.ServiceProviderId ? parseInt(it.ServiceProviderId) : "",
                TechnologyId: it.TechnologyId ? parseInt(it.TechnologyId) : "",
                OpenSource: it.OpenSource ? JSON.parse(it.OpenSource) : false,
                Value: it.Value ? parseFloat(it.Value).toFixed(2) : "",
                Remarks: it.Remarks ? it.Remarks : "",
                CloudStatecode: 0,
                Function: it.Function ? it.Function : "",
                Category: it.Category ? it.Category : "",
                ServiceProvider: it.ServiceProvider ? it.ServiceProvider : "",
                Technology: it.Technology ? it.Technology : "",
                Name: "",
                cloudtype: 2,
                CloudDetailsID: it.CloudDetailsID ? it.CloudDetailsID : "",
                OrderCloudDetailsId: it.CloudDetailsID ? it.CloudDetailsID : ""
              });
            })) : []

          })
        })
      }

      //create Solution structure
      if (response.Solutions && response.Solutions.order_Solution && response.Solutions.order_Solution.length > 0) {
        response.Solutions.order_Solution = response.Solutions.order_Solution.map(OrderBSPSol => {
          let tempIsDealRegistered =  OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 ? OrderBSPSol.DealRegistration[0].IsDealRegistered : "";
          return Object.assign({
            wiproOrderid: '',
            WiproOpportunityId: '',
            statecode: 0,
            WiproOpportunitySolutionDetailId: OrderBSPSol.WiproOpportunitySolutionDetailId ? OrderBSPSol.WiproOpportunitySolutionDetailId : "",
            OrderSolutionId: OrderBSPSol.WiproOpportunitySolutionDetailId ? OrderBSPSol.WiproOpportunitySolutionDetailId : "",
            WiproType: OrderBSPSol.WiproType ? OrderBSPSol.WiproType : "",
            WiproTypeName: OrderBSPSol.WiproTypeDisplay ? OrderBSPSol.WiproTypeDisplay : "",
            WiproAccountNameValue: OrderBSPSol.WiproAccountNameValue ? OrderBSPSol.WiproAccountNameValue : "",
            WiproAccountname: OrderBSPSol.WiproAccountname ? OrderBSPSol.WiproAccountname : "",
            OwnerIdValue: OrderBSPSol.OwnerIdValue ? OrderBSPSol.OwnerIdValue : "",
            OwnerIdValueName: OrderBSPSol.OwnerIdValueName ? OrderBSPSol.OwnerIdValueName : "",
            WiproPercentage: OrderBSPSol.WiproPercentage ? JSON.parse(OrderBSPSol.WiproPercentage) : false,
            WiproPercentageOfTCV: OrderBSPSol.WiproPercentageOfTCV ? (parseFloat(OrderBSPSol.WiproPercentageOfTCV).toFixed(2)) : "",
            WiproValue: OrderBSPSol.WiproValue ? (parseFloat(OrderBSPSol.WiproValue).toFixed(2)) : "",
            WiproSolutionBDMValue: OrderBSPSol.WiproSolutionBDMValue ? OrderBSPSol.WiproSolutionBDMValue : "",
            WiproSolutionBDMName: OrderBSPSol.WiproSolutionBDMName ? OrderBSPSol.WiproSolutionBDMName : "",
            WiproInfluenceType: OrderBSPSol.WiproInfluenceType ? OrderBSPSol.WiproInfluenceType : "",
            WiproInfluenceTypeName: OrderBSPSol.WiproInfluenceTypeDisplay ? OrderBSPSol.WiproInfluenceTypeDisplay : "",
            WiproServiceType: OrderBSPSol.WiproServiceType ? OrderBSPSol.WiproServiceType : "",
            WiproServiceTypeName: OrderBSPSol.WiproServiceTypeDisplay ? OrderBSPSol.WiproServiceTypeDisplay : "",
            IsDealRegistered : tempIsDealRegistered,
            DealRegistrationYes : new Array(Object.assign({
              DealRegistrationId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? OrderBSPSol.DealRegistration[0].DealRegistrationId : "",
              OrderDealRegistrationId : OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? OrderBSPSol.DealRegistration[0].DealRegistrationId : "",
              IsDealRegistered: tempIsDealRegistered,
              SolutionId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].SolutionId  ? OrderBSPSol.DealRegistration[0].SolutionId : "",
              PartnerPortalId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].PartnerPortalId && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].PartnerPortalId : "",
              RegisteredValue: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegisteredValue && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].RegisteredValue.toFixed(2) : "",
              RegistrationStatus: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatus && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].RegistrationStatus : "",
              RegistrationStatusName: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatusName && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].RegistrationStatusName : "",
              RegistrationStatusReason: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatusReason && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].RegistrationStatusReason : "",
              RegistrationStatusReasonName: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatusReasonName && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].RegistrationStatusReasonName : "",
              Remarks: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].Remarks && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration[0].Remarks : "",
              Statecode: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? 2 : 0,
          })) ,
          
            DealRegistrationNo : new Array(Object.assign({
              DealRegistrationId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? OrderBSPSol.DealRegistration[0].DealRegistrationId : "",
              OrderDealRegistrationId : OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? OrderBSPSol.DealRegistration[0].DealRegistrationId : "",
              IsDealRegistered: tempIsDealRegistered,
              SolutionId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].SolutionId  ? OrderBSPSol.DealRegistration[0].SolutionId : "",
              PartnerPortalId: "",
              RegisteredValue: "",
              RegistrationStatus: "",
              RegistrationStatusName: "",
              RegistrationStatusReason: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatusReason && tempIsDealRegistered === false ? OrderBSPSol.DealRegistration[0].RegistrationStatusReason : "",
              RegistrationStatusReasonName: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].RegistrationStatusReasonName && tempIsDealRegistered === false ? OrderBSPSol.DealRegistration[0].RegistrationStatusReasonName : "",
              Remarks: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].Remarks && tempIsDealRegistered === false ? OrderBSPSol.DealRegistration[0].Remarks : "",
              Statecode: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? 2 : 0,
          }))
          })

        })

      }

      response.OrderSltcv = SLTCV
      response.OrderIpTcv = IPTCV
      response.OrderOverallTcv = ((IPTCV ? parseFloat(IPTCV) : 0) + (SLTCV ? parseFloat(SLTCV) : 0)).toFixed(2);

      //create CA structure
      if (response.ServiceLineDetails && response.ServiceLineDetails.orderServicelineDetails && response.ServiceLineDetails.orderServicelineDetails.length > 0) {
        response.CreaditAllocations = response.ServiceLineDetails.orderServicelineDetails.map(OrderBSPSL => {
          return Object.assign({
            wiproOrderid: '',
            WiproOpportunityId: '',
            statecode: 0,
            WiproOpportunityCreditAllocationID: "",
            WiproOrderCreditAllocationID: "",
            SLCAID: OrderBSPSL.SLCAID ? OrderBSPSL.SLCAID : "",
            WiproIsDefault: true,
            WiproTypeId: 184450000,
            WiproTypeName: 'Service Line',
            ServicelineId: OrderBSPSL.WiproServicelineidValue ? OrderBSPSL.WiproServicelineidValue : "",
            ServicelineName: OrderBSPSL.WiproServicelineidValueName ? OrderBSPSL.WiproServicelineidValueName : "",
            PracticeId: OrderBSPSL.WiproPracticeId ? OrderBSPSL.WiproPracticeId : "",
            PracticeName: OrderBSPSL.WiproPracticeName ? OrderBSPSL.WiproPracticeName : "",
            SubPracticeId: OrderBSPSL.WiproSubpracticeid ? OrderBSPSL.WiproSubpracticeid : "",
            SubPracticeName: OrderBSPSL.WiproSubpracticeName ? OrderBSPSL.WiproSubpracticeName : "",
            ServicelineBDMId: OrderBSPSL.WiproSlbdmid ? OrderBSPSL.WiproSlbdmid : "",
            ServicelineBDMName: OrderBSPSL.WiproSlbdmidValueName ? OrderBSPSL.WiproSlbdmidValueName : "",
            WiproValue: OrderBSPSL.WiproEstsltcv ? (parseFloat(OrderBSPSL.WiproEstsltcv).toFixed(2)) : "",
            Contribution: "100.00"

          })

        })
        response.CreaditAllocations.push(Object.assign({
          wiproOrderid: '',
          WiproOpportunityId: '',
          statecode: 0,
          WiproOpportunityCreditAllocationID: "",
          WiproOrderCreditAllocationID: "",
          SLCAID: "",
          WiproIsDefault: true,
          WiproTypeId: 184450001,
          WiproTypeName: 'Vertical/Geo',
          ServicelineId: "",
          ServicelineName: "",
          PracticeId: "",
          PracticeName: "",
          SubPracticeId: "",
          SubPracticeName: "",
          ServicelineBDMId: VSOId ? VSOId : "",
          ServicelineBDMName: VSOName ? VSOName : "",
          WiproValue: response.OrderOverallTcv,
          Contribution: "100.00"
        }));

      }

      return response;
    } else {
      return of(null)
    }
  }

  //DPS Code ends

  getOrderDealRegistrationStatus() {
    return this.apiServiceOpportunity.get(routes.getDealRegistrationStatusUrl);
  }

  getOrderDealRegistrationReason(body) {
    return this.apiServiceOpportunity.post(routes.getDealRegistrationReasonUrl,body);
  }

  //Opportunity BS starts
  getOrderOpportunityBSDetails(OppId: string, VSOId: any, VSOName: any) {
    let body = { "Guid": OppId }
    return this.getOrderOpportunityBS(body).pipe(switchMap(res => {
      if (res) {
        console.log(res)
        return of((res && !res.IsError) ? { ...res, ResponseObject: (res.ResponseObject) ? this.filterOrderOpportunityBS(res.ResponseObject, VSOId, VSOName) : [] } : null)
      } else {
        return of(null)
      }
    }))
  }


  getOrderOpportunityBS(body) {
    return this.apiServiceOpportunity.post(routes.getOrderBusinessSolutionsUrl, body);
  }

  filterOrderOpportunityBS(response, VSOId: any, VSOName: any): Observable<any> {
    let SLTCV: any = '0.00';
    let IPTCV: any = '0.00';
    if (response) {
      //create Sl structure
      if (response.WiproServiceLineDtls && response.WiproServiceLineDtls.length > 0) {
        response.WiproServiceLineDtls = response.WiproServiceLineDtls.map(OrderBSPSL => {
          SLTCV = ((SLTCV ? parseFloat(SLTCV) : 0) + ((!OrderBSPSL.WiproDualCredit && OrderBSPSL.WiproEstsltcv) ? parseFloat(OrderBSPSL.WiproEstsltcv) : 0)).toFixed(2);
          return Object.assign({
            wiproOrderid: '',
            statecode: 0,
            OpportunityId: '',
            SLCAID: OrderBSPSL.SLCAID ? OrderBSPSL.SLCAID : "",
            WiproOpportunityServicelineDetailId: OrderBSPSL.WiproOpportunityServicelineDetailId ? OrderBSPSL.WiproOpportunityServicelineDetailId : '',
            WiproOpportunityServicelineOrderDetailId: OrderBSPSL.WiproOpportunityServicelineDetailId ? OrderBSPSL.WiproOpportunityServicelineDetailId : '',
            WiproServicelineidValue: OrderBSPSL.WiproServicelineidValue ? OrderBSPSL.WiproServicelineidValue : "",
            WiproServicelineidValueName: OrderBSPSL.WiproServicelineidValueName ? OrderBSPSL.WiproServicelineidValueName : "",
            WiproPracticeId: OrderBSPSL.WiproPracticeId ? OrderBSPSL.WiproPracticeId : "",
            WiproPracticeName: OrderBSPSL.WiproPracticeName ? OrderBSPSL.WiproPracticeName : "",
            WiproSubpracticeid: OrderBSPSL.WiproSubpracticeid ? OrderBSPSL.WiproSubpracticeid : "",
            WiproSubpracticeName: OrderBSPSL.WiproSubpracticeName ? OrderBSPSL.WiproSubpracticeName : "",
            WiproSlbdmidValueName: OrderBSPSL.WiproSlbdmidValueName ? OrderBSPSL.WiproSlbdmidValueName : "",
            WiproSlbdmid: OrderBSPSL.WiproSlbdmid ? OrderBSPSL.WiproSlbdmid : "",
            PricingTypeId: OrderBSPSL.PricingTypeId ? OrderBSPSL.PricingTypeId : "",
            PricingTypeName: OrderBSPSL.PricingTypeName ? OrderBSPSL.PricingTypeName : "",
            WiproPercentageOftcv: OrderBSPSL.WiproPercentageOftcv ? (parseFloat(OrderBSPSL.WiproPercentageOftcv).toFixed(2)) : "",
            WiproEstsltcv: OrderBSPSL.WiproEstsltcv ? (parseFloat(OrderBSPSL.WiproEstsltcv).toFixed(2)) : "",
            Cloud: OrderBSPSL.Cloud ? JSON.parse(OrderBSPSL.Cloud) : false,
            WiproEngagementModel: OrderBSPSL.WiproEngagementModel ? parseInt(OrderBSPSL.WiproEngagementModel) : "",
            WiproEngagementModelName: OrderBSPSL.WiproEngagementModelName ? OrderBSPSL.WiproEngagementModelName : "",
            WiproDualCredit: OrderBSPSL.WiproDualCredit ? parseInt(OrderBSPSL.WiproDualCredit) : "",
            WiproDualCreditName: OrderBSPSL.WiproDualCreditName ? OrderBSPSL.WiproDualCreditName : "",
            AdditionalServiceLinesCloudDetails: OrderBSPSL.AdditionalServiceLinesCloudDetails ? (OrderBSPSL.AdditionalServiceLinesCloudDetails.map(it => {
              return {
                CategoryId: it.WiproCategory ? it.WiproCategory : "",
                Functionid: it.WiproFunction ? it.WiproFunction : "",
                OpenSource: it.WiproOpensource ? JSON.parse(it.WiproOpensource) : false,
                Remarks: it.WiproRemarks ? it.WiproRemarks : "",
                ServiceProviderId: it.WiproServiceprovider ? it.WiproServiceprovider : "",
                TechnologyId: it.WiproTechnology ? it.WiproTechnology : "",
                Value: it.WiproValue ? parseFloat(it.WiproValue).toFixed(2) : "",
                CloudDetailsID: it.WiproOpportunityCloudDetailid ? it.WiproOpportunityCloudDetailid : "",
                OrderCloudDetailsId: it.WiproOpportunityCloudDetailid ? it.WiproOpportunityCloudDetailid : "",
                CloudStatecode: 0,
                Function: it.Function ? it.Function : "",
                Category: it.Category ? it.Category : "",
                ServiceProvider: it.ServiceProvider ? it.ServiceProvider : "",
                Technology: it.Technology ? it.Technology : "",
                Name: "",
                cloudtype: 1
              }
            })) : []

          })
        })
      }
      //create IP structure
      if (response.WiproAllIPDetails && response.WiproAllIPDetails.length > 0) {
        response.WiproAllIPDetails = response.WiproAllIPDetails.map(OrderBSPIP => {
          IPTCV = (((IPTCV) ? parseFloat(IPTCV) : 0) + ((OrderBSPIP.WiproAmcvalue) ? parseFloat(OrderBSPIP.WiproAmcvalue) : 0) + ((OrderBSPIP.WiproLicenseValue) ? parseFloat(OrderBSPIP.WiproLicenseValue) : 0)).toFixed(2);
          return Object.assign({
            wiproOrderid: '',
            OpportunityId: '',
            statecode: 0,
            WiproOpportunityIpId: OrderBSPIP.WiproOpportunityIpId ? OrderBSPIP.WiproOpportunityIpId : "",
            OrderIpId: OrderBSPIP.WiproOpportunityIpId ? OrderBSPIP.WiproOpportunityIpId : "",
            IpId: OrderBSPIP.IpId ? OrderBSPIP.IpId : "",
            IpName: OrderBSPIP.IpName ? OrderBSPIP.IpName : "",
            WiproModuleValue: OrderBSPIP.WiproModuleValue ? OrderBSPIP.WiproModuleValue : "",
            WiproModuleName: OrderBSPIP.WiproModuleName ? OrderBSPIP.WiproModuleName : "",
            WiproServiceline: OrderBSPIP.WiproServiceline ? OrderBSPIP.WiproServiceline : "",
            WiproServicelineName: OrderBSPIP.WiproServicelineName ? OrderBSPIP.WiproServicelineName : "",
            WiproPractice: OrderBSPIP.WiproPractice ? OrderBSPIP.WiproPractice : "",
            WiproPracticeName: OrderBSPIP.WiproPracticeName ? OrderBSPIP.WiproPracticeName : "",
            WiproSlbdmName: OrderBSPIP.WiproSlbdmName ? OrderBSPIP.WiproSlbdmName : "",
            WiproSlbdmValue: OrderBSPIP.WiproSlbdmValue ? OrderBSPIP.WiproSlbdmValue : "",
            PricingTypeId: OrderBSPIP.PricingTypeId ? OrderBSPIP.PricingTypeId : "",
            PricingTypeName: OrderBSPIP.PricingTypeName ? OrderBSPIP.PricingTypeName : "",
            WiproLicenseValue: OrderBSPIP.WiproLicenseValue ? (parseFloat(OrderBSPIP.WiproLicenseValue).toFixed(2)) : "",
            WiproAmcvalue: OrderBSPIP.WiproAmcvalue ? (parseFloat(OrderBSPIP.WiproAmcvalue).toFixed(2)) : "",
            WiproCloud: OrderBSPIP.WiproCloud ? JSON.parse(OrderBSPIP.WiproCloud) : false,
            WiproHolmesbdmID: OrderBSPIP.WiproHolmesbdmID ? OrderBSPIP.WiproHolmesbdmID : "",
            WiproHolmesbdmName: OrderBSPIP.WiproHolmesbdmName ? OrderBSPIP.WiproHolmesbdmName : "",
            WiproModuleContactId: OrderBSPIP.WiproModuleContactId ? OrderBSPIP.WiproModuleContactId : "",
            WiproModuleContactIdName: OrderBSPIP.WiproModuleContactIdName ? OrderBSPIP.WiproModuleContactIdName : "",
            disableHolmesBDM: OrderBSPIP.WiproHolmesbdmID ? false : true,
            disableModule: OrderBSPIP.WiproModuleValue ? false : true,
            AdditionalSLDetails: OrderBSPIP.AdditionalSLDetails ? (OrderBSPIP.AdditionalSLDetails.map(IPadd => {
              return Object.assign({
                wipro_ordernumber: "",
                wipro_additionalsolutionvalue: IPadd.WiproadditionalSolutionValue ? IPadd.WiproadditionalSolutionValue : "",
                wipro_additionalvalueoftcv: IPadd.WiproadditionalValueOfTCV ? IPadd.WiproadditionalValueOfTCV : "",
                wipro_customizationcomments: IPadd.WiprocustomizationComments ? IPadd.WiprocustomizationComments : "",
                wipro_customizationvalue: IPadd.WiproAbsolutevalue ? IPadd.WiproAbsolutevalue : "",
                wipro_implementationcomment: IPadd.WiproImplementationComments ? IPadd.WiproImplementationComments : "",
                wipro_implementationvalues: IPadd.WiproImplementationValue ? IPadd.WiproImplementationValue : "",
                wipro_percentageoftcv: IPadd.WiproPercentageoftcv ? IPadd.WiproPercentageoftcv : "",
                wipro_professionalservicescomment: IPadd.WiproProfessionaServicesComments ? IPadd.WiproProfessionaServicesComments : "",
                wipro_professionalservicesvalues: IPadd.WiproProfessionalServicesValue ? IPadd.WiproProfessionalServicesValue : "",
                wipro_transactioncurrencyid: IPadd.TransactionCurrencyIdValue ? IPadd.TransactionCurrencyIdValue : "",
                wipro_name: IPadd.WiproName ? IPadd.WiproName : "",
                statecode: 0,
                OrderIPId: OrderBSPIP.WiproOpportunityIpId ? OrderBSPIP.WiproOpportunityIpId : "",
                wipro_orderipadditionaldetailid: IPadd.WiproOpportunityIpAdditionaInfoid ? IPadd.WiproOpportunityIpAdditionaInfoid : "",
                OrderIpAdditionalDetailsId: IPadd.WiproOpportunityIpAdditionaInfoid ? IPadd.WiproOpportunityIpAdditionaInfoid : ""
              })
            })) : [],
            CloudDetails: OrderBSPIP.CloudDetails ? (OrderBSPIP.CloudDetails.map(it => {
              return Object.assign({
                Functionid: it.WiproFunction ? it.WiproFunction : "",
                CategoryId: it.WiproCategory ? it.WiproCategory : "",
                ServiceProviderId: it.WiproServiceProvider ? it.WiproServiceProvider : "",
                TechnologyId: it.WiproTechnology ? it.WiproTechnology : "",
                OpenSource: it.WiproOpenSource ? JSON.parse(it.WiproOpenSource) : false,
                Value: it.WiproValue ? parseFloat(it.WiproValue).toFixed(2) : "",
                Remarks: it.WiproRemarks ? it.WiproRemarks : "",
                CloudStatecode: 0,
                Function: it.Function ? it.Function : "",
                Category: it.Category ? it.Category : "",
                ServiceProvider: it.ServiceProvider ? it.ServiceProvider : "",
                Technology: it.Technology ? it.Technology : "",
                Name: "",
                cloudtype: 2,
                CloudDetailsID: it.WiproOpportunityCloudDetailid ? it.WiproOpportunityCloudDetailid : "",
                OrderCloudDetailsId: it.WiproOpportunityCloudDetailid ? it.WiproOpportunityCloudDetailid : ""
              });
            })) : []

          })
        })
      }

      //create Solution structure
      if (response.WiproBusinessSolutionDtls && response.WiproBusinessSolutionDtls.length > 0) {
        response.WiproBusinessSolutionDtls = response.WiproBusinessSolutionDtls.map(OrderBSPSol => {
          let tempIsDealRegistered =  OrderBSPSol.DealRegistration && (Object.keys(OrderBSPSol.DealRegistration).some(it => it == 'IsDealRegistered')) ? OrderBSPSol.DealRegistration.IsDealRegistered : "";
          return Object.assign({
            wiproOrderid: '',
            WiproOpportunityId: '',
            statecode: 0,
            WiproOpportunitySolutionDetailId: OrderBSPSol.WiproOpportunitySolutionDetailId ? OrderBSPSol.WiproOpportunitySolutionDetailId : "",
            OrderSolutionId: OrderBSPSol.WiproOpportunitySolutionDetailId ? OrderBSPSol.WiproOpportunitySolutionDetailId : "",
            WiproType: OrderBSPSol.WiproType ? OrderBSPSol.WiproType : "",
            WiproTypeName: OrderBSPSol.WiproTypeName ? OrderBSPSol.WiproTypeName : "",
            WiproAccountNameValue: OrderBSPSol.WiproAccountNameValue ? OrderBSPSol.WiproAccountNameValue : "",
            WiproAccountname: OrderBSPSol.WiproAccountname ? OrderBSPSol.WiproAccountname : "",
            OwnerIdValue: OrderBSPSol.OwnerIdValue ? OrderBSPSol.OwnerIdValue : "",
            OwnerIdValueName: OrderBSPSol.OwnerIdValueName ? OrderBSPSol.OwnerIdValueName : "",
            WiproPercentage: OrderBSPSol.WiproPercentage ? JSON.parse(OrderBSPSol.WiproPercentage) : false,
            WiproPercentageOfTCV: OrderBSPSol.WiproPercentageOfTCV ? (parseFloat(OrderBSPSol.WiproPercentageOfTCV).toFixed(2)) : "",
            WiproValue: OrderBSPSol.WiproValue ? (parseFloat(OrderBSPSol.WiproValue).toFixed(2)) : "",
            WiproSolutionBDMValue: OrderBSPSol.WiproSolutionBDMValue ? OrderBSPSol.WiproSolutionBDMValue : "",
            WiproSolutionBDMName: OrderBSPSol.WiproSolutionBDMName ? OrderBSPSol.WiproSolutionBDMName : "",
            WiproInfluenceType: OrderBSPSol.WiproInfluenceType ? OrderBSPSol.WiproInfluenceType : "",
            WiproInfluenceTypeName: OrderBSPSol.WiproInfluenceTypeName ? OrderBSPSol.WiproInfluenceTypeName : "",
            WiproServiceType: OrderBSPSol.WiproServiceType ? OrderBSPSol.WiproServiceType : "",
            WiproServiceTypeName: OrderBSPSol.WiproServiceTypeName ? OrderBSPSol.WiproServiceTypeName : "",
            IsDealRegistered : tempIsDealRegistered,
            DealRegistrationYes : new Array(Object.assign({
              DealRegistrationId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.DealRegistrationId ? OrderBSPSol.DealRegistration.DealRegistrationId : "",
              OrderDealRegistrationId : OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.DealRegistrationId ? OrderBSPSol.DealRegistration.DealRegistrationId : "",
              IsDealRegistered: tempIsDealRegistered,
              SolutionId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.SolutionId  ? OrderBSPSol.DealRegistration.SolutionId : "",
              PartnerPortalId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.PartnerPortalId && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration.PartnerPortalId : "",
              RegisteredValue: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.RegisteredValue && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration.RegisteredValue.toFixed(2) : "",
              RegistrationStatus: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.RegistrationStatus && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration.RegistrationStatus : "",
              RegistrationStatusName: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.RegistrationStatusName && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration.RegistrationStatusName : "",
              RegistrationStatusReason: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.RegistrationStatusReason && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration.RegistrationStatusReason : "",
              RegistrationStatusReasonName: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.RegistrationStatusReasonName && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration.RegistrationStatusReasonName : "",
              Remarks: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.Remarks && tempIsDealRegistered === true ? OrderBSPSol.DealRegistration.Remarks : "",
              Statecode: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? 2 : 0,
          })) ,
          
            DealRegistrationNo : new Array(Object.assign({
              DealRegistrationId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.DealRegistrationId ? OrderBSPSol.DealRegistration.DealRegistrationId : "",
              OrderDealRegistrationId : OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.DealRegistrationId ? OrderBSPSol.DealRegistration.DealRegistrationId : "",
              IsDealRegistered: tempIsDealRegistered,
              SolutionId: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.SolutionId  ? OrderBSPSol.DealRegistration.SolutionId : "",
              PartnerPortalId: "",
              RegisteredValue: "",
              RegistrationStatus: "",
              RegistrationStatusName: "",
              RegistrationStatusReason: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.RegistrationStatusReason && tempIsDealRegistered === false ? OrderBSPSol.DealRegistration.RegistrationStatusReason : "",
              RegistrationStatusReasonName: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.RegistrationStatusReasonName && tempIsDealRegistered === false ? OrderBSPSol.DealRegistration.RegistrationStatusReasonName : "",
              Remarks: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.Remarks && tempIsDealRegistered === false ? OrderBSPSol.DealRegistration.Remarks : "",
              Statecode: OrderBSPSol.DealRegistration && OrderBSPSol.DealRegistration.length > 0 && OrderBSPSol.DealRegistration[0].DealRegistrationId ? 2 : 0,
          }))
          })

        })

      }

      response.OrderSltcv = SLTCV
      response.OrderIpTcv = IPTCV
      response.OrderOverallTcv = ((IPTCV ? parseFloat(IPTCV) : 0) + (SLTCV ? parseFloat(SLTCV) : 0)).toFixed(2);

      //create CA structure
      if (response.WiproServiceLineDtls && response.WiproServiceLineDtls.length > 0) {
        response.CreditAllocationsDetails = response.WiproServiceLineDtls.map(OrderBSPSL => {
          return Object.assign({
            wiproOrderid: '',
            WiproOpportunityId: '',
            statecode: 0,
            WiproOpportunityCreditAllocationID: "",
            WiproOrderCreditAllocationID: "",
            SLCAID: OrderBSPSL.SLCAID ? OrderBSPSL.SLCAID : "",
            WiproIsDefault: true,
            WiproTypeId: 184450000,
            WiproTypeName: 'Service Line',
            ServicelineId: OrderBSPSL.WiproServicelineidValue ? OrderBSPSL.WiproServicelineidValue : "",
            ServicelineName: OrderBSPSL.WiproServicelineidValueName ? OrderBSPSL.WiproServicelineidValueName : "",
            PracticeId: OrderBSPSL.WiproPracticeId ? OrderBSPSL.WiproPracticeId : "",
            PracticeName: OrderBSPSL.WiproPracticeName ? OrderBSPSL.WiproPracticeName : "",
            SubPracticeId: OrderBSPSL.WiproSubpracticeid ? OrderBSPSL.WiproSubpracticeid : "",
            SubPracticeName: OrderBSPSL.WiproSubpracticeName ? OrderBSPSL.WiproSubpracticeName : "",
            ServicelineBDMId: OrderBSPSL.WiproSlbdmid ? OrderBSPSL.WiproSlbdmid : "",
            ServicelineBDMName: OrderBSPSL.WiproSlbdmidValueName ? OrderBSPSL.WiproSlbdmidValueName : "",
            WiproValue: OrderBSPSL.WiproEstsltcv ? (parseFloat(OrderBSPSL.WiproEstsltcv).toFixed(2)) : "",
            Contribution: "100.00"
          })

        })

        response.CreditAllocationsDetails.push(Object.assign({
          wiproOrderid: '',
          WiproOpportunityId: '',
          statecode: 0,
          WiproOpportunityCreditAllocationID: "",
          WiproOrderCreditAllocationID: "",
          SLCAID: "",
          WiproIsDefault: true,
          WiproTypeId: 184450001,
          WiproTypeName: 'Vertical/Geo',
          ServicelineId: "",
          ServicelineName: "",
          PracticeId: "",
          PracticeName: "",
          SubPracticeId: "",
          SubPracticeName: "",
          ServicelineBDMId: VSOId ? VSOId : "",
          ServicelineBDMName: VSOName ? VSOName : "",
          WiproValue: response.OrderOverallTcv,
          Contribution: "100.00"
        }));
      }


      return response;
    } else {
      return of(null)
    }
  }


  //Opportunity BS Ends



  saveOBAllocation(saveObj: any): Observable<any> {
    return this.apiServiceOrder.post(routes.saveOBAllocationUrl, saveObj);
  }

  saveModifyOBAllocation(saveObj: any): Observable<any> {
    return this.apiServiceOrder.post(routes.saveModifyOBAllocationUrl, saveObj);
  }



  getSLPracSubprac(): Observable<any> {
    return this.apiServiceOrder.post(routes.getSLPracSubpracUrl);
  }



  //***********************************************Order page Function Calls Ends Sumit********************//
  // *******************Knowledge Management************************

  // KM Overview
  getKMOverviewDetails(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getKMOverviewDetails, body);
  }

  // KM Document
  getKMDocumentDetailsData(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getKMDocumentDetails, body)
  }

  getKMDocumentType(): Observable<any> {
    return this.apiServiceOpportunity.post(routes.getKMDocumentDetailType);
  }

  DeleteKMDocument(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.delKMDocument, body);
  }

  createUpdateKMDocumentData(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.createUpdateKMDocument, body)
  }

  updateKMAttachmentData(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.updateKMAttachment, body)
  }

  getDocSanitizedDetails(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getDocSanitized, body)
  }

  updateDocSanitizedDetails(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.updateDocSanitized, body)
  }

  // Win Loss resons
  winKMDetails(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getKMWinCategory, body);
  }
  lossKMDetails(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getKMLossCategory, body);
  }

  // SME
  getSMEData(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getSME, body)
  }

  getKMSMEDetails(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getSMEDetails, body)
  }

  createUpdateKMSME(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.createUpdateSME, body)
  }

  deleteSMEData(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.deleteSME, body)
  }

  // file upload KM to get blob url
  uploadNote(newNotesData): Promise<any> {
    const url = "https://quapi-qa.wipro.com/L2O.Sprint1_2.Api/api/Storage/UploadDocument";
    const fd = new FormData();
    return new Promise((resolve, reject) => {
      console.log("data to upload inside xml", newNotesData)
      fd.append("Files", newNotesData, newNotesData.name);
      let xhr = new XMLHttpRequest();
      xhr.open('post', url, true);
      xhr.send(fd);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          console.log("data to upload inside xhr", xhr.readyState)
          if (xhr.status === 201) {
            resolve(JSON.parse(xhr.response));
          }
          else {
            reject(xhr.response);
          }
        }
      }

    })

  }

  addRoleBaseAccess(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.roleBaseAccees, body)
  }

  // Order Mofification
  submitForOrderModification(body: any): Observable<any> {
    return this.commundaService.camunda_post(routes.submitOrderModification, body)
  }

  //Order Modification ICM check 
  contractStatus(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.validateContractStatus, body)
  }

  createResidualOpportunity(body: any): Observable<any> {
    return this.apiServiceOpportunity.post(routes.createResidualOpp, body)
  }

  // Order modification submit flag subject
  orderModificationFlag = new Subject<any>();

  getSubmitModificationFlag(): Observable<any> {
    return this.orderModificationFlag.asObservable();
  }
  setSubmitModificationFlag(flag: any) {
    this.orderModificationFlag.next(flag);
  }
  // Order modification submit flag subject


  // BFM Approval start

  bfmApprovalStatus = new Subject<any>();

  BFMNavagationFlag: boolean = false;

  getBFMStatus(): Observable<any> {
    return this.bfmApprovalStatus.asObservable();
  }
  updateBFMStatus(status: any) {
    this.bfmApprovalStatus.next(status);
  }

  // Get the data from order landing to bfm approval
  bfm_data = new BehaviorSubject<any>(null);
  editBFM_Data: Observable<any> = this.bfm_data.asObservable();

  sendBFMData(data: any) {
    this.bfm_data.next(data);
  }

  getOnHoldReasons(): Observable<any> {
    return this.apiServiceOpportunity.get(routes.getOnHoldReasons)
  }

  getExceptionaApproval(): Observable<any> {
    return this.apiServiceOpportunity.get(routes.getExceptionApproval)
  }

  getApprovalDoc(): Observable<any> {
    return this.apiServiceOpportunity.get(routes.getApprovalDoc)
  }

  // get order approval log
  getOrderApprovalLog(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getOrderApprovalLog, body);
  }

  // order checklist approval list
  getOrderReview(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getOrderReviewUrl, body);
  }

  // order checklist reject comment
  createCommentApproval(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.createApprovalCommentCheck, body)
  }

  resettingBFMVerificationCkecks(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.resetBFMVerificationChecks, body)
  }

  // reject, on-hold, approve order by bfm
  reject_onhold_approval_BFMOrder(body: any): Observable<any> {
    return this.commundaService.camunda_post(routes.rejectBFMAppOrder, body);
  }

  salesOrderReviewByOwner(body: any): Observable<any> {
    return this.commundaService.camunda_post(routes.salesOrderOwnwerReview, body)
  }

  invoicingOrderByBFM(body: any): Observable<any> {
    return this.commundaService.camunda_post(routes.invocingbyBFM, body)
  }

  confirmOrderByBFM(body: any): Observable<any> {
    return this.commundaService.camunda_post(routes.confirmOrderbyBFM, body)
  }

  confirmOrderReviewByOwner(body: any): Observable<any> {
    return this.commundaService.camunda_post(routes.confirmOrderOwnerReview, body)
  }

  // BFM APPRoval Location

  getApprovalCountry(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getApprovelCountry, body)
  }

  getApprovalCity(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getApprovalCity, body)
  }

  getApprovalPlant(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getApprovalPlant, body)
  }

  getApprovalLocation(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getApprovalLocation, body)
  }

  getLocationsbySeach(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.searchApprovalLocation, body)
  }

  // BFM APPRoval Location



  // BFM Approval ends

  getBFMUsersForRequestInvoice(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.GetBFMForRequestInvoicing, body);
  }

  getAllActiveTeamBfmWt(body): Observable<any> {
    return this.apiServiceOrder.post(routes.activeTeamForWtOpportunity, body);
  }
  getActiveAccountDmTeam(body): Observable<any> {
    return this.apiServiceOrder.post(routes.getAccountForDMTeamById, body);
  }
  getAdhBdhForWtOpportunity(body): Observable<any> {
    return this.apiServiceOrder.post(routes.OrderApproversADHBDH, body);
  }
  // getAdhBdhForNWtOpportunity(body):Observable<any>{
  //    return this.apiServiceOrder.post(routes.getAccountForDMTeamById, body);
  // }
  getAllActiveTeamBfmForNWt(body): Observable<any> {
    return this.apiServiceOrder.post(routes.BFMForNonWTOpportunityFm, body);
  }
  getActiveAccountDmTeamForNwt(body): Observable<any> {
    return this.apiServiceOrder.post(routes.BFMForNonWTOpportunityDm, body);
  }
  submitOrderApproval(body): Observable<any> {
    return this.commundaService.camunda_post(routes.createSalesOrderApproval, body);
  }
  submitOrderAdhApproval(body): Observable<any> {
    return this.commundaService.camunda_post(routes.createAdhOrderApproval, body);
  }
  acceptAdhNwtAprrovalOrder(body): Observable<any> {
    return this.commundaService.camunda_post(routes.acceptAdhApproval, body);
  }
  //submit for ForeClosure Request
  submitForeclosureRequest(body): Observable<any> {
    return this.commundaService.camunda_post(routes.foreclosureRequest, body);
  }
  //submit for invoice
  submitInvoiceRequest(body): Observable<any> {
    return this.commundaService.camunda_post(routes.invoiceRequest, body);
  }

  getEmailHistory(body): Observable<any> {
    //let  UserId=localStorage.getItem('userID').toString();

    console.log("jsonObj", body)
    return this.apiServiceOrder.post(routes.getEmailHistory, body);
  }
  getViewEmailhistory(body): Observable<any> {
    console.log("jsonObj", body)
    return this.apiServiceOrder.post(routes.getViewEmailhistory, body);
  }
  getRoleListForOrderListing(body): Observable<any> {
    return this.apiServiceOpportunity.post(routes.GetUserRoleForOrderListing, body);
  }
  saveForeClosureDm(body): Observable<any> {
    return this.commundaService.camunda_post(routes.foreClosureDMApproval, body);
  }
  submitDMApproval(body): Observable<any> {
    return this.commundaService.camunda_post(routes.acceptDMApproval, body);
  }
  submitConfirmOrderApproval(body): Observable<any> {
    return this.commundaService.camunda_post(routes.createConfirmedOrder, body);
  }


  //saurav code starts

  getModificationDetails(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.getModificationRequestsForSalesOrder, body)
  }

  //vertical Sales Owner
  getVerticalsalesOwnerList(body: any): Observable<any> {
    return this.apiServiceOpportunity.post(routes.getVerticalSalesOwner, body);
  }

  //resons
  getReason(): Observable<any> {
    return this.apiServiceOpportunity.get(routes.getReason);
  }


  getDocuments(body): Observable<any> {
    return this.apiServiceOrder.post(routes.getDocuments, body);
  }

  getOrderContractStatus(body): Observable<any> {
    return this.apiServiceOrder.post(routes.getOrderContractStatus, body);
  }

  uploadDocuments(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.uploadDocuments, body);
  }
  //assign order
  AssignOrderToUser(body: any): Observable<any> {
    return this.apiServiceOrder.post(routes.AssignOrderToUser, body);
  }
  getFilterSwitchListData(data): Observable<any> {
    console.log('service Header name', data.filterData.headerName)
    switch (data.filterData.headerName) {
      case "OrderId": {
        console.log("OrderId")
        return this.getListOforderId(data)
      }
      case "ApprovalType":

        return this.fetchApprovalType(data);

      case "Type": {
        console.log("Type")
        return this.getListOforderType(data);
      }
      case "OrderTcv": {
        console.log("OrderTcv")
        return this.getListOforderTcv(data);
      }
      case "StartDate": {
        console.log("StartDate")
        return this.getListOfStartDate(data);
      }
      case "EndDate": {
        console.log("EndDate")
        return this.getListOfEndDate(data);
      }
      case "Status": {
        console.log("Status")
        return this.getListOfStatus(data);
      }
      case "AccountName": {
        console.log("AccountName")
        return this.getListOfaccountName(data);
      }
      case "PricingType": {
        console.log("PricingType")
        return this.getListofpricingType(data);
      }
      case "OpportunityName": {
        console.log("OpportunityName")
        return this.getListOfOpportunityName(data);
      }
      case "OpportunityId": {
        console.log("OpportunityId")
        return this.getListOfOpportunityId(data);
      }
      case "SAPCustomerCode": {
        console.log("SAPCustomerCode")
        return this.getListOfSAPCustomerCode(data);
      }
      case "CreatedOn": {
        console.log("CreatedOn")
        return this.getListOfCreatedOn(data);
      }
      case "OrderOwner": {
        console.log("OrderOwner")
        return this.getListOfOrderOwner(data);
      }
    }
    return of([])
  }

  getListOfStatus(data): Observable<any> {
    console.log('getListOfStatus', data)
    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getStatusListNames(body).pipe(switchMap((res: any) => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterNameColumndata(res.ResponseObject) } : [])
    }))
  }

  getStatusListNames(body): Observable<any> {
    return this.apiServiceOrder.post(routes.ListOfStatus, body)
  }

  GetOrderForListingPageFilter(body) {
    return this.apiServiceOrder.post(routes.GetOrderForListingPageFilter, body)
  }

  filterNameColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.Id,
            name: x.Name,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  //Filter for orderId column
  getListOforderId(data): Observable<any> {
    console.log('getListOfStatus', data)
    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getOrderIdListNames(body).pipe(switchMap((res: any) => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterOrderIdColumndata(res.ResponseObject) } : [])
    }))
  }

  getOrderIdListNames(body): Observable<any> {
    return this.apiServiceOrder.post(routes.SearchOrderIdColumn, body)
  }
  filterOrderIdColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.OrderNumber,
            name: x.OrderNumber,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  /**
   * @description : Fetch the list for the approval type filter
   */

  fetchApprovalType(data): Observable<any> {

    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.fetchApprovalTypesAPI(body).pipe(switchMap((res: any) => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterApprovalTypes(res.ResponseObject) } : [])
    }))
  }

  fetchApprovalTypesAPI(body): Observable<any> {
    return this.apiServiceOrder.post(routes.fetchAprovalTypesForFilter, body)
  }


  filterApprovalTypes(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.Id,
            name: x.Name,
            value: x.Value,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }


  //  Ends : Approval type filter




  //SearchOrderTCVColumn
  getListOforderTcv(data): Observable<any> {
    console.log('getListOfStatus', data)
    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": '',// data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getOrderTcvListNames(body).pipe(switchMap((res: any) => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterOrderTcvColumndata(res.ResponseObject) } : [])
    }))
  }

  getOrderTcvListNames(body): Observable<any> {
    return this.apiServiceOrder.post(routes.SearchOrderTCVColumn, body)
  }
  filterOrderTcvColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.OverallOrderTCVDisplay,
            name: x.OverallOrderTCVDisplay,
            OverallOrderTCV: x.OverallOrderTCV,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  //ordertype
  getListOforderType(data): Observable<any> {
    console.log('getListOfordertype', data)
    let body = {

      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": '', //data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getorderTypeListNames(body).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterorderTypeColumndata(res.ResponseObject) } : [])
    }))
  }

  getorderTypeListNames(body): Observable<any> {

    return this.apiServiceOpportunity.get(routes.ListOforderType, body)
  }


  filterorderTypeColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.Id,
            name: x.Name,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  //startdate
  getListOfStartDate(data): Observable<any> {
    console.log('getListOfStartdate', data)
    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": '',// data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getStartDateListNames(body).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterStartDateColumndata(res.ResponseObject) } : [])
    }))
  }

  getStartDateListNames(body): Observable<any> {

    return this.apiServiceOrder.post(routes.ListOfStartdates, body)
  }
  filterStartDateColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.Id,
            name: x.StartDate,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  //end date

  getListOfEndDate(data): Observable<any> {
    console.log('getListOfendate', data)
    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo | 1,
      "SearchText": '',// data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getEndDateListNames(body).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterEndDateColumndata(res.ResponseObject) } : [])
    }))
  }

  getEndDateListNames(body): Observable<any> {

    return this.apiServiceOrder.post(routes.ListOfEnddates, body)
  }
  filterEndDateColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.EndDate,
            name: x.EndDate,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }
  //pricing type

  getListofpricingType(data): Observable<any> {
    console.log('getListOfpricing', data)
    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": '',// data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getpricingListNames(body).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterpricingColumndata(res.ResponseObject) } : [])
    }))
  }

  getpricingListNames(body): Observable<any> {

    return this.apiServiceOpportunity.get(routes.ListOfPricingtype, body)
  }
  filterpricingColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.Id,
            name: x.Name,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  //account name

  getListOfaccountName(data): Observable<any> {
    console.log('getListOfaccount', data)
    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getAccountListNames(body).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filteraccountColumndata(res.ResponseObject) } : [])
    }))
  }

  getAccountListNames(body): Observable<any> {

    return this.apiServiceOpportunity.post(routes.ListOfAccountname, body)
  }
  filteraccountColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.SysGuid,
            name: x.Name,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }
  getListOfOpportunityName(data): Observable<any> {
    console.log('getListOfOpportunityName', data)
    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getOpportunityNameList(body).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterOpportunityNameColumndata(res.ResponseObject) } : [])
    }))
  }

  getOpportunityNameList(body): Observable<any> {
    return this.apiServiceOrder.post(routes.ListOfOpportunityNames, body)
  }



  filterOpportunityNameColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.SysGuid,
            name: x.Name,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }
  getListOfOpportunityId(data): Observable<any> {
    console.log('getListOfOpportunityId', data)
    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getOpportunityIdList(body).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterOpportunityIdColumndata(res.ResponseObject) } : [])
    }))
  }

  getOpportunityIdList(body): Observable<any> {
    return this.apiServiceOrder.post(routes.ListOpportunityId, body)
  }

  filterOpportunityIdColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.Name,
            name: x.Name,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }
  getListOfCreatedOn(data): Observable<any> {
    console.log('getListOfCreatedOn', data)
    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": '',// data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getCreatedOnList(body).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterCreatedOnColumndata(res.ResponseObject) } : [])
    }))
  }

  getCreatedOnList(body): Observable<any> {
    return this.apiServiceOrder.post(routes.ListOfCreatedOn, body)
  }
  filterCreatedOnColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.CreatedOn,
            name: x.CreatedOn,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }

  getListOfSAPCustomerCode(data): Observable<any> {
    console.log('getListOfSAPCustomerCode', data)
    let body = {
      "PageSize": 10,
      "RequestedPageNumber": data.useFulldata.pageNo,
      "SearchText": data.useFulldata.searchVal,
      "RoleId": data.useFulldata.RoleId,
      "Status": "",
      "UserGuid": data.useFulldata.UserGuid,
      "OdatanextLink": data.useFulldata.nextLink
    }

    return this.getSAPCustomerCodeList(body).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterSAPCustomerCodeColumndata(res.ResponseObject) } : [])
    }))
  }

  getSAPCustomerCodeList(body): Observable<any> {
    return this.apiServiceOrder.post(routes.ListOfSapCustomerCode, body)
  }



  filterSAPCustomerCodeColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.SysGuid,
            name: x.Name,
            isDatafiltered: false
          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }
  //orderOwner
  getListOfOrderOwner(data): Observable<any> {
    console.log('getListOfOrderOwner', data)
    let body = {
      // "PageSize": 10,
      // "RequestedPageNumber":data.useFulldata.pageNo,
      // "OdatanextLink": data.useFulldata.nextLink
      "SearchText": data.useFulldata.searchVal,
      "SearchType": 6,
      "PageSize": 10,
      "RequestedPageNumber": 1,
      "OdatanextLink": ""
    }

    return this.getOrderOwnerList(body).pipe(switchMap(res => {
      return of((!res.IsError) ? { ...res, ResponseObject: this.filterOrderOwnerColumndata(res.ResponseObject) } : [])
    }))
  }

  getOrderOwnerList(body): Observable<any> {
    return this.apiServiceOpportunity.post(routes.ListOfOrderOwner, body)
  }

  // GetOrderOwnerForListingPageFilter(body) {
  //    return this.apiServiceOrder.post(routes.GetOrderForListingPageFilter, body)
  // }

  filterOrderOwnerColumndata(data) {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            id: x.ownerId,
            name: x.FullName,
            Email: x.Email,
            isDatafiltered: false

          }
        })
      } else {
        return []
      }
    } else {
      return []
    }
  }
  // assign order
  // AssignOrderToUser(body:any):Observable<any>{
  //   return  this.apiServiceOrder.post(routes.AssignOrderToUser , body);
  // }

  //MORE VIEWS  (saurav)

  getMoreViews(salesorder): Observable<any> {
    return this.apiServiceOrder.post(routes.getMoreViews, { "EntityName": salesorder });
  }

  delMoreView(data): Observable<any> {
    return this.apiServiceOrder.post(routes.delMoreView, data);

  }


  // Order retagging

  fetchOrdersListForRetag(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.fetchOrdersListForRetag, payload);
  }

  RetagOrder(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.RetagOrder, payload);
  }

  RetagColumnFilter(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.RetagColumns, payload);
  }

  ApplyRetagListFilter(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.RetagListFilter, payload);
  }

  displayMessageerror(message) {
    this.throwError(message);
  }

  throwError(message) {
    this.matSnackBar.open(message, this.action, {
      duration: 6000
    });
  }
  displayerror(statuscode) {
    if (statuscode == 401) {
      this.throwError("Unauthorized login");
    }
  }


  // Ends : Order retagging

  //prachi helpdesk track order
  getTrackOrderDeatils(data): Observable<any> {
    return this.apiServiceOrder.post(routes.helpdeskTrackOrder, data);
  }
  // helpdesk track opportunity
  getTrackOpportunity(data): Observable<any> {
    return this.apiServiceOpportunity.post(routes.helpdeskTrackOpportuinity, data);
  }

  // FIlter order listing 
  fetchColumnFilterList(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.fetchColumnFilterList, payload);
  }

  //Opportunityview hard close code saurav code

  HardCloseOpp(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.hardCloseOppUrl, payload);
  }
  //saurav Hard Close code ends

  //saurav upload contracts 

  deleteAttachments(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.deleteAttachments, payload);
  }

  saveAttachmentsOrderContracts(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.saveAttachments, payload);
  }

  getAttachments(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.getAttachments, payload);
  }

  //saurav upload contracts ends

  //saurav Da chat  starts

  getUserId(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.getUserId, payload);
  }
  getEmailId(payload): Observable<any> {
    return this.apiServiceOpportunity.post(routes.getEmailId, payload);
  }

  //saurav Da chat  ends

  // Task Reminder

  getTaskDetails(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.getTaskDetails, payload);
  }

  getTaskDetailsForReschedule(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.GetTaskRescheduleDetails, payload);
  }

  setTaskReminder(body): Observable<any> {
    return this.commundaService.camunda_post(routes.setTaskReminder, body);
  }

  rescheduleTaskReminder(body): Observable<any> {
    return this.commundaService.camunda_post(routes.rescheduleTaskReminder, body);
  }

  cancelTaskReminder(body): Observable<any> {
    return this.commundaService.camunda_post(routes.cancelTaskReminder, body);
  }

  //Pending with contract execution
  
  UpdateOrderPendingWithContract(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.UpdateOrderPendingWithContract, payload);
  }

  // Pending with deal owner

  UpdateOrderPendingWithDealOwner(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.UpdateOrderPendingWithDealOwner, payload);
  }

  DeleteOrderApprovalLog(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.DeleteOrderApprovalLog, payload);
  }


  // kirti
  getCrmReferenceDetails(crmdata): Observable<any> {
    return this.apiServiceOrder.post(routes.helpDeskCrm, crmdata);
  }

  //saurav summary codes
  getDeliveryTeam(payload): Observable<any> {
    return this.apiServiceOrder.post(routes.deliveryTeamUrl, payload)
  }

  //Current Vertical Owner search starts
  getVerticalOwnerList(verticalOwnerList: Object) {
    return this.apiServiceOrder.post(routes.verticalOwnerSearch, verticalOwnerList);
  }

  getNewVerticalOwnerList(newVerticalOwnerList: Object) {
    return this.apiServiceOpportunity.post(routes.newVerticalOwner, newVerticalOwnerList)
  }


  getVerticalOwner(SearchText, PageSize, RequestedPageNumber, OdatanextLink): Observable<any> {
    let detail = {
      "SearchText": SearchText,
      "PageSize": PageSize,
      "RequestedPageNumber": RequestedPageNumber,
      "OdatanextLink": OdatanextLink
    }
    return this.getVerticalOwnerList(detail).pipe(switchMap(res => {
      if (res) {
        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterVerticalOwner(res.ResponseObject) : [] } : [])
      } else {
        return of([])
      }
    }))

  }

  filterVerticalOwner(data): Observable<any> {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            ...x,
            'Id': (x.SysGuid) ? x.SysGuid : '',
            'Name': (x.Name) ? x.Name : 'NA',
            'EmailID': (x.EmailID) ? x.EmailID : 'NA',
          }
        })
      } else {
        return of([])
      }
    } else {
      return of([])
    }
  }

  //Current Vertical Owner search ends
  getVerticalOwnerSearchBtn(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.verticalOwnerSearchBtn, payload);
  }

  //Update Button in change vertical owner
  getVerticalOwnerUpdateBtn(payload): Observable<any[]> {
    return this.apiServiceOrder.post(routes.verticalOwnerUpdateBtn, payload);
  }
  //New Vertical Owner starts

  getNewVerticalOwner(SearchText, PageSize, RequestedPageNumber, Guid, OdatanextLink): Observable<any> {
    let data = {
      "SearchText": SearchText,
      "PageSize": PageSize,
      "RequestedPageNumber": RequestedPageNumber,
      "OdatanextLink": "",
      "Guid": Guid
    }
    return this.getNewVerticalOwnerList(data).pipe(switchMap(res => {
      if (res) {
        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterVerticalOwner(res.ResponseObject) : [] } : [])
      } else {
        return of([])
      }
    }))
  }

  // get the data for- one amenment to other.

  getdataforAmendment(amendment): Observable<any> {
    let dataref = {
      "SearchText": amendment.SearchText,
      "MyOwned": true,
      "PageSize": 1,
      "RequestedPageNumber": 1,
      "OdatanextLink": ""
    }
    return this.apiServiceOpportunity.post(routes.amendmenttoorder, dataref);
  }

  // apiamendmentorderconvert
  getamendmentorderconvert(amendmentdata): Observable<any> {
    return this.apiServiceOrder.post(routes.amendmentorderconvert, amendmentdata);
  }


  // kirti amendment to order func.
  getAmendmenttoOrder(searchValue, MyOwned, PageSize, RequestedPageNumber, OdatanextLink): Observable<any> {
    let detail = {
      "SearchText": searchValue,
      "MyOwned": true,
      "PageSize": PageSize,
      "RequestedPageNumber": RequestedPageNumber,
      "OdatanextLink": OdatanextLink
    }
    console.log("detail-valuess ", detail);
    return this.getAmendmentOrderList(detail).pipe(switchMap(res => {
      if (res) {
        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterAmendmentOrder(res.ResponseObject) : [] } : [])
      } else {
        return of([])
      }
    }))
  }


  getAmendmentOrderList(amendmentList: Object) {
    return this.apiServiceOpportunity.post(routes.amendmenttoorder, amendmentList);
  }

  filterAmendmentOrder(data): Observable<any> {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            ...x,
            'Name': (x.OrderNumber) ? x.OrderNumber : '-',
            'Id': (x.OrderBookingId) ? x.OrderBookingId : '',
            'Ownername': (x.OwnerName) ? x.OwnerName : '-',
          }
        })
      } else {
        return of([])
      }
    } else {
      return of([])
    }
  }

  // for one-amendment-to-other
  getOneAmendmenttoOrder(targetObject): Observable<any> {
    console.log("targetvaluess ", targetObject);
    return this.getOneAmendmentOrderList(targetObject).pipe(switchMap(res => {
      if (res) {
        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterOneAmendmentOrder(res.ResponseObject) : [] } : [])
      } else {
        return of([])
      }
    }))
  }

  getOneAmendmentOrderList(amendmentList: Object) {
    return this.apiServiceOrder.post(routes.oneamendmentorder, amendmentList);
  }

  filterOneAmendmentOrder(data): Observable<any> {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            ...x,
            'Id': (x.OrderId) ? x.OrderId : '',
            'Name': (x.OrderNumber) ? x.OrderNumber : '-',
            'Ownername': (x.OrderOwner) ? x.OrderOwner : '-',

          }
        })
      } else {
        return of([])
      }
    } else {
      return of([])
    }
  }

  // Rishi childorder amendment

  getOrderDetail(orderdata): Observable<any> {
    return this.apiServiceOpportunity.post(routes.childorderAmendment, orderdata);
  }
  getOrderNumberList(OrderNumberList: Object) {
    return this.apiServiceOpportunity.post(routes.childorderAmendment, OrderNumberList)
  }

  getOrderNumber(SearchText, MyOwned, PageSize, RequestedPageNumber, OdatanextLink): Observable<any> {
    let detail = {
      "SearchText": SearchText,
      "MyOwned": MyOwned,
      "PageSize": PageSize,
      "RequestedPageNumber": RequestedPageNumber,
      "OdatanextLink": OdatanextLink
    }
    console.log("rishipayload", detail)
    return this.getOrderNumberList(detail).pipe(switchMap(res => {
      console.log("resrishi", res)

      if (res) {
        return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterOrderNumber(res.ResponseObject) : [] } : [])
      } else {
        return of([])
      }
    }))
  }

  filterOrderNumber(data): Observable<any> {
    if (data) {
      if (data.length > 0) {
        return data.map(x => {
          return {
            ...x,
            'Id': (x.OrderBookingId) ? x.OrderBookingId : '',
            'Name': (x.OrderNumber) ? x.OrderNumber : '-',
            'OrderOwner': (x.OwnerName) ? x.OwnerName : '-',
          }
        })
      } else {
        return of([])
      }
    } else {
      return of([])
    }
  }
  // rishi parent order amendment
  getParentOrderNumberList(ParentOrderList: object) {
    return this.apiServiceOrder.post(routes.parentorderAmendment, ParentOrderList);
  }
  getParentOrderNumber(parentObject): Observable<any> {
    console.log("payloadParent", parentObject)
    return this.getParentOrderNumberList(parentObject).pipe(switchMap(obj => {
      if (obj) {
        return of((!obj.IsError) ? { ...obj, ResponseObject: (obj.ResponseObject.length > 0) ? this.filterParentOrder(obj.ResponseObject) : [] } : [])
      } else {
        return of([])
      }
    }))
  }
  filterParentOrder(data): Observable<any> {
    console.log("data", data)
    if (data) {
      if (data.length > 0) {
        return data.map(y => {
          return {
            ...y,
            'Id': (y.OrderId) ? y.OrderId : '',
            'Name': (y.OrderNumber) ? y.OrderNumber : '-',
            'OrderOwner': (y.OrderOwner) ? y.OrderOwner : '-',
          }
        })
      } else {
        return of([])
      }
    } else {
      return of([])
    }
  }
  // convert button
  convertOrder(data): Observable<any> {
    return this.apiServiceOrder.post(routes.convertAction, data);
  }
  //*************************rishi*********************** */


  //helpdesk transfer SLBDM serviceLine
  getAllActiveServiceLine(): Observable<any[]> {
    return this.apiServiceOpportunity.get(routes.getAllActiveSearviceline);
  }

  getPractiseSlBdm(practisedata): Observable<any> {
    return this.apiServiceOpportunity.post(routes.practiseSlBdm, practisedata);
  }

  getSubPracticeSLBDM(data): Observable<any> {
    return this.apiServiceOpportunity.post(routes.subPracticeSLBDM, data);
  }

  //SLBDM Search
  getOpportunity(data): Observable<any[]> {
    return this.apiServiceOpportunity.post(routes.oppoSearchBtn, data);
  }

  getTransferData(data): Observable<any> {
    return this.apiServiceOrder.post(routes.transferBtn, data);
  }

  getOrderSLBDMSearch(orderdata): Observable<any> {
    return this.apiServiceOrder.post(routes.orderSLBDMSearch, orderdata);
  }

  getStatusForRetag(retagCheck): Observable<any[]> {
    return this.apiServiceOrder.post(routes.ChkBaseOrderRetag, retagCheck);
  }

  // Manual Push Ris
  getManualPush(requestBody): Observable<any[]> {
    return this.apiServiceOrder.post(routes.manualPush, requestBody);
  }
  //ITAC Push ris
  getItacPush(requestBody): Observable<any[]> {
    return this.apiServiceOrder.post(routes.itacPush,requestBody); 
  }
  //manual- View details.
  getviewBaseRecords(payload): Observable<any[]>{
    return this.apiServiceOrder.post(routes.viewBaseRecords, payload);
  }
  // view ADH/VDH
  getviewAdhVdhSdh(dhpayload):Observable<any[]>{
    return this.apiServiceOrder.post(routes.viewAdhVdhSdh, dhpayload);
    }

  // upload download change by saurav
  fileUpload(file) {
        return this.http.post(`${BASE_URL}Storage/UploadDocument`, file);
    }

    filesToUpload(list) {
        let fileListArray = []
        list.forEach(file => {
            fileListArray.push(this.http.post(`${BASE_URL}Storage/UploadDocument`, file).pipe(catchError(e => of(''))))
        });
        return forkJoin(fileListArray)
    }
   filesToUploadDocument64(list) {
        let fileListArray = []
        list.forEach(file => {
            fileListArray.push(this.http.post(`${BASE_URL}Storage/UploadDocument64`, file).pipe(catchError(e => of(''))))
        });
        return forkJoin(fileListArray)
    }

    public formatErrors(error: any): Observable<any> {
        return throwError(error.error);
      }

    filesToDownloadDocument64(list) {
        console.log(`Request Payload to ${BASE_URL}v1/AccountManagement/Download64Document api`, JSON.stringify(list));
        let token = localStorage.getItem("token").toString();
        let encrPayload = this.encService.set(
            token.substring(0, 32),
            JSON.stringify(list),
            envADAL.encDecConfig.key
          );
          return this.httpClient
            .post(`${BASE_URL}v1/AccountManagement/Download64Document`, encrPayload, { responseType: "text" })
            .pipe(
              map(data => {
                let responseObject = JSON.parse(
                  this.encService.get(
                    token.substring(0, 32),
                    data,
                    envADAL.encDecConfig.key
                  )
                );
                console.log(
                  `Response from ${BASE_URL}v1/AccountManagement/Download64Document api`,
                  JSON.stringify(responseObject)
                );
                return responseObject;
              }),
              catchError(this.formatErrors)
            );
    }

    getOrderIcmValues(payload): Observable<any[]>{
      return this.apiServiceOrder.post(routes.getOrderIcmValues, payload);
    }

}


