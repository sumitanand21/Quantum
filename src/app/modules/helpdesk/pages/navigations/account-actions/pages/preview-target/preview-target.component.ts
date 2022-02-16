import { Component, OnInit } from '@angular/core';
import { AccountListService } from '@app/core/services/accountList.service';

export interface Accounts {
  value: string;
  viewValue: string;
}
@Component({
  selector: 'app-preview-target',
  templateUrl: './preview-target.component.html',
  styleUrls: ['./preview-target.component.scss']
})
export class PreviewTargetComponent implements OnInit {
  selectparentAccount = [];
  selectedParentAccountObj = {};
  parentAccount: any;

  selectCurrency = [];
  selectedCurrencyObj = {};
  currency: any;

  selectAccountManager = [];
  selectedAccountManagerObj = {};
  accManager: any;

  selectExecutiveSponsor = [];
  selectedExecutiveSponsorObj = {};
  executiveSponsor: any;

  showAccountInfo = true;
  showWiproEngagement = true;
  businessAccountInfo = true;
  mhaDetails = true;
  showAdress = true;
  Acctypes: Accounts[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  accountInfo:any = {};
  targetMergeDetails: any = {
    "SysGuid":"",
    "Name":"",
    "Number":"",
    "ParentAccount":"",
    "AccountClassification":"",
    "Type":"",
    "Address":{
      "City":{},
      "Country":{},
      "State_Province":"",
      Address1:"",
      Address2:""
    },
    "CountryReference":"",
    "CityRegionReference":"",
    "Owner":"",
    "DeliveryManagerADHVDH":"",
    "Geo":"",
    "SBU":"",
    "Vertical":"",
    "Contact":"",
    "Email":"",
    "Currency":"",
    "AccountCategory":"",
    FinYear: "",
    WebsiteUrl:"",
    "TrendsNAnalysis":{"NoOfCBU":0,"Forbes1000Rank":0,"Priofit":0}
  }
  constructor(public accountListServ: AccountListService) { }

  ngOnInit() {
    let reqSysGuid = localStorage.getItem("accSysGuid");
    this.mergeReqDetails(reqSysGuid);
  }
  mergeReqDetails(reqSysGuid) {    
    if (reqSysGuid) {
      let payload = { SysGuid: reqSysGuid }
      this.accountListServ.getMergeDetails(payload).subscribe(async (details) => {
        if (!details.IsError && details.ResponseObject) {
          let targetDetails = details.ResponseObject.TargetAccount;
          // this.remainingTime = this.reqMergeDetails.MergeDate - newDate;
          console.log("target details", targetDetails);
          this.targetMergeDetails = {
            "Name":targetDetails.Name,
            "Number":targetDetails.Number,
            "ParentAccount":(targetDetails.ParentAccount.Name && targetDetails.ParentAccount)?targetDetails.ParentAccount.Name:"",
            "AccountClassification":(targetDetails.AccountClassification.Value && targetDetails.AccountClassification) ? targetDetails.AccountClassification.Value: "",
            "Type":(targetDetails.Type && targetDetails.Type.Value) ? targetDetails.Type.Value: "",
            "Address":{
              "City":(targetDetails.Address.City && targetDetails.Address.City.Name)? targetDetails.Address.City.Name:"",
              "Country":(targetDetails.Address.Country && targetDetails.Address.Country.Name)? targetDetails.Address.Country.Name:"",
              "State_Province":(targetDetails.Address && targetDetails.Address.State_Province)? targetDetails.Address.State_Province:"",
              "ZipCode":(targetDetails.Address && targetDetails.Address.ZipCode)? targetDetails.Address.ZipCode:"",
              "Address1":(targetDetails.Address && targetDetails.Address.Address1)? targetDetails.Address.Address1:"",
              "Address2":(targetDetails.Address && targetDetails.Address.Address2)? targetDetails.Address.Address2:""
            },
            "CountryReference":(targetDetails.CountryReference && targetDetails.CountryReference.Name) ? targetDetails.CountryReference.Name:"",
            "CityRegionReference":(targetDetails.CityRegionReference && targetDetails.CityRegionReference.Name)? targetDetails.CityRegionReference.Name: "",
            "Owner":(targetDetails.Owner && targetDetails.Owner.FullName) ? targetDetails.Owner.FullName: "",
            "Geo":(targetDetails.Geo && targetDetails.Geo.Name) ? targetDetails.Geo.Name: "",
            "SBU":(targetDetails.SBU && targetDetails.SBU.Name)? targetDetails.SBU.Name: "",
            "Vertical":(targetDetails.Vertical && targetDetails.Vertical.Name)?targetDetails.Vertical.Name:"",
            "Contact":(targetDetails.Contact && targetDetails.Contact.ContactNo)?targetDetails.Contact.ContactNo:"",
            "Email":targetDetails.Email ? targetDetails.Email:"",
            "Currency":(targetDetails.Currency && targetDetails.Currency.Value)?targetDetails.Currency.Value:"",
            "AccountCategory":(targetDetails.AccountCategory.Value && targetDetails.AccountCategory)?targetDetails.AccountCategory.Value:"",
            DeliveryManagerADHVDH:(targetDetails.DeliveryManagerADHVDH && targetDetails.DeliveryManagerADHVDH.FullName)?targetDetails.DeliveryManagerADHVDH.FullName:"",
            FinYear:(targetDetails.FinYear && targetDetails.FinYear.Name)?targetDetails.FinYear.Name:"",
            WebsiteUrl:targetDetails.WebsiteUrl?targetDetails.WebsiteUrl:"",
            // "TrendsNAnalysis":{"NoOfCBU":0,"Forbes1000Rank":0,"Priofit":0}
          }          
        }
      })
    } else {
      console.log("SysGuid not available");
    }
  }
}
