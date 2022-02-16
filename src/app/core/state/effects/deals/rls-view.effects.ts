import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { DealsActionTypes, RLSViewAction } from '../../actions/deals.actions';
import { dealService } from '@app/core/services/deals.service';



@Injectable()
export class RLSViewEffects {

  @Effect({ dispatch: false })
  LoadRLSView$ = this.actions$.pipe(
    ofType<RLSViewAction>(DealsActionTypes.RLSviewData),
    tap(async action => {
      console.log("effets action display")
      console.log(action)
      await this.offlineService.ClearRLSListTableData()
      this.offlineService.addRLSListCacheData(this.dealService.DealCacheType.Table, action.payload.RLSviewData, action.payload.RLSviewData.totalRowCount)
    })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private dealService: dealService) { }

}
