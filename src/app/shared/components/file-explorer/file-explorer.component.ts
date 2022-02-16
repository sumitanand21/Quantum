import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, Inject } from '@angular/core';
import { FileElement } from '@app/core/models/file-element';
import { MatMenuTrigger, MatCheckbox } from '@angular/material';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { FolderElement } from '@app/core/models/folder-element';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { dealService } from '@app/core/services/deals.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { DataCommService } from '@app/core/services/datacomm/data-comm.service';
import { PaginationInstance } from 'ngx-pagination';

const createMove = {
  id: 0,
  parent: '',
  name: ''
}

const config = {
  generalErrMsg: 'Oops! There seems to be some technical snag! Could you raise a Helpline ticket?'
}

@Component({
  selector: 'app-file-explorer',
  templateUrl: './file-explorer.component.html',
  styleUrls: ['./file-explorer.component.scss']
})
export class FileExplorerComponent implements OnInit {
  // isLoading;
  @Input() isLoading: boolean
  @Input() fileElements: FileElement[]
  @Input() canNavigateUp: string
  @Input() path: string

  // @Output() folderAdded = new EventEmitter<{ name: string; parent: string }>()
  @Output() elementRemoved = new EventEmitter<FileElement>()
  @Output() elementRenamed = new EventEmitter<FileElement>()
  @Output() elementMoved = new EventEmitter<{
    element: FileElement
    moveTo: FileElement
  }>()
  @Output() navigatedDown = new EventEmitter<FileElement>()
  @Output() navigatedUp = new EventEmitter<FileElement>()

  @Output() detectValueAction = new EventEmitter<{ objectRowData: any, action: string }>()
  @Output() attachDocEmitter = new EventEmitter()


  public config: PaginationInstance = {
    id: 'custom',
    itemsPerPage: 50,
    currentPage: 1,
    totalItems: undefined,

  };
  nextPaginationButton() {
    console.log("Called");

  }

  prevData: any;
  folder: boolean = true;
  foldername: string = 'New folder';
  newFolder: boolean;
  currentElement: FileElement;
  key: string;
  reverse: boolean = false;
  folderElemennts: FileElement[];
  movePopupToggle = [];
  togglePopup: boolean;
  selectedAll: any;
  headerBtnVisibility: boolean;
  selectedList = [];
  dirPathName = 'Attached documents';
  multiMovePopover: boolean = false;
  totalCount: number = 0;


  canNavigateUpPop = false;
  currentPath: string = "Deals > Existing deals > Deal name > Attached documents > "
  currentRoot = [];
  pathIdPop = [];
  adid: any;
  deal: any;
  user: any;

  constructor(
    public service: DataCommunicationService,
    public dialog: MatDialog, private deals: dealService,
    private encrDecrService: EncrDecrService,
    public _error: ErrorMessage,
    public dataCommService: DataCommService) { }

  ngOnInit() {
    this.selectedList = [];
    this.user = localStorage.getItem('upn');
    this.adid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip');
    this.deal = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('Dealoverview'), "DecryptionDecrip"));
    this.getData();

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('file explorer ngOnChange', this.fileElements);
    //  this.currentElement=
    //this.folderElemennts = this.fileElements;
    this.selectedList = [];
    console.log(this.folderElemennts)
    this.totalCount = this.fileElements.filter(x => x.isFolder === false).length;
  }

  deleteElement(element: FileElement) {
    this.elementRemoved.emit(element);
  }

  navigate(element: FileElement) {
    if (element.isFolder) {
      //this.currentElement = element
      this.selectedList = [];
      this.selectedAll = null;
      this.navigatedDown.emit(element);
    }
  }

  navigateUp() {
    this.selectedList = [];
    this.selectedAll = null;
    this.navigatedUp.emit();
  }

  moveElement(element: FileElement, moveTo: FileElement) {
    this.elementMoved.emit({ element: element, moveTo: moveTo });
  }
  editRow(data) {
    this.prevData = { ...data };
    this.prevData.rename = false;
    data.rename = true;

  }
  sortBy(key) {
    this.key = key;
    this.reverse = !this.reverse;
  }
  openDelete(data) {
    const dialogRef = this.dialog.open(DeletePop,
      {
        width: '380px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectValueAction.emit({ objectRowData: [data], action: 'delete' });
      }
    })
  }
  openMultiDelete(data) {
    const dialogRef = this.dialog.open(DeletePop,
      {
        width: '380px'
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.detectValueAction.emit({ objectRowData: data, action: 'delete' });
      }
    })
  }

  resetRow(data, index) {
    this.clearFolder();
    data.rename = false;
    data.name = this.prevData.name;
    this.prevData = {};
  }
  renameRow(data) {
    if(data.name === '') {
      this._error.throwError("File or folder name cannot be blank");
      return;
    }
    this.detectValueAction.emit({ objectRowData: data, action: 'rename' });
    data.rename = false;
  }
  downloadFile(data) {
    this.detectValueAction.emit({ objectRowData: data, action: 'download' });
  }
  downloadAll() {
    this.detectValueAction.emit({ objectRowData: this.fileElements, action: 'downloadAll' });
  }
  moveFile(data) {
    if (data instanceof Array) {
      this.detectValueAction.emit({ objectRowData: data, action: 'move' });
      this.selectedList = [];
    } else {
      this.detectValueAction.emit({ objectRowData: [data], action: 'move' });
    }


  }

  createRow() {
    this.newFolder = !this.newFolder;
    this.clearFolder();
  }

  openMovePop(data) {
    this.dataCommService.setBehaviorView(data.id);
    console.log(data);
    this.dirPathName = "Attached documents"
    this.getData(0)
    //this.togglePopup = !this.togglePopup
    data.movePopover = !data.movePopover;
  }

  openMultiMovePopover(data) {
    this.multiMovePopover = !this.multiMovePopover;
    if (this.multiMovePopover) {
      let idList = [];
      for (let i = 0; i < data.length; i++) {
        idList.push(data[i].id)
      }
      if (idList.length > 0) {
        this.dataCommService.setBehaviorView(idList)
      }
    }
  }

  createFolder() {
    if (this.foldername === "") {
      this._error.throwError("File or folder name cannot be blank");
      return;
    }
    this.newFolder = false;
    this.detectValueAction.emit(
      {
        objectRowData: {
          name: this.foldername,
          parent: this.fileElements.length > 0 ? this.fileElements[0].parent : 0
          // this.pathId.length == 0 ? 0 : this.pathId[this.pathId.length - 1],
        },
        action: 'create'
      });
    console.log(this.fileElements);

    // let dialogRef = this.dialog.open(NewFolderDialogComponent);
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     this.folderAdded.emit({ name: res });
    //   }
    // });
    this.clearFolder();

  }

  openRename(element: FileElement) {
    // let dialogRef = this.dialog.open(RenameDialogComponent);
    // dialogRef.afterClosed().subscribe(res => {
    //   if (res) {
    //     element.name = res;
    //     this.elementRenamed.emit(element);
    //   }
    // });
  }

  attachFileUploadDoc(event) {
    this.attachDocEmitter.emit(event);
  }

  openMenu(event: MouseEvent, element: FileElement, viewChild: MatMenuTrigger) {
    event.preventDefault();
    viewChild.openMenu();
  }

  selectAll(event) {
    let data: any = this.fileElements;
    if (event.checked) {
      for (var i = 0; i < data.length; i++) {
        this.fileElements[i].selected = this.selectedAll;
        this.selectedList.push(this.fileElements[i]);
      }
    } else {
      for (var i = data.length - 1; i >= 0; i--) {
        this.fileElements[i].selected = this.selectedAll;
        this.selectedList.splice(data[i], 1);
      }
    }

    // for (var i = 0; i < this.fileElements.length; i++) {
    //   if (event.checked) {
    //     this.fileElements[i].selected = this.selectedAll;
    //     this.selectedList.push(this.fileElements[i]);
    //   } else {
    //     this.fileElements[i].selected = this.selectedAll;
    //     this.selectedList.splice(this.fileElements[i], 1);
    //   }
    // }
    this.headerBtnVisibility = !this.headerBtnVisibility;
    console.log(this.selectedAll);
  }

  checkIfAllSelected(data: FileElement, isChecked: MatCheckbox) {
    // this.selectedAll = this.fileElements.every(function (item: any) {      
    //   return item.selected == true;
    // })
    if (isChecked.checked) {
      this.selectedList.push(data);
    } else {
      let index = this.selectedList.findIndex(x => x.id == data.id);
      this.selectedList.splice(index, 1);
    }

    this.headerBtnVisibility = true;
    console.log(this.selectedList);
  }

  performChildPopUpAction(childAction) {
    console.log(childAction);
    switch (childAction.action) {
      case 'create': {
        this.onCreateMove(childAction.objectRowData);
        return
      }
      case 'move': {
        this.moveFile(childAction.objectRowData);
        return
      }
    }

  }
  clearFolder() {
    this.foldername = 'New folder';;
  }

  onCreateMove(data) {
    this.isLoading = true;
    createMove.name = data.name;
    createMove.id = data.id;
    const inputData = {
      "Id": 1,
      "Name": data.name,
      "Parent": this.pathIdPop.length == 0 ? 0 : this.pathIdPop[this.pathIdPop.length - 1],
      "Type": 2,
      "IsFolder": true,
      "Deal": { 'Id': this.deal.id },
      "CreatedBy": this.adid + "|" + this.user
    }
    try {
      this.deals.createFolder(inputData)
        .subscribe((res: any) => {
          if (!res.IsError) {
            this.isLoading = false;
            createMove.parent = res.ResponseObject.Id;
            this.moveFile(createMove);
            this.getData(res.ResponseObject.Parent);
            this._error.throwError(res.Message);
          } else {
            this._error.throwError(config.generalErrMsg);
          }

        }, err => { this._error.throwError('Error! couldn`t create folder') });
    } catch {
      this._error.throwError(config.generalErrMsg);
    }



  }

  ///////////////////////////////////////////////////////////////
  navigateToFolder(element: any) {
    this.dirPathName = element.name;
    this.currentElement = element
    this.getData(element.id);
    this.pathIdPop.push(element.id);
    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUpPop = true;
  }

  navigateUpPop(element: any) {
    this.canNavigateUpPop = true;
    this.pathIdPop.pop();
    this.getData(this.pathIdPop[this.pathIdPop.length - 1]);
    this.currentPath = this.popFromPath(this.currentPath);
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += '' + `${folderName}` + ' > ';
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('>');
    split.splice(split.length - 2, 1);
    p = split.join('>');
    return p;
  }

  getData(id?) {

    this.isLoading = true;
    //let lastId = this.pathId.length - 1;
    var inputData = {
      "Id": this.deal.id,
      "LastRecordId": "0",
      "PageSize": 100,
      "Parent": id > 0 ? id : id == 0 ? 0 : 0
    }
    this.deals.listFolder(inputData)
      .subscribe((res) => {
        if (!res.IsError) {
          if (res.ResponseObject.length > 0) {
            this.folderElemennts = this.getMappedData(res.ResponseObject);
            //this.store.dispatch(new AttachDocumentList({ attachDocList: res.ResponseObject }));
          } else {
            this.folderElemennts = this.getMappedData(res.ResponseObject);
          }
        } else {
          this.folderElemennts = [];
        }
      }, err => {
        this._error.throwError(err);
      });
    this.isLoading = false;
  }

  getMappedData(res: any[]) {
    if (res.length > 0) {
      let data = [];
      res.filter((x) => x.IsFolder == true)
        .map(x => {
          let obj = {
            id: x.Id > 0 ? x.Id : x.Id == 0 ? 0 : 0,
            type: this.objectType(x),
            name: x.Name ? x.Name : 'NA',
            modified: x.CreatedOn ? x.CreatedOn : 'NA',
            modifiedBy: x.CreatedBy ? x.CreatedBy.split('|').pop() : 'NA',
            parent: x.Parent > 0 ? x.Parent : x.Parent == 0 ? 0 : 0,
            isFolder: x.IsFolder,
            deleteBtnVisibility: true,
            editBtnVisibility: true,
            downloadBtnVisibility: false,
            moveBtnVisibility: false,
            rename: false
          }
          data.push(obj);
        })
      return data;
    } else {
      return [];
    }
  }

  objectType(res?): string {
    if (res.IsFolder) {
      return 'mdi-folder';
    } else {
      var ext = res.Name.substring(res.Name.lastIndexOf('.') + 1);
      if (ext.toLowerCase() == 'docx') {
        return 'mdi-file-word';
      } else if (ext.toLowerCase() == 'xlsx') {
        return 'mdi-file-excel';
      } else if (ext.toLowerCase() == 'pdf') {
        return 'mdi-file-pdf';
      } else if (ext.toLowerCase() == 'pptx') {
        return 'mdi-file-document';
      } else {
        return 'mdi-file-document';
      }
    }

  }

  onCheckIsFolder(): boolean {
    var res = this.selectedList.find(x => x.isFolder == true)
    return res;
  }

  // MORE ACTION STARTS **************
  showContent: boolean = false;

  contentArray = [
    { className: 'mdi mdi-close', value: 'Disqualify' },
    { className: 'mdi mdi-crop-square', value: 'Nurture' },
    // { className: 'mdi mdi-bullhorn', value: 'Request campaign' }
  ]

  additem(item) {

    this.showContent = false;
  }

  closeContent() {
    this.showContent = false;
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }
  // MORE ACTION ENDS *******************

  /////////////////////////////////////
}
@Component({
  selector: 'deletePopup',
  templateUrl: './delete-popup.html',
})
export class DeletePop {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<DeletePop>, public userdat: DataCommunicationService) {
  }

  ngOnInit() {

  }
  onCancel(): void {
    this.dialogRef.close(false);

  }
  onSubmit(): void {
    this.dialogRef.close(true);
  }
}