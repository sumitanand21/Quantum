import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
// import { ConversationActions, ConversationActionTypes, CreateCoversation, UpdateAllCoversation } from '../actions/conversation.actions';
import { OfflineService } from '@app/core/services/offline.services';
import { tap } from 'rxjs/operators';
import { ConversationService } from '@app/core/services/conversation.service';
import { ConversationActionTypes, LoadArchiveConv } from '../../actions/conversation.actions';



@Injectable()
export class ArchivedConvEffects {

  @Effect({ dispatch: false })
  LoadArchivedConv$ = this.actions$.pipe(
    ofType<LoadArchiveConv>(ConversationActionTypes.LoadArchiveConv),
    tap(async action => {
      console.log("effets action display")
      console.log(action)
      await this.offlineService.ClearArchivedConvIndexTableData()
      this.offlineService.addArchivedCacheData(this.conversationService.ConversationChacheType.Table, action.payload.archiveconv.archiveconv, action.payload.archiveconv.count, action.payload.archiveconv.nextlink)
    })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private conversationService: ConversationService) { }

}
