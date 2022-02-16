import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataCommunicationService } from '@app/core/services/global.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-approval-task',
  templateUrl: './approval-task.component.html',
  styleUrls: ['./approval-task.component.scss']
})
export class ApprovalTaskComponent implements OnInit {
  contactstab = true;
  suitetab = false;
  plantab = false;
  activitytab = false;
  clear;
  selectedAll: any;
  table_data;
  checkboxcounter: number = 0; selectedCount: any = [];
  name: string;
  private sub: any;
  headerArray1;
  headerArray2;
  headerArray;

  constructor(public dialog: MatDialog, private router: Router, private route: ActivatedRoute, public userdat: DataCommunicationService, private location: Location) {

  }


  sideNavtrue() {

    var that = this;
    that.userdat.sideNavForAcList = true;

  }
  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.name = params['name'] + "";
    });
  }
  show;
  toggle;
  corr;


  // MORE ACTION STARTS **************
  showContent: boolean = false;

  contentArray = [
    { className: 'mdi mdi-settings-outline', value: 'Activity details', router: '/activities/detailsList' },
    { className: 'mdi mdi-folder-outline', value: 'Archive', router: 'popup' },
    { className: 'mdi mdi-bullhorn', value: 'Request campaign', router: '/campaign' },

    // { className: 'mdi mdi-vector-difference-ab', value: 'Create opportunity', router: '/opportunity/newopportunity' },
  ]


  closeContent() {
    this.showContent = false;
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }
  // MORE ACTION ENDS *******************
  expand = false;
  inputClick() {
    this.expand = true;
  }
  OutsideInput() {
    this.expand = false;
  }

  close() {
    this.expand = false;
    this.clear = "";
  }

  navTo() {
    this.router.navigateByUrl('/home/dashboard')
  }


}
