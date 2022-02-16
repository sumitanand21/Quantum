import { Component, OnInit } from '@angular/core';
import {OpportunitiesService, DataCommunicationService } from '@app/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-viewindent',
  templateUrl: './viewindent.component.html',
  styleUrls: ['./viewindent.component.scss'],
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})
export class ViewindentComponent implements OnInit {
  viewindent =  [];
  panelOpenState : boolean;
  panelOpenState1 : boolean;
  view_table = [];
  fixedClass = 'fixedClass1';
  

  openFeedbackPopup() {
    const dialogRef = this.dialog.open(FeedbackPopup, {
      width: '850px'
    });
  }

  constructor(public router: Router, public service: DataCommunicationService,public dialog: MatDialog, public projectService: OpportunitiesService,) {
    this.viewindent = [
      {
        'head': 'Account',
        'subdata' : 'ACC000000005011'
      },
      {
        'head': 'Opportunity Number',
        'subdata' : 'Opp000018576'
      },
      {
        'head': 'SBU',
        'subdata' : 'Health'
      },
      {
        'head': 'CRM Ref Number',
        'subdata' : '50009033'
      },
      {
        'head': 'Account Manager',
        'subdata' : 'Pranit Kumar'
      },
      {
        'head': 'Opportunity Name',
        'subdata' : 'Bio Pharm'
      },
      {
        'head': 'SAP Cust Number',
        'subdata' : '2601'
      }
    ]

   }

  ngOnInit() {
    this.view_table = [
      { projectname : 'CGO-BAM-ESSENCE-FOM', projectstatus : 'Created', custname: 'Glaxo Smith Kline (GSK)', engtype: 'Stagg Augmentation(L1) Fulfilled',
       indenttype: 'Fulfilled',  demandid: 'D1800000000000022423052014', resource: '1', allocated: '1',
       suite: 'Manager -L7.1',  experience: '> 10year', location: 'Wipro -Bangalore', demandstart: '2014-04-04T00:00:00',
       enddate: '2014-04-04T00:00:00', createdon: '2014-04-04T00:00:00', dm: 'Suresh Kumar S',  seed: 'OLD-NEW', pcode: 'Y5' },
       { projectname : 'CGO-BAM-ESSENCE-FOM', projectstatus : 'Created', custname: 'Glaxo Smith Kline (GSK)', engtype: 'Stagg Augmentation(L1) Fulfilled',
       indenttype: 'Fulfilled',  demandid: 'D1800000000000022423052014', resource: '1', allocated: '1',
       suite: 'Manager -L7.1',  experience: '> 10year', location: 'Wipro -Bangalore', demandstart: '2014-04-04T00:00:00',
       enddate: '2014-04-04T00:00:00', createdon: '2014-04-04T00:00:00', dm: 'Suresh Kumar S',  seed: 'OLD-NEW', pcode: 'Y5' },
       { projectname : 'CGO-BAM-ESSENCE-FOM', projectstatus : 'Created', custname: 'Glaxo Smith Kline (GSK)', engtype: 'Stagg Augmentation(L1) Fulfilled',
       indenttype: 'Fulfilled',  demandid: 'D1800000000000022423052014', resource: '1', allocated: '1',
       suite: 'Manager -L7.1',  experience: '> 10year', location: 'Wipro -Bangalore', demandstart: '2014-04-04T00:00:00',
       enddate: '2014-04-04T00:00:00', createdon: '2014-04-04T00:00:00', dm: 'Suresh Kumar S',  seed: 'OLD-NEW', pcode: 'Y5' },
       { projectname : 'CGO-BAM-ESSENCE-FOM', projectstatus : 'Created', custname: 'Glaxo Smith Kline (GSK)', engtype: 'Stagg Augmentation(L1) Fulfilled',
       indenttype: 'Fulfilled',  demandid: 'D1800000000000022423052014', resource: '1', allocated: '1',
       suite: 'Manager -L7.1',  experience: '> 10year', location: 'Wipro -Bangalore', demandstart: '2014-04-04T00:00:00',
       enddate: '2014-04-04T00:00:00', createdon: '2014-04-04T00:00:00', dm: 'Suresh Kumar S',  seed: 'OLD-NEW', pcode: 'Y5' },
       { projectname : 'CGO-BAM-ESSENCE-FOM', projectstatus : 'Created', custname: 'Glaxo Smith Kline (GSK)', engtype: 'Stagg Augmentation(L1) Fulfilled',
       indenttype: 'Fulfilled',  demandid: 'D1800000000000022423052014', resource: '1', allocated: '1',
       suite: 'Manager -L7.1',  experience: '> 10year', location: 'Wipro -Bangalore', demandstart: '2014-04-04T00:00:00',
       enddate: '2014-04-04T00:00:00', createdon: '2014-04-04T00:00:00', dm: 'Suresh Kumar S',  seed: 'OLD-NEW', pcode: 'Y5' },
       { projectname : 'CGO-BAM-ESSENCE-FOM', projectstatus : 'Created', custname: 'Glaxo Smith Kline (GSK)', engtype: 'Stagg Augmentation(L1) Fulfilled',
       indenttype: 'Fulfilled',  demandid: 'D1800000000000022423052014', resource: '1', allocated: '1',
       suite: 'Manager -L7.1',  experience: '> 10year', location: 'Wipro -Bangalore', demandstart: '2014-04-04T00:00:00',
       enddate: '2014-04-04T00:00:00', createdon: '2014-04-04T00:00:00', dm: 'Suresh Kumar S',  seed: 'OLD-NEW', pcode: 'Y5' }
    ]   
  }

  goBack(){
    window.history.back();
  }


}


// ExecuteContractPopup starts
@Component({
  selector: 'feedback-popup',
  templateUrl: './feedbackPopup.html',
  styleUrls: ['./viewindent.component.scss'],
  inputs: ['activeColor', 'baseColor', 'overlayColor']
})
export class FeedbackPopup {
  iconColor: string;
  borderColor: string;

  activeColor: string = 'green';
  baseColor: string = '#ccc';
  overlayColor: string = 'rgba(255,255,255,0.5)';

  dragging: boolean = false;
  loaded: boolean = false;
  imageLoaded: boolean = false;
  imageSrc: string = '';

  constructor(public dialog: MatDialog,
    public dialogRef: MatDialogRef<FeedbackPopup>,
    public router: Router,
    public projectService: OpportunitiesService) { }

  handleDragEnter() {
    console.log("handleDragEnter")
    this.dragging = true;
  }

  handleDragLeave() {
    console.log("handleDragLeave")
    this.dragging = false;
  }

  handleDrop(e) {
    e.preventDefault();
    this.dragging = false;
    this.handleInputChange(e);
  }

  handleImageLoad() {
    this.imageLoaded = true;
    this.iconColor = this.overlayColor;
  }

  handleInputChange(e) {
    console.log("input change")
    var file = e.dataTransfer ? e.dataTransfer.files[0] : e.target.files[0];

    var pattern = /image-*/;
    var reader = new FileReader();

    if (!file.type.match(pattern)) {
      alert('invalid format');
      return;
    }

    this.loaded = false;

    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    console.log("_handleReaderLoaded")
    var reader = e.target;
    this.imageSrc = reader.result;
    this.loaded = true;
  }

  _setActive() {

    this.borderColor = this.activeColor;
    if (this.imageSrc.length === 0) {
      this.iconColor = this.activeColor;
    }
  }

  _setInactive() {
    this.borderColor = this.baseColor;
    if (this.imageSrc.length === 0) {
      this.iconColor = this.baseColor;
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
}
