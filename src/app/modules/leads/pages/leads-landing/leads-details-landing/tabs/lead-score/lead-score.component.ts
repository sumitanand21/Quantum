import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
@Component({
  selector: 'app-lead-score',
  templateUrl: './lead-score.component.html',
  styleUrls: ['./lead-score.component.scss']
})
export class LeadScoreComponent implements OnInit {
  constructor(public service : DataCommunicationService) { }
  ngOnInit() {
  }
  parameterCard: {}[] = [
    {
      head: "01 Past account interactions",
      overall: '6/10',
      content: [
        { key: 'No. of Account Interactions', value: '12' },
        { key: 'No.of Wins', value: '10' },
        { key: 'Win%', value: '70%' },
        { key: 'No. of Loss', value: '20' },
      ]
    },
    {
      head: "02 Conversations",
      overall: '8/10',
      content: [
        { key: 'Number of conversation on current Lead', value: '12' },
      ]
    },
    {
      head: "03 Emails",
      overall: '7/10',
      content: [
        { key: 'Sentiment analysis on emails.', value: '60' },
      ]
    },
    {
      head: "04 Contacts Involved",
      overall: '6/10',
      content: [
        { key: 'Key Decision makers', value: '02' },
        { key: 'Primary contacts', value: '02' },
        { key: 'RS score in the deal', value: '50' },
      ]
    },
    {
      head: "05 Firmographics",
      overall: '7/10',
      content: [
        { key: 'Revenue last year', value: '$ 1M' },
        { key: 'Profit last year', value: '80%' },
        { key: 'Solution win% on similar organizations (SIC based)', value: '$ 20M' },
        { key: 'Wipro Revenue', value: '$ 20M' },
        { key: 'Credit Rating', value: '7' },
      ]
    },
    {
      head: "06 Other scores  ",
      overall: '6/10',
      content: [
        { key: 'CSAT Score', value: '40' },
        { key: 'PDD Score', value: '50' },
        { key: 'DSO', value: '60' },
      ]
    },
  ]
}
