import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { TaskListCollection } from "../../state.models/home/task.interface";
import { HomeActions, HomeActionListTypes } from "../../actions/home.action";

export interface TaskState extends EntityState<TaskListCollection> {
count:number,
nextlink:string
}

export const adapter:EntityAdapter<TaskListCollection>=createEntityAdapter<TaskListCollection>()

export const InitialState:TaskState = adapter.getInitialState({
    count:0,
    nextlink:""
})

export function TaskReducer(state=InitialState, action:HomeActions) : TaskState {
    switch (action.type) {
        case HomeActionListTypes.LoadTableList:
            return adapter.addMany(action.payload.taskList.tasklistdata,{...state,count:action.payload.taskList.count,nextlink:action.payload.taskList.nextlink})
        case HomeActionListTypes.ClearTask:
            return adapter.removeAll(state)    
        default:{
            return state
        }
    }   
}