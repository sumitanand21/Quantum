
import { HomeActions, HomeActionListTypes } from "../../actions/home.action";


// export interface HomeState extends EntityState<TaskListCollection> {
// count:number,
// }

// export const adapter:EntityAdapter<TaskListCollection>=createEntityAdapter<TaskListCollection>({

// })

// export const InitialState:HomeState = adapter.getInitialState({
//     count:0
// })

export const initialHomeState  = {
    data:{
        task:null,
        approval:null
    },
    count:{
        taskCount:0,
        approvalCount:0
    }
    }


export function HomeReducer(state=initialHomeState,action:HomeActions)  {
    switch (action.type) {
        case HomeActionListTypes.LoadTask:
        return {
            ...state,
            data:{
                ...state.data,
                task:action.payload.TaskList.data
            },
            count:{
                ...state.count,
                taskCount:action.payload.TaskList.count
            }
        }
        case HomeActionListTypes.LoadApproval:
        return {
            ...state,
            data:{
                ...state.data,
                approval:action.payload.ApprovalList.data
            },
            count:{
                ...state.count,
                approvalCount:action.payload.ApprovalList.count
            }
            
        }
        case HomeActionListTypes.ClearTask:
        return {
            ...state,
            data:{
                ...state.data,
                task:null
            },
            count:{
                ...state.count,
                taskCount: 0
            }
            
        }
      
        default:{
            return state
        }
    }   
}



