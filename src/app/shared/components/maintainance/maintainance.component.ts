import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, AuthService } from '@app/core';

@Component({
  selector: 'app-maintainance',
  templateUrl: './maintainance.component.html',
  styleUrls: ['./maintainance.component.scss']
})
export class MaintainanceComponent implements OnInit {
  openit = false;
  constructor(public service: DataCommunicationService,   private auth: AuthService) { }

  ngOnInit() {
  }

  openLogout() {
    this.openit = !this.openit;
  }
  closeLogout() {
    this.openit = false;
  }
  DropMenu_hide() {
    this.auth.logoff()
  }

}
