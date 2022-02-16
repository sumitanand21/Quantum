import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { InActivateContactmodel } from "../state.models/inActive-contact-list";
import { InActivateContactActions, inActivateContactActionTypes } from "../actions/InActivateContact.action";



export interface inActivateContact_State extends EntityState<InActivateContactmodel> {

    count: number
    OdatanextLink: string
}

export const adapter: EntityAdapter<InActivateContactmodel> = createEntityAdapter<InActivateContactmodel>()

export const InitialState: inActivateContact_State = adapter.getInitialState({
    count: 0,
    OdatanextLink: ""
}
)


export function InActivateContactReducer(state = InitialState, action: InActivateContactActions): inActivateContact_State {

    switch (action.type) {
        
        case inActivateContactActionTypes.LoadAllDeActivateContacts:
            return adapter.addMany(action.payload.allInActivateContacts.contactlist,
                { ...state, count: action.payload.allInActivateContacts.count, OdatanextLink: action.payload.allInActivateContacts.nextlink }
             );
             case inActivateContactActionTypes.ClearDeActivateContactList:
                return adapter.removeAll(state);

        default: {
            return state
        }
    }
}