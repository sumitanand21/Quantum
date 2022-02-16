import { Component, OnInit, AfterViewInit, AfterContentInit } from '@angular/core';
import { DataCommunicationService, OpportunitiesService } from '@app/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FileUploader } from 'ng2-file-upload';
import { FileUploadService } from '@app/core/services/file-upload.service';
import { ControlSearchComponent } from '@app/shared/components/control-search/control-search.component';
import { OrderService, KMSMEHeadersData, KMSMEAdvNames } from '@app/core/services/order.service';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
import { deleteserviceLine1 } from '../opportunity-view/tabs/business-solution/business-solution.component';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { AdvancelookuptabsComponent } from '@app/shared/modals/advancelookuptabs/advancelookuptabs.component';

@Component({
  selector: 'app-knowledgemanagement',
  templateUrl: './knowledgemanagement.component.html',
  styleUrls: ['./knowledgemanagement.component.scss']
})
export class KnowledgemanagementComponent implements OnInit {
  panelOpenState2: boolean;
  kmdetails = [];
  Isdisabled = true;
  isPrivate: boolean;
  fileURL: any;

  docSanSelection: boolean;
  docTypeArr = [];
  displayWinReasons: boolean = false;
  dispalyLossReasons: boolean = false;
  winReasonsData = [];
  lossReasonsData = [];
  document_Data = [];

  showTag: boolean = false;
  contactTag: string = "";
  contactTagSwitch: boolean = true;
  smeContactLength: any = 0;
  smeContactName: string = "";
  TagContact: {}[] = []
  selectedTag: {}[] = [];

  orderId: any;
  editAccess: boolean;

  show_sme: boolean = false;
  show_documenttype: boolean = false;
  show_title = false;
  text: boolean = false;

  fileUploadQueue: any = [];
  public uploader: FileUploader = new FileUploader({ url: URL });
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;

  constructor(public location: Location,private fileService: FileUploadService, public dialog: MatDialog, public projectService: OpportunitiesService,public router: Router, public service: DataCommunicationService,
    public orderService: OrderService, private EncrDecr: EncrDecrService, private snackBar: MatSnackBar ) { }

  ngOnInit() {
    this.getRoleBasedAccess();
    this.getKMoverviewDetails();
    this.getKMDocDetails();
    this.getDocumentType();
    this.getDocSanitizedData();
    this.getWinCategoryData();
    this.getLossCategoryData();
    this.getReasonStatus();
    this.getKMSMEData();
  }

  goBack() {
    this.location.back();
  }

  initialAddNewDoc() {
    if (this.document_Data.length === 0) {
      this.addNewDOcumnet();
    }
  }

  // /**************file upload functionality starts by rishi and saurav starts*************/

  public fileOverBase (evt,i) {
    if (evt && evt.target && evt.target.files && evt.target.files.length > 0) {
      debugger;
      let length = (evt.target.files.length - 1);
     
        let index = i;
        this.service.loaderhome = true;
        let file: File = evt.target.files[i];

        const fd: FormData = new FormData();
        fd.append('file', file);
        let fileExtension = (file.name) ? (file.name.split('.').pop()) : '';
        let reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = (evt: any) => {
          let arrayBuffer: any = reader.result;
          let uint = new Uint8Array(arrayBuffer);
          let bytes = []
          for (let j = 0; j < 4; j++) {
            bytes.push(uint[j].toString(16))
          }
          let hex = bytes.join('').toUpperCase()
          hex = hex.slice(0, 4);
          console.log("hex", hex);
          if (fileExtension == "exe" || fileExtension == "lib" || fileExtension == "manifest" || hex == "4D5A") {
            if (index == length) {
              this.service.loaderhome = false;
            }
            this.projectService.displayMessageerror(fileExtension + " is not allowed");
          }
          else if (file.size > 15728640) {
            this.service.loaderhome = false;
            this.projectService.displayMessageerror('uploded file is greater than 15 mb');
          }
          else {
            this.saveContactToRepo(fd,file, index, length);
          }
          console.log("file upload")

        }
      }
    }
  


  saveContactToRepo(filedetails: any,file, ind, length) {
    this.document_Data[ind].attachmentFlag = false;
    this.service.loaderhome = true;
    // var file = this.uploader.queue;
    // this.fileUploadQueue[ind] = file[file.length - 1];
    let fileToUpload = [];
    fileToUpload.push(filedetails)
    this.fileService.filesToUploadDocument64(fileToUpload).subscribe((res: any) => {
     let UploadFileName = file.name
    let seqName =  res[0].ResponseObject.Name
      // this.fileUploadQueue[ind]['url'] = res;
       const ResObj = {
         DownloadFileName :seqName
       }
      const fileObj = {
        attachmentName: UploadFileName,
        attachmentUrl: res[0].ResponseObject.Url
      }
      this.document_Data[ind].document.push(Object.assign({}, fileObj,ResObj));
      this.service.loaderhome = false;
    })
     
   // this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  remove(id: number, ind) {
    this.document_Data[ind].document = [];
  }

  downloaFile(i) {
   //console.log("sdsdf",this.document_Data[i].document[i].DownloadFileName);
   let str = this.document_Data[i].document[0].attachmentUrl.split('/');
   let name = str[str.length-1];
   let arr = [
     {
       "Name" : name
     }];
   
    this.fileService.filesToDownloadDocument64(arr).subscribe((res) =>{ 
      // this.isLoading = false;
      if(!res.IsError) {
        res.ResponseObject.forEach(res => {
          this.service.Base64Download(res);
        })
      } else {
        //  this.ErrorMessage.throwError(res.Message);
      }
      console.log(res);
    },() =>{
      // this.isLoading = false;
    })
  }
  // /**************file upload functionality starts by rishi and saurav ends*************/

  //Get KM Overview Details
backbutton2(){
  if (this.router.url === '/opportunity/orderactions/knowledgemanagement') {
    this.router.navigate(['/opportunity/opportunityview/order']);
  }
 
       
  }
  getKMoverviewDetails() {
    this.service.loaderhome = true;
    let requestBody = {
      OpportunityId: this.projectService.getSession('opportunityId')
    };
    this.orderService.getKMOverviewDetails(requestBody).subscribe((res: any) => {
      if (res.IsError == false) {
        this.kmdetails = res.ResponseObject;
        this.service.loaderhome = false;
      }
    },
      err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      })
  }

  // ********************* KM Document *******************************/

  getKMDocDetails() {
    this.service.loaderhome = true;
    this.document_Data = [];
    let requestedBody = {
      OpportunityId: this.projectService.getSession('opportunityId')
    };
    this.orderService.getKMDocumentDetailsData(requestedBody).subscribe((response: any) => {
      if (response.IsError == false) {
        const kmDocDetails = response.ResponseObject;
        if (kmDocDetails.length == 0 || kmDocDetails == null) {
          this.addNewDOcumnet();
        }
        kmDocDetails.map(data => {
          const docDataObj = {
            id: data.WiproKMDocumentsId,
            documentType: data.WiproDocumentType,
            title: data.WiproTitle,
            comments: data.WiproComments,
            document: [{
              attachmentName: data.WiproDocumentName,
              attachmentUrl: data.WiproLink,
              attachmentId: data.WiproAttachmentId,
              uniqueKey: data.WiproUniqueKey
            }],
            DocSanitized: data.WiproAreDocumentSanitized,
            attachmentId: data.WiproAttachmentId,
            wiproName: data.WiproName,
          }
          this.document_Data.push(docDataObj);
        });
        this.service.loaderhome = false;
      }
    },
      err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      });
  }

  getDocumentType() {
    this.orderService.getKMDocumentType().subscribe((res: any) => {
      if (res.IsError == false) {
        this.docTypeArr = res.ResponseObject
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  addNewDOcumnet() {
    this.document_Data.unshift({
      id: "",
      documentType: "",
      title: "",
      comments: "",
      document: [],
      // show_text:false,
      docTypeFlag: false,
      docTitleFlag: false,
      docCommentFlag: false,
      attachmentFlag: false
    });
  }

  deleteDocumnet(data, ind) {
    if ( this.document_Data[ind].id == "" && this.document_Data[ind].documentType == "" && this.document_Data[ind].title == "" && this.document_Data[ind].comments == "" && this.document_Data[ind].document.length == 0 )
    {
      this.document_Data.splice(ind, 1);
      this.projectService.displayMessageerror("Document deleted successfully");
    }
    else 
    {
    this.openDialogDelete("Do you wish to delete this KM document?", "Confirm", "Delete KM document").subscribe((res: any) => {
      if (res == 'save') {
        let requestBody = {
          KMDocumentId: data.id,
        }
        if (data.id) {
          this.orderService.DeleteKMDocument(requestBody).subscribe((res: any) => {
            if (res.IsError == false) {
              this.document_Data.splice(ind, 1)
              this.projectService.displayMessageerror("Document deleted successfully");
            }
            else {
              this.projectService.displayMessageerror("Unable to delete, please try again later");
            }
          });
        }
        else {
          this.document_Data.splice(ind, 1);
          this.projectService.displayMessageerror("Document deleted successfully");
        }
      }
    });
  }
  }

  // remove error message validation starts
  action:any;
  selectedDocType(evnt, i) {
    if (this.document_Data.length > 1) {
      if (this.document_Data.some((ris, index, array) => {
        let indexVal: any = array.findIndex(it => it.documentType == ris.documentType);
        if (indexVal >= 0 && indexVal != index) {
          return true;
        } else {
          return false;
        }
      }) == true) {
        setTimeout(() => { this.document_Data[i].documentType = "" });
        // ris.documentType.includes(evnt.target.value,i+1)))
        this.snackBar.open("Selected document type exists. Please select another one.",this.action, { duration: 2000});
      }
      else {
        this.document_Data[i]['documentType'] = evnt.target.value;
        let flag = evnt.target.name;
        if (flag === 'docTypeFlag') {
          this.document_Data[i].docTypeFlag = false;
        }
      }
    }
    else {
      this.document_Data[i]['documentType'] = evnt.target.value;
      let flag = evnt.target.name;
      if (flag === 'docTypeFlag') {
        this.document_Data[i].docTypeFlag = false;
      }
    }
    // this.document_Data[i]['documentType'] = evnt.target.value;
    // let flag = evnt.target.name;
    // if (flag === 'docTypeFlag') {
    //   this.document_Data[i].docTypeFlag = false;
    // }
  }

  addTitle(evnt, i) {
    let flag = evnt.target.name;
    if (flag === 'docTitleFlag') {
      this.document_Data[i].docTitleFlag = false;
    }
  }

  addComment(evnt, i) {
    let flag = evnt.target.name;
    if (flag === 'docCommentFlag') {
      this.document_Data[i].docCommentFlag = false;
    }
  }
  // remove error message validation end


  saveDocument() {
    // validations on save starts
    // SME
    if (this.selectedTag.length == 0) {
      this.show_sme = true;
      this.scrolltoMandatoryField();
    }

    //Document Panel
    this.document_Data.map((data: any) => {
      if (data.documentType == '' || data.documentType == null) {
        data.docTypeFlag = true;
      }
      if (data.title == '' || data.title == null || data.title.trim() == '') {
        data.docTitleFlag = true;
      }
      if (data.comments == '' || data.comments == null || data.comments.trim() == '') {
        data.docCommentFlag = true;
      }
      if (data.document.length == 0) {
        data.attachmentFlag = true;
      }
    });
    // validations on save end

    if (this.document_Data.length == 0 || this.selectedTag.length == 0) {
      this.projectService.displayMessageerror("Enter the mandatory details")
    }
    else {
      this.service.loaderhome = true;
      var createDocPayload = [];
      this.document_Data.map(data => {
        let createPayload;
        let createDocArr = [];
        data.document.map(item => {
          createDocArr = [{
            wipro_uniquekey: "894",
            wipro_link: item.attachmentUrl,
            wipro_name: item.attachmentName
          }];
        });
        createPayload = {
          Attachment_Extension: createDocArr,
          WiproDocumentType: data.documentType,
          NewComment: data.comments.trim(),
          NewTitle: data.title.trim(),
          WiproName: "KM Document",
          OpportunityId: this.projectService.getSession('opportunityId'),
          KMDocumentId: data.id ? data.id : ""
        }
        createDocPayload.push(createPayload);
        console.log("save doc payload is", createDocPayload)
      });

      let valid = true;
      let documentArr = createDocPayload;
      for (let i = 0; i < documentArr.length; i++) {
        let obj = documentArr[i];
        Object.keys(obj).map(key => {
          if (key !== 'KMDocumentId') {
            if (!obj[key]) {
              valid = false;
            }
            if (key === 'Attachment_Extension') {
              if (!obj[key].length) {
                valid = false;
              }
            }
          }
        })
      }
      if (valid) {
        this.orderService.createUpdateKMDocumentData(createDocPayload).subscribe((res: any) => {
          if (res.IsError == false) {
            console.log("save doc res is", res)
            this.getKMDocDetails();
            this.service.loaderhome = false;
            this.projectService.displayMessageerror("Details saved successfully");
          }
        },
          err => {
            this.service.loaderhome = false;
            this.projectService.displayerror(err.status)
          });
      }
      else if (!valid) {
        this.service.loaderhome = false;
        this.projectService.displayMessageerror("Enter the mandatory details");
        this.scrolltoMandatoryField();
      }
      this.updateDocSanitizedData();
      this.updateAttachment();
      this.saveSMEContact();
    }
  }

  updateAttachment() {
    this.service.loaderhome = true;
    this.document_Data.map(data => {
      data.document.map(item => {
        let updateAttPayload = {
          WiproName: item.attachmentName,
          WiproUploadedFinalResponseLink: item.attachmentUrl,
          WiproAttachmentId: data.attachmentId,
          WiproUniqueKey: "894",
          NewComment: data.comments,
          KMDocumentId: data.id
        }
        this.orderService.updateKMAttachmentData(updateAttPayload).subscribe((res: any) => {
          if (res.IsError == false) {
            this.service.loaderhome = false;
          }
        },
          err => {
            this.service.loaderhome = false;
            this.projectService.displayMessageerror(err.status)
          });
      });
    });
  }

  getDocSanitizedData() {
    let requestBody = {
      OpportunityId: this.projectService.getSession('opportunityId')
    }
    console.log("get doc sanitized payload is", requestBody)
    this.orderService.getDocSanitizedDetails(requestBody).subscribe((res: any) => {
      if (res.IsError == false) {
        console.log("get doc sanitized res is", res.ResponseObject)
        this.docSanSelection = res.ResponseObject[0].WiproAreDocumentSanitized;
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  updateDocSanitizedData() {
    let requestBody = {
      OpportunityId: this.projectService.getSession('opportunityId'),
      WiproAreDocumentSanitized: this.docSanSelection
    }
    console.log("update doc sanitized payload is", requestBody)
    this.orderService.updateDocSanitizedDetails(requestBody).subscribe((res: any) => {
      if (res.IsError == false) {
        console.log("update doc sanitized res is", res.ResponseObject)
        res = res.ResponseObject
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  // /*************** KM document functionality ends here ************************/

  // /************** get Wind and Loss reasons start here ************************/

  getWinCategoryData() {
    let winReasonPayload = {
      OpportunityId: this.projectService.getSession('opportunityId')
    }
    this.orderService.winKMDetails(winReasonPayload).subscribe((res: any) => {
      if (res.IsError == false) {
        this.winReasonsData = res.ResponseObject;
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  getLossCategoryData() {
    let lossReasonPayload = {
      OpportunityId: this.projectService.getSession('opportunityId')
    }
    this.orderService.lossKMDetails(lossReasonPayload).subscribe((res: any) => {
      if (res.IsError == false) {
        this.lossReasonsData = res.ResponseObject;
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  getReasonStatus() {
    const status = this.projectService.getSession('opportunityStatus');
    if (status == '3') {
      this.displayWinReasons = true;
      this.dispalyLossReasons = false;
    }
    else if (status == '184450000' || status == '5') {
      this.dispalyLossReasons = true;
      this.displayWinReasons = false;
    }
  }
  // /*********** get Wind and Loss reasons end here *****************/


  // /******************SME autocomplete code start *******************/

  contactTagclose() {
    this.contactTagSwitch = false;
  }

  searchSMEContact(evnt) {
    let requestBody = {
      SearchText: evnt.target ? evnt.target.value : evnt,
      PageSize: 10,
      OdatanextLink: "",
      RequestedPageNumber: 1
    }
    this.orderService.getSMEData(requestBody).subscribe((res: any) => {
      if (res.IsError == false) {
        this.TagContact = [];
        // let smeContactData = res.ResponseObject.sort((a,b) => a.Fullname > b.Fullname ? 1 : -1)
        let smeContactData = res.ResponseObject;
        smeContactData.map(data => {
          let dataObj = {
            contact: data.Name,
            SMEUserId: data.SysGuid,
            SMEOwnerId: data.OwnerId,
            adid: data.Code
          }
          this.TagContact.push(dataObj);
        });
      }
    },
      err => {
        this.projectService.displayerror(err.status);
      });
  }

  appendTag(value: string, userId, smeAdid) {
    this.show_sme = false;
    let alreadyExist = false;
    this.contactTag = "";
    let contactObj = { contact: value, SMEUserId: userId, adid: smeAdid };
    this.selectedTag.map((res: any) => {
      if (res.SMEUserId === userId) {
        alreadyExist = true;
        this.projectService.displayMessageerror("Contact already added")
      }
    })
    if (!alreadyExist) {
      this.selectedTag.push(contactObj);
    }
    this.smeContactLength = this.selectedTag.length;
    console.log("sel tag.", this.selectedTag)
  }

  getKMSMEData() {
    this.service.loaderhome = true;
    this.selectedTag = [];
    let requestBody = {
      OpportunityId: this.projectService.getSession('opportunityId')
    }
    this.orderService.getKMSMEDetails(requestBody).subscribe(res => {
      if (res.IsError == false) {
        let kmSMEData = res.ResponseObject
        kmSMEData.map(data => {
          let obj = {
            contact: data.WiproSMEValueName,
            SMEUserId: data.WiproSMEValue,
            KMSMEId: data.WiproKMDetailsId,
            adid: data.WiproSMEADID
          }
          this.selectedTag.push(obj);
          this.smeContactLength = this.selectedTag.length;
        });
      }
      this.service.loaderhome = false;
    },
      err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      });
  }

  saveSMEContact() {
    this.service.loaderhome = true;
    let smePayload = [];
    this.selectedTag.map((data: any) => {
      let payload = {
        WiproName: data.contact,
        OpportunityId: this.projectService.getSession('opportunityId'),
        WiproKMSMEUserId: data.SMEUserId,
        WiproKMSMEADId: data.adid,
        WiproKMSMEId: data.KMSMEId ? data.KMSMEId : ""
      }
      smePayload.push(payload);
    });
    this.orderService.createUpdateKMSME(smePayload).subscribe(res => {
      if (res.IsError == false) {
        this.getKMSMEData();
      }
      this.service.loaderhome = false;
    },
      err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      });
  }

  deleteSMEContact(data, index) {
    this.service.loaderhome = true;
    let requestBody = [{
      WiproKMSMEId: data.KMSMEId
    }];
    this.orderService.deleteSMEData(requestBody).subscribe(res => {
      if (res.IsError == false) {
        this.selectedTag.splice(index, 1);
        this.projectService.displayMessageerror("Contact removed successfully!")
      }
      else {
        this.projectService.displayMessageerror("Unable to delete contact please try again later")
      }
      this.smeContactLength = this.selectedTag.length;
      this.service.loaderhome = false;
    },
      err => {
        this.service.loaderhome = false;
        this.projectService.displayerror(err.status);
      })
  }

  getInitials(smeContactName) {
    // debugger;
    var names = smeContactName.split(' '),
      initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
  }


  // /****************** SME  autocomplete code end *******************/

  // Delete Popup dialog box code starts

  openDialogDelete(msg: string, buttonText: string, headerText: string): Observable<string> {
    let dialogRef = this.dialog.open(deleteserviceLine1, {
      width: "350px",
      data: { message: msg, buttonText: buttonText, Header: headerText }
    });

    return dialogRef.afterClosed().pipe(map(result => {
      return result;
    }));
  }

  // Delete Popup dialog box code ends


  // get Order details

  getRoleBasedAccess() {
    let payload = {
      Id: this.projectService.getSession('opportunityId')
    }
    this.orderService.checkOrderBookingId(payload).subscribe((data: any) => {
      console.log("order details in Km", data)
      this.orderId = data &&  data.ResponseObject && data.ResponseObject[0].SalesOrderId;
      console.log("order id is", this.orderId)
      let payload = {
        UserGuid: this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip'),
        Guid: this.orderId
      }
      console.log("access payload is", payload)
      this.orderService.addRoleBaseAccess(payload).subscribe((data: any) => {
        let access = data.ResponseObject;
        console.log("access data is", access);
        if (access) {
          this.editAccess = false;
        }
        else {
          this.editAccess = true;
        }
      })
    });
  }

  // After 90 days user canot update KM details validation starts here
  orderCreatedDate: any;
  currentDate = new Date()
  updateExpirationFlag: boolean = false;

  getSalesOrderDetails(orderId) {
    const payload = {
      Guid: orderId
    }
    this.orderService.getSalesOrderDetails(payload).subscribe((res: any) => {
      if (!res.IsError) {
        let orderCreatedon = res.ResponseObject.CreatedOn;
        this.orderCreatedDate = orderCreatedon.setDate(orderCreatedon.getDate() + 89);
        let date1 = new Date(this.orderCreatedDate);
        let date2 = new Date(this.currentDate);
        if (this.currentDate > this.orderCreatedDate) {
          this.updateExpirationFlag = true;
        }
        else {
          this.updateExpirationFlag = false;
        }
      }
    })

  }
  // After 90 days user canot update KM details validation ends here

  scrolltoMandatoryField() {
    setTimeout(() => {
      let element: any = document.getElementsByClassName('orangeborder')[0];
      if (element) {
        element.focus();
        window.scroll({
          behavior: 'smooth',
          left: 0,
          top: element.getBoundingClientRect().top + window.scrollY - 150
        });
      }
      // console.log(t.id)
      // document.getElementById(t.id).focus()
      // document.getElementById(t.id).blur()
      // x[y.name].IsError = true;
    }, 500)


  }

  // lookupdata = {
  //   tabledata: [],
  //   recordCount: 10,
  //   headerdata: [],
  //   Isadvancesearchtabs: false,
  //   controlName: '',
  //   lookupName: '',
  //   isCheckboxRequired: false,
  //   inputValue: '',
  //   TotalRecordCount: 0,
  //   selectedRecord: [],
  //   pageNo: 1,
  //   nextLink: '',
  //   isLoader: false
  // };
  // defaultpageNumber = 1;
  // totalRecordCount = 0;
  // OdatanextLink = null;

  // selectedLookupData(controlName) {
  //   switch (controlName) {
  //     case 'SMEMaker': {
  //       return (this.selectedTag.length > 0) ? JSON.parse(JSON.stringify(this.selectedTag)) : []
  //     }
  //   }
  // }

  // openadvancetabs(controlName, initalLookupData, value): void {
  //   console.log("hello")
  //   debugger;
  //   this.lookupdata.controlName = controlName
  //   this.lookupdata.headerdata = KMSMEHeadersData[controlName]
  //   this.lookupdata.lookupName = KMSMEAdvNames[controlName]['name']
  //   this.lookupdata.isCheckboxRequired = KMSMEAdvNames[controlName]['isCheckbox']
  //   this.lookupdata.Isadvancesearchtabs = KMSMEAdvNames[controlName]['isAccount']
  //   this.lookupdata.inputValue = value;
  //   this.lookupdata.selectedRecord = this.selectedLookupData(this.lookupdata.controlName);
  //   this.projectService.getLookUpFilterData({ data: initalLookupData, controlName: controlName, isService: false, useFullData: null }).subscribe(res => {
  //     this.lookupdata.tabledata = res
  //   })

  //   const dialogRef = this.dialog.open(AdvancelookuptabsComponent, {
  //     width: this.service.setHeaderPixes(this.lookupdata.headerdata.length, this.lookupdata.Isadvancesearchtabs),
  //     data: this.lookupdata
  //   });

  //   dialogRef.componentInstance.modelEmiter.subscribe((x) => {
  //     let controlNameLoaded = x.objectRowData.controlName;
  //     debugger
  //     console.log(x)
  //     if (x.action == 'loadMore') {

  //       let dialogData = {
  //         SearchText: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
  //         PageSize: this.lookupdata.recordCount,
  //         OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
  //         // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
  //         RequestedPageNumber: x.currentPage,
  //       }
  //       console.log("d data...........", dialogData)

  //       this.orderService.getSMEData(dialogData).subscribe(res => {
  //         this.lookupdata.isLoader = false;
  //         this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
  //         this.lookupdata.pageNo = res.CurrentPageNumber;
  //         this.lookupdata.nextLink = res.OdatanextLink;
  //         this.lookupdata.recordCount = res.PageSize;
  //         if (controlNameLoaded == "SMEMaker") {
  //           this.TagContact = this.lookupdata.tabledata.concat(res.ResponseObject);
  //         }

  //       })

  //     } else if (x.action == 'search') {

  //       this.lookupdata.tabledata = []
  //       this.lookupdata.nextLink = ''
  //       this.lookupdata.pageNo = 1

  //       let dialogData = {
  //         SearchText: (x['objectRowData'].searchKey != '') ? x['objectRowData'].searchKey : '',
  //         PageSize: this.lookupdata.recordCount,
  //         OdatanextLink: this.lookupdata.nextLink,// need to handel the pagination and search!
  //         // pageNo: this.lookupdata.pageNo//+1//need to handel from pagination
  //         //pageNo: this.lookupdata.pageNo
  //         RequestedPageNumber: x.currentPage,

  //       }
  //       console.log("d data", dialogData)

  //       this.orderService.getSMEData(dialogData).subscribe(res => {
  //         this.lookupdata.isLoader = false;
  //         // this.lookupdata.tabledata = this.lookupdata.tabledata.concat(res.ResponseObject);
  //         this.lookupdata.tabledata = res.ResponseObject;
  //         this.lookupdata.pageNo = res.CurrentPageNumber;
  //         this.lookupdata.nextLink = res.OdatanextLink
  //         this.lookupdata.recordCount = res.PageSize
  //         this.lookupdata.TotalRecordCount = res.TotalRecordCount;
  //         if (controlNameLoaded == "SMEMaker"  && this.lookupdata.tabledata.length > 0) {
  //           this.TagContact = this.lookupdata.tabledata.concat(res.ResponseObject);
  //         }
  //          else {
  //           this.lookupdata.tabledata = res.ResponseObject;
  //         }

  //       })
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     debugger;
  //     if (result) {
  //       console.log(result)
  //       this.AppendParticularInputDataFun(result.selectedData, result.controlName)
  //     }
  //   });
  // }

  // AppendParticularInputDataFun(selectedData, controlName){
  //   console.log("sel data", selectedData)
  //   if(selectedData){
  //     if (controlName == 'SMEMaker') {
  //       this.TagContact = [];
  //       selectedData.forEach(data => {
  //         this.appendTag(data.name, data.SysGuid, data.code);
  //         // this.onChangeHandlerQualifyForm('');
  //       });
  //     }
  //   }

  // }


}
