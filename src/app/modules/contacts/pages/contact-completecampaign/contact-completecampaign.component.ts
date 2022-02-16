import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Router} from '@angular/router';
import { MatDialog, MatSnackBar } from '@angular/material';
import { contactcompletecampaignService, ContactService, ErrorMessage, ContactcampaignService } from '@app/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { DatePipe } from '@angular/common';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { Store, select } from '@ngrx/store';
import { AppState } from '@app/core/state';
import { getContactDetailsById } from '@app/core/state/selectors/contact-list.selector';

@Component({
  selector: 'app-contact-completecampaign',
  templateUrl: './contact-completecampaign.component.html',
  styleUrls: ['./contact-completecampaign.component.scss']
})
export class ContactCompletecampaignComponent implements OnInit {
   CompletedCampaignRequestbody = {
    // "PageSize": 10,
    // "RequestedPageNumber": 0,
    // "OdatanextLink": ""
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

  contactcompletecampaignTable = [];
  SingleContactname:any;
  isLoading: boolean = false;
  userguid:any;
  ContactEditID:any;
  tableTotalCount: number;
  imageSrc1: string;
  constructor(private router: Router,
     public userdat: DataCommunicationService, 
     public dialog: MatDialog, 
     private contactcompletecampaign: contactcompletecampaignService,
     private contactService: ContactService,
     private datepipe: DatePipe, 
     private EncrDecr: EncrDecrService,
     public errorMessage: ErrorMessage,
     public matSnackBar: MatSnackBar,
     public store: Store<AppState>,
     private contactcampaign: ContactcampaignService,
     ) { 
      this.CompletedCampaignRequestbody.RequestedPageNumber = 0
     }
 
  ngOnInit(): void {
    this.userguid = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    console.log("user guid",this.userguid);
    this.ContactEditID = JSON.parse(localStorage.getItem("contactEditId"));
    this.CompletedCampaignRequestbody.RequestedPageNumber++
    this.getCompletedCampaignData(this.CompletedCampaignRequestbody, true);
    let contactId = JSON.parse(localStorage.getItem('contactEditId'))
    this.store.pipe(select(getContactDetailsById(contactId))).subscribe(res => {
      console.log("got response from selector details")
      console.log(res)
      this.isLoading = false;
      if (res) {
        this.SingleContactname = res.FName+' '+res.LName
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

  getCompletedCampaignData(reqBody, isConcat){
    debugger
    this.isLoading = true;
    console.log(" contact campaign links for completed");
    let useFulldata = {
      pageNo: this.CompletedCampaignRequestbody.RequestedPageNumber,
      CampaignType: 3,
      contactParentId: this.ContactEditID,
      pageSize: this.CompletedCampaignRequestbody.PageSize,
    }
    let reqparam = this.contactcampaign.GetAppliedFilterData({ ...reqBody, useFulldata: useFulldata })
    this.contactcampaign.getFilterList(reqparam).subscribe(resData => {
    // this.contactService.getContactCampaign(this.ContactEditID,2,10,reqBody.RequestedPageNumber,this.userguid,"").subscribe(resData =>{
      if (!resData.IsError) {
        this.isLoading = false;
        console.log("contact complete campaign list response--->", resData.ResponseObject);
        if (resData.ResponseObject.length > 0) {
          const ImmutableObject = Object.assign({},resData)
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
          this.CompletedCampaignRequestbody = reqBody;
          if (resData.OdatanextLink) {
            this.CompletedCampaignRequestbody.OdatanextLink = resData.OdatanextLink
          }
          if (isConcat) {
            let spliceArray = [];
            this.contactcompletecampaignTable.map((res) => {
              if (res.index >= start && res.index <= end) {
                spliceArray.push(res);
              }
            });
            spliceArray.map(res => {
              this.contactcompletecampaignTable.splice(this.contactcompletecampaignTable.indexOf(res), 1);
            })
            this.contactcompletecampaignTable = this.contactcompletecampaignTable.concat(this.getTableFilterData(resData.ResponseObject))
            console.log("contact complete campaign Table",this.contactcompletecampaignTable);
          } else {
            this.contactcompletecampaignTable = this.getTableFilterData(resData.ResponseObject)
            console.log("contact complete campaign Table",this.contactcompletecampaignTable);
          }
          this.tableTotalCount = resData.TotalRecordCount
          console.log("table Total Count",this.tableTotalCount)
        } else {
          this.tableTotalCount = 0
          this.contactcompletecampaignTable = [{}]
        }
      } else {
        this.isLoading = false;
        this.OnError(resData.Message);
        if (reqBody.RequestedPageNumber > 1)
        this.CompletedCampaignRequestbody.RequestedPageNumber = this.CompletedCampaignRequestbody.RequestedPageNumber - 1
      }
    },
    error => {
      this.isLoading = false;
    })
  }
  OnError(message) {
    let action;
    this.matSnackBar.open(message, action, {
      duration: 4000
    });
  }
  
  getTableFilterData(tableData): Array<any> {
    if (tableData) {
      if (tableData.length > 0) {
        console.log("contacts table data", tableData);
        return tableData.map(completedCampaign => {
          return {
            Name: (completedCampaign.Name !== undefined) ? completedCampaign.Name : "NA",
            campaign: completedCampaign.Code ,
            owner: (completedCampaign.Owner.FullName !== undefined) ? completedCampaign.Owner.FullName : "NA",
            status: (completedCampaign.CampaignStatus !== undefined) ? completedCampaign.CampaignStatus : "NA",
            startdate: (completedCampaign.StartDate !== undefined)? this.datepipe.transform(completedCampaign.StartDate, 'd-MMM-y')  : "NA",
            enddate: (completedCampaign.EndDate !== undefined)? this.datepipe.transform(completedCampaign.EndDate, 'd-MMM-y')  : "NA",
            index: completedCampaign.index,
            id: completedCampaign.Id
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
    console.log('childActionReceived', childActionRecieved)
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'search': {
        this.CompletedCampaignRequestbody.RequestedPageNumber = 0
        this.SearchTable(actionRequired, this.CompletedCampaignRequestbody.RequestedPageNumber);
        return;
      }
      case 'tabNavigation':
      {
        this.TabNavigation(childActionRecieved.objectRowData[0]);
        return
      }
      case 'Name':
        {
          console.log("campaign nevigation",childActionRecieved.objectRowData[0]);
          if (JSON.parse(sessionStorage.getItem('RequestCampaign'))) {
            let reqCamp = JSON.parse(sessionStorage.getItem("RequestCampaign"))
            sessionStorage.setItem('RequestCampaign', JSON.stringify({
               ...reqCamp,
                Id: childActionRecieved['objectRowData'][0]['id'], 
                isAccountPopulate: false ,
                isCampaignEdit:true,
                isCompletedCampaign:true,
                navigation: 'contacts/contactcompletecampaign'}));
          } else {
            sessionStorage.setItem('RequestCampaign', JSON.stringify({ 
              Id: childActionRecieved['objectRowData'][0]['id'], 
              isAccountPopulate: false,
              isCampaignEdit:true,
              isCompletedCampaign:true,
              navigation : 'contacts/contactcompletecampaign' }));
          }
          sessionStorage.removeItem('campaignCacheData');
          //sessionStorage.setItem('campaignId', JSON.stringify(childActionRecieved.objectRowData[0].id));
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
          this.CompletedCampaignRequestbody.OdatanextLink = ''
          this.CompletedCampaignRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(childActionRecieved);
          break
        }
    }
  }

  clearallFilter(){
    this.CompletedCampaignRequestbody = {
      "PageSize":this.CompletedCampaignRequestbody.PageSize,
      "RequestedPageNumber":  1,
      "OdatanextLink": "",
      "FilterData":  [],
      "Guid": "",
    }
    this.getCompletedCampaignData(this.CompletedCampaignRequestbody, false)
  }

  SearchTable(data,reqpagenumber): void {
    this.isLoading = false
    console.log('contact search data', data)
    this.CompletedCampaignRequestbody.RequestedPageNumber = 1
    this.CompletedCampaignRequestbody.OdatanextLink = ""
    if (data != "") {
      if (data.objectRowData != "" && data.objectRowData != undefined) {
      let useFulldata = {
        pageNo : this.CompletedCampaignRequestbody.RequestedPageNumber,
        CampaignType: 3,
        contactParentId: this.ContactEditID,
        pageSize: this.CompletedCampaignRequestbody.PageSize
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
            this.contactcompletecampaignTable = this.getTableFilterData(res.ResponseObject)
            this.CompletedCampaignRequestbody.OdatanextLink = res.OdatanextLink
            this.tableTotalCount = res.TotalRecordCount
          }
          else {
            this.contactcompletecampaignTable = [{}]
            this.tableTotalCount = 0
          }
        } else {
          this.errorMessage.throwError(res.Message);
        }
      })

      } else {
        this.getCompletedCampaignData(this.CompletedCampaignRequestbody, false);
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
          this.CompletedCampaignRequestbody.OdatanextLink = ''
          this.CompletedCampaignRequestbody.RequestedPageNumber = 1
          this.CallListDataWithFilters(data)
        } else if (data.filterData.isApplyFilter && data.filterData.globalSearch != ""){
          this.CallListDataWithFilters(data)
        } else {
          this.CompletedCampaignRequestbody.OdatanextLink = ''
          this.CompletedCampaignRequestbody.RequestedPageNumber = 1
          this.getCompletedCampaignData(this.CompletedCampaignRequestbody, false);
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
        CampaignType: 3,
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
    this.CompletedCampaignRequestbody.OdatanextLink = ''
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
      pageNo: this.CompletedCampaignRequestbody.RequestedPageNumber,
      CampaignType: 3,
      pageSize: 50,
      contactParentId: this.ContactEditID,
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
          this.contactcompletecampaignTable = this.getTableFilterData(res.ResponseObject)
          this.CompletedCampaignRequestbody.OdatanextLink = res.OdatanextLink
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.contactcompletecampaignTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.contactcompletecampaignTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    })
  }





  
  TabNavigation(item) {
    console.log("Table nevigation for campaign for contact")
    console.log(item)
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

}
