import { Component, OnInit   } from '@angular/core';

@Component({
  selector: 'app-tagged-deals-selector',
  templateUrl: './tagged-deals-selector.component.html',
  styleUrls: ['./tagged-deals-selector.component.scss']
})
export class TaggedDealsSelectorComponent implements OnInit {

  constructor() { }
  stepper = [
    {
      id: 1,
      icon: 'mdi-clock-outline',
      expDetails: [
        { label: 'Event', content: 'Opportunity assigned' },
        { label: 'Date', content: '24/07/2019' },
        { label: 'Created by', content: 'Ranjit Ravi' },
        { label: 'Assigned to', content: 'Deepak Shetty' },
        { label: 'Comments', content: '-' }
      ]
    },
    {
      id: 2,
      icon: 'mdi-check',
      expDetails: [
        { label: 'Event', content: 'Opportunity assigned' },
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
        { label: 'Event', content: 'Opportunity assigned' },
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
        { label: 'Event', content: 'Opportunity assigned' },
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
        { label: 'Event', content: 'Opportunity assigned' },
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
