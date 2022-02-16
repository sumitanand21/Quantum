import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataCommunicationService, ErrorMessage, OnlineOfflineService } from '@app/core';
import { dealService } from '@app/core/services/deals.service';
import { type } from 'os';
import { ConversationShareComponent } from '@app/modules/conversation/pages/conversation-share/conversation-share.component';
import { FileElement } from '@app/core/models/file-element';
import { Observable, Subscription, of } from 'rxjs';
import { FileService } from '@app/shared/services/file.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { FolderElement } from '@app/core/models/folder-element';
import { AppState } from '@app/core/state';
import { Store, select } from '@ngrx/store';
import { selectAttchDocumentsList } from '@app/core/state/selectors/deals/attach-documents.selector';
import { AttachDocumentsListAction } from '@app/core/state/actions/deals.actions';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { RefrenceDocStatusService } from '@app/core/services/datacomm/data-comm.service';
import { environment as env } from '@env/environment';
declare let FileTransfer: any;
import * as JSZip from 'jszip';
import * as JSZipUtils from 'jszip-utils';
import { saveAs } from 'save-as';
import { HttpClient } from "@angular/common/http";
import { EnvService } from '@app/core/services/env.service';

const config = {
  generalErrMsg: 'Oops! There seems to be some technical snag! Could you raise a Helpline ticket?'
}


@Component({
  selector: 'app-attach-documents',
  templateUrl: './attach-documents.component.html',
  styleUrls: ['./attach-documents.component.scss']
})
export class AttachDocumentsComponent implements OnInit, OnDestroy {

  isLoading: boolean;
  currentRoot: FileElement;
  // currentPath: string;
  canNavigateUp = false;
  currentPath: string = "Deals > Existing deals > Deal name > Attached documents >"
  fileElements: any = [];
  intermediateData: any = [];
  pathId = [];
  fileName: string;
  fileUrl: string;
  adid: any;
  deal: any;
  user: any;
  popupPathId = [];
  returnUrl: any;

  // sharePoint operation required
  parentId: number = 0;
  folderId: number = 0;
  // .sharePoint operation required

  constructor(
    public service: DataCommunicationService,
    private deals: dealService,
    public _error: ErrorMessage,
    public store: Store<AppState>,
    public fileService: FileService,
    private encrDecrService: EncrDecrService,
    public onlineOfflineService: OnlineOfflineService,
    public location: Location, private activeRoute: ActivatedRoute,
    private router: Router,
    private refrenceDocStatusService: RefrenceDocStatusService,
    public http: HttpClient,public envr : EnvService) { }

  $subScription: Subscription = new Subscription();
  checkForNewDeal: any;

  async ngOnInit() {
    this.returnUrl = this.activeRoute.snapshot.params['returnUrl'];
    localStorage.setItem('parentId', this.parentId.toString());
    localStorage.setItem('folderId', this.folderId.toString());
    this.user = localStorage.getItem('upn');
    this.adid = this.encrDecrService.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('adid'), 'DecryptionDecrip');
    this.deal = JSON.parse(this.encrDecrService.get("EncryptionEncryptionEncryptionEn", sessionStorage.getItem('Dealoverview'), "DecryptionDecrip"));
    this.isLoading = true;
    try {
      this.refrenceDocStatusService.getBehaviorView().subscribe(res => this.checkForNewDeal = res);
      if (this.checkForNewDeal) {
        this.getData();
        this.refrenceDocStatusService.setBehaviorView(undefined);
        this.checkForNewDeal = undefined;
      }
    } catch (e) {
      console.log(e)
    }
    this.$subScription = this.store.pipe(select(selectAttchDocumentsList)).subscribe(res => {
      if (res.attachDocList) {
        this.isLoading = false;
        if (res.attachDocList.length > 0) {
          this.fileElements = this.getMappedData(res.attachDocList);
        } else {
          if (this.onlineOfflineService.isOnline) {
            this.getData();
          }
        }
      } else {
        this.isLoading = false;
        if (this.onlineOfflineService.isOnline) {
          this.getData();
        }
      }
    }, err => {
      this.isLoading = false;
      if (this.onlineOfflineService.isOnline) {
        this.getData();
      }
      this._error.throwError(config.generalErrMsg);
    });

    if (!this.onlineOfflineService.isOnline) {
      const CacheResponse = await this.deals.getAttachDocumentCacheData()
      console.log('CacheResponse-->', CacheResponse)
      if (CacheResponse) {
        if (CacheResponse.data.length > 0) {
          this.isLoading = false;
          this.fileElements = this.getMappedData(CacheResponse.data);
          this.isLoading = false;
        }
      }
    }
    try {
      this.getData();
    } catch { }

  }

  performTableAction(outputData): Observable<any> {

    // this.isLoading = true;
    console.log(outputData)
    switch (outputData.action) {

      case 'create': {
        this.onCreate(outputData.objectRowData);
        return;
      }
      case 'rename': {
        console.log("Name:", outputData.objectRowData.name)
        if (outputData.objectRowData.name != '') {
          this.onRename(outputData.objectRowData);
        }
        return;
      }
      case 'delete': {
        this.onDelete(outputData.objectRowData);
        return;
      }
      case 'download': {
        this.downloadFile(outputData.objectRowData);
        return;
      }
      case 'downloadAll': {
        this.downloadAll(outputData.objectRowData);
        return;
      }
      case 'move': {
        this.onMoveFile(outputData.objectRowData);
        return;
      }
      case 'multimove': {
        return;
      }
      case 'multidelete': {
        return;
      }
    }
  }

  subscriptionList$: Subscription = new Subscription();
  getData(id?) {

    this.isLoading = true;
    //let lastId = this.pathId.length - 1;
    var inputData = {
      "Id": this.deal.id,
      "LastRecordId": "0",
      "PageSize": 100,
      "Parent": id > 0 ? id : id == 0 ? 0 : 0,
    }
    this.subscriptionList$ = this.deals.listFolder(inputData)
      .subscribe((res) => {
        if (!res.IsError) {
          if (res.ResponseObject.length > 0) {
            this.fileElements = this.getMappedData(res.ResponseObject);
            this.store.dispatch(new AttachDocumentsListAction({ attachDocArryList: res.ResponseObject }));
            this.isLoading = false;
          } else {
            this.fileElements = this.getMappedData(res.ResponseObject);
            this.isLoading = false;
          }
          this.isLoading = false;
        } else {
          this.fileElements = [];
          this.isLoading = false;
        }
      }, err => {
        this._error.throwError(config.generalErrMsg);
      });
  }

  getMappedData(res: any[]) {
    if (res.length > 0) {
      let data = [];
      res.map(x => {
        let obj = {
          id: x.Id > 0 ? x.Id : x.Id == 0 ? 0 : 0,
          type: this.objectType(x),
          // name: x.Name ? x.Name.replace(/\.[^/.]+$/, "") : 'NA',
          // name: x.Name ? x.Name : 'NA',
          name: x.Name ? this.objTypeEdit(x) : 'NA',
          modified: x.CreatedOn ? x.CreatedOn : 'NA',
          modifiedBy: x.CreatedBy ? x.CreatedBy.split('|').pop() : 'NA',
          parent: x.Parent > 0 ? x.Parent : x.Parent == 0 ? 0 : 0,
          isFolder: x.IsFolder,
          path: x.Path ? x.Path : 'NA',
          deleteBtnVisibility: true,
          editBtnVisibility: true,
          downloadBtnVisibility: this.btnVisibility(x),
          moveBtnVisibility: this.btnVisibility(x),
          rename: false
        }
        data.push(obj);
      })
      return data;
    } else {
      return [];
    }
  }

  objTypeEdit(res?) {
    if (res.IsFolder) {
      return res.Name;
    } else {
      return res.Name.replace(/\.[^/.]+$/, "");
    }
  }

  objectType(res?): string {
    if (res.IsFolder) {
      return 'mdi-folder';
    } else {
      var ext = res.Name.substring(res.Name.lastIndexOf('.') + 1);
      if (ext.toLowerCase() == 'docx') {
        return 'mdi-file-word';
      } else if (ext.toLowerCase() == 'xlsx') {
        return 'mdi-file-excel';
      } else if (ext.toLowerCase() == 'pdf') {
        return 'mdi-file-pdf';
      } else if (ext.toLowerCase() == 'pptx') {
        return 'mdi-file-document';
      } else {
        return 'mdi-file-document';
      }
    }

  }

  btnVisibility(res): boolean {
    if (!res.IsFolder) {
      return true;
    } else {
      return false;
    }
  }

  // navigateToFolder(element: FileElement) {
  //   this.getData(event.id);
  //   console.log(event);
  // }

  navigateToFolder(element: FileElement) {
    this.currentRoot = element;
    this.getData(element.id);

    this.pathId.push(element.id);
    this.parentId = parseInt(element.id);
    this.folderId = parseInt(element.id);
    localStorage.setItem('parentId', this.parentId.toString());
    localStorage.setItem('folderId', this.folderId.toString());

    this.currentPath = this.pushToPath(this.currentPath, element.name);
    this.canNavigateUp = true;
  }

  navigateUp() {
    if (this.pathId.length == 0) {
      this.router.navigateByUrl(this.returnUrl);
    } else {
      this.canNavigateUp = true;
      this.pathId.pop();
      this.getData(this.pathId[this.pathId.length - 1]);
      this.parentId = this.pathId.length == 0 ? 0 : this.pathId[this.pathId.length - 1];
      this.folderId = this.pathId.length == 0 ? 0 : this.pathId[this.pathId.length - 1];
      localStorage.setItem('parentId', this.parentId.toString());
      localStorage.setItem('folderId', this.folderId.toString());
      this.currentPath = this.popFromPath(this.currentPath);
    }
  }

  pushToPath(path: string, folderName: string) {
    let p = path ? path : '';
    p += `${folderName}` + ' >';
    return p;
  }

  popFromPath(path: string) {
    let p = path ? path : '';
    let split = p.split('>');
    split.splice(split.length - 2, 1);
    p = split.join('>');
    return p;
    // return path.replace("> ", '');
  }

  popNavigatedUp(element: FolderElement) {

  }

  popNavigatedDown(element: FolderElement) {

  }


  onCreate(data) {
    this.isLoading = true;
    const inputData = {
      "Name": data.name,
      "Parent": this.pathId.length == 0 ? 0 : this.pathId[this.pathId.length - 1],
      "Type": 2,
      "IsFolder": true,
      "Deal": { 'Id': this.deal.id },
      "CreatedBy": this.adid + "|" + this.user
    }
    this.deals.createFolder(inputData)
      .subscribe((res: any) => {
        if (!res.IsError) {
          this.isLoading = false;
          this.getData(res.ResponseObject.Parent);
          this._error.throwError(res.Message);
        } else if (res.IsError && res.ApiStatusCode === 500) {
          this.isLoading = false;
          this._error.throwError(res.Message);
        } else {
          this.isLoading = false;
          this._error.throwError(config.generalErrMsg);
        }

      }, err => {
        this.isLoading = false;
        this._error.throwError('Error! couldn`t create folder')
      });
  }

  onRename(data) {
    this.isLoading = true;
    const inputData = {
      "Id": data.id,
      "Name": data.name,
      "Parent": data.parent,
      // "Type": 2,
      "Path": data.path
      // "IsFolder": true,
      // "Deal": { 'Id': this.deal.id },
      // "CreatedBy": this.adid + "|" + this.user
    }
    try {
      this.deals.editFolder(inputData)
        .subscribe((res: any) => {
          if (!res.IsError) {
            this.isLoading = false;
            this.getData(res.ResponseObject.Parent);
            this._error.throwError('Folder or File name changed successfully');
          } else {
            this.getData();
            this.isLoading = false;
            this._error.throwError(res.Message);
          }
        }, err => {
          this.isLoading = false;
          this._error.throwError(config.generalErrMsg);
        });
    } catch {
      this.isLoading = false;
      this._error.throwError(config.generalErrMsg);
    }
  }

  onDelete(data) {
    this.isLoading = true;
    console.log(data);
    try {
      if (data.length > 0) {
        let inputData = [];
        for (let i = 0; i < data.length; i++) {
          inputData.push({ "Id": data[i].id });
        }
        this.deals.deleteFolders(inputData)
          .subscribe((res: any) => {
            if (!res.IsError) {
              this.isLoading = false;
              this.getData();
              this._error.throwError('Folder or File deleted successfully')
              //this._error.throwError(res.Message);
            } else {
              this.isLoading = false;
              this._error.throwError(config.generalErrMsg);
            }
          }, err => { this._error.throwError('Error! unable to delete folder') });
      } else {
        this.isLoading = false;
        this._error.throwError('Error! unable to delete folder');
        return;
      }
    } catch {
      this.isLoading = false;
      this._error.throwError(config.generalErrMsg);
    }
  }



  onMoveFile(data) {
    this.isLoading = true;
    if (data.length > 0) {
      let inputData = [];
      for (let i = 0; i < data.length; i++) {
        inputData.push({
          'Id': data[i].id,
          //"Path": data[i].path,
          'Path': '',
          'Parent': data[i].parent //this.popupPathId.length == 0 ? 0 : this.popupPathId[this.popupPathId.length - 1],
        });
      }
      try {
        this.deals.moveFiles(inputData)
          .subscribe((res: any) => {
            if (!res.IsError) {
              this.getData();
              this.isLoading = false;
              this._error.throwError(res.Message);
            } else {
              this.isLoading = false;
              this._error.throwError(config.generalErrMsg);
            }
          }, err => {
            this.isLoading = false;
            this._error.throwError(config.generalErrMsg);
          });
      } catch {
        this._error.throwError(config.generalErrMsg);
      }
    }
  }


  // createDoc(fileName, filePath) {
  //   this.isLoading = true;
  //   const inputData = {
  //     "Deal": { 'Id': this.deal.id },
  //     "Name": fileName,
  //     "Parent": this.pathId.length == 0 ? 0 : this.pathId[this.pathId.length - 1],
  //     "Type": 3,
  //     "Path": filePath,
  //     "IsFolder": false,
  //     "CreatedBy": this.adid + "|" + this.user
  //   }
  //   try {
  //     this.deals.createFile(inputData)
  //       .subscribe((res: any) => {
  //         if (!res.IsError) {
  //           this.isLoading = false;
  //           this._error.throwError('File uploaded successfully');
  //           this.getData();
  //         } else {
  //           this.isLoading = false;
  //           this._error.throwError(config.generalErrMsg);
  //         }
  //       }, err => {
  //         this.isLoading = false;
  //         this._error.throwError(config.generalErrMsg);
  //       });
  //   } catch {
  //     this._error.throwError(config.generalErrMsg);
  //   }

  // }

  fileUpload(event) {
    this.isLoading = true;
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      let formData: FormData = new FormData();
      // if (!this.validateFile(file.name)) {
      //   this.isLoading = false;
      //   this._error.throwError('Unsupported file format');
      //   return false;
      // }
      if (file.size > 100000000) {
        this._error.throwError('Oops! too large file');
        return false;
      }
      formData.append("file", file, file.name);
      try {
        this.deals.documentMgmtUpload(formData)
          .subscribe(res => {
            if (res) {
              if (!res.IsError) {
                this.isLoading = false;
                this.getData(res.ResponseObject.Parent);
                this._error.throwError('File uploaded successfully');
                this.fileName = res.ResponseObject.Name;
                this.fileUrl = res.ResponseObject.Path;
                // this.createDoc(res.ResponseObject.Name, res.ResponseObject.Path);

              } else {
                this.isLoading = false;
                this._error.throwError('Oops! File upload failed')
              }
            }
            this.isLoading = false;
          }, err => {
            this.isLoading = false;
            this._error.throwError(config.generalErrMsg);
          })
      } catch {
        this.isLoading = false;
        this._error.throwError(config.generalErrMsg);
      }
    }
  }

  validateFile(name: String) {
    var ext = name.substring(name.lastIndexOf('.') + 1);
    if (ext.toLowerCase() == 'docx' || ext.toLowerCase() == 'pptx' || ext.toLowerCase() == 'xlsx' || ext.toLowerCase() == 'pdf') {
      return true;
    }
    else {
      return false;
    }
  }

  downloadFile(data) {
    this.isLoading = true;
    if (this.envr.envName === 'MOBILEQA') {
      var fileTransfer = new FileTransfer();
      let path = data.path.split('?')[0];
      var uri = encodeURI(path);
      var fileURL = "///storage/emulated/0/Download/" + data.name;
      this._error.throwError(`${data.name} downloaded`);
      this.isLoading = false;
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
    } else {
      let path = data.path.split('?')[0];
      window.open(path, "_blank");
      this.isLoading = false;
    }
  }


  downloadAll(data) {
    var zip: JSZip = new JSZip();
    var count = 0;
    var zipFilename = "L2O.zip";
    let urls = [];
    let options = [];
    for (let obj of data) {
      if (!obj.isFolder) {
        let path = obj.path.split('?')[0];
        let filename = path.replace(/^.*[\\\/]/, '').split('.')[0];
        let fileType = path.split('.').pop();
        urls.push(path);
        options.push({ name: filename, type: fileType })
      }
    }
    urls.forEach(function (url, i) {

      var promise = new JSZip.external.Promise(function (resolve, reject) {
        JSZipUtils.getBinaryContent(url, function (err, data) {
          if (err) {
            reject(err);
          } else {
            resolve(data);
          }
        })
      });
      // promise.then(JSZip.loadAsync)                     
      //   .then(function (zip) {
      //     return zip.file("Hello.txt").async("string");
      //   })

      JSZipUtils.getBinaryContent(url, function (err, data) {
        if (err) {
          this._error.throwError(err);
        }
        zip.file(options[i].name + "." + options[i].type, data, { binary: true });
        count++;
        if (count == urls.length) {
          zip.generateAsync({ type: 'blob' }).then(function (content) {
            saveAs(content, zipFilename);
          });
        }
      })

    })

    console.log('file urls', urls)
  }

  removeElement(event) { }
  renameElement(event) { }
  moveElement(event) { }

  ngOnDestroy() {
    this.subscriptionList$.unsubscribe();
    this.subscriptionList$.unsubscribe();
  }

}
