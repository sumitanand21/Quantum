import { creationHistoryLists, AccountActionTypes, activeRequestList } from './../../actions/Creation-History-List.action';
import { AllianceAccountTypes } from '@app/core/state/actions/alliance-account-list.action';
import { ReserveAccountTypes } from './../../actions/resereve-account-list.actions';
import { AllianceAccountAction } from '@app/core/state/actions/alliance-account-list.action';
import { AccountListService } from '@app/core/services/accountList.service';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import {FarmingAccountTypes,farmingAccountAction} from '../../actions/farming-account.action';
import { reserveAccountAction } from '../../actions/resereve-account-list.actions';

@Injectable()
export class Accounteffects {
    constructor(private actions$: Actions,private offlineService: OfflineService, private AccountListService: AccountListService) {}
    @Effect({dispatch:false})
    addActiveAccountIndexdb$ = this.actions$.pipe(
        ofType<farmingAccountAction>(FarmingAccountTypes.farmingAccountList),
        tap(async action => {
          await this.offlineService.ClearActiveAccountIndexTableData()
          this.offlineService.addActiveAccountCacheData(this.AccountListService.AccountChacheType.Table,action.payload.FarmingListModel,action.payload.count)
        })
    )

    @Effect({dispatch:false})
    addAllianceAccountIndexdb$ = this.actions$.pipe(
        ofType<AllianceAccountAction>(AllianceAccountTypes.allianceAccountList),
        tap(async action => {
          await this.offlineService.ClearActiveAccountIndexTableData()
          this.offlineService.addAllianceAccountCacheData(this.AccountListService.AccountChacheType.Table,action.payload.AllianceListModel,action.payload.count)
        })
    )

    @Effect({dispatch:false})
    addReserveAccountIndexdb$ = this.actions$.pipe(
        ofType<reserveAccountAction>(ReserveAccountTypes.reserveAccountList),
        tap(async action => {
          await this.offlineService.ClearActiveAccountIndexTableData()
          this.offlineService.addReserveAccountCacheData(this.AccountListService.AccountChacheType.Table,action.payload.ReserveListModel,action.payload.count)
        })
    )

    @Effect({dispatch:false})
    addCreationHistoryIndexdb$ = this.actions$.pipe(
        ofType<creationHistoryLists>(AccountActionTypes.CreationHistoryList),
        tap(async action => {
          await this.offlineService.ClearCreationHistoryIndexTableData()
          this.offlineService.addCreationHistorytCacheData(this.AccountListService.AccountChacheType.Table,action.payload.CreationHistoryModel,action.payload.count)
        })
    )
    @Effect({dispatch:false})
    addActiveRequestsIndexdb$ = this.actions$.pipe(
        ofType<activeRequestList>(AccountActionTypes.ActiveRequestList),
        tap(async action => {
          await this.offlineService.ClearActiveRequestsIndexTableData()
          this.offlineService.addActiveRequestsCacheData(this.AccountListService.AccountChacheType.Table,action.payload.ActiveRequestModel,action.payload.count)
        })
    )
}