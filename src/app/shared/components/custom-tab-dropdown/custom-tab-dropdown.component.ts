import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core';

@Component({
  selector: 'app-custom-tab-dropdown',
  templateUrl: './custom-tab-dropdown.component.html',
  styleUrls: ['./custom-tab-dropdown.component.scss']
})
export class CustomTabDropdownComponent implements OnInit {

  constructor(private router: Router, public service: DataCommunicationService) { }
  @Input() bgParentColorChild: string;
   @Input() tabList :Array<any>;
  @Input() selectedTab: string;
  @Input() recordCount: string;
  @Input() pinEnable: boolean;
  @Output() TabSelectEvent = new EventEmitter<{action:string,data:any}>();

  tabNameSwitch;
  selectedTabTitle: string;
  showAllView={title:"More",id:"-1"};
  showViewFlag =true

  // PLEASE DONT CHANGE ANY CODE IN THIS FILE
  ngOnInit() {
   this.showViewFlag =true
    // this.selectedTabTitle="Active Accounts";
    if(this.tabList && this.tabList.length != 0){
      if(this.tabList[0].GroupLabel?this.tabList[0].GroupLabel=='   ':false){
      //this.showViewFlag =false
      }
      if(this.tabList[0].GroupData.length!=0)
      {
        console.log('in custom dropdown',this.selectedTab);
        //this.selectedTabTitle = this.tabList[0].GroupData.filter(y=>y.id==this.selectedTab)[0].title;
        this.tabList.forEach(element => {
          var filterData=element.GroupData.filter(y=>y.id==this.selectedTab)
            if(filterData.length>0)
            {
              this.selectedTabTitle = filterData[0].title?filterData[0].title:'NA';
              this.service.selectedTabValue = this.selectedTabTitle;
            }
        });
        
      }
    
    }
    //this.selectedTabTitle=this.tabList.filter(x=>x.GroupData.filtert(y=>y.id==this.selectedTab))[0].title;
  }

  ind: boolean;
  openTabDrop() {
    this.tabNameSwitch = !this.tabNameSwitch;
  }
  emitTabSelection(value) {
    //debugger
    // this.service.selectedTabValue = value.title;
    this.TabSelectEvent.emit({action:'tab',data:value});

  }
  emitPinSelection(value)
  {
    // this.service.selectedTabValue = value.title;
    this.TabSelectEvent.emit({action:'pin',data:value});
  }
  closeTabDrop() {
    this.tabNameSwitch = false;
  }
  ngOnChanges() {
    if(this.tabList && this.tabList.length != 0){
      if(this.tabList[0].GroupData.length>0)
      {
        this.selectedTabTitle = this.tabList[0].GroupData.filter(y=>y.id==this.selectedTab)[0].title;
      }
    
    }
  }
}
