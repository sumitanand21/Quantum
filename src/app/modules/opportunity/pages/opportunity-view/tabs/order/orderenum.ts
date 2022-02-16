export enum OrderApprovalStage {
  ApprovedbyBFM = 1,
  ApprovedbyDM = 2,
  ApprovedbyADH_VDH_SDH = 3,
  RejectedbyBFM = 4,
  RejectedByDM = 5,
  RejectedByADH_VDH_SDH = 6,
  OnHoldByBFM = 7,
  OnHoldByADH_VDH_SDH = 8,
  InvoicingRequestPendingwithBFM = 9,
  InvoicingRequestApprovedbyBFM = 10,
  InvoicingRequestRejectedbyBFM = 11,
  ForeclosureRequestPendingwithDM = 12,
  ForeclosureRequestApprovedbyDM = 13,
  ForeclosureRequestRejectedbyDM = 14,
  YettobeSubmitted = 15,
  PendingWithDM = 184450000,
  PendingWithADH_VDH_SDH = 184450001,
  PendingWithBFM = 184450002,
  OrderconfirmationRejected = 184450003,
  OrderconfirmationApproved = 184450004,
  InterimApproved = 184450005, //184450003
  Pendingwithdealowner = 184450006,
  Pendingwithorderowner = 184450007,
  Unapproved = 184450008, //184450004
  PendingWithSDH = 184450009,
  Default = 184450010,
  YettobesubmittedforSupervisor_BFM_approval = 184450011,
  Rejected_By_Supervisor = 184450012,
  PendingWithSupervisor = 184450013,
  ApprovedBySDH = 184450014,
  RejectedBySDH = 184450015,
  AutoClosed = 184450016,
  PartiallyApproved = 184450017,
  RejectedbyICTeam = 184450021,
  PendingwithICTeam = 184450019,
  ApprovedbyICTeam = 184450020

}

export enum OrderModificationRequestStatus {
  ModificationRequestPendingwithBFM = 184450000,
  ModificationRequestApprovedbyBFM = 184450001,
  ModificationRequestRejectedbyBFM = 184450002,
  ModificationRequestPartiallyApprovedbyBFM = 184450003,
  ModificationRequestCancelled = 184450004
}

//negative amendment\
export enum negativeEnum {
  StatusCode = 184450002,
  OwnerShip = 184450002,
}

export enum orderApprovalType {
  Amendment = 184450000,
  Foreclosure = 184450005,
  Invoicing = 184450002,
  Modified_Order = 5,
  Order = 184450004,
  ConfirmedOrderApproval = 184450001,
  NegativeAmendmentApproval = 184450003
}

export enum orderTypeId {
  Incremental = 184450001,
  Renewal = 184450000,
  Negative = 184450006,
  ErrorHandling = 184450002,
  Trueup = 184450004,
  New = 184450005,
}




export enum opportunityTypeId {
  Incremental_Enhancement = 3,
  New = 2,
  Renewal = 1
}

export enum FileUpload {
  letterOfIntent = '899',
  KMDocuments = '894',
  uploadAttachments = '901', //upload contract
  BFMApproval = '896'

  //for next UniqueKey add +1////////// 
}



export enum columnFilterNumbers {
  OrderId = 42,
  OpportunityId = 23,
  OpportunityName = 0,
  OrderOwner = 6,
  SAPCustomerCode = 44,
  SAPCustomerCodes = 48,
  ProjectCode = 52,
  StartDate = 18,
  EndDate = 19,
  PricingId = 5,
  PricingType = 43,
  OrderTcv = 27,
  ApprovalType = 60,
  AccountName = 2,
  Status = 30,
  Type = 45,
  CreatedOn = 3
};
export enum columnSortPOA {
  BU = 1,
  CompanyCode = 2,
  Category = 3,
  Location = 4,
  POAName = 5,
  EmailId = 6
}