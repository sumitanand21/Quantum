
import {createSelector} from '@ngrx/store';


export const milestone = state => state.milestone; 



export const  MilestoneDisplay = createSelector(
    milestone,
    MilestoneDisplay => MilestoneDisplay,
);
