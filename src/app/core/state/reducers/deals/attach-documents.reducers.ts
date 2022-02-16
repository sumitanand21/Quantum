import { EntityState, EntityAdapter, createEntityAdapter } from "@ngrx/entity";
import { DealsActionTypes, DealsActions } from "../../actions/deals.actions";

export interface AttachDocumentsListState {
    attachDocuments: any;
}

export const InitialState: AttachDocumentsListState = {
    attachDocuments: {
        id: '',
        isFolder: false,
        name: '',
        parent: '',
        type: '',
        modified: '',
        modifiedBy: '',
        deleteBtnVisibility: false,
        editBtnVisibility: false,
        movePopover: false,
        rename: false,
        selected: false
    }
}

export function AttachDocumentsReducer(state = InitialState, action: DealsActions): any {
    switch (action.type) {
        case DealsActionTypes.AttachDocumentsListAction:
            return {
                attachDocList: action.payload.attachDocArryList
            }
        default: {
            return state
        }
    }
}