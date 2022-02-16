import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { DealsActionTypes, ModuleListAction } from '../../actions/deals.actions';
import { dealService } from '@app/core/services/deals.service';



@Injectable()
export class ModuleListEffects {

  @Effect({ dispatch: false })
  LoadModuleList$ = this.actions$.pipe(
    ofType<ModuleListAction>(DealsActionTypes.ModuleListAction),
    tap(async action => {
      console.log("effets action display")
      console.log(action)
      await this.offlineService.ClearModuleListTableData()
      this.offlineService.addModuleListData(this.dealService.DealCacheType.Table, action.payload.ModuleList)
    })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private dealService: dealService) { }

}
