import { Injectable } from "@angular/core";
import { Effect, Actions, ofType } from "@ngrx/effects";
import { UpdateContact, ContactActionTypes, UpdateContactDetails, UpdateContactList, LoadAllRelationshipCount, RelationshipLogActionTypes, LoadAllContacts, LoadContactDetailsById, LoadMarketInfoDetailsById } from "../../actions/contact.action";
import { tap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "../..";
import { OfflineService, ContactService } from "@app/core";


@Injectable()
export class ContactEffects {

    constructor(private actions$: Actions, public store: Store<AppState>,
        private offlineService: OfflineService,
        private contactService: ContactService, ) { }
//--------------------------Contact List offline---------------------------------------------------------------
    @Effect({ dispatch: false })
    LoadAllContacts$ = this.actions$.pipe(
        ofType<LoadAllContacts>(ContactActionTypes.LoadAllContacts),
        tap(async action => {
            let ContactList = [];
            const CacheResponse = await this.contactService.getCachedContact()
            if (CacheResponse) {
                if (CacheResponse.data.length > 0) {
                    ContactList = CacheResponse.data.concat(action.payload.AllContacts)
                }
            } else {
                ContactList = action.payload.AllContacts
            }
            await this.offlineService.clearContactListData()
            this.offlineService.addContactsCacheData(this.contactService.contactChacheType.Table, ContactList, action.payload.count, action.payload.nextlink);
        })
    )


//-----------------Relationship log details offline------------------------------------------------------------
    @Effect({ dispatch: false })
    LoadRelationshipLogDetails$ = this.actions$.pipe(
        ofType<LoadAllRelationshipCount>(RelationshipLogActionTypes.loadAllRelationshipCount),
        tap(async action => {
            this.offlineService.addRelationshipLogCacheData(this.contactService.contactChacheType.Details, action.payload.AllRelationshiplogCount, action.payload.AllRelationshiplogCount.id)
        })
    )

    //-------------------------------------Contact detail page offline-----------------------------------------------------------------------------------
    @Effect({ dispatch: false })
    LoadContactDetails$ = this.actions$.pipe(
        ofType<LoadContactDetailsById>(ContactActionTypes.LoadContactDetails),
        tap(async action => {
            this.offlineService.addContactDetailsCacheData(this.contactService.contactChacheType.Details, action.payload.contactDetails, action.payload.contactDetails.id)
        })
    )

       //----------------------------Market detail page offline-----------------------------------------------------------------------------------
       @Effect({ dispatch: false })
       LoadMarketDetails$ = this.actions$.pipe(
           ofType<LoadMarketInfoDetailsById>(ContactActionTypes.LoadMarketInfoDetails),
           tap(async action => {
               this.offlineService.addMarketDetailsCacheData(this.contactService.contactChacheType.Details, action.payload.marketDetails, action.payload.marketDetails.id)
           })
       )

}