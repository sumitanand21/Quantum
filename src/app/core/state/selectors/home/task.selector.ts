import { createFeatureSelector, createSelector } from "@ngrx/store";
import { TaskState } from "../../reducers/home/task.reducer";
// import { HomeState } from "../../reducers/home/home.reducer";

export const AllTaskState = createFeatureSelector<TaskState>("TaskList")

export const selectTaskTable = createSelector(

    AllTaskState,
    res=>res

)
