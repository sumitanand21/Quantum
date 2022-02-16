import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { DealsActionTypes, calculateDeals } from '../../actions/deals.actions';
import { dealService } from '@app/core/services/deals.service';



@Injectable()
export class CalculateEffects {

    @Effect({ dispatch: false })
    LoadCalculate$ = this.actions$.pipe(
        ofType<calculateDeals>(DealsActionTypes.calculateDeal),
        tap(async action => {
            console.log("effets action display")
            console.log(action)
            await this.offlineService.ClearCalculateIndexTableData()
            this.offlineService.addCalculateCacheData(this.dealService.DealCacheType.Table, action.payload.calculateDeal)
        })
    )


    constructor(private actions$: Actions, private offlineService: OfflineService, private dealService: dealService) { }

}
