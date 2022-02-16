import {Action} from '@ngrx/store';
import {CreateLead} from '../state.models/lead-create.interface'
import {Update} from '@ngrx/entity';
import {  MyOpenLeadsCollection, LeadDetailsDataModel } from '../state.models/Lead/myopenleads.interface';
import { ArchivedLeads } from '../state.models/Lead/archivedLeads.interface';

// import { LeadsActionTypes } from './lead-list.action';


export enum LeadActionTypes {
  LeadSave = '[Save Lead] LeadSave',
  LeadEdit = '[Edit Lead] LeadEdit',
  LoadMyOpenLeads = '[Load MyOpen Leads] MyOpen Leads',
  updateNurtureLeads ='[ Update Leads Nurture] Update MyLead Nurture',
  // updateOpenNurtureLeads ='[ Update Leads Nurture] Update OpenLead Nurture',
  LoadArchivedList = '[Lead] Load ArchivedList',
  archivedRestoreleads = '[ Restore Archived Leads ] Restore Archive Lead',
  updateQualifyLeads = '[Update Leads Qualify] Update Lead Qualify',
  disqualifyLeads = '[Disqualify Leads] Disqualify Leads',
  clearArchivedLeadState = '[Clear Archived State] clear Archived State',
  clearMyopenlead='[Clear My open Leads] clear My open Leads',
  clearOpenLeadState = '[Clear Open Lead List] clear open lead',
  LoadOpenLeadList = '[load open lead list ] open lead list',
  LeadDetails = '[lead details] lead details',
  LeadsEdit = '[Lead edited] Leads Edit',
  LeadAccepted = '[Lead accepted ] Lead Accepted',
  updateLeadDetails =  '[Update Lead Details ] Update Lead Details',
  LeadHistory = '[lead history] Lead History',
  UpdateLeadReqdata = '[Update Lead Req Details]',
  UpdateLeadsOwner = '[ update Lead Owner] Update Owner',
  updateLeadCampaign = '[Update lead Campaign] update Lead Campaign',
  LinkedLeadActivityAdded = '[Linked lead campign] update Linked Lead activity ',
  LinkedLeadOppAdded = '[Linked lead opportunity] Linked Lead Opportunity',
  LinkedLeadCampDelete= '[Delink lead Campaign] Delink Lead Campaign',
  LinkedLeadCustomer = '[Link lead Customer] Linked Lead Customer',
  UpdateLeadReqContact='[Link Lead Request Campaign] Link Req Campaign',
  UpdateHistoryFlag = '[Updating history flag] updating history',
  ClearAllLeadDetails = '[Clear All Lead Details] clear Lead Details '
}

export class LeadSaved implements Action {
    readonly type =  LeadActionTypes.LeadSave;
    constructor(public payload : {  Lead: CreateLead}) {}
}
export class LeadEdited implements Action {

  readonly type = LeadActionTypes.LeadEdit;

  constructor(public payload: { Lead: Update<CreateLead> }) {}
}

// -----------------------------------------------My Open Leads Actions----------------------------------------------------------------------------------

type MyOpenLeadPOJO = {
  listdata: MyOpenLeadsCollection[],
  count: number,
  nextlink: string
}
export class LoadMyOpenleads implements Action{
  readonly type = LeadActionTypes.LoadMyOpenLeads
  constructor(public payload:{myOpenLeads:MyOpenLeadPOJO}){}
}

type UpdateLeadsPOJO={
  id:any,
  changes:any
}
export class LeadNurture implements Action {
  readonly type = LeadActionTypes.updateNurtureLeads
  constructor(public payload :{updateurture: Update<UpdateLeadsPOJO>[]}){}
}


export class LeadQualify implements Action {
  readonly type = LeadActionTypes.updateQualifyLeads
  constructor(public payload :{updatequalify: Update<UpdateLeadsPOJO>[]}){}
}

type DisqualifyPOJO ={
  ids:any
}
export class LeadDisQualify implements Action {
  readonly type = LeadActionTypes.disqualifyLeads
  constructor(public payload :{ids:any[]}){}
}

export class ClearMyopenlead implements Action {
  readonly type = LeadActionTypes.clearMyopenlead
}

// export class LeadDetailsById implements Action {
//   readonly type = LeadActionTypes.LeadDetails;
//   constructor(public payload: { leadDetails: MyOpenLeadsDetailsCollection }) { }
// }

// export class UpdateLeadDetailsById implements Action {
//   readonly type = LeadActionTypes.LeadsEdit;
//   constructor(public payload: { leadDetails: MyOpenLeadsDetailsCollection }) { }
// }



export class LeadAccepted implements Action {
  readonly type = LeadActionTypes.LeadAccepted;
  constructor(public payload: { updateLeadAccept:  Update<UpdateLeadsPOJO >}) {
    console.log("the leadas payload is")
    console.log(payload)
   }
}

export class LoadLeadDetails implements Action {
  readonly type = LeadActionTypes.LeadDetails;
  constructor(public payload: { details:LeadDetailsDataModel }) {
    console.log("the leadas payload is")
    console.log(payload)
   }
}

export class UpdateLeadDetails implements Action {
  readonly type = LeadActionTypes.updateLeadDetails
  constructor(public payload :{updateleadDetais: Update<UpdateLeadsPOJO>}){}
}

export class UpdateLeadCampaign implements Action {
  readonly type = LeadActionTypes.updateLeadCampaign
  constructor(public payload :{updateleadCampaign: Update<UpdateLeadsPOJO>}){}
}

export class UpdateLeadRequestData implements Action {
  readonly type = LeadActionTypes.UpdateLeadReqdata
  constructor(public payload :{updateleadReqDetails: Update<UpdateLeadsPOJO>}){}
}


export class UpdateHistoryflag implements Action{
  
  readonly type = LeadActionTypes.UpdateHistoryFlag
  constructor(public payload:{Historyflag: Update<any>}){

  }
}
export class UpdateLeadContact implements Action {
  readonly type = LeadActionTypes.UpdateLeadReqContact
  constructor(public payload :{updateleadcontact: Update<UpdateLeadsPOJO>}){}
}


export class UpdateLeadOwner implements Action {
  readonly type = LeadActionTypes.UpdateLeadsOwner
  constructor(public payload :{updateOwner: Update<any>}){}
}
// ------------------------------------------------------------Open Leads Actions ------------------------------------------------------------------


type OpenLeadPOJO = {
  listdata: MyOpenLeadsCollection[],
  count: number,
  nextlink: string
}

export class LoadOpenLeadList implements Action {
  readonly type = LeadActionTypes.LoadOpenLeadList;
  constructor(public payload:{openLeadList:OpenLeadPOJO}) { 
      console.log(payload)
  }
}

export class ClearOpenLeadState implements Action {
  readonly type = LeadActionTypes.clearOpenLeadState;
  
}



// export class OpenLeadNurture implements Action {
//   readonly type = LeadActionTypes.updateOpenNurtureLeads
//   constructor(public payload :{updatenurture: Update<UpdateLeadsPOJO>}){}
// }

// ----------------------------------------------------Archived Leads Actions------------------------------------------------------------------------------------

export class LoadArchivedList implements Action {
  readonly type = LeadActionTypes.LoadArchivedList;
  constructor(public payload:{CreateArchivedLead:ArchivedLeads[],count:any, OdatanextLink: any}) { 
      console.log(payload)
  }
}
export class ArchivedRestore implements Action {
 readonly type = LeadActionTypes.archivedRestoreleads
 constructor (public payload:{ids:any[]}){}
}
export class ClearArchivedLeadState implements Action {
  readonly type = LeadActionTypes.clearArchivedLeadState
}

export class ClearAllLeadDetails implements Action {
  readonly type = LeadActionTypes.ClearAllLeadDetails
}

// ------------------------------------------------------------History Leads Actions ------------------------------------------------------------------

type HistoryPOJO = {
  data: History
}

export class LoadLeadHistory implements Action {
  readonly type = LeadActionTypes.LeadHistory;
  constructor(public payload: { history: HistoryPOJO }) {
    console.log("the history payload is")
    console.log(payload)
   }
}


type LeadActivity = {
  id: any,
  Changes: any
}
export class LeadDetailsLinkedActivity implements Action {
  readonly type = LeadActionTypes.LinkedLeadActivityAdded;
  constructor(public payload: {LinkedLeadActivity: Update<LeadActivity>}) {}
}

type LeadOpp = {
  id: any,
  Changes: any
}
export class LeadDetailsLinkedOpp implements Action {
  readonly type = LeadActionTypes.LinkedLeadOppAdded;
  constructor(public payload: {LinkedLeadOpp: Update<LeadOpp>}) {}
}

type LeadCamp = {
  id: any,
  Changes: any
}
export class LeadDetailsLinkedCamp implements Action {
  readonly type = LeadActionTypes.LinkedLeadCampDelete;
  constructor(public payload: {LinkedLeadCamp: Update<LeadCamp>}) {}
}

type LeadCustomer = {
  id: any,
  Changes: any
}
export class LeadDetailsLinkedCustomer implements Action {
  readonly type = LeadActionTypes.LinkedLeadCustomer;
  constructor(public payload: {LinkedLeadCUstomer: Update<LeadCustomer>}) {}
}
export type LeadActions = ClearAllLeadDetails|UpdateHistoryflag|LeadDetailsLinkedCustomer|UpdateLeadContact| UpdateLeadRequestData|UpdateLeadCampaign|UpdateLeadOwner| UpdateLeadDetails|LoadLeadDetails|LeadSaved|LeadEdited|LoadMyOpenleads|LeadNurture|ArchivedRestore|LoadArchivedList|LeadQualify|LeadDisQualify|ClearArchivedLeadState|ClearMyopenlead|LoadOpenLeadList|ClearOpenLeadState|LeadAccepted|LoadLeadHistory|LeadDetailsLinkedActivity|LeadDetailsLinkedOpp|LeadDetailsLinkedCamp