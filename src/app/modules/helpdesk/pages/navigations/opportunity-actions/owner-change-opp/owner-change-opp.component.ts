
import { Observable } from 'rxjs';
//shinder
import { Component, OnInit, Inject } from '@angular/core';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { OpportunitiesService, DataCommunicationService, linkedLeadNames, linkedLeadsHeaders } from '@app/core';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
import { DatePipe } from "@angular/common";
@Component({
  selector: 'app-owner-change-opp',
  templateUrl: './owner-change-opp.component.html',
  styleUrls: ['./owner-change-opp.component.scss']
})
export class OwnerChangeOppComponent implements OnInit {
  selectedAdvisorName = [];
  isLoading =false;
  datePipe = new DatePipe("en-US");
  selectedOpp = false
  selectedAdvisorOwnerObj = {};
  advisorOwner: any;
  searchopp: string = '';
  showtable: boolean = false;
  showScrolltable: boolean = false;
  showresults: boolean = false;
  expandordertable: boolean = true;
  showordertable: boolean = false;
  ViewDetailsContent: Boolean = false;
  ManualContent: Boolean = true;
  tableCount = 0;
  tableCount1 = 0;
  userArray: any = [{}];
  userArrayTemp = [];
  headernonsticky1 = [{ name: "Opportunitynumber",title:"Opportunity number" },

  { name: "Opportunityname" ,title:"Opportunity name"},
  { name: "Accountname",title:"Account name" },
  { name: "Vertical",title:"Vertical" },
  { name: "Currentverticalowner",title:"Current vertical owner" }

  ];
  userArray2 = [{}]
  oppArrayList=[]
  
  // {"index":1,"Opportunity number": "AC123124323", "Previous vertical owner": "Satish Kaushik", "New vertical owner": "Rajpal Yadav", "Changed on": "23-Dec-2019", "Status":"Successful" },
  // {"index":1,"Opportunity number": "AC123124323", "Previous vertical owner": "Satish Kaushik", "New vertical owner": "Rajpal Yadav", "Changed on": "23-Dec-2019", "Status":"Failed" },


  headernonsticky2 = [{ name: "Opportunitynumber",title:"Opportunity number" },
  { name: "Previousverticalowner",title:"Previous vertical owner" },
  { name: "Newverticalowner",title:"New vertical owner" },
  { name: "Changedon",title:"Changed on" }


  ];

  constructor(public service: DataCommunicationService, private allopportunities: OpportunitiesService, private EncrDecr: EncrDecrService, public dialogRef: MatDialogRef<OwnerChangeOppComponent>, public dialog: MatDialog) {

  }
  //shinder

  // shinder

  selectedOwner(SelectedAssign: any) {
    if (Object.keys(SelectedAssign).length) {
      this.selectedOwnerObj = { ownerId: SelectedAssign.ownerid, Name: SelectedAssign.fullname }

      this.ownerName = this.selectedOwnerObj.Name;
      this.ownerId = this.selectedOwnerObj.ownerId;
      this.selectedOwnerArray = []
      this.selectedOwnerArray.push(this.selectedOwnerObj)
      this.selectedOwnerArray[0].Id = this.selectedOwnerObj.ownerId;
    }
    else {
      this.selectedOwnerObj = { ownerId: "", Name: "" };
      this.ownerId = '';
      this.ownerName = '';
    }
  }

  selectedNewOwner(SelectedAssign: any) {
    if (Object.keys(SelectedAssign).length) {
      this.selectedNewOwnerObj = { ownerId: SelectedAssign.SysGuid, Name: SelectedAssign.Name }

      // this.selectedNewOwnerObj = SelectedAssign;
      this.ownerNewName = this.selectedNewOwnerObj.Name;
      this.ownerNewId = this.selectedNewOwnerObj.ownerId;
      this.searchOwnerNewData = []
      this.searchOwnerNewData.push(this.selectedNewOwnerObj)
      this.searchOwnerNewData[0].Id = this.selectedNewOwnerObj.ownerId;
    }
    else {
      this.selectedNewOwnerObj = { ownerId: "", Name: "" };
      this.ownerNewName = '';
      this.ownerNewId = '';
    }
  }

  searchOwnerData = [];
  searchOwnerNewData = [];
  ownerId: string = "";
  ownerName: string = "";
  ownerNewId: string = "";
  ownerNewName: string = "";
  header = { name: "fullname", Id: "ownerid" };
  headerNew = { name: "Name", Id: "SysGuid" };
  selectedOwnerObj: any = { ownerId: "", Name: "" };
  selectedNewOwnerObj: any = { ownerId: "", Name: "" };
  //  header = {name:"fullname", Id:"ownerid"};
  //  selectedOwnerObj1:any = {ownerId: "", fullname: ""};


  isSearchLoader = false;
  advanceLookUpSearch(lookUpData) {

    debugger;
    console.log(lookUpData);
    let labelName = lookUpData.labelName;
    switch (labelName) {
      case 'changeVerArr': {
        this.openadvancetabs('changeVer', this.searchOwnerData, lookUpData.inputVal)
        return;

      }
      case 'changeNewVerArr': {
        this.openadvancetabs('changeNewVer', this.searchOwnerNewData, lookUpData.inputVal)
        return;

      }
    }

  }


  searchOwnerContent(data) {
    debugger;
    this.isSearchLoader = true;
    let body =

      {
        "SearchText": data.searchValue ? data.searchValue : '',
        "RequestedPageNumber": 1,
        "PageSize": 10
      }

    this.allopportunities.getchangeVerData(body).subscribe(response => {
      if (!response.IsError) {

        if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {
          this.searchOwnerData = response.ResponseObject;

          this.lookupdata.TotalRecordCount = response.TotalRecordCount

          this.lookupdata.nextLink = ''
          this.isSearchLoader = false;
        }
        else {
          this.searchOwnerData = [];
          this.isSearchLoader = false;
        }
      }
      else {
        this.allopportunities.displayMessageerror(response.Message);
        this.searchOwnerData = [];
        this.isSearchLoader = false;
      }
    },
      err => {
        this.allopportunities.displayerror(err.status);
        this.isSearchLoader = false;
      }
    );
  }


  getNewValidate() {

    if ((this.selectedName.length == 0 && !this.SearchTextBoolean) || (this.SearchTextBoolean && this.userArrayTemp.length == 0)) {
      return true
    }
    else {
      return false
    }

  }
  newAccountId = '';
  searchNewOwnerContent(data) {
    debugger;
    this.newAccountId = ''
    var newAccountIdArr = [];

    var checkAccount = false
    if (!this.SearchTextBoolean) {
    var uniqueData =  this.selectedName.map(item => item['AccountOwnerName'])
      .filter(
        (value, index, self) => self.indexOf(value) === index && value && value.trim() != ''
      );
      if (uniqueData.length == 1) {
        checkAccount = true

        newAccountIdArr = this.selectedName.map(function (it) {
          return it.AccountOwnerId
        });
        this.newAccountId = newAccountIdArr[0]

      }
    }
    else if (this.SearchTextBoolean) {
      checkAccount = true

      newAccountIdArr = this.userArray.map(function (it) {
        return it.AccountOwnerId
      });
      this.newAccountId = newAccountIdArr[0]

    }



    if (checkAccount) {
      this.isSearchLoader = true;
      let body =

        {
          "Guid": this.newAccountId,
          "SearchText": data.searchValue ? data.searchValue : '',
          "RequestedPageNumber": 1,
          "PageSize": 10
        }

      this.allopportunities.getNewchangeVerData(body).subscribe(response => {
        if (!response.IsError) {

          if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {
            this.searchOwnerNewData = response.ResponseObject;

            this.lookupdata.TotalRecordCount = response.TotalRecordCount

            this.lookupdata.nextLink = ''
            this.isSearchLoader = false;
          }
          else {
            this.searchOwnerNewData = [];
            this.isSearchLoader = false;
          }
        }
        else {
          this.allopportunities.displayMessageerror(response.Message);
          this.searchOwnerNewData = [];
          this.isSearchLoader = false;
        }
      },
        err => {
          this.allopportunities.displayerror(err.status);
          this.isSearchLoader = false;
        }
      );
    }
    else {
      this.searchOwnerNewData = []
      this.allopportunities.displayMessageerror('Select opportunities of same account');

    }
  }
  selectedOwnerArray = []
  //  selectedNewOwnerArray = []
  // searchOwnerNewData =[]
  lookupdata = {
    tabledata: [],
    recordCount: 10,
    headerdata: [],
    Isadvancesearchtabs: false,
    controlName: '',
    lookupName: '',
    isCheckboxRequired: false,
    inputValue: '',
    TotalRecordCount: 0,
    selectedRecord: [],
    nextLink: '',
    pageNo: 1,
    isLoader: false
  };

  selectedLookupData(controlName) {
    switch (controlName) {
      case 'changeVer': {
        return this.selectedOwnerArray.length > 0 ? this.selectedOwnerArray : []
      }
      case 'changeNewVer': {
        return this.searchOwnerNewData.length > 0 ? this.searchOwnerNewData : []
      }
    }
  }

  openadvancetabs(controlName, initalLookupData, value): void {
    debugger;

    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = linkedLeadsHeaders[controlName]
    this.lookupdata.lookupName = linkedLeadNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = linkedLeadNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = linkedLeadNames[controlName]['isAccount']
    this.lookupdata.inputValue = value ? value : '';
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
    this.lookupdata.tabledata = []
    this.allopportunities.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res

    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {

      debugger
      console.log(x)

      if (x.action == 'loadMore') {
        var dialogData
        if (controlName == 'changeVer') {
          dialogData = {

            "SearchText": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
            "PageSize": this.lookupdata.recordCount,
            "RequestedPageNumber": x.currentPage,
          }
        }
        else if (controlName == 'changeNewVer') {
          dialogData = {
            "Guid": this.newAccountId,
            "SearchText": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
            "PageSize": this.lookupdata.recordCount,
            "RequestedPageNumber": x.currentPage,
          }
        }


        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {

          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject)
          this.lookupdata.nextLink = ''
          this.lookupdata.TotalRecordCount = res.TotalRecordCount

        })

      } else if (x.action == 'search') {
        var dialogData;
        this.lookupdata.nextLink = ''
        if (controlName == 'changeVer') {
          dialogData = {

            "SearchText": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
            "PageSize": this.lookupdata.recordCount,
            "RequestedPageNumber": x.currentPage,
          }
        }
        else if (controlName == 'changeNewVer') {
          dialogData = {
            "Guid": this.newAccountId,
            "SearchText": x.objectRowData.searchKey ? x.objectRowData.searchKey : '',
            "PageSize": this.lookupdata.recordCount,
            "RequestedPageNumber": x.currentPage,
          }
        }




        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData }).subscribe(res => {
          this.lookupdata.isLoader = false
          this.lookupdata.tabledata = res.ResponseObject
          this.lookupdata.nextLink = ''
          this.lookupdata.TotalRecordCount = res.TotalRecordCount


        })

      }


    });

    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result) {
        console.log(result)
        this.AppendParticularInputFun(result.selectedData, result.controlName)
      }
    });
  }

  AppendParticularInputFun(selectedData, controlName) {
    debugger
    if (selectedData) {
      if (selectedData.length > 0) {
        if (controlName == 'changeVer') {
          this.selectedOwnerObj = selectedData[0];
          this.ownerName = this.selectedOwnerObj.Name;
          this.ownerId = this.selectedOwnerObj.ownerId;
          this.selectedOwnerArray = []
          this.selectedOwnerArray.push(this.selectedOwnerObj)
          this.selectedOwnerArray[0].Id = this.selectedOwnerObj.ownerId;
        }

        if (controlName == 'changeNewVer') {
          this.selectedNewOwnerObj = selectedData[0];
          this.ownerNewName = this.selectedNewOwnerObj.Name;
          this.ownerNewId = this.selectedNewOwnerObj.ownerId;
          this.searchOwnerNewData = []
          this.searchOwnerNewData.push(this.selectedNewOwnerObj)
          this.searchOwnerNewData[0].Id = this.selectedNewOwnerObj.ownerId;
        }

      }
    }
  }





  ngOnInit() {
  }



  SearchTextBoolean = false
  searchVerApi() {
    this.SearchTextBoolean = false
    let body = {
      "SearchText": this.searchopp ? this.searchopp : "",
      "OwnerId": this.ownerId ? this.ownerId : "",

    }
    if (this.searchopp) {
      this.SearchTextBoolean = true
    }
    this.allopportunities.searchVerApi(body).subscribe(response => {
      if (!response.IsError) {
        if (response.ResponseObject && (Array.isArray(response.ResponseObject) ? response.ResponseObject.length > 0 : false)) {

          this.tableCount = response.TotalRecordCount
          this.userArray = response.ResponseObject.map((it, index) => {
            return {
              "Opportunitynumber": it.OpportunityNumber ? it.OpportunityNumber : 'NA',
              "Opportunityname": it.OpportunityName ? it.OpportunityName : 'NA',
              "Accountname": it.AccountOwnerName ? it.AccountOwnerName : 'NA',
              "Vertical": it.VerticalName ? it.VerticalName : 'NA',
              "Currentverticalowner": it.VerticalSalesOwner ? it.VerticalSalesOwner : 'NA',
              "OpportunityId": it.OpportunityId ? it.OpportunityId : '',
              "index": index + 1,
              "AccountOwnerName": it.AccountOwnerName ? it.AccountOwnerName : '',
              'AccountOwnerId': it.AccountOwnerId ? it.AccountOwnerId : ''
            }
          }
          );
          this.userArrayTemp = [{ 'a': 'a' }]

        }
        else {
          this.userArray = [{}]
        }
      }
      else {
        this.userArray = [{}]
        this.userArrayTemp = []
        this.allopportunities.displayMessageerror(response.Message);
      }
    }
      ,
      err => {
        this.userArray = [{}]
        this.userArrayTemp = []
        this.allopportunities.displayerror(err.status);
      }
    );

  }

  checktable() {
    this.selectedName = []
    this.userArray = []
    this.showresults = false;
    this.ownerNewId = ''
    this.ownerNewName = ''
    this.selectedNewOwnerObj = { ownerId: "", Name: "" };
    this.selectedOpp = false
    if ((/^ *$/.test(this.searchopp))) {
      this.showtable = false;
      this.showScrolltable = true;
    }
    else {
      this.showtable = true;
      this.showScrolltable = false;
    }
    this.searchVerApi()
  }
  checkresultstable() {
    debugger;
    this.isLoading =true
    if (this.ownerNewId != "") {
      console.log(this.userArray);
      var checkAccount = false
      if (!this.SearchTextBoolean) {
      
    var uniqueData =  this.selectedName.map(item => item['AccountOwnerName'])
      .filter(
        (value, index, self) => self.indexOf(value) === index && value && value.trim() != ''
      );
        if (uniqueData.length == 1) {
          checkAccount = true
        }
      }
      else if (this.SearchTextBoolean) {
        checkAccount = true
      }


      this.showresults = false;
      var body =

        {
          "Guid": this.ownerNewId ? this.ownerNewId : '',
          "OrderNumbers": []
        }

      if (!this.SearchTextBoolean) {

        for (let i = 0; i < this.selectedName.length; i++) {
          body.OrderNumbers.push(this.selectedName[i].OpportunityId)
        }
      }
      else {
        for (let i = 0; i < this.userArray.length; i++) {
          body.OrderNumbers.push(this.userArray[i].OpportunityId)
        }
      }

      body = {
        "Guid": this.ownerNewId ? this.ownerNewId : '',
        "OrderNumbers": body.OrderNumbers
      }

      console.log(body)
      if (checkAccount) {
        this.allopportunities.checkresultstable(body).subscribe(response => {
          console.log("response1", response)
          if (!response.IsError) {
            if (response.ResponseObject) {
              this.showresults = true;
              var data = []
              if (!this.SearchTextBoolean) {
                data = this.selectedName
              }
              else {
                data = this.userArray
              }
              var date = new Date().toLocaleDateString()

              var curOwner = this.userArray[0].Currentverticalowner
              curOwner = this.userArray[0].Currentverticalowner ? this.userArray[0].Currentverticalowner : this.selectedName[0].Currentverticalowner
              this.tableCount1 = data.length

    
              this.userArray2 = data.map((it, index) => {
                return {
                  "Opportunitynumber": it.Opportunitynumber,
                  "Previousverticalowner": curOwner,
                  "Newverticalowner": this.ownerNewName,
                  // "Newverticalowner":this.ownerNewName,
                  "Changedon": (this.datePipe.transform(date, "dd-MMM-yyyy")),
                  "index": index + 1,
                  "verticalownerid": this.ownerNewId,
                  "OpportunityId": it.OpportunityId
                }
              }
              )
              console.log("userarray", this.userArray)
              console.log("userarray2", this.userArray2)
              //code to update vertical sales owner in overview page
              this.service.GetRedisCacheData('saveOpportunity').subscribe(res => {
                console.log("redis", res)

                if (!res.IsError && res.ResponseObject) {
                  console.log("parsed data", JSON.parse(res.ResponseObject))
                  let oppIdFromSession = "get from code"
                  let dataFromRedis = JSON.parse(res.ResponseObject);
                  if (Array.isArray(dataFromRedis) && dataFromRedis.length > 0) {
                    this.oppArrayList = this.userArray2;
                    console.log("oppArray",this.oppArrayList)
                    console.log("dataFromRedis",dataFromRedis)
                    for (var i = 0; i < this.oppArrayList.length; i++) {
                      for (var j = 0; j < dataFromRedis.length; j++) {
                        console.log(this.oppArrayList[i].OpportunityId == dataFromRedis[j].opportunityId,"validation")
                        if (this.oppArrayList[i].OpportunityId == dataFromRedis[j].opportunityId) {
                         let obj={
                           "Name": this.oppArrayList[i].Newverticalowner,
                           "SysGuid": this.oppArrayList[i].verticalownerid
                         }
                         dataFromRedis[j].VerticalSalesOwner = obj;
                        }
                      }

                    }
                    this.service.SetRedisCacheData(dataFromRedis, 'saveOpportunity').subscribe(res => {
                      if (!res.IsError) {
                        console.log("SUCESS FULL AUTO SAVE")
                      }
                    }, error => {
                      console.log(error)
                    })
                  }
                }
                else {
                  console.log("GET CACHE FAILED");
                }
              })




              //code to update vertical sales owner in overview page

            }
            else {
              this.allopportunities.displayMessageerror(response.Message);
            }
          }
          else {
            this.userArray2 = [{}]
            this.oppArrayList=[]
            this.allopportunities.displayMessageerror(response.Message);
          }
       this.isLoading =false 
       }
          ,
          err => {
       this.isLoading =false 
            
            this.userArray2 = [{}]
            this.oppArrayList=[]
            this.allopportunities.displayerror(err.status);
          }
        );
      }
      else {
        this.isLoading =false
        this.allopportunities.displayMessageerror('Select opportunities of same account');
      }
    }
    else {
      this.isLoading =false
      this.allopportunities.displayMessageerror('Select new vertical owner');
    }
  }
  onChange(event) {
    this.showordertable = !this.showordertable;
  }
  goback() {
    this.service.hidehelpdesknav = true;
    this.service.hidehelpdeskmain = false;
  }
  selectedName = []
  selectedOppName() {

    this.selectedName = this.userArray.filter((it) => (it.isCheccked ? 'true' : 'false') == 'true')
    console.log(this.selectedName)
    if (this.selectedName) {
      if (this.selectedName.length > 0) {
        for (let j = 0; j < this.selectedName.length; j++) {
          this.selectedName[j].index = j + 1;
        }
        this.selectedOpp = true
      }
      else {
        this.selectedOpp = false
      }
    }
    else {
      this.selectedOpp = false
    }

  }

  getValidateUpdate() {

    if ((this.selectedName.length == 0 && !this.SearchTextBoolean) || (this.SearchTextBoolean && this.userArrayTemp.length == 0)) {
      return true;
    }
    else {
      return false;
    }

  }
  performTableChildAction(childActionRecieved): Observable<any> {

    switch (childActionRecieved.action) {


      case 'checkbox': {
        this.selectedOppName();
        return
      }
      case 'selectAll': {
        this.selectedOppName();
        return
      }

    }
  }
}
