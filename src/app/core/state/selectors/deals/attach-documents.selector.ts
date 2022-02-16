import { createSelector } from "@ngrx/store";

export const selectAttachDocuments = state => state.AttachDocuments;

export const selectAttchDocumentsList = createSelector(
    selectAttachDocuments,
    FolderList => FolderList   
);