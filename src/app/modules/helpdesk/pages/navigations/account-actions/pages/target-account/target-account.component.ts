import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { AccountService } from '@app/core/services/account.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountListService } from '@app/core/services/accountList.service';

@Component({
  selector: 'app-target-account',
  templateUrl: './target-account.component.html',
  styleUrls: ['./target-account.component.scss']
})
export class TargetAccountComponent implements OnInit {

  targetAccountTableData = [];
  tableTotalCount = 0;
  subscription: Subscription;
  sourceData:any;
  paginationPageNo = {
    "PageSize": 8,
    "RequestedPageNumber": 1,
    "OdatanextLink": ""
  }
  targetAccountTableRequest =
  {
    "SearchText":"",
    "PageSize":50,
    "RequestedPageNumber":1,
    "Guid":"",  //Vertical Guid
    "SourceAccount":[],  //Selected Source accounts
    "OdatanextLink":" "
  }
  isLoading:boolean = false;
  ownerSysGuid: string = "";
  constructor(public errorMessage: ErrorMessage, public service: AccountService, public dataService: DataCommunicationService, public router : Router, public accountListService: AccountListService) {
  }

  ngOnInit() {
    // this.subscription = this.accountListService.targetAccData.subscribe((res) => {
      // this.sourceData = res;
      // this.ownerSysGuid = (this.sourceData && this.sourceData.vertical)?this.sourceData.vertical.Id: "";
      // this.targetAccountTableRequest.Guid = this.ownerSysGuid;
      // console.log("subject res", this.sourceData)
      // if(this.sourceData && this.sourceData.checkedData){
      //   console.log(this.sourceData);      
      //   this.targetAccountTableRequest.SourceAccount = this.sourceData.checkedData; 
        // this.sourceData.checkedData.map((res) => this.targetAccountTableRequest.SourceAccount.push(res.SysGuid)); 
        // this.GetAllTargetAccTableData(this.targetAccountTableRequest, true);             
      // }
    // });  
    let reqSysGuid = localStorage.getItem("accSysGuid");
    this.reqDetails(reqSysGuid)
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
    
  }
  reqDetails(reqSysGuid) {
    if (reqSysGuid) {
      let payload = { SysGuid: reqSysGuid }
      this.accountListService.getMergeDetails(payload).subscribe(async (details) => {
        if (!details.IsError && details.ResponseObject) {
          this.sourceData = details.ResponseObject;
          this.ownerSysGuid = (this.sourceData && this.sourceData.Vertical)?this.sourceData.Vertical.Id: ""; 
          this.targetAccountTableRequest.Guid = this.ownerSysGuid;
          if(this.sourceData.TargetAccount){
            localStorage.setItem("mergeDataSave", JSON.stringify({targetId: this.sourceData.TargetAccount.SysGuid}));
          }
          if(this.sourceData.SourceAccounts){
            console.log(this.sourceData);      
            // this.targetAccountTableRequest.SourceAccount = this.sourceData.SourceAccounts;
            this.sourceData.SourceAccounts.map((res) => this.targetAccountTableRequest.SourceAccount.push(res.SysGuid)); 
            this.GetAllTargetAccTableData(this.targetAccountTableRequest, true);             
          }         
        }
      })
    } else {
      console.log("SysGuid not available");
    }
  }
  TablePagination(data) {
    this.targetAccountTableRequest.RequestedPageNumber = this.targetAccountTableRequest.RequestedPageNumber + 1;
    this.GetAllTargetAccTableData(this.targetAccountTableRequest, true);
  }

  getNewTableData(event) {
    if (event.action === 'pagination') {
      this.targetAccountTableRequest.PageSize = event.itemsPerPage;
      this.targetAccountTableRequest.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event, true);
      // this.GetAllTargetAccTableData(this.targetAccountTableRequest, true);
    } else if (event.action === 'search') {
      this.targetAccountTableRequest = {
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': '',
        "SearchText": "",
        Guid: this.ownerSysGuid,
        "SourceAccount":this.targetAccountTableRequest.SourceAccount
      };
    }
  }
  GetAllTargetAccTableData(reqBody, isConcat): void {
    this.isLoading = true;
    this.accountListService.targetMergeDetails(reqBody)
      .subscribe(async (targetAccList) => {

        if (!targetAccList.IsError) {
          this.isLoading = false;
          if (targetAccList.ResponseObject.length > 0) {
            this.targetAccountTableData = [];
            const ImmutableObject = Object.assign({}, targetAccList);
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // console.log(start + " - " + end);
            targetAccList.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });
            if (targetAccList.OdatanextLink) {
              this.targetAccountTableRequest.OdatanextLink = targetAccList.OdatanextLink;
            }
            this.targetAccountTableRequest = reqBody;
            // await this.offlineServices.ClearActiveCampaignIndexTableData()
            this.targetAccountTableRequest.OdatanextLink = targetAccList.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.targetAccountTableData.map((res: any) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.targetAccountTableData.splice(this.targetAccountTableData.indexOf(res), 1);
              });
              this.targetAccountTableData = this.targetAccountTableData.concat(this.getTableFilterData(targetAccList.ResponseObject));
              console.log("this.targetAccountTableData 125", this.targetAccountTableData)
            } else {
              this.targetAccountTableData = this.getTableFilterData(targetAccList.ResponseObject);
              console.log("this.targetAccountTableData 128", this.targetAccountTableData)
            }
            if(this.sourceData.TargetAccount){
              this.targetAccountTableData.map((res1, ind)=>{
                if(this.sourceData.TargetAccount.SysGuid == res1.SysGuid){
                  this.targetAccountTableData[ind].isCheccked = true;
                  console.log(this.targetAccountTableData, "149");
                } 
              })
            }
            ImmutableObject.ResponseObject.map(x => x.id = x.Id);
             this.tableTotalCount = targetAccList.TotalRecordCount;           
          } else {
            this.isLoading = false;
            this.targetAccountTableData = [{}];
          }

        } else {
          this.isLoading = false;
          this.targetAccountTableData = [{}];
          if (reqBody.RequestedPageNumber > 1)
            this.targetAccountTableRequest.RequestedPageNumber = this.targetAccountTableRequest.RequestedPageNumber - 1;
        }
      },
      error => {
        this.isLoading = false;
      });
  }
  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((targetAccData => {
          return {
            index: targetAccData.index,
            Accountnumber: targetAccData.Number || '',
            Accountname: this.getSymbol(targetAccData.Name) || '',
            AccountOwner: (targetAccData.Owner && targetAccData.Owner.FullName) ? targetAccData.Owner.FullName : '',
            Region: (targetAccData.Region && targetAccData.Region.Name) ? targetAccData.Region.Name : '',
            Accountclassification: (targetAccData.Classification && targetAccData.Classification.Value) ? targetAccData.Classification.Value : '',
            Hassubaccounts: targetAccData.HasSubAccounts ? "Yes" : "No",//(targetAccData.Status && targetAccData.Status.Value) ? targetAccData.Status.Value : '',
            SysGuid: targetAccData.SysGuid,
            isCheccked: false
          };
        }));
      } else {
        return [{}];
      }
    } else {
      return [{}];
    }
  }

  performTableChildAction(childActionRecieved) {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount
    }
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'DeleteCal': {
        // this.dialog.open(DeleteMergePop, {
        //   width: '250px',
        //   data: {name: this.name, animal: this.animal}
        // });
        break;
      }
      case "Accountnumber": {
        localStorage.setItem("mergeDataSave", JSON.stringify({targetId: actionRequired.objectRowData[0].SysGuid}));
        if(this.ownerSysGuid)
        localStorage.setItem("verticalDataId", JSON.stringify(this.ownerSysGuid));
        break;
      }
      case 'sortHeaderBy': {
        this.targetAccountTableRequest.OdatanextLink = '';
        this.targetAccountTableRequest.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
      case 'search': {
        this.targetAccountTableRequest.OdatanextLink = '';
        this.targetAccountTableRequest.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        // this.SearchTable(childActionRecieved);
        return;
      }
    }
  }
  GetAppliedFilterData(data, IsFilterAPI) {
    return {
      "SourceAccount":this.targetAccountTableRequest.SourceAccount ? this.targetAccountTableRequest.SourceAccount: [],
      'Guid' : this.targetAccountTableRequest.Guid ? this.targetAccountTableRequest.Guid : '' ,
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.targetAccountTableRequest.PageSize : 10,
      'RequestedPageNumber': this.targetAccountTableRequest.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      };
  }
  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'Accountname':
        return 123;
      case 'Accountnumber':
        return 7;
      case 'Accountclassification':
        return 2;
      case 'Region':
        return 38;
      case 'AccountOwner':
        return 4;
      default:
        return '';
    }
  }
  CallListDataWithFilters(data, isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountListService.getFilterList(reqparam, false, 'targetAccMergeDetails').subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res);
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(resp => {
            if (!resp.index) {
              resp.index = i;
              i = i + 1;
            }
          });
          if (isConcat) {
            if (reqparam.RequestedPageNumber == 1) {
              this.targetAccountTableData = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.targetAccountTableData = [...this.targetAccountTableData, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.targetAccountTableData = this.getTableFilterData(res.ResponseObject);
          }
          // this.targetAccountTableData = this.getTableFilterData(res.ResponseObject);
          this.targetAccountTableRequest.OdatanextLink = res.OdatanextLink;
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.targetAccountTableData = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.targetAccountTableData = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }
  getSymbol(data) {
    // console.log(data)
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }
}
