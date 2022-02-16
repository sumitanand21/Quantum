import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
@Component({
  selector: 'app-serviceline-clouddetails',
  templateUrl: './serviceline-clouddetails.component.html',
  styleUrls: ['./serviceline-clouddetails.component.scss']
})
export class ServicelineClouddetailsComponent implements OnInit {
  panelOpenState2;
  Competitortab = true;
  Teambuildingtab = false;
  wiproDatabsebtn:boolean;
  dDatabasebtn: boolean;
  
  constructor(public service : DataCommunicationService) { }

  ngOnInit() {
    this.dDatabasebtn = false;
    this.wiproDatabsebtn = true;
  }

  goBack() {
    window.history.back();
  }
  tabone() {
    this.Competitortab = true;
    this.Teambuildingtab = false;
  }
  tabtwo() {
    this.Competitortab = false;
    this.Teambuildingtab = true;
  }

  additionalInfo(){
    this.wiproDatabsebtn = true;
    this.dDatabasebtn = false;
  }
  servicevalue(){
    this.dDatabasebtn = true;
    this.wiproDatabsebtn = false;
  }

  competitor_data=[
    {
      "id":"1",
      "disabled":true
    },
    { "id":"2",
    "disabled":false
    },
    {
      "id":"3",
      "disabled":false
    },
  ]

  addcompetitor()
  {
    this.competitor_data.push(
      {
        "id":(this.competitor_data.length + 1).toString(),
        "disabled":false
      }
    )
  }
  deletecompetitor(id)
  {
    this.competitor_data =  this.competitor_data.filter(x=>x.id != id)
  }


}
