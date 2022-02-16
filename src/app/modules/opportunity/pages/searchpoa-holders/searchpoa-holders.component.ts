import { Component, OnInit, Inject } from "@angular/core";
import { DataCommunicationService } from "@app/core/services/global.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { OpportunitiesService, OrderService } from "@app/core";
import { Observable, of } from 'rxjs';
import { columnSortPOA } from './../../../../modules/opportunity/pages/opportunity-view/tabs/order/orderenum';
@Component({
  selector: "app-searchpoa-holders",
  templateUrl: "./searchpoa-holders.component.html",
  styleUrls: ["./searchpoa-holders.component.scss"]
})
export class SearchpoaHoldersComponent implements OnInit {
  orderSignedDate : any = null;
  cleartext;
  isLoading = false
  tableName = 'searchpoa'
IsActionFixed= true
  SearchpoaTable: any = [{}];
  tableSearchpoa = [];
  poaHolders: any = [];
  buDropdown: any = [];
  companyCode: any = [];
  category: any = [];
  location: any = [];
  SignedDate: any = [];
  tableTotalCount: number = 0;

  tabList = true;
  sortBy = null;
  isDesc = false;
  searchText = '';
  action = ''
  selectedValue = {};

  paginationPageNo = {
    PageSize: 50,
    RequestedPageNumber: 1,
    OdatanextLink: ""
  };


  searchPOAholder = {
    BU: "",
    CompanyCode: "",
    Category: "",
    Location: ""
  };

  constructor(
    public service: DataCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public searchpoa: OpportunitiesService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<SearchpoaHoldersComponent>,
    private orderService: OrderService
  ) {

    if (data) {
      this.searchText = data.data ? data.data : ''
      this.action = data.action ? data.action : ''
      if (!data.searchAction) {
        this.searchText = ''
      }
     if (data.action =='search') {
        this.IsActionFixed = false
      }
    }



  }
  SearchFilterTable: any = [{}];

  sortData(sortBoolean, col) {
    if (sortBoolean) {
      this.SearchpoaTable = this.SearchpoaTable.filter(x => x).sort((a, b) => a[col].localeCompare(b[col]));
      // this.SearchpoaTable  = this.SearchpoaTable.sort((a, b) => a[col].localeCompare(b[col]));
      for (let i = 0; i < this.SearchpoaTable.length; i++) {
        this.SearchpoaTable[i].index = i + 1;
      }
      console.log(this.SearchpoaTable);
    }
    else {
      // this.SearchpoaTable  = this.SearchpoaTable.sort((a, b) => b[col].localeCompare(a[col]));
      this.SearchpoaTable = this.SearchpoaTable.filter(x => x).sort((a, b) => b[col].localeCompare(a[col]));
      console.log(this.SearchpoaTable);
      for (let i = 0; i < this.SearchpoaTable.length; i++) {
        this.SearchpoaTable[i].index = i + 1;
      }

    }
  }
  performTableChildAction(childActionRecieved): Observable<any> {
    this.searchText = childActionRecieved.objectRowData ? childActionRecieved.objectRowData : ''
    switch (childActionRecieved.action) {

      case 'sortHeaderBy': {
        this.isDesc = !childActionRecieved.filterData.sortOrder;
        this.paginationPageNo.RequestedPageNumber = 1; 
        this.sortBy = +(columnSortPOA[childActionRecieved.filterData.sortColumn]);
        console.log("1st : " + childActionRecieved.filterData.sortColumn);
        console.log("2nd : " + childActionRecieved.filterData.sortOrder);
        console.log("3rd : " + columnSortPOA);
        this.filterPOAData(event);
        this.isLoading = true;
        //this.sortData(childActionRecieved.filterData.sortOrder, childActionRecieved.filterData.sortColumn)
        return;
      }
      case 'assignAcOrder':
      case 'POAName':
        this.selectedValue = childActionRecieved.objectRowData;
        this.dialogRef.close(this.selectedValue);
        return;
      case 'search': {
        this.searchText = childActionRecieved.objectRowData;
        this.paginationPageNo.RequestedPageNumber = 1;       
        this.SearchpoaTable = [];
        this.isDesc = false;
        this.sortBy = null;
        this.filterPOAData(event);
         this.isLoading = true;
        return; 
      }
    }

  }

  ngOnInit() {
    this.orderSignedDate = this.data.signedDate ? this.getDateFormatforPOA( this.data.signedDate) : null;
    this.getPOAHolderfilters()
   this.filterPOAData(event)
   this.isLoading = true;
  }

  getDateFormatforPOA(signedDate){
    
    let d = new Date(signedDate);
 
let date = d.getDate();
let month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
let year = d.getFullYear();
 
let dateStr = year + "-" + month + "-" + date;
return dateStr;
  }

  goBack() {
    window.history.back();
  }

  clearFilter() {
    this.searchPOAholder = Object.assign({
      BU: "",
      CompanyCode: "",
      Category: "",
      Location: ""
    });
     this.paginationPageNo.RequestedPageNumber = 1;
    this.searchText = '';
    this.isDesc = false;
    this.sortBy = null;
    this.SearchpoaTable = [];
    this.getPOAHolderfilters();   
    this.filterPOAData(event);
    this.isLoading = true;
  }

  poaHoldersTabLength: number = 0

  getPOAHolderfilters() {
    const payload = {};
    this.orderService.getPOAHoldersFilters(payload).subscribe((res: any) => {
      if (!res.IsError) { }
     

      var a = res.ResponseObject.BU ? res.ResponseObject.BU : "";
      this.buDropdown= a.filter(data => data.BU !='All');
      this.companyCode = res.ResponseObject.CompanyCode ? res.ResponseObject.CompanyCode : "";
      this.location = res.ResponseObject.Location ? res.ResponseObject.Location : "";
      this.category = res.ResponseObject.Category ? res.ResponseObject.Category : "";
      this.isLoading = false;
    })
  }
  // get POA data
  filterPOADataSearch(event) {
    this.paginationPageNo.RequestedPageNumber = 1;
    this.searchText = ''; 
    this.SearchpoaTable = [];
     this.isDesc = false;
    this.sortBy = null;
    this.getPOAHolderfilters();
    this.filterPOAData(event);
    this.isLoading = true;
  }

  filterPOAData(event) {
    this.isLoading = true;
    let index = ((this.paginationPageNo.RequestedPageNumber - 1) * this.paginationPageNo.PageSize) + 1;
    debugger;
    const payload = {
      "FilterSearchText": this.searchText,
      "PageSize": this.paginationPageNo.PageSize,
      "RequestedPageNumber": this.paginationPageNo.RequestedPageNumber,
      "Location": this.searchPOAholder.Location ? this.searchPOAholder.Location : "",
      "Category": this.searchPOAholder.Category ? this.searchPOAholder.Category : "",
      "BU": this.searchPOAholder.BU ? this.searchPOAholder.BU : "",
      "CompanyCode": this.searchPOAholder.CompanyCode ? this.searchPOAholder.CompanyCode : "",
       "SignedDate": this.orderSignedDate,
       "SortBy":this.sortBy,
       "IsDesc":this.isDesc,

    };
    this.isLoading = true;
    this.poaHoldersTabLength = 0
    this.orderService.getPOAHolders(payload).subscribe((res: any) => {
      if (!res.IsError) {
        this.isLoading = false;

        let response = res.ResponseObject;
        this.poaHoldersTabLength = res.TotalRecordCount;

        this.poaHolders = response;
        this.SearchpoaTable = (response.length > 0) ? (response.map((data, i) => {
          console.log("Third", data)
          return {
            POAName: data.POAName ? data.POAName : "NA",
            EmailId: data.EmailId ? data.EmailId : "NA",
            BU: data.BU ? data.BU : "NA",
            CompanyCode: data.CompanyCode ? data.CompanyCode : "NA",
            Category: data.CategoryId ? data.CategoryId : "NA",
            Location: data.Location ? data.Location : "NA",
            id: data.POAHolderId ? data.POAHolderId : "NA",
            disableRoute: this.action == 'search' ? true : false,
            assignAcOrderBtnVisibility: this.action == 'search' ? true : false,
            index: index + i
          };
        }
        )) : [{}];
        this.SearchpoaTable = this.SearchpoaTable.map(addColumn => {
          let newColumn = Object.assign({}, addColumn);
          newColumn.disableRoute = this.action == 'search' ? true : false
          newColumn.assignAcOrderBtnVisibility = this.action == 'search' ? true : false
          return newColumn;
        });
      }
    }
    );
    this.isLoading = false
  }


 
  getNewTableDataValues(event) {
    this.SearchpoaTable = [];
    this.paginationPageNo.PageSize = event.itemsPerPage;
    this.paginationPageNo.RequestedPageNumber = event.currentPage;
    this.filterPOAData(event);
    this.isLoading = true;
  }



  onNoClick(): void {

    this.dialogRef.close();
  }
  // onNoClick() {

  //     this.dialogRef.close();
  //   this.selectedValue;
  // }

}
