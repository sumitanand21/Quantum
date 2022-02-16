import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
// import { ConversationActions, ConversationActionTypes, CreateCoversation, UpdateAllCoversation } from '../actions/conversation.actions';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { ConversationService } from '@app/core/services/conversation.service';
import { ConversationActionTypes, LoadArchiveConv, LoadMyConv, LoadAllConv } from '../../actions/conversation.actions';



@Injectable()
export class ArchivedConvEffects {

  @Effect({ dispatch: false })
  LoadArchivedConv$ = this.actions$.pipe(
    ofType<LoadAllConv>(ConversationActionTypes.LoadAllConv),
    tap(async action => {
      await this.offlineService.ClearMyConvIndexTableData()
      this.offlineService.addMyConversationCacheData(this.conversationService.ConversationChacheType.Table, action.payload.allconv.allconv, action.payload.allconv.count, action.payload.allconv.nextlink)
    })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private conversationService: ConversationService) { }

}
