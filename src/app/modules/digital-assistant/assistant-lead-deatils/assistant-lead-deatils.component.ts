import { Component, OnInit, Input } from '@angular/core';
import { DigitalApiService } from '../services/digital-api.service';
import { AssistantGlobalService } from '../services/assistant-global.service';

@Component({
  selector: 'app-assistant-lead-deatils',
  templateUrl: './assistant-lead-deatils.component.html',
  styleUrls: ['./assistant-lead-deatils.component.scss']
})
export class AssistantLeadDeatilsComponent implements OnInit {
  verticalName: string = '';
  public huntingManagerList = [];
  CustomerContactCount = -1;
  public topContactsClass: string[] = [
    "circle-darkBlue",
    "circle-darkPink",
    "circle-darkYellow",
    "circle-lightBlue",
    "circle-lightGreen",
  ];
  @Input() loginUserId: string
  constructor(private DigitalApiService: DigitalApiService, public assistantGlobalService: AssistantGlobalService) { }

  ngOnInit() {
    this.assistantGlobalService.getLeadDetails().subscribe(res=> {
      this.huntingManagerList = [];
      this.CustomerContactCount = -1;
      if(res) {
        this.fetchTopFiveContacts(res)
      }
    })
  }
  fetchTopFiveContacts(info: any): void {
    this.verticalName = info.verticalName ? info.verticalName : ''
    if (info.verticalId !== '') {
      console.log(info);
      let forLeadBody = {
        "VerticalID": info.verticalId,
        "UserGuid": this.loginUserId
      }
      this.DigitalApiService.forLead(forLeadBody).subscribe(res => {
        if (!res.IsError) {
          if (res.ResponseObject.isToShowDA) {
            let body = {
              AccountGuid: info.accountGuid,
              VerticalID: info.verticalId,
            }

            // let body = {
            //   "VerticalID": "62B88F38-266F-E011-BCF9-001A643446E0",
            //   "AccountGuid": "adfcef67-7ba4-e911-a95a-000d3a07c88d",
            //   "appID": "DA-HUNTING-MANAGERS"
            // }

            this.DigitalApiService.GetHuntingManagerList(body).subscribe(res => {
              console.log(res);
              if (!res.IsError) {
                if (res.ResponseObject && res.ResponseObject.HuntingManagerList) {
                  this.CustomerContactCount = res.ResponseObject.CustomerContactCount
                  res.ResponseObject.HuntingManagerList.map(val => {
                    this.huntingManagerList.push({
                      huntingManagerID: val['Guid'],
                      initials: this.fetchInitial(val['Name']),
                      huntingManagerName: val['Name'],
                      JobTitle: val['Designation'] ? val['Designation'] : '',
                      activeAccounts: parseInt(val['HuntingCount']) + parseInt(val['ExistingCount']),
                      reservedCounts: val['ReserveCount'],
                      colorName: this.topContactsClass[Math.floor(Math.random() * this.topContactsClass.length)]
                    }
                    );
                  });
                  console.log(this.huntingManagerList);
                }
              } else {

              }
            },
              error => {
                console.log(error)
              });
          }
        } else {

        }
      })
    }
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
}
