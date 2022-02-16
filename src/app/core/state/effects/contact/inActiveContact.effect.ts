

import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { tap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "../..";
import { OfflineService, ContactService } from "@app/core";
import { LoadAllDeActivateContacts, inActivateContactActionTypes } from "../../actions/InActivateContact.action";


@Injectable()
export class ContactEffects {

    constructor(private actions$: Actions, public store: Store<AppState>,
        private offlineService: OfflineService,
        private contactService: ContactService, ) { }


//--------------------------DeActivated Contact List offline---------------------------------------------------------------
    @Effect({ dispatch: false })
    LoadAllDeActivatedContacts$ = this.actions$.pipe(
        ofType<LoadAllDeActivateContacts>(inActivateContactActionTypes.LoadAllDeActivateContacts),
        tap(async action => {
            let DeActivatedContactList = [];
            const CacheResponse = await this.contactService.getCachedDeActivatedContact()
            if (CacheResponse) {
                if (CacheResponse.data.length > 0) {
                    DeActivatedContactList = CacheResponse.data.concat(action.payload.allInActivateContacts)
                }
            } else {
                DeActivatedContactList = action.payload.allInActivateContacts.contactlist
            }
            await this.offlineService.clearDeActivateContactListData()
            this.offlineService.addDeActivatedContactsCacheData(this.contactService.contactChacheType.Table, DeActivatedContactList, action.payload.allInActivateContacts.count, action.payload.allInActivateContacts.nextlink);
        })
    )


   



}