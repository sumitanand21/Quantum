import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService } from '@app/core/services/global.service';
import { OrderService, OpportunitiesService } from '@app/core';

@Component({
    selector: 'app-tree-view',
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss']
  })

  export class TreeviewComponent implements OnInit {
    tree_data = [];

    constructor(public router: Router, public service: DataCommunicationService,  public OrderserviceLine: OrderService, public projectService: OpportunitiesService) {
   
      this.tree_data = [
        {
          OrderId: "4fa7080f-ca09-ea11-a83c-000d3aa058cb",
          OrderNumber: "20100189",
          OverallOBTCV: 40000,
      },
      {
        OrderId: "4fa7080f-ca09-ea11-a83c-000d3aa058cb-1",
        OrderNumber: "20100189",
        OverallOBTCV: 40000,
      },
      {
        OrderId: "4fa7080f-ca09-ea11-a83c-000d3aa058cb-2",
        OrderNumber: "20100189",
        OverallOBTCV: 40000,
      },
      ]
    }
    ngOnInit() {}
   
  }