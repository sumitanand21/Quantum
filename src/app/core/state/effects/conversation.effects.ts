import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { ConversationActions, ConversationActionTypes, CreateCoversation, UpdateAllCoversation } from '../actions/conversation.actions';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { ConversationService } from '@app/core/services/conversation.service';



@Injectable()
export class ConversationEffects {

  @Effect({dispatch:false})
  addConversationIndexdb$ = this.actions$.pipe(
    ofType<CreateCoversation>(ConversationActionTypes.Create),
    tap(async action=>{
      await this.offlineService.ClearConvIndexTableData()
       this.offlineService.addConversationCacheData(this.conversationService.ConversationChacheType.Table,action.payload.CreateConv.data,action.payload.CreateConv.count,action.payload.CreateConv.nextlink)
    })
  )

  @Effect({dispatch:false})
  updateConversationIndexdb$ = this.actions$.pipe(
    ofType<UpdateAllCoversation>(ConversationActionTypes.UpdateAllConv),
    tap(async action =>{
      await this.offlineService.ClearConvIndexTableData()
        this.offlineService.addConversationCacheData(this.conversationService.ConversationChacheType.Table,action.payload.AllConv.data,action.payload.AllConv.count,action.payload.AllConv.nextlink)
    })
  )

  constructor(private actions$: Actions,private offlineService: OfflineService,private conversationService: ConversationService) {}

}
