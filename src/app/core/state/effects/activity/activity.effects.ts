import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { ConversationService } from '@app/core/services/conversation.service';
// import { LeadsListActions, CreateUnqualifiedLeads, LeadsActionTypes,CreateQulifiedList, CreateArchivedList } from '../actions/lead-list.action'
import { ContactleadService } from '@app/core/services/contactlead.service';
import { LoadAllActivity, ActivityActionTypes, LoadActivityDetailsById, LoadMyActivity, MeetingActionTypes, LoadMeetingsByParentId, LoadArchiveActivity, LoadActionsByParentId, LoadOtherActivityListByParentId, RestoreActivity, LoadMeetingDetailsById } from '../../actions/activities.actions';
import { ActivityService } from '@app/core/services/activity.service';
import { threadListService } from '@app/core/services/threadList.service';
import { ArchivedConversationService, actionListService, OthersListService, ActivityDetailsOfflineService } from '@app/core/services';

@Injectable()
export class ActionEffects {
    
    @Effect({ dispatch: false })
    LoadAllActivity$ = this.actions$.pipe(
        ofType<LoadAllActivity>(ActivityActionTypes.LoadAllActivity),
        tap(async action => {
            let ActivityList = [];
            let link = ""
            const CacheResponse = await this.activityService.getCachedActivity()
            if (CacheResponse) {
                if (CacheResponse.data) {
                    if(CacheResponse.data.length > 0) {
                        ActivityList = CacheResponse.data.concat(action.payload.activity.allactivity)
                    }
                }
            } else {
                ActivityList = action.payload.activity.allactivity
            }
            (action.payload.activity.nextlink) ? link = action.payload.activity.nextlink : link = ""
            await this.offlineService.ClearActivityIndexTableData()
            this.offlineService.addActivityCacheData(this.activityService.ActivityChacheType.Table, ActivityList, action.payload.activity.count, link);
        })
    )

    @Effect({ dispatch: false })
    LoadActivityDetails$ = this.actions$.pipe(
        ofType<LoadActivityDetailsById>(ActivityActionTypes.LoadActivityDetails),
        tap(async action => {
          
            this.offlineService.addConverDetailsCacheData(this.activityService.ActivityChacheType.Details, action.payload.activityDetails, action.payload.activityDetails.parentid)
        })
    )

    @Effect({ dispatch: false })
    LoadMyActivity$ = this.actions$.pipe(
        ofType<LoadMyActivity>(ActivityActionTypes.LoadMyActivity),
        tap(async action => {
            let MyActivityList = [];
            let link = ""
            const CacheResponse = await this.activityService.getCachedMyActivity()
            if (CacheResponse) {
                if (CacheResponse.data.length > 0) {
                    MyActivityList = CacheResponse.data.concat(action.payload.myactivity.myactivity)
                }
            } else {
                MyActivityList = action.payload.myactivity.myactivity
            }
            (action.payload.myactivity.nextlink) ? link = action.payload.myactivity.nextlink : link = ""
            await this.offlineService.ClearMyactivityIndexTableData()
            this.offlineService.addMyActivityCacheData(this.activityService.ActivityChacheType.Table, MyActivityList, action.payload.myactivity.count, link);
        })
    )

    @Effect({ dispatch: false })
    LoadActivityMeeting$ = this.actions$.pipe(
        ofType<LoadMeetingsByParentId>(MeetingActionTypes.LoadMeetingByParentId),
        tap(async action => {
            let ActivityMeetingById = [];
            let link = ""
            const CacheResponse = await this.activityMeetingService.getCacheActivityMeetingListById(action.payload.meetings.parentId)
            console.log("got the response formCACHE meeting!@!@!@")
            console.log(CacheResponse)
            if (CacheResponse) {
                if (CacheResponse.data.length > 0) {
                    ActivityMeetingById = CacheResponse.data.concat(action.payload.meetings.list.data)
                }
            } else {
                 ActivityMeetingById = action.payload.meetings.list.data
            }
            // (action.payload.myactivity.nextlink) ? link = action.payload.myactivity.nextlink : link = ""
             await this.offlineService.ClearActivityMeetingListIndexTableDataById(action.payload.meetings.parentId)
             this.offlineService.addActivityMeetingListCacheData(this.activityMeetingService.ActivityMeetingChacheType.Table,ActivityMeetingById, action.payload.meetings.list.count,action.payload.meetings.list.nextlink,action.payload.meetings.parentId);
        })
    )

    @Effect({ dispatch: false })
    LoadActivityAction$ = this.actions$.pipe(
        ofType<LoadActionsByParentId>(MeetingActionTypes.LoadActionsByParentId),
        tap(async action => {
            let ActivityParentById = [];
            let link = ""
            const CacheResponse = await this.actionService.getCacheActivityActionListById(action.payload.actions.parentId)
            console.log("got the response from action cache")
            console.log(CacheResponse)
            if (CacheResponse != null) {
                if (CacheResponse.data.length > 0) {
                    ActivityParentById = CacheResponse.data.concat(action.payload.actions.list.data)
                }   
            } else {
                ActivityParentById = action.payload.actions.list.data
                console.log('ActivityParentId', ActivityParentById)
            }
             await this.offlineService.ClearActivityActionListIndexTableDataById(action.payload.actions.parentId)
             this.offlineService.addActivityActionListCacheData(this.actionService.ActionConvChacheType.Table, ActivityParentById, action.payload.actions.list.count, action.payload.actions.list.nextlink, action.payload.actions.parentId);
        })
    )

    @Effect({ dispatch: false })
    LoadOtherActivity$ = this.actions$.pipe(
        ofType<LoadOtherActivityListByParentId>(MeetingActionTypes.LoadOtherActivityListsByParentId),
        tap(async action => {
            let ActivityParentById = [];
            let link = ""
            const CacheResponse = await this.otherService.getCacheOtherActivityListById(action.payload.others.parentId)
            console.log("got the response from other cache")
            console.log(CacheResponse)
            if (CacheResponse) {
                if (CacheResponse.data.length > 0) {
                    ActivityParentById = CacheResponse.data.concat(action.payload.others.list.data)
                }
            } else {
                ActivityParentById = action.payload.others.list.data
            }
            // (action.payload.myactivity.nextlink) ? link = action.payload.myactivity.nextlink : link = ""
             await this.offlineService.ClearOtherActivityIndexTableDataByParentId(action.payload.others.parentId)
             this.offlineService.addOtherActivityCacheData(this.otherService.OtherListConvChacheType.Table,ActivityParentById, action.payload.others.list.count,action.payload.others.list.nextlink,action.payload.others.parentId);
        })
    )

    @Effect({ dispatch: false })
    LoadArchiveActivity$ = this.actions$.pipe(
        ofType<LoadArchiveActivity>(ActivityActionTypes.LoadArchiveActivity),
        tap(async action => {
            let ArchiveActivityList = [];
            let link = ""
            const CacheResponse = await this.archivedActivityService.getArchivedCachedConvesartion()
            if (CacheResponse) {
                if (CacheResponse.data) {
                    if (CacheResponse.data.length > 0) {
                        ArchiveActivityList = CacheResponse.data.concat(action.payload.archiveActivity.archiveActivity)
                    }
                }
            } else {
                ArchiveActivityList = action.payload.archiveActivity.archiveActivity
            }
            (action.payload.archiveActivity.nextlink) ? link = action.payload.archiveActivity.nextlink : link = ""
            await this.offlineService.ClearArchivedConvIndexTableData()
            this.offlineService.addArchivedCacheData(this.actionService.ActionConvChacheType.Table, action.payload.archiveActivity.archiveActivity, action.payload.archiveActivity.count, action.payload.archiveActivity.nextlink);
        })
    )

    @Effect({ dispatch: false })
    LoadMeetingdetails$ = this.actions$.pipe(
        ofType<LoadMeetingDetailsById>(MeetingActionTypes.LoadMeetingDetails),
        tap(async action => {
            let id = action.payload.Load_Meetingdetails.Guid
            let Activitydetails = action.payload.Load_Meetingdetails
            await this.activityDetailsOfflineServ.ClearActivityDetailsIndexDbData(id)
                this.activityDetailsOfflineServ.addActivityDetailsCacheData(this.activityMeetingService.ActivityMeetingChacheType.Details,Activitydetails,id)
        })
    )


    constructor(
        private activityService: ActivityService,
        public archivedActivityService: ArchivedConversationService,
        private activityMeetingService:threadListService ,
        public actionService: actionListService,
        private actions$: Actions, 
        private offlineService: OfflineService, 
        private leadService: ContactleadService,
        private otherService : OthersListService,
        private activityDetailsOfflineServ:ActivityDetailsOfflineService) { }

}
