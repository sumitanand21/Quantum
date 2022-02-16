import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NguCarousel, NguCarouselConfig } from '@ngu/carousel';
import { ContactService } from '@app/core/services/contact.service';
@Component({
  selector: 'app-contact-history',
  templateUrl: './contact-history.component.html',
  styleUrls: ['./contact-history.component.scss']
})
export class ContactHistoryComponent implements OnInit, AfterViewInit {
  @ViewChild('triggerClick') triggerClick: ElementRef;
  isLoading: boolean = false;
  counttile: any;
  toggletable : boolean;
  toggletable1 : boolean;
  toggletable2 : boolean;
  toggletable3 : boolean;
  toggletable4 : boolean;
  toggletable5 : boolean;
  activecircle: boolean = true;

  name = 'Angular';
  slideNo = 0;
  withAnim = true;
  resetAnim = true;

  carouselConfig: NguCarouselConfig = {
    grid: { xs: 2, sm: 3, md: 4, lg: 4, all: 0 },
    load: 1,
    slide: 1,
    interval: {timing: 4000, initialDelay: 1000},
    loop: false,
    touch: true,
    velocity: 0.2,
  }
  carouselItems = ['','','','','','','','','','','','','','','','',''];
  clikedIndex = -1


  ContactEditID: any;
  contactName: any;
  historyData:any;
  constructor(private cdr: ChangeDetectorRef, public contactservice:ContactService) { }

  ngOnInit() {
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    this.contactName = JSON.parse(localStorage.getItem("singlecontactdetails"));
    console.log("Contact Guid id", this.ContactEditID);
    console.log("contact Name",this.contactName);
    this.contacthistorydata();

    this.clikedIndex = this.carouselItems.length-1;
    setTimeout(() => {
      this.triggerClick.nativeElement.click();
      }, 200);
      if(screen.width >= 823 ){
        this.counttile = 4;
      }
      else if(screen.width < 823 && screen.width > 640){
        this.counttile = 3;
      }
      else if(screen.width < 640){
        this.counttile = 2;
      }
      console.log(this.counttile);
  }
  topFiveActivities = [];
  accountLevelRSDetails = [];
  opportunityLevelRSDetails = [];
  opportunitiesTab= [];
  opportunitiesTabdata:any;
  opportunitiesTab1: any
  amount:any
  contacthistorydata(){
    this.contactservice.getIMTGraphData("144166F4-3ED1-E911-A839-000D3AA058CB",'apxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx','dexxxx moxxx').subscribe(res=>{
      this.historyData = res.ResponseObject
      console.log("contacthistorydata",this.historyData);
      this.topFiveActivities =  this.historyData.TopfiveActivities;
      console.log("topFiveActivities",this.topFiveActivities);
      this.accountLevelRSDetails = this.historyData.RevenueSLMSummary.SLMSummary1
      console.log("accountLevelRSDetails",this.accountLevelRSDetails);
      this.opportunitiesTab = this.historyData.OpportunitiesTab.map(x => {
        return {
          Amount : decodeURIComponent(x.Amount),
          Description : x.Description,
          Count : x.Count
        }
      })
      console.log("opportunitiesTab",this.opportunitiesTab);
      this.opportunityLevelRSDetails = this.historyData.RevenueSLMSummary.SLMSummary2
      console.log("opportunityLevelRSDetails",this.accountLevelRSDetails);
    });
  }
  
  check(i){
    this.activecircle = true;
    this.clikedIndex = i
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }


}
