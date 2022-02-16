import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { Router } from '@angular/router';
import { environment as env } from '@env/environment';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { ErrorMessage } from '@app/core/services/error.services';
import { EnvService } from '@app/core/services/env.service';
@Component({
  selector: 'app-lead-more-view',
  templateUrl: './lead-more-view.component.html',
  styleUrls: ['./lead-more-view.component.scss']
})
export class LeadMoreViewComponent implements OnInit {
  leadIdentityFrom: number;
  userGuid : any;
  constructor( public envr : EnvService,private dataCommunicationService: DataCommunicationService, public router: Router, private EncrDecr: EncrDecrService, 
    private encrDecrService: EncrDecrService, private errorMessage: ErrorMessage, ) { }
  moreViewData = [];
  headerData = [
    { name: "title", subProp: "pinStatus", isFirst: true, title: "Title", type: "text", selectName: " Views " },
    { name: "created_by", title: "Created By", type: "text" },
    { name: "created_on", title: "Created On", type: "date" }
  ]
  ngOnInit() {
    this.dataCommunicationService.getLeadMoreViews("lead").subscribe(res => {
      debugger
      this.leadIdentityFrom = JSON.parse(sessionStorage.getItem('navigationfromlist'))
      if (!res.IsError) {
        this.moreViewData = res.ResponseObject.map(x => x = {
          ...x,
          title: x.Name,
          Guid: x.Guid,
          created_by : x.Owner.FullName,
          created_on : x.Owner.created_on,
        });
        console.log(this.moreViewData)
      } else {
        this.moreViewData = [];
        this.errorMessage.throwError(res.Message)

      }
    })
  }
  createnewviewcrm(){
    const createnewviewcrm = this.envr.authConfig.url;
    //https://quantumt.wipro.com/main.aspx?appid=&pagetype=advancedfind
    // let url = createnewviewcrm+"main.aspx?appid=&pagetype=advancedfind";
    let url = createnewviewcrm + "/WebResources/wipro_openadvancefindfromsoe";
    console.log(url)
    window.open(url, "_blank");
  }
  deletenewviewcrm(viewArray){
     console.log('okay',viewArray)
    //  let leadGuidArray = []
     let DeleteLeadIds = viewArray.map(x => {return {Guid:x.Guid}})
    console.log(DeleteLeadIds)
    console.log(viewArray)
     this.dataCommunicationService.deleteMoreView(DeleteLeadIds).subscribe(res=>{
       console.log(res)
       if(!res.IsError){
debugger
        DeleteLeadIds.forEach(deleteData => {
          this.moreViewData = this.moreViewData.filter(data => data.Guid!==deleteData.Guid )
          console.log('after deleting');
          console.log(this.moreViewData)
        });
       
        this.errorMessage.throwError(res.Message)
       }else{
        this.errorMessage.throwError(res.Message)
       }
     },error=>{
      
      this.errorMessage.throwError(error)
       })

  }
  moreViewactions(childActionRecieved) {
    debugger
    var actionRequired = childActionRecieved;
    console.log(childActionRecieved);
    switch (actionRequired.action) {
      case 'title':
        {
          console.log('in navi title ----->', childActionRecieved);
          //Navigation       
          this.redirecttodetail(childActionRecieved.objectRowData);
          return;
        }
        case 'Create':{
          this.createnewviewcrm();
          return;
        }
        case 'delete':
            {
              console.log('in navi', childActionRecieved);
              //Navigation       
              //this.redirecttodetail(childActionRecieved.objectRowData);
              this.deletenewviewcrm(childActionRecieved.objectRowData);
              return;
            }
            case 'share':
            {
              console.log('in navi', childActionRecieved);
              //Navigation       
              //this.redirecttodetail(childActionRecieved.objectRowData);
              this.createnewviewcrm();
              return;
            }
            case 'edit':
            {
              console.log('in navi', childActionRecieved);
              //Navigation       
              //this.redirecttodetail(childActionRecieved.objectRowData);
              this.createnewviewcrm();
              return;
            }
            case 'navTo':
              {
                console.log('in navi', childActionRecieved);
                //Navigation       
                //this.redirecttodetail(childActionRecieved.objectRowData);
                this.navTo();
                return;
              }
      default:
        break;
    }

  }

  redirecttodetail(item) {
    // sessionStorage.setItem('LeadId', JSON.stringify(this.encrDecrService.set('EncryptionEncryptionEncryptionEn', item[0].Guid, 'DecryptionDecrip')));
    // this.router.navigate(['/leads/leadDetails'])
    window.open(item[0].OnClickUrl, "_blank");
  }

  navTo() {
    console.log(this.leadIdentityFrom,"leadIdentityFrom")
    debugger
    // this.routingState.backClicked()
    // this.isHistory = false;
    console.log(this.leadIdentityFrom,"formname");
    if (this.leadIdentityFrom == 2) {
      this.router.navigate(['leads/unqalified'])
    } else if (this.leadIdentityFrom == 1) {
      this.router.navigate(['leads/qualified'])
    } else if (this.leadIdentityFrom == 3) {
      this.router.navigate(['leads/archived'])
    } else if (this.leadIdentityFrom == 4) {
      this.router.navigate(['leads/diqualified'])
    }

  }

}
