import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-performance-quarter-selector',
  templateUrl: './performance-quarter-selector.component.html',
  styleUrls: ['./performance-quarter-selector.component.scss']
})
export class PerformanceQuarterSelectorComponent implements OnInit {
  @Input() expansionData;

  performanceDetails=[];
  constructor() { }
  generatateData(data)
  {
    for(var propt in data){
     if(propt!="EMPNO")
     {
 this.performanceDetails.push({
        name:propt,
        TGT:data[propt].TGT,
        ACH:data[propt].ACH
      })
     }
     
        
    }
  }
  ngOnInit() {
   document.getElementsByClassName('container_performance')[0]['style'].width = '1192px';
    console.log(this.expansionData);
    this.performanceDetails=[];
    this.generatateData(this.expansionData.PerfomanceDetails)
  }

  performanceContent= [
    {"quatername": "Q1"},
    {"quatername": "Q2"},
    {"quatername": "Q3"},
    {"quatername": "Q4"},
  ]

  // ngOnChanges()
  // {
  //   console.log(this.expansionData);
  //   this.performanceDetails = this.expansionData.performanceDetails;
  // }

  // performanceDetails=[
  //   {
  //     "quatername": "Q1",
  //     "quaterTGT":"0.25",
  //     "quaterACH":"0.11",
  //     "quaterFlag":false
  //   },
  //   {
  //     "quatername": "Q2",
  //     "quaterTGT":"0.25",
  //     "quaterACH":"0.11",
  //     "quaterFlag":false
  //   },
  //   {
  //     "quatername": "Q3",
  //     "quaterTGT":"0.25",
  //     "quaterACH":"0.11",
  //     "quaterFlag":false
  //   },
  //   {
  //     "quatername": "Q4",
  //     "quaterTGT":"0.25",
  //     "quaterACH":"0.30",
  //     "quaterFlag":true
  //   },
  //   {
  //     "quatername": "Total",
  //     "quaterTGT":"0.25",
  //     "quaterACH":"0.11",
  //     "quaterFlag":false
  //   }
  // ]

}
