import { EntityState, createEntityAdapter, EntityAdapter } from "@ngrx/entity";
import { TableActions, SingleTableActions } from "../../actions/singleTable.actions";
import { TableHeader } from "../../state.models/singleTable/singleTable.interface";

export interface SingleTableState extends EntityState<TableHeader> {

}

export const adapter: EntityAdapter<TableHeader> = createEntityAdapter<TableHeader>({

})

export const InitialState: SingleTableState = adapter.getInitialState({
 
})

export function singletableReducer(state = InitialState, action: SingleTableActions): SingleTableState {
    switch (action.type) {
        case TableActions.addTableHeader:
            return adapter.addOne(action.payload.tableHead,state)
            case TableActions.updateTableHeaderAction:
                return adapter.updateOne(action.payload.updatetableHead,state)
        default: {
            return state
        }
    }
}

