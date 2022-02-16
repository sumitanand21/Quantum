import { Component, OnInit } from '@angular/core';
import { DataCommunicationService,  OpportunitiesService } from '@app/core';

@Component({
  selector: 'app-track-opportunity',
  templateUrl: './track-opportunity.component.html',
  styleUrls: ['./track-opportunity.component.scss']
})
export class TrackOpportunityComponent implements OnInit {
  ViewDetailsContent: Boolean =false;
  ManualContent:Boolean=true;
  tableCount=30;
  oppID='';
  orderID='';
  trackArray: any=[{}];
  radioOpp=true;

    userArray2 = [
    {"index":1,"Previousvalue": "AC123124323", "Chnagedvalue": "OC123124141", "Changedon": "23-Dec-2019" },
    {"index":1,"Previousvalue": "AC123124323", "Chnagedvalue": "OC123124141", "Changedon": "23-Dec-2019" },
    ]

    headernonsticky2 = [{ name: "Previousvalue",title:"Previous value" },
    { name: "Changedvalue",title:"Changed value" },
    { name: "Changedon",title:"Changed on" },
    ];

  constructor(public projectService: OpportunitiesService, public service: DataCommunicationService) { }

  ngOnInit() {
  }
  goback(){
    this.service.hidehelpdesknav = true;
    this.service.hidehelpdeskmain = false;
  }

  // toggle(val){

  //   this.orderID='';
  //   this.oppID='';
  //   this.trackArray= [{}];
  //   this.textBoxDisabled = val;
  // }

  toggleEvent(event){
    this.radioOpp=true;
  }
  searchOpp(){ //Search the Opportunity ID and get data to display the result.
    this.service.loaderhome = true;
    this.trackArray=[{}];
    this.projectService.getHelpDeskTrackOpp(this.oppID).subscribe(res=>{
      if(res.IsError== false){
        if(res && res.ResponseObject && Object.keys(res.ResponseObject).length > 0){
            console.log("Response for the data", res);
            let helpdeskTrackObj = Object.assign({
              "index":1,
              "Previousvalue": (res.ResponseObject.Opp_Old_Value?res.ResponseObject.Opp_Old_Value:''),
              "Changedvalue": (res.ResponseObject.Opp_New_Value?res.ResponseObject.Opp_New_Value:''),
              "Changedon": (res.ResponseObject.Modified_Date?res.ResponseObject.Modified_Date:'')
            })
            this.trackArray = new Array(Object.assign({},helpdeskTrackObj));
        }
        else{
          this.trackArray=[{}];
          this.projectService.displayMessageerror("No record found.");
        }
    }
    else{
      var message=res.Message;
      this.projectService.displayMessageerror(message);
    }
    this.service.loaderhome = false;
    },
    err => {
      this.service.loaderhome = false;
      this.projectService.displayerror(err.status);
      }
    )
  }
}
