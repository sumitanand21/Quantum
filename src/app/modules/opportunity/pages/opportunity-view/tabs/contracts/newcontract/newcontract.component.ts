import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, OpportunitiesService } from '@app/core';
import { Location } from '@angular/common';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { UploadDocumentPopup } from '../../order/order.component';
import { Router } from '@angular/router';
import { count } from 'rxjs/internal/operators/count';
import { FileUploader } from 'ng2-file-upload';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'app-newcontract',
  templateUrl: './newcontract.component.html',
  styleUrls: ['./newcontract.component.scss']
})
export class NewcontractComponent implements OnInit {
  wiproContactArray: any[];
  isPrivate: boolean;


  constructor(public dialog: MatDialog, public location: Location, public projectService: OpportunitiesService, public service: DataCommunicationService) { }

  ngOnInit() {
  }

  wiproContact(data) {
    var orginalArray = this.projectService.getwiproContact();
    orginalArray.subscribe((x: any[]) => {
      return this.wiproContactArray = x.filter(y => y.name.includes(data));
    });

  }
  goBack() {
    this.location.back();
  }

  openExecuteContractPopup() {
    const dialogRef = this.dialog.open(ExecuteContractPopup, {
      width: '550px'
    });
  }
}

// ExecuteContractPopup starts
@Component({
  selector: 'executeContract-popup',
  templateUrl: './executeContractPopup.html',
  styleUrls: ['./newcontract.component.scss']
})
export class ExecuteContractPopup {


  newArr = [{ name: '' }];
  wiproContactArray = [];

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<ExecuteContractPopup>,
    public router: Router,
    public projectService: OpportunitiesService) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  wiproContact(data) {
    var orginalArray = this.projectService.getwiproContact();
    orginalArray.subscribe((x: any[]) => {
      return this.wiproContactArray = x.filter(y => y.name.includes(data));
    });
  }

  count = 0;
  steptwo() {
    this.newArr.push({ name: '' });
    this.count = this.count + 1;
  }

  deleteRow(index: number): void {
    this.count = this.count - 1;
    this.newArr.splice(index, 1);
  }

  // openUploaDocumentPopup() {
  //   const dialogRef = this.dialog.open(UploadDocumentPopup, {
  //     width: '610px'
  //   });
  // }

  // openuploadpopup() {
  //   const dialogRef = this.dialog.open(UploadDocumentPopup, {
  //     width: '450px'
  //   });
  // }

  // file upload functionality starts from here

  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  arr = [];

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }
  addToArray(array: string) {
    this.arr.push("array" + this.arr.length);
  }
  remove(i: number) {
    this.arr.splice(i, 1);

  }
  // file upload functionality ends here
}
// upload sow popup ends