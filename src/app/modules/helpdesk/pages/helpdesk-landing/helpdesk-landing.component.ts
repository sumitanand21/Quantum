import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';

@Component({
  selector: 'app-helpdesk-landing',
  templateUrl: './helpdesk-landing.component.html',
  styleUrls: ['./helpdesk-landing.component.scss']
})
export class HelpdeskLandingComponent implements OnInit {

  constructor(public service: DataCommunicationService) { }

  ngOnInit() {
  }

}
