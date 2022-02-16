import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog } from '@angular/material';
import { Observable, of, concat, from } from 'rxjs';
import { OpportunitiesService } from '@app/core';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';
@Component({
  selector: 'app-all-opportunity',
  templateUrl: './all-opportunity.component.html',
  styleUrls: ['./all-opportunity.component.scss']
})
export class AllOpportunityComponent implements OnInit {
  CreateOppTab;
  showmore;
  createshowmore;
  tableview: boolean;
  cardview: boolean = true;
  more_clicked;
  show;
  value: string = "Alphabetically";
  reverse: boolean;
  expand = false;
  searchItem: String;
  totalRecordCount = 0;
  data: any = [];
  Views: any[];
  count = 0;
  isPin: boolean = true;
  cardRecordsChecked: boolean;
  isLoading;
  

  headerData = [
    { name: "title", subProp: "pinStatus", isFirst: true, title: "Title", type: "text", selectName: " Views " },
    { name: "created_by", title: "Created By", type: "text" },
    { name: "created_on", title: "Created On", type: "date" }
  ]

  constructor(public envr : EnvService,public router: Router, public service: DataCommunicationService, public projectService: OpportunitiesService, public dialog: MatDialog) { }
  performChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'pin':
        {
          console.log('in navi', childActionRecieved);
          return;
        }
      case 'title':
        {
          console.log('in navi title ----->', childActionRecieved);
          this.savedCrmView(actionRequired.objectRowData[0]);
          return;
        }
      case 'delete':
        {
          console.log('in navi', childActionRecieved);
          this.callDeleteMethod(actionRequired);
          //this.createnewviewcrm();
          return;
        }
      case 'share':
        {
          console.log('in navi', childActionRecieved);
          this.createnewviewcrm();
          return;
        }
      case 'edit':
        {
          console.log('in navi', childActionRecieved);
          this.savedCrmView(actionRequired.objectRowData[0]);
          return;
        }
    }
  }
callDeleteMethod(data){
debugger;
  this.isLoading=true;
  let Userqueryid = [];
  // let listdata =JSON.parse(data);
  data.objectRowData.forEach(element => {
    Userqueryid.push(element.Userqueryid)
  });
  const obj = {
    // 'Views':["d8f7d489-c2d3-e911-a839-000d3aa058cb"]
    'Views': Userqueryid
  };
this.projectService.deleteViewQuery(obj).subscribe(result=>{
  this.isLoading=false;
console.log(result,"result")
if(!result.IsError){
  this.projectService.displayMessageerror("View deleted successfully!"); 
  this.ngOnInit();
}
})
}
  // Select checkbox ends
  goBack() {
   let path = this.projectService.getSession('path');
    if(path ){
      sessionStorage.removeItem('path');
      this.router.navigate([path]);
    }
  }
  datachange() {
    this.tableview = true;
    this.cardview = false;
  }
  togglePin(item) {
    item.isPin = !item.isPin;
  }
  hidedropdown() {
    document.getElementsByClassName('caret0')[0].classList.remove('rotate-180d');
    this.show = false;
  }
  showAlpha() {
    document.getElementsByClassName('caret0')[0].classList.toggle('rotate-180d');
    this.show = !this.show;

  }
  showContent: boolean = false;
  closeContent() {
    this.showContent = false;
  }

  toggleContent() {
    this.showContent = !this.showContent;
  }
  inputClick() {
    this.expand = true;
  }
  OutsideInput() {
    this.expand = false;
  }

  close() {
    this.expand = false;
    this.searchItem = "";
  }
  addCBU(i) {
    if (i == 1) {
      this.value = "A to Z"
      this.show = false;
      this.reverse = false;
    }
    else if (i == 2) {
      this.value = "Z to A"
      this.show = false;
      this.reverse = true;
    }
    else if (i == 3) {
      this.value = "Alphabetically3"
      this.show = false;
    }
  }
  createnewviewcrm() {
    const createnewviewcrm = this.envr.authConfig.url;
    //let url = createnewviewcrm + "main.aspx?appid=&pagetype=advancedfind";
    let url = createnewviewcrm + "/WebResources/wipro_openadvancefindfromsoe";
    window.open(url, "_blank");
  }
  savedCrmView(data){
    let savedQueryId=data.Userqueryid;
    const moreviewurl = this.envr.authConfig.url;
      const url = moreviewurl +
        'main.aspx?etn=opportunity&pagetype=entitylist&viewid=' + savedQueryId + '&viewtype=4230&navbar=off&cmdbar=false#436148839';
      console.log(url);
      window.open(url, '_blank');
  }

  ngOnInit() {
    debugger;
    this.isLoading=true;
    let obj = {
      "SearchText": "opportunity"
    }
    this.projectService.getAllViewQuery(obj).subscribe(result => {
      this.isLoading=false;
      this.totalRecordCount = result.ResponseObject.length;
      this.Views = result.ResponseObject;
      this.data = [];
      for (var value of this.Views) {
        this.data.push({
          title: value.Name ? value.Name : 'NA',
          created_by: value.CreatedBy?value.CreatedBy:'',
          created_on: value.CreatedOn?value.CreatedOn:'',
          Userqueryid: value.SysGuid?value.SysGuid:'',
          pinStatus: value.is_pinned?value.is_pinned:false,
          shareBtnVisibility: value.is_share?value.is_share:false,
          editBtnVisibility: false,
          deleteBtnVisibility: value.is_delete?value.is_delete:false

        })
      }
    })
  }

}