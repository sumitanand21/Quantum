// Meghana code starts 11/02/2019
import { Injectable } from '@angular/core';
import { forkJoin, of ,Observable,throwError} from "rxjs";
import { ApiServiceOpportunity } from './api.service';
import { BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams, HttpBackend } from '@angular/common/http';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { switchMap} from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { catchError, map } from "rxjs/operators";
import { environment as env } from '@env/environment';

import { EncrDecrService } from "./encr-decr.service";
import { ApiService } from "./api.service";
import { EnvService } from './env.service';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

const envADAL = new EnvService();

// Read environment variables from browser window

const browserWindow = window || {};
const browserWindowEnv = browserWindow['__env'] || {};

// Assign environment variables from browser window to env
// In the current implementation, properties from env.js overwrite defaults from the EnvService.

// If needed, a deep merge can be performed here to merge properties instead of overwriting them.

for (const key in browserWindowEnv) {
  if (browserWindowEnv.hasOwnProperty(key)) {

    envADAL[key] = window['__env'][key];
  }
}

const BASE_URL = envADAL.l2oBaseUrl;

const routes = {
    filterRegister:'OpportunityCommitmentRegister/GetCommitmentRegisterColumnValues',
    commitmentregister: 'OpportunityCommitmentRegister/GetCommitmentRegister',
    commitmentregisterNotes: 'OpportunityCommitmentRegister/GetAttachmentsForCommitmentRegister',
    addNewRegister:'OpportunityCommitmentRegister/CreateCommitmentRegisteration',
    addNewNotes:'OpportunityCommitmentRegister/CreateAttachmentforCommitmentRegister',
    savenewregister:'OpportunityCommitmentRegister/UpdateCommitmentRegisteration',
    deleteRegister:'OpportunityCommitmentRegister/DeactivateCommitmentRegistration',
    deleteNotes:'OpportunityCommitmentRegister/DeleteAttachmentsForCommitmentRegister',
    filterByRegisterName:'OpportunityCommitmentRegister/SearchColumnName',
    filterByRegisterNumber:'OpportunityCommitmentRegister/SearchColumnCommitmentNumber',
    filterByDate:'OpportunityCommitmentRegister/SearchColumnCreatedDate',
    filterByDescription:'OpportunityCommitmentRegister/SearchColumnDescription',
    filterDate:'OpportunityCommitmentRegister/GetCommitmentRegisterFilter'
};

export const commitmentheader: any[] = [
    { id: 1, isFilter:false, name: 'Name', SortId:"0",isFixed: true, order: 1, title: 'Name', routerLink:'/contacts/Contactdetailslanding/contactDetailsChild' ,selectName: "Record",displayType:"name" },
    { id: 2, isFilter:false, name: 'SerialNumber', SortId:37,isFixed: false, order: 2, title: 'Commitment no',displayType:"upperCase" },
    { id: 3, isFilter:false, name: 'CreadedBy', SortId:6,isFixed: false, order: 3, title: 'Created by',displayType:"name" },
    { isHideColumnSearch: true ,id: 4, isFilter:false, name: 'CreatedDateInFormat', SortId:3,isFixed: false, order: 4, title: 'Created date' , dateFormat: 'dd-MMM-yyyy' },
    { id: 5, isFilter:false, name: 'Description', SortId:29,isFixed: false, order: 5, title: 'Description',displayType:"capsFirstCase"},
    { hideFilter: true,SortId:49,id: 6, isFilter:false, name: 'FileName',isFixed: false, order: 6, title: 'Attachments',className:"approvalstatus",isModal:true }
]

@Injectable({
    providedIn: 'root'
})
export class CommitmentRegisterService {
    private options = { headers: new HttpHeaders().set('Content-Type', 'application/json'),withCredentials: true  };
    public RegisterData = new BehaviorSubject<any>(null);
    RegisterEditData: Observable<any> = this.RegisterData.asObservable();
  
    constructor(
         public datepipe: DatePipe,
        private apiServiceOpportunity: ApiServiceOpportunity,
        private http: HttpClient,
        private encService: EncrDecrService,
        private apiService: ApiService,
        private httpClient: HttpClient,) { }

// ***********************************************Farming-account landing************************************************************
fileListToDelete=[];
fileListToInsert=[];
selectedFile:File=null;
setopportunityData(DatatoEdit: any) {  
    this.RegisterData.next(DatatoEdit);
  }

  
getAllCommitmentRegister(postBody: Object){
        return this.apiServiceOpportunity.post(routes.commitmentregister,postBody);
    }

saveNewRegister(postBody: Object){
        return this.apiServiceOpportunity.post(routes.savenewregister,postBody);
    }

addNewRegister(newRegisterData:Object)
{
    return this.apiServiceOpportunity.post(routes.addNewRegister,newRegisterData);
} 

addNotes(newNotesData:Object)
{
    return this.apiServiceOpportunity.post(routes.addNewNotes,newNotesData);
}

uploadNote(newNotesData):Promise<any>{
    const url=" https://quapi-qa.wipro.com/L2O.Sprint1_2.Api/api/Storage/UploadDocument";
   
    const fd=new FormData();
    return new Promise((resolve,reject)=>
    {
        fd.append("Files",newNotesData,newNotesData.name);
        let xhr=new XMLHttpRequest();
        xhr.open('post',url,true);
        xhr.send(fd);
        xhr.onreadystatechange=function()
        {
            if(xhr.readyState==XMLHttpRequest.DONE)
            {
                console.log("data to upload inside xhr",xhr.readyState)
                if(xhr.status===201)
                {
                    resolve(JSON.parse(xhr.response));
                }
                else{
                    reject(xhr.response);
                }
            }
        }
        
    })

}

//  filesToUploadDocument64(list) {
//         let fileListArray = []
//         list.forEach(file => {
//             fileListArray.push(this.http.post(`${BASE_URL}Storage/UploadDocument64`, file).pipe(catchError(e => of(''))))
//         });
//         return forkJoin(fileListArray)
//     }

     filesToDownloadDocument64(list) {
        console.log(`Request Payload to ${BASE_URL}v1/AccountManagement/Download64Document api`, JSON.stringify(list));
        let token = localStorage.getItem("token").toString();
        let encrPayload = this.encService.set(
            token.substring(0, 32),
            JSON.stringify(list),
            envADAL.encDecConfig.key
          );
          return this.httpClient
            .post(`${BASE_URL}v1/AccountManagement/Download64Document`, encrPayload, { responseType: "text" })
            .pipe(
              map(data => {
                let responseObject = JSON.parse(
                  this.encService.get(
                    token.substring(0, 32),
                    data,
                    envADAL.encDecConfig.key
                  )
                );
                console.log(
                  `Response from ${BASE_URL}v1/AccountManagement/Download64Document api`,
                  JSON.stringify(responseObject)
                );
                return responseObject;
              }),
              catchError(this.formatErrors)
            );
    }
public formatErrors(error: any): Observable<any> {
        return throwError(error.error);
      }


deleteNotes(notesData:Object)
{
    return this.apiServiceOpportunity.post(routes.deleteNotes,notesData);
}

getAllCommitmentRegisterNotes(postBody: Object){
    return this.apiServiceOpportunity.post(routes.commitmentregisterNotes,postBody);
}

deleteCommitmentRegister(registerData:Object)
{
    return this.apiServiceOpportunity.post(routes.deleteRegister,registerData);
}

exportAsExcelFile(json, excelFileName){
    
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }

      //filter


       getFilterRegisterSwitchListData(data) {
        switch (data.filterData.headerName) {
            case 'Name':
                return this.getRegisterNameColumnFilterData(data)
            case 'SerialNumber':
                return this.getRegisterNumberColumnFilterData(data)
            case 'CreatedDateInFormat':
                return this.getRegisterDateColumnFilterData(data)
            case 'Description':
                return this.getDescriptionColumnFilterData(data)
            case  'FileName':
               return this.fileNameData(data);
             case  'CreadedBy':
               return this.CreadedByData(data);
        }

    }


     CreadedByData(data:any):Observable<any>
    {
        
       return this.getRegisterNameList(data).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterCreadedByData(res.ResponseObject) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

    filterCreadedByData(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                         id: x.CreatedBy?(x.CreatedBy).replace(/\s/g,''):'NA',
                        name: x.CreatedBy?x.CreatedBy:'NA',
                        isDatafiltered: false
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }

    fileNameData(data:any):Observable<any>
    {
         
       return this.getRegisterNameList(data).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.getFilterFileNameData(res.ResponseObject) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getFileNameData(body) :Observable<any>{

        return this.apiServiceOpportunity.post(routes.filterByRegisterName,body)
    }
    
    getFilterFileNameData(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id:  x.Name?(x.Name).replace(/\s/g,''):'',
                        name: x.Name?x.Name:'NA',
                        isDatafiltered: false
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }



    getRegisterNameColumnFilterData(data:any):Observable<any>
    {
          

       return this.getRegisterNameList(data).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterRegisterNameColumndata(res.ResponseObject) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getRegisterNameList(body) :Observable<any>{
        let request= {
         ...body.columnFIlterJson,
         ...body.useFulldata
         }
           
        return this.apiServiceOpportunity.post(routes.filterRegister,request)
    }

    filterRegisterNameColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                       id: x.Name?(x.Name).replace(/\s/g,''):'',
                        name: x.Name?x.Name:'NA',
                        isDatafiltered: false
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }

     getRegisterNumberColumnFilterData(data:any):Observable<any>
    {
        
       return this.getRegisterNameList(data).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterNumberColumndata(res.ResponseObject) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

    getRegisterNumberList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.filterByRegisterNumber,body)
    }
    
    filterNumberColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                         id: x.Name?(x.Name).replace(/\s/g,''):'',
                        name: x.Name?x.Name:'NA',
                        isDatafiltered: false
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }

    getRegisterDateColumnFilterData(data:any):Observable<any>
    {

       return this.getRegisterDateList(data.useFulldata).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterRegisterDateColumndata(res.ResponseObject) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getRegisterDateList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.filterByDate,body)
    }
    
    filterRegisterDateColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                         name: (x.CreatedDate) ? this.datepipe.transform(x.CreatedDate,"dd-MMM-yyyy") : 'NA',
                        id: (x.CreatedDate),
                        value:x.CreatedDate,
                       
                        isDatafiltered: false
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    }  

formatDate(date) {
    let  monthArr=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    var d = new Date(date),
        month = '' + (monthArr[d.getMonth()]),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('-');
  }
  getDescriptionColumnFilterData(data:any):Observable<any>
    {
  
       return this.getRegisterNameList(data).pipe(switchMap(res => {
            if (res) {
              console.log("result",res)
              
                return of((!res.IsError) ? { ...res, ResponseObject: (res.ResponseObject.length > 0) ? this.filterDescriptionColumndata(res.ResponseObject) : [] } : [])
            }
            else {
                return of([])
            }
        }))
    }

     getDescriptionList(body) :Observable<any>{
        return this.apiServiceOpportunity.post(routes.filterByDescription,body)
    }
    
    filterDescriptionColumndata(data) {
        if (data) {
            if (data.length > 0) {
                return data.map(x => {
                    return {
                        id: x.Name?(x.Name).replace(/\s/g,''):'',
                        name: x.Name?x.Name:'NA',
                        isDatafiltered: false
                    }
                })
            } else {
                return []
            }
        } else {
            return []
        }
    } 
    getFilteredData(body)
    {
         return this.apiServiceOpportunity.post(routes.filterDate,body)
    }

// ***********************************************Farming-account landing************************************************************
}