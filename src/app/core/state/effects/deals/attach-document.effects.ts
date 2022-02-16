import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { dealService } from '@app/core/services/deals.service';
import { DealsActionTypes, AttachDocumentsListAction } from "../../actions/deals.actions";
import { tap } from "rxjs/operators";

@Injectable()
export class AttachDocumentEffects {

    constructor(
        private actions$: Actions,
        private offlineService: OfflineService,
        private dealService: dealService) { }

    @Effect({ dispatch: false })
    LoadAttachDocument$ = this.actions$.pipe(
        ofType<AttachDocumentsListAction>(DealsActionTypes.AttachDocumentsListAction),
        tap(async action => {
            console.log("effets action display")
            console.log(action)
            await this.offlineService.ClearAttachDocumentIndexTableData()
            this.offlineService.addAttachDocumentCacheData(this.dealService.DealCacheType.Table, action.payload.attachDocArryList)
        })
    )


}