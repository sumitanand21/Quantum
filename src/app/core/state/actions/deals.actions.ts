import { Action } from "@ngrx/store";
import { TaggedDealsList } from "../state.models/deals/tagged-deals.interface";
import { ExistingDealsList } from "../state.models/deals/existing-deals.interface";
import { Module } from "@app/core/models/module.model";
import { UploadList } from "../state.models/deals/upload-rls.interface";

export enum DealsActionTypes {
  TaggedListAction = "[Tagged-list] TaggedListAction",
  DealCurrency = "[Deal-currency] CreateDeal",
  DealModuleListAction = "[Deal-moduleList] DealModuleList",
  ExistingListAction = "[Existing-list] ExistingListAction",
  AllModulesRequested = "[Modules Page] All Modules Requested",
  AllModulesLoaded = "[Modules API] All Modules Loaded",
  RLSviewData = "[RLS-VIEW] Rls view loaded",
  PastDeal = "[Past-Deals] Past deal loaded",
  Reports = "[Reports] Reports Data Loaded",
  Dealoverview = "[Deal Overview] Deal overview Loaded",
  //DealTechSolutionListActions = '[Deal-Tech-Solution-List-Actions] DealTechSolutionListActions',
  CreateActionList = "[CreateActionList] CreateActionList Requested",
  GetDealTechSolutionList = "[List] Get Deal Tech Solution List",
  UploadRLS = "[UploadRLS List] Upload RLS List",
  DealParameter = "[DealParameter List] DealParameter Updated",
  DealCriteria = "[DealCriteria List] DealCriteria Updated",
  AttachDocumentsListAction = "[Attach-Document-List] AttachDocumentList",
  calculateDeal = "[Calculate Deal] Calculate",
  calenderActionList = "[Calender List] CalenderList",
  ModuleListAction = "[ModuleListAction] Module Response List",
  MilestoneDisplay = "[Milestone Display] MilestoneDisplay",
  RLSListAction = "[RLS Display] RLSDisplay",
  PassthroughListAction = "[Passthrough Display] PassthroughDisplay",
  DealAccess = "[DealAcess Display] Deal Access",
  dealCoOwners = "[Deal Co-owners] Deal CoOwners"
}
/* Taggged List, Existing List , Deal overview .Deal criteria and Create Deal */
export class TaggedListAction implements Action {
  readonly type = DealsActionTypes.TaggedListAction;
  constructor(
    public payload: { taggedDealslist: TaggedDealsList; count: number }
  ) {}
}
export class ExistingListAction implements Action {
  readonly type = DealsActionTypes.ExistingListAction;
  constructor(public payload: { existingDealslist: ExistingDealsList }) {}
}

/* Deal Tracker */
export class CreateListAction implements Action {
  readonly type = DealsActionTypes.CreateActionList;
  constructor(public payload: { CreateActionList: any; count: number }) {}
}
export class CalenderListAction implements Action {
  readonly type = DealsActionTypes.calenderActionList;
  constructor(public payload: { CalenderActionList: any }) {}
}
/* Deal Tracker */

export class DealParameterListAction implements Action {
  readonly type = DealsActionTypes.DealParameter;
  constructor(public payload: { dealparameterList: any }) {}
}
export class DealCurrencyAction implements Action {
  readonly type = DealsActionTypes.DealCurrency;
  constructor(public payload: { DealCurrencyList: any }) {}
}
export class RLSViewAction implements Action {
  readonly type = DealsActionTypes.RLSviewData;
  constructor(public payload: { RLSviewData: any }) {}
}
export class PastDealAction implements Action {
  readonly type = DealsActionTypes.PastDeal;
  constructor(public payload: { pastDeal: any }) {}
}
export class ReportsAction implements Action {
  readonly type = DealsActionTypes.Reports;
  constructor(public payload: { ReportsData: any }) {}
}
export class DealOverViewAction implements Action {
  readonly type = DealsActionTypes.Dealoverview;
  constructor(public payload: { dealoverview: any }) {}
}
export class CriteriaListAction implements Action {
  readonly type = DealsActionTypes.DealCriteria;
  constructor(public payload: { dealcriterialist: any }) {}
}
export class RLSListAction implements Action {
  readonly type = DealsActionTypes.RLSListAction;
  constructor(public payload: { rlslist: any }) {}
}
export class PassthroughListAction implements Action {
  readonly type = DealsActionTypes.PassthroughListAction;
  constructor(public payload: { passthroughlist: any }) {}
}
export class DealAccessAction implements Action {
  readonly type = DealsActionTypes.DealAccess;
  constructor(public payload: { dealaccessList: any }) {}
}
/* Taggged List, Existing List ,Deal overview and Create Deal */
export class DealModuleAction implements Action {
  readonly type = DealsActionTypes.DealModuleListAction;
  constructor(public payload: { DealModuleList: any }) {}
}

export class UploadRLSList implements Action {
  readonly type = DealsActionTypes.UploadRLS;
  constructor(public payload: { uploadRLSList: UploadList }) {}
}

export class calculateDeals implements Action {
  readonly type = DealsActionTypes.calculateDeal;
  constructor(public payload: { calculateDeal: any }) {}
}

export class AllModulesRequested implements Action {
  readonly type = DealsActionTypes.AllModulesRequested;
}

export class AllModulesLoaded implements Action {
  readonly type = DealsActionTypes.AllModulesLoaded;

  constructor(public payload: { modules: Module[] }) {}
}

export class GetDealTechSolutionList implements Action {
  readonly type = DealsActionTypes.GetDealTechSolutionList;
  constructor(public payload: { dealTechArrayList: any; count: number }) {}
}

export class AttachDocumentsListAction implements Action {
  readonly type = DealsActionTypes.AttachDocumentsListAction;
  constructor(public payload: { attachDocArryList: any }) {}
}

export class ModuleListAction implements Action {
  readonly type = DealsActionTypes.ModuleListAction;
  constructor(public payload: { ModuleList: any }) {}
}

// milestone
export class MilestoneAction implements Action {
  readonly type = DealsActionTypes.MilestoneDisplay;
  constructor(public payload: { Milestone: any ,leadtime:string,dsodays:string}) {}
}

export class DealCoOwnerListAction implements Action {
  readonly type = DealsActionTypes.dealCoOwners;
  constructor(public payload: { dealCoOwnersList: any }) {}
}

export type DealsActions =
  | TaggedListAction
  | DealOverViewAction
  | DealCurrencyAction
  | ReportsAction
  | ExistingListAction
  | AllModulesRequested
  | AllModulesLoaded
  | RLSViewAction
  | PastDealAction
  | GetDealTechSolutionList
  | CreateListAction
  | UploadRLSList
  | DealParameterListAction
  | CriteriaListAction
  | AttachDocumentsListAction
  | calculateDeals
  | CalenderListAction
  | ModuleListAction
  | MilestoneAction
  | RLSListAction
  | PassthroughListAction
  | DealAccessAction
  | DealCoOwnerListAction;
