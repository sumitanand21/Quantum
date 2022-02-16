export interface FolderElement {
    id?: string;
    isFolder: boolean;
    name: string;
    parent: string;
    type: string;
    path: string;
    modified: string;
    modifiedBy: string;
    deleteBtnVisibility: boolean;
    editBtnVisibility: boolean;
    moveBtnVisibility: boolean;
    movePopover: boolean;
    downloadBtnVisibility: boolean;
    rename: boolean;
}
