import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-system-checks',
  templateUrl: './system-checks.component.html',
  styleUrls: ['./system-checks.component.scss']
})
export class SystemChecksComponent implements OnInit {

  constructor() { }
  systemchecks = [
    {
      "question":"Is document in line with MSA or overarching agreement?",
      "crm":"PO",
      "msa":"SOW",
      "practice":"PO",
      "status":"true",
      "document":true,
      "doc":"MSA_CRM.xsl",
      "comment":false
    },
    {
      "question":"Is the document, the final irrevocable document?",
      "crm":"PO",
      "contract":"SOW",
      "status":"true",
      "document":false,
      "comment":false
    },
    {
      "question":"In case of multiple level execution requirement, is it complete?",
      "crm":"5",
      "msa":"4",
      "status":"false",
      "document":false,
      "comment":true
    },
    {
      "question":"POA Holder",
      "crm":"Amlan Roy",
      "contract":"Amlan Roy",
      "status":"true",
      "document":true,
      "doc":"POA_list.xsl",
      "comment":false
    },
    {
      "question":"Document type (SOW / PO / Others)",
      "crm":"PO",
      "contract":"SOW",
      "status":"true",
      "document":false,
      "comment":false
    },
    {
      "question":"Pricing type",
      "crm":"T&M",
      "contract":"FPP",
      "status":"false",
      "document":false,
      "comment":true
    },

    {
      "question":"Currency",
      "crm":"USD",
      "contract":"USD",
      "status":"true",
      "document":false,
      "comment":false
    },

    {
      "question":"Total Contract Value - TCV",
      "crm":"$ 40,000,000",
      "contract":"$ 38,000,000",
      "status":"false",
      "document":false,
      "comment":true
    },
    
    {
      "question":"Total Product Value - TPV",
      "crm":"$ 50,000,000",
      "contract":"$ 50,000,000",
      "status":"true",
      "document":false,
      "comment":false
    },

    {
      "question":"Total Service Value - TSV",
      "crm":"$ 30,000,000",
      "contract":"$ 21,000,000",
      "status":"false",
      "document":false,
      "comment":true
    },
  ]
  ngOnInit() {
  }
    // <!-- message popover satrts here -->
    clickmes=false;
    toggleComment(){
      // this.index++;
      // console.log(this.index);
    this.clickmes=!this.clickmes;
    // document.getElementsByClassName('popover')[index].classList.toggle('active');
    // document.getElementsByClassName('button-plus')[index].classList.toggle('active');
    }
    // <!-- message popover ends here -->
}
