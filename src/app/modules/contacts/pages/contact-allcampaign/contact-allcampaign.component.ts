import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { ContactcampaignService, ContactService, ErrorMessage } from '@app/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { DatePipe } from '@angular/common';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { Observable } from 'rxjs';
import { getContactDetailsById } from '@app/core/state/selectors/contact-list.selector';

@Component({
  selector: 'app-contact-allcampaign',
  templateUrl: './contact-allcampaign.component.html',
  styleUrls: ['./contact-allcampaign.component.scss']
})
export class ContactAllcampaignComponent implements OnInit {

  contactAllCampaignTable = [];
  AllCampaignRequestbody = {
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
    this.AllCampaignRequestbody.RequestedPageNumber = 0
  }

  ngOnInit() {
    this.userguid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    console.log("user guid", this.userguid);
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    this.AllCampaignRequestbody.RequestedPageNumber++
    this.getAllCampaignData(this.AllCampaignRequestbody, true);
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

  performTableChildAction(childActionRecieved): Observable<any> {
    console.log('childActionReceived---->', childActionRecieved)
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'search': {
        this.AllCampaignRequestbody.RequestedPageNumber = 0
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
          console.log("campaign nevigation", childActionRecieved)
          if (JSON.parse(sessionStorage.getItem('RequestCampaign'))) {
            let reqCamp = JSON.parse(sessionStorage.getItem("RequestCampaign"))
            sessionStorage.setItem('RequestCampaign', JSON.stringify({ 
              ...reqCamp,
               Id: childActionRecieved['objectRowData'][0]['id'],
                isAccountPopulate: false,
                isCampaignEdit:true,
                isCompletedCampaign:false,
                navigation: 'contacts/contactallcampaign'}));
          } else {
            sessionStorage.setItem('RequestCampaign', JSON.stringify({ 
              Id: childActionRecieved['objectRowData'][0]['id'],
               isAccountPopulate: false,
               isCampaignEdit:true,
               isCompletedCampaign:false,
               navigation : 'contacts/contactallcampaign'}));
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
          this.AllCampaignRequestbody.OdatanextLink = ''
          this.AllCampaignRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(childActionRecieved);
          break
        }
       
    }
  }

  clearallFilter() {
    this.AllCampaignRequestbody = {
      "PageSize":this.AllCampaignRequestbody.PageSize,
      "RequestedPageNumber":  1,
      "OdatanextLink": "",
      "FilterData":  [],
      "Guid": "",
    }
    this.getAllCampaignData(this.AllCampaignRequestbody, false, )
  }

  getAllCampaignData(reqBody, isConcat) {
    this.isLoading = true;
    let useFulldata = {
      pageNo: this.AllCampaignRequestbody.RequestedPageNumber,
      CampaignType: 2,
      contactParentId: this.ContactEditID,
      pageSize: this.AllCampaignRequestbody.PageSize,
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
          this.AllCampaignRequestbody = reqBody;
          if (resData.OdatanextLink) {
            this.AllCampaignRequestbody.OdatanextLink = resData.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.contactAllCampaignTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.contactAllCampaignTable.splice(this.contactAllCampaignTable.indexOf(res), 1);
            })
            this.contactAllCampaignTable = this.contactAllCampaignTable.concat(this.getTableFilterData(resData.ResponseObject))
            console.log("contact Campaign Table", this.contactAllCampaignTable);
          } else {
            this.contactAllCampaignTable = this.getTableFilterData(resData.ResponseObject)
            console.log("contact Campaign Table", this.contactAllCampaignTable);
          }
          this.tableTotalCount = resData.TotalRecordCount
          console.log("table Total Count", this.tableTotalCount);

        } else {
          this.tableTotalCount = 0
          this.contactAllCampaignTable = [{}]
        }
      } else {
        this.isLoading = false;
        this.OnError(resData.Message);
        if (reqBody.RequestedPageNumber > 1)
          this.AllCampaignRequestbody.RequestedPageNumber = this.AllCampaignRequestbody.RequestedPageNumber - 1
      }
    },
      error => {
        this.isLoading = false;
      });
  }

  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        console.log("contacts All campaign data", tableData);
        return tableData.map(allCampaign => {
          return {
            Name: (allCampaign.Name !== undefined) ? allCampaign.Name : "NA",
            campaign: allCampaign.Code ,
            owner: (allCampaign.Owner.FullName !== undefined) ? allCampaign.Owner.FullName : "NA",
            status: (allCampaign.CampaignStatus !== undefined) ? allCampaign.CampaignStatus : "NA",
            startdate: (allCampaign.StartDate !== undefined) ? this.datepipe.transform(allCampaign.StartDate, 'd-MMM-y') : "NA",
            enddate: (allCampaign.EndDate !== undefined) ? this.datepipe.transform(allCampaign.EndDate, 'd-MMM-y') : "NA",
            index: allCampaign.index,
            id: allCampaign.Id,
          };
        });
      } else {
        return []
      }
    } else {
      return []
    }
  }

  SearchTable(data): void {
    console.log('contact search data', data)
    this.AllCampaignRequestbody.RequestedPageNumber = 1
    this.AllCampaignRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
        let useFulldata = {
          pageNo : this.AllCampaignRequestbody.RequestedPageNumber,
          CampaignType: 2,
          contactParentId: this.ContactEditID,
          pageSize: this.AllCampaignRequestbody.PageSize
        }
        let reqparam = this.contactcampaign.GetAppliedFilterData({ ...data, useFulldata: useFulldata })
        this.contactcampaign.getFilterList(reqparam).subscribe(res => {
          debugger
          if (!res.IsError) {
            if (res.ResponseObject.length > 0) {
              let i = 1;
              res.ResponseObject.map(res => {
                res.index = i;
                i = i + 1;
              })
              this.contactAllCampaignTable = this.getTableFilterData(res.ResponseObject)
              this.AllCampaignRequestbody.OdatanextLink = res.OdatanextLink
              this.tableTotalCount = res.TotalRecordCount
            }
            else {
              this.contactAllCampaignTable = [{}]
              this.tableTotalCount = 0
            }
          } else {
            this.errorMessage.throwError(res.Message);
          }
        })
      } else {
        this.getAllCampaignData(this.AllCampaignRequestbody, false);
      }
    }else{
      this.isLoading = false
    }
  }

   //------------Filter implementation start --------------
   GetColumnFilters(data) {
    debugger
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].data = [];
        this.filterConfigData[headerName].PageNo = 1
        this.filterConfigData[headerName].NextLink = ''
        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName,this.filterConfigData))
      } else {
        if (data.filterData.isApplyFilter && this.userdat.CheckFilterFlag(data)) {
          this.AllCampaignRequestbody.OdatanextLink = ''
          this.AllCampaignRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.AllCampaignRequestbody.OdatanextLink = ''
          this.AllCampaignRequestbody.RequestedPageNumber = 1
          this.getAllCampaignData(this.AllCampaignRequestbody, false);
        }
      }
    }
  }

  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    debugger
    if (isServiceCall) {
      let useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        CampaignType:2,
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
    this.AllCampaignRequestbody.OdatanextLink = ''
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
      pageNo: this.AllCampaignRequestbody.RequestedPageNumber,
      CampaignType:2,
      contactParentId: this.ContactEditID,
      pageSize: 50,

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
          this.contactAllCampaignTable = this.getTableFilterData(res.ResponseObject)
          this.AllCampaignRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.contactAllCampaignTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.contactAllCampaignTable = [{}];
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



}
