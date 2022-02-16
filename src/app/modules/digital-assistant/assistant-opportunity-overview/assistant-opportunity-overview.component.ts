import { Component, OnInit } from '@angular/core';
import { DigitalApiService } from '../services/digital-api.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { OpportunitiesService } from '@app/core/services';
@Component({
  selector: 'app-assistant-opportunity-overview',
  templateUrl: './assistant-opportunity-overview.component.html',
  styleUrls: ['./assistant-opportunity-overview.component.scss']
})
export class AssistantOpportunityOverviewComponent implements OnInit {

  DeliveryCaseStudies = []
  customerStories = [];
  reusableComponent=[];
  capabilityDeck=[];
  solutionDetails=[];
  accountIntelligence=[];
  finalSLArray=[];
  finalPracticeArray=[];
  wiproSbu;
  verticalName;
  accountId: string = '';
  opportunityId: string = '';
  winLoss: { wins: WinThemesClass[]; losses: LossThemesClass[]; };
  topactivityGroups = [];
  constructor(private encrDecrService: EncrDecrService, private DigitalApiService: DigitalApiService, public OpportunityServices: OpportunitiesService) {}

  public topFiveContacts: TopFiveContactsClass[] = [];
  public opportunitiesList: OpportunityListClass[] = [];
  public meetingDetails: MeetingDetailsList[] = [];
  public winLossThemes: { wins: WinThemesClass[], losses: LossThemesClass[] } = {
    wins: [],
    losses: []
  };
  public winRatioClass: WinLossRatioList = new WinLossRatioList();
  public topContactsClass: string[] = [
    "circle-darkBlue",
    "circle-darkPink",
    "circle-darkYellow",
    "circle-lightBlue",
    "circle-lightGreen"
  ];

  ngOnInit() {

    setTimeout(() => {
      console.log("this is the details page")
      this.accountId = this.OpportunityServices.getSession('accountId');
      this.opportunityId=this.OpportunityServices.getSession('opportunityId');
      var serviceLineArray=this.OpportunityServices.getSession('serviceLineArray');
      var verticalGuid=this.OpportunityServices.getSession('verticleGuid');
      var startDate=this.OpportunityServices.getSession('startDate');
      var endDate=this.OpportunityServices.getSession('endDate');
      var sbuName=this.OpportunityServices.getSession('sbuStoredValue');
      var geoGuid=this.OpportunityServices.getSession('geoGuid');
      var geoName=this.OpportunityServices.getSession('geoName');
      var accountNameOpp=this.OpportunityServices.getSession('accountNameOpp');
      var verticalName=this.OpportunityServices.getSession('verticalName');
      //var emailListArray = this.OpportunityServices.getSession('emailListArray');

      console.log("SLarray", serviceLineArray);
      serviceLineArray.map(data=>{
        this.finalSLArray.push(data.WiproServicelineidValueName.toLowerCase());
        if(data.WiproPracticeName){
        this.finalPracticeArray.push(data.WiproPracticeName.toLowerCase())
      }
      else{
        this.finalPracticeArray.push("")
      }})
     console.log(this.finalSLArray,"finalSL")
     console.log(this.finalPracticeArray,"finalpractice")
      this.wiproSbu=((sbuName == '' || sbuName ==null )? sbuName : sbuName.toLowerCase());
      this.verticalName=verticalName.toLowerCase();
      this.fetchTopFiveContacts(this.accountId);
      this.fetchOpportunitiesList(this.accountId);
      this.fetchWinLossThemes(this.accountId);
      this.fetchActivitiesList(this.opportunityId);
      this.fetchWinRatioBasedOnAccount(this.accountId, startDate, endDate, accountNameOpp)
      this.fetchWinRatioBasedOnSBUGeo(verticalGuid, startDate, endDate, verticalName, geoGuid, geoName)
      // this.fetchOppDifference(res.accountGuid, res.opportunityGuid);
      this.fetchTopActivitiesList(this.opportunityId);

    
    let getdata = this.DigitalApiService.post_TemplateIdsOpp({
      "docTypes": [
        "delivery case studies"],
      "fields": [
        {
           "objectName": "deal",
          "filters": {
            //  "Asset_x0020_Category": [
            //         "delivery case studies"
            //     ],
            "sbu": [this.wiproSbu],
            "vertical": [this.verticalName],
            "practice": this.finalPracticeArray,
            "serviceline_practice_subpractice": this.finalSLArray
          }
        }
      ]
    })
    getdata.subscribe(async DeliveryCaseStudies => {
      console.log(DeliveryCaseStudies)
      let response = await this.DigitalApiService.post_SuccessStories2({ "Input": DeliveryCaseStudies["delivery case studies"] })
      response.subscribe((output) => {
        this.DeliveryCaseStudies = output
        console.log(this.DeliveryCaseStudies, "DeliveryCaseStudies Inside Array")

      })
    })
    //KM assets get data

    
//customer success story API start

    let customerSucessStory = this.DigitalApiService.post_TemplateIdsOpp({
      "docTypes": [
        "client success stories"],
      "fields": [
        {
        "objectName": "deal",
            "filters": {
              // "Asset_x0020_Category": [
              //       "client success stories"
              //   ],
            "sbu": [this.wiproSbu],
            "vertical": [this.verticalName],
            "serviceline_practice_subpractice": this.finalSLArray
            }
        }
      ]
    })
    customerSucessStory.subscribe(async customerSucessStories => {
      let response = await this.DigitalApiService.post_SuccessStories2({ "Input": customerSucessStories["client success stories"] })
      response.subscribe((output) => {
        this.customerStories = output
        console.log(this.customerStories, "customerStories Inside Array")

      })
    })

//customer success story api end 

//Reusable components API start

    let reusableComponents = this.DigitalApiService.post_TemplateIdsOpp({
      "docTypes": [
        "ruc for bid response"],
      "fields": [
        {
        "objectName": "deal",
            "filters": {
              //  "Asset_x0020_Category": [
              //       "ruc for bid response"
              //   ],
            "sbu": [this.wiproSbu],
            "vertical": [this.verticalName],
            "practice": this.finalPracticeArray,
            "serviceline_practice_subpractice": this.finalSLArray
            }
        }
      ]
    })
    reusableComponents.subscribe(async reusableComponentsData => {
      let response = await this.DigitalApiService.post_SuccessStories2({ "Input": reusableComponentsData["ruc for bid response"] })
      response.subscribe((output) => {
        this.reusableComponent = output
        console.log(this.reusableComponent, "reusableComponentsData Inside Array")

      })
    })

//Reusable components api end

//capability deck API start

    let capabilityDecks = this.DigitalApiService.post_TemplateIdsOpp({
      "docTypes": [
        "generic capabilities and solutions"],
      "fields": [
        {
        "objectName": "deal",
            "filters": {
              //  "Asset_x0020_Category": [
              //       "generic capabilities and solutions"
              //   ],
            "sbu": [this.wiproSbu],
            "vertical": [this.verticalName],
            "practice": this.finalPracticeArray,
            "serviceline_practice_subpractice": this.finalSLArray
            }
        }
      ]
    })
    capabilityDecks.subscribe(async capabilityDecksData => {
      let response = await this.DigitalApiService.post_SuccessStories2({ "Input": capabilityDecksData["generic capabilities and solutions"] })
      response.subscribe((output) => {
        this.capabilityDeck = output
        console.log(this.capabilityDeck, "capabilityDecksData Inside Array")

      })
    })

//cability deck api end 

//solutions API start

    let solutions = this.DigitalApiService.post_TemplateIdsOpp({
      "docTypes": [
        "solutions"],
      "fields": [
        {
        "objectName": "deal",
            "filters": {
              //  "Asset_x0020_Category": [
              //       "solutions"
              //   ],
            "sbu": [this.wiproSbu],
            "serviceline_practice_subpractice": this.finalSLArray
            }
        }
      ]
    })
    solutions.subscribe(async solutionsData => {
      let response = await this.DigitalApiService.post_SuccessStories2({ "Input": solutionsData["solutions"] })
      response.subscribe((output) => {
        this.solutionDetails = output
        console.log(this.solutionDetails, "solutionsData Inside Array")
      })
    })

//solutions api end

//AI API start

    let accountIntelligence = this.DigitalApiService.post_TemplateIdsOpp({
      "docTypes": [
        "sales intelligence"],
      "fields": [
        {
        "objectName": "deal",
            "filters": {
              //  "Asset_x0020_Category": [
              //       "sales intelligence"
              //   ],
            "sbu": [this.wiproSbu],
            "vertical": [this.verticalName]
            }
        }
      ]
    })
    accountIntelligence.subscribe(async AI => {
      let response = await this.DigitalApiService.post_SuccessStories2({ "Input": AI["sales intelligence"] })
      response.subscribe((output) => {


        console.log(output, "AI")
        this.accountIntelligence = output
        console.log(this.accountIntelligence, "AI Inside Array")

      })
      console.log()
    })  //AI api end

    }, 4000);  
  }  


//meeting redirection
// postUrl = environment.wittyPostUrl;
// redirectToMeeting(meetID){
//   debugger;
//   window.parent.postMessage(meetID, this.postUrl);
//   console.log(this.postUrl,"this.postUrl")

// }
//meeting redirection code end

  // Requirement 31
  fetchTopActivitiesList(OpportunityGuid): void {
    let body = {
      "appID": "DISPLAY-TOP-ACTIVITIES",
      "OpportunityID": OpportunityGuid
    };

    this.DigitalApiService.commonApi(body).subscribe(res => {
      console.log("opp difference", res);
      if (!res.IsError) {
        if (res.ResponseObject && res.ResponseObject.value) {
          res.ResponseObject.value.map(val => {
            this.topactivityGroups.push( {
              name: val['subject'],
              author : val['_wipro_accountorprospectname_value@OData.Community.Display.V1.FormattedValue'],
              date: val['wipro_meetingcount@OData.Community.Display.V1.FormattedValue']
            })
          });
        }

      } else {

      }

    },
      error => {
        console.log(error)
      });
  }
  
  /**
   * Out of scope
   */

  // fetchOppDifference(accountGuid, OpportunityGuid): void {
  //   let body = {
  //     "AccountGuid": accountGuid,
  //     "OpportunityID": OpportunityGuid,
  //     "appID": "DA-VALUES-COMPARISON"
  //   };

  //   this.DigitalApiService.commonApi(body).subscribe(res => {
  //     console.log("opp difference", res);
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

  fetchWinRatioBasedOnAccount(accountGuid: string, startDate: string, endDate: string, accName: string): void {
    let body = {
      "appID": "DA-OPPORTUNITY-WIN-LOSS-COUNT-BASEDONACCOUNT",
      "AccountGuid": accountGuid,
      "StartDate": startDate,
      "EndDate": endDate
    };
    this.DigitalApiService.commonApi(body).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject) {
          let temp: { WinCount: number, TerminatedCount: number, LoseCount: number } = res.ResponseObject;
          let ratio = (temp.WinCount / (temp.WinCount + temp.TerminatedCount + temp.LoseCount));
          let progressBarValue=ratio*100;
          this.winRatioClass.addRatio({
            type: 'Account',
            label: "Win ratio of opportunities against the Account",
            name: accName,
            ratio: ratio ? parseFloat(ratio.toFixed(2)) : 0,
            colorClass: this.getColorClass(ratio),
            progressBarValue:progressBarValue ? progressBarValue : 0,
          })
          console.log(this.winRatioClass.ratioList);
        }
      } else {

      }

    },
      error => {
        console.log(error)
      });
  }

  fetchWinRatioBasedOnSBUGeo(verticalGuid: string, startDate: string, endDate: string, verticalName: string, geoGuid: string, geoName: string): void {
    let body = {
      "appID": "DA-OPPORTUNITY-WIN-LOSS-COUNT-BASEDONSBUANDGEO",
      "VerticalID": verticalGuid,
      "StartDate": startDate,
      "EndDate": endDate
    };

    this.DigitalApiService.commonApi(body).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject) {
          let temp: { WinCount: number, TerminatedCount: number, LoseCount: number } = res.ResponseObject;
          let ratio = (temp.WinCount / (temp.WinCount + temp.TerminatedCount + temp.LoseCount));
          let progressBarValue=ratio*100;
          this.winRatioClass.addRatio({
            type: 'Vertical',
            label: "Win ratio of opportunities against the Vertical in that Geo",
            name: verticalName,
            ratio: ratio ? parseFloat(ratio.toFixed(2)) : 0,
            colorClass: this.getColorClass(ratio),
            progressBarValue:progressBarValue ? progressBarValue : 0,
          })
          console.log(this.winRatioClass.ratioList);
        }
      } else {

      }

    },
      error => {
        console.log(error)
      });
  }

  fetchActivitiesList(OpportunityGuid): void {
    let body = {
      "appID": "DA-OPP-APPOINTMENTS-MOM",
      "OpportunityGuid": OpportunityGuid
    };

    this.DigitalApiService.commonApi(body).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject && res.ResponseObject.value) {
          console.log("res.ResponseObject",res.ResponseObject)
          res.ResponseObject.value.map(val => {
            this.meetingDetails.push(
              new MeetingDetailsList(
                val['name'],
                val['Conversation.subject'],
                val['Conversation.createdon@OData.Community.Display.V1.FormattedValue'],
                val['Conversation.wipro_summaryorminutes'],
                val['Conversation.activityid']
              )
            );
          });

          console.log(this.meetingDetails);
        }

      } else {

      }

    },
      error => {
        console.log(error)
      });
  }

  fetchTopFiveContacts(accountGuid): void {
    let body = {
      "AccountGuid": accountGuid,
      "appID": "TOP_FIVE_CONTACTS"
    };

    this.DigitalApiService.commonApi(body).subscribe(res => {
      debugger
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject && res.ResponseObject.value) {
          res.ResponseObject.value.map(val => {
            this.topFiveContacts.push(
              new TopFiveContactsClass(
                this.fetchInitial(val['contact.fullname']),
                val['contact.fullname'],
                val['contact.jobtitle'],
                val['activitycount']
              )
            );
          });

          console.log(this.topFiveContacts);
        }

      } else {

      }

    },
      error => {
        console.log(error)
      });
  }


  fetchOpportunitiesList(accountGuid): void {
    let body = {
      "VerticalID": accountGuid,
      "appID": "OPPORTUNITY_LIST"
    };

    this.DigitalApiService.commonApi(body).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject && res.ResponseObject.value) {
          res.ResponseObject.value.map(val => {
            this.opportunitiesList.push(
              new OpportunityListClass(
                val['_ownerid_value@OData.Community.Display.V1.FormattedValue'],
                val['name'],
                val['Email'],
                val['MobilePhone']
              )
            );
          });

          console.log(this.opportunitiesList,"contactdetails");
        }

      } else {

      }

    },
      error => {
        console.log(error)
      });
  }

  fetchWinLossThemes(accountGuid): void {
    let body = {
      "appID": "DA-ACCOUNT-WIN-LOSS-REASONS",
      "AccountGuid": accountGuid
    };

    this.DigitalApiService.commonApi(body).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject) {
          res.ResponseObject.LoseReasons.map(val => {
            this.winLossThemes.losses.push(
              new LossThemesClass(
                val['ReasonName'],
                val['Count']
              )
            );
          });

          res.ResponseObject.WinReasons.map(val => {
            this.winLossThemes.wins.push(
              new WinThemesClass(
                val['ReasonName'],
                val['Count']
              )
            );
          });
          this.winLoss = { ...this.winLossThemes }
          console.log(this.winLossThemes,"winlossdata");
        }

      } else {

      }

    },
      error => {
        console.log(error)
      });
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


  getColorClass(ratio: number): string {
    let color: string;
    let ratio1=Number(ratio)*100;
    if (ratio1 < 25) {
      
      color = 'red-color-progress'
    } else if (ratio1 >= 25 && ratio1 < 50) {
      color = 'orange-color-progress';
    } else if (ratio1 >= 50 && ratio1 < 75) {
      color = 'yellow-color-progress';
    } else {
      color = 'green-color-progress';
    }
    return color;
  }

indexkmasset = 1;
indexkmasset1:any;
indexkmasset2:any;
indexkmasset3:any;
indexkmasset4:any;
indexkmasset5:any;
indexkmasset6:any;

  showMore(indexkmasset) {
    if(indexkmasset == 1)
   this.indexkmasset1 = !this.indexkmasset1;
    else if(indexkmasset == 2)
    {
  this.indexkmasset2 = !this.indexkmasset2;
    }
     else if(indexkmasset == 3)
    {
  this.indexkmasset3 = !this.indexkmasset3;
    }
     else if(indexkmasset == 4)
    {
  this.indexkmasset4 = !this.indexkmasset4;
    }
      else if(indexkmasset == 5)
    {
  this.indexkmasset5 = !this.indexkmasset5;
    }
    else
    {
 this.indexkmasset6 = !this.indexkmasset6;
    }
  }
}

export class TopFiveContactsClass {
  constructor(
      public initial: string,
      public name: string,
      public title: string,
      public activityCount: string
  ) { }
}

export class OpportunityListClass {
  constructor(
      public owner: string,
      public name: string,
      public email: string,
      public contact: string
  ) { }
}

export class MeetingDetailsList {
  constructor(
      public name: string,
      public subject: string,
      public createdOn: string,
      public summary: string,
      public meetingID:string
  ) { }
}

export class WinLossRatioList {
  public ratioList: { label:string,type: string, name: string, ratio: number, colorClass: string,progressBarValue:number; }[];
  constructor() {
      this.ratioList = [];
  }
  public addRatio(ratioObj: {label:string,type: string, name: string, ratio: number, colorClass: string,progressBarValue:number; }): void {
      this.ratioList.push(ratioObj);
  }
}


export class WinThemesClass {
  constructor(
      //public opportunity: string,
      public reason: string,
      public count: string
  ) { }
}

export class LossThemesClass {
  constructor(
      //public opportunity: string,
      public reason: string,
      public count: string
  ) { }
}
