import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from '@ngrx/effects';
import { OfflineService } from '@app/core/services/offline.services';
import { dealService } from '@app/core/services/deals.service';
import { GetDealTechSolutionList, DealsActionTypes } from "../../actions/deals.actions";
import { tap } from "rxjs/operators";

@Injectable()
export class DealTechSoluctionEffects {

    constructor(
        private actions$: Actions,
        private offlineService: OfflineService,
        private dealService: dealService) { }

    @Effect({ dispatch: false })
    LoadDealTechSolution$ = this.actions$.pipe(
        ofType<GetDealTechSolutionList>(DealsActionTypes.GetDealTechSolutionList),
        tap(async action => {
            console.log("effets action display")
            console.log(action)
            await this.offlineService.ClearDealTechSolutionIndexTableData()
            this.offlineService.addDealTechSolutionCacheData(this.dealService.DealCacheType.Table, action.payload.dealTechArrayList)
        })
    )


}