// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { OfflineService } from '@app/core/services/offline.services';
// import { tap } from 'rxjs/operators';
// import { ConversationService } from '@app/core/services/conversation.service';
// import { LeadsListActions, CreateUnqualifiedLeads, LeadsActionTypes,CreateQulifiedList, CreateArchivedList } from '../actions/lead-list.action'
// import { ContactleadService } from '@app/core/services/contactlead.service';

// @Injectable()
// export class LeadEffects {
// // UnQualifiedLeads effect
//   @Effect({ dispatch: false })
//   LeadIndexdb$ = this.actions$.pipe(
//     ofType<CreateUnqualifiedLeads>(LeadsActionTypes.LoadUnqualifiedList),
//     tap(async action => {
//       let UnqualifiedDate = [];
//       let offlineUnqualifiedLeads = await this.offlineService.getUnQualifiedLeadsData();
//       if(offlineUnqualifiedLeads.length>0) {
//         if(offlineUnqualifiedLeads[0].data.length>0) {
//           UnqualifiedDate=offlineUnqualifiedLeads[0].data.concat(action.payload.CreateUnqualifiedLead)
//         }
//       }  else {
//         UnqualifiedDate=action.payload.CreateUnqualifiedLead
//       }
//       await this.offlineService.ClearUnQualifiedLeadsTableData()
//       this.offlineService.addUnQualifiedLeadsCacheData(this.leadService.LeadsChacheType.Table, UnqualifiedDate, action.payload.count, action.payload.OdatanextLink)
//     })
//   )

//   // QualifiedLeads

//   @Effect({ dispatch: false })
//   QualifiedLeadsIndexdb$ = this.actions$.pipe(
//     ofType<CreateQulifiedList>(LeadsActionTypes.LoadQualifiedList),
//     tap(async action => {
//       let QualifiedDate = [];
//       let offlineQualifiedLeads = await this.offlineService.getQualifiedLeadsData();
//       if(offlineQualifiedLeads.length>0) {
//         if(offlineQualifiedLeads[0].data.length>0) {
//           QualifiedDate = offlineQualifiedLeads[0].data.concat(action.payload.CreateQualifiedLead)
//         } 
//       } else {
//         QualifiedDate = action.payload.CreateQualifiedLead
//       }
//       await this.offlineService.ClearQualifiedLeadsTableData()
//       this.offlineService.addQualifiedLeadsCacheData(this.leadService.LeadsChacheType.Table, QualifiedDate, action.payload.count, action.payload.OdatanextLink)
//     })
//   )
//   // @Effect({dispatch:false})
//   // updateLeadIndexdb$ = this.actions$.pipe(
//   //   ofType<UpdateUnqualifiedLeads>(LeadsActionTypes.Update),
//   //   tap(async action =>{
//   //     await this.offlineService.ClearConvIndexTableData()
//   //     this.offlineService.addUnQualifiedLeadsCacheData(this.leadService.LeadsChacheType.Table,action.payload.AllUnqualifiedLead.data,action.payload.AllUnqualifiedLead.count)
//   //   })
//   // )

//   @Effect({ dispatch: false })
//   ArchivedLeadsIndexdb$ = this.actions$.pipe(
//     ofType<CreateArchivedList>(LeadsActionTypes.LoadArchivedList),
//     tap(async action => {
//       let ArchivedDate = [];
//       let offlineArchivedLeads = await this.offlineService.getArchivedLeadsData();
//       if(offlineArchivedLeads.length>0) {
//         if(offlineArchivedLeads[0].data.length>0) {
//           ArchivedDate=offlineArchivedLeads[0].data.concat(action.payload.CreateArchivedLead)
//         }
//       }  else {
//         ArchivedDate=action.payload.CreateArchivedLead
//       }
//       await this.offlineService.ClearArchivedLeadsTableData()
//       this.offlineService.addArchivedLeadsCacheData(this.leadService.LeadsChacheType.Table, ArchivedDate, action.payload.count, action.payload.OdatanextLink)
//     })
//   )

//   constructor(private actions$: Actions, private offlineService: OfflineService, private leadService: ContactleadService) { }

// }
