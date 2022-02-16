import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { DealsActionTypes, DealParameterListAction  } from '../../actions/deals.actions';
import { dealService } from '@app/core/services/deals.service';
@Injectable()
export class DealParamasEffects {

  @Effect({ dispatch: false })
  DealParameter$ = this.actions$.pipe(
    ofType<DealParameterListAction>(DealsActionTypes.DealParameter),
    tap(async action => {
      console.log("effets action display")
      console.log(action)
      await this.offlineService.ClearDealParamasData()
      this.offlineService.addDealParamasCacheData(this.dealService.DealCacheType.Table, action.payload.dealparameterList)
    })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private dealService: dealService) { }

}
