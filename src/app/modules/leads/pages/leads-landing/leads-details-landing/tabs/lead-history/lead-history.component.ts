import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { ActivatedRoute } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ContactleadService, ErrorMessage } from '@app/core';
import { LoadLeadHistory, UpdateHistoryflag, LoadLeadDetails } from '@app/core/state/actions/leads.action';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { MatSnackBar } from '@angular/material';
import { getLeadsDetails } from '@app/core/state/selectors/lead/lead.selector';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-lead-history',
  templateUrl: './lead-history.component.html',
  styleUrls: ['./lead-history.component.scss']
})
export class LeadHistoryComponent implements OnInit {
  id: any;
  leadHistory: any = [];
  leadDetails: any;
  isHistory: boolean = true;
  userID: any;
  subscription: Subscription;
  constructor(public service: DataCommunicationService,
    private route: ActivatedRoute,
    private encrDecrService: EncrDecrService,
    private contactleadservice: ContactleadService,
    public matSnackBar: MatSnackBar,
    private errorPopUp: ErrorMessage,
    private store: Store<AppState>) {
    // subscribe to home component messages
    this.subscription = this.service.getloadLeadHistry().subscribe(message => {
      if (message == true) {
        console.log("subject triggered")
        this.leadHistrory()
      }
    });
  }
  ngOnInit() {
    this.id = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', JSON.parse(sessionStorage.getItem('LeadId')), 'DecryptionDecrip')
    this.userID = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    console.log(this.id)
    this.leadHistrory()

    this.store.pipe(select(getLeadsDetails(this.id))).subscribe(res => {

      if (res) {
        this.leadDetails = res
        this.isHistory = res.isHistory
      }
      else {
        this.GetLeadDetails(this.id, this.userID)
      }

    })

  }
  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  leadHistrory() {
    debugger
    this.contactleadservice.getHistory(this.id).subscribe(res => {
      if (res.IsError === false) {
        this.leadHistory = res.ResponseObject;
        console.log('leadHistory', this.leadHistory)
        // this.store.dispatch(new LoadLeadHistory({history: this.leadHistory}))
      } else {
        this.errorPopUp.throwError(res.Message)
      }
    }, error => {
      this.errorPopUp.throwError("User doesn't have sufficient permissions to complete the task")
    })
  }


  GetLeadDetails(id, userID) {

    this.contactleadservice.getLeadDetails(id, userID).subscribe(data => {

      if (!data.IsError) {

        const ImmutabelObj = { ...data.ResponseObject, id: data.ResponseObject.LeadGuid, isHistory: this.isHistory }
        this.store.dispatch(new LoadLeadDetails({ details: ImmutabelObj }))

      }

    })
  }

}
