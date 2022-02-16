import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-exising-deals-selector',
  templateUrl: './exising-deals-selector.component.html',
  styleUrls: ['./exising-deals-selector.component.scss']
})
export class ExisingDealsSelectorComponent implements OnInit {

  constructor() { }
  stepper = [
    {
      id: 1,
      icon: 'mdi-clock-outline',
      expDetails: [
        { label: 'Event', content: 'Deal assigned' },
        { label: 'Date', content: '24/07/2019' },
        { label: 'Created by', content: 'Ranjit Ravi' },
        { label: 'Assigned to', content: 'Deepak Shetty' },
        { label: 'Comments', content: 'Lorem ipsum dolor sit amet' }
      ]
    },
    {
      id: 2,
      icon: 'mdi-check',
      expDetails: [
        { label: 'Event', content: 'Deal created' },
        { label: 'Date', content: '24/07/2019' },
        { label: 'Created by', content: 'Ranjit Ravi' },
        { label: 'Assigned to', content: 'Deepak Shetty' },
        { label: 'Comments', content: '-' }
      ]
    },
    {
      id: 3,
      icon: 'mdi-check',
      expDetails: [
        { label: 'Event', content: 'Opportunity tagged' },
        { label: 'Date', content: '24/07/2019' },
        { label: 'Created by', content: 'Ranjit Ravi' },
        { label: 'Assigned to', content: 'Deepak Shetty' },
        { label: 'Comments', content: '-' }
      ]
    },
    {
      id: 4,
      icon: 'mdi-check',
      expDetails: [
        { label: 'Event', content: 'Deal assigned' },
        { label: 'Date', content: '24/07/2019' },
        { label: 'Created by', content: 'Ranjit Ravi' },
        { label: 'Assigned to', content: 'Deepak Shetty' },
        { label: 'Comments', content: '-' }
      ]
    },
    {
      id: 5,
      icon: 'mdi-check',
      expDetails: [
        { label: 'Event', content: 'Deal created' },
        { label: 'Date', content: '24/07/2019' },
        { label: 'Created by', content: 'Ranjit Ravi' },
        { label: 'Assigned to', content: 'Deepak Shetty' },
        { label: 'Comments', content: '-' }
      ]
    }

  ];


  ngOnInit() {
    var y = 80;
    var x = window.innerWidth;
    document.getElementsByClassName('expand-table-panel')[0]['style'].width = (x - y) + 'px';
    var i=0;
    i++; 
    document.getElementsByClassName('expand-table-panel')[i]['style'].width = (x - y) + 'px';
  }

}
