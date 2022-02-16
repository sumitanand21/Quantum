import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { DealsActionTypes, CreateListAction } from '../../actions/deals.actions';
import { dealService } from '@app/core/services/deals.service';



@Injectable()
export class ActionListEffects {

  @Effect({ dispatch: false })
  LoadUploadRLS$ = this.actions$.pipe(
    ofType<CreateListAction>(DealsActionTypes.CreateActionList),
    tap(async action => {
      console.log("effets action display")
      console.log(action)
      await this.offlineService.ClearActionListTableData()
      this.offlineService.addActionListCacheData(this.dealService.DealCacheType.Table, action.payload.CreateActionList, action.payload.count)
    })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private dealService: dealService) { }

}
