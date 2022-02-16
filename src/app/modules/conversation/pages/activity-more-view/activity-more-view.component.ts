import { Component, OnInit } from '@angular/core';
import { DataCommunicationService, ErrorMessage } from '@app/core';
import { Router } from '@angular/router';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { environment as env } from '@env/environment';
import { EnvService } from '@app/core/services/env.service';

@Component({
  selector: 'app-activity-more-view',
  templateUrl: './activity-more-view.component.html',
  styleUrls: ['./activity-more-view.component.css']
})
export class ActivityMoreViewComponent implements OnInit {

  activityIdentityFrom: number;
  showTopHeader :boolean = true;
  constructor( public envr : EnvService,private dataCommunicationService: DataCommunicationService, public router: Router, private EncrDecr: EncrDecrService, private errorMessage: ErrorMessage, ) { }
  moreViewData = [];
  headerData = [
    { name: "title", subProp: "pinStatus", isFirst: true, title: "Title", type: "text", selectName: " Views " },
    { name: "created_by", title: "Created By", type: "text" },
    { name: "created_on", title: "Created On", type: "date" }
  ]
  ngOnInit() {
    this.dataCommunicationService.getLeadMoreViews("appointment").subscribe(res => {
      debugger
      this.activityIdentityFrom = JSON.parse(sessionStorage.getItem('navigation'))
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
    window.open(url, "_blank");
  }
  moreViewactions(childActionRecieved) {
    debugger
    var actionRequired = childActionRecieved;
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

  deletenewviewcrm(viewArray){
    console.log('okay',viewArray)
    let DeleteLeadIds = viewArray.map(x => {return {Guid:x.Guid}})
   console.log(DeleteLeadIds)
   console.log(viewArray)
    this.dataCommunicationService.deleteMoreView(DeleteLeadIds).subscribe(res=>{
      console.log(res)
      if(!res.IsError){
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

  redirecttodetail(item) {
    window.open(item[0].OnClickUrl, "_blank");
  }

  navTo() {
    console.log(this.activityIdentityFrom,"formname ");
    if (this.activityIdentityFrom == 1) {
      this.router.navigate(['/activities/myactivities'])
    } else if (this.activityIdentityFrom == 2) {
      this.router.navigate(['/activities/list'])
    } else if (this.activityIdentityFrom == 3) {
      this.router.navigate(['/activities/Archivedlist'])
    } 
    else if (this.activityIdentityFrom == 5) {
      this.router.navigate(['/activities/activitymoreview'])
    } 
  }
}
