import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ActivityState } from '../../reducers/activity/activity.reducer';
import { ActivityDetailsState } from '../../reducers/activity/activity.details.reducer';
import { MyActivityState } from '../../reducers/activity/my-activity.reducer';
import { ArchiveActivityState } from '../../reducers/activity/archive-activity.reducer';
import { MeetingDetailsState } from '../../reducers/activity/meetings/meeting.details.reducer';
export const allActivityState = createFeatureSelector<ActivityState>('AllActivity');

export const ActivityDetails = createFeatureSelector<ActivityDetailsState>('ActivityDetails');

export const myActivityState = createFeatureSelector<MyActivityState>('MyActivityList');

export const archiveActivityState = createFeatureSelector<ArchiveActivityState>('ArchiveActivityList');

export const meetingDetailsState = createFeatureSelector<MeetingDetailsState>('MeetingDetails');

export const selectActivityMeetingState = state => state.ActivityMeetingList;

export const selectActivityActionState = state => state.ActivityActionList;

export const selectOtherActivityListState = state => state.OtherActivityList;

export const getAllActivity = createSelector(
    allActivityState,
    res => {
        return res
    }
);

export const getActivityDetailsById = (detailsId: number) => createSelector(
    ActivityDetails,
    res => res.entities[detailsId]
);

export const getActivityListById = (listId: number) => createSelector(
    allActivityState,
    res => res.entities[listId]
);

export const getMyActivityListById = (listId: number) => createSelector(
    myActivityState,
    res => res.entities[listId]
);
export const getArchivedActivityListById = (listId: number) => createSelector(
    archiveActivityState,
    res => res.entities[listId]
);
export const getMyActivity = createSelector(
    myActivityState,
    res => res
)

export const getArchiveActivity = createSelector(
    archiveActivityState,
    res => res
)


export const getActionListByParentIdActivity = (parentId) => createSelector(

    selectActivityActionState,
    res => {
        if (res != undefined && res != null) {
            return res.actionList.filter(x => x.parentId == parentId)[0]
        } else {
            return null
        }
    }
)


export const getOtherActivityListByParentIdActivity = (parentId) => createSelector(

    selectOtherActivityListState,
    res => {
        if (res != undefined && res != null) {
            return res.Otherlist.filter(x => x.parentId == parentId)[0]
        } else {
            return null
        }
    }
)

// ------------------------------------------------------------------------ Meeting List Activity Selectors --------------------------------------------------


export const getMeetingListByParentIdActivity = (parentId) => createSelector(

    selectActivityMeetingState,
    res => {
        if (res != undefined && res != null) {
            if (res.meetinglist) {
                return res.meetinglist.filter(x => x.parentId == parentId)[0]
            } else {
                return null
            }
           
        } else {
            return null
        }


    }
)

// ------------------------------------------------------Meeting Details Activity Selectors ---------------------------------------------------------------------

export const getMeetingDetailsById = (id:any)=>createSelector(
    meetingDetailsState,
    res => res.entities[id]
)