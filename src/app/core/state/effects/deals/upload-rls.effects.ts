import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { DealsActionTypes, UploadRLSList } from '../../actions/deals.actions';
import { dealService } from '@app/core/services/deals.service';



@Injectable()
export class UploadRLSEffects {

  @Effect({ dispatch: false })
  LoadUploadRLS$ = this.actions$.pipe(
    ofType<UploadRLSList>(DealsActionTypes.UploadRLS),
    tap(async action => {
      console.log("effets action display")
      console.log(action)
      await this.offlineService.ClearUploadRLSIndexTableData()
      this.offlineService.addUploadRLSCacheData(this.dealService.DealCacheType.Table, action.payload.uploadRLSList)
    })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private dealService: dealService) { }

}
