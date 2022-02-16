import { Component, OnInit, OnDestroy } from "@angular/core";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { Subscription } from "rxjs";
import { AppState } from "@app/core/state";
import { Store, select } from "@ngrx/store";
import { Router } from "@angular/router";
import { DealOverviewList } from "@app/core/state/selectors/deals/deal-overview.selectors";
import { MessageService } from "@app/core/services/deals/deals-observables.service";

@Component({
  selector: "app-deal-commercials",
  templateUrl: "./deal-commercials.component.html",
  styleUrls: ["./deal-commercials.component.scss"]
})
export class DealCommercialsComponent implements OnInit, OnDestroy {
  showMngMilestoneBtn: boolean = false;
  tabVisibility: boolean = true;
  getFillManageParams$: Subscription = new Subscription();
  pastDeal$: Subscription = new Subscription();
  constructor(
    public encrDecrService: EncrDecrService,
    public store: Store<AppState>,
    public router: Router,
    private message: MessageService
  ) {}

  ngOnInit() {
    this.getFillManageParams$ = this.store
      .pipe(select(DealOverviewList))
      .subscribe(res => {
        console.log("fill manage params response-->", res);
        if (res.dealoverview != undefined) {
          res.dealoverview.ValidationFlag.btnMngMilestones.Visible == "true"
            ? (this.showMngMilestoneBtn = true)
            : (this.showMngMilestoneBtn = false);
        } else {
          this.router.navigate(["/deals/existingTabs/overview"]);
        }
      });
    this.pastDeal$ = this.message.getPastDealEnable().subscribe(message => {
      console.log(
        "Response from subject in deal-criteria component-->",
        message
      );
      if (message.originUrl.includes("rlsView")) {
        this.tabVisibility = false;
      } else {
        this.tabVisibility = true;
      }
    });
  }
  ngOnDestroy() {
    this.getFillManageParams$.unsubscribe();
    this.pastDeal$.unsubscribe();
  }
}
