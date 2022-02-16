import { MilestoneAction, DealsActionTypes } from "../../actions/deals.actions";

export interface Milestone {
    milestone: any;
}
export const InitialState: Milestone  = {
  milestone:undefined,
};
export function milestoneReducer(state = InitialState, action: MilestoneAction): any {
    switch (action.type) {
        case DealsActionTypes.MilestoneDisplay:
            return {
                MilestoneDisplay: action.payload.Milestone,
                leadtime:action.payload.leadtime,
                dsodays:action.payload.dsodays
            }
        default: {
            return state
        }
    }
}