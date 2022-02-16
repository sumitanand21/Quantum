import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataCommunicationService, OpportunitiesService } from '@app/core';
import { environment as env } from '@env/environment';
// const toolkitUrl = env.toolkitUrl;
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { EnvService } from '@app/core/services/env.service';

@Component({
  selector: 'app-opportunity-insight',
  templateUrl: './opportunity-insight.component.html',
  styleUrls: ['./opportunity-insight.component.scss']
})
export class OpportunityInsightComponent implements OnInit {

  //HTML Panel Control Variables
  panelOpenState: boolean;
  panelOpenState1: boolean;
  panelOpenState2: boolean;
  panelOpenState3: boolean;
  panelOpenState4: boolean;
  panelOpenState5: boolean;
  panelOpenState6: boolean;
  panelOpenState7: boolean;
  panelOpenState8: boolean;
  panelOpenState9: boolean;
  panelOpenState10: boolean;
  panelOpenState11: boolean;
  panelOpenState12: boolean;
  panelOpenState13: boolean;
  panelOpenState14: boolean;
  panelOpenState15: boolean;

  //variable declaration
  deals = [];
  contact_coordinantion = [];
  solution = [];
  clientSuccess = [];
  caseStudies = [];
  rucArray = [];
  isLoading: boolean = false;
  isLoading2: boolean = false;
  isLoading3: boolean = false;
  isLoading4: boolean = false;
  opportunityId;
  userId;
  statusForLink;
  link;
  disableFields;
  accessData;
  fullAccessFromCreatePage;
  opportunityStatusCheck;
  element;
  sbuId;
  verticalId;
  oppNum;
  loader = true;

  constructor( public envr : EnvService,public router: Router, public service: DataCommunicationService, public projectService: OpportunitiesService, private EncrDecr: EncrDecrService) { }

  ngOnInit() {

    //Initialize the variables/arrays
    this.loader = true;
    this.accessData = this.projectService.getSession('accessData');
    this.fullAccessFromCreatePage = this.projectService.getSession('FullAccess');
    this.opportunityStatusCheck = this.projectService.getSession('opportunityStatus');
    this.oppNum = this.projectService.getSession('opportunityNumberValue');
    console.log("Opp Num", this.oppNum);
    this.sbuId = this.projectService.getSession('sbuId');
    this.verticalId = this.projectService.getSession('verticalId');

    this.userId = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip');
    this.opportunityId = this.projectService.getSession("opportunityId");
    this.statusForLink = "0";
    console.log("this.oppor id: ", this.opportunityId);
    console.log("this.user id: ", this.userId);

    this.contact_coordinantion = [{
      "Name": null,
      "OwnerName": null,
      "EmailID": null
    }];
    this.solution = [{
      "SolutionName": null,
      "SolutionUrl": null,
      "SolutionId": null
    }];
    this.clientSuccess = [{
      "DocumentName": null,
      "DocumentUrl": null,
      "ClientSuccessStoryId": null
    }];
    this.caseStudies = [{
      "DocumentName": null,
      "DocumentUrl": null,
    }];
    this.rucArray = [{
      "DocumentName": null,
      "DocumentUrl": null,
    }];
    this.deals = [{
      "AccountId": null,
      "AccountIdName": null,
      "AccountOwnerId": null,
      "AccountIdOwnerName": null,
      "OwnerId": null,
      "OwnerIdName": null,
      "TCV": null,
      "TCVCurrency": null,
      "OpportunityNumber": null,
      "ScopeOfWork": null,
      "WiproCurrencyID": null,
      "WiproCurrencyIDName": null,
      "WiproOpportunityId": null,
      "ParentAccountOwner": null,
      "ParentAccountOwnerID": null,
      "ParentAccountID": null,
      "OpportunityName": null,
      "OwnerEmailId": null,
    }];
    this.colleguesExecuitingSimilarDeals = [{
      "AccountId": null,
      "AccountIdName": null,
      "AccountOwnerId": null,
      "AccountIdOwnerName": null,
      "OwnerId": null,
      "OwnerIdName": null,
      "TCV": null,
      "TCVCurrency": null,
      "OpportunityNumber": null,
      "ScopeOfWork": null,
      "WiproCurrencyID": null,
      "WiproCurrencyIDName": null,
      "WiproOpportunityId": null,
      "ParentAccountOwner": null,
      "ParentAccountOwnerID": null,
      "ParentAccountID": null,
      "OpportunityName": null,
      "OwnerEmailId": null,
    }];

    //get the required access based on permission. 
    if (this.opportunityStatusCheck == 1) {

      if (this.fullAccessFromCreatePage == true) {
        this.disableFields = false;
      }
      else {
        this.disableFields = true;
      }
    }
    else {
      this.disableFields = true;
    }

    // Fetching data for each panel for the given opportunity
    if (this.opportunityId) {
      this.getSolutionOwnerContact();
      this.getServiceLineDetails();
      this.getSolutionInfo();
      this.getClientSuccessInfo();
      this.getRUCInfo();
      this.getCaseStudiesInfo();
    }

    //Link for account relationship status panel | toolkit url based on the environment it's executed- qa/dev/puat
    this.link = this.envr.toolkitUrl + "RevenueStorm/Pages/OpportunityScoreCard.aspx?id=" + this.opportunityId + "&ptype=1&status=" + this.statusForLink + "&userid=" + this.userId;
    console.log("this.link: " + this.link);
    this.element = document.getElementById("iframe");
    this.element.src = this.link;
    //Format: link = " https://rsappsdev.wipro.com/RevenueStorm/Pages/OpportunityScoreCard.aspx?id=E085600A-A898-E911-A834-000D3AA058CB&ptype=1&status=0&userid=A134ECEC-0161-E911-A830-000D3AA058CB "

    setTimeout(() => {    //<<<---    using ()=> syntax
      console.log("time out");
      this.loader = false;
    }, 600);
  }

  //Fetch data for Based on Account section
  rucinfo;
  flag2 = 0;
  getRUCInfo() {
    console.log("Get RUC");
    this.isLoading2 = true;
    this.rucArray = [];
    this.projectService.getRUCInsights(this.oppNum).subscribe(res => {
      if (res.IsError == false) {
        this.rucinfo = res;
        this.isLoading2 = false;
        if (this.rucinfo.ResponseObject.length > 0) {
          console.log(this.rucinfo.ResponseObject);
          this.rucArray = this.rucinfo.ResponseObject;
          console.log("this.rucinfo: ", this.rucArray);
        }
        else {
          this.rucArray.push({  //push null if response object is empty
            "DocumentName": "-",
            "DocumentUrl": "-",
          });
          this.flag2 = 1;
        }
        
      }
      else {
        this.rucArray.push({  //push null if response object is empty
          "DocumentName": "-",
          "DocumentUrl": "-",
        });
        this.isLoading2 = false;
        this.flag2 = 1;
      }

    },
      err => {
        this.isLoading2 = false;
        this.projectService.displayerror(err.status);
      }
    );
  }

  //Fetch data for Case Studies section
  flag3 = 0;
  casestudy;
  getCaseStudiesInfo() {
    console.log("Get Case Study Success");
    this.caseStudies = [];
    this.isLoading3 = true;
    this.projectService.getCaseStudies(this.oppNum).subscribe(res => {
      if (res.IsError == false) {
        this.casestudy = res;
        this.isLoading3 = false;
        if (this.casestudy.ResponseObject.length > 0) {
          console.log(this.casestudy.ResponseObject);
          this.caseStudies = this.casestudy.ResponseObject;
          console.log("this.casestudy: ", this.caseStudies);
        }
        else {
          this.caseStudies.push({  //push null if response object is empty
            "DocumentName": "-",
            "DocumentUrl": "-",
          });
          this.flag3 = 1;
        }

      }
      else {
        this.caseStudies.push({  //push null if response object is empty
          "DocumentName": "-",
          "DocumentUrl": "-",
        });
        this.isLoading3 = false;
        this.flag3 = 1;
      }
    },
      err => {
        this.isLoading3 = false;
        this.projectService.displayerror(err.status);
      }
    );
  }


  //Fetch data for Customer Success Stories section
  flag4 = 0;
  clientinfo;
  getClientSuccessInfo() {
    console.log("Get Client Success");
    this.isLoading4 = true;
    this.clientSuccess = [];
    this.projectService.getClientSuccess(this.oppNum).subscribe(res => {
      if (res.IsError == false) {
        this.clientinfo = res;
        this.isLoading4 = false;
        if (this.clientinfo.ResponseObject.length > 0) {
          console.log(this.clientinfo.ResponseObject);
          this.clientSuccess = this.clientinfo.ResponseObject;
          console.log("this.clientsuccess: ", this.clientSuccess);
        }
        else {
          this.clientSuccess.push({  //push null if response object is empty
            "DocumentName": "-",
            "DocumentUrl": "-",
            "ClientSuccessStoryId": "-"
          });
          this.flag4 = 1;
        }

      }
      else {
        this.clientSuccess.push({  //push null if response object is empty
          "DocumentName": "-",
          "DocumentUrl": "-",
          "ClientSuccessStoryId": "-"
        });
        this.isLoading4 = false;
        this.flag4 = 1;
      }
    },
      err => {
        this.isLoading4 = false;
        this.projectService.displayerror(err.status);
      }
    );
  }

  //Fetch data for Based on Solution section
  flag1 = 0;
  solutionInfo;
  getSolutionInfo() {
    this.isLoading = true;
    console.log("Get Solution");
    this.solution = [];
    this.projectService.getSolutionInsight(this.oppNum).subscribe(res => {
      if (res.IsError == false) {
        this.solutionInfo = res;
        this.isLoading = false;
        if (this.solutionInfo.ResponseObject.length > 0) {
          console.log(this.solutionInfo.ResponseObject);
          this.solution = this.solutionInfo.ResponseObject;
          console.log("this.solution: ", this.solution);
        }
        else {
          this.solution.push({  //push null if response object is empty
            "SolutionName": "-",
            "SolutionUrl": "-",
            "SolutionId": "-"
          });
          this.flag1 = 1;
        }
      
      }
      else {
        this.solution.push({  //push null if response object is empty
          "SolutionName": "-",
          "SolutionUrl": "-",
          "SolutionId": "-"
        });
        this.flag1 = 1;
        this.isLoading = false;
      }
    },
      err => {
        this.isLoading = false;
        this.projectService.displayerror(err.status);
      }
    );
  }


  //Fetch data for Solution Owner Contact Coordination section
  solutionOwnerContactInfo;
  getSolutionOwnerContact() {
    this.contact_coordinantion = [];
    this.service.getSolutionOwnerContact(this.opportunityId).subscribe(res => {
      this.solutionOwnerContactInfo = res;
      if (this.solutionOwnerContactInfo.ResponseObject.length > 0) {
        console.log(this.solutionOwnerContactInfo.ResponseObject);
        this.contact_coordinantion = this.solutionOwnerContactInfo.ResponseObject;
        console.log("this.contact_coordinantion: ", this.contact_coordinantion);
      }
      else {
        this.contact_coordinantion.push({  //push null if response object is empty
          "Name": null,
          "OwnerName": null,
          "EmailID": null
        });
      }

    },
      err => {
        this.projectService.displayerror(err.status);
      }
    );
  }

  //Fetch data for Similar opportunities executed in wipro/Colleagues executing similar opportunities section (based on opp status)
  dealResponse;
  colleguesExecuitingSimilarDeals = [];
  getOppInsight() {
    this.deals = [];
    this.colleguesExecuitingSimilarDeals = [];
    this.service.getoppInsight(this.opportunityId, this.WiproBusinessSolutionDtls, this.WiproServiceLineDtls, this.verticalId, this.sbuId).subscribe(res => {

      this.dealResponse = res;
      debugger;
      if (this.dealResponse.ResponseObject.length > 0) {
        console.log("opp Insights: ", this.dealResponse.ResponseObject);

        for (var i = 0; i < this.dealResponse.ResponseObject.length; i++) {
          if (this.dealResponse.ResponseObject[i].StateCode == 1) { // won | display in Similar opportunities executed in wipro section
            this.dealResponse.ResponseObject[i].TCVCurrency = this.spaceCurrency(this.dealResponse.ResponseObject[i].TCVCurrency); //format TCV
            this.deals.push(this.dealResponse.ResponseObject[i]);
          }
          if (this.dealResponse.ResponseObject[i].StateCode == 0) { //open | display in Colleagues executing similar opportunities section
            this.dealResponse.ResponseObject[i].TCVCurrency = this.spaceCurrency(this.dealResponse.ResponseObject[i].TCVCurrency); //format TCV
            this.colleguesExecuitingSimilarDeals.push(this.dealResponse.ResponseObject[i]);
          }
        }
        if (this.deals.length == 0) {    //push null if response object is empty
          this.deals.push({
            "AccountId": null,
            "AccountIdName": null,
            "AccountOwnerId": null,
            "AccountIdOwnerName": null,
            "OwnerId": null,
            "OwnerIdName": null,
            "TCV": null,
            "TCVCurrency": null,
            "OpportunityNumber": null,
            "ScopeOfWork": null,
            "WiproCurrencyID": null,
            "WiproCurrencyIDName": null,
            "WiproOpportunityId": null,
            "ParentAccountOwner": null,
            "ParentAccountOwnerID": null,
            "ParentAccountID": null,
            "OpportunityName": null,
            "OwnerEmailId": null,
          })
        }

        if (this.colleguesExecuitingSimilarDeals.length == 0) {     //push null if response object is empty
          this.colleguesExecuitingSimilarDeals.push({
            "AccountId": null,
            "AccountIdName": null,
            "AccountOwnerId": null,
            "AccountIdOwnerName": null,
            "OwnerId": null,
            "OwnerIdName": null,
            "TCV": null,
            "TCVCurrency": null,
            "OpportunityNumber": null,
            "ScopeOfWork": null,
            "WiproCurrencyID": null,
            "WiproCurrencyIDName": null,
            "WiproOpportunityId": null,
            "ParentAccountOwner": null,
            "ParentAccountOwnerID": null,
            "ParentAccountID": null,
            "OpportunityName": null,
            "OwnerEmailId": null,
          })

        }
      }
      if (this.deals.length == 0) {  //push null if response object is empty
        this.deals.push({
          "AccountId": null,
          "AccountIdName": null,
          "AccountOwnerId": null,
          "AccountIdOwnerName": null,
          "OwnerId": null,
          "OwnerIdName": null,
          "TCV": null,
          "TCVCurrency": null,
          "OpportunityNumber": null,
          "ScopeOfWork": null,
          "WiproCurrencyID": null,
          "WiproCurrencyIDName": null,
          "WiproOpportunityId": null,
          "ParentAccountOwner": null,
          "ParentAccountOwnerID": null,
          "ParentAccountID": null,
          "OpportunityName": null,
          "OwnerEmailId": null,
        })
      }

      if (this.colleguesExecuitingSimilarDeals.length == 0) {  //push null if response object is empty
        this.colleguesExecuitingSimilarDeals.push({
          "AccountId": null,
          "AccountIdName": null,
          "AccountOwnerId": null,
          "AccountIdOwnerName": null,
          "OwnerId": null,
          "OwnerIdName": null,
          "TCV": null,
          "TCVCurrency": null,
          "OpportunityNumber": null,
          "ScopeOfWork": null,
          "WiproCurrencyID": null,
          "WiproCurrencyIDName": null,
          "WiproOpportunityId": null,
          "ParentAccountOwner": null,
          "ParentAccountOwnerID": null,
          "ParentAccountID": null,
          "OpportunityName": null,
          "OwnerEmailId": null,
        })
      }
      console.log("this.deals: ", this.deals);
      console.log("this.colleguesExecuitingSimilarDeals: ", this.colleguesExecuitingSimilarDeals);
    },
      err => {
        this.projectService.displayerror(err.status);
      }
    );
  }


  businessSolution;
  businessSolDetails;
  WiproBusinessSolutionDtls = [];
  businessSolutionDetails() {     //get business solution details for getOppInsight function() parameter
    console.log("get function");
    this.WiproBusinessSolutionDtls = [];
    this.service.businessSolutionDetails(this.opportunityId).subscribe(res => {
      this.businessSolution = res;
      console.log(this.businessSolution.ResponseObject);
      this.businessSolDetails = this.businessSolution.ResponseObject;
      this.getOppInsight()

      for (var i = 0; i < this.businessSolDetails.length; i++) {

        if (this.businessSolDetails[i].WiproType == 184450001) {
          var obj = {};

          Object.assign(obj, { WiproOpportunitySolutionDetailId: this.businessSolDetails[i].WiproOpportunitySolutionDetailId });
          Object.assign(obj, { WiproServiceType: this.businessSolDetails[i].WiproType });
          console.log("obj :", obj)
          this.WiproBusinessSolutionDtls.push(obj);
          console.log(this.WiproBusinessSolutionDtls);

        }

      }

    },
      err => {
        this.getOppInsight()
        this.projectService.displayerror(err.status);
      }
    );
  }

  serviceLine;
  servicelineDetails;
  WiproServiceLineDtls = [];
  getServiceLineDetails() {    //get service line details for getOppInsight function() parameter
    console.log("get function");
    this.service.getServiceLineDetails(this.opportunityId).subscribe(res => {
      this.serviceLine = res;
      this.WiproServiceLineDtls = [];
      console.log(this.serviceLine.ResponseObject);
      this.servicelineDetails = this.serviceLine.ResponseObject;
      this.businessSolutionDetails()
      for (var i = 0; i < this.servicelineDetails.length; i++) {
        var obj = {};
        Object.assign(obj, { WiproServicelineidValue: this.servicelineDetails[i].WiproServicelineidValue });
        Object.assign(obj, { WiproPracticeId: this.servicelineDetails[i].WiproPracticeId });
        Object.assign(obj, { WiproSubpracticeid: this.servicelineDetails[i].WiproSubpracticeid });
        this.WiproServiceLineDtls.push(obj);
        console.log(this.WiproServiceLineDtls);
      }
    },
      err => {
        this.businessSolutionDetails()
        this.projectService.displayerror(err.status);
      }
    );
  }

  spaceCurrency(p) {     // Formatting currency for TCV value in Similar opportunities executed in wipro section
    var firstDigit = p.match(/\d/);
    var index = p.indexOf(firstDigit);
    var num = [p.split(/(\d+)/)[0].toUpperCase(), " ", p.slice(index)].join('');
    console.log("Space", num);
    return num;
  }

  goBack() {   //Back button navigation
    this.router.navigate(['/opportunity/opportunityview/overview']);
    //window.history.back();
  }


}
