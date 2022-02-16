import { Component, OnInit, EventEmitter, Output , Input, OnChanges} from '@angular/core';

@Component({
  selector: 'app-news-widget',
  templateUrl: './news-widget.component.html',
  styleUrls: ['./news-widget.component.scss']
})
export class NewsWidgetComponent implements OnInit,OnChanges  {
  newsWidget =[];
  constructor() { }
  @Input() received : any;
  ngOnInit() {
    console.log(" received",this.received);
    this.received.forEach(element => {
      if(element != ''){
        this.newsWidget.push({'title': element.Title , 'content': element.Content , 'linkTxt' : element.ReferenceUrl ,'date':'', 'time':''})
      }
    });
  }

  @Output() closeNews = new EventEmitter();
  @Input() innerScroll:any;
  setInnerScroll:any;
//   newsWidget = [
//      {
//       title:'Wipro Q1FY20 preview: Analysts see  modest revenue growth, EBIT margin dip ',
//       content:`Wipro, India’s fourth largest software company, is
//       scheduled to release its April - June 2019 quarter
//       results (Q1FY20) on July 17 and analysts expect a
//       moderate revenue growth along with a fall in the
//       earnings before interest and taxes (EBIT) margin. The
//       company had reported a net profit of Rs 2,099 crore
//       during Q1FY19, with a gross revenue of Rs 13,980
//       crore. It had given a revenue`,
//       linkTxt:'Apple launches new MBP 2019',
//       date:'5:23PM',
//       time:'2nd March 2019'
//   },
//   {
//     title:'Wipro Q1FY20 preview: Analysts see  modest revenue growth, EBIT margin dip ',
//     content:`Wipro, India’s fourth largest software company, is
//     scheduled to release its April - June 2019 quarter
//     results (Q1FY20) on July 17 and analysts expect a
//     moderate revenue growth along with a fall in the
//     earnings before interest and taxes (EBIT) margin. The
//     company had reported a net profit of Rs 2,099 crore
//     during Q1FY19, with a gross revenue of Rs 13,980
//     crore. It had given a revenue`,
//     linkTxt:'Apple launches new MBP 2019',
//     date:'5:23PM',
//     time:'2nd March 2019'
// }
// ]

hideNewsWidget(){
    this.closeNews.emit()
}

ngOnChanges() {
       this.setInnerScroll = this.innerScroll;  
}

}
