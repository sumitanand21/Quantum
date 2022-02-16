import { Component, OnInit, Inject,EventEmitter } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA,MatSnackBar } from '@angular/material/';
import { DataCommunicationService } from '@app/core/services/global.service';
import { CommitmentRegisterService } from '@app/core/services/commitmentregister.service';
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams, HttpBackend } from '@angular/common/http';
import { Router } from '@angular/router';
import { OpportunitiesService } from '@app/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions,UploadStatus } from 'ngx-uploader';
import { FileUploadService } from '@app/core/services/file-upload.service';

@Component({
  selector: 'app-commitment-register-details',
  templateUrl: './commitment-register-details.component.html',
  styleUrls: ['./commitment-register-details.component.scss']
})
export class CommitmentRegisterDetailsComponent implements OnInit {
state="noneditable";
monthArr=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
pause=false;
record=true;
registerData:any={};
isNew=false;
isLoading=false;
filetoadd = [];
files = [];
fileNames = [];
fileNamesToDownload = [];

checkForNewReg=0;
createdDate="";
changeFlag=false;

oppName=this.projectService.getSession('opportunityName');
OpportunityId=this.projectService.getSession('opportunityId');
action:any;
commitmentRegisterName="New Register";

accept = ['application/pdf', 'text/xml', 'application/jpg', 'application/xml', 'application/zip', 'application/octet-stream', 'audio/mp3', 'audio/mp4', 'image/jpeg', 'image/png', 'text/plain', 'image/gif', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/msexcel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/doc', 'application/docx', 'video/mp4', 'audio/mpeg', 'application/x-zip-compressed', 'application/mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];


  constructor(public dialog: MatDialog,public router: Router, public projectService: OpportunitiesService,public uploadService: FileUploadService,public http:HttpClient,public snackBar:MatSnackBar, public service: DataCommunicationService,public registerService:CommitmentRegisterService) {
  }

  deleteRegisterwithEmptyName(data)
  {
  let dataToDelete={
    "CommitmentRegisterid":data.CommitmentRegisterid,
    "StateCode":data.StateCode
  }
  console.log(dataToDelete);
  this.registerService.deleteCommitmentRegister(dataToDelete).subscribe(res=>
  {
    if(res)
    {
         if(res.isError)
          {
            this.snackBar.open("server error occured", this.action, {
              duration: 3000
            });
            this.isLoading=false;
          }
          else{
            this.registerData={};
            console.log("Deleted successfully");
          }
    }
  })
}
  goBack() {
    console.log("this.registerData:", this.registerData);
    if (this.registerData.Name == null && !this.saveReg) {
      this.deleteRegisterwithEmptyName(this.registerData);
    }
    setTimeout(() => {
      this.router.navigate(['/opportunity/oppactions/commitmentregister']);
    }, 1000); 
    //window.history.back();
  }

  ngOnInit() {    
    this.saveReg=false;
    this.fileNames = [];
    this.registerService.RegisterData.subscribe(res=>
    {
      console.log("sdsdf",res);
      console.log("files",this.service.filesList)
      if(res==null)
      {
        window.history.back();
      }
      else
      {
        this.registerData=res;
        if(this.registerData.Name==undefined || this.registerData.Name==null)
        {
          this.state='editable';
          this.registerData.CreatedDate=new Date();
          this.isNew=true;     
        }
        else
        {
          this.createdDate=this.registerData.CreatedDateInFormat;
          this.commitmentRegisterName=this.registerData.Name;  
          this.checkForNewReg =1;
        }
      }
    })
    this.checkForAttachments();


    
  }

  fileChangeEvent(e) {
    this.isLoading = true;
    let files = [].slice.call(e.target.files);
    let uploadingFileList = [];
    // let fileNames = [];
    if (files.length > 0) {
      files.forEach(res => {
        let file: File = res;
        let canditionAction = this.fileValidation(file)
        switch (canditionAction) {
          case 'FileSize': {
            this.projectService.throwError("Not able to upload the file because filesize is greater than 5mb.");
            this.isLoading = false;
            break;
          }
          case 'InvalidFormat': {
            this.projectService.throwError("File format not supported!")
            this.isLoading = false;
            break;
          }
          case 'FileExist': {
            this.projectService.throwError("File is already exist!")
            this.isLoading = false;
            break;
          }
          case 'Upload': {
            const fd: FormData = new FormData();
            fd.append('file', file);
            this.fileNames.push(file.name)
            uploadingFileList.push(fd)
            this.service.filesList.push(file);
            this.filetoadd.push(fd);
            this.files.push(file);
            this.service.filename= file.name;
            this.registerService.fileListToInsert.push(fd); 
            this.isLoading = false;      
            break;
          }
        }
      })
      // this.fileUplaod(uploadingFileList, fileNames)
    }
  }


   fileValidation(file) {
    if (file.size > 5242880) {
      return 'FileSize'
    }
    if (!this.accept.includes(file.type)) {
      return 'InvalidFormat'
    }
    if (this.service.filesList.length == 0) {
      if (this.accept.includes(file.type)) {
        return 'Upload'
      }
      if (!this.accept.includes(file.type)) {
        return 'InvalidFormat'
      }
    }
    if (this.service.filesList.length > 0) {
      let index = this.service.filesList.findIndex(k => k.Name == file.name);
      if (index === -1) {
        if (this.accept.includes(file.type)) {
          return 'Upload'
        }
      } else {
        return 'FileExist'
      }
    }
  }

//  fileUplaod(fileList, fileNames) {
//     if (fileList.length > 0) {
//       this.isLoading = true
//       this.fileService.filesToUpload(fileList).subscribe((res) => {
//         this.isLoading = false;
//         res.forEach((file, i) => {
//           if (file !== '') {
//             this.contactLeadService.attachmentList.push({
//               "Name": fileNames[i],
//               "Url": file,
//               "MapGuid": "",
//               "LinkActionType": 1,
//               "Comments": [{ "Description": "" }]
//             })
//           }
//         })
//       },
//         () => this.isLoading = false
//       )}
//   }
downloadFile(i,item) {
  console.log("sdsdf",this.service.filesList[i]);
  if(this.service.filesList[i].AttachmentForCommitmentRegistrationId)
  {
 let array = [
  {"Name" : this.service.filesList[i].FileName}];
  // const response = {
  // file: this.service.filesList[i].AttachmentLink,
  // };
  // var a = document.createElement('a');
  // a.href = response.file;
  // a.download = response.file;
  // document.body.appendChild(a);
  // a.click();
  this.registerService.filesToDownloadDocument64(array).subscribe((res) =>{
  this.isLoading = false;
  if(!res.IsError) {
  res.ResponseObject.forEach(res => {
  this.service.Base64Download(res);
  })
  } else {
  // this.ErrorMessage.throwError(res.Message);
  }
  console.log(res);
  },() =>{this.isLoading = false;})
  }
  else
  {
  this.snackBar.open("Kindly save the data and try.", this.action, {
  duration: 3000
  });
  }
  
  }

  formatDate(date) {
    var d = new Date(date),
        month = '' + (this.monthArr[d.getMonth()]),
        day = '' + d.getDate(),
        year = d.getFullYear();
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('-');
  }

  

  checkForAttachments()
  {
    var attachmentArray=[];     
    this.isLoading=true;
    let objNotes=
    { 
      "CommitmentRegisterid":this.registerData.CommitmentRegisterid
    };
  
    this.registerService.getAllCommitmentRegisterNotes(objNotes).subscribe(res=>{
      if(res.isError)
      {
        this.snackBar.open(res.Message, this.action, {
          duration: 3000
        });
        this.isLoading=false;
      }
      else{
        for(var i=0;i<res.ResponseObject.length;i++)
          {
            let file=res.ResponseObject[i];
            file.name=file.AttachmentName;
            this.fileNamesToDownload.push(file.FileName);
            file.link=file.AttachmentLink;
            attachmentArray.push(file);
          }
          this.service.filesList=attachmentArray;
          this.registerData.Attachments=attachmentArray;
          this.isLoading=false;
      }
    })
  }
  editData()
  {   
    this.state='editable';
    // this.checkForAttachments();    
  }

  openAttachFilePopup(): void {

      const dialogRef = this.dialog.open(uploadPopup, {
        width: '610px'

      });
    
  }

  removeUploadFiles(i,item) {
    if(item.AttachmentForCommitmentRegistrationId==undefined)
    {
      this.service.filesList.splice(i, 1);
      var indexToRemove=this.registerService.fileListToInsert.indexOf(item);
      this.registerService.fileListToInsert.splice(indexToRemove,1);
    }
    else{
      let obj={
        "AttachmentForCommitmentRegistrationId":item.AttachmentForCommitmentRegistrationId
      }
      this.registerService.fileListToDelete.push(obj);
      this.service.filesList.splice(i, 1);
    }   
  }


downloadAll() {
          let downloadFiles = [];
          this.isLoading = true;
          // console.log("result in init",this.registerData);
          // this.registerData.Attachments.forEach(
          //     item => {
          //       if(item)
          //       {
          //          downloadUrls.push(item.AttachmentLink);
          //       }
             
          //     })
          // downloadUrls.forEach(function (value, idx) {
          //     const response = {
          //     file: value,
          // };
          // setTimeout(() => {
          //       var a = document.createElement('a');
          //       a.href = response.file;
          //       a.download = response.file;
          //       document.body.appendChild(a);
          //       a.click();
          //       }, idx * 2500)
          // });

          console.log("downloaAll",this.registerData.Attachments);
          for(let i = 0;i<this.fileNamesToDownload.length;i++)
          {
            let obj ={
              "Name" : this.fileNamesToDownload[i]
            }
            downloadFiles.push(obj);
          }

           this.uploadService.filesToDownloadDocument64(downloadFiles).subscribe((res) =>{
      this.isLoading = false;
      if(!res.IsError) {
        res.ResponseObject.forEach(res => {
          this.service.Base64Download(res);
        })
      } else {
        //  this.ErrorMessage.throwError(res.Message);
      }
      console.log(res);
    },() =>{this.isLoading = false;})
 }

  uploadFiles(fileList,index,fileListDelete,fileNames)
  {
    console.log("fileLIst",fileNames[index]);
    debugger
    if(index<fileList.length)
    {
      let obj={
          "AttachmentName":fileNames[index],
          "AttachmentLink":'',
          "UniqueKey":"755",
          "CommitmentRegisterid":this.registerData.CommitmentRegisterid,
          "MimeType":fileList[index].type,
          "Subject":fileList[index].name,
          "NoteText":"Test 00111"
        }
        let list = [];
        list.push(fileList[index]);
        this.uploadService.filesToUploadDocument64(list).subscribe((res)=>
        {
          console.log("res",res);
            obj.AttachmentLink=res[0].ResponseObject.Url;
            // obj.AttachmentName = res[0].ResponseObject.Name;
            this.registerService.addNotes(obj).subscribe(res=>
            {
              if(res.isError)
              {
                
                this.snackBar.open("Upload failed.Try after some time", this.action, {
                  duration: 3000
                });
                this.isLoading=false;
              }
              else
              {
                index=index+1;
                this.uploadFiles(fileList,index,fileListDelete,this.fileNames);
              }
            })//addnotes
        })
    }
    else
    {
      if(fileListDelete.length>0)
      {
       this.deleteAttachment(fileListDelete,0);
       this.registerService.fileListToInsert=[];
      }
      else
      {
        this.registerService.fileListToInsert=[];
        this.isLoading=false;
        if(!this.isNew)
        {
          this.router.navigate(['/opportunity/oppactions/commitmentregister']);
        }
       
        if(this.isNew)
        {          
          this.checkForAttachments(); 
          if(this.checkForNewReg==1)
          {
            this.snackBar.open("Register created successfully", this.action, {
            duration: 3000
          });
          this.createdDate=this.formatDate(this.registerData.CreatedDate);
          }
          else
          {
            this.snackBar.open("Register saved successfully", this.action, {
                duration: 3000
              });
              this.createdDate=this.formatDate(this.registerData.CreatedDate);
          }
          this.state='noneditable';
        }
        else
        {
          this.snackBar.open("Register saved successfully", this.action, {
            duration: 3000
          });
        }
      }
      return true;
    }  
  }
  deleteAttachment(fileList,index)
  {
     if(index<fileList.length)
     {
        this.registerService.deleteNotes(fileList[index]).subscribe(res=>
        {
            if(res.isError)
            {
              this.snackBar.open("Server error Occured", this.action, {
                duration: 3000
              });
              this.isLoading=false;
            }
            else{
              index=index+1;
              this.deleteAttachment(fileList,index);
            }
        })
      }
      else
      {
        this.registerService.fileListToDelete=[];
        this.isLoading=false;
        if(!this.isNew)
        {
          this.router.navigate(['/opportunity/oppactions/commitmentregister']);
        }
    
        if(this.isNew)
        {
          this.checkForAttachments();
          if(this.checkForNewReg==1)
          {
            this.snackBar.open("Register created successfully", this.action, {
              duration: 3000
            });
             this.createdDate=this.formatDate(this.registerData.CreatedDate);
          }
          else
          {
              this.snackBar.open("Register saved successfully", this.action, {
                duration: 3000
              });
               this.createdDate=this.formatDate(this.registerData.CreatedDate);
          }
          this.state='noneditable';
        }
        else
        {
          this.snackBar.open("Register saved successfully", this.action, {
            duration: 3000
          });
        }
        return true;
      }
  }

  dataChange()
  {
    this.changeFlag=true;
  }
  saveRegisterData()
  {
    if(this.changeFlag || this.registerService.fileListToDelete.length || this.registerService.fileListToInsert.length)
    {
      this.saveRegister();
    }
    else if(this.isNew)
    {
      if(this.checkForNewReg==0)
      {
        this.saveRegister();
      }
      else
      {
       this.state='noneditable';
      }
    }
    else
    {
      this.router.navigate(['/opportunity/oppactions/commitmentregister']);
    }
  }
  saveReg=false;
  saveRegister()
  {    
    console.log("xghghxxx",this.registerService.fileListToInsert)
    this.isLoading=true;
    if(this.registerData.Name && this.registerData.Name.trim().length>0)
    {
      let obj={
        "Name":this.registerData.Name,
        "Description":this.registerData.Description,
        "OpportunityId":this.OpportunityId,
        "SerialNumber":this.registerData.SerialNumber,
        "CommitmentRegisterid":this.registerData.CommitmentRegisterid
      }
      if(this.registerData.Description==null)
      {
        this.registerData.Description='NA';
      }
      this.checkForNewReg=this.checkForNewReg+1;
      this.registerService.setopportunityData(this.registerData);

      this.registerService.saveNewRegister(obj).subscribe(res=>{
          if(res.isError)
          {
            this.snackBar.open("Server error Occured", this.action, {
              duration: 3000
            });
            this.isLoading=false;
          }
          else{
            this.saveReg=true;
                if(this.registerService.fileListToInsert.length==0 &&this.registerService.fileListToDelete.length==0)
                {
                  this.isLoading=false;
                  if(!this.isNew)
                  {
                    this.router.navigate(['/opportunity/oppactions/commitmentregister']);
                  }
                  if(this.isNew)
                  {
                    if(this.checkForNewReg==1)
                    {
                      this.snackBar.open("Register created successfully", this.action, {
                       duration: 3000
                      });
                      this.createdDate=this.formatDate(this.registerData.CreatedDate);
                    }
                    else
                    {
                       this.snackBar.open("Register saved successfully", this.action, {
                          duration: 3000
                        });
                         this.createdDate=this.formatDate(this.registerData.CreatedDate);
                    }
                    
                    this.state='noneditable';
                  }
                  else
                  {
                    this.snackBar.open("Register saved successfully", this.action, {
                      duration: 3000
                    });
                  }
                }
                else
                {
                    var notesToDelete=this.registerService.fileListToDelete;
                    var fileListInsert=this.registerService.fileListToInsert;
                    if(fileListInsert.length>0)
                    {
                      this.uploadFiles(fileListInsert,0,notesToDelete,this.fileNames);
                    }
                    else
                    {
                      this.deleteAttachment(notesToDelete,0);
                    }
                }       
            
            }    
      // }//else of save register
});//save register
    }
    else
    {
      this.isLoading=false;
      this.snackBar.open("Please enter the name", this.action, {
          duration: 1000
        });
    }

    
    
  }

}

// /****************   upload popup start        **************/

@Component({
  selector: 'upload-popup',
  templateUrl: './upload.html',
   styleUrls: ['./commitment-register-details.component.scss']

})

export class uploadPopup {

    onCancel(): void {
       this.dialogRef.close(true);

  }

  closePopup()
  {
      if(this.uploadCheck==0)
      {
        this.dialogRef.close(this.service.filesList);
      }
      else
      {
         this.snackBar.open("Uploading in progress", this.action, {
          duration: 700
         });
      }    
  }
    
   regData:any={};
   formData: FormData;
    files: UploadFile[];
    uploadInput: EventEmitter<UploadInput>;
    humanizeBytes: Function;
    dragOver: boolean;
    options: UploaderOptions;
    fileExtension:any;
    action:any;
    filetoadd=[];
    fileNames=[];
    uploadCheck=0;
    alloewedFileTypes=["txt","pdf","jpg","png","docx","xlsx","xls","jpeg","TXT","PDF","JPG","PNG","DOCX","JPEG","XLSX","XLS"];

    constructor(public dialogRef: MatDialogRef<uploadPopup>,public service:DataCommunicationService,public registerService:CommitmentRegisterService,public snackBar:MatSnackBar) {
      
      this.options = { concurrency: 1, maxUploads: 20 };
      this.files = [];
      this.uploadInput = new EventEmitter<UploadInput>();
      this.humanizeBytes = humanizeBytes;
      dialogRef.disableClose = true;
    }

    ngOnInit() {
      this.registerService.RegisterData.subscribe(res=>
      {
         this.regData=res;
      })
    }
  
  
    onUploadOutput(output: UploadOutput): void {
      console.log("uploader",output);
        if (output.type === 'allAddedToQueue') {
          const event: UploadInput = {
            type: 'uploadAll',
            url: 'https://ngx-uploader.com/upload',
            method: 'POST',
            data: { foo: 'bar' }
          };
          this.uploadInput.emit(event);
  
        } 
        else if (output.type === 'start') {
         
        } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') {
            this.uploadCheck=this.uploadCheck+1;
        } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
          const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
          this.files[index] = output.file;
        } else if (output.type === 'removed') {
          this.files = this.files.filter((file: UploadFile) => file !== output.file);
        } else if (output.type === 'dragOver') {
          this.dragOver = true;
        } else if (output.type === 'dragOut') {
          this.dragOver = false;
        } else if (output.type === 'drop') {
          this.dragOver = false;
        } else if (output.type === 'rejected' && typeof output.file !== 'undefined') {
         
        }
        else if(output.type === 'done')
        {
          this.uploadCheck=this.uploadCheck-1;
          if(this.alloewedFileTypes.indexOf(output.file.name.split('.').pop())!=-1)
          {
            const fd: FormData = new FormData();
            fd.append('file', output.file.nativeFile);
            this.service.filesList.push(fd);
            this.filetoadd.push(output.file);
            this.files.push(output.file);
            this.service.filename= output.file.name;
            this.service.uploadedFiles.push({
              name: output.file.name
            });
            this.fileExtension= this.service.filename.split('.').pop();
            output.file.sub=this.fileExtension;
            this.registerService.fileListToInsert.push(output.file.nativeFile);          
        }   
        
      else{
        // this.service.filesList.splice(this.service.filesList.length-1,1);
        this.snackBar.open("File type not supported", this.action, {
          duration: 3000
        });
      }
    }
    }
  
    startUpload(): void {
      const event: UploadInput = {
        type: 'uploadAll',
        url: 'https://ngx-uploader.com/upload',
        method: 'POST',
        data: { foo: 'bar' }
      };
    }
 
    cancelUpload(id: string): void {
      this.uploadInput.emit({ type: 'cancel', id: id });
    }
  
    removeFile(id: string): void {
      this.uploadInput.emit({ type: 'remove', id: id });
    }
  
    removeAllFiles(): void {
      this.uploadInput.emit({ type: 'removeAll' });
    }

    deleteUploadedFile(event) {
      this.filetoadd.splice(event,1);
      this.files.splice(event,1);
      this.service.filesList.splice(event,1);
      this.service.uploadedFiles.splice(event,1);
      this.registerService.fileListToInsert.splice(event,1);
      }


}


