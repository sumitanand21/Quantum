import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
// import { DealsActionTypes, CalenderListAction } from '../../actions/deals.actions';
import { dealService } from '@app/core/services/deals.service';

import { DealsActionTypes, CalenderListAction } from '@app/core/state/actions/deals.actions';


@Injectable()
export class ActionListEffects {

  @Effect({ dispatch: false })
  LoadUploadRLS$ = this.actions$.pipe(
    ofType<CalenderListAction>(DealsActionTypes.calenderActionList),
    tap(async action => {
      console.log("effets action display")
      console.log(action)
      await this.offlineService.ClearCalenderListTableData()
      this.offlineService.addCalenderListCacheData(this.dealService.DealCacheType.Table, action.payload.CalenderActionList)
    })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private dealService: dealService) { }

}