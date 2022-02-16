import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-sitemap',
  templateUrl: './order-sitemap.component.html',
  styleUrls: ['./order-sitemap.component.scss']
})
export class OrderSitemapComponent implements OnInit {

  constructor(public router: Router, public service: DataCommunicationService) { }

  process_table = [
    { processstep: '1', processname: 'Opportunity Forecast', processvalue: 'Not Available', remarks: 'Not Available', status: 'Active' },
    { processstep: '2', processname: 'Opportunity At Risk', processvalue: 'Not At Risk', remarks: 'Opportunity Forecast <Unspecified> Opportunity at Ri…', status: 'Non Active' },
    { processstep: '3', processname: 'Opportunity Status', processvalue: 'Won', remarks: 'Won', status: 'Non Active' },
    { processstep: '4', processname: 'Order Value', processvalue: 'USD Dollar 95943', remarks: 'Order value = Sum of Non Overlap Serviceline Fina…', status: 'Non Active' },
    { processstep: '5', processname: 'Service line- Projection', processvalue: 'USD Dollar 95943', remarks: 'Service line Finance Year Wise Projections Not Ava…', status: 'Non Active' },
    { processstep: '6', processname: 'Alliance - Projections', processvalue: 'Non Alliance Projections', remarks: 'Alliance- Finance year Projection Not Available. Plea…', status: 'Non Active' },
    { processstep: '7', processname: 'GPT- Projections', processvalue: 'No Large Deal Member Projections', remarks: 'Large Deal Members - Finance Year Projections N…', status: 'Non Active' },
    { processstep: '8', processname: 'BFM - Approval', processvalue: 'Approved by BFM', remarks: 'Large Deal Members - Finance Year Projections N…', status: 'Non Active' }
  ]

  ngOnInit() {
  }
  goBack(){
    window.history.back();
  }
}
