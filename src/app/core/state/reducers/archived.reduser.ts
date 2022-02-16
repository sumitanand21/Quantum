// import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";

// import { LeadsListActions, LeadsActionTypes } from "../actions/lead-list.action";
// import { ArchivedLeads } from "@app/core/state/state.models/Lead/archivedLeads.interface";
// export interface Archived_State extends EntityState<ArchivedLeads> {
//     count: any
//     OdatanextLink: any
// }

// export const adapter: EntityAdapter<ArchivedLeads> = createEntityAdapter<ArchivedLeads>()

// export const InitialState: Archived_State = adapter.getInitialState({
//     count: 0,
//     OdatanextLink:""
// })

// export function ArchivedReducer(state = InitialState, action: LeadsListActions): Archived_State {
//     switch (action.type) {
//         case LeadsActionTypes.LoadArchivedList:
//             return adapter.addMany(action.payload.CreateArchivedLead, { ...state, count: action.payload.count, OdatanextLink: action.payload.OdatanextLink })
//         default: {
//             return state
//         }
//     }
// }