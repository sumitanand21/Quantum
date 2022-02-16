import { Component, OnInit, ElementRef } from '@angular/core';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AccountListService } from '@app/core/services/accountList.service';
import { FileUploadService } from '@app/core/services/file-upload.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { MatSnackBar } from '@angular/material';
@Component({
  selector: 'app-account-details-two',
  templateUrl: './account-details-two.component.html',
  styleUrls: ['./account-details-two.component.scss']
})
export class AccountDetailsTwoComponent implements OnInit {
  isLoading: boolean;
  FileUploadFOrm: FormGroup;
  notesAndDetail; any = [];
  submitted;
  accSysId;
  accountName;
  selectedRowForEdit;
  editData;
  attachmentOnEdit;
  characterCount;
  constructor(private snackBar: MatSnackBar, private EncrDecr: EncrDecrService,
    private fileService: FileUploadService,
    public accountListServ: AccountListService, public errorMessage: ErrorMessage, public userdat: DataCommunicationService, private _fb: FormBuilder, private el: ElementRef, ) {
    this.accSysId = (sessionStorage.getItem('accountSysId')) ? this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountSysId'), 'DecryptionDecrip') : '';
    this.accountName = this.accountListServ.getSymbol(this.EncrDecr.get('EncryptionEncryptionEncryptionEn', sessionStorage.getItem('accountName'), 'DecryptionDecrip'));
  }

  ngOnInit() {
    this.inializeFileUploadForm();
    this.getNotesList();

  }
  inializeFileUploadForm() {
    this.FileUploadFOrm = this._fb.group({
      note: ['', Validators.required],
      filrUrl: [''],
      fileName: ['']
    });
    this.editData = false;
  }
  get FileUploadFormValidation() { return this.FileUploadFOrm.controls; }
  setPostObject(type, rowSysId, editableData?) {
    return {
      'LinkActionType': this.getLinkActionType(type),
      'SysGuid': rowSysId ? rowSysId : '',
      'CustomerAccount': {
        'SysGuid': this.accSysId ? this.accSysId : ''
      },
      'NotesDescription': this.FileUploadFOrm.value.note,
      'Attachment': [
        {
          'LinkActionType': this.getLinkActionTypeForAttachment(type),
          'Name': this.FileUploadFOrm.value.fileName ? this.FileUploadFOrm.value.fileName : '',
          // 'Url': this.FileUploadFOrm.value.filrUrl ? this.FileUploadFOrm.value.filrUrl : '',
          'Url': (this.accountListServ.attachmentList && this.accountListServ.attachmentList.length > 0) ? this.accountListServ.attachmentList[0].Url : '',
          'Guid': editableData ? (editableData) : '',
        }
      ]
    };
  }
  checCharLimit(e) {
    let CharLimit = 100000;
    if (this.FileUploadFOrm.value.note.length <= CharLimit) {
      this.characterCount = CharLimit - this.FileUploadFOrm.value.note.length;
    } else {
      e.preventDefault();
      this.characterCount = 0;
    }
  }

  getLinkActionType(type) {
    switch (type) {
      case 'New':
        return 1;
      case 'Existing':
        return 2;
      case 'Delete':
        return 3;
    }
  }
  getLinkActionTypeForAttachment(type) {
    switch (type) {
      case 'New':
        return 1;
      case 'Existing':
        if (!this.attachmentOnEdit && this.FileUploadFOrm.value.filrUrl) {
          return 1;
        } else if (this.attachmentOnEdit && this.FileUploadFOrm.value.filrUrl === '') {
          return 3;
        } else {
          return 2;
        }
      case 'Delete':
        if (this.FileUploadFOrm.value.filrUrl) {
          return 3;
        } else {
          return '';
        }

    }
  }

  fileSubmit(isSubmit, editData?) {
    // console.log('Valid?'); // true or false
    this.FileUploadFOrm.get('fileName').updateValueAndValidity();
    if (isSubmit) {
      if (this.FileUploadFOrm.invalid) {
        this.submitted = true;
        const invalidElements = this.el.nativeElement.querySelector('textarea.ng-invalid,select.ng-invalid,input.ng-invalid');
        invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      } else {
        let reqbody;
        if (!editData) {
          reqbody = this.setPostObject('New', '');
          this.postNotesCUD(reqbody, 'New');
        } else {
          reqbody = this.setPostObject('Existing', this.selectedRowForEdit.SysGuid, this.selectedRowForEdit.Attachment[0].Guid);
          this.postNotesCUD(reqbody, 'Existing');
        }


      }
    } else {
      this.resetFormControl();
    }
  }

  restrictspace(e) {
    if (e.which === 32 && !this.FileUploadFOrm.value.note.length)
      e.preventDefault();
  }
  postNotesCUD(reqbody, isEditDeleteNewROw?) {
    this.isLoading = true;
    this.accountListServ.commonPostObject(reqbody, 'NotesCUD', isEditDeleteNewROw).subscribe((res: any) => {
      let resMessage;
      resMessage = res.Message ? res.Message : '';
      this.isLoading = false;
      if (isEditDeleteNewROw === 'Existing') {
        // this.FileUploadFOrm.patchValue({
        //   fileName: '',
        //   filrUrl: '',
        //   note: ''
        // });
        this.getNotesList();
        this.resetFormControl();
        this.selectedRowForEdit = '';
        this.editData = false;
        this.snackBar.open(resMessage, '', {
          duration: 5000
        });
      } else if (isEditDeleteNewROw === 'New') {
        this.getNotesList();
        this.resetFormControl();
        this.snackBar.open(resMessage, '', {
          duration: 5000
        });
      } else {
        this.snackBar.open(resMessage, '', {
          duration: 5000
        });
        this.getNotesList();
      }

    });
  }
  getNotesList() {
    const reqbody = {
      'Guid': this.accSysId,
      'PageSize': 10,
      'RequestedPageNumber': 1,
      'OdatanextLink': ''
    };
    this.isLoading = true;
    this.accountListServ.commonPostObject(reqbody, 'NotesAndDetailsControllerList').subscribe((res: any) => {
      this.isLoading = false;
      this.notesAndDetail = res.ResponseObject;
    });
  }
  resetFormControl() {
    this.submitted = false;
    this.FileUploadFOrm.patchValue({
      fileName: '',
      filrUrl: '',
      note: ''
    });
    this.accountListServ.attachmentList.length = 0;
  }
  deleteRowItem(data) {
    const reqbody = this.setPostObject('Delete', data.SysGuid, data.Attachment[0].Guid ? data.Attachment[0].Guid : '');
    this.postNotesCUD(reqbody, 'Delete');
  }
  editRowItem(data) {
    if (data.Attachment[0].Name ? data.Attachment[0].Name : '') {
      this.attachmentOnEdit = true;
    } else {
      this.attachmentOnEdit = false;
    }
    this.FileUploadFOrm.patchValue({
      fileName: (data.Attachment.length > 0) ? (data.Attachment[0].Name ? data.Attachment[0].Name : '') : '',
      filrUrl: (data.Attachment.length > 0) ? (data.Attachment[0].Url ? data.Attachment[0].Url : '') : '',
      note: data.NotesDescription
    });
    this.accountListServ.attachmentList.push({
      'Name': (data.Attachment.length > 0) ? (data.Attachment[0].Name ? data.Attachment[0].Name : '') : '',
      'Url': (data.Attachment.length > 0) ? (data.Attachment[0].Url ? data.Attachment[0].Url : '') : '',
      'DownloadName' : (data.Attachment.length > 0) ? (data.Attachment[0].DownloadName ? data.Attachment[0].DownloadName : '') : '',
    });
    this.selectedRowForEdit = data;
    this.editData = true;
    const invalidElements = this.el.nativeElement.querySelector('textarea.ng-invalid,select.ng-invalid,input.ng-invalid');
    invalidElements.scrollIntoView({ behavior: 'smooth', block: 'center' });

  }
  removeAttachment() {
    this.FileUploadFOrm.patchValue({
      fileName: '',
      filrUrl: '',
      // note: ''
    });
  }
  accept = ['application/pdf', 'text/xml', 'application/jpg', 'application/xml', 'application/zip', 'application/octet-stream', 'audio/mp3', 'audio/mp4', 'image/jpeg', 'image/png', 'text/plain', 'image/gif', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword', 'application/msexcel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/doc', 'application/docx', 'video/mp4', 'audio/mpeg', 'application/x-zip-compressed', 'application/mspowerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'];
  fileChangeEvent(e) {
    const files = [].slice.call(e.target.files);
    const uploadingFileList = [];
    let fileNames;
    if (files.length > 0) {
      files.forEach(res => {
        const file: File = res;
        const canditionAction = this.fileValidation(file);
        switch (canditionAction) {
          case 'FileSize': {
            this.errorMessage.throwError('Not able to upload the file because filesize is greater than 5mb.');
            break;
          }
          case 'InvalidFormat': {
            this.errorMessage.throwError('File format not supported!')
            break;
          }
          // case 'FileExist': {
          //   this.errorMessage.throwError('File is already exist!')
          //   break;
          // }
          case 'Upload': {
            const fd: FormData = new FormData();
            fd.append('file', file);
            fileNames = file.name;
            uploadingFileList.push(fd);
            break;
          }
        }
      });
      this.fileUplaod(uploadingFileList, fileNames);
    }
  }

  fileValidation(file) {
    if (file.size > 5242880) {
      return 'FileSize';
    }
    if (!this.accept.includes(file.type)) {
      return 'InvalidFormat';
    }
    if (this.accountListServ.attachmentList.length === 0) {
      if (this.accept.includes(file.type)) {
        return 'Upload';
      }
      if (!this.accept.includes(file.type)) {
        return 'InvalidFormat';
      }
    }
    if (this.accountListServ.attachmentList.length > 0) {
      const index = this.accountListServ.attachmentList.findIndex(k => k.Name === file.name);
      if (index === -1) {
        if (this.accept.includes(file.type)) {
          return 'Upload';
        }
      } else {
        return 'FileExist';
      }
    }
  }
  // filrUrl: [''],
  //     fileName: ['']
  fileUplaod(fileList, fileNames) {
    if (fileList.length > 0) {
      this.isLoading = true;
      this.fileService.filesToUploadDocument64(fileList).subscribe((res) => {
        this.isLoading = false;
        res.forEach((file, i) => {
          if (file !== '') {
            let urlresponse = file.ResponseObject;
            this.accountListServ.attachmentList.push({
              'Name': fileNames[i],
              // 'Url': file,
              'Url': urlresponse.Url,
              'DownloadName' : urlresponse.Name,
              'MapGuid': '',
              'LinkActionType': 1,
              'Comments': [{ 'Description': '' }]
            });
          }
        });
        this.FileUploadFOrm.patchValue({
          fileName: fileNames,
          filrUrl: res[0]
        });
      },
        () => this.isLoading = false
      );
    }
  }
  downloadsingle(i) {
    
    let body = [{
        "Name": this.notesAndDetail[i].Attachment[0].DownloadName
    }]
      
    this.isLoading = true;
    this.fileService.filesToDownloadDocument64(body).subscribe((res) =>{
      this.isLoading = false;
      if(!res.IsError) {
        res.ResponseObject.forEach(res => {
          this.userdat.Base64Download(res);
        })
      } else {
         this.errorMessage.throwError(res.Message);
      }
      console.log(res);
    },() =>{this.isLoading = false;})
  }
}
