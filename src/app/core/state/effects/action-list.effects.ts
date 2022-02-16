import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ActionListTypes,  LoadActionConv } from '../actions/action-list.actions';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { actionListService } from '@app/core/services';


@Injectable()
export class ActionListEffects {

  @Effect({dispatch:false})
  actconversatiodetailIndexdb$ = this.actions$.pipe(
    ofType<LoadActionConv>(ActionListTypes.LoadAction),
    tap(async action =>{
        await this.offlineService.ClearActionConvIndexTableData(),
        this.offlineService.addActionConversationCacheData(
          this.actionListService.ActionConvChacheType.Table,
          action.payload.ActionTableList.actionlist, 
          action.payload.ActionTableList.nextlink, 
          action.payload.ActionTableList.count)
    })
  )

  constructor(private actions$: Actions,private offlineService: OfflineService,private actionListService: actionListService) {}

}
