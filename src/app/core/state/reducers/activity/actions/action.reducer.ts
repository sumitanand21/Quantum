import { ActivityActions, MeetingActionTypes } from "@app/core/state/actions/activities.actions";


export interface actionState {
    actionList: any
}

const initialActionState: actionState = {
    actionList: []
}


export function ActionListReducer(state = initialActionState, action: ActivityActions): actionState {
    switch (action.type) {
        case MeetingActionTypes.LoadActionsByParentId:
            const AllActionList = state.actionList
            console.log("->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
            console.log(AllActionList)
            if (AllActionList.some(x => x.parentId == action.payload.actions.parentId)) {
                console.log('actionList-->', AllActionList)
                console.log(action)
                AllActionList.map((x) => {
                    (x.parentId == action.payload.actions.parentId)
                    x.list.data.concat(action.payload.actions.list.data)
                    x.list.nextlink = action.payload.actions.list.nextlink
                    x.list.count = action.payload.actions.list.count
                })
                return {
                    ...state,
                    actionList: AllActionList
                }
            } else {
                AllActionList.push(action.payload.actions)
                return {
                    ...state,
                    actionList: AllActionList
                }
            }
        case MeetingActionTypes.InsertAction:
            const newActionList = state.actionList
            if (newActionList.some(x => x.parentId == action.payload.action.id)) {

                newActionList.map((x) => {
                    (x.parentId == action.payload.action.id)
                    x.list.data.unshift(action.payload.action.data)
                    x.list.count = x.list.count + 1
                })
                return {
                    ...state,
                    actionList: newActionList
                }
            } else {
                return { ...state }
            }
        case MeetingActionTypes.EditAction:
            let UpdateActionlist = state.actionList
            if (UpdateActionlist.some(x => x.parentId == action.payload.editAction.parentId)) {
                UpdateActionlist.map((x) => {
                    (x.parentId == action.payload.editAction.parentId)
                    const removeId = new Set([action.payload.editAction.id]);
                    const UpdateArray = x.list.data.filter(obj => !removeId.has(obj.ActionId));
                    console.log('UpdateArray-->', UpdateArray)
                    UpdateArray.push(action.payload.editAction.data)
                    x.list.data = UpdateArray
                })
                return {
                    ...state,
                    actionList: UpdateActionlist
                }
            } else {
                return { ...state }
            }
        case MeetingActionTypes.ClearAction:
            const ClearActionListdata = state.actionList
            if (ClearActionListdata.some(x => x.parentId == action.payload.clearaction)) {
                ClearActionListdata.map((x) => {
                    (x.parentId == action.payload.clearaction)
                    x.list.data = []
                    x.parentId = ""
                })
                return {
                    ...state,
                    actionList: ClearActionListdata
                }
            }
            else {
                return {
                    ...state
                }
            }
        default: {
            return state
        }
    }
}



