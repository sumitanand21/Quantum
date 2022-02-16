import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog } from '@angular/material';

import { Observable } from 'rxjs';
import { DataCommunicationService } from '@app/core';
import { dealService } from '@app/core/services/deals.service';
import { EncrDecrService } from '@app/core/services/encr-decr.service';

@Component({
  selector: 'app-deal-team',
  templateUrl: './deal-team.component.html',
  styleUrls: ['./deal-team.component.scss']
})
export class DealTeamComponent implements OnInit {
  TeamsTable = [];
  constructor(public router: Router,
    public service: DataCommunicationService,
    public dialog: MatDialog,
    private EncrDecr: EncrDecrService,
    public dealTeam: dealService) { }

  ngOnInit() {
    var orginalArray = this.dealTeam.getTeamDealData();
    orginalArray.subscribe((x: any[]) => {
      this.TeamsTable = x;
      console.log(x)

    });
  }
  wiproContact: {}[] = [
    { id: 0, name: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { id: 1, name: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { id: 2, name: 'Anubhav Jain', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { id: 3, name: 'Kanika Tuteja', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]

  wiproContact1: {}[] = [
    { index: 0, name: 'option 1', designation: 'Pre Sales Head', initials: 'AJ', value: true },
    { index: 1, name: 'option 2', designation: 'Pre Sales Head', initials: 'KT', value: false },
    { index: 2, name: 'option 3', designation: 'Pre Sales Head', initials: 'AJ', value: false },
    { index: 3, name: 'option 1', designation: 'Pre Sales Head', initials: 'KT', value: false },
  ]
  wiproContact2: {}[] = [
    { id: 0, name: 'abc' },
    { id: 1, name: 'efg' },
    { id: 2, name: 'Abdjkd' },
    { id: 3, name: 'Ksasbcbd' },
  ]
  type: {}[] = [
    { id: 0, name: 'Deal' },
    { id: 1, name: 'Module 1' },
    { id: 2, name: 'Deal 2' },
    { id: 3, name: 'Deal 3' },
  ]
  configData = {
    name: "Accounts",
    recordsCount: 5,
    Username: [],
    Role: this.wiproContact2,
    Type: this.type,

    Geo: [],
    SAPcustomername: this.wiproContact
  };
  performTableChildAction(childActionRecieved): Observable<any> {
    var actionRequired = childActionRecieved;
    console.log(actionRequired);
    // let obj = { 'route_from': '', 'Id': actionRequired.objectRowData[0].id }
    // localStorage.setItem('routeParams', this.EncrDecr.set('EncryptionEncryptionEncryptionEn', JSON.stringify(obj), 'DecryptionDecrip'))

    switch (actionRequired.action) {

      case 'Name': {

        this.router.navigate(['/accounts/accountdetails']);
        return;
      }
      case 'view modification': {
        this.router.navigate(['/accounts/viewmodificationdetails']);
        return;
      }
      case 'view':
        {
          this.router.navigate(['/accounts/reviewnewaccount']);
          return;
        }
      case 'review':
        {
          this.router.navigate(['/accounts/reviewnewaccount']);
          return;
        }
      case 'editdraft':
        {
          this.router.navigate(['/accounts/createnewaccount']);
          return;
        }
      case 'Username':
        {

          this.configData.Username = this.wiproContact;
          return;
        }
      case 'Geo':
        {
          this.configData.Geo = this.wiproContact1;
          return;
        }
      case 'addNewRow':
        {

          let newData = {
            "id": this.TeamsTable.length + 1,
            "Role": {
              "id": actionRequired.objectRowData.Role.id,
              "name": actionRequired.objectRowData.Role.name
            },
            "Type": {
              "id": actionRequired.objectRowData.Type.id,
              "name": actionRequired.objectRowData.Type.name
            },
            "Username": {
              "id": actionRequired.objectRowData.Username.id,
              "name": actionRequired.objectRowData.Username.name,
              "designation": actionRequired.objectRowData.Username.designation
            }
          };

          this.dealTeam.updateRecords(newData).subscribe(x => {
            var orginalArray = this.dealTeam.getTeamDealData();
            orginalArray.subscribe((x: any[]) => {
              this.TeamsTable = x;

            });
          })
          // console.log('row in parent  ' + JSON.stringify(actionRequired))

          return;
        }
      case 'update':
        {
          console.log(actionRequired.objectRowData)
          let newData = {
            "id": actionRequired.objectRowData.id,
            "Username": actionRequired.objectRowData.Username,
            "Role": actionRequired.objectRowData.Role,
            "Type": actionRequired.objectRowData.Type,
            "SAPcustomercode": actionRequired.objectRowData.SAPcustomercode,
            "SAPcustomername": actionRequired.objectRowData.SAPcustomername,
            "Geo": actionRequired.objectRowData.Geo,
            "Delivery": actionRequired.objectRowData.Delivery ? false : actionRequired.objectRowData.Delivery,
            "stageObject": typeof actionRequired.objectRowData.SAPcustomername == "object" ? true : false,
            "performanceDetails": [
              {
                "quartername": "Q1",
                "quarterTGT": "0.25",
                "quarterACH": "0.11",
                "quarterFlag": false
              },
              {
                "quartername": "Q2",
                "quarterTGT": "0.25",
                "quarterACH": "0.11",
                "quarterFlag": false
              },
              {
                "quartername": "Q3",
                "quarterTGT": "0.25",
                "quarterACH": "0.11",
                "quarterFlag": false
              },
              {
                "quartername": "Q4",
                "quarterTGT": "0.25",
                "quarterACH": "0.30",
                "quarterFlag": true
              },
              {
                "quartername": "TOTAL",
                "quarterTGT": "0.25",
                "quarterACH": "0.11",
                "quarterFlag": false
              }
            ]

          };
          this.dealTeam.deleteRecords(actionRequired.objectRowData.id).subscribe(x => {

            this.dealTeam.updateRecords(actionRequired.objectRowData).subscribe(x => {
              var orginalArray = this.dealTeam.getTeamDealData();
              orginalArray.subscribe((x: any[]) => {
                this.TeamsTable = x;

              });
            })

          })


        }

    }
  }

}
