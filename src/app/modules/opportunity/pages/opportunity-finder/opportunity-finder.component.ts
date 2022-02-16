import { Component, OnInit ,Inject} from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { Router } from '@angular/router';
import { map, filter, pluck, groupBy, mergeMap, toArray } from 'rxjs/operators';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { DatePipe } from "@angular/common";
import { opportunityFinderHeader} from '@app/core/services';


import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material';
import { OpportunitiesService, DataCommunicationService, linkedLeadNames, linkedLeadsHeaders } from '@app/core';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';
@Component({
  selector: 'app-opportunity-finder',
  templateUrl: './opportunity-finder.component.html',
  styleUrls: ['./opportunity-finder.component.scss']
})
export class OpportunityFinderComponent implements OnInit {
   selectedIpRadio = 1;
   IsActionFixed=true
   IsFreezedColumn = true
   AllContactsRequestbody = {
    "PageSize": this.allopportunities.sendPageSize || 10,
    "RequestedPageNumber": this.allopportunities.sendPageNumber || 1,
    "OdatanextLink": "",
    // "FilterData": this.allopportunities.sendConfigData || []
  }

  


   filterConfigData = {
    OpportunityName: { data: [], recordCount: 0, PageNo:1, NextLink: '' },
    OpportunityNumber: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    Currency: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    AdvisorName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    CreatedOn: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    accountName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    AccountOwnerName: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    GeographyName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    ProposalTypeName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    OpportunityOwnerName: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    statusName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Stage: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    isFilterLoading:false
  };
   isSearchLoader=false;
        ipRadio= [
    { Value: 1, name:'Yes' },
    { Value: 2, name:'No'   },

]
datePipe = new DatePipe("en-US");

    header = {name:"Name", Id:"SysGuid"};
    dataheader={name:"Name",Id:"ProductId"};


    tableTotalCount: number = 0;
    paginationPageNo = {
  "PageSize": 50,
  "RequestedPageNumber": 1,
  "OdatanextLink": "",
 
  
}

 paginationPageNoSearch = {
  "PageSize": 50,
  "RequestedPageNumber": 1,
  "OdatanextLink": "searchTable"
}
  more_clicked;
  showradiobtn: boolean=false;
  all_lead: boolean;
  open_lead: boolean;
  myopen_lead: boolean;
  allopportunity = [];
  // toggleTransition: boolean = true;
  // changedTxt: string = 'Show more';
  userArray: any[];
  countStored;
  showService:string;
  myFilter = [];
showopportunityname:boolean = false;
  selectedAll: any;
  showorder: boolean;
  showopportunity = true;
  allorder: any[];
  constructor( public DataCommunicationService : DataCommunicationService,private EncrDecr: EncrDecrService,
    private allopportunities: OpportunitiesService,
    private router: Router,
    public service: DataCommunicationService,public dialog: MatDialog

  ) {
   }



DaAPi(){
   this.allopportunities.DaAPi().subscribe(response => {
      if( !response.IsError){
     
       }
    else{
    
    } }
    ,  err => {
  });
 }
  opportunityradio(event){
    console.log(event.value);
    if(event.value == "Order"){
      this.showorder= true;
      this.showopportunity = false
    }
    else{
      this.showorder= false;
      this.showopportunity = true ;
    }
  }
filterCheckBox: any = [

    { name: 'Wipro digital', idChecked: false },
    { name: 'service line2', idChecked: false },
    { name: 'service line3', idChecked: false },
    { name: 'service line4', idChecked: false },
    { name: 'service line5', idChecked: false },
  ];

  selectedValues(values){
    console.log(values);
  }




  competitors = [
    { name: 'TCS', idChecked: false },
    { name: 'Infosys', idChecked: false },
    { name: 'Accenture', idChecked: false },
    { name: 'IBM', idChecked: false },
    { name: 'cognizant', idChecked: false },

  ]

  AccountnameArray = [];

errorHandling(response,array){
debugger;
    if( !response.IsError){
        if (response.ResponseObject && (Array.isArray(response.ResponseObject)?response.ResponseObject.length>0:false) ){
  this[array] = response.ResponseObject
  this.DataCommunicationService.loaderhome = false;
  if(array== 'subVerticalName'  || array== 'regionName' || array== 'practiceName'){
  this.createTempData()
      }
        }
      else{
        this[array]=[]
          this.DataCommunicationService.loaderhome = false;
      }
   }
   else{
   this[array]=[];
     this.DataCommunicationService.loaderhome = false;
    this.allopportunities.displayMessageerror(response.Message);
   }
}
deleteCache(){
  this.service.deleteRedisCacheData('opportunityFinder').subscribe(res => {console.log(res)
  this.bindData({'a':''})
}
  )
}

clearData(){
  debugger
    this.service.SetRedisCacheData("empty", 'opportunityFinder').subscribe(res => {

console.log(res)
this.deleteCache()
    
    }
    
    
    )
  
}


   wiproLinkedAGP(data) {
     debugger;
  //  if(!data.searchMatch) {
  //    this.selectedAccNameObj.Name='';
  //    this.selectedAccNameObj.SysGuid=''
  //    this.SelectedAccountArray=[]

  //    }
  //    else{
  //      this.selectedAccNameObj.Name= this.selectedAccNameObjTemp.Name;
  //    this.selectedAccNameObj.SysGuid= this.selectedAccNameObjTemp.SysGuid
  //    this.SelectedAccountArray.push( { 'SysGuid':this.selectedAccNameObj.SysGuid , 'Name':this.selectedAccNameObj.Name } )
  //          this.SelectedAccountArray[0].Id=this.selectedAccNameObj.SysGuid

  //    }
    this.isSearchLoader =true
   let body=
{
    "SearchText": data.searchValue?data.searchValue:'',
    "PageSize":10,
    "RequestedPageNumber": 1,
     "OdatanextLink":this.lookupdata.nextLink,
     "IsFinder": true
}



   this.allopportunities.getAccountSearchData(body).subscribe(response => {
      this.isSearchLoader =false
 this.AccountnameArray = response.ResponseObject

 this.AccountnameArray.forEach(x => {
  (x.Name) ? x.Name = this.getSymbol(x.Name) : '-';
})
  this.lookupdata.TotalRecordCount = response.TotalRecordCount
    this.lookupdata.nextLink = response.OdatanextLink
      if(data.labelName=='accountArr'){

  }
  this.errorHandling(response,'AccountnameArray')
      },
       err => {
         this.DataCommunicationService.loaderhome = false;
     this.allopportunities.displayerror(err.status);
  }
  );
  }



opportunityName:any='';
accountId:string = "";
accountName:string = "";
opportunityStatusName:any='';
serviceLin:any='';

opportunityStatus=[]

practiceNamee='';
verticalNam:any='';
subVerticalNam:any='';
geoNam:any='';
regionNam:any='';
allianceId:string = "";
allianceName:string = "";
competitorNam:any='';
ipId:string = "";
ipName:string = "";




SelectedAccountArray:any=[]

  selectedAccNameObj:any = {SysGuid: "", Name: ""};
  // selectedAccNameObjTemp:any = {SysGuid: "", Name: ""};

  SelectedAccountNameValue(SelectedAccount:any){
   
if(Object.keys(SelectedAccount).length){
this.selectedAccNameObj = SelectedAccount;
this.accountName= this.selectedAccNameObj.Name;
this.accountId= this.selectedAccNameObj.SysGuid;

this.SelectedAccountArray=[]
this.SelectedAccountArray.push(this.selectedAccNameObj);

this.SelectedAccountArray[0].Id = this.selectedAccNameObj.SysGuid;

console.log("Selected Account",this.selectedAccNameObj);
}
else{
this.selectedAccNameObj = {SysGuid: "", Name: ""};
this.accountName= '';
this.accountId= '';
this.SelectedAccountArray=[]
}
this.AppendRedisCache()
  }



  AllianceseArray = [];
  selectedAllianceNameObj:any = {SysGuid: "", Name: ""};
 SelectedIpObj:any = {ProductId: "", Name: ""};
//  selectedAllianceNameObjTemp:any = {SysGuid: "", Name: ""};
//  SelectedIpObjTemp:any = {ProductId: "", Name: ""};

SelectedAllianceArray:any=[]
  SelectedAllianceValue(SelectedAlliance:any){

if(Object.keys(SelectedAlliance).length){
this.selectedAllianceNameObj = SelectedAlliance;
 this.allianceName= this.selectedAllianceNameObj.Name;
this.allianceId= this.selectedAllianceNameObj.SysGuid;
this.SelectedAllianceArray=[]
this.SelectedAllianceArray.push(this.selectedAllianceNameObj);
this.SelectedAllianceArray[0].Id = this.selectedAllianceNameObj.SysGuid
}
else{

this.selectedAllianceNameObj = {SysGuid: "", Name: ""};
this.allianceName= ''
this.allianceId= ''
this.SelectedAllianceArray =[]

}

console.log("Selected Account",this.selectedAllianceNameObj);
this.AppendRedisCache()
  }




     AlliancesContent(data) {
      this.isSearchLoader = true;

//  if(!data.searchMatch) {
//      this.selectedAllianceNameObj.Name='';
//      this.selectedAllianceNameObj.SysGuid=''
//      this.SelectedAllianceArray =[]

//      }
//      else{
//        this.selectedAllianceNameObj.Name= this.selectedAllianceNameObjTemp.Name;
//      this.selectedAllianceNameObj.SysGuid= this.selectedAllianceNameObjTemp.SysGuid
//      this.SelectedAllianceArray.push( { 'SysGuid':this.selectedAllianceNameObj.SysGuid , 'Name':this.selectedAllianceNameObj.Name } )
//            this.SelectedAllianceArray[0].Id=this.selectedAllianceNameObj.SysGuid

//      }
let body=
{
    "SearchText": data.searchValue?data.searchValue:'',
    "SearchType":6,
    "PageSize":10,
    "RequestedPageNumber": 1,
     "OdatanextLink":this.lookupdata.nextLink
}



   this.allopportunities.getAllianceFinderSearchData(body).subscribe(response => {
     this.isSearchLoader = false;
  
  this.AllianceseArray = response.ResponseObject
  this.AllianceseArray.forEach(x => {
    (x.Name) ? x.Name = this.getSymbol(x.Name) : '-';
  })
   this.lookupdata.TotalRecordCount = response.TotalRecordCount
     this.lookupdata.nextLink = response.OdatanextLink

  if(data.labelName=='allianceArr'){

  }
   this.errorHandling(response,'AllianceseArray')

      },
       err => {
      this.isSearchLoader = false;
      this.allopportunities.displayerror(err.status);
  }
  );
  }
  SelectedIpArray:any=[]

SelectedIpValue(SelectedIp:any){
 
 if(Object.keys(SelectedIp).length){
this.SelectedIpObj = SelectedIp;
this.ipName= this.SelectedIpObj.Name;
this.ipId= this.SelectedIpObj.ProductId;
this.SelectedIpArray=[]
this.SelectedIpArray.push(this.SelectedIpObj);

this.SelectedIpArray[0].Id = this.SelectedIpObj.ProductId;
 }
 else{
this.SelectedIpObj =  {ProductId: "", Name: ""};
this.ipName= '';
this.ipId= '';
this.SelectedIpArray =[]
 }
this.AppendRedisCache()
  }
  ipArray=[]

ipContent(data){
// debugger;

  //  if(!data.searchMatch) {
  //    this.SelectedIpObj.Name='';
  //    this.SelectedIpObj.ProductId=''
  //    this.SelectedIpArray   =[]

  //    }
  //    else{
  //      this.SelectedIpObj.Name= this.SelectedIpObjTemp.Name;
  //    this.SelectedIpObj.ProductId= this.SelectedIpObjTemp.ProductId
  //    this.SelectedIpArray.push( { 'ProductId':this.SelectedIpObj.ProductId , 'Name':this.SelectedIpObj.Name } )
  //          this.SelectedIpArray[0].Id=this.SelectedIpObj.ProductId

  //    }


   this.isSearchLoader =true

let body=
{
    "SearchText": data.searchValue?data.searchValue:'',
    "PageSize":10,
    "RequestedPageNumber": 1,
     "OdatanextLink": ""
}



   this.allopportunities.getIpSearchData(body).subscribe(response => {
     this.isSearchLoader =false
     console.log("ipdata",response)
  this.ipArray = response.ResponseObject
  this.ipArray.forEach(x => {
    (x.Name) ? x.Name = this.getSymbol(x.Name) : '-';
  })
 this.lookupdata.TotalRecordCount = response.TotalRecordCount
  this.lookupdata.nextLink = response.OdatanextLink




      if(data.labelName=='ipArr'){

  }

   this.errorHandling(response,'ipArray')

      },
       err => {
      this.DataCommunicationService.loaderhome = false;
      this.allopportunities.displayerror(err.status);
  }
  );


}


serviceLine=[];





     serviceLines() {
          this.DataCommunicationService.loaderhome = true;
   this.allopportunities.serviceLines().subscribe(response => {
    this.errorHandling(response,'serviceLine')

      },
       err => {
            this.DataCommunicationService.loaderhome = false;
     this.allopportunities.displayerror(err.status);
  }
  );
  }

practiceName=[];
serviceId="";


  practice(){
    debugger;
this.serviceId="";
     if(this.serviceLin){
    this.serviceId=this.serviceLin;


              this.DataCommunicationService.loaderhome = true;
   this.allopportunities.practice(this.serviceId).subscribe(response => {
          this.errorHandling(response,'practiceName')   ;
       },
       err => {
    this.allopportunities.displayerror(err.status);
    this.DataCommunicationService.loaderhome = false;
  }
  );
     }
     else{
    this.practiceName =[]
     }
  }


  verticalName=[]
      vertical() {
   this.DataCommunicationService.loaderhome = true;
   this.allopportunities.vertical().subscribe(response => {
    this.errorHandling(response,'verticalName')
      },
       err => {
   this.DataCommunicationService.loaderhome = false;
     this.allopportunities.displayerror(err.status);
  }
  );
  }

   subVerticalName=[]
      subVertical() {
         var obj=null;
         if(this.verticalNam){
          obj=this.verticalNam;

              this.DataCommunicationService.loaderhome = true;


   this.allopportunities.subVertical(obj).subscribe(response => {


      this.errorHandling(response,'subVerticalName')

     },
       err => {
            this.DataCommunicationService.loaderhome = false;
     this.allopportunities.displayerror(err.status);
  }
  );
         }
else{
  this.subVerticalName =[]
}

  }
geoName=[];
  geo(){
       this.DataCommunicationService.loaderhome = true;
  this.allopportunities.geo().subscribe(response => {
          this.errorHandling(response,'geoName')

      },
       err => {
            this.DataCommunicationService.loaderhome = false;
    this.allopportunities.displayerror(err.status);
  }
  );

  }

regionName=[];
  region(){

    var obj=null;
    if(this.geoNam){
     obj=this.geoNam;

       this.DataCommunicationService.loaderhome = true;
  this.allopportunities.region(obj).subscribe(response => {
      this.errorHandling(response,'regionName')
//  this.regionNam=  this.regionName.filter( (it)=> it.SysGuid==this.regionNam ).length>0?this.regionNam:"";

      },
       err => {
            this.DataCommunicationService.loaderhome = false;
 this.allopportunities.displayerror(err.status);
  }
  );
    }
    else{
      this.regionName =[]
    }
  }

competitorName=[];
  competitor(){
       this.DataCommunicationService.loaderhome = true;
  this.allopportunities.competitor().subscribe(response => {
     this.errorHandling(response,'competitorName')

      },
       err => {
            this.DataCommunicationService.loaderhome = false;
      this.allopportunities.displayerror(err.status);
  }
  );


  }


  // AlliancesContent(data) {
  //   var orginalArray = this.allopportunities.getwiproLinkedAGP();
  //   orginalArray.subscribe((x: any[]) => {
  //     return this.AllianceseArray = x.filter(y => y.name.includes(data));
  //   });

  // }




  // onToggleMore() {
  //   this.toggleTransition = !this.toggleTransition;
  //   if (this.toggleTransition) {
  //     this.changedTxt = 'Show less';
  //   } else {
  //     this.changedTxt = 'Show more';
  //   }
  // }
  myString;
  filterBox = {};
  isFilter?: boolean;



  /** Filter header related logic */
  filterapply = false;

  filteredCheckBoxSelected(item, propertName) {

    item.isDatafiltered = !item.isDatafiltered;
    this.myString = propertName;
    if (item.isDatafiltered) {
      this.myFilter.push(item.name);

      this.filterBox = {
        [this.myString]: {
          $or: this.myFilter
        }
      }
    } else {
      this.myFilter = this.myFilter.filter(x => x != item.name);
      if (this.myFilter.length > 0) {
        this.filterapply = true;
        this.filterBox = {
          [this.myString]: {
            $or: this.myFilter
          }
        }

      } else {
        this.filterBox = {};
        this.filterapply = false;
      }


    }



  }



  //filter starts

  check: boolean = false;
  searchitem;
  headerData;
  headerName;

  titleShow(name, index) {

    this.headerName = name;
  }

  filteredData(item) {
    this.searchitem = '';

    this.filterBox = {};
    this.myFilter = [];
    this.headerData.forEach(element => {
      if (element.name == item.name) {
        element.isFilter = !element.isFilter;
      }
      else {
        element.isFilter = false;
      }
    });


    if (item.isFilter) {

      var items = [];
      var pluckedItem = from(this.userArray).pipe(pluck(item.name)).subscribe(x => {
        if (typeof x == 'object') {
          items.push(x[0])

        } else {
          items.push(x)
        }


      });

      var unique = {};
      var distinct = [];
      items.forEach(function (x) {
        if (!unique[x]) {
          distinct.push({ name: x, isDatafiltered: false });
          unique[x] = true;
        }
      });
      this.filterCheckBox = distinct;
    }
  }
  Dummuoverlay: boolean = false;

  showcheckbox(item) {
    if (!item.isFilter && !item.hideFilter) {

      if (this.myString != item.name) {
        this.myString = item.name;
        this.filteredData(item);
        this.Dummuoverlay = true;
      }
      else {
        item.isFilter = true;
        this.Dummuoverlay = true;
      }

    }
    else {
      item.isFilter = false;
      this.Dummuoverlay = false;
    }


  }

  stop(e) {
    e.stopImmediatePropagation();
  }

  filterSearchClose() {
    this.searchitem = "";
  }




  //filter ends

  /** Filter logic ends */
//   goBack() {
//    this.router.navigate(['/opportunity/allopportunity']);
//     // window.history.back();
 
//  }

 goBack() {
    let path = this.allopportunities.getSession('path');
    if(path ){
      sessionStorage.removeItem('path');
      this.router.navigate([path]);
    }
  }

      getAllContactsList(reqBody, isConcat, isSearch, isLoader) {
     this.tableData(this.AllContactsRequestbody);
  }

  getTableFilterData(tableData,start,pageNo,pageSize): Array<any> {
 
    if (tableData) {
      if (tableData.length > 0) {
    this.IsActionFixed= true
   this. IsFreezedColumn = true
        var tableCollection =tableData.map((it,index)=> 
                       { return{
 "OpportunityName": it.OpportunityName? this.getSymbol(it.OpportunityName):'NA',
 "OpportunityNumber": it.OpportunityNumber?it.OpportunityNumber:'NA',
"AdvisorName": it.AdvisorName?it.AdvisorName:'NA',
"CreatedOn": it.CreatedOnFormat?it.CreatedOnFormat:'NA' ,
"accountName": it.Account.Name?(it.Account.Name).trim():'NA',
"AccountOwnerName":  it.Account.OwnerName?it.Account.OwnerName:'NA',
"GeographyName":it.GeographyName?it.GeographyName:'NA' ,
"ProposalTypeName": it.ProposalTypeName?it.ProposalTypeName:'NA',
"OpportunityOwnerName":it.OpportunityOwnerName?it.OpportunityOwnerName:'NA',
"statusName":it.StatusName?it.StatusName:'NA' ,
"Stage": it.Stage?it.Stage:'NA' ,
"opportunityId":it.OpportunityId?it.OpportunityId:'',
"AccountId":it.AccountId?it.AccountId:'',
"index": it.index,
"accessactivationBtnVisibility" :  it.IsGainAccess, 
  disableRoute:it.IsGainAccess?false:true,
  'StatusId': it.StatusId,
    "AdvisorOwnerIdGuid" : it.AdvisorOwnerIdGuid?it.AdvisorOwnerIdGuid:'',
     'IsAppirioFlag': it.IsAppirioFlag?it.IsAppirioFlag:false,
     'EstimatedTCV':it.EstimatedTCV
     }
                           }
                           );

      if(pageNo == 1){
        this.allopportunity = []
       this.allopportunity = tableCollection
     }
     else{
      this.allopportunity = this.allopportunity.concat(tableCollection)  
     
     }
this.allopportunity = this.allopportunity.map(addColumn => {
    let newColumn = Object.assign({}, addColumn);
     if( addColumn.StatusId==1  || addColumn.StatusId=='1'){
  newColumn.statusclass = "proposed";
     }
      else if( addColumn.StatusId==3  || addColumn.StatusId=='3'){
 newColumn.statusclass = "approved";
      }
     else if( addColumn.StatusId==2  || addColumn.StatusId=='2'){
 newColumn.statusclass = "low";
     }
     else if( addColumn.StatusId==184450000  || addColumn.StatusId=='184450000'){
newColumn.statusclass = "rejected";
     }
          else{
newColumn.statusclass = "rejected";
          }
      
    return newColumn;
  });  
  for(let i=(start-1) ; i< this.allopportunity.length  ; i++){
  var tcv = this.getTcv( this.allopportunity[i].EstimatedTCV )
 this.allopportunity[i].Currency =  tcv ||  tcv==='0' ?tcv:'NA'
} 

  for(let i=(start-1) ; i< this.allopportunity.length  ; i++){

  
   if(this.allopportunities.getSession('IsHelpRoleFullAccess') || !this.allopportunities.getSession('IsGainAccessRole') ){
this.allopportunity[i].accessactivationBtnVisibility =  true;
// this.allopportunity[i].disableRoute =  false;
 }
 
}

  for(let i=(start-1) ; i< this.allopportunity.length  ; i++){

  
   if(this.allopportunities.getSession('IsHelpRoleFullAccess')  ){
// this.allopportunity[i].accessactivationBtnVisibility =  true;
this.allopportunity[i].disableRoute =  false;
 }
 
}

  for(let i=(start-1) ; i< this.allopportunity.length  ; i++){
 
if(this.allopportunity[i].IsAppirioFlag  ){
   this.allopportunity[i].accessactivationBtnVisibility = true;
   
}
    }

this.IsActionFixed= true
this.IsFreezedColumn = true
       var count=0;
    
  for(let j=(start-1) ; j< this.allopportunity.length  ; j++){
   
   
    if(this.allopportunity[j].accessactivationBtnVisibility   ){
     
      count++
      this.allopportunity[j].actionButton =false;
    }
    else{
      this.allopportunity[j].actionButton =true;
    }
    if(count==tableCollection.length){
      this.IsActionFixed= false
      this.IsFreezedColumn =false
   
    }
  

   }

      } else {
        return [{}]
      }
    } else {
      return [{}]
    }
  }




  GetAppliedFilterData(data) {


   return {
    "OpportunityNames": this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityName'], 'name'),
    "OpportunityIds": this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityNumber'], 'name'),
    // "TCVs":this.service.pluckParticularKey(data.filterData.filterColumn['Currency'], 'Name'),
    "TCVs":[],
    "AdvisorIds": this.service.pluckParticularKey(data.filterData.filterColumn['AdvisorName'], 'name'),
    // 'CreatedOnDates':this.service.pluckParticularKey(data.filterData.filterColumn['CreatedOn'], 'Name'),
    'AccountIds':this.service.pluckParticularKey(data.filterData.filterColumn['accountName'], 'name'),
    "AccountOwneres": this.service.pluckParticularKey(data.filterData.filterColumn['AccountOwnerName'], 'name'),
   
   "ProposalTypeIds":this.service.pluckParticularKey(data.filterData.filterColumn['ProposalTypeName'], 'id'),
    "OpportunityOwnerIds":this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityOwnerName'], 'name'),
    "StatusIds":this.service.pluckParticularKey(data.filterData.filterColumn['statusName'], 'id'),
    "StageIds":this.service.pluckParticularKey(data.filterData.filterColumn['Stage'], 'id'),
   "SortBy":this.service.pluckParticularKey(opportunityFinderHeader.filter(x=>x.name==data.filterData.sortColumn),'SortId')[0],
   "GeographyIds": this.service.pluckParticularKey(data.filterData.filterColumn['GeographyName'], 'name'),
   "IsDesc":(data.filterData.sortColumn!='')?!data.filterData.sortOrder:false, 
  "opportunityStatus": this.opportunityStatusName,
     "SearchOppo": this.searchOppo,
    "serviceLineId": this.serviceLin,
    "practiceId": this.practiceNamee,
    "verticalId": this.verticalNam,
      "subVerticalId": this.subVerticalNam,
    
    "regionId": this.regionNam,
    "accountName": this.accountName,
    "parrentAccountId": this.accountId,
    "accountNumber": this.accountName,
    "wiproAccountCompetitorId": this.competitorNam,
    "wiproAllianceAccountId": this.allianceId,
    "opportunityIpId": this.ipId,
      "pageNumber": this.AllContactsRequestbody.RequestedPageNumber,
    "pageCount": this.AllContactsRequestbody.PageSize,
     "UserId": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
      "StartFromDate": this.startFilterDate?(this.datePipe.transform(this.startFilterDate, "yyyy-MM-dd")):undefined,
      "StartToDate": this.endFilterDate?(this.datePipe.transform(this.endFilterDate, "yyyy-MM-dd")):undefined

  
}


  }


    GetAppliedColumnFilterData(data) {

  return {
    "OpportunityNames": this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityName'], 'name'),
    "OpportunityIds": this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityNumber'], 'name'),
    // "TCVs":this.service.pluckParticularKey(data.filterData.filterColumn['Currency'], 'Name'),
    "TCVs":[],   
    "AdvisorIds": this.service.pluckParticularKey(data.filterData.filterColumn['AdvisorName'], 'name'),
    // 'CreatedOnDates':this.service.pluckParticularKey(data.filterData.filterColumn['CreatedOn'], 'Name'),
    'AccountIds':this.service.pluckParticularKey(data.filterData.filterColumn['accountName'], 'name'),
    "AccountOwneres": this.service.pluckParticularKey(data.filterData.filterColumn['AccountOwnerName'], 'name'),
    "ProposalTypeIds":this.service.pluckParticularKey(data.filterData.filterColumn['ProposalTypeName'], 'id'),
    "OpportunityOwnerIds":this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityOwnerName'], 'name'),
    "StatusIds":this.service.pluckParticularKey(data.filterData.filterColumn['statusName'], 'id'),
    "StageIds":this.service.pluckParticularKey(data.filterData.filterColumn['Stage'], 'id'),
   "GeographyIds": this.service.pluckParticularKey(data.filterData.filterColumn['GeographyName'], 'name'),
       "StartFromDate": this.startFilterDate?(this.datePipe.transform(this.startFilterDate, "yyyy-MM-dd")):undefined,
    "StartToDate": this.endFilterDate?(this.datePipe.transform(this.endFilterDate, "yyyy-MM-dd")):undefined
}  }

  CallListDataWithFilters(data) {

    console.log(data)
    let reqparam = this.GetAppliedFilterData({ ...data })
    this.allopportunities.filterLisingFinderrApi(reqparam).subscribe(res => {
      console.log(res)
      if (!res.IsError) {
        if (res.ResponseObject.length > 0) {
          const ImmutabelObj = Object.assign({}, res)
          const perPage = reqparam.pageCount;
          const start = ((reqparam.pageNumber - 1) * perPage) + 1;
          let i = start;
          const end = start + perPage - 1;
          res.ResponseObject.map(res => {
            if (!res.index) {
              res.index = i;
              i = i + 1;
            }
          })
         this.getTableFilterData(res.ResponseObject,start,reqparam.pageNumber,reqparam.pageCount)
          this.AllContactsRequestbody.OdatanextLink = res.OdatanextLink?res.OdatanextLink:''
          this.tableTotalCount = res.TotalRecordCount
        } else {
          this.allopportunity = [{}]
          this.tableTotalCount = 0
        }
      } else {
        this.allopportunity = [{}]
        this.tableTotalCount = 0
        // this.errorMessage.throwError(res.Message)
      }
    });
  }
  RemoveSelectedItems(array1, array2, key) {
    return array1.filter(item1 =>
      !array2.some(item2 => (item2[key] === item1[key])))
  }

 generateFilterConfigData(data, headerName,isConcat, isServiceCall?) {
   if(data.filterData.headerName=='CreatedOn'){

   }
   else{
    if (isServiceCall) {
      let useFulldata = {
        headerName:headerName,
        SearchText: data.filterData.columnSerachKey || data.filterData.columnSerachKey===0 || data.filterData.columnSerachKey==='0'?data.filterData.columnSerachKey:'',
        RequestedPageNumber:this.filterConfigData[headerName].PageNo,
        PageSize:10,
        OdatanextLink:this.filterConfigData[headerName].NextLink,
      }


      this.allopportunities.getFinderFilterData({ ...data,useFullData:useFulldata, columnFIlterJson: this.GetAppliedColumnFilterData(data) , isService:true , UserId: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
       "opportunityName": this.opportunityName?this.opportunityName:'',
    "opportunityNumber": this.opportunityName?this.opportunityName:'',
    "opportunityStatus": this.opportunityStatusName?this.opportunityStatusName:'',
    "serviceLineId": this.serviceLin?this.serviceLin:'',
    "practiceId": this.practiceNamee?this.practiceNamee:'',
    "verticalId": this.verticalNam?this.verticalNam:'',
    "subVerticalId": this.subVerticalNam?this.subVerticalNam:'',
    "geograpyId": this.geoNam?this.geoNam:'',
    "regionId": this.regionNam?this.regionNam:'',
    "accountName": this.accountName?this.accountName:'',
    "parrentAccountId": this.accountId?this.accountId:'',
    "accountNumber": this.accountName?this.accountName:'',
    "wiproAccountCompetitorId": this.competitorNam?this.competitorNam:'',
    "wiproAllianceAccountId": this.allianceId?this.allianceId:'',
    'SearchOppo':this.searchOppo?this.searchOppo:'',

    "opportunityIpId": this.ipId?this.ipId:'' }).subscribe(res => {
        this.filterConfigData.isFilterLoading=false;
        this.filterConfigData[headerName] = {
          data:(isConcat)?this.filterConfigData[headerName]["data"].concat(res.ResponseObject):res.ResponseObject,
             recordCount: res.TotalRecordCount,
             NextLink:  res.OdatanextLink?res.OdatanextLink:'',
             PageNo:res.CurrentPageNumber?res.CurrentPageNumber:res.PageSize
          }
         data.filterData.filterColumn[headerName].forEach(res => {
          let index;
          if (headerName == 'Currency') {
            index = this.filterConfigData[headerName].data.findIndex(x => x.Name == res.Name);
          } 
          else if (headerName == 'CreatedOn') {
            index = this.filterConfigData[headerName].data.findIndex(x => x.Name == res.Name);
          }
          else {
            index = this.filterConfigData[headerName].data.findIndex(x => x.name == res.name);
          }
          if (index !== -1) {
            this.filterConfigData[headerName].data[index].isDatafiltered = true
          }
        });
      });
    } else {
      this.filterConfigData.isFilterLoading=false;
      if (data.filterData.filterColumn[headerName].length > 0) {
        this.filterConfigData[headerName]["data"] = this.RemoveSelectedItems(this.filterConfigData[headerName]["data"], data.filterData.filterColumn[headerName], 'id').concat(data.filterData.filterColumn[headerName])
      }
    }
  }
}

  CheckFilterServiceFlag(data, headerName): boolean {

    if (data) {
      if (data.action != "columnFilter" && data.filterData.isApplyFilter) {
        return false
      } else if (data.action == "columnFilter" && data.filterData.columnSerachKey == '' && this.filterConfigData[headerName]["data"].length <= 0) {
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

GetColumnFilters(data) {

    if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName
          this.filterConfigData[headerName].PageNo=1
        this.filterConfigData[headerName].data=[]
        this.filterConfigData[headerName].NextLink=''
        this.generateFilterConfigData(data, headerName,false, this.CheckFilterServiceFlag(data, headerName))
      } else {
        if (data.filterData.isApplyFilter && this.service.CheckFilterFlag(data)) {
          this.AllContactsRequestbody.OdatanextLink=''
          this.AllContactsRequestbody.RequestedPageNumber=1

          this.AllContactsRequestbody.PageSize = this.paginationPageNo.PageSize
          this.CallListDataWithFilters(data)
        } else {

          this.AllContactsRequestbody.OdatanextLink=''
          this.AllContactsRequestbody.RequestedPageNumber=1
          this.AllContactsRequestbody.PageSize = this.paginationPageNo.PageSize
          this.getAllContactsList(this.AllContactsRequestbody, true, false, false);
        }
      }
    }
  }

  
 GetColumnSearchFilters(data){
  
    let headerName = data.filterData.headerName
    this.AllContactsRequestbody.OdatanextLink=''
    this.filterConfigData[headerName].PageNo=1
    this.filterConfigData[headerName].NextLink=''
    this.generateFilterConfigData(data,headerName,false,true)

  }

  LoadMoreColumnFilter(data){

    let headerName = data.filterData.headerName
     this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    this.generateFilterConfigData(data,headerName,true,true)
  }

startFilterDate=''
endFilterDate=''

clearAllFilter(pageSize){
  


      this.getAllContactsList(this.AllContactsRequestbody, true, false, false);
  }
  isLoading = false;

getRoleAPi(rec){
  
        this.allopportunities.accessModifyApi(rec.objectRowData[0].AdvisorOwnerIdGuid?rec.objectRowData[0].AdvisorOwnerIdGuid:'',localStorage.getItem('userEmail')).subscribe(res => {
      if( !res.IsError){

        if(res.ResponseObject.FullAccess){
    this.allopportunities.setSession('roleObj',res.ResponseObject); 
                 this.allopportunities.setSession('IsPreSaleAndRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsPreSaleAndRole:false)
                 this.allopportunities.setSession('IsDeliverySpocRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsDeliverySpocRole:false)
       this.allopportunities.setSession('IsGainAccess',res.ResponseObject.IsGainAccess?res.ResponseObject.IsGainAccess:false)
       this.allopportunities.setSession('FullAccess',res.ResponseObject.FullAccess?res.ResponseObject.FullAccess:false); 
   

       this.allopportunities.clearSession("smartsearchData");
   this.allopportunities.setSession('orderId','');
   this.allopportunities.setSession('IsAmendment', false);
   this.allopportunities.setSession('BFMNavagationFlag',false);
   this.allopportunities.setSession('opportunityName',rec.objectRowData[0].OpportunityName? this.getSymbol( rec.objectRowData[0].OpportunityName):'')
this.allopportunities.setSession('AdvisorOwnerId',rec.objectRowData[0].AdvisorOwnerIdGuid?rec.objectRowData[0].AdvisorOwnerIdGuid:'')
  

 this.allopportunities.setSession('opportunityId',rec.objectRowData[0].opportunityId?rec.objectRowData[0].opportunityId:'')
   this.allopportunities.setSession('IsAppirioFlag',rec.objectRowData[0].IsAppirioFlag);
      this.DaAPi()
      this.isLoading = true;
      this.router.navigate(['/opportunity/opportunityview']); 

        }

       else{
           this.allopportunities.setSession('roleObj',res.ResponseObject); 
 
         this.allopportunities.setSession('AdvisorOwnerId',rec.objectRowData[0].AdvisorOwnerIdGuid?rec.objectRowData[0].AdvisorOwnerIdGuid:'')
 
       this.allopportunities.setSession('IsPreSaleAndRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsPreSaleAndRole:false)
       this.allopportunities.setSession('IsDeliverySpocRole',res.ResponseObject.UserRoles?res.ResponseObject.UserRoles.IsDeliverySpocRole:false)
       this.allopportunities.setSession('IsGainAccess',res.ResponseObject.IsGainAccess?res.ResponseObject.IsGainAccess:false)
       this.allopportunities.setSession('FullAccess',res.ResponseObject.FullAccess?res.ResponseObject.FullAccess:false); 
    this.allopportunities.setSession('opportunityId',rec.objectRowData[0].opportunityId?rec.objectRowData[0].opportunityId:'')
this.allopportunities.setSession('opportunityName',rec.objectRowData[0].OpportunityName?this.getSymbol( rec.objectRowData[0].OpportunityName) :'')

       this.allopportunities.clearSession("smartsearchData");
   this.allopportunities.setSession('orderId','');
   this.allopportunities.setSession('IsAmendment', false);
   this.allopportunities.setSession('BFMNavagationFlag',false);

   
          this.allopportunities.setSession('accessData',res.ResponseObject);
   this.allopportunities.setSession('IsAppirioFlag',rec.objectRowData[0].IsAppirioFlag);
          this.DaAPi()
          this.router.navigate(['/opportunity/opportunityview']); 

      }
      }
  else{
     this.allopportunities.displayMessageerror(res.Message);
  } 
 }
    ,
       err => {
       
    this.allopportunities.displayerror(err.status);
  }
  );
 
 
}
getRoleGainApi(rec){
      this.allopportunities.roleApi().subscribe(response => {
      if( !response.IsError){
         this.allopportunities.setSession( 'IsGainAccessRole', response.ResponseObject.IsGainAccessRole?response.ResponseObject.IsGainAccessRole:false)
         this.allopportunities.setSession( 'IsMarketingFunctionAndRole', response.ResponseObject.IsMarketingFunctionAndRole?response.ResponseObject.IsMarketingFunctionAndRole:false)
         this.allopportunities.setSession( 'IsHelpRoleFullAccess', response.ResponseObject.IsHelpRoleFullAccess?response.ResponseObject.IsHelpRoleFullAccess:false)
        this.allopportunities.setSession('opportunityId',rec.objectRowData[0].opportunityId?rec.objectRowData[0].opportunityId:'')
  

        
      //  if( response.ResponseObject.FullAccess ){
       
      //  }
  //     //  else{
  //   this.allopportunities.clearSession("smartsearchData");
  //   this.allopportunities.setSession('orderId','');
  //  this.allopportunities.setSession('IsAmendment', false);
  //  this.allopportunities.setSession('BFMNavagationFlag',false);

     this.getRoleAPi(rec)

    
      //  }
      }
  else{
     this.allopportunities.displayMessageerror(response.Message);
  } 
 }
    ,
       err => {
        this.allopportunities.displayerror(err.status);
}
  )
}

searchData =false
SearchtableData(paginationPageNo){
 this.searchData= true
   if(this.searchData){
        this.searchOppo =''
          this.allopportunity =[]
      this.tableTotalCount=0
      }
 this.tableData(paginationPageNo) 
}
  performTableChildAction(childActionRecieved): Observable<any> {
    this.searchData =false;
     this.startFilterDate = ''
     this.endFilterDate =''
    if(childActionRecieved.filterData.filterColumn.CreatedOn.length>0){
     this.startFilterDate = childActionRecieved.filterData.filterColumn.CreatedOn?childActionRecieved.filterData.filterColumn.CreatedOn[0].filterStartDate.toLocaleString():''
     this.endFilterDate =  childActionRecieved.filterData.filterColumn.CreatedOn?childActionRecieved.filterData.filterColumn.CreatedOn[0].filterEndDate.toLocaleString():''
    }
    console.log(childActionRecieved,'childActionRecieved');
    var actionRequired = childActionRecieved;
    switch (actionRequired.action) {
      case 'ClearAllFilter': {
        this.clearAllFilter(childActionRecieved.pageData.itemsPerPage);
        return
      }
    
      case 'OpportunityName': {
        this.getRoleGainApi(childActionRecieved);
        return
      }


       case "columnFilter": {
        this.GetColumnFilters(childActionRecieved);
        return;
      }
      case 
      "columnSearchFilter":{
        this.GetColumnSearchFilters(childActionRecieved);
        return;
      }
      case 'loadMoreFilterData':{
        this.LoadMoreColumnFilter(childActionRecieved);
        return;
      }
       case 'sortHeaderBy' :{
        this.AllContactsRequestbody.OdatanextLink=''
        this.AllContactsRequestbody.RequestedPageNumber=1
         this.AllContactsRequestbody.PageSize = this.paginationPageNo.PageSize
        this.CallListDataWithFilters(childActionRecieved);
        return;
      }
       case 'search':
      {

       this.searchOppo= actionRequired.objectRowData
       this.paginationPageNo = {
      "PageSize": actionRequired.pageData.itemsPerPage,
      "RequestedPageNumber":  1,
      "OdatanextLink": ""
    }
   
        this.AllContactsRequestbody.PageSize= actionRequired.pageData.itemsPerPage
    this.AllContactsRequestbody.RequestedPageNumber=  1
      if (this.service.checkFilterListApiCall(childActionRecieved)) {
        // filter api call
        this.CallListDataWithFilters(childActionRecieved);
             return;
        
      } else {
        // list api call
   this.tableData(this.paginationPageNo);
             return;
     
      }

      }

      case 'convertOpportunity': {
        return of('nurture Trigger');
      }

      // case 'Name': {
      //   this.router.navigate(['/opportunity/opportunityview']);
      // }

       case 'gain': {
     this.roleApi(actionRequired)
      }
    }
  }

  roleApi(actionRequired){

console.log(this.allopportunities.getSession('IsGainAccessRole'),'roleroleapi')
             if(  this.allopportunities.getSession('IsGainAccessRole') ){
          this.openGainModal(actionRequired)
         }
         else{
           this.allopportunities.displayMessageerror("Permission to gain access denied.");
         }



  }


  openGainModal(actionRequired){



      this.DataCommunicationService.loaderhome = true;
     this.allopportunities.checkAccess(actionRequired.objectRowData[0].AccountId ).subscribe(response => {
      if( !response.IsError){

      var checkAccess= response.ResponseObject.toUpperCase().includes("WRITEACCESS");
      if(!checkAccess){
        this.getTemplateAccount('Account (Read Write)',actionRequired,checkAccess);

      }
      else{
        this.getTemplateOpportunity("Opportunity (Read - Write)",actionRequired,checkAccess);


        }
       }
  else{
       this.DataCommunicationService.loaderhome = false;
  this.allopportunities.displayMessageerror(response.Message);
  }
this.DataCommunicationService.loaderhome = false;
 }
    ,
       err => {
            this.DataCommunicationService.loaderhome = false;
    this.allopportunities.displayerror(err.status);
  }
  );

}

templateAccountId='';
templateOpportunityId=';'


callFilterAPI(data,paginationPageNo) {
    if (data.filterData.order.length > 0 ||  data.filterData.sortColumn ) {
      this.CallListDataWithFilters(data);
    }
    else {
       this.tableData(paginationPageNo);
    
    }
  }
getTemplateOpportunity(data,actionRequired,checkAccess){
   this.DataCommunicationService.loaderhome = true;
this.allopportunities.getTemplate(data).subscribe(response => {
 if( !response.IsError){
  this.templateOpportunityId = response.ResponseObject.Teamtemplateid
   const dialogRef = this.dialog.open(GainAccess, {
     width: '420px',
      data: { data:actionRequired.objectRowData[0], info: checkAccess ,templateAccountId: this.templateAccountId, templateOpportunityId:this.templateOpportunityId, allOpportunity : this.allopportunity }

    });

dialogRef.afterClosed().subscribe(result => {

  console.log(result,'result');

//     this.paginationPageNo = {
//   "PageSize": 50,
//   "RequestedPageNumber": 1,
//   "OdatanextLink": ""
// }
  
   this.callFilterAPI(actionRequired,this.paginationPageNo);


  });


}
    else{
  this.allopportunities.displayMessageerror(response.Message);
    }
       this.DataCommunicationService.loaderhome = false;
      },
       err => {
            this.DataCommunicationService.loaderhome = false;
     this.allopportunities.displayerror(err.status);
  }
  );

}

getTemplateAccount(data,actionRequired,checkAccess){
  this.DataCommunicationService.loaderhome = true;
 this.allopportunities.getTemplate(data).subscribe(response => {
    if( !response.IsError){
   this.templateAccountId = response.ResponseObject.Teamtemplateid
     this.getTemplateOpportunity("Opportunity (Read - Write)",actionRequired,checkAccess)

 }
  else{
  this.allopportunities.displayMessageerror(response.Message);
  }
this.DataCommunicationService.loaderhome = false;
 },
       err => {
         this.DataCommunicationService.loaderhome = false;
    this.allopportunities.displayerror(err.status);
  }
  );
}

valueChange(e){
  this.selectedIpRadio = e.value;
  this.AppendRedisCache()
 
  if(e.value==2){
    this.ipName="";
    this.ipId="";
  }
}
//data



// var b=A.ResponseObject.map((it)=>
//                            { return{
//  "OpportunityName": it.OpportunityName==null?" ":it.OpportunityName,

// "Account": it.Account.Name,
// "Currency": it.TransactionCurrencyValue,
// "EstTCV": it.EstimatedTCV,
// "Estclosuredate": it.Estclosuredate,
// "ID": it.OpportunityId,
// "Owner": it.AccountOwnerName,
// "ProposalType":it.ProposalTypeName ,
// "Stage": it.Stage,
// "Status":it.StatusName ,
// "Type":it.OpportunityType ,
// "Vertical":it.Vertical
//                            }
//                            }
//                            );

//data

///request


// {

//   "opportunityName": "opp",

//   "opportunityNumber": "test",

//   "opportunityStatus": null,

//   "serviceLineId": null,

//   "practiceId": null,

//   "verticalId": null,

//   "subVerticalId": null,

//   "geograpyId": null,

//   "regionId": null,

//   "accountName": null,

//   "parrentAccountId": null,

//   "accountNumber": null,

//   "wiproAccountCompetitorId": null,

//   "wiproAllianceAccountId": null,

//   "opportunityIpId": null,  "pageNumber": 1,

//   "pageCount": 1

// }


/// request

searchOppo='';

getTcv(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    }

     tableData(paginationPageNo) {
       debugger;
    
    
    
 
       if( paginationPageNo.OdatanextLink =='searchTable'  )
       {
          paginationPageNo.RequestedPageNumber = 1,
          paginationPageNo.PageSize = 50
          this.paginationPageNo.RequestedPageNumber = this.paginationPageNoSearch.RequestedPageNumber 
          this.paginationPageNo.PageSize = this.paginationPageNoSearch.PageSize 
          


          this.paginationPageNo={
            RequestedPageNumber:1,
            PageSize:50,
            OdatanextLink:''
          }
       }


       this.DataCommunicationService.loaderhome = true;
       this.showopportunityname=true;
       console.log("selectedradio",this.selectedIpRadio)
       if(this.selectedIpRadio==2){
       this.ipId="";
       }
  console.log(this.ipId?this.ipId:null,'ipi');

 var data={
  "SearchOppo": this.searchOppo  ,
  "opportunityName": this.opportunityName,
  "opportunityNumber": this.opportunityName,
  "opportunityStatus": this.opportunityStatusName,
  "serviceLineId":this.serviceLin ,
  "practiceId": this.practiceNamee,
  "verticalId": this.verticalNam,
  "subVerticalId": this.subVerticalNam,
  "geograpyId": this.geoNam,
  "regionId": this.regionNam,
  "accountName": this.accountName,
  "parrentAccountId": this.accountId,
  "accountNumber": this.accountName,
  "wiproAccountCompetitorId": this.competitorNam,
  "wiproAllianceAccountId":this.allianceId ,
  "opportunityIpId":  this.ipId?this.ipId:null, 
  "pageNumber": paginationPageNo.RequestedPageNumber,
  "pageCount": paginationPageNo.PageSize,
  "UserId":this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
}

   this.allopportunities.tableData(data).subscribe(response => {
 debugger;
     if(! response.IsError ){
        if (response.ResponseObject && (Array.isArray(response.ResponseObject)?response.ResponseObject.length>0:false) ){




   this.tableTotalCount = response.TotalRecordCount;
     const startIndex = ((paginationPageNo.RequestedPageNumber - 1) * paginationPageNo.PageSize) + 1
   var tableCollection =response.ResponseObject.map((it,index)=>
                       { return{
 "OpportunityName": it.OpportunityName?this.getSymbol( it.OpportunityName ):'NA',
 "OpportunityNumber": it.OpportunityNumber?it.OpportunityNumber:'NA',
"AdvisorName": it.AdvisorName?it.AdvisorName:'NA',
"CreatedOn": it.CreatedOnFormat?it.CreatedOnFormat:'NA' ,
"accountName": it.Account.Name?(it.Account.Name).trim():'NA',
"AccountOwnerName":  it.Account.OwnerName?it.Account.OwnerName:'NA',
"GeographyName":it.GeographyName?it.GeographyName:'NA' ,
"ProposalTypeName": it.ProposalTypeName?it.ProposalTypeName:'NA',
"OpportunityOwnerName":it.OpportunityOwnerName?it.OpportunityOwnerName:'NA',
"statusName":it.StatusName?it.StatusName:'NA' ,
"Stage": it.Stage?it.Stage:'NA' ,
"opportunityId":it.OpportunityId?it.OpportunityId:'',
"AccountId":it.AccountId?it.AccountId:'',
"index":startIndex + index,
"accessactivationBtnVisibility" :  it.IsGainAccess,
  'StatusId': it.StatusId?it.StatusId:'',
  disableRoute:it.IsGainAccess?false:true,
  "AdvisorOwnerIdGuid" : it.AdvisorOwnerIdGuid?it.AdvisorOwnerIdGuid:'',
   'IsAppirioFlag': it.IsAppirioFlag?it.IsAppirioFlag:false,
   'EstimatedTCV':it.EstimatedTCV
     }
                           }
                           );


 if(paginationPageNo.RequestedPageNumber == 1){
        this.allopportunity = []
       this.allopportunity = tableCollection
     }
     else{
      this.allopportunity = this.allopportunity.concat(tableCollection)  
     
     }

this.allopportunity = this.allopportunity.map(addColumn => {
    let newColumn = Object.assign({}, addColumn);
     if( addColumn.StatusId==1  || addColumn.StatusId=='1'){
  newColumn.statusclass = "proposed";
     }
      else if( addColumn.StatusId==3  || addColumn.StatusId=='3'){
 newColumn.statusclass = "approved";
      }
     else if( addColumn.StatusId==2  || addColumn.StatusId=='2'){
 newColumn.statusclass = "low";
     }
     else if( addColumn.StatusId==184450000  || addColumn.StatusId=='184450000'){
newColumn.statusclass = "rejected";
     }
          else{
newColumn.statusclass = "rejected";
          }

    return newColumn;
  });
  for(let i=(startIndex-1) ; i< this.allopportunity.length  ; i++){
    if(this.allopportunities.getSession('IsHelpRoleFullAccess') || !this.allopportunities.getSession('IsGainAccessRole') ){
this.allopportunity[i].accessactivationBtnVisibility =  true;
 }

}

  for(let i=(startIndex-1) ; i< this.allopportunity.length  ; i++){
     if(this.allopportunities.getSession('IsHelpRoleFullAccess')  ){
this.allopportunity[i].disableRoute =  false;
 }

}

  for(let i=(startIndex-1) ; i< this.allopportunity.length  ; i++){
  var tcv = this.getTcv( this.allopportunity[i].EstimatedTCV )
 this.allopportunity[i].Currency =  tcv ||  tcv==='0' ?tcv:'NA'
}
 

  for(let i=(startIndex-1) ; i< this.allopportunity.length ; i++){
   
if(this.allopportunity[i].IsAppirioFlag  ){
   this.allopportunity[i].accessactivationBtnVisibility = true;
   
}
    }

  this.IsActionFixed= true
  this.IsFreezedColumn = true
  var count=0;
    
  for(let j=(startIndex-1) ; j< this.allopportunity.length  ; j++){
   
   
    if(this.allopportunity[j].accessactivationBtnVisibility ){
      count++
      this.allopportunity[j].actionButton =false;
    }
    else{
      this.allopportunity[j].actionButton =true;
    }
    if(count== tableCollection.length){
      this.IsActionFixed= false
      this.IsFreezedColumn = false
     
    }
  }

    }
     else{
this.tableTotalCount=0
 this.allopportunity=[{}];
     }


}
else{
   this.allopportunity=[{}];
  this.tableTotalCount=0
      this.allopportunities.displayMessageerror(response.Message);
}
this.DataCommunicationService.loaderhome = false;
},
       err => {
         this.DataCommunicationService.loaderhome = false;
         this.tableTotalCount = 0;
          this.allopportunity=[{}];
      this.allopportunities.displayerror(err.status);
  }
  );
  }


getNewTableData(event) {
  debugger;
  console.log("event",event);
  if (event.action == 'pagination') {
    this.paginationPageNo.PageSize = event.itemsPerPage;
    this.paginationPageNo.RequestedPageNumber = event.currentPage;
    this.paginationPageNoSearch.PageSize =event.itemsPerPage

       this.AllContactsRequestbody = {
      "PageSize": event.itemsPerPage,
      "RequestedPageNumber":  event.currentPage,
      "OdatanextLink": ""
    };

     if (this.service.checkFilterListApiCall(event)) {
        // filter api call
        this.CallListDataWithFilters(event);
      } else {
        // list api call
    this.tableData(this.paginationPageNo);
    
      }
    
  } else if (event.action == 'search') {
    this.paginationPageNo = {
      "PageSize": event.itemsPerPage,
      "RequestedPageNumber": 1,
      "OdatanextLink": ""
    };
  }

}


// opportunityStatus=[f
// {Value: 1, Label: 'Open'},
// {Value: 2, Label: 'On Hold'},
// {Value: 3, Label: 'Won'},
// {Value: 4, Label: 'Suspended'},
// {Value: 5, Label: 'Terminated'},
// {Value: 184450000, Label: 'Lost'}
// ]

gainRoleApi(){

    
     this.allopportunities.roleApi().subscribe(response => {
      if( !response.IsError){
        // response.ResponseObject.IsHelpRoleFullAccess =true
        // response.ResponseObject.IsGainAccessRole =false

         this.allopportunities.setSession( 'IsGainAccessRole', response.ResponseObject.IsGainAccessRole?response.ResponseObject.IsGainAccessRole:false)
         this.allopportunities.setSession( 'IsMarketingFunctionAndRole', response.ResponseObject.IsMarketingFunctionAndRole?response.ResponseObject.IsMarketingFunctionAndRole:false)
         this.allopportunities.setSession( 'IsHelpRoleFullAccess', response.ResponseObject.IsHelpRoleFullAccess?response.ResponseObject.IsHelpRoleFullAccess:false)
         console.log(this.allopportunities.getSession('IsGainAccessRole'),'roleroleapi1')

       }
  else{
     this.allopportunities.displayMessageerror(response.Message);
  } 
 }
    ,
       err => {
            this.allopportunities.displayerror(err.status);
  }
  );
   
}



getServiceLine(service){

if( service ){
  return (service.Code?service.Code + ' - ' : '') + (service.Name?service.Name: '')
}
else{
  return [];
}


}

 
 
opportunityStatusData(){

this.DataCommunicationService.loaderhome = true;
 this.allopportunities.opportunityStatusData().subscribe(res=>{

 if( !res.IsError){

    if (res.ResponseObject && (Array.isArray(res.ResponseObject)?res.ResponseObject.length>0:false) ){


   this.opportunityStatus= res.ResponseObject.map ((it)=>
    {
     return { Value:it.Id ,Label :it.Name  }
     })

this.serviceLines();
// this.practice();
this.vertical();
// this.subVertical();
this.geo();
// this.region();
this.competitor();
     }
  else{
}
 }
   else{
       this.allopportunities.displayMessageerror(res.Message);
   }
this.DataCommunicationService.loaderhome = false;
  }
    ,
     err => {
       this.DataCommunicationService.loaderhome = false;
   this.allopportunities.displayerror(err.status);
  }
  )


}

bindData(data){
 if(data){
 this.opportunityName=data.opportunityName?data.opportunityName:'' 
this.selectedAccNameObj={SysGuid: data.accountId?data.accountId:'', Name: data.accountName?data.accountName:''}; 
this.accountName=data.accountName?data.accountName:'' 
this.accountId=data.accountId?data.accountId:'' 
// this.AccountnameArray=data.AccountnameArray 
this.opportunityStatusName=data.opportunityStatusName?data.opportunityStatusName:'' 
// this.opportunityStatus=data.opportunityStatus?data.opportunityStatus:[]
this.serviceLin=data.serviceLin?data.serviceLin:'' 
// this.serviceLine=data.serviceLine?data.serviceLine:[]
this.practiceNamee=data.practiceNamee?data.practiceNamee:'' 
this.practiceName=data.practiceName?data.practiceName:[]
this.verticalNam=data.verticalNam?data.verticalNam:'' 
// this.verticalName=data.verticalName?data.verticalName:[]
this.subVerticalNam=data.subVerticalNam?data.subVerticalNam:'' 
this.subVerticalName=data.subVerticalName?data.subVerticalName:[]
this.geoNam=data.geoNam ?data.geoNam:''
// this.geoName=data.geoName ?data.geoName:[]
this.regionNam=data.regionNam?data.regionNam:'' 
this.regionName=data.regionName ?data.regionName:[]
this.allianceName=data.allianceName?data.allianceName:'' 
this.allianceId=data.allianceId ?data.allianceId:''
// this.AllianceseArray=data.AllianceseArray 
this.selectedAllianceNameObj={SysGuid: data.allianceId?data.allianceId:'', Name: data.allianceName?data.allianceName:''};
this.competitorNam=data.competitorNam ?data.competitorNam:''
// this.competitorName=data.competitorName ?data.competitorName:[]
this.selectedIpRadio=data.selectedIpRadio ?data.selectedIpRadio:''

this.ipName=data.ipName ?data.ipName:''
this.ipId=data.ipId ?data.ipId:''
// this.ipArray= data.ipArray 
this.SelectedIpObj= {SysGuid: data.ipId?data.ipId:'', Name: data.ipName?data.ipName:''}; 
}
}






createTempData(){

return {
opportunityName:this.opportunityName?this.opportunityName:'',
selectedAccNameObj:{SysGuid: this.accountId?this.accountId:'', Name: this.accountName?this.accountName:''},
accountName:this.accountName?this.accountName:'',
accountId:this.accountId?this.accountId:'',
// AccountnameArray:this.AccountnameArray,
opportunityStatusName:this.opportunityStatusName?this.opportunityStatusName:'',
// opportunityStatus:this.opportunityStatus?this.opportunityStatus:'',
serviceLin:this.serviceLin?this.serviceLin:'',
// serviceLine:this.serviceLine?this.serviceLine:'',
practiceNamee:this.practiceNamee?this.practiceNamee:'',
practiceName:this.practiceName?this.practiceName:[],
verticalNam:this.verticalNam?this.verticalNam:'',
// verticalName:this.verticalName?this.verticalName:'',
subVerticalNam:this.subVerticalNam?this.subVerticalNam:'',
subVerticalName:this.subVerticalName?this.subVerticalName:[],
geoNam:this.geoNam?this.geoNam:'',
// geoName:this.geoName?this.geoName:'',
regionNam:this.regionNam?this.regionNam:'',
regionName:this.regionName?this.regionName:[],
allianceName:this.allianceName?this.allianceName:'',
allianceId:this.allianceId?this.allianceId:'',
// AllianceseArray:this.AllianceseArray,
selectedAllianceNameObj:{SysGuid: this.allianceId?this.allianceId:'', Name: this.allianceName?this.allianceName:''},
competitorNam:this.competitorNam?this.competitorNam:'',
// competitorName:this.competitorName?this.competitorName:'',
selectedIpRadio:this.selectedIpRadio?this.selectedIpRadio:1,

ipName:this.ipName?this.ipName:'',
ipId:this.ipId?this.ipId:'',
// ipArray:this.ipArray,
SelectedIpObj:{SysGuid: this.ipId?this.ipId:'', Name: this.ipName?this.ipName:''},


}


}

  


  AppendRedisCache(data?) {
    this.service.SetRedisCacheData((data) ? (data) : (this.createTempData()), 'opportunityFinder').subscribe(res => {

      if (!res.IsError) {
        console.log("SUCESS FULL AUTO SAVE")
      }
    }, error => {
      console.log(error)
    })
  }


getCacheData(){

this.service.GetRedisCacheData('opportunityFinder').subscribe(res => {
    
     if (!res.IsError) {
      this.bindData(JSON.parse(res.ResponseObject))
         } 
    else {
          
        } 
      })
    }

    getSymbol(data) {
      data = this.escapeSpecialChars(data);
      return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
    }
  
    escapeSpecialChars(jsonString) {
      return jsonString.replace(/\n/g, "\\n")
          .replace(/\r/g, "\\r")
          .replace(/\t/g, "\\t")
          .replace(/\f/g, "\\f");
  
  }
 
  ngOnInit() {

      if(localStorage.getItem('accountRoute') == '1' ){
    var name =    (localStorage.getItem('accountName')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountName'), 'DecryptionDecrip') : ''
this.selectedAccNameObj = { SysGuid: "(localStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountSysId'), 'DecryptionDecrip') : ''" , 
Name: (localStorage.getItem('accountName')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountName'), 'DecryptionDecrip') : '' }
this.accountId =  (localStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';
this.accountName = this.getSymbol(name)?this.getSymbol(name):'';
}
else{
  this.accountId = ''
  this.accountName  = ''
  this.selectedAccNameObj = { SysGuid: '' , Name: ''}
}

    this.getCacheData()
    this.opportunityStatusData();
    this.gainRoleApi()



  //   var orginalArray = this.allopportunities.getAll();
  //   orginalArray.subscribe((x: any[]) => {
  // console.log('tableNameTable',x);
  //     this.allopportunity = x;
  //   });
    var orginalOrderArray = this.allopportunities.getAllOrder();
    orginalOrderArray.subscribe((x: any[]) => {
      this.allorder = x;
    });



  }




   lookupdata = {
      tabledata: [],
      recordCount: 10,
      headerdata: [],
      Isadvancesearchtabs: false,
      controlName: '',
      lookupName:'',
      isCheckboxRequired : false,
      inputValue : '',
      TotalRecordCount :0,
      selectedRecord:[],
       nextLink:'',
      pageNo:1,
      isLoader:false,
      casesensitive:true

    };


    //  (this.selectedAllianceNameObj && Object.keys(this.selectedAllianceNameObj).length)
      selectedLookupData(controlName) {
        switch(controlName) {
          case  'alliances' : {
            return this.SelectedAllianceArray.length>0?this.SelectedAllianceArray:[]
          }
        case  'account' : {

            return this.SelectedAccountArray.length>0?this.SelectedAccountArray:[]
          }
     case  'IP' : {

            return this.SelectedIpArray.length>0?this.SelectedIpArray:[]
          }

        }
    }



  openadvancetabs(controlName,initalLookupData, value,selectedArray): void {
debugger;

    this.lookupdata.controlName = controlName
    this.lookupdata.headerdata = linkedLeadsHeaders[controlName]
    this.lookupdata.lookupName= linkedLeadNames[controlName]['name']
    this.lookupdata.isCheckboxRequired = linkedLeadNames[controlName]['isCheckbox']
    this.lookupdata.Isadvancesearchtabs = linkedLeadNames[controlName]['isAccount']
    this.lookupdata.inputValue = value?value:'';
    this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
   this.lookupdata.tabledata =[]
    this.allopportunities.getLookUpFilterData({ data:initalLookupData , controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
      this.lookupdata.tabledata = res

    })

    const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
      width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
      data: this.lookupdata
    });

    dialogRef.componentInstance.modelEmiter.subscribe((x) => {

      debugger
      console.log(x)
      if(x.action=='loadMore'){
var dialogData ={}
        if(controlName=='alliances')
      {
         dialogData = {


     "Searchtext": x.objectRowData.searchKey?x.objectRowData.searchKey:'',
     "SearchType":6,
     "PageSize":10,
    "RequestedPageNumber":x.currentPage,
     "OdatanextLink":this.lookupdata.nextLink

        }
      }

       else if(controlName=='account')
      {
         dialogData = {


     "SearchText": x.objectRowData.searchKey?x.objectRowData.searchKey:'',

     "PageSize": 10,
    "RequestedPageNumber":x.currentPage,
     "OdatanextLink":this.lookupdata.nextLink,
     "IsFinder": true

        }
      }





             else if(controlName=='IP')
      {
         dialogData = {



     "Searchtext": x.objectRowData.searchKey?x.objectRowData.searchKey:'',

     "pagesize": 10,
    "RequestedPageNumber":x.currentPage,
     "OdatanextLink":this.lookupdata.nextLink

        }
      }



        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData  }).subscribe(res => {
         debugger;
         this.lookupdata.isLoader=false
          this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject)
          this.lookupdata.nextLink = res.OdatanextLink
          this.lookupdata.TotalRecordCount = res.TotalRecordCount

        })

      }else if(x.action=='search'){
        this.lookupdata.nextLink =''
    var dialogData ={}
        if(controlName=='alliances')
      {
         dialogData = {


     "Searchtext": x.objectRowData.searchKey?x.objectRowData.searchKey:'',
     "SearchType":6,
     "PageSize":10,
    "RequestedPageNumber":x.currentPage,
     "OdatanextLink":this.lookupdata.nextLink

        }
      }

       else if(controlName=='account')
      {
         dialogData = {


     "SearchText": x.objectRowData.searchKey?x.objectRowData.searchKey:'',

     "PageSize":10,
    "RequestedPageNumber":x.currentPage,
     "OdatanextLink":this.lookupdata.nextLink,
     "IsFinder": true

        }
      }





             else if(controlName=='IP')
      {
         dialogData = {


     "Searchtext": x.objectRowData.searchKey?x.objectRowData.searchKey:'',

     "pagesize":10,
    "RequestedPageNumber":x.currentPage,
     "OdatanextLink":this.lookupdata.nextLink

        }
      }



        this.allopportunities.getLookUpFilterData({ data: null, controlName: controlName, isService: true, useFullData: dialogData  }).subscribe(res => {
         this.lookupdata.isLoader=false
          this.lookupdata.tabledata = res.ResponseObject
          this.lookupdata.nextLink = res.OdatanextLink
       this.lookupdata.TotalRecordCount = res.TotalRecordCount


        })

      }


    });

    dialogRef.afterClosed().subscribe(result => {
      debugger
      if (result) {
        console.log(result)
        this.AppendParticularInputFun(result.selectedData,result.controlName)
      }
    });
  }

advanceLookUpSearch(lookUpData)
 {
 debugger;
 console.log(lookUpData);
 let labelName=lookUpData.labelName;
 switch (labelName){
 case 'allianceArr':{
this.openadvancetabs('alliances',this.AllianceseArray,lookUpData.inputVal,this.SelectedAllianceArray)
 return;
 }
  case 'accountArr':{

 this.openadvancetabs('account',this.AccountnameArray,lookUpData.inputVal,this.SelectedAccountArray)

 return;
}
  case 'ipArr':{
this.openadvancetabs('IP',this.ipArray,lookUpData.inputVal,this.SelectedIpArray)

 return;
 }

 }
 }

  AppendParticularInputFun(selectedData,controlName) {
    debugger
    if(selectedData){
      if(selectedData.length>0){

      if(controlName=='alliances'){


          this.selectedAllianceNameObj = selectedData[0];
this.allianceName= this.selectedAllianceNameObj.Name;
this.allianceId= this.selectedAllianceNameObj.SysGuid;
// this.selectedAllianceNameObjTemp.Name = this.selectedAllianceNameObj.Name;
// this.selectedAllianceNameObjTemp.SysGuid = this.selectedAllianceNameObj.SysGuid;
this.SelectedAllianceArray=[]
this.SelectedAllianceArray.push(this.selectedAllianceNameObj);
this.SelectedAllianceArray[0].Id = this.selectedAllianceNameObj.SysGuid

      }
      else if(controlName=='account'){
       this.selectedAccNameObj = selectedData[0];
this.accountName= this.selectedAccNameObj.Name;
this.accountId= this.selectedAccNameObj.SysGuid;
// this.selectedAccNameObjTemp.Name = this.selectedAccNameObj.Name;
// this.selectedAccNameObjTemp.SysGuid = this.selectedAccNameObj.SysGuid;

this.SelectedAccountArray=[]
this.SelectedAccountArray.push(this.selectedAccNameObj);
this.SelectedAccountArray[0].Id = this.selectedAccNameObj.SysGuid;
      }
      else if(controlName=='IP'){
    this.SelectedIpObj = selectedData[0];
this.ipName= this.SelectedIpObj.Name;
this.ipId= this.SelectedIpObj.ProductId;
// this.SelectedIpObjTemp.Name = this.SelectedIpObj.Name;
// this.SelectedIpObjTemp.ProductId = this.SelectedIpObj.ProductId;


this.SelectedIpArray=[]
this.SelectedIpArray.push(this.SelectedIpObj);

this.SelectedIpArray[0].Id = this.SelectedIpObj.ProductId;
      }

      }
    }
  
this.AppendRedisCache()
}

// appendleadslinkedData(selectedData){
// this.selectedleadslinked=[];
// for (var i=0; i<selectedData.length; i++){
// this.selectedleadslinked.push(selectedData[i])

// }

// }



  /************Select Tabs dropdown code starts */
  selectedTabValue: string = "All conversation group";
  appendConversation(e) {
    this.selectedTabValue = e.name;
    if (e.router) {
      this.router.navigate([e.router]);
    }
  }
  tabList = [
    {
      view: 'System views',
      groups: [{ name: 'My conversation group' },
      { name: 'All conversation group' },
      { name: 'Archived conversation group' }
      ]
    },

  ]
  /************Select Tabs dropdown code ends */




}
@Component({
  selector: 'GainAccess-popup',
  templateUrl: './../../../../shared/components/single-table/sprint4Modal/gain-access-popup.html',
  styleUrls: ['./../../../../shared/components/single-table/single-table.component.scss']
})
// ./shared/components/single-table.component.scss
export class GainAccess {
  accessModal=false;
  accountName:any='';
    panelOpenState: boolean;
    allOpportunityData;
    templateAccount;
    templateOpportunity;
    allAccountData;
  opportunityName;
  ownerName;
  opportunityOwner;

  constructor(public DataCommunicationService: DataCommunicationService, private EncrDecr: EncrDecrService, public dialogRef: MatDialogRef<GainAccess>,public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data, private allopportunities: OpportunitiesService,) {
   debugger;
    this.opportunityName =data.data.OpportunityName?data.data.OpportunityName:'';
    this.accessModal= data.info;
    this.ownerName   =data.data.AccountOwnerName?data.data.AccountOwnerName:'';
    this.opportunityOwner= data.data.OpportunityOwnerName?data.data.OpportunityOwnerName:'';
    // this.accountName=data.data.ID;
    this.templateAccount=  data.templateAccountId;
    this.templateOpportunity= data.templateOpportunityId;
    this.allOpportunityData= data.data.opportunityId;
    this.allAccountData= data.data.AccountId;
      console.log('dtaaaaa',data,this.accessModal,this.templateAccount, this.templateOpportunity,this.allOpportunityData,this.allAccountData);
  }



confirm(){
if(this.accessModal){
  this.opportunityConfirm();
}
else{
  this.accountConfirm();
}
}

accountConfirm(){
var body=
  { "UserId":  this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),

  "TeamTemplate":{
  "EntityLogicalName":"account",
 "RecordId":this.allAccountData,
 "Teamtemplateid":this.templateAccount

}}

this.DataCommunicationService.loaderhome = true;
 this.allopportunities.accountConfirm(body).subscribe(response => {

if( !response.IsError){
  this.opportunityConfirm();
 }
 else{
  this.allopportunities.displayMessageerror(response.Message);
 }
    this.DataCommunicationService.loaderhome = false;
    },
       err => {
         this.DataCommunicationService.loaderhome = false;
    this.allopportunities.displayerror(err.status);
  }
  );

}


opportunityConfirm(){
debugger;

var body=
  { "UserId": this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
  "TeamTemplate":{
  "EntityLogicalName":"opportunity",
 "RecordId": this.allOpportunityData,
 "Teamtemplateid": this.templateOpportunity

}}
this.DataCommunicationService.loaderhome = true;
 this.allopportunities.opportunityConfirm(body).subscribe(response => {
   if( !response.IsError){
     if(response.ResponseObject.IsSuccess){
  this.dialogRef.close();
   this.allopportunities.displayMessageerror('You have gained access for this opportunity')
     }
   else{
      this.allopportunities.displayMessageerror(response.Message);
   }

   }
  else{
  this.allopportunities.displayMessageerror(response.Message);
  }
  this.DataCommunicationService.loaderhome = false;
  },
       err => {
this.DataCommunicationService.loaderhome = false;
    this.allopportunities.displayerror(err.status);
  }
  );
}

}


