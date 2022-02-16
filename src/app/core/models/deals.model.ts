import { Module } from "./module.model";

export class TaggedDeals {
  id: number;
  OppNam: string;
  OppID: string;
  accoun: string;
  SBU: string;
  OppOwn: string;
  TCV: Number;

}
export class ExistingDeals {
  id: number;
  dealName: string;
  createDate: string;
  account: string;
  curency: string;
  TCV: string;
  status: string;
  oppID: string;
  pricingId: string;
}

export class SearchDeals {
  id: number;
  OppNam: string;
  OppID: string;
  prodOpp: string;
  groupCustName: string;
  CustName: string;

}
export class TeamDeal {
  Role: string;
  Username: string;
}

export class Milestone {
  id: number;
  Milestone: string;
  breakUp: string;
  Work: string;
}

export class RLS {
  id: number;
  functional: string;
  remark: string;
  seed: string;
  serviceLyn: string;
  practice: string;
  subpractice: string;
  skill: string;
  langskill: string;
  role: string;
  band: string;
  totalexp: string;
  shift: string;
  billability: string;
  location: string;
  city: string;
  deploy: string;
  linkedip: string;
  serviceip: string;
  remarksip: string;
  billing: string;
  efforts: number;
  m1: number;
  m2: number;
  m3: number;
  m4: number;
}

export class Intellectual {
  id: number;
  iptype: string;
  product: string;
  module: string;
  revenue: number;
  cost: number;
  term: string;
  count: number;
  duration: number;
  unit: number;
  amc: string;
}

export class passProduct {
  id: number;
  category: string;
  servlyn: string;
  practisepass: string;
  type: string;
  vendor: string;
  desp: string;
  reimb: number;
  cost: number;
  margin: number;
  total: number;
  m1: number;
  seed1: string;
}
export class calModel {
  id: number;
  actionName: string;
  actionType: string;
  actionOwner: string;
  startDate: string;
  endDate: string;
  module: string;
  status: string;
  approval: string;
  attachment: string;
  approver: string;
  escalateCont: string;
  dependencies: string;

}

export class WCS {
  id: number;
  empno: string;
  band: string;
  servline: string;
  practice: string;
  loc: string;
  rate: number;
}
export class dealContract {
  empno: string;
  curncy: string;
  agencytype: string;
  agencyrate: string;
  band: string;
  sercline: string;
  practice: string;
}
export class pastDeals {
  id: number;
  dealName: string;
  closure: string;
  oaid: string;
  pid: string;
  clName: string;
  sbu: string;
  vertical: string;
  tcvCurr: string;
  tcvUsd: string;
  status: string;
}
export class RLSDeals {
  id: number;
  dealName: string;
  creation: string;
  oaid: string;
  pid: string;
  clName: string;
  sbu: string;
  vertical: string;
  dealCurr: string;
  type: string;
  status: string;
}

export class ProposalCreate {
  Name: string;
  SubmissionDate: string;
  TemplateType: number;
  Template: string;
  ProposalStatus: string;
  Id: number;
}

export class ProposalsDataRequest {
  Id: number;
  LastRecordId: number;
  PageSize: number;
  SearchText: string;
}

export interface IDealTechSolution {
  indxparent: string;
  module: string;
  author: string;
  
}
