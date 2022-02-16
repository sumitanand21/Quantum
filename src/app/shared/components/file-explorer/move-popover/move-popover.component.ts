import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FolderElement } from '@app/core/models/folder-element';
import { DataCommService } from '@app/core/services/datacomm/data-comm.service';

const currentParent = ''

@Component({
  selector: 'app-move-popover',
  templateUrl: './move-popover.component.html',
  styleUrls: ['./move-popover.component.scss']
})
export class MovePopoverComponent implements OnInit, OnChanges {

  @Input() folderElement: any[]
  @Input() canNavigateUpPop: string
  @Input() pathPop: string;
  @Input() togglePopup: boolean;
  @Input() dirPathName: string;
  @Output() navigatedDown = new EventEmitter<any>()
  @Output() navigateUpPop = new EventEmitter<any>()
  @Output() detectValueActionPop = new EventEmitter<{ objectRowData: any, action: string }>()
  @Output() closePopup = new EventEmitter<any>()
  popFoldername = 'Name of folder';
  popNewFolder: boolean;
  folder: boolean = false;
  currentElement: any;
  fileDetails: any;
  disableBack: boolean = false;

  navigatedPath = [];

  constructor(public dataCommService: DataCommService) { }

  ngOnInit() {

  }

  ngOnChanges() {
    this.folderElement;
  }

  closePop() {
    this.closePopup.emit(false);
  }

  navigate(element: any) {
    if (element.isFolder) {
      this.navigatedPath.push(element)
      this.currentElement = element
      this.navigatedDown.emit(element);
    }
  }

  navigateUp() {
    this.folder = false;
    this.clearFolder();
    this.navigatedPath.pop();
    if(this.navigatedPath.length > 0) {
      this.dirPathName = this.navigatedPath[this.navigatedPath.length - 1].name;
    } else {
      this.dirPathName = 'Attached documents';
      this.disableBack = true;
    }
    this.navigateUpPop.emit(this.currentElement);
  }

  createRow() {
    this.folder = !this.folder;
    this.clearFolder();
  }

  onCreateFolder() {
    this.popNewFolder = false;
    this.getFileDetails();
    this.detectValueActionPop.emit(
      {
        objectRowData: {
          name: this.popFoldername,
          //parent: this.folderElement.length > 0 ? this.folderElement[0].parent : 0,
          id: this.fileDetails
        },
        action: 'create'
      });
    console.log(this.folderElement);

  }

  onMoveFile() {
    this.getFileDetails();
    console.log(this.fileDetails);
    if (this.fileDetails instanceof Array) {
      let data = [];
      for (let i = 0; i < this.fileDetails.length; i++) {
        data.push({
          name: this.popFoldername,
          parent: this.folderElement.length > 0 ? this.folderElement[0].parent : this.currentElement.id,
          id: this.fileDetails[i]
        });
      }
      this.detectValueActionPop.emit(
        {
          objectRowData: data,
          action: 'move'
        });
    } else {
      this.detectValueActionPop.emit(
        {
          objectRowData: [{
            name: this.popFoldername,
            parent: this.folderElement.length > 0 ? this.folderElement[0].parent : this.currentElement.id,
            id: this.fileDetails
          }],
          action: 'move'
        });
    }

  }

  clearFolder() {
    this.popFoldername = 'Name of folder';;
  }

  getFileDetails() {
    this.dataCommService.getBehaviorView()
      .subscribe(res => { this.fileDetails = res })
  }

}
