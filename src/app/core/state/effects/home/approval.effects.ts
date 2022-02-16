import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService, approvalService } from '@app/core/services';
import { tap } from 'rxjs/operators';
import { HomeActionListTypes, LoadApprovalTableList } from '../../actions/home.action';



@Injectable()
export class ApprovalEffects {

    @Effect({ dispatch: false })
    approvalList$ = this.actions$.pipe(
        ofType<LoadApprovalTableList>(HomeActionListTypes.LoadApprovalList),
        tap(async action => {
            let ApprovalList = [];
            let link = ""
            const CacheResponse = await this.approval.getCachedApprovalList()
            if (CacheResponse) {
                console.log("we have cache response!")
                console.log(CacheResponse)
                if (CacheResponse.data.length > 0) {
                    ApprovalList = CacheResponse.data.concat(action.payload.approvalList.approvalListData)
                } else {
                    ApprovalList = action.payload.approvalList.approvalListData
                }
            }
            (action.payload.approvalList.nextlink) ? link = action.payload.approvalList.nextlink : link = ""
            await this.offlineService.ClearApprovalListIndexTableData()
            this.offlineService.addApprovalListCacheData(this.approval.approvalListCacheType.Table, action.payload.approvalList.approvalListData, action.payload.approvalList.count, action.payload.approvalList.nextlink);
        })
    )


    constructor(
        private actions$: Actions,
        private offlineService: OfflineService,
        private approval: approvalService) { }

}
