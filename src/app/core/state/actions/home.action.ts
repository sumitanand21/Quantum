import { Action } from '@ngrx/store';
import { TaskListCollection } from '../state.models/home/task.interface';
import { approvalListCollection } from '../state.models/home/approval.interface';
import { tasksListCollection } from '../state.models/home/tasks.interface';

export enum HomeActionListTypes {
    LoadTask = '[Load Task list] LoadTaskList',
    LoadApproval = '[Load Approval list] LoadApprovalList',
    LoadTableList = '[Load Task Table Data] LoadTaskTable',
    LoadApprovalList = '[Load Approval Table List] LoadApprovalTable',
    LoadTasksTableList ='[Load Task Table List], LoadTaskTable',
    ClearTask = '[Clear Task List] ClearTaskList'
}

type TaskListObject = {
data:any,
count:number
}
type ApprovalListObject = {
    data:any,
    count:number
}


export class LoadTaskList implements Action {
    readonly type = HomeActionListTypes.LoadTask;
    constructor(public payload:{TaskList:TaskListObject}) { 
        console.log(payload)
    }
}

export class LoadApprovalList implements Action{
    readonly type = HomeActionListTypes.LoadApproval;
    constructor(public payload:{ApprovalList:ApprovalListObject}) {
        console.log("Load Approval list", payload);
    }
}

export class ClearTaskList implements Action{
    readonly type = HomeActionListTypes.ClearTask;
}
// ----------------------------------------------------------------Task List------------------------------------------------------------------------

type TaskTablePOJO = {
    tasklistdata:TaskListCollection[],
    count:number,
    nextlink:string
} 

export class LoadTaskTableList implements Action{
    readonly type = HomeActionListTypes.LoadTableList;
    constructor(public payload:{taskList:TaskTablePOJO}) {
        console.log("Load task list", payload);
    }
}

// -----------------------------------------------------------------Approval List---------------------------------------------------------------------------------------

type ApprovalTablePOJO = {
    approvalListData:approvalListCollection[],
    count:number,
    nextlink:string
} 

export class LoadApprovalTableList implements Action{
    readonly type = HomeActionListTypes.LoadApprovalList;
    constructor(public payload:{approvalList:ApprovalTablePOJO}) {
        console.log("Load approval list", payload);
    }
}

type TasksTablePOJO = {
    tasksListData:tasksListCollection[],
    count:number,
    nextlink:string

} 

export class LoadTasksTableList implements Action{
    readonly type = HomeActionListTypes.LoadTasksTableList;
    constructor(public payload:{tasksList:TasksTablePOJO}) {
        console.log("Load task list", payload);
    }
}


export type HomeActions = 
    LoadTaskList | 
    LoadApprovalList |
    LoadTaskTableList | 
    LoadApprovalTableList | 
    LoadTasksTableList |
    ClearTaskList
