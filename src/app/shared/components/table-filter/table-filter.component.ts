import { DataCommunicationService } from '@app/core/services/global.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-filter',
  templateUrl: './table-filter.component.html',
  styleUrls: ['./table-filter.component.css']
})
export class TableFilterComponent implements OnInit {
  tabNames: any;
  index = 0;
  constructor(public service : DataCommunicationService) {
    this.tabNames = [{
      names: 'Name'
    }, {
      names: 'Owner'
    }, {
      names: 'Account'
    }, {
      names: 'Date created'
    }, {
      names: 'Trail ID'
    }, {
      names: 'Linked leads'
    }, {
      names: 'Linked opportunities'
    }];
  }

  ngOnInit() {
  }


  name = ['Name 1', 'Name 2', 'Name 3', 'Name 4', 'Name 5', 'Name 6', 'Name 7', 'Name 8', 'Name 9', 'Name10'];
  owner = ['Owner name 1', 'Owner name 2', 'owner name 3', 'Owner name 4', 'Owner name 5', 'Owner name 6', 'Owner name 7', 'Owner name 8', 'Owner name 9', 'Owner name 10'];
  account = ['Account name 1', 'Account name 2', 'Account name 3', 'Account name 4', 'Account name 5', 'Account name 6', 'Account name 7', 'Account name 8', 'Account name 9', 'Account name 10'];
  datecreated = ['Date created 1', 'Date created 2', 'Date created 3', 'Date created 4', 'Date created 5', 'Date created 6', 'Date created 7'];
  trailID = ['Trail ID 1', 'Trail ID 2', 'Trail ID 3', 'Trail ID 4', 'Trail ID 5', 'Trail ID 6', 'Trail ID 7', 'Trail ID 8'];
  linkedLeads = ['Lead 1', 'Lead 2', 'Lead 3', 'Lead 4', 'Lead 5', 'Lead 6', 'Lead 7'];
  opportunities = ['Opportunity 1', 'Opportunity 2', 'Opportunity 3', 'Opportunity 4', 'Opportunity 5', 'Opportunity 6', 'Opportunity 7', 'Opportunity 8'];
  source: any = this.name;
  showDetails(names, index) {
    this.index=index;
    console.log(this.index);
    switch (names) {


      case 'Name':
        return this.source = this.name;

      case 'Owner':
        return this.source = this.owner;

      case 'Account':
        return this.source = this.account;

      case 'Date created':
        return this.source = this.datecreated;

      case 'Trail ID':
        return this.source = this.trailID;

      case 'Linked leads':
        return this.source = this.linkedLeads;

      case 'Linked opportunities':
        return this.source = this.opportunities;
    }
  }

}
