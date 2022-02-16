import { Component, OnInit } from '@angular/core';
import { OpportunitiesService } from '@app/core/services/opportunities.service';
import { DigitalApiService } from '../services/digital-api.service';

@Component({
  selector: 'app-assistant-order-details',
  templateUrl: './assistant-order-details.component.html',
  styleUrls: ['./assistant-order-details.component.scss']
})
export class AssistantOrderDetailsComponent implements OnInit {
  competitosList= [];
  empTargetList= [];
  winreasons: boolean;
  accountGuid=this.projectService.getSession("accountid");
  OpportunityID=this.projectService.getSession('opportunityId');
  constructor(public projectService: OpportunitiesService,public DigitalApiService: DigitalApiService) { }

  ngOnInit() {
    this.winreasons = false;
    //let res = this.globalService.postMessageBody;
    // this.globalService.postMessageBody = undefined;
    // if (res.page && (res.page == 'END_SALES_CYCLE' || res.page == 'WIN_REASONS')) {
    //   if (res.page == 'WIN_REASONS') {
    //     this.winreasons = true;
    //   }
      // console.log("this is the END_SALES_CYCLE page")
      // console.log(res,"DA end sales cycle");
      this.fetchCompitorLossReasons();
      this.fetchTargets();
    //}
  }
  fetchCompitorLossReasons(): void {
    console.log("DA end sales cycle1");
    let body = {
      "appID": "DA-OPPORTUNITY-COUNT-COMPETETOR",
      "AccountGuid": this.accountGuid,
      "OpportunityID":this.OpportunityID
    };

    this.DigitalApiService.commonApi(body).subscribe(res => {
      console.log(res,"this is the END_SALES_CYCLE page2");
      if (!res.IsError) {
        if (res.ResponseObject && res.ResponseObject.normalCountCompetetor && res.ResponseObject.normalCountCompetetor.length > 0) {
          console.log("competitor loss reasons");
          console.log(res);

          res.ResponseObject.normalCountCompetetor.map(comp => {
            console.log(comp['LossResonDetails']);
            this.competitosList.push({
              name:comp['competitor_group@OData.Community.Display.V1.FormattedValue'],
              lossPercent:this.getPercent(comp['open_count'], comp['win_count'], comp['loss_count']),
              winPercent:this.getPercentLost(comp['open_count'], comp['win_count'], comp['loss_count']),
              lossReasons:comp['LossResonDetails']
            })
          });
          console.log(this.competitosList)
        } else {

        }

      } else {

      }

    },
      error => {
        console.log(error)
      });
  }
  // fetchActivitiesList(): void {
  //   let body = {
  //     "appID": "DA-OPP-MEETINGS-WITHCONTACTS",
  //     "OpportunityGuid": this.OpportunityID
  //   };

  //   this.apiFunc.fetchTargets(body).subscribe(res => {
  //     console.log(res);
  //     if (!res.IsError) {
  //       if (res.ResponseObject && res.ResponseObject.value) {

  //       }

  //     } else {

  //     }

  //   },
  //     error => {
  //       console.log(error)
  //     });
  // }


  fetchTargets(): void {
    console.log("inside fetchtargets")
    let body = {
      "PageSize": 10,
      "OdatanextLink": "",
      "RequestedPageNumber": 1,
      "Guid": 'b2a4d025-3038-ea11-a964-000d3a07c88d'
    };

    this.DigitalApiService.fetchTargets(body).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject && res.ResponseObject.length > 0) {
          console.log(res);
          res.ResponseObject.map(emp => {
            this.empTargetList.push({
              initials:this.fetchInitial(emp.UserName),
              empName:emp.UserName,
              empRole:emp.IMSrole,
              target:emp.PerfomanceDetails.TOTAL.TGT
            }
              )
            
          });

        } else {

        }

      } else {

      }

    },
      error => {
        console.log(error)
      });
  }
  getPercent(open, won, lost): number {
    const winPercent = (parseInt(won) / (parseInt(open) + parseInt(won) + parseInt(lost))) * 100;
    // return lossPercent / winPercent;
    return parseFloat(winPercent.toFixed(2));
    
  }

getPercentLost(open, won, lost): number {
    const lossPercent = (parseInt(lost) / (parseInt(open) + parseInt(won) + parseInt(lost))) * 100;

    // return lossPercent / winPercent;
    return  parseFloat(lossPercent.toFixed(2));
    
  }
  CompetitorReason = [
    {
      header: "01 loss reason name",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    }, {
      header: "02 loss reason name",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    }, {
      header: "03 loss reason name",
      description: "Lorem Ipsum is simply dummy text of the printing and typesetting industry."
    }
  ];

  reasonIndex = 1;


  showCompReason(reasonIndex) {
    this.reasonIndex = reasonIndex;
  }

    fetchInitial(fullname: string): string {
    let names = fullname.split(" ");
    let char1 = '';
    let char2 = '';

    if (names.length == 1) {
      char1 = fullname.charAt(0);
    } else {
      char1 = names[0].charAt(0);
      char2 = names[names.length - 1].charAt(0);
    }

    return char1 + char2;
  }
   public topContactsClass: string[] = [
    "circle-darkBlue",
    "circle-darkPink",
    "circle-darkYellow",
    "circle-lightBlue",
    "circle-lightGreen"
  ];

    targetDetails = [
    {
      className: "circle-darkBlue",
      initial: "DK",
      name: "Deepika Kashyup",
      dept: "Sales",
      value: "$500,000,00.00"
    }, {
      className: "circle-darkPink",
      initial: "SM",
      name: "Sanjay Mishra",
      dept: "Senior consultant",
      value: "$500,000,00.00"
    }, {
      className: "circle-darkYellow",
      initial: "SG",
      name: "Sheetal Gokhale",
      dept: "Pre sales head",
      value: "$500,000,00.00"
    }, {
      className: "circle-lightBlue",
      initial: "RS",
      name: "Rohit Singh",
      dept: "Senior consultant",
      value: "$500,000,00.00"
    }, {
      className: "circle-lightGreen",
      initial: "TB",
      name: "Tanvi Baste",
      dept: "Pre sales head",
      value: "$500,000,00.00"
    }
  ];
}
