import { Component, OnInit } from '@angular/core';
import { Router,ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef,MatSnackBar } from '@angular/material';
import { changeOpportunityService ,changeOpportunityHeader} from '@app/core/services/changeOpportunity.service';
import { OpportunitiesService } from '@app/core';
import { DatePipe } from "@angular/common";
@Component({
  selector: 'app-change-opportunity',
  templateUrl: './change-opportunity.component.html',
  styleUrls: ['./change-opportunity.component.scss']
})
export class ChangeOpportunityComponent implements OnInit {
  datePipe = new DatePipe("en-US");
  leadinfo = true;
  dealinfo = false;
  twoactive = false;
  initialData=[];

  // autocomplete code starts here
  /****************** order number autocomplete code start ****************** */
  orderno: string = "";
  ordernoNameSwitch: boolean = true;

  //for pagination
  ManagementLogTableRequestBody =
  {
  "PageSize": 50,
  "RequestedPageNumber": 1,
  "OdatanextLink":''
}

paginationPageNoSearch = {
  "PageSize": 50,
  "RequestedPageNumber": 1,
  "OdatanextLink": "searchTable"
}
//filter obj
  filterConfigData = {
    OrderNumber: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    OpportunityName: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    OpportunityNumber: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    OrderOwner: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Source: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    OpportunitySource: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    SapName: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    EngamentStartDate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    EngagementEndDate: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    isFilterLoading:false
  };
 
  ordernoNameclose() {
    this.ordernoNameSwitch = false;
  }

  appendorderno(value: any) {
    this.orderno=value.OrderNumber;
    this.oppno=value.OpportunityNumber;
    this.oppName=this.getSymbol(value.OpportunityName);
    this.ordernoNameSwitch = true;
    this.selected_order_number=value.OrderNumber;  
    this.selected_opp_number=value.OpportunityNumber;    
    this.selectFlagOrder=false;
    this.ordernoNameSwitch=false;
  }
  
  appendoppno(value: any) {
    this.oppno = value.OpportunityNumber;
    this.orderno=value.OrderNumber;
    this.oppName=this.getSymbol(value.OpportunityName);
    this.oppnoNameSwitch = true;
    this.selected_opp_number=value.OpportunityNumber;   
    this.selected_order_number=value.OrderNumber;   
    this.selectFlagOpportunity=false;
    this.oppnoNameSwitch=false;
    }
  ordernos:any;
  action:any;
  /****************** order number autocomplete code end ****************** */

  /****************** oppno Name autocomplete code start ****************** */
  showoppno: boolean = false;
  oppno: string = "";
  oppnoNameSwitch: boolean = true;
  oppnoNameclose() {
    this.oppnoNameSwitch = false;
  }
  
  oppnos: {}[] = []
  selectedoppno: {}[] = [];
  /****************** oppno Name autocomplete code end ****************** */
  // autocomplete code ends here
  overviewData:any={};
  selected_order=true;
  selected_orderData:any;
  opportunityType=1;
  selected_order_number="";
  selected_opp_number="";
  table_data_first=[
    {"label": "Opportunity Name", "text": ""}, 
    {"label": "Opportunity Number", "text":""},
    {"label": "Opportunity Owner", "text":""}
  ]
  table_data = [
    {"label": "Order/ Amendment no.", "text": "20059397" }, 
    {"label": "Opportunity no.", "text": "OPP000158257" },
    {"label": "SAP code", "text": "231212" }, 
    {"label": "Engagement start date", "text": "12-Jan-19" },
     {"label": "Engagement end date", "text": "12-Jul-20" },
      {"label": "Order type", "text": "Fixed capacity" },
    {"label": "Primary opportunity number", "text": "OPP00015227" }, 
    {"label": "Primary opportunity name", "text": "Singtel procurement process" },
    {"label": "Primary order", "text": "20059397" },
      {"label": "Source", "text": "RFP/ ITT" },  
  ]
  tableTotalCount:number;
  table_header=['OrderId','OpportunityId','EstClosureDate','AccountId','Owner','isCheccked'];
  summary_data=[
    {data1: "Opportunity number", change: "", tcvchange: "OPP00015227 - I1"},
    {data1: "Parent order number", change:"-", tcvchange: "1234567890"},
    {data1: "Parent opportunity", change:"-", tcvchange: "OPP00015111 - Reimagine Procurement…"},
    {data1: "Parent Order owner", change:"-", tcvchange: "Shilpa Rao"},
    {data1: "Proposal Type", change:"-", tcvchange: "-"}
    ];
    wiproContactArray = [];
    changeOpportunityTable=[];
    order_Number="";    
    source=[];
    selectFlagOrder=false;
    selectFlagOpportunity=false;
    oppName="";
    opp_Number="";
    isLoading=true;
    accountID="";
    opportunityID=this.projectService.getSession('opportunityId');

    isSearchLoaderForOrder=false;
    isSearchLoaderForOpp=false;

  goBack() {
    if(!this.dealinfo)
    {
      this.router.navigate(['/opportunity/opportunityview/overview']);
    }
    else
    {
      this.leadinfo = true;
      this.dealinfo = false;
      this.twoactive = false;
    }
  }

  goHome() {
      this.leadinfo = true;
      this.dealinfo = false;
  }
  

  ngOnInit() {
    this.getTableDate();
    // this.getInitialTableData();
  }
  // getInitialTableData()
  // {
  //    let oppObj = { "OppId":this.opportunityID};
   
  //    this.projectService.getOppOverviewDetail(oppObj).subscribe(data=>{
  //     if(data.isError)
  //     {
  //       this.snackBar.open(data.Message, this.action, {
  //         duration: 3000
  //       });
  //       this.isLoading=false;
  //     }
  //     else{
  //       this.overviewData.opportunityId=oppObj.OppId;
  //       this.table_data_first[0].text=data.ResponseObject.name;
  //       this.table_data_first[1].text=data.ResponseObject.OpportunityNumber;
  //       this.table_data_first[2].text=data.ResponseObject.OppOwner.Name;  
  //       this.overviewData.opportunityOwner=data.ResponseObject.OppOwner.Name;
  //       this.overviewData.opportunityName=data.ResponseObject.name;
  //       this.overviewData.opportunityNumber=data.ResponseObject.OpportunityNumber;
  //       this.overviewData.accountID=data.ResponseObject.Account.SysGuid;
  //       this.overviewData.Source=data.ResponseObject.Source;
  //       if(data.ResponseObject.SapCode!==null && data.ResponseObject.SapCode!==undefined)
  //       {
  //         this.overviewData.SapId=data.ResponseObject.SapCode.SysGuid?data.ResponseObject.SapCode.SysGuid:'NA';
  //       }
  //       this.accountID=data.ResponseObject.Account.SysGuid;
  //        let obj={ 
  //         "AccountId":data.ResponseObject.Account.SysGuid,
  //         "SapId": this.overviewData.SapId
  //         };
  //       this.changeOpposvc.getAll(obj).subscribe(res=>{
  //         if(res.isError)
  //         {
  //           this.snackBar.open(res.Message, this.action, {
  //             duration: 3000
  //           });
  //           this.isLoading=false;
  //         }
  //         else{
  //         if(res.ResponseObject!==null && res.ResponseObject.length>0)
  //         {
  //           this.isLoading=false;
  //           this.initialData=res.ResponseObject;
  //           this.initialData=this.initialData.map((x,i)=>{ 
  //           x.index=i+1,
  //           x.OrderNumber=x.OrderNumber?x.OrderNumber:'NA',
  //           x.OpportunityName=x.OpportunityName?x.OpportunityName:'NA',
  //           x.OpportunityNumber=x.OpportunityNumber?x.OpportunityNumber:'NA',
  //           x.OrderOwner=x.OrderOwner?x.OrderOwner:'NA',
  //           x.Source=x.Source?x.Source:'NA',
  //           x.OpportunitySource=x.OpportunitySource?x.OpportunitySource:'NA',
  //           x.SapName=x.SapName?x.SapName:'NA',
  //           x.EngamentStartDate=x.EngamentStartDate?x.EngamentStartDate:'NA',
  //           x.EngagementEndDate=x.EngagementEndDate?x.EngagementEndDate:'NA',
  //           x.OrderType=x.OrderType?x.OrderType:'NA',
  //           x.PrimaryOpportunityNumber=x.PrimaryOpportunityNumber?x.PrimaryOpportunityNumber:'NA',
  //           x.PrimaryOpportunityName=x.PrimaryOpportunityName?x.PrimaryOpportunityName:'NA',
  //           x.PrimaryOrderNumber=x.PrimaryOrderNumber?x.PrimaryOrderNumber:'NA'
  //           return x;
  //           })
  //         }
  //         else
  //         {
  //            this.isLoading=false;
  //            this.initialData=[];
  //         }
         
  //         }          
  //       })
  //     }    
  //   });   
  // }

  getTableDate()
  {
     let oppObj = { "OppId":this.opportunityID};
   
     this.projectService.getOppOverviewDetail(oppObj).subscribe(data=>{
      if(data.isError)
      {
        this.snackBar.open(data.Message, this.action, {
          duration: 3000
        });
        this.isLoading=false;
      }
      else{
        this.overviewData.opportunityId=oppObj.OppId;
        this.table_data_first[0].text=this.getSymbol(data.ResponseObject.name);
        this.table_data_first[1].text=data.ResponseObject.OpportunityNumber;
        this.table_data_first[2].text=data.ResponseObject.OppOwner.Name;  
        this.overviewData.opportunityOwner=data.ResponseObject.OppOwner.Name;
        this.overviewData.opportunityName=this.getSymbol(data.ResponseObject.name);
        this.overviewData.opportunityNumber=data.ResponseObject.OpportunityNumber;
        this.overviewData.accountID=data.ResponseObject.Account.SysGuid;
        this.overviewData.Source=data.ResponseObject.Source;
        this.overviewData.SourceDisplay=data.ResponseObject.SourceDisplay;
        if(data.ResponseObject.SapCode!==undefined && data.ResponseObject.SapCode!==null )
        {
          this.overviewData.SapId=data.ResponseObject.SapCode.SysGuid?data.ResponseObject.SapCode.SysGuid:'NA';;
        }
        this.accountID=data.ResponseObject.Account.SysGuid;
      

        this.getInitialTable();
      }    
    });   
  }


  getSymbol(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

getInitialTable()
{


    let obj={ 
          "AccountId":this.accountID,
          "SapId":this.overviewData.SapId,
          "page":this.ManagementLogTableRequestBody.RequestedPageNumber,
          "count":this.ManagementLogTableRequestBody.PageSize,
          "OrderNumber": this.orderno?this.orderno:'',
          "OpportunityNumber": this.oppno?this.oppno:'',
          "OpportunityName": this.oppName?this.oppName:""
          };
this.changeOpposvc.getAll(obj).subscribe(res=>{
          if(res.isError)
          {
            this.snackBar.open(res.Message, this.action, {
              duration: 3000
            });
            this.isLoading=false;
          }
          else{
            if(res.ResponseObject!==null && res.ResponseObject.length>0)
            {
            this.isLoading=false;

             const perPage = this.ManagementLogTableRequestBody.PageSize;
            const start = ((this.ManagementLogTableRequestBody.RequestedPageNumber - 1) * perPage) + 1;
            var i = start;
            const end = start + perPage - 1;

            // this.changeOpportunityTable = res.ResponseObject;
             var tableCollection = res.ResponseObject.map((x)=>{              
            x.index=i+1,
            x.OrderNumber=x.OrderNumber?x.OrderNumber:'NA',
            x.OpportunityName=x.OpportunityName?this.getSymbol(x.OpportunityName):'NA',
            x.OpportunityNumber=x.OpportunityNumber?x.OpportunityNumber:'NA',
            x.OrderOwner=x.OrderOwner?x.OrderOwner:'NA',
            x.Source=x.Source?x.Source:'NA',
            x.OpportunitySource=x.OpportunitySource?x.OpportunitySource:'NA',
            x.SapName=x.SapName?x.SapName:'NA',
            x.EngamentStartDate=x.EngamentStartDate?x.EngamentStartDate:'NA',
            x.EngagementEndDate=x.EngagementEndDate?x.EngagementEndDate:'NA',
            x.OrderType=x.OrderType?x.OrderType:'NA',
            x.PrimaryOpportunityNumber=x.PrimaryOpportunityNumber?x.PrimaryOpportunityNumber:'NA',
            x.PrimaryOpportunityName=x.PrimaryOpportunityName?x.PrimaryOpportunityName:'NA',
            x.PrimaryOrderNumber=x.PrimaryOrderNumber?x.PrimaryOrderNumber:'NA'
            return x;
            })

              
 if(this.ManagementLogTableRequestBody.RequestedPageNumber == 1){
        this.changeOpportunityTable = []
       this.changeOpportunityTable = tableCollection
     }
     else{
      this.changeOpportunityTable = this.changeOpportunityTable.concat(tableCollection)  
     
     }



            // this.ordernos=res.ResponseObject;
            this.tableTotalCount = res.ResponseObject[0].TotalRecordCount;
          }
          else
          {
             this.isLoading=false;
             this.changeOpportunityTable =[{}];
            //  this.ordernos=[{}];
             this.tableTotalCount =0;
          }
         
          }          
        })

}


  constructor(
    private changeOpposvc: changeOpportunityService,
    private router: Router,
    public service: DataCommunicationService,
    public dialog: MatDialog,
    private _location: Location,
    private route:ActivatedRoute,
    public projectService: OpportunitiesService,
    public snackBar:MatSnackBar
  ) { }
  stepone() {
    if(!this.dealinfo)
    {
      this.router.navigate(['/opportunity/opportunityview/overview']);
    }
    this.leadinfo = true;
    this.dealinfo = false;
    this.twoactive = false;
    this.selected_orderData=undefined;
  }
  steptwo() {
    console.log("data to show",this.table_data)
    if(this.selected_orderData)
    {
      this.leadinfo = false;
      this.dealinfo = true;
    }
    else
    {
       this.snackBar.open("Please select the order", this.action, {
        duration: 3000
      });
    }

    
}
  
selectType(event)
{
  this.opportunityType=event.value;
}

setSummaryData(eventObj)
{
this.summary_data[1].tcvchange=eventObj.objectRowData[0]["OrderNumber"];
this.summary_data[2].tcvchange=eventObj.objectRowData[0]["OpportunityNumber"]+"-"+eventObj.objectRowData[0]["OpportunityName"];
this.summary_data[3].tcvchange=eventObj.objectRowData[0]["OrderOwner"];
if(eventObj.objectRowData[0]["SourceDisplay"])
{
 this.summary_data[4].tcvchange=eventObj.objectRowData[0]["SourceDisplay"];
}
this.summary_data[0].change=this.overviewData.opportunityNumber;
if(this.overviewData.SourceDisplay)
{
 this.summary_data[4].change=this.overviewData.SourceDisplay;
}
}



searchData =false

searchTable(paginationPageNo){

    if( paginationPageNo.OdatanextLink =='searchTable'  )
       {
          this.ManagementLogTableRequestBody.RequestedPageNumber = this.paginationPageNoSearch.RequestedPageNumber 
          this.ManagementLogTableRequestBody.PageSize = this.paginationPageNoSearch.PageSize 
          
          this.ManagementLogTableRequestBody={
            RequestedPageNumber:1,
            PageSize:50,
            OdatanextLink:''
          }
       }
       this.searchData= true
   if(this.searchData){
      this.changeOpportunityTable =[]
      this.tableTotalCount=0
      }
 this.getInitialTable()


}


getNewTableData(event)
{
//  this.ManagementLogTableRequestBody.PageSize=event.itemsPerPage;
//  this.ManagementLogTableRequestBody.RequestedPageNumber=event.currentPage;

     this.ManagementLogTableRequestBody = {
      "PageSize": event.itemsPerPage,
      "RequestedPageNumber":  event.currentPage,
      OdatanextLink:''
    
    };

//  this.AllContactsRequestbody.PageSize = event.itemsPerPage;
//      this.AllContactsRequestbody.RequestedPageNumber = event.currentPage;

     if (this.service.checkFilterListApiCall(event)) {
        // filter api call
        this.CallListDataWithFilters(event);
      } else {
        // list api call
         this.getInitialTable();

      }
}


// getNewTableDataAfterSearch(page,size)
// {
// this.ManagementLogTableRequestBody.PageSize=size;
//  this.ManagementLogTableRequestBody.RequestedPageNumber=page;
//  this.getTableDate();
// }

    startFilterDate=''
    endFilterDate=''
    startFilterDate1=''
    endFilterDate1=''

clearAllFilter(event,pageSize){
   this.ManagementLogTableRequestBody = {
  "PageSize": pageSize,
  "RequestedPageNumber": 1,
  "OdatanextLink": "",
 
  
}
          this.CallListDataWithFilters(event)
}

performTableChildAction(event)
{

if(event.filterData.filterColumn.EngamentStartDate.length>0){
   this.startFilterDate = event.filterData.filterColumn.EngamentStartDate?event.filterData.filterColumn.EngamentStartDate[0].filterStartDate.toLocaleString():''
 this.endFilterDate =  event.filterData.filterColumn.EngamentStartDate?event.filterData.filterColumn.EngamentStartDate[0].filterEndDate.toLocaleString():''
}

if(event.filterData.filterColumn.EngagementEndDate.length>0){
  this.startFilterDate1 = event.filterData.filterColumn.EngagementEndDate?event.filterData.filterColumn.EngagementEndDate[0].filterStartDate.toLocaleString():''
 this.endFilterDate1 =  event.filterData.filterColumn.EngagementEndDate?event.filterData.filterColumn.EngagementEndDate[0].filterEndDate.toLocaleString():''
}

  console.log("action",event)
  debugger;
  var actionRequired = event;
    switch (actionRequired.action) {

      
   case 'ClearAllFilter': {
        this.clearAllFilter(event,event.pageData.itemsPerPage);
        return
      }
      case 'OrderNumber': {
      this.selected_order=false;
      this.selected_orderData=event.objectRowData[0];
      this.setSummaryData(event);
      let arr=[];    
      arr[6]=oppNum;
      arr[8]=OrderNO;
      for(var k in event.objectRowData[0])
      {
        var OrderNO="";
        var oppNum="";
        let obj={};
        if(!this.table_header.includes(k))
        {
          if(k=='OrderNumber'){          
                obj["label"]='Order/ Amendment no.';
                if(event.objectRowData[0][k])
                {
                  obj["text"]=event.objectRowData[0][k];
                }
                else
                {
                  obj["text"]="NA";
                }            
                arr[0]=obj;
                OrderNO=event.objectRowData[0][k];
          }
           if(k=='OpportunityNumber'){ 
              obj["label"]='Opportunity no.';
                if(event.objectRowData[0][k])
                {
                  obj["text"]=event.objectRowData[0][k];
                }
                else
                {
                  obj["text"]="NA";
                } 
                arr[1]=obj;
                oppNum=event.objectRowData[0][k];
           }
           if(k=='SapName'){ 
               obj["label"]='SAP code';
                if(event.objectRowData[0][k])
                {
                  obj["text"]=event.objectRowData[0][k];
                }
                else
                {
                  obj["text"]="NA";
                } 
                arr[2]=obj;
           }
            if(k=='EngamentStartDate'){ 
                obj["label"]='Engagement start date';
                if(event.objectRowData[0][k])
                {
                  obj["text"]=event.objectRowData[0][k];
                }
                else
                {
                  obj["text"]="NA";
                } 
                arr[3]=obj;
             }
            if(k=='EngagementEndDate'){ 
                obj["label"]='Engagement end date';
                if(event.objectRowData[0][k])
                {
                  obj["text"]=event.objectRowData[0][k];
                }
                else
                {
                  obj["text"]="NA";
                } 
                arr[4]=obj;
            }
             if(k=='OrderType'){ 
           
                obj["label"]='Order type';
                if(event.objectRowData[0][k])
                {
                  obj["text"]=event.objectRowData[0][k];
                }
                else
                {
                  obj["text"]="NA";
                } 
                arr[5]=obj;
            }
            if(k=='PrimaryOpportunityNumber'){ 
        
                obj["label"]='Primary opportunity number';  
                if(event.objectRowData[0][k])
                {
                  obj["text"]=event.objectRowData[0][k];
                }
                else
                {
                  obj["text"]="NA";
                } 
                arr[6]=obj;
          } 
            if(k=='PrimaryOpportunityName'){ 
            
                obj["label"]='Primary opportunity name';
                if(event.objectRowData[0][k])
                {
                  obj["text"]=event.objectRowData[0][k];
                }
                else
                {
                  obj["text"]="NA";
                } 
                arr[7]=obj;
            }
              if(k=='PrimaryOrderNumber'){ 
           
                obj["label"]='Primary order';
                if(event.objectRowData[0][k])
                {
                  obj["text"]=event.objectRowData[0][k];
                }
                else
                {
                  obj["text"]="NA";
                } 
                arr[8]=obj;
            }
              if(k=='OpportunitySource'){ 
           
                obj["label"]='Proposal Type ';
                if(event.objectRowData[0][k])
                {
                  obj["text"]=event.objectRowData[0][k];
                }
                else
                {
                  obj["text"]="NA";
                } 
                arr[9]=obj;
         }         
          
          this.table_data=arr;
      
      }
    }
      return;
      }
      case 'columnFilter': {
        this.GetColumnFilters(actionRequired);
        return;
      }
       case "columnSearchFilter": {
        this.GetColumnSearchFilters(actionRequired);
        return
      }
      case 'loadMoreFilterData': {
        console.log("extra data")
        this.LoadMoreColumnFilter(actionRequired);
        return
      }
       case 'sortHeaderBy': {
        this.ManagementLogTableRequestBody.PageSize = event.pageData.itemsPerPage
        this.ManagementLogTableRequestBody.RequestedPageNumber = 1

        this.CallListDataWithFilters(actionRequired);
        return
      }
 
    }
  
}
GetColumnFilters(data)
{
  if (data.filterData) {
      if (!data.filterData.isApplyFilter) {
        let headerName = data.filterData.headerName;
        this.filterConfigData[headerName].PageNo=1
        this.filterConfigData[headerName].data=[]
        this.filterConfigData[headerName].NextLink=''
        this.generateFilterConfigData(data, headerName, false);
      } else {
        if (data.filterData.isApplyFilter) {
          this.ManagementLogTableRequestBody.PageSize =  this.ManagementLogTableRequestBody.PageSize
          this.ManagementLogTableRequestBody.RequestedPageNumber = 1;
          this.CallListDataWithFilters(data)
        } 
      }
  }
}
  GetColumnSearchFilters(data) {
    let headerName = data.filterData.headerName
    this.filterConfigData[headerName].PageNo = 1
    this.filterConfigData[headerName].NextLink = ''
    this.generateFilterConfigData(data, headerName, false)
  }

  LoadMoreColumnFilter(data) {
    debugger;
    let headerName = data.filterData.headerName
    this.filterConfigData[headerName].PageNo = this.filterConfigData[headerName].PageNo + 1
    this.generateFilterConfigData(data, headerName, true)
  }

  CallListDataWithFilters(data) {
    let reqparam = this.GetAppliedFilterData({ ...data })
    this.changeOpposvc.getFilteredData(reqparam).subscribe(res => {
        if(res.isError)
          {
            this.snackBar.open(res.Message, this.action, {
              duration: 3000
            });
            this.isLoading=false;
          }
          else{
            if(res.ResponseObject!==null && res.ResponseObject.length>0)
            {
            this.isLoading=false;
            const perPage = this.ManagementLogTableRequestBody.PageSize;
            const start = ((this.ManagementLogTableRequestBody.RequestedPageNumber - 1) * perPage) + 1;
            let i = start;
            const end = start + perPage - 1;
            // this.changeOpportunityTable = res.ResponseObject;
            var tableCollection =res.ResponseObject.map((x)=>{              
           
            x.index=i+1,
            x.OrderNumber=x.OrderNumber?x.OrderNumber:'NA',
            x.OpportunityName=x.OpportunityName?this.getSymbol(x.OpportunityName):'NA',
            x.OpportunityNumber=x.OpportunityNumber?x.OpportunityNumber:'NA',
            x.OrderOwner=x.OrderOwner?x.OrderOwner:'NA',
            x.Source=x.Source?x.Source:'NA',
            x.OpportunitySource=x.OpportunitySource?x.OpportunitySource:'NA',
            x.SapName=x.SapName?x.SapName:'NA',
            x.EngamentStartDate=x.EngamentStartDate?x.EngamentStartDate:'NA',
            x.EngagementEndDate=x.EngagementEndDate?x.EngagementEndDate:'NA',
            x.OrderType=x.OrderType?x.OrderType:'NA',
            x.PrimaryOpportunityNumber=x.PrimaryOpportunityNumber?x.PrimaryOpportunityNumber:'NA',
            x.PrimaryOpportunityName=x.PrimaryOpportunityName?x.PrimaryOpportunityName:'NA',
            x.PrimaryOrderNumber=x.PrimaryOrderNumber?x.PrimaryOrderNumber:'NA'            
            return x;
            })

                       
 if(this.ManagementLogTableRequestBody.RequestedPageNumber == 1){
        this.changeOpportunityTable = []
       this.changeOpportunityTable = tableCollection
     }
     else{
      this.changeOpportunityTable = this.changeOpportunityTable.concat(tableCollection)  
     
     }
            // this.ordernos=res.ResponseObject;
            this.tableTotalCount = res.ResponseObject[0].TotalRecordCount;
          }
          else
          {
             this.isLoading=false;
             this.changeOpportunityTable =[{}];
            //  this.ordernos=[{}];
             this.tableTotalCount =0;
          }
          }
    })
  }

 GetAppliedFilterData(data) {
   console.log("data to filter",data);
    
    return {
    OrderNumbers:this.service.pluckParticularKey(data.filterData.filterColumn['OrderNumber'], 'name'),
    OrderStatus: undefined,
    OpportunityNumbers:this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityNumber'], 'name'),
    OpportunityNames:this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityName'], 'name'),
    AccountId:this.accountID,
    OwnerIds:this.service.pluckParticularKey(data.filterData.filterColumn['OrderOwner'], 'name'),
    Sources:this.service.pluckParticularKey(data.filterData.filterColumn['Source'], 'id'),
    SapCustomerCodes:this.service.pluckParticularKey(data.filterData.filterColumn['SapName'], 'name'),
    // StartDates:this.service.pluckParticularKey(data.filterData.filterColumn['EngamentStartDate'], 'id'),
    // EndDates:this.service.pluckParticularKey(data.filterData.filterColumn['EngagementEndDate'], 'id'),
    PropsalTypes:this.service.pluckParticularKey(data.filterData.filterColumn['OpportunitySource'], 'id'),
    AccountIds:[this.accountID],
    page:this.ManagementLogTableRequestBody.RequestedPageNumber,
    count:this.ManagementLogTableRequestBody.PageSize,
    SearchText:data.filterData.filterColumn.globalSearch,
    SortBy:this.service.pluckParticularKey(changeOpportunityHeader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0]?this.service.pluckParticularKey(changeOpportunityHeader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0]:[], 
    IsDesc:(data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false,
     "StartFromDate": this.startFilterDate?(this.datePipe.transform(this.startFilterDate, "yyyy-MM-dd")):undefined,
    "StartToDate": this.endFilterDate?(this.datePipe.transform(this.endFilterDate, "yyyy-MM-dd")):undefined,
    "EndFromDate": this.startFilterDate1?(this.datePipe.transform(this.startFilterDate1, "yyyy-MM-dd")):undefined,
    "EndToDate ": this.endFilterDate1?(this.datePipe.transform(this.endFilterDate1, "yyyy-MM-dd")):undefined,
    "SapId":this.overviewData.SapId?this.overviewData.SapId:undefined,
    "OrderNumber": this.orderno?this.orderno:'',
    "OpportunityNumber": this.oppno?this.oppno:'',
    "OpportunityName": this.oppName?this.oppName:'',
    }
  }



 GetRetaggingAppliedFilterData(data) {
   console.log("data to filter",data);
    
    return {
    OrderNumbers:this.service.pluckParticularKey(data.filterData.filterColumn['OrderNumber'], 'name'),
    OpportunityNumbers:this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityNumber'], 'name'),
    OpportunityNames:this.service.pluckParticularKey(data.filterData.filterColumn['OpportunityName'], 'name'),
    OwnerIds:this.service.pluckParticularKey(data.filterData.filterColumn['OrderOwner'], 'name'),
    Sources:this.service.pluckParticularKey(data.filterData.filterColumn['Source'], 'id'),
    SapCustomerCodes:this.service.pluckParticularKey(data.filterData.filterColumn['SapName'], 'name'),
    // StartDates:this.service.pluckParticularKey(data.filterData.filterColumn['EngamentStartDate'], 'id'),
    // EndDates:this.service.pluckParticularKey(data.filterData.filterColumn['EngagementEndDate'], 'id'),
    PropsalTypes:this.service.pluckParticularKey(data.filterData.filterColumn['OpportunitySource'], 'id'),
     "StartFromDate": this.startFilterDate?(this.datePipe.transform(this.startFilterDate, "yyyy-MM-dd")):undefined,
    "StartToDate": this.endFilterDate?(this.datePipe.transform(this.endFilterDate, "yyyy-MM-dd")):undefined,
    "EndFromDate": this.startFilterDate1?(this.datePipe.transform(this.startFilterDate1, "yyyy-MM-dd")):undefined,
    "EndToDate ": this.endFilterDate1?(this.datePipe.transform(this.endFilterDate1, "yyyy-MM-dd")):undefined,
    "SapId":this.overviewData.SapId?this.overviewData.SapId:undefined,
    }
  }

 generateFilterConfigData(data, headerName, isConcat) {
      debugger;
      if(data.filterData.headerName=='EngamentStartDate' || data.filterData.headerName=='EngagementEndDate'){

      }

    else{
      let useFulldata = {

        
        OrderStatus: undefined,
        "orderno": this.orderno?this.orderno:'',
        OpportunityNumber: this.oppno?this.oppno:'',
        OpportunityName: this.oppName?this.oppName:'',
        AccountId: this.accountID,
        page:this.filterConfigData[headerName].PageNo,
        count:10,
        SearchText:data.filterData.columnSerachKey,
        NextLink:this.filterConfigData[headerName].NextLink
      }


      this.changeOpposvc.getFilterCampaignSwitchListData({ ...data, useFulldata: useFulldata , columnFIlterJson: this.GetRetaggingAppliedFilterData(data)}).subscribe(res => {
        this.filterConfigData.isFilterLoading = false;
        console.log("res",res);
        if(res.IsError) {
          this.snackBar.open(res.Message, this.action, {
            duration: 3000
          });
        }
        else
        {
         this.filterConfigData[headerName] = {
            data: (isConcat) ? this.filterConfigData[headerName]["data"].concat(res.ResponseObject) : res.ResponseObject,
            recordCount: res.TotalRecordCount,
            NextLink: res.OdatanextLink,
            PageNo: (res.CurrentPageNumber)?res.CurrentPageNumber:this.filterConfigData[headerName].PageNo
          }
         
          data.filterData.filterColumn[headerName].forEach(res => {
          
             let index;
            index = this.filterConfigData[headerName].data.findIndex(x => x.id == res.id);
          if (index !== -1) {
            this.filterConfigData[headerName].data[index].isDatafiltered = true
          }
        });
        }
        
      })
  }
}


wiproContact(data) {
  this.isSearchLoaderForOrder=true;
  this.selectFlagOrder=true;
  if(this.selected_order_number!==data)
  {
    this.oppName="";
    this.oppno="";
    // this.changeOpportunityTable=this.initialData;
    // this.tableTotalCount=this.changeOpportunityTable.length;
  } 
  let obj={ 
    "AccountId":this.overviewData.accountID,
    "SapId":this.overviewData.SapId,
    "OrderNumber":data
    };
  this.changeOpposvc.getAll(obj).subscribe(res=>{   
    if(res.isError)
    {
      this.snackBar.open(res.Message, this.action, {
        duration: 3000
      });
      this.isSearchLoaderForOrder=false;
    }
    else{
      this.isSearchLoaderForOrder=false;
      if(res.ResponseObject!==null && res.ResponseObject.length>0)
      {
       this.ordernos = res.ResponseObject;
       
  }
  else
  {
    this.ordernos=[{}];
  }
    }
  })

}

wiproContactOpportunityNumber(data)
{
  this.isSearchLoaderForOpp=true;
 
  this.selectFlagOpportunity=true;
  if(this.selected_opp_number!==data)
  {
    this.orderno="";
    this.oppName="";
    // this.changeOpportunityTable=this.initialData;
    // this.tableTotalCount=this.changeOpportunityTable.length;
  } 
  let obj={ 
    "AccountId":this.overviewData.accountID,
    "OpportunityNumber":data,
    "SapId":this.overviewData.SapId
    };
  this.changeOpposvc.getAll(obj).subscribe(res=>{
    if(res.isError)
    {
      this.snackBar.open(res.Message, this.action, {
        duration: 3000
      });
      this.isSearchLoaderForOpp=false;
    }
    else{
      this.isSearchLoaderForOpp=false;
      if(res.ResponseObject!==null && res.ResponseObject.length>0)
      {
          this.oppnos = res.ResponseObject;
      }
      else
      {
          this.oppnos=[{}];
      }
     
    }
    
  })
}

// orderFilter()
// {
//   let orderArray=this.initialData.filter(x => x.OrderNumber.toLowerCase() == this.orderno.toLowerCase());
//   this.changeOpportunityTable = orderArray;
//    this.changeOpportunityTable=this.changeOpportunityTable.map((x,i)=>{
//             x.index=i+1,
//             x.OrderNumber=x.OrderNumber?x.OrderNumber:'NA';
//             return x;
//             })
//   this.tableTotalCount=orderArray.length;
// }

successPopup() {
  console.log("selected",this.selected_orderData);
   this.service.loaderhome = true;
  let obj={
    "PrimaryOrderId":this.selected_orderData["OrderNumber"],
    "PrimaryOppId":this.selected_orderData["OpportunityId"],
    "OppId":this.overviewData.opportunityId,
    "OppType":this.opportunityType,
    "PrimaryOrderGuid":this.selected_orderData.OrderId,
    "SapId":this.selected_orderData.SapId
  }
  this.changeOpposvc.changeOpportunityType(obj).subscribe(res=>{
    if(res.isError)
    {
      this.service.loaderhome = false;
      this.snackBar.open(res.Message, this.action, {
        duration: 3000
      });
    }
    else{
      if(res.ResponseObject!==null)
      {
      this.service.loaderhome = false;
      this.summary_data[0].tcvchange=res.ResponseObject.OpportunityNumber;
      this.projectService.setSession('opportunityName',res.ResponseObject.name);
      this.projectService.setSession('oppNameChanged',true);
      if(res.ResponseObject.SourceDisplay)
      {
        this.summary_data[4].tcvchange=res.ResponseObject.SourceDisplay;
      }      
      const dialogRef = this.dialog.open(SuccessOpportunityComponent,
        {
          width: '900px',
        });    
        dialogRef.componentInstance.summary_data = this.summary_data;
        dialogRef.afterClosed().subscribe(() => {
        this.router.navigate(['/opportunity/opportunityview/overview']); // Do stuff after the dialog has closed
        // window.history.back();
      });
      }
    }
  })
  
    }
}


@Component({
  selector: 'Sccess-popup',
  templateUrl: './success-popup.html', 
  styleUrls: ['./change-opportunity.component.scss'] 
})

export class SuccessOpportunityComponent {
  
  constructor(public dialogRef: MatDialogRef<SuccessOpportunityComponent>) { }
  panelOpenState:boolean;
  summary_data:any;
  closeDialogBox()
  {
    // window.history.back();
  }

}
