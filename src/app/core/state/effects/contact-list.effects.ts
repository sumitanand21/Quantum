// import { Injectable } from '@angular/core';
// import { Actions, Effect, ofType } from '@ngrx/effects';
// import { OfflineService } from '@app/core/services/offline.services';
// import { tap } from 'rxjs/operators';
// import { ContactActions, ContactActionTypes } from '../actions/contact.action';
// import { ContactService } from '@app/core/services';



// @Injectable()
// export class ContactListEffects {

//   @Effect({dispatch:false})
//   contactIndexdb$ = this.actions$.pipe(
//     ofType<ContactActions>(ContactActionTypes.LoadAllContacts),
//     tap(async action=>{
//     let ContactData = [];
//     let offlineContactList = await this.offlineService.getContactListData();
//       if(offlineContactList.length>0) {
//         if(offlineContactList[0].data.length>0) {
//             ContactData = offlineContactList[0].data.concat(action.payload.AllContacts)
//         } 
//       } else {
//         ContactData = action.payload.AllContacts
//       }
//       await this.offlineService.clearContactListData()
//        this.offlineService.addContactsCacheData(this.contactService.contactChacheType.Table, action.payload.AllContacts,action.payload.count, action.payload.nextlink)
//     })
//   )

//   constructor(private actions$: Actions,private offlineService: OfflineService,public contactService: ContactService) {}

// }
