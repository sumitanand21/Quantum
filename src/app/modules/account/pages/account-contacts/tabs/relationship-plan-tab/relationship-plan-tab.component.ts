import { Component, OnInit, Input } from '@angular/core';
import { AccountService } from '@app/core/services/account.service';
import { Observable, of, concat, from } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { DatePipe } from '@angular/common';
import { AccountListService } from '@app/core/services/accountlist.service';
import { Store, select } from '../../../../../../../../node_modules/@ngrx/store';
import { AppState } from '@app/core/state';
import { relationshipPlanAction, relationshiPlanclear } from '@app/core/state/actions/relationship-plan.action';
import { RelationShipPlanRequestState } from '@app/core/state/selectors/account/relationShipPlan.selector';
import { environment as env } from '@env/environment';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { EnvService } from '@app/core/services/env.service';
declare let FileTransfer: any;

@Component({
  selector: 'app-relationship-plan-tab',
  templateUrl: './relationship-plan-tab.component.html',
  styleUrls: ['./relationship-plan-tab.component.scss']
})
export class RelationshipPlanTabComponent implements OnInit {
  RelationshipPlanTable = [];
  tableTotalCount: number;
  isLoading = false;
  relationplanlist: any;
  deleteobj: any;
  accountSysId: any;
  RelationshipListRequeBody =
    {
      Guid: '',
      'PageSize': 50,
      'RequestedPageNumber': 1,
      'OdatanextLink': ''
    };
  filterConfigData = {
    Contactname: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Title: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Relationshiptheme: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Keywiprocontact: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    RelationshipOwner: { data: [], recordCount: 0, PageNo: 1, NextLink: '' },
    Contactusingwiproservices: { data: [], recordCount: 1, PageNo: 1, NextLink: ''},
    Contactworkswithcompetition: { data: [], recordCount: 1, PageNo: 1, NextLink: '', staticData: true },
    isFilterLoading: false
  };
  roleAccess:boolean;
  // data: [{id:1,name:'Yes',value:true},{id:2,name:'No',value:false}],
  constructor(public activerequest: AccountService,
    public router: Router,
    private datapipe: DatePipe,
    private accountlistService: AccountListService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private store: Store<AppState>, private EncrDecr: EncrDecrService,
    public service: DataCommunicationService, public errorMessage: ErrorMessage,public envr : EnvService) { }

  ngOnInit(): void {
    this.roleAccess  = this.service.getRoleAccess();
    // this.accountSysId = localStorage.getItem("accountSysId")
    this.accountSysId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip');
    this.RelationshipListRequeBody.Guid = this.accountSysId;
    this.isLoading = true;
    // var orginalArray = this.activerequest.getAllAccountContacts();
    // orginalArray.subscribe((x: any[]) => {
    // this.AccountContactsTable = x;

    // });
    // var orginalArray1 = this.accountlistService.GetRelationshipPlaneList(this.RelationshipListRequeBody);
    // this.store.pipe(select(RelationShipPlanRequestState)).subscribe((res: any) => {
    //   this.relationplanlist = res.ResponseObject
    //   if (res) {
    //     if (res.ids.length > 0) {
    //       this.isLoading = false;
    //       this.RelationshipPlanTable = this.getTableFilterData(Object.values(res.entities))
    //       console.log('relationship table-->', this.RelationshipPlanTable);
    //       this.RelationshipPlanTable.map((res, index) => {
    //         res.index = index + 1;
    //       });

    //       this.tableTotalCount = res.count;
    //       this.RelationshipListRequeBody.OdatanextLink = res.OdatanextLink;
    //     }
    //     else {
    //       this.GetAllHistory(this.RelationshipListRequeBody, true)
    //     }
    //   } else {
    this.GetAllHistory(this.RelationshipListRequeBody, true);
    //   }
    // this.ModificationActiveRequestTable = res;
    // });
    // var orginalArray = this.accountlistService.GetRelationshipPlaneList(this.RelationshipListRequeBody);
    // orginalArray.subscribe((res: any) => {
    //   if (res) {
    //     this.isLoading = false;
    //     if (res.ResponseObject.length > 0) {
    //       this.GetAllHistory(this.RelationshipListRequeBody, true)
    //       // this.isLoading = false;          
    //       // this.RelationshipPlanTable = this.getTableFilterData(Object.values(res.ResponseObject))
    //       // this.RelationshipPlanTable.map((res: any, index) => {
    //       //   res.index = index + 1;
    //       // });
    //       // this.tableTotalCount = res.TotalRecordCount;
    //       // this.RelationshipListRequeBody.OdatanextLink = res.OdatanextLink;
    //     } else {
    //       return [{}];
    //     }
    //   }
    // });

  }

  //New pagination
  TablePagination(data) {

    this.RelationshipListRequeBody.RequestedPageNumber = this.RelationshipListRequeBody.RequestedPageNumber + 1
    this.GetAllHistory(this.RelationshipListRequeBody, true);
  }

  //pagenation
  //pagenation
  getNewTableData(event) {
    // console.log(event)
    if (event.action === 'pagination') {

      this.RelationshipListRequeBody.PageSize = event.itemsPerPage;
      this.RelationshipListRequeBody.RequestedPageNumber = event.currentPage;
      this.CallListDataWithFilters(event,true);
      // if (this.service.checkFilterListApiCall(event)) {

      //   //filter api call
      //   this.CallListDataWithFilters(event);
      // }
      // else {

      //   //list api call
      //   this.GetAllHistory(this.RelationshipListRequeBody, true);
      // }

    } else if (event.action === 'search') {
      this.RelationshipListRequeBody = {

        'Guid': this.accountSysId,
        'PageSize': event.itemsPerPage,
        'RequestedPageNumber': 1,
        'OdatanextLink': ''

      };

    }

  }

  //Search Table
  // SearchTable(data): void {
  //   this.RelationshipListRequeBody.RequestedPageNumber = 1;
  //   this.RelationshipListRequeBody.OdatanextLink = '';

  //   if (data !== '') {
  //     const searchData = data.objectRowData ? data.objectRowData : data.filterData.globalSearch;
  //     if (searchData !== '' && searchData !== undefined) {
  //       this.accountlistService.GetRelatioshipaccountSearch(searchData, 1, this.RelationshipListRequeBody.PageSize, this.RelationshipListRequeBody.OdatanextLink, this.RelationshipListRequeBody.RequestedPageNumber).subscribe(res => {
  //         if (!res.IsError) {
  //           if (res.ResponseObject.length > 0) {
  //             this.RelationshipPlanTable = this.getTableFilterData(res.ResponseObject);
  //             let i = 1;
  //             this.RelationshipPlanTable.map(res => {
  //               res.index = i;
  //               i = i + 1;
  //             });
  //             this.RelationshipListRequeBody.OdatanextLink = res.OdatanextLink;
  //             this.tableTotalCount = res.TotalRecordCount;

  //             // console.log("table count", res);


  //           } else {
  //             // console.log("table count else", res);
  //             this.RelationshipPlanTable = [{}];
  //             this.tableTotalCount = 0;
  //           }
  //         }
  //       });
  //     } else {
  //       this.GetAllHistory(this.RelationshipListRequeBody, false);
  //     }
  //   }
  // }

  performTableChildAction(childActionRecieved): Observable<any> {
    if (childActionRecieved) {
      (childActionRecieved.parentData) ? this.tableTotalCount = childActionRecieved.parentData.totalCount : this.tableTotalCount = this.tableTotalCount;
    }
    const actionRequired = childActionRecieved;
    // console.log("action ", actionRequired);
    // let incId =  actionRequired.objectRowData[0].id;//this.EncrDecr.set('EncryptionEncryptionEncryptionEn', actionRequired.objectRowData[0].Id, 'DecryptionDecrip');

    switch (actionRequired.action) {

      case 'Name': {
        console.log(actionRequired);
        // this.router.navigate(['/accounts/accountmodification/viewmodificationdetails', 'acc_req', actionRequired.objectRowData[0].id]);
        this.router.navigate(['/accounts/accountdetails', actionRequired.objectRowData[0].id]);
        return;
      }
      case 'view modification': {
        this.router.navigate(['/accounts/accountmodification/viewmodificationdetails', 'acc_req', actionRequired.objectRowData[0].id]);
        return;
      }
      case 'view':
        {
          this.router.navigate(['/accounts/accountmodification/viewmodificationdetails', 'acc_req', actionRequired.objectRowData[0].id]);
          // this.router.navigate(['/accounts/accountcreation/reviewnewaccount', 'acc_req',actionRequired.objectRowData[0].id]);
          return;
        }
      case 'review':
        {
          this.router.navigate(['/accounts/accountcreation/reviewnewaccount', 'acc_req', actionRequired.objectRowData[0].id]);
          return;
        }
      case 'editdraft':
        {
          this.router.navigate(['/accounts/accountcreation/createnewaccount']);
          return;
        }
      case 'edit': {
        // this.service.editData.emit(actionRequired);
        // const isEdit:boolean  = true;
        localStorage.setItem('editData', JSON.stringify(actionRequired.objectRowData[0]));
        localStorage.setItem('isEdit', 'edit');
        this.router.navigate(['/accounts/contacts/addrelationshipplan', actionRequired.objectRowData[0].id]);
        return;
      }
      case 'pagination': {

        this.TablePagination(childActionRecieved);
        return;
      }
      case 'search':
        {
          this.RelationshipListRequeBody.OdatanextLink = '';
          this.RelationshipListRequeBody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(childActionRecieved);
          // this.SearchTable(childActionRecieved);
          return;
        }
      case 'delete': {
        // console.log("delete response",actionRequired.objectRowData[0].id);
        this.deteleContact(actionRequired);
        this.deleteobj = actionRequired;
        // console.log("delete obj response ", this.deleteobj)
        return;
      }

      case 'DownloadCSV': {
        this.downloadList(childActionRecieved);
        return;
      }
      case 'columnFilter': {
        this.GetColumnFilters(childActionRecieved);
        return;
      }
      case 'columnSearchFilter': {
        this.GetColumnSearchFilters(childActionRecieved);
        return;
      }
      case 'sortHeaderBy': {
        this.RelationshipListRequeBody.OdatanextLink = '';
        this.RelationshipListRequeBody.RequestedPageNumber = 1;
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }

      case 'loadMoreFilterData': {
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
      case 'ClearAllFilter': {
        this.CallListDataWithFilters(childActionRecieved);
        // this.GetAllHistory(this.RelationshipListRequeBody, true);
        break;
      }

    }
  }
  downloadList(data): void {
    this.isLoading = true;
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    // console.log("reqparam" + reqparam);
    reqparam['IsFilterApplied'] = this.service.checkFilterListApiCall(data) ? true : false;
    this.accountlistService.getFilterList(reqparam, true, 'RelationShipPlanList').subscribe(res => {

      if (!res.IsError) {
        this.isLoading = false;
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject);
        } else {
          this.service.Base64Download(res.ResponseObject);
          // window.open(res.ResponseObject.Url, '_blank');
        }
      } else {
        this.isLoading = false;
        this.errorMessage.throwError(res.Message);
      }
    }, error => {
      this.isLoading = false;
    });

  }
  downloadListMobile(fileInfo) {
    const fileTransfer = new FileTransfer();
    const newUrl = fileInfo.Url.substr(0, fileInfo.Url.indexOf('?'));
    const uri = encodeURI(newUrl);
    const fileURL = '///storage/emulated/0/DCIM/' + fileInfo.Name;
    this.errorMessage.throwError(`${fileInfo.Name} downloaded`);
    fileTransfer.download(
      uri, fileURL, function (entry) {
        console.log('download complete: ' + entry.toURL());
      },
      function (error) {
        console.log('download error source ' + error.source);
        console.log('download error target ' + error.target);
        console.log('download error code' + error.code);
      },
      null, {
      //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      //  } headers: {
      // 
    }
    );
  }

  LoadMoreColumnFilter(data) {
    const headerName = data.filterData.headerName;
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1;
    this.generateFilterConfigData(data, headerName, true, true);
  }
  GetColumnSearchFilters(data) {
    const headerName = data.filterData.headerName;
    this.RelationshipListRequeBody.OdatanextLink = '';
    this.filterConfigData[headerName].PageNo = 1;
    this.filterConfigData[headerName].NextLink = '';
    this.generateFilterConfigData(data, headerName, false, true);
  }
  GetColumnFilters(data) {
    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        // debugger
        const headerName = data.filterData.headerName;
        // if (!this.filterConfigData[headerName].staticData) {
          this.filterConfigData[headerName].data = [];
          this.RelationshipListRequeBody.OdatanextLink = '';
          this.filterConfigData[headerName].PageNo = 1;
          this.filterConfigData[headerName].NextLink = '';
        // }

        this.generateFilterConfigData(data, headerName, false, this.CheckFilterServiceFlag(data, headerName));
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.RelationshipListRequeBody.OdatanextLink = '';
          this.RelationshipListRequeBody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data);
        } else {
          this.RelationshipListRequeBody.OdatanextLink = '';
          this.RelationshipListRequeBody.RequestedPageNumber = 1;
          if (data.filterData.globalSearch) {
            // this.SearchTable(data);
            this.CallListDataWithFilters(data);

          } else {
            this.GetAllHistory(this.RelationshipListRequeBody, true);
          }

        }

      }
    }
  }
  CallListDataWithFilters(data,isConcat?) {
    const reqparam = this.GetAppliedFilterData({ ...data }, true);
    this.accountlistService.getFilterList(reqparam, false, 'FilterRelationShipPlanList').subscribe(res => {
      if (!res.IsError) {
        // debugger
        if (res.ResponseObject.length > 0) {

          const ImmutabelObj = Object.assign({}, res);
          const perPage = reqparam.PageSize;
          const start = ((reqparam.RequestedPageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;

          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          });
          if (isConcat) {
            if (reqparam.RequestedPageNumber == 1) {
              this.RelationshipPlanTable = this.getTableFilterData(res.ResponseObject);
            }
            else {
              this.RelationshipPlanTable = [...this.RelationshipPlanTable, ...this.getTableFilterData(res.ResponseObject)];
            }
          } else {
            this.RelationshipPlanTable = this.getTableFilterData(res.ResponseObject);
          }
          // this.RelationshipPlanTable = this.getTableFilterData(res.ResponseObject);
          this.RelationshipListRequeBody.OdatanextLink = res.OdatanextLink;
          // debugger
          this.tableTotalCount = res.TotalRecordCount;
        } else {
          this.RelationshipPlanTable = [{}];
          this.tableTotalCount = 0;
        }
      } else {
        this.RelationshipPlanTable = [{}];
        this.tableTotalCount = 0;
        this.errorMessage.throwError(res.Message);
      }
    });
  }

  GetAppliedFilterData(data, IsFilterAPI) {

    return {
      'AccountGuid': this.RelationshipListRequeBody.Guid ? this.RelationshipListRequeBody.Guid : '',
      'SortBy': this.getNumericsOnColumn(data.filterData.sortColumn),
      'IsDesc': (data.filterData.sortColumn !== '') ? !data.filterData.sortOrder : false,
      'PageSize': IsFilterAPI ? this.RelationshipListRequeBody.PageSize : 10,
      'RequestedPageNumber': this.RelationshipListRequeBody.RequestedPageNumber,
      'SearchText': data.filterData.globalSearch,
      'Contact': this.service.pluckParticularKey(data.filterData.filterColumn['Contactname'], 'id'),
      'Title': this.service.pluckParticularKey(data.filterData.filterColumn['Title'], 'id'),
      'RelationShipTheme': this.service.pluckParticularKey(data.filterData.filterColumn['Relationshiptheme'], 'id'),
      'ContactUsingWiproServices': this.service.pluckParticularKey(data.filterData.filterColumn['Contactusingwiproservices'], 'value'),
      'ContactWorkWithCompetion': this.service.pluckParticularKey(data.filterData.filterColumn['Contactworkswithcompetition'], 'value'),
      'KeyWiproContact': this.service.pluckParticularKey(data.filterData.filterColumn['Keywiprocontact'], 'id'),
      'Owner': this.service.pluckParticularKey(data.filterData.filterColumn['RelationshipOwner'], 'id'),
      'ColumnOrder': (data.objectRowData) ? Array.isArray(data.objectRowData) ? this.filterHeaderName(data.objectRowData[1]) :[]:[]
    };
  }

  filterHeaderName(data) {
    return data.reduce((acc, d) => {
      if (d.name == "Contactname") {
        acc.push("ContactName");
      }
      else if (d.name == "Contactusingwiproservices") {
        acc.push("ContactUseswiproServices");
      }
      else if (d.name == "Contactworkswithcompetition") {
        acc.push("ContactWorkswithCompetition");
      }
      else if (d.name == "Keywiprocontact") {
        acc.push("KeyWiproCN");
      }
      else if (d.name == "Relationshiptheme") {
        acc.push("RelationShipTheme");
      }
      else {
        acc.push(d.name);
    }
      return acc;
    }, []);
  }

  getNumericsOnColumn(columName) {
    switch (columName) {
      case 'Contactname':
        return 19;
      case 'Title':
        return 20;
      case 'Relationshiptheme':
        return 22;
      case 'Keywiprocontact':
        return 23;
      case 'Contactusingwiproservices':
        return 24;
      case 'Contactworkswithcompetition':
        return 25;
      case 'RelationshipOwner':
        return 4;

      default:
        return '';
    }
  }
  generateFilterConfigData(data, headerName, isConcat, isServiceCall?) {
    if (isServiceCall) {
      const useFulldata = {
        headerName: headerName,
        searchVal: data.filterData.columnSerachKey,
        pageNo: this.filterConfigData[headerName].PageNo,
        pageSize: 10,
        nextLink: this.filterConfigData[headerName].NextLink,
        guid: this.RelationshipListRequeBody.Guid,
        statusCode: 0,
        Searchtype: ''
      };
      // let dataSet = data;
      // dataSet['AccountGuid'] = this.RelationshipListRequeBody.Guid;
      this.accountlistService.getFilterSwitchListData({ columnFIlterJson: this.GetAppliedFilterData(data, false), useFulldata: useFulldata }, 'relationShipPlan').subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        this.filterConfigData[headerName] = {
          data: (isConcat) ? this.filterConfigData[headerName]['data'].concat(res.ResponseObject) : res.ResponseObject,
          // data: (isConcat) ? res.ResponseObject.concat(this.filterConfigData[headerName]['data']) : res.ResponseObject,
          recordCount: res.TotalRecordCount,
          NextLink: res.OdatanextLink,
          PageNo: res.CurrentPageNumber
        };
        data.filterData.filterColumn[headerName].forEach(res => {
          const index = this.filterConfigData[headerName].data.findIndex(x => x.id === res.id);
          if (index !== -1) {
            this.filterConfigData[headerName].data[index].isDatafiltered = true;
          }
        });
      });
    } else {
      this.filterConfigData.isFilterLoading = false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]['data'] = this.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName]);
      }
    }
  }
  CheckFilterServiceFlag(data, headerName): boolean {
    if (data) {
      if (data.action !== 'columnFilter' && data.filterData.isApplyFilter) {
        return false;
      } else if (data.action === 'columnFilter' && data.filterData.columnSerachKey === '' && this.filterConfigData[headerName]["data"].length <= 0) {
        return true;
      } else if (data.action === 'columnFilter' && data.filterData.columnSerachKey !== '' && !data.filterData.isApplyFilter) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  RemoveSelectedItems(array1, array2, key) {
    // return array1;
    // debugger;
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])));
  }
  //Delte relationship plan
  deteleContact(actionRequired) {
    // console.log(actionRequired);

    this.accountlistService.DeleteRelationnship(actionRequired.objectRowData.id).subscribe(result => {
      this.store.dispatch(new relationshiPlanclear({ relationshipplanmodel: {} }));

      const deleteResponse = this.RelationshipPlanTable.filter(val => {
        return val.id !== actionRequired.objectRowData.id;

      });
      this.RelationshipPlanTable = deleteResponse;
      this.tableTotalCount = this.tableTotalCount - 1;
      this.snackBar.open(result['Message'], '', {
        duration: 3000
      });
      if (this.RelationshipPlanTable.length === 0) {
        this.RelationshipPlanTable = [{}];
      }


    });

  }
  //Get History
  GetAllHistory(reqBody, isConcat): void {
    this.isLoading = true;
    this.accountlistService.GetRelationshipPlaneList(reqBody)
      .subscribe(async (accountcontReques) => {
        // this.RelationshipPlanTable = []
        if (!accountcontReques.IsError) {
          this.isLoading = false;
          if (accountcontReques.ResponseObject.length > 0) {
            this.RelationshipPlanTable = [];
            const ImmutableObject = Object.assign({}, accountcontReques);
            const perPage = reqBody.PageSize;
            const start = ((reqBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // console.log(start + " - " + end);
            accountcontReques.ResponseObject.map(res => {
              if (!res.index) {
                res.index = i;
                i = i + 1;
              }
            });
            if (accountcontReques.OdatanextLink) {
              this.RelationshipListRequeBody.OdatanextLink = accountcontReques.OdatanextLink;
            }
            this.RelationshipListRequeBody = reqBody;
            // await this.offlineServices.ClearActiveCampaignIndexTableData();
            this.RelationshipListRequeBody.OdatanextLink = accountcontReques.OdatanextLink;
            if (isConcat) {
              const spliceArray = [];
              this.RelationshipPlanTable.map((res) => {
                if (res.index >= start && res.index <= end) {
                  spliceArray.push(res);
                }
              });
              spliceArray.map(res => {
                this.RelationshipPlanTable.splice(this.RelationshipPlanTable.indexOf(res), 1);
              });
              this.RelationshipPlanTable = this.RelationshipPlanTable.concat(this.getTableFilterData(accountcontReques.ResponseObject));
            } else {
              this.RelationshipPlanTable = this.getTableFilterData(accountcontReques.ResponseObject);
            }
            ImmutableObject.ResponseObject.map(x => x.id = x.Guid);

            console.log('immutable object->', ImmutableObject.ResponseObject);
            this.store.dispatch(new relationshipPlanAction({ RelationshipPlanModel: ImmutableObject.ResponseObject, count: accountcontReques.TotalRecordCount, OdatanextLink: accountcontReques.OdatanextLink }))




            this.tableTotalCount = accountcontReques.TotalRecordCount;

          } else {
            this.isLoading = false;
            this.RelationshipPlanTable = [{}];
          }

        } else {
          this.RelationshipPlanTable = [{}];
          this.isLoading = false;
          if (reqBody.RequestedPageNumber > 1)
            this.RelationshipListRequeBody.RequestedPageNumber = this.RelationshipListRequeBody.RequestedPageNumber - 1;
        }

      },

        error => {
          this.isLoading = false;
        });
  }
  //Mapping here

  getTableFilterData(tableData): Array<any> {

    if (tableData) {
      if (tableData.length > 0) {
        return tableData.map((relationship => {
          return {
            id: relationship.Guid,
            Contactname: (relationship.RelationShipContact && relationship.RelationShipContact.FullName) ? relationship.RelationShipContact.FullName : "NA",
            // Contactnameid:relationship.Guid,
            Title: relationship.Title || '',
            Level: (relationship.Level && relationship.Level.Value) ? relationship.Level.Value : '',
            LevelId: relationship.Level.Id ? relationship.Level.Id : '',
            Score: relationship.Name || '',
            RelationshipthemeId: relationship.Relationshiptheme.Id ? relationship.Relationshiptheme.Id : '',
            Keywiprocontact: (relationship.KeyWiproContactList.length > 0 && relationship.KeyWiproContactList) ? relationship.KeyWiproContactList.map((contacts) => {
              return contacts.FullName || '';
            }) : [''],
            Relationshiptheme: (relationship.KeyWiproContactList.length > 0 && relationship.KeyWiproContactList) ? relationship.KeyWiproContactList.map((contacts) => {
              return (contacts.Relationshiptheme.Name && contacts.Relationshiptheme.Name) ? contacts.Relationshiptheme.Name : '';
            }) : [''],
            KeyWiproContactid: relationship.KeyWiproContact.Guid ? relationship.KeyWiproContact.Guid : '',
            Contactusingwiproservices: relationship.ContactUsingWiproServices ? 'Yes' : 'No',
            Contactworkswithcompetition: relationship.ContactWorkswithCompetition ? 'Yes' : 'No',
            // MeetingFrequency: relationship.MeetingFrequency.Value,
            // MeetingFrequencyId: relationship.MeetingFrequency.Id,
            // Strategytoimproverelationship: relationship.StrategyToImproveRelationship,
            index: relationship.index,
            RelationshipOwner: (relationship.Owner && relationship.Owner.FullName) ? relationship.Owner.FullName : 'NA'
          };
        }));
      } else {
        return [{}];
      }
    } else {
      return [{}];
    }
  }
}



