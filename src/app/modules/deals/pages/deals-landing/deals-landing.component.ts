import { Component, OnInit } from "@angular/core";
import {
  DataCommunicationService,
  OnlineOfflineService,
  ErrorMessage
} from "@app/core";
import { Router } from "@angular/router";
import { MessageService } from "@app/core/services/deals/deals-observables.service";
import { dealService } from "@app/core/services/deals.service";
import { ValidateforNullnUndefined } from "@app/core/services/validateforNULLorUndefined.service";
import { EncrDecrService } from "@app/core/services/encr-decr.service";
import { Store, select } from "@ngrx/store";
import { AppState } from "@app/core/state";
import { DealAccessAction } from "@app/core/state/actions/deals.actions";
import { DealAccess } from "@app/core/state/selectors/deals/deal-access.selectors";
import { DigitalAssistantService } from "@app/core/services/digital-assistant/digital-assistant.service";
@Component({
  selector: "app-deals-landing",
  templateUrl: "./deals-landing.component.html",
  styleUrls: ["./deals-landing.component.scss"]
})
export class DealsLandingComponent implements OnInit {
  userInfo: any;
  isLoading: boolean;
  roleValidateArray: any = [];

  constructor(
    public service: DataCommunicationService,
    public router: Router,
    private _MessageService: MessageService,
    private deals: dealService,
    private onlineOfflineService: OnlineOfflineService,
    public _error: ErrorMessage,
    private _validate: ValidateforNullnUndefined,
    public store: Store<AppState>,
    private encrDecrService: EncrDecrService,
    public daService: DigitalAssistantService
  ) {}

  ngOnInit() {
    console.log("deals landing..");
    this.daService.iframePage = "OPPORTUNITY_DEALS";
    let bodyDA = {
      SubVerticalAndFunction: "",
      page: "OPPORTUNITY_DEALS",
      wipro: true
    };
    this.daService.postMessageData = bodyDA;
    this.daService.postMessage(bodyDA);

    // let dealData = sessionStorage.getItem('Dealoverview')
    // this.daService.postMessage(dealData)

    let userInfo = this.encrDecrService.get(
      "EncryptionEncryptionEncryptionEn",
      sessionStorage.getItem("userInfo"),
      "DecryptionDecrip"
    );
    this.userInfo = JSON.parse(userInfo);
    this.service.navcontent = "Deals";
    this.store.pipe(select(DealAccess)).subscribe(
      res => {
        console.log("Deal access", res);
        if (res.dealaccess) {
          this.roleValidateArray = res.dealaccess;
          this.roleValidateArray.map(x => {
            if (x.ControlName == "btnCreateDeal") {
              this.showCreate = x.InVisible;
            }
          });
          this._MessageService.sendRole(this.roleValidateArray);
        } else {
          let roleInput = {
            User: { EmployeeId: this.userInfo.EmployeeId },
            spParams: { PageName: "MyDeals.aspx" }
          };
          this.getRole(roleInput);
        }
      },
      error => {
        let roleInput = {
          User: { EmployeeId: this.userInfo.EmployeeId },
          spParams: { PageName: "MyDeals.aspx" }
        };
        this.getRole(roleInput);
      }
    );
  }
  // MORE ACTION STARTS **************
  showContent: boolean = false;
  showCreate: boolean = false;

  closeContent() {
    this.showContent = false;
  }
  // canceldealcreate() {
  //   this.router.navigate(['/deals/deal', { returnUrl: this.router.routerState.snapshot.url }])
  // }
  getRole(roleInput: {
    User: { EmployeeId: any };
    spParams: { PageName: string };
  }) {
    this.isLoading = true;
    this.deals.RoleAccess(roleInput).subscribe(
      Response => {
        if (Response.ReturnCode == "S") {
          this.isLoading = false;
          this.roleValidateArray = Response.Output;
          this.store.dispatch(
            new DealAccessAction({ dealaccessList: Response.Output })
          );
          this.roleValidateArray.map(x => {
            if (x.ControlName == "btnCreateDeal") {
              this.showCreate = x.InVisible;
            }
          });
          this._MessageService.sendRole(Response.Output);
          let message = Response.Output[0].hasOwnProperty("DPSAccessMessage")
            ? Response.Output[0].DPSAccessMessage
            : Response.ReturnMessage;
       //   this._error.throwError(message);
        } else {
          this.isLoading = false;
          this._MessageService.sendRole(null);
          this._error.throwError(Response.ReturnMessage);
        }
      },
      error => {
        this.isLoading = false;
        this._error.throwError(
          "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?"
        );
      }
    );
  }
  toggleContent() {
    this.showContent = !this.showContent;
  }
  clearOppContent() {
    localStorage.removeItem("oppList");
    this.router.navigate([
      "/deals/createDeal",
      { returnUrl: this.router.routerState.snapshot.url }
    ]);
    //this.router.navigateByUrl('/deals/createDeal')
  }
  // MORE ACTION ENDS *******************
}
