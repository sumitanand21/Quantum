import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '@app/core/services/deals/deals-observables.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-view-edit',
  templateUrl: './view-edit.component.html',
  styleUrls: ['./view-edit.component.scss']
})
export class ViewEditComponent implements OnInit, OnDestroy {
  pastDeal$: Subscription = new Subscription();
  tabVisibility: boolean = true;
  constructor(public router: Router, private message: MessageService) { }

  ngOnInit() {
    this.pastDeal$ = this.message.getPastDealEnable().subscribe(message => {
      console.log('message from subject in view-edit component-->', message)
      if (message.originUrl.includes('rlsView')) {
        this.tabVisibility = false
      }
    })
  }

  ngOnDestroy() {
    this.pastDeal$.unsubscribe();
  }

}
