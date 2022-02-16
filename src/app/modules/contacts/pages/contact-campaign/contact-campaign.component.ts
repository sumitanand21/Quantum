import { Component, OnInit } from '@angular/core';
import { Observable, from } from 'rxjs';
import { pluck } from 'rxjs/operators';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { contactcampaign, ContactcampaignService, ContactService, ErrorMessage } from '@app/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { DatePipe } from '@angular/common';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getContactDetailsById } from '@app/core/state/selectors/contact-list.selector';

@Component({
  selector: 'app-contact-campaign',
  templateUrl: './contact-campaign.component.html',
  styleUrls: ['./contact-campaign.component.scss']
})
export class ContactCampaignComponent implements OnInit {
  contactCampaignTable = [];
  ActiveCampaignRequestbody = {
    "PageSize": 50,
    "RequestedPageNumber":  1,
    "OdatanextLink": "",
    "FilterData":  [],
    "Guid": "",
  }
  filterConfigData = {
    Name: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    campaign: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    owner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    startdate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    enddate: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    status: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    isFilterLoading: false
  };

  SingleContactname: any;
  isLoading: boolean = false;
  userguid: any;
  ContactEditID: any;
  tableTotalCount: number;
  imageSrc1: string;

  constructor(private router: Router,
    public userdat: DataCommunicationService,
    public dialog: MatDialog,
    private contactcampaign: ContactcampaignService,
    private contactService: ContactService,
    private datepipe: DatePipe,
    private EncrDecr: EncrDecrService,
    public errorMessage: ErrorMessage,
    public matSnackBar: MatSnackBar,
    public store: Store<AppState>,
  ) {
    this.ActiveCampaignRequestbody.RequestedPageNumber = 0
  }

  ngOnInit(): void {
    this.userguid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    console.log("user guid", this.userguid);
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    this.ActiveCampaignRequestbody.RequestedPageNumber++
    this.getActiveCampaignData(this.ActiveCampaignRequestbody, true);
    let contactId = JSON.parse(localStorage.getItem('contactEditId'))
    this.store.pipe(select(getContactDetailsById(contactId))).subscribe(res => {
      console.log("got response from selector details")
      console.log(res)
      this.isLoading = false;
      if (res) {
        this.SingleContactname = res.FName + ' ' + res.LName
      }
    });
    this.contactService.getContactdetails(this.ContactEditID).subscribe(res => {
      if (res.IsError == false) {
        console.log('Details-->', res)
        if (res.ResponseObject.ProfileImage) {
          this.imageSrc1 = (res.ResponseObject.ProfileImage)
        } else {
          this.imageSrc1 = null
        }
      } else {
        this.errorMessage.throwError(res.Message);
      }
    });
  }

  getActiveCampaignData(reqBody, isConcat) {
    this.isLoading = true;
    let useFulldata = {
      pageNo: this.ActiveCampaignRequestbody.RequestedPageNumber,
      CampaignType: 4,
      contactParentId: this.ContactEditID,
      pageSize: this.ActiveCampaignRequestbody.PageSize,
    }
    let reqparam = this.contactcampaign.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
    this.contactcampaign.getFilterList(reqparam).subscribe(resData => {
      if (!resData.IsError) {
        this.isLoading = false;
        console.log("contact active campaign list", resData.ResponseObject);
        if (resData.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({}, resData)
          const perPage = reqBody.PageSize;
          const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          console.log(start + " - " + end);
          resData.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          this.ActiveCampaignRequestbody = reqBody;
          if (resData.OdatanextLink) {
            this.ActiveCampaignRequestbody.OdatanextLink = resData.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.contactCampaignTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.contactCampaignTable.splice(this.contactCampaignTable.indexOf(res), 1);
            })
            this.contactCampaignTable = this.contactCampaignTable.concat(this.getTableFilterData(resData.ResponseObject))
            console.log("contact Campaign Table", this.contactCampaignTable);
          } else {
            this.contactCampaignTable = this.getTableFilterData(resData.ResponseObject)
            console.log("contact Campaign Table", this.contactCampaignTable);
          }
          this.tableTotalCount = resData.TotalRecordCount
          console.log("table Total Count", this.tableTotalCount);
        } else {
          this.tableTotalCount = 0
          this.contactCampaignTable = [{}]
        }
      } else {
        this.isLoading = false;
        this.OnError(resData.Message);
        if (reqBody.RequestedPageNumber > 1)
          this.ActiveCampaignRequestbody.RequestedPageNumber = this.ActiveCampaignRequestbody.RequestedPageNumber - 1
      }
    },
      error => {
        this.isLoading = false;
      });
  }

  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        console.log("contacts table data", tableData);
        return tableData.map(activeCampaign => {
          return {
            Name: (activeCampaign.Name !== undefined) ? activeCampaign.Name : "NA",
            campaign: activeCampaign.Code ,
            owner: (activeCampaign.Owner.FullName !== undefined) ? activeCampaign.Owner.FullName : "NA",
            status: (activeCampaign.CampaignStatus !== undefined) ? activeCampaign.CampaignStatus : "NA",
            startdate: (activeCampaign.StartDate !== undefined) ? this.datepipe.transform(activeCampaign.StartDate, 'd-MMM-y') : "NA",
            enddate: (activeCampaign.EndDate !== undefined) ? this.datepipe.transform(activeCampaign.EndDate, 'd-MMM-y') : "NA",
            index: activeCampaign.index,
            id: activeCampaign.Id,
          };
        });
      } else {
        return []
      }
    } else {
      return []
    }
  }

  performTableChildAction(childActionRecieved): Observable<any> {
    console.log('childActionReceived---->', childActionRecieved)
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'search': {
        this.ActiveCampaignRequestbody.RequestedPageNumber = 0
        this.SearchTable(actionRequired);
        return;
      }
      case 'tabNavigation':
        {
          this.TabNavigation(childActionRecieved.objectRowData[0])
          return
        }
      case 'Name':
        {
          console.log("campaign nevigation", childActionRecieved.objectRowData[0])
          if (JSON.parse(sessionStorage.getItem('RequestCampaign'))) {
            let reqCamp = JSON.parse(sessionStorage.getItem("RequestCampaign"))
            sessionStorage.setItem('RequestCampaign', JSON.stringify({ 
              ...reqCamp,
               Id: childActionRecieved['objectRowData'][0]['id'],
                isAccountPopulate: false,
                isCampaignEdit:true,
                isCompletedCampaign:false,
                navigation: 'contacts/contactcampaign'}));
          } else {
            sessionStorage.setItem('RequestCampaign', JSON.stringify({ 
              Id: childActionRecieved['objectRowData'][0]['id'],
               isAccountPopulate: false,
               isCampaignEdit:true,
               isCompletedCampaign:false,
               navigation : 'contacts/contactcampaign'}));
          }
          sessionStorage.removeItem('campaignCacheData');
          this.router.navigateByUrl('/campaign/RequestCampaign');
          return
        }
        case "columnFilter": {
          this.GetColumnFilters(childActionRecieved);
          break
        }
        case "columnSearchFilter": {
          this.GetColumnSearchFilters(childActionRecieved);
          break
        }
        case 'loadMoreFilterData': {
          this.LoadMoreColumnFilter(childActionRecieved);
          break
        }
        case 'ClearAllFilter': {
          this.clearallFilter();
          return;
        }
        case 'sortHeaderBy': {
          this.ActiveCampaignRequestbody.OdatanextLink = ''
          this.ActiveCampaignRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(childActionRecieved);
          break
        }
    }
  }

  clearallFilter(){
    this.ActiveCampaignRequestbody = {
      "PageSize":this.ActiveCampaignRequestbody.PageSize,
      "RequestedPageNumber":  1,
      "OdatanextLink": "",
      "FilterData":  [],
      "Guid": "",
    }
    this.getActiveCampaignData(this.ActiveCampaignRequestbody, false)
  }

  SearchTable(data): void {
    console.log('contact search data', data)
    this.ActiveCampaignRequestbody.RequestedPageNumber = 1
    this.ActiveCampaignRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        this.isLoading = true
        let useFulldata = {
          pageNo : this.ActiveCampaignRequestbody.RequestedPageNumber,
          CampaignType: 4,
          contactParentId: this.ContactEditID,
          pageSize: this.ActiveCampaignRequestbody.PageSize
        }
        let reqparam = this.contactcampaign.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
        this.contactcampaign.getFilterList(reqparam).subscribe(res => {
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.contactCampaignTable = this.getTableFilterData(res.ResponseObject)
              this.ActiveCampaignRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            }
            else {
              this.contactCampaignTable = [{}]
              this.tableTotalCount = 0
            }
          } else {
            this.errorMessage.throwError(res.Message);
          }
        })
      } else {
        this.getActiveCampaignData(this.ActiveCampaignRequestbody, true);
      }
    } else{
      this.isLoading = false
    }
  }

  //------------Filter implementation start --------------
  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1
        this.filterConfigData[headerName].NextLink = ''
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName,this.filterConfigData))
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.ActiveCampaignRequestbody.OdatanextLink = ''
          this.ActiveCampaignRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.ActiveCampaignRequestbody.OdatanextLink = ''
          this.ActiveCampaignRequestbody.RequestedPageNumber = 1
          this.getActiveCampaignData(this.ActiveCampaignRequestbody, false);
        }
      }
    }
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        CampaignType:4,
        contactParentId: this.ContactEditID,
      }
      this.contactcampaign.getFilterCampaignSwitchListData({ ...data, useFulldata: useFulldata, Guid: this.userguid }).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        if (res.IsError) {
          this.errorMessage.throwError(res.Message);
        }
        if (headerName === 'status') {
          this.contactcampaign.statusFilter({ ...data, res: res, headerName: headerName, filterConfigData: this.filterConfigData })
        } else {
          if (!res.IsError) { 
            this.filterConfigData[headerName] = {
              data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
              recordCount: res.TotalRecordCount,
              NextLink: res.OdatanextLink,
              PageNo: res.CurrentPageNumber
            }
            if (data.filterData.headerName !== 'startDate' || data.filterData.headerName !== 'endDate') {
            
              data.filterData.filterColumn[headerName].forEach((res, i) => {
                let index = this.filterConfigData[headerName].data.findIndex(x => x.id == res.id)
                if (index !== -1) {
                  this.filterConfigData[headerName].data[index].isDatafiltered = true
                }
              });
            }
          } else {
            if (this.filterConfigData[headerName].PageNo > 1) {
              this.filterConfigData[headerName].PageNo = Number(this.filterConfigData[headerName].PageNo) - 1;
            }
            this.errorMessage.throwError(res.Message)
          }
        }
      },error =>{
        if (this.filterConfigData[headerName].PageNo > 1) {
          this.filterConfigData[headerName].PageNo = Number(this.filterConfigData[headerName].PageNo) - 1;
        }
      })
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]["data"] = this.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName])
      }
    }
  }

  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
  }

  LoadMoreColumnFilter(data) {
    let headerName = data.filterData.headerName
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    this.generateFilterConfigData(data, headerName, true, true)
  }

  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.ActiveCampaignRequestbody.OdatanextLink = ''
    this.filterConfigData[headerName].PageNo = 1
    this.filterConfigData[headerName].NextLink = ''
    this.generateFilterConfigData(data, headerName, false, true)
  }

  CheckFilterServiceFlag(data, headerName,filterConfigData): boolean {
    if (data) {
      if (data.action != "columnFilter" && data.filterData.isApplyFilter) {
        return false
      } else if (data.action == "columnFilter" && data.filterData.columnSerachKey == '' && filterConfigData[headerName]["data"].length <= 0) {
        return true
      } else if (data.action == "columnFilter" && data.filterData.columnSerachKey != '' && !data.filterData.isApplyFilter) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  CallListDataWithFilters(data) {

    let useFulldata ={
      pageNo: this.ActiveCampaignRequestbody.RequestedPageNumber,
      CampaignType:4,
      contactParentId: this.ContactEditID,
      pageSize: 50
    }

    let reqparam = this.contactcampaign.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
    this.contactcampaign.getFilterList(reqparam).subscribe(res => {
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
          this.contactCampaignTable = this.getTableFilterData(res.ResponseObject)
          this.ActiveCampaignRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.contactCampaignTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.contactCampaignTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    })
  }







  TabNavigation(item) {
    switch (item.index) {
      case 0:
        this.router.navigate(['/contacts/contactcampaign']);
        return
      case 1:
        this.router.navigate(['/contacts/contactcompletecampaign']);
        return
        case 2:
          this.router.navigate(['/contacts/contactallcampaign']);
          return
    }
  }

  OnError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 4000
    });
  }


  opendelete() {
    const dialogRef = this.dialog.open(deletepopComponentcamp,
      {
        width: '396px',
      });
  }
}

@Component({
  selector: 'delete-pop',
  templateUrl: './delete-pop.html',
})
export class deletepopComponentcamp {

  constructor(public service: DataCommunicationService) { }

}
