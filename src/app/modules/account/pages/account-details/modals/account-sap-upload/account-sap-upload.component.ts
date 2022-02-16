import { Component, OnInit, EventEmitter } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { DataCommunicationService, CommitmentRegisterService } from '@app/core';
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions,UploadStatus } from 'ngx-uploader';
@Component({
  selector: 'app-account-sap-upload',
  templateUrl: './account-sap-upload.component.html',
  styleUrls: ['./account-sap-upload.component.scss']
})
export class AccountSapUploadComponent implements OnInit {


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
 uploadCheck=0;
 alloewedFileTypes=["txt","pdf","jpg","png","docx","xlsx","xls","jpeg","TXT","PDF","JPG","PNG","DOCX","JPEG","XLSX","XLS"];

 constructor(public dialogRef: MatDialogRef<AccountSapUploadComponent>,public service:DataCommunicationService,public registerService:CommitmentRegisterService,public snackBar:MatSnackBar) {
   
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
   this.registerService.fileListToInsert.splice(event,1);
   }



}
