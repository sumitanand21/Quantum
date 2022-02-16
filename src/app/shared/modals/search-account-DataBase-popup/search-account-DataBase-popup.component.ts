import { Component, OnInit, Inject,HostListener } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ExistingAccountPopupComponent } from '../existing-account-popup/existing-account-popup.component';
import { DataCommunicationService } from '@app/core/services/global.service';
import { Router } from '@angular/router';
import { ExistingReservePopupComponent } from '../existing-reserve-popup/existing-reserve-popup.component';
import { S3MasterApiService } from '@app/core/services/master-api-s3.service';
import { AccountListService } from '@app/core/services/accountList.service';

@Component({
  selector: 'app-search-account-DataBase-popup',
  templateUrl: './search-account-DataBase-popup.component.html',
  styleUrls: ['./search-account-DataBase-popup.component.scss']
})
export class SearchAccountDataBasePopupComponent implements OnInit {
  openDnB: boolean = false;
  isActivityGroupSearchLoading: boolean;
  countryname: any;
  prospectsysguid: any;
  // accountNameFlag: boolean = false;
  constructor(public accountListService: AccountListService,
    public router: Router, public dialog: MatDialog, public accservive: DataCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public master3Api: S3MasterApiService,
    private snackBar: MatSnackBar,
    public userdat: DataCommunicationService,
    public dialogRef: MatDialogRef<SearchAccountDataBasePopupComponent>) {
    if (data && data.openDnB) {
      this.openDnB = data.openDnB;

    }
    
  }
  @HostListener('window:keyup.esc') onKeyUp() {
    this.dialogRef.close();
  }
  ngOnInit() {
    this.dDatabasebtn = false;
    this.wiproDatabsebtn = true;
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  openDbList: boolean = false;
  companyName: string;
  comapnyNamewipro: string;
  showCompany: boolean;
  wiproDatabsebtn: boolean;
  dDatabasebtn: boolean;
  showCompanySwitch: boolean = true;
  showCompanySwitchD: boolean = true; //D&B 
  companyNameD: string;//D&B 
  showCompanySwitchDc: boolean = true; //D&B 
  CompanyNameDc: any;//D&B 
  countrycode: any;
  countryvalue: any;
  accountname: any;
  pincode: any;
  accounts = [];
  countryvaluerequried: boolean = false;
  accountvaluerequried: boolean = false;
  displayData: string = "Search results will be displayed here";
  firstTenRecord: boolean = false;
  wiproDatabsebtclick() {
    this.wiproDatabsebtn = true;
    this.dDatabasebtn = false;
  }
  dDatabasebtnClick() {
    this.dDatabasebtn = true;
    this.wiproDatabsebtn = false;
  }
  ExistingAccount() {
    const dialogRef = this.dialog.open(ExistingAccountPopupComponent,
      {
        width: '380px'
      });
  }
  reserveAccount() {
    const dialogRef = this.dialog.open(ExistingReservePopupComponent,
      {
        width: '380px'
      });
  }

  companyNameClose() {

    this.showCompanySwitch = false;
  }
  companyNameCloseD() {//D&B 

    this.showCompanySwitchD = false;
  }
  companyNameCloseDc() {//D&B 

    this.showCompanySwitchDc = false;
  }


  // companyDetails:{}[] = [

  // { name:"Account name",number:'Number',owner:'Owner',vertical:'Vertical',region:'Region',Prospect_account:'Prospect'},
  // { name:"Account name",number:'Number',owner:'Owner',vertical:'Vertical' ,region:'Region', Pending_account:'Pending account' },
  // { name:"Reserve account",number:'Number',owner:'Owner',vertical:'Vertical', region:'Region', Reserve_account:'Reserve account'},
  // { name:"Existing name",number:'Number',owner:'Owner',vertical:'Vertical',region:'Region',Existing_account:'Existing account'},
  // { name:"Account name",number:'Number',owner:'Owner',vertical:'Vertical', region:'Region',Pending_account:'Pending account' },
  // { name:"Existing account",number:'Number',owner:'Owner',vertical:'Vertical', region:'Region', Existing_account:'Existing account'},
  // { name:"Reserve account",number:'Number',owner:'Owner',vertical:'Vertical', region:'Region', Reserve_account:'Reserve account'},
  // { name:"Singtel Infotech pvt Ltd.",number:'Number',owner:'Owner',vertical:'Vertical', refernce:'Create reference account'},
  // { name:"Account name",number:'Number',owner:'Owner',vertical:'Vertical', region:'Region',Pending_account:'Pending account'},
  // { name:"Account name",number:'Number',owner:'Owner',vertical:'Vertical', region:'Region',Prospect_account:'Prospect'},
  // { name:"Account name",number:'Number',owner:'Owner',vertical:'Vertical', region:'Region',Pending_account:'Pending account'},
  // { name:"Something",number:'Number',owner:'Owner',vertical:'Vertical', region:'Region',Prospect_account:'Prospect'},
  // { name:"Existing account",number:'Number',owner:'Owner',vertical:'Vertical', region:'Region', Existing_account:'Existing account'},
  // { name:"Reserve account",number:'Number',owner:'Owner',vertical:'Vertical', region:'Region', Reserve_account:'Reserve account'},
  // { name:"Singtel Infotech pvt Ltd",number:'Number',owner:'Owner',vertical:'Vertical', region:'Region'}

  // ]

  companyDetails: {}[] = [
    { name: "Account name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Prospect_account: 'Prospect', Duns: "942927547" },
    { name: "Account name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Pending_account: 'Pending account', Duns: "942927548" },
    { name: "Reserve account", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Reserve_account: 'Reserve account', Duns: "942927549" },
  ]

  companyDetailsD: {}[] = [

    { name: "Account name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Prospect_account: 'Prospect' },
    { name: "Account name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Pending_account: 'Pending account' },
    { name: "Reserve account", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Reserve_account: 'Reserve account' },
    { name: "Existing name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Existing_account: 'Existing account' },
    { name: "Account name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Pending_account: 'Pending account' },
    { name: "Existing account", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Existing_account: 'Existing account' },
  ]
  companyDetailsD1: {}[] = [

    { name: "Account name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Prospect_account: 'Prospect' },
    { name: "Account name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Pending_account: 'Pending account' },
    { name: "Reserve account", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Reserve_account: 'Reserve account' },
    { name: "Existing name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Existing_account: 'Existing account' },
    { name: "Account name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Pending_account: 'Pending account' },
    { name: "Existing account", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Existing_account: 'Existing account' },
  ]
  companyDetailsD2: {}[] = [

    { name: "Account name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Prospect_account: 'Prospect' },
    { name: "Account name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Pending_account: 'Pending account' },
    { name: "Reserve account", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Reserve_account: 'Reserve account' },
    { name: "Existing name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Existing_account: 'Existing account' },
    { name: "Account name", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Pending_account: 'Pending account' },
    { name: "Existing account", number: 'Number', owner: 'Owner', vertical: 'Vertical', region: 'Region', Existing_account: 'Existing account' },
  ]

  getcountrycode(event) {
    if (!this.userdat.searchFieldValidator(event.target.value)) {
      event.target.value = '';
    }
    this.countrycode = [];
    // if (event.target.value) {
    const countrydetails = this.master3Api.getcountrycode(event.target.value)
    countrydetails.subscribe((res: any) => {
      // console.log("country code response", res.ResponseObject)
      if (!res.IsError && res.ResponseObject) {


        if (res.ResponseObject.length === 0) {
          this.countrycode = [];
          this.countryvalue = '';
          this.countrycode['message'] = 'No record found';
        } else {
          this.countrycode = res.ResponseObject;
          // console.log("country", this.countrycode);
        }
      } else {
        //   this.OwnDetailsForm.controls['parentaccount'].setValue('');
        //  this.parentaccount = [];
        //  this.parentaccount['message'] = 'No record found';
      }
    }, error => {
      // this.isActivityGroupSearchLoading = false;
      // this.parentaccount = [];
      // this.parentaccount['message'] = 'No record found';
    });
    // }
  }

  appendparent(item) {

    // console.log("effefeefefe", item)
    this.countryvalue = item.Desc;
    this.countryname = item.Value;

    // this.countryvalue = item.Value;
    // this.parentNameId = item.SysGuid;
    // this.prospectAccForm.controls['parentaccount'].setValue(item.Name);
    //  this.accountCreationObj['parentaccount'] = item.SysGuid || '';
    //this.selectedparent.push(this.wiproparent[i])
  }
  dnbaccountlist(id) {
    // console.log("Duns", id)
    this.dialogRef.close(id);
    const dnbdetails = this.master3Api.DNBDetailsByDunsId(id);
    dnbdetails.subscribe((res: any) => {
      // console.log("dnb account details ", res.ResponseObject);
      // ;
    });
    this.dialogRef.close(id);
  }
  getaccountInDNB() {
    this.accounts = [];
    let i;
    //   this.isActivityGroupSearchLoading = true
    // this.dialogRef.close("118336031") // it should be removed 
    // this.openDbList = true;
    // let i;
    if (this.countrycode !== undefined) {
      i = this.countrycode.findIndex(x => x.Desc === this.countryvalue);
    }



    if (i >= 0 && this.accountname !== undefined && this.countrycode !== undefined && this.accountname !== '' && this.countrycode !== '') {
      this.isActivityGroupSearchLoading = true;
      const obj = {
        'CustomerAccount': {
          'Name': this.accountname,
          'Address': {
            'CountryCode': this.countryname,
            'ZipCode': this.pincode,
          }
        }
      };

      // console.log("request object", obj)

      const getaccounts = this.master3Api.SearchAccountInDNB(obj);
      getaccounts.subscribe((res: any) => {
        if (!res.IsError && res.ResponseObject) {
          this.isActivityGroupSearchLoading = false;
          // console.log("dnbaccounts response ", res.ResponseObject)
          if (res.ResponseObject.length === 0) {
            this.accounts = [];
            this.displayData = "No results found in D&B. You can opt to create a ‘Custom Account’."
          } else {
            this.accounts = res.ResponseObject;
          }
        } else if (res.IsError) {
          this.isActivityGroupSearchLoading = false
          console.log(" add error response ", res)
          if (res['Message'] == "No Match found for the given input criteria") {
            this.displayData = "No results found in D&B. You can opt to create a ‘Custom Account’."
          } else {
            this.snackBar.open(res['Message'], '', {
              duration: 3000
            });
          }

        }
      });
    } else {
      this.countryvaluerequried = true;
      this.accountvaluerequried = true;
      if (i < 0) {
        this.countryvalue = '';
      }


    }

  }
  resetall() {
    this.accountname = '',
      this.countryvalue = '',
      this.pincode = '';
    this.accounts = [];

  }

  appendName(value: any) {
    console.log(value);

    if (value.Type && (value.Type.Id === 3 || value.Type.Id === 12)) {
      this.dialogRef.close();
      const dialogRef1 = this.dialog.open(ExistingAccountPopupComponent,
        {
          width: '380px',
          data: { data: value }
        });
    } else if (value.Type && value.Type.Id === 1) {
      this.dialogRef.close();
      const dialogRef2 = this.dialog.open(ExistingReservePopupComponent,
        {
          width: '380px',
          data: { data: value.SysGuid }
        });
    } else if (value.Type && value.Type.Id === 2){
      this.prospectsysguid = value.SysGuid
      this.accountListService.sendProspectGuid(this.prospectsysguid)
      this.dialogRef.close()
      this.router.navigate(['accounts/accountcreation/createprospectaccount'])

    } else {
      this.companyName = value.Name;
      console.log(this.companyDetails);
      this.dialogRef.close(value);
    }
  }
  // onAccountSearchInput(e)
  // {
  //   // alert(e);
  //   if(e.target.value.lengt<0)
  //   {
  //     this.onAccountSearch(e);
  //   }
  // }

  onAccountSearch(event) {
    // debugger
    const payload = {
      'SearchText': this.companyName ? this.companyName : '',
      PageSize: 10,
      OdatanextLink: '',
      RequestedPageNumber: 1
    };
    // if (!this.companyName) {
    //   this.firstTenRecord = true;
    // } else {
    //   this.firstTenRecord = false;
    // }
    let accountSearch;
    this.companyDetails = [];
    this.isActivityGroupSearchLoading = true;
    if (this.openDnB)
      accountSearch = this.accountListService.SearchAccountAndProspect(payload);
    else
      accountSearch = this.accountListService.existAccountSearch(payload);
    accountSearch.subscribe((res) => {
      this.isActivityGroupSearchLoading = false;
      if (!res.IsError && res.ResponseObject) {
        // if (this.firstTenRecord) {
        //   this.companyDetails = this.getTenRecords(res.ResponseObject);
        // } else {
        //   this.companyDetails = res.ResponseObject;
        // }    

        if (res.ResponseObject.length === 0) {
          this.companyDetails['message'] = 'No Results found';
        } else {
          if (event.target.value === '') {
            this.companyDetails = this.getTenRecords(res.ResponseObject);
          } else {
            this.companyDetails = res.ResponseObject;
          }

        }
      } else {
        this.companyDetails = [];
        this.companyDetails['message'] = 'No Results found';
      }

    }, error => {
      this.isActivityGroupSearchLoading = false;
      this.companyDetails = [];
      this.companyDetails['message'] = 'No Results found';
    });
  }
  getTenRecords(res) {
    // const resdata = res.slice(0, 9);
    return res;
  }
  getdecodevalue(data)
  {
    return this.accountListService.getSymbol(data);
  }
}
