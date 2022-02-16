import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-request-sap-code',
  templateUrl: './request-sap-code.component.html',
  styleUrls: ['./request-sap-code.component.scss']
})
export class RequestSapCodeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  SAPDetails = [
    {name:'Account Name',value:'TSSC Support and system sol'},
    {name:'Account Number',value:'ACC0000123479'},
    {name:'Geography',value:'ZEUR'},
    {name:'Vertical',value:'Consumer goods'},
    {name:'Currency',value:'USD Dollar'},
    {name:'Account owner',value:'Sahil Chaturvedy'},
    {name:'Address',value:'26th Street, stweartfield, Road'},
    {name:'Opportunity won',value:'No'}
  ]

  customer:string;
  CRMAccount:string = 'ACC200046753';
  Verticalvalue:string ='Consumer goods';
  postalCode:string;
  RegionName:string;
  regionSwitch:boolean;
  isActivityGroupSearchLoading:boolean = false;
  regionArray = [
    {id:0,name:'Asia'},
    {id:1,name:'Pacific'},
    {id:2,name:'Europe'},
    {id:3,name:'North america'},
    {id:4,name:'Africa'},
  ]

  appendRegion(item){
    this.RegionName = item.name;
  }
  filesList = [];

  show:boolean = true;
  showItem(val){
    debugger;
    if(val === 'yes'){
        this.show = true;
    }
    else if(val === 'no'){
      this.show = false;
    }
  }

}
