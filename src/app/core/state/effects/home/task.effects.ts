import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
// import { ConversationActions, ConversationActionTypes, CreateCoversation, UpdateAllCoversation } from '../actions/conversation.actions';
import { OfflineService,taskService } from '@app/core/services';
import { tap } from 'rxjs/operators';
import { ConversationService } from '@app/core/services/conversation.service';
import { LoadTaskTableList, HomeActionListTypes } from '../../actions/home.action';



@Injectable()
export class TaskEffects {

  @Effect({ dispatch: false })
  LoadAllActivity$ = this.actions$.pipe(
      ofType<LoadTaskTableList>(HomeActionListTypes.LoadTableList),
      tap(async action => {
          let TaskList = [];
          let link = ""
          const CacheResponse = await this.taskService.getCachedTaskList()
          if (CacheResponse) {
              console.log("we have cache response1!@!@")
              console.log(CacheResponse)
              if (CacheResponse.data.length > 0) {
                  TaskList = CacheResponse.data.concat(action.payload.taskList.tasklistdata)
              }
          } else {
              TaskList = action.payload.taskList.tasklistdata
          }
          (action.payload.taskList.nextlink) ? link = action.payload.taskList.nextlink : link = ""
          await this.offlineService.ClearTaskListIndexTableData()
          this.offlineService.addTaskListCacheData(this.taskService.TaskCacheType.Table, TaskList, action.payload.taskList.count, link);
      })
  )


  constructor(private actions$: Actions, private offlineService: OfflineService, private conversationService: ConversationService,private taskService:taskService) { }

}
