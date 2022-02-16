import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { Observable, of, ReplaySubject, forkJoin, Subscription } from "rxjs";
import {
  ApiServiceUI,
  ApiServiceDeal,
  ApiServiceOpportunity,
  ApiServiceDeal5B
} from "./api.service";
import {
  TaggedDeals,
  ExistingDeals,
  SearchDeals,
  TeamDeal,
  Milestone,
  RLS,
  calModel,
  Intellectual,
  passProduct,
  dealContract,
  pastDeals,
  RLSDeals
} from "../models/deals.model";
import { HttpClient } from "@angular/common/http";
import { OfflineService } from "./offline.services";
import { environment } from "@env/environment";
import { EncrDecrService } from "./encr-decr.service";
import { Store } from "@ngrx/store";
import { AppState } from "../state";
import {
  ExistingListAction,
  ModuleListAction
} from "../state/actions/deals.actions";
import { DateModifier } from "./date-modifier";
import { MessageService } from "./deals/deals-observables.service";
import { EnvService } from "./env.service";

const routes = {
  taggedDeals: "/taggedDeals",
  existingDeals: "/existingDeals",
  searchDeals: "/searchDeals",
  pastDeals: "/pastDeals",
  teamDeal: "/dealTeam",
  milestone: "/Milestone",
  milestoneListURL: "api/v1/DPSWcfRestService/MileStoneDisplayService",
  fileUpload: "API/DPS/DPSWcfRestService.svc/UploadFileMilestone",
  fileDownload: "api/v1/DPSWcfRestService/DOWNLOAD",
  requestSpoc: "api/v1/DPSWcfRestService/RequestSpocDeal",
  milestoneSave: "api/v1/DPSWcfRestService/SaveMileStone",
  submitAll: "api/v1/DPSWcfRestService/SubmitAll",
  aggregateDropdownUrl: "api/v1/DPSWcfRestService/GetDealAggregatorParams",
  viewReportURL: "API/DPS/ViewReport.aspx?",
  reportsurl: "api/v1/DPSWcfRestService/LoadManageDealReports",
  reportModuleurl: "api/v1/DPSWcfRestService/LoadManageModuleReports",
  reportViewReport: "api/v1/DPSWcfRestService/ViewReports",
  emailReport: "api/v1/DPSWcfRestService/ViewReports",
  RLSDeals: "/RLSDeals",
  rls: "/RLS",
  productp: "/passProduct",
  wcs: "api/v1/DPSWcfRestServiceRLS/GetContrWCSSal",
  dealcontract: "/dealContract",
  dealcurrency: "API/DPS/DPSWcfRestService.svc/Currency",
  existingDealsURL: "api/v1/DPSWcfRestService/FillMyDeals",
  TaggedDealsURL: "",
  intellectual: "/Intellectual",
  proposal: "/proposal",
  calData: "/calandarDeals",
  createDeal: "api/v1/DPSWcfRestService/CreateDeal",
  saveNewModuleInput: "api/v1/DPSWcfRestService/SaveAddModule",
  renameModule: "api/v1/DPSWcfRestServiceController/RenameModule",
  revertModule: "api/v1/DPSWcfRestService/RevertModule",
  revertDeal: "api/v1/DPSWcfRestService/RevertDeal",
  deleteModuleInput: "api/v1/DPSWcfRestService/DeleteModule",
  copyModuleInput: "api/v1/DPSWcfRestService/CopyModule",
  rlsviewdrop: "api/v1/RLSView/FillRLSViewDeals",
  pastDealsURL: "api/v1/DPSWcfRestService/PastDealList",
  dealmoduleinput: "api/v1/ManageModuleService/LoadManageModule",
  criteriainput: "api/v1/DPSWcfRestService/FillManageParameters",
  criteriarlsinput: "API/DPS/DPSWcfRestServiceRLS.svc/RLSDisplayServiceNew",
  rlsdropdowninput: "API/DPS/DPSWcfRestServiceRLS.svc/RLSDropdownMaster",
  editModule: "api/v1/DPSWcfRestService/UpdateModulePsd",
  reportsURL: "API/DPS/DPSWcfRestService.svc/LoadManageDealReports",
  proposalCreate: "api/v5/proposal/create",
  proposalEdit: "api/v5/proposal/editproposal",
  proposalDelete: "api/v5/proposal/delete",
  proposalLock: "api/v5/proposal/lock",
  proposalSearch: "api/v5/proposal/search",
  dealFolderEdit: "api/v5/dealfolder/edit",
  dealFolderMove: "api/v5/dealfolder/movefolder",
  dealMultiFolderMove: "api/v5/dealfile/movemultiple",
  dealFolderCreate: "api/v5/dealFolder/create",
  dealFileCreate: "api/v5/dealFile/create",
  dealFolderDelete: "api/v5/dealFolder/delete",
  dealMultiFolderDelete: "api/v5/dealFolder/deletemultiple",
  dealFileList: "api/v5/DealFile/list",
  proposals: "api/v5/proposal/list",
  proposalStatus: "api/v5/proposal/getstatus",
  proposalActionRedirect: "api/v5/Proposal/RedirectToAction",
  dealCurrencyUrl: "api/v1/DPSWcfRestService/Currency",
  wpListTemplateInfo: "api/v5/wittyParrot/categorizedId",
  wpListTemplateInfo1: "api/v5/Catalyst/File/RelativePath",
  proposalDocumentUpload: "api/v5/DealFolder/UploadProposalDocument_V1",
  documentMgmtUpload: "api/v5/DealFolder/UploadDocument_V1",
  // genericFileUpload: 'api/v5/',
  uploadFiles: "Storage/UploadDocument",
  addcoownerinfo: "api/v1/DPSWcfRestService/SaveEmployeeDetails",
  rlsdropdown: "api/v1/DPSWcfRestServiceRLS/RLSDropdownMaster",
  rlsmanagedeal: "api/v1/DPSWcfRestService/LoadManageDeal",
  coownerinfo: "api/v1/DPSWcfRestService/GetEmployeesList",
  SaveManageParamsURL: "api/v1/DPSWcfRestService/SaveManageParameters",
  calculateDeal: "api/v1/CalculateDealService/CalculateDeal",
  calculateModuleDeal:
    "api/v1/CalculateDealService/GetModulesRLSCalculatedData",
  pullContractorWCSSalary: "api/v1/DPSWcfRestServiceRLS/PullContrWCSSalary",
  resetContractorWCSSalary: "api/v1/DPSWcfRestServiceRLS/ResetContrWCS",
  isDataInRLSisCorrect: "api/v1/CalculateDealService/IsDataInRLSisCorrect",
  DealRLSURL: "api/v1/DPSWcfRestServiceRLS/RLSDropdownMaster",
  DealRLSdisplay: "api/v1/DPSWcfRestServiceRLS/DealRLSDisplayServiceNew",
  RLSdisplayServiceURL: "api/v1/DPSWcfRestServiceRLS/RLSDisplayServiceNew",
  taggedSummery: "api/v5/Opportunity5Management/GetOpportunitySummary5B",
  isRLScorrectURL: "api/v1/CalculateDealService/IsDataInRLSisCorrect",
  searchOppAccName: "api/v5/Proposal/SearchAccount",
  // searchOppList: "api/v5/Opportunity5Management/GetSearchOpportunityFinder5B",
  searchOppList: "api/v5/Opportunity5Management/GetSearchOpportunityFinder5BFilter", 
  searchOppNameList:
    "api/v5/Opportunity5Management/GetSearchOpportunityFinderColumnName",
  searchOppIDList:
    "api/v5/Opportunity5Management/GetSearchOpportunityFinderColumnOppNumber",
  searchFilteredOppList:
    "api/v5/Opportunity5Management/GetSearchOpportunityFinder5BFilter",
  searchGroupCustNameList:
    "api/v5/Opportunity5Management/GetSearchOpportunityFinderColumnGroupCustomerName",
  searchCustNameList:
    "api/v5/Opportunity5Management/GetSearchOpportunityFinderColumnCustomerName",
  saveRLSURL: "api/v1/DPSWcfRestServiceRLS/SaveRLSNew",
  daFileDownload: "api/v1/DPSWcfRestService/DPSDADownload",
  PassthroughListURL:
    "api/v1/DPSWcfRestServiceRLS/PassThroughDispalyServiceNew",
  IPlistURL: "API/v1/DPSWcfRestServiceRLS/IPDisplayService",
  ChangeperiodURL: "api/v1/DPSWcfRestServiceRLS/ChangePeriodNew",
  LoadManageDeal: "api/v1/DPSWcfRestService/LoadManageDeal",
  validateIPURL: "api/v1/DPSWcfRestServiceRLS/ValidateIPData",
  pulloldrlsDataURL: "api/v1/DPSWcfRestService/GetPullOldRLSDealData",
  pulloldrls: "api/v1/DPSWcfRestServiceRLS/PullOldRLS",
  SaveIPURL: "api/v1/DPSWcfRestServiceRLS/SaveIPData",
  userRole: "api/v1/UserRolesController/GetUserRoles",
  dealSpecificUserRole: "api/v1/UserRolesController/GetUserRolesForDeal",
  roleAccess: "api/v1/DPSWcfRestService/SelectAccess",
  pullRLSURL: "api/v1/DPSWcfRestServiceRLS/PullOldRLS",
  calculateGM: "api/v1/DPSWcfRestService/CalculateBillingRateFromGM",
  SaveExistingURL: "api/v1/DPSWcfRestServiceRLS/RLSCopy",
  RevokeRLSURL: "api/v1/DPSWcfRestServiceRLS/RevokeRLS",
  SaveModuleParams: "api/v1/DPSWcfRestService/SaveManageModuleParameters",
  DeleteRLS: "api/v1/DPSWcfRestService/DeleteRLS",
  DeleteRLSlineItem: "api/v1/DPSWcfRestServiceRLS/DeleteRLSLineItemsNew",
  CalculateModule: "api/v1/CalculateDealService/CalculateModules",
  CalculateRLS: "api/v1/CalculateDealService/CalculateRLS",
  DeleteIPLineItem: "api/v1/DPSWcfRestServiceRLS/DeleteIPItems",
  AddIPlineURL: "api/v1/DPSWcfRestServiceRLS/AddIPLineNew",
  Re_CalculateURL: "api/v1/DPSWcfRestService/ReCalculateModule",
  Re_CalculateDealURL: "api/v1/DPSWcfRestService/ReCalculateDealTargetRevenue",
  DependentURL: "api/v1/DPSWcfRestServiceRLS/Getdependentlist",
  RevertRLS: "api/v1/DPSWcfRestService/CreateRLSVersion",
  SubmitForApprovalBFMUser: "api/v1/DPSWcfRestService/SubmitForApprovalBFMUser",
  DPSSubmitAppirioDeal: "api/v1/DPSWcfRestService/DPSSubmitAppirioDeal",
  moduleRLSSubmit: "api/v1/ManageModuleService/ModuleRLSSubmit",
  DealSubmitForApproval: "api/v1/DPSWcfRestService/DealSubmitForApproval",
  searchWiproEmployees: "Common/GetWiproEmployees",
  user: (id: number) => `/taggedDeals/${id}`,
  wittyMoveToNext: "api/v5/WittyParrot/MoveToNext",
  wittyMoveToDraft: "api/v5/WittyParrot/MoveToDraft",
  dealTeams: "api/v5/Proposal/getTeams",
  proposalChangeStatus: "api/v5/Proposal/ChangeStatus"
};

/*Dev env*/
// const QaURL5A = 'https://quapi-dev.wipro.com/L2O.Sprint5A.Api/';
// const QaURL = "https://quapi-dev.wipro.com/dev.Allied.DPS.noCore.Api/";
// const QaURL4 = 'https://quapi-dev.wipro.com/L2O.Sprint4.Api/';
// const l20FileUpload = 'https://quapi-dev.wipro.com/L2O.Common.Services.Api/api/v1/StorageCommon/UploadDocument_V_1';
// const uploaddoc = 'https://quapi-dev.wipro.com/L2O.Sprint1_2.Api_NoEncrypt/api/Storage/UploadDocument'
/*Qa env*/
// const QaURL5A = 'https://quapi-qa.wipro.com/L2O.Sprint5A.Api/';
// const QaURL = "https://quapi-dev.wipro.com/QA.Allied.DPS.noCore.Api/"
// const QaURL4 = "https://quapi-qa.wipro.com/L20.Sprint4.Api_Encrypt/";
// const l20FileUpload = 'https://quapi-qa.wipro.com/L2O.Common.Services.Api/api/v1/StorageCommon/UploadDocument_V_1';
// const uploaddoc = 'https://quapi-qa.wipro.com/L2O.Common.Services.Api/api/v1/StorageCommon/UploadDocument_V_1'

export const taggedHeader: any[] = [
  {
    id: 1,
    isFilter: false,
    name: "OppName",
    hideFilter: false,
    isFixed: true,
    order: 1,
    title: "Opp name",
    displayType: ""
  },
  {
    id: 2,
    isFilter: false,
    name: "OppID",
    hideFilter: false,
    isFixed: false,
    order: 2,
    title: "Opp ID / Amendment No.",
    displayType: "upperCase"
  },
  {
    id: 3,
    isFilter: false,
    name: "account",
    hideFilter: false,
    isFixed: false,
    order: 3,
    title: "Account"
  },
  {
    id: 4,
    isFilter: false,
    name: "SBU",
    hideFilter: false,
    isFixed: false,
    order: 4,
    title: "SBU"
  },
  {
    id: 5,
    isFilter: false,
    name: "vertical",
    hideFilter: false,
    isFixed: false,
    order: 5,
    title: "Vertical"
  },
  {
    id: 6,
    isFilter: false,
    name: "OppOwner",
    hideFilter: false,
    isFixed: false,
    order: 6,
    title: "Opp owner",
    displayType: "name"
  },
  {
    id: 7,
    isFilter: false,
    name: "oppType",
    hideFilter: false,
    isFixed: false,
    order: 7,
    title: "Opp type",
    displayType: "capsFirstCase"
  },
  {
    id: 8,
    isFilter: false,
    name: "TCV",
    hideFilter: true,
    isFixed: false,
    order: 8,
    title: "TCV",
    displayType: "currency"
  }
];
export const existingDealsHeader: any[] = [
  {
    id: 1,
    isFilter: false,
    name: "pricingId",
    isFixed: true,
    hideFilter: true,
    order: 1,
    title: "Pricing ID",
    displayType: "upperCase"
  },
  {
    id: 2,
    isFilter: false,
    name: "dealName",
    isFixed: true,
    hideFilter: true,
    order: 2,
    title: "Deal name",
    displayType: "name"
  },
  {
    id: 3,
    isFilter: false,
    name: "oppID",
    isFixed: false,
    hideFilter: true,
    order: 3,
    title: "Opp ID / Amend No.",
    displayType: "upperCase"
  },
  {
    id: 4,
    isFilter: false,
    name: "account",
    hideFilter: false,
    isFixed: false,
    order: 3,
    title: "Account"
  },
  {
    id: 5,
    isFilter: false,
    name: "dealOwner",
    hideFilter: false,
    isFixed: false,
    order: 3,
    title: "Deal Owner"
  },
  {
    id: 6,
    isFilter: false,
    name: "status",
    isFixed: false,
    hideFilter: false,
    order: 5,
    title: "Status",
    isStatus: true,
    displayType: "capsFirstCase"
  },
  {
    id: 7,
    isFilter: false,
    name: "createDate",
    isFixed: false,
    hideFilter: false,
    order: 6,
    title: "Create date",
    displayType: "date",
    dateFormat: "dd-MMM-yyyy"
  },
  {
    id: 8,
    isFilter: false,
    name: "curency",
    isFixed: false,
    hideFilter: true,
    order: 7,
    title: "TCV (Deal currency)",
    displayType: "currency"
  },
  {
    id: 9,
    isFilter: false,
    name: "TCV_currency",
    isFixed: false,
    hideFilter: true,
    order: 8,
    title: "TCV (USD)",
    displayType: "currency"
  },
  {
    id: 10,
    isFilter: false,
    name: "om",
    isFixed: false,
    order: 9,
    hideFilter: true,
    title: "OM%"
  },
  {
    id: 11,
    isFilter: false,
    name: "vertical",
    isFixed: false,
    hideFilter: false,
    order: 10,
    title: "Vertical",
    displayType: "name"
  }
];
export const searchDealHeader: any[] = [
  {
    id: 1,
    isFilter: false,
    name: "OppName",
    isFixed: true,
    hideFilter: false,
    order: 1,
    title: "Opportunity name / Order number",
    className: "nonHyperlink"
  },
  {
    id: 2,
    isFilter: false,
    name: "OppID",
    isFixed: false,
    hideFilter: false,
    order: 2,
    title: "Opp ID / Amend no."
  },
  {
    id: 3,
    isFilter: false,
    name: "prodOpp",
    isFixed: false,
    hideFilter: true,
    order: 3,
    title: "Product opportunity"
  },
  {
    id: 4,
    isFilter: false,
    name: "groupCustName",
    hideFilter: false,
    isFixed: false,
    order: 4,
    title: "Group customer name"
  },
  {
    id: 5,
    isFilter: false,
    name: "CustName",
    hideFilter: false,
    isFixed: false,
    order: 5,
    title: "Customer name"
  }
];
export const teamdealHeader: any[] = [
  {
    id: 1,
    isFilter: false,
    name: "Role",
    hideFilter: true,
    isFixed: true,
    order: 1,
    title: "Role",
    controltype: "select",
    allias: "_Role",
    closePopUp: false
  },
  {
    id: 2,
    isFilter: false,
    name: "Type",
    hideFilter: true,
    isFixed: true,
    order: 2,
    title: "Type",
    controltype: "select",
    allias: "_Role",
    closePopUp: false
  },
  {
    id: 3,
    isFilter: false,
    name: "Username",
    hideFilter: true,
    isFixed: false,
    order: 3,
    title: "Name",
    controltype: "autocomplete",
    allias: "_Username",
    isInitialColumn: true
  }
];
export const MilestoneHeader: any[] = [
  // { id: 1, isFilter: false, name: 'index', isFixed: true, order: 1, title: 'Sr No.', controltype: 'readonly', columnDisable: true, hideFilter: true },
  {
    id: 1,
    isFilter: false,
    name: "Milestone",
    isFixed: true,
    order: 1,
    title: "Milestone",
    controltype: "text",
    hideFilter: true,
    validation: "&Milestone",
    IsRequired: true,
    ErrorMessage: "#Milestone",
    ValidMsg: ["Please Enter MileStone"]
  },
  {
    id: 2,
    isFilter: false,
    name: "breakUp",
    isFixed: false,
    order: 2,
    title: "Break-up %",
    controltype: "percentage",
    hideFilter: true,
    validation: "&breakUp",
    IsRequired: true,
    ErrorMessage: "#breakUp",
    ValidMsg: ["Break-up % is missing", "Sum of Break - Up % exceeds 100"]
  },
  {
    id: 3,
    isFilter: false,
    name: "Work",
    isFixed: false,
    order: 3,
    IsSequence: true,
    title: "Time for work",
    controltype: "number",
    hideFilter: true,
    validation: "&Work",
    IsRequired: true,
    ErrorMessage: "#Work",
    ValidMsg: [
      "Time for Work completion-in months is missing",
      "Time for Work completion should be in a sequential order"
    ]
  }
];

export const IntellectualHeader: any[] = [
  {
    id: 1,
    isFilter: false,
    name: "IPType",
    allias: "_IPType",
    isFixed: true,
    order: 2,
    title: "IP type",
    controltype: "select",
    hideFilter: true,
    validation: "&IPType",
    IsRequired: true,
    ErrorMessage: "#IPType",
    ValidMsg: ["please  select iptype"]
  },
  {
    id: 2,
    isFilter: false,
    name: "ProductCode",
    cascade: "$ProductCode",
    dependency: "IPType",
    matchingCode: "IPTypeCode",
    controltype: "cascadingDrop",
    allias: "_ProductCode",
    isFixed: false,
    order: 3,
    title: "Product name",
    hideFilter: true,
    validation: "&ProductCode",
    IsRequired: true,
    ErrorMessage: "#ProductCode",
    ValidMsg: ["please select product name"]
  },
  {
    id: 3,
    isFilter: false,
    name: "ModuleCode",
    allias: "_ModuleCode",
    isFixed: false,
    order: 4,
    title: "Module name",
    cascade: "$ModuleCode",
    dependency: "ProductCode",
    matchingCode: "ProductCode",
    controltype: "cascadingDrop",
    hideFilter: true,
    validation: "&ModuleCode",
    IsRequired: true,
    ErrorMessage: "#ModuleCode",
    ValidMsg: ["please select module code"]
  },
  {
    id: 4,
    isFilter: false,
    name: "RevenuePerc",
    isFixed: false,
    order: 5,
    title: "Revenue%",
    controltype: "number",
    hideFilter: true
  },
  {
    id: 5,
    isFilter: false,
    name: "CostPerc",
    isFixed: false,
    order: 6,
    title: "Cost%",
    controltype: "readonly",
    hideFilter: true
  },
  {
    id: 6,
    isFilter: false,
    name: "TermOrPerpectual",
    isFixed: false,
    order: 7,
    title: "Term/Perpectual",
    controltype: "readonly",
    hideFilter: true
  },
  {
    id: 7,
    isFilter: false,
    name: "CountValue",
    isDecs: true,
    DescTitle: "CountDesc",
    isFixed: false,
    dependecyValid: "MinNumofUnits",
    order: 8,
    title: "Count",
    controltype: "number",
    hideFilter: true,
    validation: "&CountDesc",
    IsRequired: true,
    ErrorMessage: "#CountDesc",
    ValidMsg: [
      "please fill count",
      "Count should be greater or equal to min-units"
    ]
  },
  {
    id: 8,
    isFilter: false,
    name: "DurationValue",
    isDecs: true,
    DescTitle: "DurationDesc",
    isFixed: false,
    dependecyValid: "MinNumofDuration",
    order: 9,
    title: "Duration",
    controltype: "number",
    hideFilter: true,
    validation: "&DurationDesc",
    IsRequired: true,
    ErrorMessage: "#DurationDesc",
    ValidMsg: ["please fill duration", "Duration should be greater than 0"]
  },
  {
    id: 9,
    isFilter: false,
    name: "MinNumofUnits",
    dependencyField: "ModuleCode",
    isFixed: false,
    order: 10,
    title: "Min-Unit",
    controltype: "readonly",
    hideFilter: true
  },
  {
    id: 10,
    isFilter: false,
    name: "IsAMCApplicable",
    isFixed: false,
    order: 11,
    title: "AMC applicable",
    controltype: "readonly",
    hideFilter: true
  }
];

export const ProductHeader: any[] = [
  {
    id: 1,
    isFilter: false,
    name: "id",
    isFixed: true,
    order: 1,
    title: "Sr No.",
    controltype: "label",
    columnDisable: true,
    hideFilter: true
  },
  {
    id: 2,
    isFilter: false,
    name: "category",
    isFixed: false,
    order: 2,
    title: "Category",
    controltype: "select",
    hideFilter: true
  },
  {
    id: 3,
    isFilter: false,
    name: "servlyn",
    isFixed: false,
    order: 3,
    title: "Service line",
    controltype: "select",
    hideFilter: true
  },
  {
    id: 4,
    isFilter: false,
    name: "practisepass",
    isFixed: false,
    order: 4,
    title: "Practice",
    controltype: "select",
    hideFilter: true
  },
  {
    id: 5,
    isFilter: false,
    name: "type",
    isFixed: false,
    order: 5,
    title: "Type",
    controltype: "text",
    hideFilter: true
  },
  {
    id: 6,
    isFilter: false,
    name: "vendor",
    isFixed: false,
    order: 6,
    title: "Vendor",
    controltype: "text",
    hideFilter: true
  },
  {
    id: 7,
    isFilter: false,
    name: "desp",
    isFixed: false,
    order: 7,
    title: "Description",
    controltype: "text",
    hideFilter: true
  },
  {
    id: 8,
    isFilter: false,
    name: "reimb",
    isFixed: false,
    order: 8,
    title: "REIMB%",
    controltype: "text",
    hideFilter: true
  },
  {
    id: 9,
    isFilter: false,
    name: "cost",
    isFixed: false,
    order: 9,
    title: "Cost%",
    controltype: "text",
    hideFilter: true
  },
  {
    id: 10,
    isFilter: false,
    name: "margin",
    isFixed: false,
    order: 10,
    title: "Margin%",
    controltype: "text",
    hideFilter: true
  },
  {
    id: 11,
    isFilter: false,
    name: "total",
    isFixed: false,
    order: 11,
    title: "Total",
    controltype: "text",
    hideFilter: true
  },
  {
    id: 12,
    isFilter: false,
    name: "m1",
    isFixed: false,
    order: 12,
    title: "M1",
    controltype: "text",
    hideFilter: true
  }
];

// Calender Header
export const calandarDealsHeader: any[] = [
  {
    id: 1,
    isFilter: false,
    hideFilter: false,
    name: "actionName",
    isFixed: true,
    order: 1,
    title: "Action name",
    displayType: "capsFirstCase"
  },
  {
    id: 2,
    isFilter: false,
    hideFilter: false,
    name: "actionType",
    isFixed: false,
    order: 2,
    title: "Action type",
    displayType: "capsFirstCase"
  },
  {
    id: 3,
    isFilter: false,
    hideFilter: false,
    name: "actionOwner",
    isFixed: false,
    order: 3,
    title: "Action owner",
    displayType: "name"
  },
  {
    id: 4,
    isFilter: false,
    hideFilter: false,
    name: "startDate",
    isFixed: false,
    order: 4,
    title: "Start date",
    displayType: "date",
    isHideColumnSearch: true,
    dateFormat: "dd-MMM-yyyy"
  },
  {
    id: 5,
    isFilter: false,
    hideFilter: false,
    name: "endDate",
    isFixed: false,
    order: 5,
    title: "End date",
    displayType: "date",
    isHideColumnSearch: true,
    dateFormat: "dd-MMM-yyyy"
  },
  {
    id: 6,
    isFilter: false,
    hideFilter: false,
    name: "module",
    isFixed: false,
    order: 6,
    title: "Module",
    displayType: "capsFirstCase"
  },
  {
    id: 7,
    isFilter: false,
    hideFilter: false,
    name: "status",
    isFixed: false,
    order: 7,
    title: "Status",
    isStatus: true,
    displayType: "capsFirstCase",
    className: "approvalstatus cp"
  },
  {
    id: 8,
    isFilter: false,
    hideFilter: false,
    name: "approval",
    isFixed: false,
    order: 8,
    title: "Approval",
    displayType: "capsFirstCase"
  },
  {
    id: 9,
    isFilter: false,
    hideFilter: true,
    name: "attachment",
    isFixed: false,
    order: 9,
    title: "Attachment",
    isLink: true,
    className: "approvalstatus cp"
  },
  {
    id: 10,
    isFilter: false,
    hideFilter: false,
    name: "approver",
    isFixed: false,
    order: 10,
    title: "Approver",
    displayType: "name"
  },
  {
    id: 11,
    isFilter: false,
    hideFilter: false,
    name: "escalateCont",
    isFixed: false,
    order: 11,
    title: "Escalate cont.",
    displayType: "currency"
  },
  {
    id: 12,
    isFilter: false,
    name: "dependencies",
    isFixed: false,
    hideFilter: true,
    order: 12,
    title: "Dependencies"
  }
];
export const WCSHeader: any[] = [
  // { id: 1, isFilter: false, name: 'id', isFixed: true, order: 1, title: 'Sl No.', controltype: 'label', columnDisable: true, hideFilter: true },
  // { id: 1, isFilter: false, name: 'empno', isFixed: true, order: 1, title: 'Employee No', controltype: 'number', hideFilter: true, isRequired: "true", validation: "&empno", ErrorMessage: '#empno', ValidMsg: ["Please enter employee number"] },
  {
    id: 1,
    isFilter: false,
    name: "empno",
    isFixed: true,
    order: 1,
    title: "Employee No",
    controltype: "number",
    hideFilter: true
  },
  {
    id: 2,
    isFilter: false,
    name: "band",
    isFixed: false,
    order: 2,
    title: "Band",
    controltype: "label",
    hideFilter: true
  },
  {
    id: 3,
    isFilter: false,
    name: "servline",
    isFixed: false,
    order: 3,
    title: "Service Line",
    controltype: "label",
    columnDisable: true,
    hideFilter: true
  },
  {
    id: 4,
    isFilter: false,
    name: "practice",
    isFixed: false,
    order: 4,
    title: "Practice",
    controltype: "label",
    columnDisable: true,
    hideFilter: true
  },
  {
    id: 5,
    isFilter: false,
    name: "loc",
    isFixed: false,
    order: 5,
    title: "Location",
    controltype: "label",
    columnDisable: true,
    hideFilter: true
  },
  {
    id: 6,
    isFilter: false,
    name: "agencyrate",
    isFixed: false,
    order: 6,
    title: "Rate",
    controltype: "label",
    columnDisable: true,
    hideFilter: true
  }
];

export const dealcontractHeader: any[] = [
  {
    id: 1,
    isFilter: false,
    name: "empno",
    isFixed: true,
    order: 1,
    title: "Employee No",
    relationship: "$curncy",
    controltype: "number",
    hideFilter: true,
    isRequired: "true",
    validation: "&empno",
    ErrorMessage: "#empno",
    ValidMsg: ["Please enter employee number"]
  },
  {
    id: 2,
    isFilter: false,
    name: "curncy",
    subProp: ["agencytype", "agencyrate"],
    isFixed: false,
    order: 2,
    title: "Currency",
    relationship: "$empno",
    controltype: "select",
    hideFilter: true,
    isRequired: "true",
    validation: "&curncy",
    ErrorMessage: "#curncy",
    ValidMsg: ["Please select currency"]
  },
  {
    id: 3,
    isFilter: false,
    name: "agencytype",
    isFixed: false,
    order: 3,
    relationship: "$empno",
    title: "Agency Rate Type",
    controltype: "select",
    hideFilter: true,
    isRequired: "true",
    validation: "&agencytype",
    ErrorMessage: "#agencytype",
    ValidMsg: ["Please select agency rate type"]
  },
  {
    id: 4,
    isFilter: false,
    name: "agencyrate",
    isFixed: false,
    order: 4,
    relationship: "$empno",
    title: "Agency Rate",
    controltype: "number",
    hideFilter: true,
    isRequired: "true",
    validation: "&agencyrate",
    ErrorMessage: "#agencyrate",
    ValidMsg: ["Please enter agency rate"]
  },
  {
    id: 5,
    isFilter: false,
    name: "band",
    isFixed: false,
    order: 5,
    title: "Band",
    controltype: "label",
    columnDisable: true,
    hideFilter: true
  },
  {
    id: 6,
    isFilter: false,
    name: "sercline",
    isFixed: false,
    order: 6,
    title: "Service Line",
    controltype: "label",
    columnDisable: true,
    hideFilter: true
  },
  {
    id: 7,
    isFilter: false,
    name: "practice",
    isFixed: false,
    order: 7,
    title: "Practice",
    controltype: "label",
    columnDisable: true,
    hideFilter: true
  }
];

export const PastDealHeader: any[] = [
  {
    id: 1,
    isFilter: false,
    name: "pid",
    isFixed: true,
    order: 1,
    hideFilter: true,
    title: "Pricing ID",
    displayType: "upperCase"
  },
  {
    id: 2,
    isFilter: false,
    name: "closure",
    isFixed: false,
    order: 2,
    hideFilter: false,
    title: "Date of closure",
    displayType: "date",
    isHideColumnSearch: true,
    dateFormat: "dd-MMM-yyyy"
  },
  {
    id: 3,
    isFilter: false,
    name: "oaid",
    isFixed: false,
    order: 3,
    hideFilter: true,
    title: "Opp ID / Amend No"
  },
  {
    id: 4,
    isFilter: false,
    name: "dealName",
    isFixed: false,
    hideFilter: false,
    order: 4,
    title: "Deal name"
  },
  {
    id: 5,
    isFilter: false,
    name: "clName",
    isFixed: false,
    order: 5,
    hideFilter: false,
    title: "Client name"
  },
  {
    id: 6,
    isFilter: false,
    name: "sbu",
    isFixed: false,
    order: 6,
    hideFilter: false,
    title: "SBU"
  },
  {
    id: 7,
    isFilter: false,
    name: "vertical",
    isFixed: false,
    order: 7,
    hideFilter: false,
    title: "Vertical"
  },
  {
    id: 8,
    isFilter: false,
    name: "tcvCurr",
    isFixed: false,
    order: 8,
    hideFilter: false,
    title: "TCV (Deal curr.)"
  },
  {
    id: 9,
    isFilter: false,
    name: "tcvUsd",
    isFixed: false,
    order: 9,
    hideFilter: false,
    title: "TCV (USD)"
  },
  {
    id: 10,
    isFilter: false,
    name: "status",
    isFixed: false,
    order: 10,
    hideFilter: false,
    title: "Deal status"
  }
];

export const RLSDealHeader: any[] = [
  {
    id: 1,
    isFilter: false,
    name: "pid",
    isFixed: true,
    hideFilter: true,
    order: 1,
    displayType: "upperCase",
    title: "Pricing ID"
  },
  {
    id: 2,
    isFilter: false,
    name: "dealName",
    isFixed: false,
    hideFilter: false,
    order: 2,
    title: "Deal name"
  },
  {
    id: 3,
    isFilter: false,
    name: "creation",
    isFixed: false,
    hideFilter: true,
    order: 3,
    title: "Date of creation"
  },
  {
    id: 4,
    isFilter: false,
    name: "oaid",
    isFixed: false,
    hideFilter: true,
    order: 4,
    title: "Opp ID / Amend No"
  },
  {
    id: 5,
    isFilter: false,
    name: "clName",
    isFixed: false,
    order: 5,
    hideFilter: false,
    title: "Client name"
  },
  {
    id: 6,
    isFilter: false,
    name: "sbu",
    isFixed: false,
    order: 6,
    hideFilter: false,
    title: "SBU"
  },
  {
    id: 7,
    isFilter: false,
    name: "vertical",
    isFixed: false,
    order: 7,
    hideFilter: false,
    title: "Vertical"
  },
  {
    id: 8,
    isFilter: false,
    name: "dealCurr",
    isFixed: false,
    order: 8,
    hideFilter: false,
    title: "Deal currency"
  },
  {
    id: 9,
    isFilter: false,
    name: "type",
    isFixed: false,
    order: 9,
    hideFilter: false,
    title: "Type of deal"
  },
  {
    id: 10,
    isFilter: false,
    name: "status",
    isFixed: false,
    hideFilter: false,
    order: 10,
    title: "Deal status",
    className: "unqualified"
  }
];

export const attached1DocsHeader: any[] = [
  {
    id: 1,
    isFilter: false,
    name: "indxparent",
    isFixed: true,

    order: 1,
    title: "Document name"
  },
  {
    id: 2,
    isFilter: false,
    name: "module",
    isFixed: false,

    order: 2,
    title: "Module"
  },
  {
    id: 3,
    isFilter: false,
    name: "author",
    isFixed: false,

    order: 3,
    title: "Author"
  },
  {
    id: 4,
    isFilter: false,
    name: "appReq",
    isFixed: false,

    order: 4,
    title: "App req"
  },
  {
    id: 5,
    isFilter: false,
    name: "approver",
    isFixed: false,

    order: 5,
    title: "Approver"
  },
  {
    id: 6,
    isFilter: false,
    name: "status",
    isFixed: false,

    order: 6,
    title: "Status",
    className: "proposed"
  },
  {
    id: 7,
    isFilter: false,
    name: "escalation",
    isFixed: false,

    order: 7,
    title: "Escalation"
  }
];
@Injectable({
  providedIn: "root"
})
export class dealService implements OnInit, OnDestroy{
  // Api URL starts here
  // QaURL2 = environment.sprint5BaseUrl.QaURL2;
  QaURL5A = this.envr.sprint5BaseUrl.QaURL5A;
  QaURL = this.envr.sprint5BaseUrl.QaURL;
  QaURL4 = this.envr.sprint5BaseUrl.QaURL4;
  genaralFileUpLoad = this.envr.sprint5BaseUrl.genaralFileUpLoad;
  uploaddoc = this.envr.sprint5BaseUrl.uploaddoc;
  // Api URL ends here
  uploadRLSID: any;
  taggedPageno: any;
  taggedConfigData: any;
  RLSeHeader: any[] = [];
  existingdealsPageno: any;
  existingdealConfigData: any;
  public db: any;
  public readonly DealCacheType = {
    Table: "Table",
    Details: "Details",
    MeetingTypes: "MeetingTypes"
  };
  selArray = [];
  cachedArray = [];
  oppData = new ReplaySubject();
  userInfo: any;
  dealOverview: any;
  originUrl: string = "";
  pastDeal$: Subscription = new Subscription();
  constructor(
    public envr : EnvService,
    private apiService: ApiServiceUI,
    private http: HttpClient,
    private encrDecrService: EncrDecrService,
    public store: Store<AppState>,
    public offlineServices: OfflineService,
    public apiServiceDeal: ApiServiceDeal,
    public _ApiServiceDeal5B: ApiServiceDeal5B,
    public apiServiceOpportunity: ApiServiceOpportunity,
    private message: MessageService
  ) {
    this.pastDeal$ = this.message.getPastDealEnable().subscribe(message => {
      console.log('message inside the deals service-->', message)
      this.originUrl = message.originUrl;
    })
  }

  ngOnInit() {
  }
  getAll(): Observable<TaggedDeals> {
    return this.apiService.get(routes.taggedDeals);
  }
  getabc(): Observable<any> {
    return this.http.get(
      "http://pwbsqa.wipro.com/ALLIED.DPS.noCors/api/Values"
    );
  }
  getSingle(id: number): Observable<TaggedDeals> {
    return this.apiService.get(routes.user(id));
  }
  getParentHeaderData(): Observable<any[]> {
    return of(taggedHeader);
  }
  getExistingDealsData(): Observable<ExistingDeals> {
    return this.apiService.get(routes.existingDeals);
  }
  getSearchDealsData(): Observable<SearchDeals[]> {
    return this.apiService.get(routes.searchDeals);
  }
  getTeamDealData(): Observable<TeamDeal[]> {
    return this.apiService.get(routes.teamDeal);
  }
  updateRecords(item: any): Observable<any> {
    return this.apiService.post(routes.teamDeal, item);
  }
  deleteRecords(id: any): Observable<any> {
    return this.apiService.delete(routes.teamDeal + "?:id=" + id);
  }
  getMilestoneData(): Observable<Milestone[]> {
    return this.apiService.get(routes.milestone);
  }
  // <----milestone urls---->
  // upload milestone
  uploadFileMilestone(formdata): Observable<any> {
    return this.http.post(
      this.QaURL + "api/v1/DPSWcfRestService/UploadFileMilestone_v_1",
      formdata
    );
  }
  getMileStoneList(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/MileStoneDisplayService",
      input
    );
  }
  mileStoneDataSave(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/SaveMileStone",
      input
    );
  }

  downloadFileMilestone(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/DOWNLOAD",
      input
    );
  }

  requestSpocMilestone(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/RequestSpocDeal",
      input
    );
  }

  submitAllMilestone(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/SubmitAll",
      input
    );
  }
  // <-------milestone urls------>

  //----------------dealoverview
  daDocumentDownload(input: any): Observable<any> {
    return this.http.post("api/v1/DPSWcfRestService/DPSDADownload", input);
  }
  revertdealDetails(input: any) {
    // return this.http.post(
    //   "api/v1/DPSWcfRestService/RevertDeal",
    //   input
    // );
    return this._ApiServiceDeal5B.post(routes.revertDeal, input);
  }
  addDealCoOwner(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/BindDealTeamList",
      input
    );
  }
  displayEmployeeDetails(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "/api/v1/DPSWcfRestService/BindDealTeamEmployeeDetails",
      input
    );
  }

  //-------------deal aggregator

  // deal aggregator
  getDealAggregatorDropDown(agregateData): Observable<any> {
    return this._ApiServiceDeal5B.post(
      routes.aggregateDropdownUrl,
      agregateData
    );
  }
  //view aggregate report
  viewAggregateReport(input: any): Observable<any> {
    console.log(input, "input..");
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/ViewReports",
      input
    );
  }
  // reports data
  getReportsDropDowns(reportsData): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/LoadManageDealReports",
      reportsData
    );
  }
  getModuleReportData(reportsData): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/LoadManageModuleReports",
      reportsData
    );
  }

  //reports view report

  reportViewReport(reportsData): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/ViewReports",
      reportsData
    );
  }
  reportEmailReport(reportsData): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/ViewReports",
      reportsData
    );
  }

  getrlsData(): Observable<RLS[]> {
    return this.apiService.get(routes.rls);
  }
  getintellectualData(): Observable<Intellectual[]> {
    return this.apiService.get(routes.intellectual);
  }
  getproductData(): Observable<passProduct[]> {
    return this.apiService.post(routes.productp);
  }
  getWCSData(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.wcs, input);
  }

  getdealContractData(): Observable<dealContract[]> {
    return this.apiService.get(routes.dealcontract);
  }
  getCalData(): Observable<calModel[]> {
    return this.apiService.get(routes.calData);
  }
  getAttachedDocs(): Observable<any[]> {
    return this.apiService.get(routes.proposal);
  }

  //---------------create deals start here----------
  sendOppId(oppID: string) {
    this.oppData.next(oppID);
  }
  clearOppId() {
    this.oppData.next();
  }
  getTaggedSummary(postdata): Observable<any> {
    // return this.http.post(this.QaURL5A + routes.taggedSummery, postdata);
    return this.apiServiceDeal.post(routes.taggedSummery, postdata);
  }
  createDeal(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.createDeal, postData);
  }
  getDealCurrencyList(postData): Observable<any> {
    console.log(JSON.stringify(postData));
    return this._ApiServiceDeal5B.post(routes.dealCurrencyUrl, postData);
  }
  getOpportuntyAccInfo(accdata) {
    let postdata = { SearchText: accdata };
    // return this.http.post(this.QaURL5A + routes.searchOppAccName, postdata);
    return this.apiServiceDeal.post(routes.searchOppAccName, postdata);
  }
  getSearchedOppList(postdata) {
    // return this.http.post(this.QaURL5A + routes.searchOppList, postdata);
    return this.apiServiceDeal.post(routes.searchOppList, postdata);
  }
  getSearchedOppName(postdata) {
    return this.apiServiceDeal.post(routes.searchOppNameList, postdata);
  }
  getSearchedOppID(postdata) {
    return this.apiServiceDeal.post(routes.searchOppIDList, postdata);
  }
  getSearchedGroupCustName(postdata) {
    return this.apiServiceDeal.post(routes.searchGroupCustNameList, postdata);
  }
  getSearchedCustName(postdata) {
    return this.apiServiceDeal.post(routes.searchCustNameList, postdata);
  }
  getFilteredOppList(postdata) {
    return this.apiServiceDeal.post(routes.searchFilteredOppList, postdata);
  }

  getOppNameMethod(postdata) {
    return this.apiServiceDeal.post(
      "api/v5/Opportunity5Management/GetSearchOpportunityFinderColumnName", 
      postdata
    );
  }

  getOppIdMethod(postdata) {
    return this.apiServiceDeal.post(
      "api/v5/Opportunity5Management/GetSearchOpportunityFinderColumnOppNumber", 
      postdata
    );
  }

  getGroupCustNameMethod(postdata) {
    return this.apiServiceDeal.post(
      "api/v5/Opportunity5Management/GetSearchOpportunityFinderColumnGroupCustomerName", 
      postdata
    );
  }

  getCustNameMethod(postdata) {
    return this.apiServiceDeal.post(
      "api/v5/Opportunity5Management/GetSearchOpportunityFinderColumnCustomerName", 
      postdata
    );
  }
  //----------------create deals ends here---------------
  //---------------Module Methods starts------------
  getAllModuleDetails(loadmoduleinfo, loadmoduledeal, rlsmoduledropdown) {
    let loadmodule = this._ApiServiceDeal5B.post(
      routes.dealmoduleinput,
      loadmoduleinfo
    );
    let loaddeal = this._ApiServiceDeal5B.post(
      routes.rlsmanagedeal,
      loadmoduledeal
    );
    let rlsdropdown = this._ApiServiceDeal5B.post(
      routes.rlsdropdown,
      rlsmoduledropdown
    );
    return forkJoin([loadmodule, loaddeal, rlsdropdown]);
  }
  getDealModuleList(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.dealmoduleinput, postData);
  }
  getCowonerInfo(postData): any {
    let obj = {
      SearchEmployee: {
        EmployeeNumber: postData,
        EmployeeName: postData,
        EmployeeMail: postData
      }
    };
    console.log(obj, "objj..");
    return this._ApiServiceDeal5B.post(routes.coownerinfo, obj);
  }
  searchWiproEmployees(searchText: string): Observable<any> {
    let jsonObj = {
      SearchText: searchText,
      RequestedPageNumber: 1,
      PageSize: 50
    };
    return this.apiServiceOpportunity.post(
      routes.searchWiproEmployees,
      jsonObj
    );
  }
  addCowonerInfo(postData) {
    return this._ApiServiceDeal5B.post(routes.addcoownerinfo, postData);
  }
  editDealModule(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.editModule, postData);
  }
  deleteDealModule(postData): Observable<any> {
    console.log(postData, "delete serveice");
    return this._ApiServiceDeal5B.post(routes.deleteModuleInput, postData);
  }
  copyDealModule(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.copyModuleInput, postData);
  }
  saveNewDealModule(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.saveNewModuleInput, postData);
  }
  renameModuleName(postData) {
    return this._ApiServiceDeal5B.post(routes.renameModule, postData);
  }
  revertMod(postData) {
    return this._ApiServiceDeal5B.post(routes.revertModule, postData);
  }
  //----------------Module Methods Ends here-----------
  getPastDealsData(): Observable<pastDeals[]> {
    return this.apiService.get(routes.pastDeals);
  }
  getRLSDealsData(): Observable<RLSDeals[]> {
    return this.apiService.get(routes.RLSDeals);
  }
  /* existing deals , tagged opp , Reports ,Deal criteria and create opp */
  getCurrencyDealCurrency(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.dealcurrency, postData);
  }
  getExistingDeals(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.existingDealsURL, postData);
  }
  getTaggedOpp(postData): Observable<any> {
    console.log(postData, "postData");
    return this.apiServiceDeal.post(
      "api/v5/Opportunity5Management/TaggedOpportunitiesFilterList",
      postData
    );
  }
  getRLSDropdownsNdata(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.rlsviewdrop, postData);
  }
  getPastDeals(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.pastDealsURL, postData);
  }
  getDealReports(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.reportsURL, postData);
  }
  getDealRLSdropdownNrlsview(postData1, postData2): Observable<any> {
    let response1 = this._ApiServiceDeal5B.post(routes.DealRLSURL, postData1);
    let response2 = this._ApiServiceDeal5B.post(
      routes.DealRLSdisplay,
      postData2
    );
    return forkJoin([response1, response2]);
  }
  SaveRLS(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.saveRLSURL, postData);
  }
  PassthroughList(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.PassthroughListURL, postData);
  }
  IPlist(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.IPlistURL, postData);
  }
  ChangePeriod(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.ChangeperiodURL, postData);
  }
  ValidateIP(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.IPlistURL, postData);
  }
  SaveIP(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.SaveIPURL, postData);
  }
  PulloldRLSData(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.pulloldrlsDataURL, postData);
  }
  PulloldRLS(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.pulloldrls, postData);
  }
  RoleAccess(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.roleAccess, postData);
  }
  PullRLS(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.pullRLSURL, postData);
  }
  CalculateGM(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.calculateGM, postData);
  }
  SaveExistingRLS(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.SaveExistingURL, postData);
  }
  RevokeRLS(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.RevokeRLSURL, postData);
  }
  SaveModuleParams(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.SaveModuleParams, postData);
  }
  DeleteRLS(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.DeleteRLS, postData);
  }
  DeleteRLSline(postData): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.DeleteRLSlineItem, postData);
  }
  CaculateRLS(postRLS): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.CalculateRLS, postRLS);
  }
  CaculateModule(postDeal): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.CalculateModule, postDeal);
  }
  DeleteIPline(postInput): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.DeleteIPLineItem, postInput);
  }
  AddIpLineItem(postInput): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.AddIPlineURL, postInput);
  }
  Re_CalculateModule(postInput): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.Re_CalculateURL, postInput);
  }
  Re_CalculateDeal(postInput): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.Re_CalculateDealURL, postInput);
  }
  getDependentList(postInput): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.DependentURL, postInput);
  }
  Revertrls(postInput): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.RevertRLS, postInput);
  }
  getColumnOpportunityList(postInput): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/Opportunity5Management/SearchColumnOpportunityList",
      postInput
    );
  }
  /* existing deals , tagged opp , Reports ,Deal criteria and create opp */

  //<---Overview Models--->
  getOverviewSummary(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/LoadManageDeal",
      input
    );
  }
  editOverviewsDetails(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/SaveManageTab",
      input
    );
  }
  getFillManageParams(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/FillManageParameters",
      input
    );
  }
  //<--/ Overview Models--/>

  //<---Upload RLS--->
  LoadManageModule(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/ManageModuleService/LoadManageModule",
      input
    );
  }
  RLSdropdownMastert(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestServiceRLS/RLSDropdownMaster",
      input
    );
  }
  dataInRLS(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.isDataInRLSisCorrect, input);
  }
  createExcelUpload(file): Observable<any> {
    return this.http.post(
      this.QaURL + "api/v1/DPSWcfRestServiceRLS/CREATEEXCELUPLOAD",
      file
    );
  }
  uploadFile(file): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestServiceRLS/UploadFile",
      file
    );
  }
  downloadFileRLS(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/DownloadRLS",
      input
    );
  }
  UpdateModuleListStore(input: any, input1: any): Observable<any> {
    let loadmodule = this._ApiServiceDeal5B.post(routes.dealmoduleinput, input);
    let loaddeal = this._ApiServiceDeal5B.post(routes.rlsmanagedeal, input1);
    return forkJoin([loadmodule, loaddeal]);
  }
  //<--/ Upload RLS--/>

  //<--Deal Calculation-->
  submitAllBenchMark(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/SubmitAll",
      input
    );
  }
  requestSPOC(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/RequestSpocDeal",
      input
    );
  }
  calculateDeal(post: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.calculateDeal, post);
  }
  calculateModule(post: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.calculateModuleDeal, post);
  }
  getContractorWCSSalary(post: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.wcs, post);
  }
  pullContractorWCSSalary(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.pullContractorWCSSalary, input);
  }
  resetContractorWCSSalary(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.resetContractorWCSSalary, input);
  }
  SubmitForApprovalBFMUser(post: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.SubmitForApprovalBFMUser, post);
  }
  DPSSubmitAppirioDeal(post: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.DPSSubmitAppirioDeal, post);
  }
  moduleRLSSubmit(post: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.moduleRLSSubmit, post);
  }
  DealSubmitForApproval(post: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.DealSubmitForApproval, post);
  }
  //<--/ Deal Calculation--/>

  //<--/ Deal Tracker--/>
  actionType(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/Master5Management/GetActionType",
      input
    );
  }

  actionModule(input: any): Observable<any> {
    //return this.http.post('https://quapi-dev.wipro.com/dev.Allied.DPS.noCore.Api/api/v1/DPSWcfRestService/GetModelbyDealid', input);
    return this._ApiServiceDeal5B.post(
      "/api/v1/DPSWcfRestService/GetModelbyDealid",
      input
    );
  }

  // actionModule(input: any): Observable<any> {
  //     return this.http.post(this.QaURL5A + 'api/v5/Master5Management/GetModule', input);
  // }

  OpportunityNumbers(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      // "api/v5/ProposalAction/SearchUser", 
      "api/v5/Opportunity5Management/SearchColumnOpportunityNumber",
      input
    );
  } 
  OpportunityName(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      // "api/v5/ProposalAction/SearchUser", 
      "api/v5/Opportunity5Management/SearchColumnOpportunityName",
      input
    );
  } 
  searchUser(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      // "api/v5/ProposalAction/SearchUser", 
      "api/v5/Opportunity5Management/SearchColumnOpportunityOwner",
      input
    );
  }

  searchApprover(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/ProposalAction/ApproverList",
      input
    );
  }

  searchAccount(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      // "api/v5/Opportunity5Management/GetAccountLookUp",
      "api/v5/Opportunity5Management/SearchColumnOpportunityAccount",
      input
    );
  }
  searchSBU(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      // "api/v5/Opportunity5Management/SBUByName",
      "api/v5/Opportunity5Management/SearchColumnOpportunitySBU",
      input
    );
  }
  searchOppTCV(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      // "api/v5/Opportunity5Management/SBUByName",
      "api/v5/Opportunity5Management/SearchColumnOpportunityTCV",
      input
    );
  }
  searchOppType(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      // "api/v5/Opportunity5Management/SBUByName",
      "api/v5/Opportunity5Management/SearchColumnOpportunityType",
      input
    );
  }
  searchVertical(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      // "api/v5/Opportunity5Management/VerticalByName",
      "api/v5/Opportunity5Management/SearchColumnOpportunityVertical",
      input
    );
  }
  searchDependent(input: any): Observable<any> {
    return this.apiServiceDeal.post("api/v5/ProposalAction/Search", input);
  }

  createAction(input: any): Observable<any> {
    return this.apiServiceDeal.post("api/v5/ProposalAction/Create", input);
  }

  actionList(input: any): Observable<any> {
    return this.apiServiceDeal.post("api/v5/ProposalAction/List", input);
  }

  deleteAction(input: any): Observable<any> {
    return this.apiServiceDeal.post("api/v5/ProposalAction/Delete", input);
  }

  detailsAction(input: any): Observable<any> {
    return this.apiServiceDeal.post("api/v5/ProposalAction/Details", input);
  }

  editAction(input: any): Observable<any> {
    return this.apiServiceDeal.post("api/v5/ProposalAction/Edit", input);
  }

  globalActionSearch(input: any): Observable<any> {
    return this.apiServiceDeal.post("api/v5/ProposalAction/SearchList", input);
  }

  getCalenterList(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/ProposalAction/CalenderList",
      input
    );
  }

  getCalenderSearch(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/ProposalAction/SearchCalenderList",
      input
    );
  }

  myCalenderList(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/ProposalAction/MyCalendarAction",
      input
    );
  }

  closeCalenderList(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/ProposalAction/ClosedActionList",
      input
    );
  }

  getMyActionList(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/ProposalAction/MyActionList",
      input
    );
  }

  getSearchMyActionList(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/ProposalAction/SearchMyList",
      input
    );
  }

  ClosedActionList(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/ProposalAction/ClosedActionList",
      input
    );
  }

  searchClosedActionList(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/ProposalAction/SearchClosedList",
      input
    );
  }

  approvarAction(input: any): Observable<any> {
    return this.apiServiceDeal.post("api/v5/ProposalAction/CloseAction", input);
  }

  reWorkAction(input: any): Observable<any> {
    return this.apiServiceDeal.post("api/v5/ProposalAction/Rework", input);
  }

  documentHistory(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/ProposalAction/DocumentDetails",
      input
    );
  }

  actionSummary(input: any): Observable<any> {
    return this.apiServiceDeal.post("api/v5/ProposalAction/Summary", input);
  }

  rollForUser(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/UserRolesController/GetUserRoles",
      input
    );
  }

  chatCollebration(input: any): Observable<any> {
    return this.http.post("https://qawittychat.wittyparrot.com/embed/", input);
  }

  wittyAfterAction(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/WittyParrot/PostCollabarationLog",
      input
    );
  }

  emailList(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(
      "api/v1/DPSWcfRestService/BindDealTeamEmployeeDetails",
      input
    );
  }

  // </-------------------- Without Encrypted API's ----------------------------/>
  uploadActionTemplate(file): Observable<any> {
    return this.http.post(
      this.QaURL5A + "api/v5/DealFolder/UploadActionlDocument_V1",
      file
    );
  }

  wpListTemplateInfo(payload): Observable<any> {
    return this.http.post(
      this.QaURL5A + "api/v5/WittyParrot/ListCategorizedId",
      payload
    );
  }

  wpListTemplateInfo1(payload): Observable<any> {
    return this.http.post(
      this.QaURL5A + "api/v5/Catalyst/File/RelativePath",
      payload
    );
  }

  wiproTemplate(input: any): Observable<any> {
    return this.http.post(
      this.QaURL5A + "api/v5/WittyParrot/ListwithInfoId",
      input
    );
  }

  downloadDocument(input: any): Observable<any> {
    return this.http.post(
      this.QaURL5A + "api/v5/DealFolder/GetDocument",
      input
    );
  }
  // </*-------------------- Without Encrypted API's ----------------------------*/>

  actionStartEndDate(input: any): Observable<any> {
    return this.apiServiceDeal.post(
      "api/v5/ProposalAction/GetColumnStartAndEndDates",
      input
    );
  }

  // fileUpload(input: any): Observable<any> {
  //     return this.http.post(this.QaURL2+'api/Storage/UploadDocument', input);
  // }
  //<--Deal Tracker-->

  //<------------View/Edit Commercials--------->//
  getbasiccriteriadetails(input: any): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.criteriainput, input);
  }
  getbasicrlsdetails(input): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.criteriarlsinput, input);
  }
  getrlsdropdowndetails(input): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.rlsdropdowninput, input);
  }
  saveManageParameter(input): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.SaveManageParamsURL, input);
  }

  // proposal starts here
  createDocument(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalCreate, payload);
  }

  editDocument(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalEdit, payload);
  }

  lockDocument(payload): Observable<any> {
    console.log(payload);
    return this.apiServiceDeal.post(routes.proposalLock, payload);
  }

  editFolder(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.dealFolderEdit, payload);
  }

  moveFile(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.dealFolderMove, payload);
  }

  moveFiles(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.dealMultiFolderMove, payload);
  }

  createFolder(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.dealFolderCreate, payload);
  }

  deleteFolder(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.dealFolderDelete, payload);
  }

  deleteFolders(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.dealMultiFolderDelete, payload);
  }

  listFolder(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.dealFileList, payload);
  }

  createFile(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.dealFileCreate, payload);
  }

  proposals(payload): Observable<any[]> {
    return this.apiServiceDeal.post(routes.proposals, payload);
    // return this.http.post<any[]>(this.QaURL5A + routes.proposals, payload);
  }

  deleteProposal(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalDelete, payload);
  }

  editProposal(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalDelete, payload);
  }

  searchProposal(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalSearch, payload);
  }

  proposalActionRedirect(payload): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalActionRedirect, payload);
  }
  //---------------------------------------------------------------- check this
  uploadProposalTemplate(file): Observable<any> {
    return this.http.post(this.QaURL5A + routes.proposalDocumentUpload, file);
    //return this.http.post(this.sharePointFileUpload, file);
    //return this.http.post(this.uploaddoc, file);
  }
  documentMgmtUpload(file): Observable<any> {
    return this.http.post(this.QaURL5A + routes.documentMgmtUpload, file);
  }
  genericFileUpload(file): Observable<any> {
    return this.http.post(this.genaralFileUpLoad, file);
  }

  uploadRPF(file): Observable<any> {
    return this.http.post(this.uploaddoc, file);
  }

  // wpListTemplateInfo(payload): Observable<any> {
  //     return this.http.post(wpBaseUrl + routes.wpListTemplateInfo, payload)
  //         .pipe(
  //             retry(3)
  //         );
  // }

  proposalStatus(): Observable<any> {
    return this.apiServiceDeal.post(routes.proposalStatus, null);
  }

  getUserRole(payload): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.userRole, payload);
  }

  getDealSpecificRole(payload): Observable<any> {
    return this._ApiServiceDeal5B.post(routes.dealSpecificUserRole, payload);
  }

  wittyMoveToNext(payload) {
    // api/v5/WittyParrot/MoveToNext
    return this.apiServiceDeal.post(routes.wittyMoveToNext, payload);
  }

  wittyMoveToDraft(payload) {
    // api/v5/WittyParrot/MoveToDraft
    return this.apiServiceDeal.post(routes.wittyMoveToDraft, payload);
  }

  getTeams(payload) {
    // api/v5/Proposal/getTeams
    return this.http.post(this.QaURL5A + routes.dealTeams, payload);
  }

  proposalChangeStatus(payload) {
    // api/v5/Proposal/ChangeStatus
    return this.apiServiceDeal.post(routes.proposalChangeStatus, payload);
  }

  // proposal ends here

  async getUploadRLSCacheData() {
    console.log("get upload rls cache data--->");
    const TablePageData = await this.offlineServices.getUploadRLSIndexCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }
  async getExistingDealsCacheData() {
    console.log("get upload rls cache data--->");
    const TablePageData = await this.offlineServices.getExistingCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }
  async getTaggedDealsCacheData() {
    console.log("get upload rls cache data--->");
    const TablePageData = await this.offlineServices.getTaggedCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }
  async getDealOverviewCacheData() {
    console.log("get upload rls cache data--->");
    const TablePageData = await this.offlineServices.getDealoverviewCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }

  async getCalculateCacheData() {
    console.log("get upload rls cache data--->");
    const TablePageData = await this.offlineServices.getCalculateIndexCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }

  // Action List Offline Services
  async getActionListCacheData() {
    console.log("get Action List cache data--->");
    const TablePageData = await this.offlineServices.getActionListIndexCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }

  // Calendar List Offline Services
  async getCalenderListCacheData() {
    console.log("get Calender List cache data--->");
    const TablePageData = await this.offlineServices.getCalenderListIndexCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }

  async getModuleListCacheData() {
    console.log("get module cache data--->");
    const TablePageData = await this.offlineServices.getModuleListCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }

  // proposal ends here

  async getDealTechSolutionCacheData() {
    console.log("get dealtechsolution cache data--->");
    const TablePageData = await this.offlineServices.getDealTechSolutionIndexCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }

  async getRLSViewCacheData() {
    console.log("get RLS List cache data--->");
    const TablePageData = await this.offlineServices.getRLSListCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }
  //-------milestoneo offline--------
  async getMilestoneListCacheData() {
    console.log("get milestone cache data--->");
    const TablePageData = await this.offlineServices.getMilestoneListCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }

  //---------------- attach document offline
  async getAttachDocumentCacheData() {
    console.log("get attac document cache data--->");
    const TablePageData = await this.offlineServices.getAttachDocumentIndexCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }
  //----------------- .attach document offline

  //---------------Deal params----------------//
  async getDealParamsCacheData() {
    console.log("get milestone cache data--->");
    const TablePageData = await this.offlineServices.getDealParamasCacheData();
    if (TablePageData.length > 0) {
      return TablePageData[0];
    } else {
      console.log("else condition-->");
      return null;
    }
  }
  /*To get Header Data for Coulmn filter*/
  getHeaderData(headerName, headerArray) {
    let i = 1;
    let finalArray: any[] = [];
    if (headerArray.length > 0) {
      headerArray.map(x => {
        let obj = {
          id: i,
          name: "",
          isDatafiltered: false
        };
        for (var prop in x) {
          if (prop == headerName) {
            obj.name = x[prop];
            finalArray.push(obj);
          }
        }
        i = i + 1;
      });
      finalArray = this.getUnique(finalArray, "name");
      return finalArray;
    } else {
      return [];
    }
  }
  getSearchHeaderData(headerName, headerArray, searchText) {
    let i = 1;
    let finalArray: any[] = [];
    if (
      headerArray.length > 0 &&
      searchText != undefined &&
      searchText != null &&
      searchText != ""
    ) {
      headerArray.map(x => {
        let obj = {
          id: i,
          name: "",
          isDatafiltered: false
        };
        for (var prop in x) {
          if (
            prop == headerName &&
            x[prop].toLowerCase().includes(searchText.toLowerCase())
          ) {
            obj.name = x[prop];
            finalArray.push(obj);
          }
        }
        i = i + 1;
      });
      finalArray = this.getUnique(finalArray, "name");
      return finalArray;
    } else {
      return [];
    }
  }
  getFilteredArrayList(headerName, ArrayObj, value) {
    if (ArrayObj != undefined && ArrayObj != null) {
      if (ArrayObj[headerName].toLowerCase() == value.toLowerCase()) {
        return ArrayObj;
      } else {
        return;
      }
    } else {
      return;
    }
  }
  // Function for getting the filtered array between two dates
  getFilteredDateArrayList(headerName, ArrayObj, date) {
    let startDate = this.getLocaleDateFormat(new Date(date.filterStartDate._d));
    let endDate = this.getLocaleDateFormat(new Date(date.filterEndDate._d));
    let result = ArrayObj.filter(d => {
      let createDate = headerName == "createDate" ? d.createDate : d.closure;
      return (
        new Date(createDate) >= new Date(startDate) &&
        new Date(createDate) <= new Date(endDate)
      );
    });
    return result;
  }
  // Function for getting the locale date format
  getLocaleDateFormat(dateConvert) {
    const dataModifier = new DateModifier();
    return dataModifier.modifier(dateConvert);
  }
  SortByHeaders(ArrayList, HeaderName, sortBy) {
    if (HeaderName.includes("createDate")) {
      sortBy != sortBy;
      if (sortBy == true) {
        ArrayList.sort(function(a, b) {
          if (new Date(a[HeaderName]) < new Date(b[HeaderName])) {
            return -1;
          } else if (new Date(a[HeaderName]) > new Date(b[HeaderName])) {
            return 1;
          } else {
            return 0;
          }
        });
        return ArrayList;
      } else {
        ArrayList.reverse();
        return ArrayList;
      }
    } else if (
      HeaderName.includes("curency") ||
      HeaderName.includes("TCV_currency")
    ) {
      sortBy != sortBy;
      if (sortBy == true) {
        ArrayList.sort((a, b) =>
          compare_integer_strings(a[HeaderName], b[HeaderName])
        );
      } else {
        ArrayList.sort((a, b) =>
          compare_integer_strings(a[HeaderName], b[HeaderName])
        ).reverse();
      }
      return ArrayList;
    } else {
      sortBy != sortBy;
      console.log(sortBy);
      if (sortBy == true) {
        ArrayList.sort((a, b) => a[HeaderName].localeCompare(b[HeaderName]));
      } else {
        ArrayList.sort((a, b) => b[HeaderName].localeCompare(a[HeaderName]));
      }
      return ArrayList;
    }
  }
  getUnique(arr, comp) {
    const unique = arr
      .map(e => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e])
      .map(e => arr[e]);

    return unique;
  }
  /*Store Update methods*/
  UpdateExistingDealsStore() {
    if (sessionStorage.getItem("userInfo")) {
      let userInfo = this.encrDecrService.get(
        "EncryptionEncryptionEncryptionEn",
        sessionStorage.getItem("userInfo"),
        "DecryptionDecrip"
      );
      this.userInfo = JSON.parse(userInfo);
      var inputData = {
        User: {
          EmployeeId: this.userInfo.EmployeeId
        },
        Params: {
          MaxCount: "500"
        },
        Items: [],
        spParams: {}
      };
      this.getExistingDeals(inputData).subscribe(
        res => {
          if (res) {
            if (res.ReturnCode == "S") {
              this.store.dispatch(
                new ExistingListAction({
                  existingDealslist: res.Output.DealList
                })
              );
            }
          }
        },
        error => {
          console.log("Error-->", error);
        }
      );
    }
  }
  updateModuleListStore() {
    if (sessionStorage.getItem("userInfo")) {
      let userInfo = this.encrDecrService.get(
        "EncryptionEncryptionEncryptionEn",
        sessionStorage.getItem("userInfo"),
        "DecryptionDecrip"
      );
      this.userInfo = JSON.parse(userInfo);
      let dealOverview = this.encrDecrService.get(
        "EncryptionEncryptionEncryptionEn",
        sessionStorage.getItem("Dealoverview"),
        "DecryptionDecrip"
      );
      this.dealOverview = JSON.parse(dealOverview);
      let dealInput = {
        UserInfo: {
          EmpName: this.userInfo.EmployeeName,
          AdId: this.userInfo.EmployeeId,
          EmpEmail: this.userInfo.EmployeeMail,
          EmpID: this.userInfo.EmployeeId,
          EmpNo: this.userInfo.EmployeeNumber
        },
        MasterData: {
          PricingId: this.dealOverview.pricingId
            ? this.dealOverview.pricingId.toUpperCase()
            : "",
          TraceOppId: this.dealOverview.oppID || "",
          DealId: this.dealOverview.id,
          DealHeaderNumber: "",
          DealVersionId: "",
          DealHeaderName: "",
          DOEmailId: this.dealOverview.DealOwnerEmailId,
          ModuleCount: "",
          ModuleOwnerEmailId: "",
          ModuleBFMEmailId: "",
          ModulePSPOCEmailId: "",
          ModuleId: "",
          ModuleVersionId: "",
          ModuleName: "",
          ModuleStatusCode: "",
          OptionId: "",
          OptionNumber: "",
          OptionName: "",
          OptionVersionId: "",
          OptionStatusCode: "",
          RLSId: "",
          RLSVersionId: "",
          SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
          MachineIp: "",
          GroupCode: "",
          RoleId: "",
          CurrencyCode: "",
          MsaRequired: "0"
        }
      };
      let moduleInput = {
        User: {
          EmployeeId: this.userInfo.EmployeeId,
          EmployeeName: this.userInfo.EmployeeName,
          ClientIP: "",
          EmployeeMail: this.userInfo.EmployeeMail,
          EmployeeNumber: this.userInfo.EmployeeNumber
        },
        MasterData: {
          SourcePage: this.originUrl.includes("pastDeal") ? "Pastdeals" : "",
          PricingId: this.dealOverview.pricingId.toUpperCase(),
          DealId: this.dealOverview.id
        }
      };
      let RLSDropdownInput = {
        UserInfo: {
          EmpID: this.userInfo.EmployeeId,
          EmpName: this.userInfo.EmployeeName,
          Adid: this.userInfo.EmployeeId,
          EmpEmail: this.userInfo.EmployeeMail,
          EmpNo: this.userInfo.EmployeeNumber
        },
        MasterDataRLS: {
          traceoppid: this.dealOverview.oppID || "",
          dealid: this.dealOverview.id,
          moduleid: "",
          optionid: "",
          rlsid: "",
          dealversion: "",
          optionversion: "",
          moduleversion: "",
          rlsversion: "",
          dealno: "",
          moduleno: "",
          optionno: "",
          rlsno: "",
          passthroughtype: "",
          RLSType: "",
          PricingId: this.dealOverview.pricingId
            ? this.dealOverview.pricingId.toUpperCase()
            : "",
          DealHeaderNumber: "",
          currecyCode: ""
        },
        PassThroughObject: {}
      };
      this.getAllModuleDetails(
        moduleInput,
        dealInput,
        RLSDropdownInput
      ).subscribe(
        res => {
          console.log(res);
          this.store.dispatch(new ModuleListAction({ ModuleList: res }));
        },
        error => {
          console.log("Error-->", error);
        }
      );
    }
  }

  getStaticHeaderData(headerName: string, columnData: string[]) {
    let outputData: any[] = [];
    if (columnData.length > 0) {
      for (let i = 0; i < columnData.length; i++) {
        let obj = {
          id: i,
          name: "",
          isDatafiltered: false
        };
        obj.id = i + 1;
        obj.name = columnData[i];
        outputData.push(obj);
      }
      return outputData;
    }
    return [];
  }

  genericTableFilter(
    options: ISingleTableFilterData,
    columns: IFilterConfigData,
    requestPayload: IRequestPayLoad
  ) {
    switch (options.headerName) {
      case options.headerName: {
        let obj: IRequestPayLoad = {
          Id: requestPayload.Id,
          LastRecordId: requestPayload.LastRecordId,
          PageSize: columns[options.headerName].PageNo,
          UserID: requestPayload.UserID,
          SearchTextOnColumn: requestPayload.SearchTextOnColumn || null,
          FilterByPropertyName: options.headerName || null,
          SearchText: requestPayload.SearchText || null,
          SortByPropertyName: requestPayload.SortByPropertyName || null
        };
        return obj;
      }
    }
  }
  ngOnDestroy() {
    this.pastDeal$.unsubscribe();
  }
}
// Function for comparing the integer strings
function compare_integer_strings(a: any, b: any) {
  while (a.length < b.length) {
    a = "0" + a;
  }
  while (a.length > b.length) {
    b = "0" + b;
  }
  if (a > b) {
    return 1;
  }
  if (b > a) {
    return -1;
  }
  return 0;
}
export interface IRequestPayLoad {
  Id: string;
  LastRecordId: number;
  PageSize: number;
  UserID: string;
  SearchTextOnColumn?: string;
  FilterByPropertyName?: string;
  SearchText?: string;
  SortByPropertyName?: string;
}

export interface IGenericTableData<T, U> {
  (key: T, val: U): void;
}

export interface ISingleTableFilterData {
  globalSearch: string;
  filterColumn: {};
  order: any[];
  headerName: string;
  columnSerachKey: string;
  sortOrder: boolean;
  sortColumn: string;
  isApplyFilter: boolean;
}

export interface IFilterConfigData {
  data: [];
  recordCount: number;
  PageNo: number;
  NextLink: string;
}
