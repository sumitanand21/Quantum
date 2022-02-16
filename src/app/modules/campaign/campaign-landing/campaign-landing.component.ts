import { Component, OnInit } from '@angular/core';
import { from } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { CampaignService } from '@app/core/services/campaign.service';
import { campaign, threadListService } from '@app/core';
import { RoutingState } from '@app/core/services/navigation.service';
@Component({
  selector: 'app-campaign-landing',
  templateUrl: './campaign-landing.component.html',
  styleUrls: ['./campaign-landing.component.scss']
})
export class CampaignLandingComponent implements OnInit {
  constructor(private router: Router,
    public userdat: DataCommunicationService) { }

  ngOnInit(): void {
    sessionStorage.removeItem('RequestCampaign');
  }

  RequestCampaign() {
    sessionStorage.removeItem('RequestCampaign')
    this.router.navigateByUrl('/campaign/RequestCampaign');
  }
}
