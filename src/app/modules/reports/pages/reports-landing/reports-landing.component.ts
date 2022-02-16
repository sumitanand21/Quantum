import { DataCommunicationService } from '@app/core';
import { Component, OnInit, HostListener } from '@angular/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { MatSnackBar } from '@angular/material';
import { AccountListService } from '@app/core/services/accountList.service';

@Component({
  selector: 'app-reports-landing',
  templateUrl: './reports-landing.component.html',
  styleUrls: ['./reports-landing.component.scss']
})
export class ReportsLandingComponent implements OnInit {
  reportsDetails = [];
  searchItem: String;
  expand = false;
  accSysId;
  accountName;
  //link = "https://app.powerbi.com/groups/1610cb7b-a5d4-45c4-bd37-a3bb13a04835/rdlreports/478e31dd-0a0a-4b9b-b17e-90fecdcc0754";
  
  constructor(private snackBar: MatSnackBar, private EncrDecr: EncrDecrService, public service: DataCommunicationService, public accountListServ: AccountListService) {

  }
  @HostListener("window:scroll", ['$event'])
  onScroll(event): void {
    // debugger
    event.preventDefault();
    event.stopPropagation();
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight) {
      // console.log(this.config.currentPage);
    
     console.log("load more")
     
      //   this.detectActionValue.emit({ objectRowData: this.userdat.serviceSearchItem, action: 'pagination',pageData:this.config });

    }

  }
  ngOnInit() {
    //this.accSysId = (localStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';
    //this.accountName = this.accountListServ.getSymbol(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountName'), 'DecryptionDecrip'));
    
    this.getListOfReports(this.reportsDetails);

  }
  getListOfReports(reqBody) {
    
    const reqBodydata = {
      "SearchText": "",
      "IsDesc": false,
      "IsFilterApplied": false
    }
    // const reqbody = {
    //   'Guid': this.accSysId,
    //   'PageSize': 10,
    //   'RequestedPageNumber': 1,
    //   'OdatanextLink': ''
    // };this.reportsDetails = res.ResponseObject;
    this.accountListServ.getReportUrls(reqBodydata).subscribe((res: any) => {
      console.log('reprot urls : ---->>>' , res.ResponseObject);
      
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          this.reportsDetails = [];
          this.reportsDetails = res.ResponseObject;
        } else {
          this.reportsDetails = [{}];
        }
      } else {
        this.reportsDetails = [{}];
      }
      
    });
    
  }
  inputClick(data) {
    console.log('Key press event')
    this.expand = true;
    const reqbody = {
      "SearchText": data ? data :"",
      "IsDesc": false,
      "IsFilterApplied":false
  }
    this.accountListServ.getReportUrls(reqbody).subscribe((res: any) => {
      console.log('reprot urls : ---->>>' + res.ResponseObject);
      this.reportsDetails = res.ResponseObject;
    });
  }
  OutsideInput() {
    this.expand = false;
  }
  navtoReport(link){
    //window.location.href=link;
    window.open(link, '_blank');
  }

  close() {
    this.expand = false;
    this.searchItem = '';
    this.getListOfReports(this.reportsDetails);
  }
}
