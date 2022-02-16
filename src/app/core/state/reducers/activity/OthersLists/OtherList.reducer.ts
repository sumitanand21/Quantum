import { ActivityActions, MeetingActionTypes } from "@app/core/state/actions/activities.actions";
import { isType } from "@angular/core/src/type";

export interface OtherListState {
    Otherlist:any
}

 const initialOtherListState:OtherListState  = {
    Otherlist:[]
    }

    export function OtherListReducer(state=initialOtherListState,action:ActivityActions):OtherListState  {
        switch (action.type) {
            case MeetingActionTypes.LoadOtherActivityListsByParentId:
            const Otherlist = state.Otherlist
            if (Otherlist.some(x=>x.parentId==action.payload.others.parentId)) {
                Otherlist.map((x)=>{
                    debugger;;
                    (x.parentId==action.payload.others.parentId)
                    x.list.data.concat(action.payload.others.list.data)
                    x.list.nextlink = action.payload.others.list.nextlink
                    x.list.count = action.payload.others.list.count
                })
                return {
                    ...state,
                    Otherlist:Otherlist
                }
            }else{
                Otherlist.push(action.payload.others)
                return{
                    ...state,
                    Otherlist:Otherlist
                }
            }
            case MeetingActionTypes.InsertNewOtherActivity:
            const CreateOtherlist = state.Otherlist
            if (CreateOtherlist.some(x=>x.parentId==action.payload.CreateOther.id ) ) {

                CreateOtherlist.map((x)=>{
                    (x.parentId==action.payload.CreateOther.id)
                    x.list.data.unshift(action.payload.CreateOther.data)
                     x.list.count=x.list.count+1
                })
                return {
                    ...state,
                    Otherlist:CreateOtherlist
                }
             }else{
                return {...state}
             } 
             case MeetingActionTypes.UpdateOtherActivity:
             const UpdateOtherlist = state.Otherlist
             if (UpdateOtherlist.some(x=>x.parentId==action.payload.EditOther.parentId)) {
                UpdateOtherlist.map((x)=>{
                    (x.parentId==action.payload.EditOther.parentId)
                   const removeId = new Set([action.payload.EditOther.id]);
                   const UpdateArray = x.list.data.filter(obj => !removeId.has(obj.Guid));
                   UpdateArray.push(action.payload.EditOther.data)
                    x.list.data = UpdateArray
                })
                return {
                    ...state,
                    Otherlist:UpdateOtherlist
                }
             }else{
                return {...state}
             } 
             case MeetingActionTypes.ClearOtherList:
                 
                 const ClearOtherListdata = state.Otherlist
         if (ClearOtherListdata.some(x=>x.parentId==action.payload.clearotherlist)) {
            ClearOtherListdata.map((x)=>{
                (x.parentId==action.payload.clearotherlist)
                x.list.data=[]
                x.parentId=""
            })
            return {
                ...state,
                Otherlist:ClearOtherListdata
            }
            }
            else{
                 return {
                ...state
            }
        }

        default:{
            return state
        }
    }
}
