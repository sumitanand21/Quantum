import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports-listing-landing',
  templateUrl: './reports-listing-landing.component.html',
  styleUrls: ['./reports-listing-landing.component.scss']
})
export class ReportsListingLandingComponent implements OnInit {

  constructor(public userdat: DataCommunicationService,private router: Router) { }

  ngOnInit() {
  }
  goBack(){
      this.router.navigateByUrl('/reports')
  }
}
