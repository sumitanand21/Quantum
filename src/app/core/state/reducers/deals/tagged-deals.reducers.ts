import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
// import { HomeActions, HomeActionListTypes } from "../../actions/home.action";
import { DealsActions, DealsActionTypes } from "../../actions/deals.actions";
import { TaggedDealsList } from '../../state.models/deals/tagged-deals.interface'

export interface TaggedDealsListState {
    taggedDeals: TaggedDealsList,
    count:number
}
export const InitialState: TaggedDealsListState  = {
    taggedDeals: {
        id: 0,
        OppNam: '',
        OppID: '',
        accoun: '',
        SBU: '',
        OppOwn: '',
        TCV: 0
    },
    count:0
};
export function DealsReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.TaggedListAction:
            return {
                taggedDeals: action.payload.taggedDealslist,
                count:action.payload.count
            }
        default: {
            return state
        }
    }
}