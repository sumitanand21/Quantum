import { Component, OnInit } from '@angular/core';
import { DataCommunicationService} from '@app/core';
import { Router } from '@angular/router';
import { MatDialog,MatSnackBar } from '@angular/material';
import { CommitmentRegisterService ,commitmentheader} from '@app/core/services/commitmentregister.service';
import { OpportunitiesService } from '@app/core';
import { Observable } from 'rxjs';
import { environment as env } from '@env/environment';
import { DatePipe } from "@angular/common";
import { EnvService } from '@app/core/services/env.service';

declare let FileTransfer: any;
@Component({
  selector: 'app-commitment-register',
  templateUrl: './commitment-register.component.html',
  styleUrls: ['./commitment-register.component.scss']
})
export class CommitmentRegisterComponent implements OnInit {
  datePipe = new DatePipe("en-US");
  CommitmentRegisterTable=[];
  tableTotalCount:number;
  commitmentArray=[];
  reportData=[];
  oppName=this.projectService.getSession('opportunityName');
  oppId=this.projectService.getSession('opportunityId');
  
  monthArr=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  action:any;
  nextLink="";
  isLoading=true;
  searchText="";
  ManagementLogTableRequestBody =
  {
  "PageSize": 50,
  "RequestedPageNumber": 1
  }
  exportFlag =false
  constructor(public register:CommitmentRegisterService,public projectService: OpportunitiesService,public snackBar:MatSnackBar,public dataService:DataCommunicationService,public router:Router,public dialog:MatDialog,public envr : EnvService) { }

  ngOnInit(): void {    
debugger;
    this.exportFlag =   sessionStorage.getItem('exportFlag')?true:false
     this.getTableData();
}
getTableData()
{
  this.isLoading=true
  let obj=
  { 
    "OpportunityId":this.oppId,
    "PageSize":this.ManagementLogTableRequestBody.PageSize,
    "RequestedPageNumber":this.ManagementLogTableRequestBody.RequestedPageNumber,
    "NextPageDataUrl" :this.nextLink,
    "SearchText":this.searchText

  }
   this.register.getAllCommitmentRegister(obj).subscribe(res=>{
        if(res.ResponseObject!=null)
        {
        if(res.isError)
        {
          this.snackBar.open("Server error occured.Try after some time", this.action, {
            duration: 3000
          });
          this.isLoading=false;
        }        
        else
        {
          // this.searchText="";
          this.reportData=res.ResponseObject;
          this.commitmentArray= res.ResponseObject;

              if(res.ResponseObject!=null)
              {
              this.checkForEmptyName();
                if(this.commitmentArray.length)
                {
                this.getNotes(res.ResponseObject[0],0);
                }
                else
                {
                  this.isLoading=false;
                  this.CommitmentRegisterTable=[{}];
                }
              this.tableTotalCount = res.TotalRecordCount;
              this.nextLink=res.OdatanextLink;
              }
        } 
      }
      else
      {
        this.isLoading=false;
        this.CommitmentRegisterTable=[{}];
      }
       
    })
    this.register.fileListToInsert=[];
    this.register.fileListToDelete=[];
}
 /************Select Tabs dropdown code starts */
 selectedTabValue: string = "";
 /************Select Tabs dropdown code ends */
 paginationPageNo = {
  "PageSize": 50,
  "RequestedPageNumber": 1,
  "OdatanextLink": ""
}

//filter obj
  filterConfigData = {
    Name: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    SerialNumber: { data: [], recordCount: 0, PageNo:1,NextLink: '' },
    CreatedDateInFormat: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    Description: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    FileName: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
     CreadedBy: { data: [], recordCount: 0,PageNo:1, NextLink: '' },
    isFilterLoading:false
  };
formReportData()
{
  for(var i=0;i<this.commitmentArray.length;i++)
  {
   let obj={};
   obj["Name"]=this.commitmentArray[i].Name;
   obj["SerialNumber"]=this.commitmentArray[i].SerialNumber;
   obj["CreatedDateInFormat"]=this.commitmentArray[i].CreatedDateInFormat;
   obj["Description"]=this.commitmentArray[i].Description;
   this.reportData[i]=obj;
  }
}  
addNewRegister()
{
  this.isLoading=true;
  this.dataService.filesList=[];
  let obj={
    "Name":"",
    "Description":"",
    "OpportunityId":this.oppId
  }
  this.register.addNewRegister(obj).subscribe(res=>
  {
    if(res.isError)
    {
      this.snackBar.open(res.Message, this.action, {
        duration: 3000
      });
      this.isLoading=false;
    }
    else{
      this.register.setopportunityData(res.ResponseObject);
      this.router.navigate(["/opportunity/oppactions/commitmentregisterdetails"]);
      this.isLoading=false;
    }
  })
 
}

getNewTableData(event)
{

     this.ManagementLogTableRequestBody = {
      "PageSize": event.itemsPerPage,
      "RequestedPageNumber":  event.currentPage,
    
    };
//  this.ManagementLogTableRequestBody.PageSize=event.itemsPerPage;
//  this.ManagementLogTableRequestBody.RequestedPageNumber=event.currentPage;
  if (this.dataService.checkFilterListApiCall(event)) {
        // filter api call
        this.CallListDataWithFilters(event);
      } else {
        // list api call
            this.getTableData();
  
      }
    }


checkForEmptyName()
{
  for(var i=0;i<this.commitmentArray.length;i++)
  {
    if(this.commitmentArray[i].Name==null)
    {
      this.deleteRegisterwithEmptyName(this.commitmentArray[i]);
    }
  }
  this.commitmentArray=this.commitmentArray.filter((x)=>x.Name!==null);
}
getNotes(obj,index){
  this.isLoading =true
  if(index<this.commitmentArray.length)
  {
  let objNotes=
  { 
    "CommitmentRegisterid":obj.CommitmentRegisterid
  };
  
  this.register.getAllCommitmentRegisterNotes(objNotes).subscribe(res1=>{
    if(res1.isError)
    {
      this.snackBar.open(res1.Message, this.action, {
        duration: 3000
      });
      this.isLoading=false;
    }
    else{
      if(index==(this.commitmentArray.length-1))
      {
       this.isLoading=false;
      
      }
      this.commitmentArray[index].CreatedDateInFormat=this.formatDate(this.commitmentArray[index].CreatedDate);
      if(res1.ResponseObject!==null){
        this.commitmentArray[index].Attachments=res1.ResponseObject;
        let attachmentArray=[];
        for(var i=0;i<this.commitmentArray[index].Attachments.length;i++)
        {    
          attachmentArray.push(this.commitmentArray[index].Attachments[i].AttachmentName)
          this.commitmentArray[index].Attachments[i].name=this.commitmentArray[index].Attachments[i].AttachmentName;
          this.commitmentArray[index].Attachments[i].link=this.commitmentArray[index].Attachments[i].AttachmentLink;
        }
        if(res1.ResponseObject.length > 0)
        {
          this.commitmentArray[index].FileName=attachmentArray;
        }
        else
        {
          this.commitmentArray[index].FileName= ['-'];
        }
        index=index+1;
        this.getNotes(this.commitmentArray[index],index)
      }
      else{
        this.commitmentArray[index].Attachments=[];
        index=index+1;
        this.getNotes(this.commitmentArray[index],index);
      }
    }
   
    }) 
 


   if(this.commitmentArray.length>0)
   {
       // const perPage = this.ManagementLogTableRequestBody.PageSize;
       // const start = ((this.ManagementLogTableRequestBody.RequestedPageNumber - 1) * perPage) + 1;
       // let i = start;
       // const end = start + perPage - 1;
   
   }
          else
    {

      this.CommitmentRegisterTable=[{}];
    }
  
    } 
else
{    if(this.ManagementLogTableRequestBody.RequestedPageNumber == 1){
  this.CommitmentRegisterTable =[]
  this.CommitmentRegisterTable =this.commitmentArray;

    this.CommitmentRegisterTable=this.CommitmentRegisterTable.map((x,index)=>{              
 
  x.index= index + 1 ,
  x.Name=x.Name?x.Name:'NA',
  x.Description=x.Description?x.Description:'NA',
  x.CreadedBy = x.CreadedBy?x.CreadedBy:'NA',
  x.CreatedDateInFormat = x.CreatedDateInFormat?x.CreatedDateInFormat:'NA',
  x.SerialNumber = x.SerialNumber?x.SerialNumber:'NA'
 
  return x;
})
}
else{
this.CommitmentRegisterTable = this.CommitmentRegisterTable.concat(this.commitmentArray)

  this.CommitmentRegisterTable=this.CommitmentRegisterTable.map((x,index)=>{              

    x.index= index + 1 ,
  x.Name=x.Name?x.Name:'NA',
  x.Description=x.Description?x.Description:'NA',
  x.CreadedBy = x.CreadedBy?x.CreadedBy:'NA',
  x.CreatedDateInFormat = x.CreatedDateInFormat?x.CreatedDateInFormat:'NA',
  x.SerialNumber = x.SerialNumber?x.SerialNumber:'NA'
  return x;
})
}
  this.isLoading =false
 return true;
} 
console.log(this.CommitmentRegisterTable,'this.CommitmentRegisterTable')
}
 formatDate(date) {
    var d = new Date(date),
        month = '' + (this.monthArr[d.getMonth()]),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('-');
  }
deleteRegisterwithEmptyName(data)
{
  this.isLoading = true;
  let dataToDelete={
    "CommitmentRegisterid":data.CommitmentRegisterid,
    "StateCode":data.StateCode
  }
  this.register.deleteCommitmentRegister(dataToDelete).subscribe(res=>
  {
    if(res)
    {
         this.isLoading = false;
         if(res.isError)
          {
            this.snackBar.open("server error occured", this.action, {
              duration: 3000
            });
            this.isLoading=false;
          }
          else{
            this.CommitmentRegisterTable =  this.CommitmentRegisterTable.filter(x=>x.CommitmentRegisterid != data.CommitmentRegisterid);
            this.tableTotalCount=this.tableTotalCount-1;
          }
    }
   
  })

}

deleteRegister(data)
{
  this.isLoading=true;
  let dataToDelete={
    "CommitmentRegisterid":data[0].CommitmentRegisterid,
    "StateCode":data[0].StateCode
  }
  this.register.deleteCommitmentRegister(dataToDelete).subscribe(res=>
  {
    if(res)
    {
         if(res.isError)
          {
            this.snackBar.open(res.Message, this.action, {
              duration: 3000
            });
            this.isLoading=false;
          }
          else{
            this.snackBar.open("Commitment register deleted successfully", this.action, {
              duration: 3000
            });
             this.isLoading=false;
             this.CommitmentRegisterTable =  this.CommitmentRegisterTable.filter(x=>x.CommitmentRegisterid != data[0].CommitmentRegisterid);
             this.tableTotalCount=this.tableTotalCount-1;
          }
    }
   
  })

}



// downloadCSV()
// {
//  this.formReportData();
//  if(this.reportData.length)
//  {
//     this.register.exportAsExcelFile(this.reportData,"report");
//  }
//  else
//  {
//    this.snackBar.open("No Record to download", this.action, {
//     duration: 3000
//    });
//  }
  
// }

downloadList(data): void {
    let Order = data.objectRowData[1];
    let newOrder = [];
    for(let index =0;index<Order.length;index++)
    {
      switch(Order[index].name)
      {
        case 'Name':
                   newOrder.push('Name');
                   break;
        case 'SerialNumber':
                   newOrder.push('SerialNumber');
                   break;                   
        case 'CreadedBy':
                   newOrder.push('CreadedBy');
                   break; 
        case 'CreatedDateInFormat':
                   newOrder.push('CreatedDate');
                   break; 
        case 'Description':
                   newOrder.push('Description');
                   break; 
         case 'FileName':
                   newOrder.push('Attachments');
                   break;  
         default:
                console.log("default",Order[index].name);
                break;          

      }
    }
    console.log("order",Order)
    console.log("newOrder",newOrder)
    this.isLoading = true


   

    let isDownloadReqBody = {
     OppId:this.oppId,
        PageSize: 1,
        RequestedPageNumber: 1,
        NextPageDataUrl: "",
        SearchText:data.filterData.globalSearch,
        SortBy:this.projectService.pluckParticularKey(commitmentheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0],      
        Names:this.projectService.pluckParticularKey(data.filterData.filterColumn['Name'], 'name'),
        IsDesc: false,
        // CreatedOnDates:this.projectService.pluckParticularKey(data.filterData.filterColumn['CreatedDateInFormat'], 'id'),
        Descriptions: this.projectService.pluckParticularKey(data.filterData.filterColumn['Description'], 'name'),
        CommitmentNumbers: this.projectService.pluckParticularKey(data.filterData.filterColumn['SerialNumber'], 'name') ,
        "CreatedByList": this.projectService.pluckParticularKey(data.filterData.filterColumn['CreadedBy'], 'name'),
        ColumnSearchText:"",
        ColumnOrder:newOrder,
        AttachmentIds:this.projectService.pluckParticularKey(data.filterData.filterColumn['FileName'], 'name'),
        "StartFromDate": this.startFilterDate?(this.datePipe.transform(this.startFilterDate, "dd-MMM-yyyy")):undefined,
        "StartToDate":   this.endFilterDate?(this.datePipe.transform(this.endFilterDate, "dd-MMM-yyyy")):undefined

   }

    this.projectService.downloadCommitment(isDownloadReqBody).subscribe(res => {

      if (!res.IsError) {
        this.isLoading = false
        if (this.envr.envName === 'MOBILEQA') {
          this.downloadListMobile(res.ResponseObject)
        } else {
          this.dataService.Base64Download(res.ResponseObject);
         
          // window.open(res.ResponseObject.Url, "_blank");
        }
      } else {
        this.isLoading = false
         this.projectService.displayMessageerror(res.Message)
      }
    }, error => {
      this.isLoading = false
    })

  }

  downloadListMobile(fileInfo) {
    var fileTransfer = new FileTransfer();
    var newUrl = fileInfo.Url.substr(0, fileInfo.Url.indexOf("?"))
    var uri = encodeURI(newUrl);
    var fileURL = "///storage/emulated/0/DCIM/" + fileInfo.Name;
    this.projectService.displayMessageerror(`${fileInfo.Name} downloaded`)
    fileTransfer.download(
      uri, fileURL, function (entry) {
        console.log("download complete: " + entry.toURL());
      },
      function (error) {
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("download error code" + error.code);
      },
      null, {
      //     "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
      //  } headers: {
      // 
    }
    );
  }
startFilterDate=''
endFilterDate=''

clearAllFilter(data,PageSize){

  this.ManagementLogTableRequestBody = {
    "PageSize": PageSize,
    "RequestedPageNumber": 1,
   
  }
            this.CallListDataWithFilters(data)

}

performTableChildAction(childActionRecieved): Observable<any> {
  
if(childActionRecieved.filterData.filterColumn.CreatedDateInFormat.length>0){
 this.startFilterDate = childActionRecieved.filterData.filterColumn.CreatedDateInFormat?childActionRecieved.filterData.filterColumn.CreatedDateInFormat[0].filterStartDate.toLocaleString():''
 this.endFilterDate =  childActionRecieved.filterData.filterColumn.CreatedDateInFormat?childActionRecieved.filterData.filterColumn.CreatedDateInFormat[0].filterEndDate.toLocaleString():''
}
  var actionRequired = childActionRecieved;
  console.log("action",actionRequired)
  switch (actionRequired.action) {
 
  case 'ClearAllFilter': {
    this.clearAllFilter(childActionRecieved,childActionRecieved.pageData.itemsPerPage);
 
    return
      }

   case 'DownloadCSV': {
        console.log("downloafing")
        this.downloadList(childActionRecieved);
        return
      }
    case 'Name':{
      this.dataService.filesList=actionRequired.objectRowData[0].Attachments;
      this.register.setopportunityData(actionRequired.objectRowData[0]);
      this.router.navigate(['/opportunity/oppactions/commitmentregisterdetails']);
      return;
      }     
      case 'DeleteCal':
      {
        this.deleteRegister(actionRequired.objectRowData)
        return; 
      }
      case 'edit':
      {
        this.dataService.filesList=actionRequired.objectRowData[0].Attachments;
        this.register.fileListToDelete=[];
        this.register.fileListToInsert=[];
        this.register.setopportunityData(actionRequired.objectRowData[0]);
        this.router.navigate(['/opportunity/oppactions/commitmentregisterdetails']);
        return;
      }
      case 'search':
      {
        
          this.ManagementLogTableRequestBody = {
  "PageSize": actionRequired.pageData.itemsPerPage,
  "RequestedPageNumber": 1
  
   }
          this.searchText = actionRequired.filterData.globalSearch;
       this.ManagementLogTableRequestBody.PageSize = actionRequired.pageData.itemsPerPage;
       this.ManagementLogTableRequestBody.RequestedPageNumber = 1;
       this.nextLink="";
      
       if (this.dataService.checkFilterListApiCall(childActionRecieved)) {
        this.CallListDataWithFilters(childActionRecieved);
             return;
        
      } else {
       this.getTableData();
         return;
      }
           
      }
       case 'columnFilter': {
         debugger
        this.GetColumnFilters(actionRequired);
        return;
      }
       case "columnSearchFilter": {
        this.GetColumnSearchFilters(childActionRecieved);
        break
      }
      case 'loadMoreFilterData': {
        console.log("extra data")
        this.LoadMoreColumnFilter(actionRequired);
        return
      }
      case 'sortHeaderBy': {
        debugger;
        this.ManagementLogTableRequestBody = {
          "PageSize": actionRequired.pageData.itemsPerPage,
          "RequestedPageNumber": 1
          
           }    
       this.CallListDataWithFilters(childActionRecieved);
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
           
          this.ManagementLogTableRequestBody.RequestedPageNumber=1
          this.ManagementLogTableRequestBody.PageSize = this.paginationPageNo.PageSize
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
    this.register.getFilteredData(reqparam).subscribe(res => {
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
              
                this.commitmentArray=res.ResponseObject;
                if(this.commitmentArray.length)
                {
                this.getNotes(res.ResponseObject[0],0);
                }
                else
                {
                  this.isLoading=false;
                  this.CommitmentRegisterTable=[{}];
                }
              this.tableTotalCount = res.TotalRecordCount;
              this.nextLink=res.OdatanextLink;
          }
          else
          {
             this.isLoading=false;
             this.CommitmentRegisterTable =[{}];
             this.tableTotalCount =0;
          }
          }
    })
  }

 GetAppliedFilterData(data) {
   console.log("data to filter",data);
   
    return {
        OppId:this.oppId,
       
        NextPageDataUrl: "",
        PageSize: this.ManagementLogTableRequestBody.PageSize,
 RequestedPageNumber:this.ManagementLogTableRequestBody.RequestedPageNumber,
 
        SearchText:data.filterData.globalSearch?data.filterData.globalSearch:'',
        SortBy:this.projectService.pluckParticularKey(commitmentheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0]?this.projectService.pluckParticularKey(commitmentheader.filter(x => x.name == data.filterData.sortColumn), 'SortId')[0] : [],      
        Names:this.projectService.pluckParticularKey(data.filterData.filterColumn['Name'], 'name'),
        IsDesc:(data.filterData.sortColumn != '') ? !data.filterData.sortOrder : false,
        // CreatedOnDates:this.projectService.pluckParticularKey(data.filterData.filterColumn['CreatedDateInFormat'], 'id'),
        Descriptions: this.projectService.pluckParticularKey(data.filterData.filterColumn['Description'], 'name'),
        CommitmentNumbers: this.projectService.pluckParticularKey(data.filterData.filterColumn['SerialNumber'], 'name'),
        "CreatedByList": this.projectService.pluckParticularKey(data.filterData.filterColumn['CreadedBy'], 'name'),
        AttachmentIds:this.projectService.pluckParticularKey(data.filterData.filterColumn['FileName'] , 'name'),
        "ColumnSearchText":"",
         "StartFromDate": this.startFilterDate?(this.datePipe.transform(this.startFilterDate, "dd-MMM-yyyy")):undefined,
      "StartToDate": this.endFilterDate?(this.datePipe.transform(this.endFilterDate, "dd-MMM-yyyy")):undefined
    }
  }

 GetCommitmentFilterData(data) {
   console.log("data to filter",data);
   
    return {
     
        Names:this.projectService.pluckParticularKey(data.filterData.filterColumn['Name'], 'name'),
        // CreatedOnDates:this.projectService.pluckParticularKey(data.filterData.filterColumn['CreatedDateInFormat'], 'id'),
        Descriptions: this.projectService.pluckParticularKey(data.filterData.filterColumn['Description'], 'name'),
        CommitmentNumbers: this.projectService.pluckParticularKey(data.filterData.filterColumn['SerialNumber'], 'name'),

         "CreatedByList": this.projectService.pluckParticularKey(data.filterData.filterColumn['CreadedBy'], 'name'),
        AttachmentIds:this.projectService.pluckParticularKey(data.filterData.filterColumn['FileName'], 'name'),
       "StartFromDate": this.startFilterDate?(this.datePipe.transform(this.startFilterDate, "dd-MMM-yyyy")):undefined,
      "StartToDate": this.endFilterDate?(this.datePipe.transform(this.endFilterDate, "dd-MMM-yyyy")):undefined
    }
  }
 generateFilterConfigData(data, headerName, isConcat) {
      debugger;
  if(data.filterData.headerName=='CreatedDateInFormat' ){

   }
    else{
      var sortId;
      if(headerName=='Name'){ sortId=0 }
      else if(headerName=='SerialNumber'){  sortId=37 }
      else if(headerName=='CreatedDateInFormat'){  sortId=3 }
      else if(headerName=='Description'){  sortId=29 }
      else if(headerName=='FileName'){  sortId=49 }
      else if(headerName=='CreadedBy'){  sortId=6 }
      

    let useFulldata =  {
    "OppId": this.oppId,
    "PageSize": 10,
    "RequestedPageNumber": this.filterConfigData[headerName].PageNo,
    "NextPageDataUrl": "",
    "IsDesc": false,
    "SortBy":sortId,
    "SearchText":this.searchText?this.searchText:"",
    "ColumnSearchText":data.filterData.columnSerachKey?data.filterData.columnSerachKey:''
    }
      this.register.getFilterRegisterSwitchListData({ ...data, useFulldata: useFulldata, columnFIlterJson: this.GetCommitmentFilterData(data) }).subscribe(res => {
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

  goBack() {
    this.router.navigate(['/opportunity/opportunityview/overview'])
  }
 
}
