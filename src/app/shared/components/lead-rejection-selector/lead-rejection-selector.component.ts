import { Component, OnInit, Input } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';

@Component({
  selector: 'app-lead-rejection-selector',
  templateUrl: './lead-rejection-selector.component.html',
  styleUrls: ['./lead-rejection-selector.component.scss']
})
export class LeadRejectionSelectorComponent implements OnInit {

  @Input() expansionData:any;
  width:number=window.innerWidth-80;
  // disqualifyRemarks: any;
  
  constructor(public userdat: DataCommunicationService) { }

  ngOnInit() {
    console.log("the remoreak s")
    console.log(this.expansionData)
    // this.disqualifyRemarks = decodeURIComponent(this.expansionData.Reason.Remarks)
    // var y = 80;
    // var x = window.innerWidth;
    //  document.getElementsByClassName('expand-table-panel')[0]['style'].width = (x - y) +'px';
  }

}
