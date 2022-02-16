import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { OtherList } from '@app/core/models/others-list.model';
import { OthersListService } from '@app/core/services/others-list.service';


@Component({
  selector: 'app-other-notes-selector',
  templateUrl: './other-notes-selector.component.html',
  styleUrls: ['./other-notes-selector.component.scss']
})
export class OtherNotesSelectorComponent implements OnInit {
  @Input() expansionData: any;
  width:number=window.innerWidth-80;

  constructor(private userdat: OthersListService) { }

  ngOnInit() {
    // var y = 80;
    // var x = window.innerWidth;
    //  document.getElementsByClassName('expand-table-panel')[0]['style'].width = (x - y) +'px';
  }

}
