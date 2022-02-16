import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { ArchivedConversationService, actionListService } from '@app/core/services';
import { LoadMyOpenleads, LeadActionTypes, LoadArchivedList, LoadOpenLeadList, LeadNurture } from '../../actions/leads.action';
import { MyOpenLeadsService } from '@app/core/services/myopenlead.service';
import { LeadListOfflineService } from '@app/core/services/offline/leads/leadList.offlineService';

@Injectable()
export class LeadEffect {

  @Effect({ dispatch: false })
  LoadMyopenLeads$ = this.actions$.pipe(
    ofType<LoadMyOpenleads>(LeadActionTypes.LoadMyOpenLeads),
    tap(async action => {
      let MyOpenLeadList = [];
      let link = ""
      let LeadTableIdentity=this.leadListOfflineService.LeadTableIdentity.MyOpenLead
      const CacheResponse = await this.myOpenLeadService.getCachedLeadList(LeadTableIdentity)
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          MyOpenLeadList = CacheResponse.data.concat(action.payload.myOpenLeads.listdata)
        }
      } else {
        MyOpenLeadList = action.payload.myOpenLeads.listdata
      }
      (action.payload.myOpenLeads.nextlink) ? link = action.payload.myOpenLeads.nextlink : link = ""
      await this.leadListOfflineService.ClearLeadListIndexTableData(LeadTableIdentity)
      this.leadListOfflineService.addLeadListCacheData(this.myOpenLeadService.LeadsChacheType.Table, MyOpenLeadList, action.payload.myOpenLeads.count, link,LeadTableIdentity);
    })
  )

  @Effect({ dispatch: false })
  LoadOpenLeads$ = this.actions$.pipe(
    ofType<LoadOpenLeadList>(LeadActionTypes.LoadOpenLeadList),
    tap(async action => {
      let OpenLeadList = [];
      let link = ""
      let LeadTableIdentity=this.leadListOfflineService.LeadTableIdentity.OpenLead
      const CacheResponse =  await this.myOpenLeadService.getCachedLeadList(LeadTableIdentity)
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          OpenLeadList = CacheResponse.data.concat(action.payload.openLeadList.listdata)
        }
      } else {

        OpenLeadList = action.payload.openLeadList.listdata
      }
      (action.payload.openLeadList.nextlink) ? link = action.payload.openLeadList.nextlink : link = ""
      await this.leadListOfflineService.ClearLeadListIndexTableData(LeadTableIdentity)
      this.leadListOfflineService.addLeadListCacheData(this.myOpenLeadService.LeadsChacheType.Table, OpenLeadList, action.payload.openLeadList.count, link,LeadTableIdentity);
    })
  )

  @Effect({ dispatch: false })
  ArchivedLeadsIndexdb$ = this.actions$.pipe(
    ofType<LoadArchivedList>(LeadActionTypes.LoadArchivedList),
    tap(async action => {
      let ArchivedData = [];
      let link;
      let LeadTableIdentity=this.leadListOfflineService.LeadTableIdentity.ArchivedLead
      let CacheResponse = await this.myOpenLeadService.getCachedLeadList(LeadTableIdentity)
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          ArchivedData = CacheResponse.data.concat(action.payload.CreateArchivedLead)
        }
      } else {

        ArchivedData = action.payload.CreateArchivedLead
      }
      (action.payload.OdatanextLink) ? link = action.payload.OdatanextLink : link = ""
      await this.leadListOfflineService.ClearLeadListIndexTableData(LeadTableIdentity)
      this.leadListOfflineService.addLeadListCacheData(this.myOpenLeadService.LeadsChacheType.Table, ArchivedData, action.payload.count, link,LeadTableIdentity)
    })
  )

  @Effect({ dispatch: false })
  UpdateLeadsNurtureIndexdb$ = this.actions$.pipe(
    ofType<LeadNurture>(LeadActionTypes.updateNurtureLeads),
    tap(async action => {
      let MyOpenLeadKey=this.leadListOfflineService.LeadTableIdentity.MyOpenLead
      let OpenLeadKey = this.leadListOfflineService.LeadTableIdentity.OpenLead

      const CacheMyleadResponse = await this.myOpenLeadService.getCachedLeadList(MyOpenLeadKey)
      const CacheOpenleadResponse = await this.myOpenLeadService.getCachedLeadList(OpenLeadKey)

      if (CacheMyleadResponse) {
        if (CacheMyleadResponse.data.length > 0) {
          let ActionPayload = { ...action }
          ActionPayload.payload.updateurture.map(x => {
            CacheMyleadResponse.data.map(y => {
              (y.LeadGuid == x.id)
              y.IsNurture = true
            })
          })
          await this.leadListOfflineService.ClearLeadListIndexTableData(MyOpenLeadKey)
          this.leadListOfflineService.addLeadListCacheData(this.myOpenLeadService.LeadsChacheType.Table, CacheMyleadResponse.data, CacheMyleadResponse.count, CacheMyleadResponse.nextlink,MyOpenLeadKey)
        }
      }

      if (CacheOpenleadResponse) {
        if (CacheOpenleadResponse.data.length > 0) {
          let ActionPayload = { ...action }
          ActionPayload.payload.updateurture.map(x => {
            CacheOpenleadResponse.data.map(y => {
              (y.LeadGuid == x.id)
              y.IsNurture = true
            })
          })
          await this.leadListOfflineService.ClearLeadListIndexTableData(OpenLeadKey)
          this.leadListOfflineService.addLeadListCacheData(this.myOpenLeadService.LeadsChacheType.Table, CacheOpenleadResponse.data, CacheOpenleadResponse.count, CacheOpenleadResponse.nextlink,OpenLeadKey)
        }
      }
    })
  )

  constructor(
    public archivedActivityService: ArchivedConversationService,
    public actionService: actionListService,
    private actions$: Actions,
    private myOpenLeadService: MyOpenLeadsService,
    private leadListOfflineService:LeadListOfflineService) { }

}
