import { Component, OnInit, HostListener } from '@angular/core';
import { ContractsService } from '@app/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-contracts',
  templateUrl: './contracts.component.html',
  styleUrls: ['./contracts.component.scss']
})
export class ContractsComponent implements OnInit {
  panelOpenState: boolean;
  panelOpenState1: boolean;
  disabledbtn: boolean;
  contarctRequests = [];
  contractRepository = [];
  uploadContract = [];

  constructor(private contractService: ContractsService,
    private router: Router,
    public dialog: MatDialog, public service:DataCommunicationService) { }

  ngOnInit() {
    this.contarctRequests = [
      {
        requestName: 'Request name 123',
        requestCode: 'ACC56016752',
        createdBy: 'Pankaj Sharma',
        createdDate: '14-Jan-2019',
        status: 'Pending',
      },
      {
        requestName: 'Request name 123',
        requestCode: 'ACC56016752',
        createdBy: 'Pankaj Sharma',
        createdDate: '14-Jan-2019',
        status: 'Pending',
      },
      {
        requestName: 'Request name 123',
        requestCode: 'ACC56016752',
        createdBy: 'Pankaj Sharma',
        createdDate: '14-Jan-2019',
        status: 'Disabled',
      },
    ];

    this.contractRepository = [
      {
        agreementName: 'Request name 123',
        agreementCode: 'ACC56016752',
        createdBy: 'Pankaj Sharma',
        createdDate: '14-Jan-2019',
        status: 'Executed',
      },
      {
        agreementName: 'Request name 123',
        agreementCode: 'ACC56016752',
        createdBy: 'Pankaj Sharma',
        createdDate: '14-Jan-2019',
        status: 'Active',
      },
      {
        agreementName: 'Request name 123',
        agreementCode: 'ACC56016752',
        createdBy: 'Pankaj Sharma',
        createdDate: '14-Jan-2019',
        status: 'Active',
      },
    ];

    this.uploadContract = [
      {
        title: 'Contract name 123',
        dateCreated: '23-Jun-20',
        createdBy: 'Pankaj Sharma',
        documents: 'SOW contract',
        notes: 'No notes'
      },
      {
        title: 'Contract name 123',
        dateCreated: '23-Jun-20',
        createdBy: 'Pankaj Sharma',
        documents: 'SOW contract',
        notes: 'No notes'
      }
    ];
  }

  stop(e) {
    e.stopImmediatePropagation();
  }

  openAccessRequestedPopup(e) {
    e.stopImmediatePropagation();
    this.disabledbtn = !this.disabledbtn;
    const dialogRef = this.dialog.open(AccessRequestedPopup, {
      width: '390px'
    });
    // this.disabledbtn = !this.disabledbtn;
  }

  openUploadContractPopup(e) {
    e.stopImmediatePropagation();
    const dialogRef = this.dialog.open(UploadContractPopup, {
      width: '500px'
    });
  }
}


// AccessRequestedPopup compnent
@Component({
  selector: 'access-request-popup',
  templateUrl: './accessRequestPopup.html',
  styleUrls: ['./contracts.component.scss']
})

export class AccessRequestedPopup {
  disabledbtn: boolean;
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<AccessRequestedPopup>) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
  enableUploadContract() {
    this.disabledbtn = !this.disabledbtn;
  }
}

// UploadContractPopup component

@Component({
  selector: 'upload-contract-popup',
  templateUrl: './uploadContractPopup.html',
  styleUrls: ['./contracts.component.scss']
})

export class UploadContractPopup {
  uploader;
  cols;
  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<UploadContractPopup>,
    public media: MediaMatcher) { }

  // @HostListener('window:resize', ['$event'])
  // onResize(event) {
  //   this.mediumDevice = this.media.matchMedia("'(min-device-width : 768px)' and '(max-width:1024px)'");
  //   this.largeDevice = this.media.matchMedia("'(min-width: 1025px)' and '(max-width:1370px)'");
  //   this.mobileDevice = this.media.matchMedia("'(max-width:763px)' and '(min-width:319px)'");
  //   if (this.mediumDevice.matches) {
  //     this.cols = 50;
  //   }
  //   if (this.largeDevice.matches) {
  //     this.cols = 59;
  //   }
  //   if (this.mobileDevice.matches) {
  //     this.cols = 25;
  //   }
  // }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
