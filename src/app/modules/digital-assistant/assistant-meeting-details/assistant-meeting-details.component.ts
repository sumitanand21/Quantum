import { Component, OnInit } from '@angular/core';
import { DigitalApiService } from '../services/digital-api.service';
import { AssistantGlobalService } from '../services/assistant-global.service';
export class MeetingDetailsPageClass {
  constructor(
      public contactId: string,
      public initials: string,
      public name: string,
      public JobTitle: string,
      public relationshipScore: string,
      public winPercent: number,
      public colorName: any
  ) { }
}
@Component({
  selector: 'app-assistant-meeting-details',
  templateUrl: './assistant-meeting-details.component.html',
  styleUrls: ['./assistant-meeting-details.component.scss']
})
export class AssistantMeetingDetailsComponent implements OnInit {
  public topFiveContacts: MeetingDetailsPageClass[] = [];
  topContactsClass: string[] = [
    "circle-darkBlue",
    "circle-darkPink",
    "circle-darkYellow",
    "circle-lightBlue",
    "circle-lightGreen"
  ];
  accountId: string = '';
  constructor(public assistantGlobalService: AssistantGlobalService, private DigitalApiService: DigitalApiService) { }

  ngOnInit() {
    this.assistantGlobalService.getMeetingDetails().subscribe(res=>{
      // alert("")
      this.topFiveContacts = []
      console.log("DAMeeting", res)
      if(res){
        this.fetchTopFiveContacts(res.meetingId)
        this.accountId= res.accountId
      }
    })
  }

  fetchTopFiveContacts(meetingGuid: string): void {
    // this.assistantGlobalService.clearMeetingDetails()
    let body = {
      "appID": "DA-APPOINTMENTCONTACTS-OPP-WINLOSS-COUNT",
      "AppointmentGuid": meetingGuid
    };

    this.DigitalApiService.commonApi(body).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject && res.ResponseObject.AppointmentContact) {
          this.fetchRelationshipScore(res.ResponseObject.AppointmentContact);
        }
      } else {

      }
    },
      error => {
        console.log(error)
      });
  }


  fetchRelationshipScore(data: any) {
    let temp = [];
    data.map(val => {
      temp.push(val['_wipro_contact_value'])
    });

    let body = {
      "AccountGuid":  this.accountId,
      "ContactGuids": temp.join(',')
    }
    this.DigitalApiService.fetchRelScore(body).subscribe(res => {
      console.log(res);
      if (!res.IsError) {
        if (res.ResponseObject) {
          data.map(val => {
            let relScrVal = res.ResponseObject.filter(relScr => relScr.ContactId == val['_wipro_contact_value']);
            this.topFiveContacts.push(
              new MeetingDetailsPageClass(
                val['_wipro_contact_value'],
                this.fetchInitial(val['_wipro_contact_value@OData.Community.Display.V1.FormattedValue']),
                val['_wipro_contact_value@OData.Community.Display.V1.FormattedValue'],
                val['ab.jobtitle'] ? val['ab.jobtitle'] : '',
                relScrVal[0] ? relScrVal[0].Score : 'N.A',
                this.fetchWinPercent(val['OpportunityStatus']),
                this.topContactsClass[Math.floor(Math.random() * this.topContactsClass.length)]
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

  fetchWinPercent(data: any): number {
    let totalSum = 0;
    let winCount = 0;
    data.map(res => {
      totalSum += res.OppCount;
      if (res['status@OData.Community.Display.V1.FormattedValue'] == "Won") {
        winCount = res.OppCount;
      }
    });
    return (winCount / totalSum) * 100;
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

  randomColor() {
    return this.topContactsClass[Math.floor(Math.random() * this.topContactsClass.length)]
  }

}
