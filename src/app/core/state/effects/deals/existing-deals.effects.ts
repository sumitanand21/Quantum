import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { DealsActionTypes, ExistingListAction } from '../../actions/deals.actions';
import { dealService } from '@app/core/services/deals.service';
@Injectable()
export class ExistingDealsEffects {

  @Effect({ dispatch: false })
  ExistingDeals$ = this.actions$.pipe(
    ofType<ExistingListAction>(DealsActionTypes.ExistingListAction),
    tap(async action => {
      console.log("effets action display")
      console.log(action)
      await this.offlineService.ClearExistingDealsData()
      this.offlineService.addExistingDealsCacheData(this.dealService.DealCacheType.Table, action.payload.existingDealslist)
    })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private dealService: dealService) { }

}
