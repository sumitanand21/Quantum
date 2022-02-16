import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';

@Component({
  selector: 'app-opportunity-guideline',
  templateUrl: './opportunity-guideline.component.html',
  styleUrls: ['./opportunity-guideline.component.scss']
})
export class OpportunityGuidelineComponent implements OnInit {
  // Competitortab = true;
  // Teambuildingtab = false;
  // Probabiltytab = false;
  dealtab = false;

  constructor(public service : DataCommunicationService) { }

  ngOnInit() {
  }
  goBack() {
    window.history.back();
  }
  tabone() {
    this.service.Competitortab = true;
    this.service.Teambuildingtab = false;
    this.service.Probabiltytab = false;
    this.dealtab = false;
  }
  tabtwo() {
    this.service.Competitortab = false;
    this.service.Teambuildingtab = true;
    this.service.Probabiltytab = false;
    this.dealtab = false;
  }
  tabthree() {
    this.service.Competitortab = false;
    this.service.Teambuildingtab = false;
    this.service.Probabiltytab = true;
    this.dealtab = false;
  }
  tabfour(){
    this.service.Competitortab = false;
    this.service.Teambuildingtab = false;
    this.service.Probabiltytab = false;
    this.dealtab = true;

  }
  competitor_data=[
    {
      "salesstage":"Create",
      "manualrange":"0% (Zero, Cannot Be Changed)",
      "systemprobability": "Nill"
    },
    { 
    "salesstage":"Qualify",
    "manualrange":"0 - 45%",
    "systemprobability": "Low"
    },
    {
      "salesstage":"Pursuit",
      "manualrange":"50 - 70%",
      "systemprobability": "Medium"
    },
    {
      "salesstage":"Secure",
      "manualrange":"75 - 95%",
      "systemprobability": "High"
    },
    {
      "salesstage":"Close",
      "manualrange":"100% (Cannot Be Changed)",
      "systemprobability": "100%"
    },
  ]
}