import { ActivityActions, MeetingActionTypes } from "@app/core/state/actions/activities.actions";


export interface meetingState {
    meetinglist:any
}

 const initialMeetingState:meetingState  = {
    meetinglist:[]
    }


export function MeetingListReducer(state=initialMeetingState,action:ActivityActions):meetingState  {
    switch (action.type) {
        case MeetingActionTypes.LoadMeetingByParentId:
        const meetinglist = state.meetinglist
        if (meetinglist.some(x=>x.parentId==action.payload.meetings.parentId)) {
            meetinglist.map((x)=>{
                (x.parentId==action.payload.meetings.parentId)
                x.list.data.concat(action.payload.meetings.list.data)
                x.list.nextlink = action.payload.meetings.list.nextlink
                x.list.count = action.payload.meetings.list.count
            })
            return {
                ...state,
                meetinglist:meetinglist
            }
        }else{
            console.log("******************wazedxrctfvgxexerxexesxzeszxesxexexexexexexex",action.payload.meetings)
            meetinglist.push(action.payload.meetings)
            return{
                ...state,
                meetinglist:meetinglist
            }
        }
        case MeetingActionTypes.InsertNewMeetingToParentId:

         const AllMeetinglist = state.meetinglist
         if (AllMeetinglist.some(x=>x.parentId==action.payload.NewMeeting.id)) {
            AllMeetinglist.map((x)=>{
                (x.parentId==action.payload.NewMeeting.id)
                x.list.data.unshift(action.payload.NewMeeting.data)
                 x.list.count=x.list.count+1
            })
            return {
                ...state,
                meetinglist:AllMeetinglist
            }
         }else{
            return {...state}
         } 
         case MeetingActionTypes.Favorite:
         const FavMeetinglist = state.meetinglist
         if (FavMeetinglist.some(x=>x.parentId==action.payload.markFav.parentId)) {
            FavMeetinglist.map((x)=>{
                (x.parentId==action.payload.markFav.parentId)
                x.list.data.map(y=>(y.Guid==action.payload.markFav.childId)?y.IsPivotal = action.payload.markFav.Change:y.IsPivotal=y.IsPivotal)
            })
            return {
                ...state,
                meetinglist:FavMeetinglist
            }
         }else{
            return {...state}
         }  
         case MeetingActionTypes.MeetingContactdelink:
         const DenlinkMeetinglist = state.meetinglist
         if (DenlinkMeetinglist.some(x=>x.parentId==action.payload.updateContactDelink.parent_id)) {
            DenlinkMeetinglist.map((x)=>{
                (x.parentId==action.payload.updateContactDelink.parent_id)
                x.list.data.map(y=>{
                    if(y.Guid==action.payload.updateContactDelink.child_id){
                        y.CustomerContacts=action.payload.updateContactDelink.changes
                    }
                })
            })
            return {
                ...state,
                meetinglist:DenlinkMeetinglist
            }
         }else{
             return {
                 ...state
             }
         }

         case MeetingActionTypes.MeetingWiproAttendess:
         const DenlinkWiprolist = state.meetinglist
         if (DenlinkWiprolist.some(x=>x.parentId==action.payload.updateWiproDelink.parent_id)) {
            DenlinkWiprolist.map((x)=>{
                (x.parentId==action.payload.updateWiproDelink.parent_id)
                x.list.data.map(y=>{
                    if(y.Guid==action.payload.updateWiproDelink.child_id){
                        y.WiproParticipant=action.payload.updateWiproDelink.changes
                    }
                })
            })
            return {
                ...state,
                meetinglist:DenlinkWiprolist
            }
         }else{
             return {
                 ...state
             }
         }

         case MeetingActionTypes.MeetingLeadsDelink:
         const DenlinkLeadlist = state.meetinglist
         if (DenlinkLeadlist.some(x=>x.parentId==action.payload.updateLeadDelink.parent_id)) {
            DenlinkLeadlist.map((x)=>{
                (x.parentId==action.payload.updateLeadDelink.parent_id)
                x.list.data.map(y=>{
                    if(y.Guid==action.payload.updateLeadDelink.child_id){
                        y.Lead=action.payload.updateLeadDelink.changes
                    }
                })
            })
            return {
                ...state,
                meetinglist:DenlinkLeadlist
            }
         }else{
             return {
                 ...state
             }
         }

         case MeetingActionTypes.MeetingOpportunitiesDelink:
         const DenlinkOpportunitieslist = state.meetinglist
         if (DenlinkOpportunitieslist.some(x=>x.parentId==action.payload.updateOpportunitiesDelink.parent_id)) {
            DenlinkOpportunitieslist.map((x)=>{
                (x.parentId==action.payload.updateOpportunitiesDelink.parent_id)
                x.list.data.map(y=>{
                    if(y.Guid==action.payload.updateOpportunitiesDelink.child_id){
                        y.Opportunity=action.payload.updateOpportunitiesDelink.changes
                    }
                })
            })
            return {
                ...state,
                meetinglist:DenlinkOpportunitieslist
            }
         }else{
             return {
                 ...state
             }
         }

         case MeetingActionTypes.MeetingFavorite:
         const Favorite = state.meetinglist
         if (Favorite.some(x=>x.parentId==action.payload.updateFavorite.parent_id)) {
            Favorite.map((x)=>{
                (x.parentId==action.payload.updateFavorite.parent_id)
                x.list.data.map(y=>{
                    if(y.Guid==action.payload.updateFavorite.child_id){
                        y.IsPivotal=action.payload.updateFavorite.changes
                    }
                })
            })
            return {
                ...state,
                meetinglist:Favorite
            }
         }else{
             return {
                 ...state
             }
         }

         case MeetingActionTypes.MeetingDetailsEdit:
         const meetingEdit = state.meetinglist
         if (meetingEdit.some(x=>x.parentId==action.payload.meetingEdit.parent_id)) {
            meetingEdit.map((x)=>{
                (x.parentId==action.payload.meetingEdit.parent_id)
                x.list.data.map(y=>{
                    if(y.Guid==action.payload.meetingEdit.child_id){
                        y.Subject=action.payload.meetingEdit.changes.Subject
                        y.MeetingDate = action.payload.meetingEdit.changes.MeetingDate
                        y.MeetingType = action.payload.meetingEdit.changes.MeetingType,
                        y.WiproParticipant = action.payload.meetingEdit.changes.WiproParticipant
                        y.Lead = action.payload.meetingEdit.changes.Lead
                        y.OrdersAndOpportunity = action.payload.meetingEdit.changes.OrdersAndOpportunity,
                        y.CustomerContacts = action.payload.meetingEdit.changes.CustomerContacts,
                        y.TagUserToView = action.payload.meetingEdit.changes.TagUserToView
                        y.Attachments = action.payload.meetingEdit.changes.Attachments
                    }
                })
            })
            return {
                ...state,
                meetinglist:meetingEdit
            }
         }else{
             return {
                 ...state
             }
         }
         case MeetingActionTypes.ClearMeeting: 
         const meetingListClear = state.meetinglist
         if (meetingListClear.some(x=>x.parentId==action.payload.cleardetails)) {
            meetingListClear.map((x)=>{
                (x.parentId==action.payload.cleardetails)
                x.list.data=[]
                x.parentId=""
            })
            return {
                ...state,
                meetinglist:meetingListClear
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



