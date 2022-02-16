import { Action } from '@ngrx/store';
import { AllActivityCollection, ActivityDetailsCollection } from '../state.models/activity/all-activity.model';
import { MyActivityCollection } from '../state.models/activity/my-activity.models';
import { ArchiveActivityCollection, ArchivedDetailsCollection } from '../state.models/activity/archive-activity.model';
import { Update } from '@ngrx/entity';
import { LoadMeetingDetailsmodel, MeetingDetailsModel } from '../state.models/activity/meeting-details.model';


export enum ActivityActionTypes {
    LoadAllActivity = '[load All Activities] all Activity',
    CreateActivityGroup = '[CreateActivity] created',
    ReplicateActivity = '[load ReplicateActivity] raplicated',
    LoadActivityDetails = '[Load Activity Details] details load',
    UpdateActivityGroupEdit = '[ActivityEdit] details Edited',
    ClearActivityDetails = '[ClearActivityDetails] Cleadr Activity Details',
    LoadMyActivity = '[Load AMyActivities] my Activity',
    LoadArchiveActivity = '[Load Archive Activities] Archive Activity List',
    RestoreActivity = '[Load Restore Activity] Restore Activity',
    ArchiveActivity = '[Archive Activity] Archive Activity',
    UpdateAllActivity = '[Update All Activity] Update All Activity List After Restore',
    UpdateArchiveActivity = '[Update Archive Activity] Update Archive Activity List',
    ClearActivity = '[Clear Activity] Clear Activity List',
    
}


export enum MeetingActionTypes {
    LoadMeetingByParentId = "[load meeting by parentid ] load Meetings",
    Favorite = "[Mark meeting as Favorite] Meeting Favorite",
    LoadActionsByParentId = "[Load Actions By ParentId] Load Actions",
    LoadOtherActivityListsByParentId = "[ Load OtherActivityList By ParentId] Load OtherActivityList",
    InsertNewMeetingToParentId = "[Insert New Meeting ] Insert New Meeting",
    InsertNewOtherActivity = "[Create Other Activity] Insert Other Activity",
    UpdateOtherActivity = "[Update Other Activity] Edit Other Activity",
    InsertAction = "[Insert New Action ] Insert New Action",
    EditAction = "[Update Action ] Edit Action",
    UpdateActionDetails = "[Update Action Details] Update Action Details",
    ClearMeeting = '[Clear Meeting] Clear Meeting List',
    MeetingContactdelink = '[Meeting Contact Delink] Meeting Contact added', 
    MeetingWiproAttendess = '[Meeting Wipro Attendees] Meeting Wipro Attendees added',
    MeetingLeadsDelink = '[Meeting Lead] Meeting Leads added',
    MeetingOpportunitiesDelink='[Meeting Opportunities] Meeting Opportunities added',
    MeetingFavorite= '[Meeting Favorite] Meeting favorite',
    MeetingDetailsEdit = '[Meeting Details] Meeting Details Edit',
    UpdateMeetingDetail = '[Update Metting Details] Update Meetig Details',
    LoadMeetingDetails= '[Load Meeting Deatils] load meeting details',
    ClearAction = "[Clear Action] Clear Action",
    MeetingDetailsCustomerAdded="[Meeting Details] Added Customer",
    ParticipantsAdded= "[Meeting Details] Added Participants",
    TagContactAdded = "[Meeting Details] Added Tags",
    PotentialwiproAdded = "[Meeting Details] Added Potential wipro",
    LinkedCampaignsAdded = "[Meeting Details] Added linked campaigns",
    LinkedLeadsAdded = "[Meeting Details] Added Linked leads",
    LinkedOpportunitiesOrder = "[Meeting Details] Added Linked opportunities/order",
    MeetingAttachment = "[Meeting Details] Added Attachment",
    ClearOtherList = '[Clear otherlist] Clear other List',
    MeetingDetailsClear = "[Meeting Details] Clear Meeting"
}


// ----------------------------------------------------All Activity actions ----------------------------------------------------


type AllActivitiesPOJO = {
    allactivity: AllActivityCollection[],
    count: number,
    nextlink: string
}
export class LoadAllActivity implements Action {
    readonly type = ActivityActionTypes.LoadAllActivity;
    constructor(public payload: { activity: AllActivitiesPOJO }) {
        console.log(payload)
    }
}

export class CreateActivity implements Action {
    readonly type = ActivityActionTypes.CreateActivityGroup;
    constructor(public payload: { activity: AllActivityCollection }) { }
}

type UpdateActivityPOJO={
    id:any,
    changes:any
  }

export class ReplicateActivity implements Action {
    readonly type = ActivityActionTypes.ReplicateActivity;
    constructor(public payload: { activity: AllActivityCollection }) { }
}

export class LoadActivityDetailsById implements Action {
    readonly type = ActivityActionTypes.LoadActivityDetails;
    constructor(public payload: { activityDetails: ActivityDetailsCollection }) { }
}

export class UpdateActivityGroupEditById implements Action {
    readonly type = ActivityActionTypes.UpdateActivityGroupEdit;
    constructor(public payload: { UpdateActivity: Update<UpdateActivityPOJO>}) { 
        console.log("edit qction!!1")
        console.log(payload)
    }
}

export class UpdateAllActivity implements Action {
    readonly type = ActivityActionTypes.UpdateAllActivity;
    constructor(public payload: { activity: AllActivityCollection }) { }
}

// ------------------------------------------------------------------My-Activity Actions-----------------------------------------------------------------

type MyActivityPOJO = {
    myactivity: MyActivityCollection[],
    count: number,
    nextlink: string
}

export class LoadMyActivity implements Action {
    readonly type = ActivityActionTypes.LoadMyActivity;
    constructor(public payload: { myactivity: MyActivityPOJO }) {
        console.log(payload)
    }
}


//------------------------------------------------------------------ Activity - Meetings Actions----------------------------------------------------------
type LoadMeetingsPOJO = {
    parentId: any,
    list: {
        data: Array<any>,
        count: number,
        nextlink: string
    }
}
type Markfav = {
    parentId:any,
    childId:any,
    Change:any
}
export class LoadMeetingsByParentId implements Action {
    readonly type = MeetingActionTypes.LoadMeetingByParentId;
    constructor(public payload: { meetings: LoadMeetingsPOJO }) {
        console.log(payload)
    }
}

export class MarkMeetingsFavorite implements Action {
    readonly type = MeetingActionTypes.Favorite;
    constructor(public payload: { markFav: Markfav }) {
        console.log(payload)
    }
}

export class LoadActionsByParentId implements Action {
    readonly type = MeetingActionTypes.LoadActionsByParentId;
    constructor(public payload: { actions: LoadMeetingsPOJO }) {
        console.log(payload)
    }
}

export class LoadOtherActivityListByParentId implements Action {
    readonly type = MeetingActionTypes.LoadOtherActivityListsByParentId;
    constructor(public payload: { others: LoadMeetingsPOJO }) {
        console.log(payload)
    }
}
export class ClearOtherListdata implements Action {
    readonly type = MeetingActionTypes.ClearOtherList;
    constructor(public payload: {clearotherlist:any}){}
}

type NewMeetingPOJO = {
    id: any,
    data: any
}
export class InsertMeeting implements Action {
    readonly type = MeetingActionTypes.InsertNewMeetingToParentId
    constructor(public payload: { NewMeeting: NewMeetingPOJO }) { }
}

type MeetingContactDelinkPOJO ={
    parent_id:any,
    child_id:any
    changes:any
}
export class MeetingContactDelink implements Action {
    readonly type = MeetingActionTypes.MeetingContactdelink
    constructor(public payload :{updateContactDelink: MeetingContactDelinkPOJO}){}
}

type MeetingWiproAttendessPOJO ={
    parent_id:any,
    child_id:any
    changes:any
}

export class  MeetingWiproAttendess implements Action {
    readonly type = MeetingActionTypes.MeetingWiproAttendess
    constructor(public payload :{updateWiproDelink: MeetingWiproAttendessPOJO}){}
}

type MeetingLeadPOJO ={
    parent_id:any,
    child_id:any
    changes:any
}
export class MeetingLeadsDelink implements Action {
    readonly type = MeetingActionTypes.MeetingLeadsDelink
    constructor(public payload: {updateLeadDelink: MeetingLeadPOJO}){}
}

type MeetingOppPOJO ={
    parent_id:any,
    child_id:any
    changes:any
}
export class MeetingOpportunitiesDelink implements Action {
    readonly type = MeetingActionTypes.MeetingOpportunitiesDelink
    constructor(public payload: {updateOpportunitiesDelink:MeetingOppPOJO }) {}
}
type MeetingFavoritePOJO ={
    parent_id:any,
    child_id:any
    changes:any
}
export class MeetingFavorite implements Action {
    readonly type= MeetingActionTypes.MeetingFavorite
    constructor(public payload: {updateFavorite: MeetingFavoritePOJO}) {}
}
type MeetingEdisPOJO ={
    parent_id:any,
    child_id:any
    changes:any
}
export class MeetingDetailsEdit implements Action {
    readonly type = MeetingActionTypes.MeetingDetailsEdit
    constructor(public payload: {meetingEdit: MeetingEdisPOJO}){}
}
export class InsertOtherActivity implements Action {
    readonly type = MeetingActionTypes.InsertNewOtherActivity
    constructor(public payload: { CreateOther: NewMeetingPOJO }) { }
}

export class InsertNewAction implements Action {
    readonly type = MeetingActionTypes.InsertAction
    constructor(public payload: { action: NewMeetingPOJO }) { }
}

type UpdateMeetingDetailsPOJO={
    id:any,
    changes:any
  }

type UpdateOtherActivityPOJO = {
    parentId: any,
    id: any,
    data: any
}
export class EditOtherActivity implements Action {
    readonly type = MeetingActionTypes.UpdateOtherActivity
    constructor(public payload: { EditOther: UpdateOtherActivityPOJO }) { }
}

export class EditAction implements Action {
    readonly type = MeetingActionTypes.EditAction
    constructor(public payload: { editAction: UpdateOtherActivityPOJO }) { }
}

export class UpdateMeetingDetails implements Action {
    readonly type = MeetingActionTypes.UpdateMeetingDetail;
    constructor(public payload: { Update_Meetingdetails: Update<UpdateMeetingDetailsPOJO> }) {
        console.log(payload)
    }
}

type MeetingCustomer = {
    id: any,
    changes: any
}
export class MeetingDetailsCustomerAdded implements Action {
    readonly type = MeetingActionTypes.MeetingDetailsCustomerAdded;
    constructor(public payload: {customer: Update<MeetingCustomer>}) {}
}

type MeetigParticipants = {
    id: any,
    Changes: any
}

export class MeetingDetailsParticipantsAdded implements Action {
    readonly type = MeetingActionTypes.ParticipantsAdded;
    constructor(public payload: {participant: Update<MeetigParticipants>}) {}
}

type MeetigTags = {
    id: any,
    Changes: any
}

export class MeetigDetailsTagContactsAdded implements Action {
    readonly type = MeetingActionTypes.TagContactAdded
    constructor(public payload: {Tags: Update<MeetigTags>}) {}
}
type MeetigSolution = {
    id: any,
    Changes: any
}
export class MeetingDetailsPotentialwiproAdded implements Action {
    readonly type = MeetingActionTypes.PotentialwiproAdded
    constructor(public payload: {solutions: Update<MeetigSolution>}){}
}
type MeetigCampaigns = {
    id: any,
    Changes: any
}
export class MeetingDetailsLinkedCampaigns implements Action {
    readonly type = MeetingActionTypes.LinkedCampaignsAdded;
    constructor(public payload: {LinkedCampaigns: Update<MeetigCampaigns>}) {}
}
type MeetigLeads = {
    id: any,
    Changes: any
}
export class MeetingDetailsLinkedLeads implements Action { 
    readonly type = MeetingActionTypes.LinkedLeadsAdded
    constructor(public payload : {LinkedLeads : Update<MeetigLeads>}){}
}

type MeetigOpportunitiesOrder = {
    id: any,
    Changes: any
}
export class MeetigDetailsLinkedOpportunitiesOrder implements Action {
    readonly type = MeetingActionTypes.LinkedOpportunitiesOrder;
    constructor(public payload : {LinkedOpportunitiesOrder: Update<MeetigOpportunitiesOrder>}){}
}

type MeetingDetailsAttachment = {
    id: any;
    changes: any;
}

export class MeetingDetailsAttachments implements Action {
    readonly type = MeetingActionTypes.MeetingAttachment;
    constructor(public payload: {Attachment: Update<MeetingDetailsAttachment>}) {}
}

export class LoadMeetingDetailsById implements Action {
    readonly type = MeetingActionTypes.LoadMeetingDetails;
    constructor(public payload: { Load_Meetingdetails: MeetingDetailsModel }) {
        console.log(payload)
    }
}

// ------------------------------------------------------ Archive-Activity List----------------------------------------------------------------------------------------------------------------------------

type ArchiveActivityPOJO = {
    archiveActivity: ArchiveActivityCollection[],
    count: number,
    nextlink: string
}
export class LoadArchiveActivity implements Action {
    readonly type = ActivityActionTypes.LoadArchiveActivity;
    constructor(public payload: { archiveActivity: ArchiveActivityPOJO }) {
        console.log(payload)
    }
}
export class RestoreActivity implements Action {
    readonly type = ActivityActionTypes.RestoreActivity;
    constructor(public payload: { id: string }) {
        console.log(payload)
    }
}

export class ArchiveActivity implements Action {
    readonly type = ActivityActionTypes.ArchiveActivity;
    constructor(public payload: { ids: string[] }) {
        console.log(payload)
    }
}

export class UpdateArchiveActivity implements Action {
    readonly type = ActivityActionTypes.UpdateArchiveActivity;
    constructor(public payload: { archiveActivity: ArchiveActivityPOJO }) {
        console.log(payload)
    }
}

export class ClearActivity implements Action {
    readonly type = ActivityActionTypes.ClearActivity;
}

export class ClearActivityDetails implements Action {
    readonly type = ActivityActionTypes.ClearActivityDetails
}

export class  ClearMeetingList implements Action {
    readonly type = MeetingActionTypes.ClearMeeting
    constructor(public payload: {cleardetails:any}){}
}

export class ClearActionList implements Action {
    readonly type = MeetingActionTypes.ClearAction
    constructor(public payload: {clearaction:any}){}
}

export class ClearMeetingDetails implements Action {
    readonly  type = MeetingActionTypes.MeetingDetailsClear
}
export type ActivityActions =
    ClearOtherListdata|
    MarkMeetingsFavorite |
    LoadAllActivity |
    CreateActivity |
    ReplicateActivity |
    LoadActivityDetailsById |
    UpdateActivityGroupEditById |
    LoadMeetingsByParentId |
    LoadMyActivity |
    LoadArchiveActivity |
    RestoreActivity |
    LoadActionsByParentId |
    LoadOtherActivityListByParentId |
    ArchiveActivity|
    InsertMeeting |
    UpdateAllActivity |
    InsertOtherActivity |
    EditOtherActivity |
    InsertNewAction |
    EditAction |
    UpdateArchiveActivity |
    ClearActivity|
    MeetingContactDelink |
    MeetingWiproAttendess |
    MeetingLeadsDelink |
    MeetingOpportunitiesDelink |
    MeetingFavorite| 
    MeetingDetailsEdit |
    ClearMeetingList|
    ClearActionList |
    MeetingDetailsEdit|
    UpdateMeetingDetails|
    LoadMeetingDetailsById | 
    MeetingDetailsCustomerAdded |
    MeetingDetailsParticipantsAdded |
    MeetigDetailsTagContactsAdded |
    MeetingDetailsPotentialwiproAdded |
    MeetingDetailsLinkedCampaigns |
    MeetingDetailsLinkedLeads |
    MeetigDetailsLinkedOpportunitiesOrder |
    MeetingDetailsAttachments | 
    ClearMeetingDetails |
    ClearActivityDetails
