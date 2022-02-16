import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';

@Component({
  selector: 'app-cancel-no-yes-popup',
  templateUrl: './cancel-no-yes-popup.component.html',
  styleUrls: ['./cancel-no-yes-popup.component.css']
})
export class CancelNoYesPopupComponent implements OnInit {

  constructor(public accservive:DataCommunicationService) { }

  ngOnInit() {
  }

}
