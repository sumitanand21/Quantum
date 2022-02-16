import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common'
import { DataCommunicationService, OpportunitiesService } from '@app/core';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-deal-dashboard-report',
  templateUrl: './deal-dashboard-report.component.html',
  styleUrls: ['./deal-dashboard-report.component.scss']
})
export class DealDashboardReportComponent implements OnInit {
  dashboardSummary = [];
  opportunityDetails: any = [];
  AllianceDetail: any = [];
  deliveryteams:any = []
  Competitordetails: any = [];
  OpportunityMilestone_OpportunityStage = [];
  OpportunityMilestone_estclosedate = [];
  OpportunityMilestone_forecast = [];
  OpportunityMilestone_probability = [];

  OpportunityMilestone_OpportunityStage1 = [];
  OpportunityMilestone_estclosedate1 = [];
  OpportunityMilestone_forecast1 = [];
  OpportunityMilestone_probability1 = [];

  ServicelineDetails: any = [];
  Serviceline: any = [];
  EngagementModel: any = [];
  SolutionDetail: any = [];
  TCVChangeddetails: any = [];
  TotalactivitiesDetail: any = [];
  BDActivityCountDetail: any = [];
  bDActivityCountLast90Days: any = [];
  LastFiveActivities: any = [];
  AllianceDetailString: any = [];
  ServiceDetailString: any = [];
  DeliveryManagerString: any=[];
  EngagementModelString: any = [];
  SolutionDetailString: any = [];
  CompetitordetailsString: any = [];
  TotalactivitiesDetailString: any = [];
  BDActivityCountDetailString: any = [];
  bDActivityCountLast90DaysString: any = [];
  fixedClass = 'fixedClass1';
  cRContactTotalActivities: any = [];

  primaryContactTotalActivities: any = [];
  primaryContactTotalFaceToFaceActivity: any = [];
  primaryContactBDActivityCountLast90Days: any = [];
  primaryContactBDActivity: any = [];

  decisionMackerTotalActivities: any = [];
  decisionMackerTotalFaceToFaceActivity: any = [];
  decisionMackerBDActivityCountLast90Days: any = [];
  decisionMackerBDActivity: any = [];

  otherContactTotalActivities: any = [];
  otherContactTotalFaceToFaceActivity: any = [];
  otherContactBDActivityCountLast90Days: any = [];
  otherContactBDActivityCount: any = [];


  decisionMackerTotalActivitiesD: any = [];
  decisionMackerTotalActivitiesDD: any = [];
  otherContactTotalActivitiesP: any = [];
  otherContactTotalActivitiesD: any = [];
  otherContactTotalActivitiesDD: any = [];

  activityCount1: any = [];
  activityCount2: any = [];
  scopeOfWorkHide: boolean = false;

  tcvComma = "";
  acvComma = "";
  dateStage;
  currencySymbol = this.OpportunitiesService.getSession('currencySymbol');

  constructor(public router: Router, public datepipe: DatePipe, public OpportunitiesService: OpportunitiesService, private snackBar: MatSnackBar, public OpportunityServices: OpportunitiesService, public service: DataCommunicationService) { }

  ngOnInit() {
    this.deliveryteamMethod();
    this.getDashboardDetails();
  }

  getDashboardDetails() {     //get dashboard details for all sections on page load.
    this.service.loaderhome = true;
    let obj = this.OpportunityServices.getSession('opportunityId')
    console.log("getDashboardDetails", obj)
    let body = {
      "OpportunityID": obj
    }
    this.OpportunityServices.getDealDashboardData(body).subscribe(res => {  //get details based on the opp id.
      console.log("getDashboardDetails", res)
      this.service.loaderhome = false;
      if (res.IsError == false) {
        if (res.ResponseObject == null) {
          let message = 'Oops! There seems to be some technical snag! Could you raise a Helpline ticket?'
          this.OpportunityServices.displayMessageerror(message);
          this.table_data = [
            { "heading": "Opportunity name", "content": "-" },
            { "heading": "Account", "content": "-" },
            { "heading": "Opportunity owner", "content": "-" },
            { "heading": "Vertical", "content": "-" },
            { "heading": "Vertical sales owner", "content": "-" },
            { "heading": "Opportunity number", "content": "-" },
            { "heading": "Sub vertical", "content": "-" },
            { "heading": "Opportunity type", "content": "-" },
            { "heading": "Est. closure date", "content": "-" },
            { "heading": "Currency", "content": "-" },
            { "heading": "TCV", "content": "-" },
            //{ "heading":"Qualification score", "content":"-" },
            { "heading": "ACV", "content": "-" },
            { "heading": "Forecast", "content": "-" },
            { "heading": "Probability", "content": "-" },
            { "heading": "Duration (in months)", "content": "-" },
            //{ "heading":"Engagement model", "content":"-" },
            //{ "heading":"Account manager", "content":"-" },
            { "heading": "Advisor", "content": "-" },
            { "heading": "Delivery manager(s)", "content": "-" },
            //{ "heading":"Bid manager", "content":"-" },
            { "heading": "Competitor(s)", "content": "-" },
            { "heading": "Solution(s)", "content": "-" },
            //{ "heading":"Service line(s)", "content":"-" },
            { "heading": "Alliance(s)", "content": "-" }]

        }
        else {
          this.opportunityDetails = res.ResponseObject.opportunityDetails;
          this.AllianceDetail = res.ResponseObject.AllianceDetail.value;
          this.OpportunityMilestone_OpportunityStage = res.ResponseObject.OpportunityMilestone_OpportunityStage.value;
          this.OpportunityMilestone_estclosedate = res.ResponseObject.OpportunityMilestone_estclosedate.value;
          this.OpportunityMilestone_forecast = res.ResponseObject.OpportunityMilestone_forecast.value;
          this.OpportunityMilestone_probability = res.ResponseObject.OpportunityMilestone_probability.value;
          this.ServicelineDetails = res.ResponseObject.ServicelineDetails == null ? [] : res.ResponseObject.ServicelineDetails.value;
          this.SolutionDetail = res.ResponseObject.SolutionDetail == null ? [] : res.ResponseObject.SolutionDetail.value;
          this.TCVChangeddetails = res.ResponseObject.TCVChangeddetails == null ? [] : res.ResponseObject.TCVChangeddetails.value;
          this.Competitordetails = res.ResponseObject.Competitor.value == null ? [] : res.ResponseObject.Competitor.value;
          this.LastFiveActivities = res.ResponseObject.Last5Activity == null ? [] : res.ResponseObject.Last5Activity.value;
          this.TotalactivitiesDetail = res.ResponseObject.Totalactivities == null ? [] : res.ResponseObject.Totalactivities.value;
          this.BDActivityCountDetail = res.ResponseObject.BDActivityCount == null ? [] : res.ResponseObject.BDActivityCount.value;
          this.bDActivityCountLast90Days = res.ResponseObject.bDActivityCountLast90Days == null ? [] : res.ResponseObject.bDActivityCountLast90Days.value;
          this.cRContactTotalActivities = res.ResponseObject.cRContactTotalActivities == null ? [] : res.ResponseObject.cRContactTotalActivities.value;
          //this.activityCount=res.ResponseObject.activityCount==null?[]:res.ResponseObject.activityCount.value;
          this.activityCount1 = res.ResponseObject.CXOActivityCount.value == null ? [] : res.ResponseObject.CXOActivityCount.value;
          this.activityCount2 = res.ResponseObject.F2FActivityCount.value == null ? [] : res.ResponseObject.F2FActivityCount.value;

          //CRC-PrimaryContact
          this.primaryContactTotalActivities = res.ResponseObject.PrimaryContactTotatlActivities.value == null ? [] : res.ResponseObject.PrimaryContactTotatlActivities.value;
          this.primaryContactTotalFaceToFaceActivity = res.ResponseObject.PrimaryContactTotalFaceToFaceActivity.value == null ? [] : res.ResponseObject.PrimaryContactTotalFaceToFaceActivity.value
          this.primaryContactBDActivityCountLast90Days = res.ResponseObject.PrimaryContactBDActivityCountLast90Days.value == null ? [] : res.ResponseObject.PrimaryContactBDActivityCountLast90Days.value;
          this.primaryContactBDActivity = res.ResponseObject.PrimaryContactBDActivity.value == null ? [] : res.ResponseObject.PrimaryContactBDActivity.value;

          //CRC-DecisionMaker
          this.decisionMackerTotalActivities = res.ResponseObject.DecisonMackerTotalActivities.value == null ? [] : res.ResponseObject.DecisonMackerTotalActivities.value;
          this.decisionMackerTotalFaceToFaceActivity = res.ResponseObject.DecisionMackerTotalFaceToFaceActivity.value == null ? [] : res.ResponseObject.DecisionMackerTotalFaceToFaceActivity.value
          this.decisionMackerBDActivityCountLast90Days = res.ResponseObject.DecisionMackerBDActivityCountLast90Days.value == null ? [] : res.ResponseObject.DecisionMackerBDActivityCountLast90Days.value;
          this.decisionMackerBDActivity = res.ResponseObject.DecisionMackerBDActivity.value == null ? [] : res.ResponseObject.DecisionMackerBDActivity.value;

          //CRC-Others
          this.otherContactTotalActivities = res.ResponseObject.OtherContactTotalActivities.value == null ? [] : res.ResponseObject.OtherContactTotalActivities.value;
          this.otherContactTotalFaceToFaceActivity = res.ResponseObject.OtherContactTotalFaceToFaceActivity.value == null ? [] : res.ResponseObject.OtherContactTotalFaceToFaceActivity.value
          this.otherContactBDActivityCountLast90Days = res.ResponseObject.OtherContactBDActivityCountLast90Days.value == null ? [] : res.ResponseObject.OtherContactBDActivityCountLast90Days.value;
          this.otherContactBDActivityCount = res.ResponseObject.OtherContactBDActivityCount.value == null ? [] : res.ResponseObject.OtherContactBDActivityCount.value;


          //primary Contact Total Activity array with f2f, bdactivitylast90days, bdactivity count fields
          this.primaryContactTotalActivities = this.primaryContactTotalActivities.map(function (el) {
            var o = Object.assign({}, el);
            o.f2f = 0;
            o.bdactivity90 = 0;
            o.bdact = 0;
            return o;
          });

          //Decision Maker Total Activity array with f2f, bdactivitylast90days, bdactivity count fields
          this.decisionMackerTotalActivities = this.decisionMackerTotalActivities.map(function (el) {
            var o = Object.assign({}, el);
            o.f2f = 0;
            o.bdactivity90 = 0;
            o.bdact = 0;
            return o;
          });


          //Removing empty array elements, if present, from other contacts.
          for (let i = 0; i < this.otherContactTotalActivities.length; i++) {
            console.log("Check Value 2", Object.keys(this.otherContactTotalActivities[i]).length);
            if (Object.keys(this.otherContactTotalActivities[i]).length === 0) {
              this.otherContactTotalActivities.splice(i, 1);
            }
          }
          console.log("Other Contacts", this.otherContactTotalActivities);

          //Other Contact Total Activity array with f2f, bdactivitylast90days, bdactivity count fields
          this.otherContactTotalActivities = this.otherContactTotalActivities.map(function (el) {
            var o = Object.assign({}, el);
            o.f2f = 0;
            o.bdactivity90 = 0;
            o.bdact = 0;
            return o;
          });

          //Removing duplicate elements from decision maker present in primary contact
          if (this.primaryContactTotalActivities.length == 0) {
            this.decisionMackerTotalActivitiesDD = this.decisionMackerTotalActivities;
          }
          else {
            for (let i = 0; i < this.primaryContactTotalActivities.length; i++) {
              for (let j = 0; j < this.decisionMackerTotalActivities.length; j++) {
                if (!(this.decisionMackerTotalActivities[j].DecisonMackerContactName == this.primaryContactTotalActivities[i].PrimaryContactName)) {
                  this.decisionMackerTotalActivitiesDD.push(this.decisionMackerTotalActivities[j]);
                }
              }
            }
          }

          console.log("decisionMackerTotalActivitiesDD", this.decisionMackerTotalActivitiesDD);

          //Removing duplicates from same Decision Maker array, if any.

          for (let i = 0; i < this.decisionMackerTotalActivitiesDD.length; i++) {
            this.decisionMackerTotalActivitiesD.push(this.decisionMackerTotalActivitiesDD[i]);
            var flag = 0;
            for (let j = i + 1; j < this.decisionMackerTotalActivitiesDD.length; j++) {
              if (this.decisionMackerTotalActivitiesDD[i].DecisonMackerContactName == this.decisionMackerTotalActivitiesDD[j].DecisonMackerContactName) {
                flag = 1;
              }
            }
            if (flag == 1) {
              this.decisionMackerTotalActivitiesD.pop();
            }
          }
          console.log("decisionMackerTotalActivitiesD", this.decisionMackerTotalActivitiesD);


          //Removing duplicates from same 'Other Contact' array, if any.
          for (let i = 0; i < this.otherContactTotalActivities.length; i++) {
            this.otherContactTotalActivitiesDD.push(this.otherContactTotalActivities[i]);
            var flag = 0;
            for (let j = i + 1; j < this.otherContactTotalActivities.length; j++) {
              if (this.otherContactTotalActivities[i].OtherContactName == this.otherContactTotalActivities[j].OtherContactName) {
                flag = 1;
              }
            }
            if (flag == 1) {
              this.otherContactTotalActivitiesDD.pop();
            }

          }


          //Removing duplicate elements from other contacts present in primary contact
          for (let i = 0; i < this.otherContactTotalActivitiesDD.length; i++) {
            var flag = 0;
            for (let j = 0; j < this.primaryContactTotalActivities.length; j++) {
              if (this.otherContactTotalActivitiesDD[i].OtherContactName == this.primaryContactTotalActivities[j].PrimaryContactName) {
                flag = 1;
                break;
              }
            }
            if (flag == 0) {
              this.otherContactTotalActivitiesP.push(this.otherContactTotalActivitiesDD[i]);
            }
          }


          //Removing duplicate elements from other contacts present in decision maker
          for (let i = 0; i < this.otherContactTotalActivitiesP.length; i++) {
            var flag = 0;
            for (let j = 0; j < this.decisionMackerTotalActivitiesD.length; j++) {
              if (this.otherContactTotalActivitiesP[i].OtherContactName == this.decisionMackerTotalActivitiesD[j].DecisonMackerContactName) {
                flag = 1;
                break;
              }
            }
            if (flag == 0) {
              this.otherContactTotalActivitiesD.push(this.otherContactTotalActivitiesP[i]);
            }
          }

          console.log("otherContactTotalActivitiesDD", this.otherContactTotalActivitiesDD);
          console.log("otherContactTotalActivitiesP", this.otherContactTotalActivitiesP);
          console.log("otherTotalActivitiesD", this.otherContactTotalActivitiesD);


          //Primary Contact F2F, BDActivitiesinLast90Days, BDActivityCount value mapping, respectively.
          for (let i = 0; i < this.primaryContactTotalActivities.length; i++) {
            for (let j = 0; j < this.primaryContactTotalFaceToFaceActivity.length; j++) {
              if (this.primaryContactTotalFaceToFaceActivity[j].PrimaryContactId == this.primaryContactTotalActivities[i].PrimaryContactId) {
                this.primaryContactTotalActivities[i].f2f = this.primaryContactTotalFaceToFaceActivity[j].PrimaryContactFaceToFaceActivityCount;
              }
            }
          }

          for (let i = 0; i < this.primaryContactTotalActivities.length; i++) {
            for (let j = 0; j < this.primaryContactBDActivityCountLast90Days.length; j++) {
              if (this.primaryContactBDActivityCountLast90Days[j].PrimaryContactId == this.primaryContactTotalActivities[i].PrimaryContactId) {
                this.primaryContactTotalActivities[i].bdactivity90 = this.primaryContactBDActivityCountLast90Days[j].PrimaryContactTotalBDActivitiesinlast90daysCount;
              }
            }
          }

          for (let i = 0; i < this.primaryContactTotalActivities.length; i++) {
            for (let j = 0; j < this.primaryContactBDActivity.length; j++) {
              if (this.primaryContactBDActivity[j].PrimaryContactId == this.primaryContactTotalActivities[i].PrimaryContactId) {
                this.primaryContactTotalActivities[i].bdact = this.primaryContactBDActivity[j].PrimaryContactTotalBDActivityCount;
              }
            }
          }

          //Decision Maker F2F, BDActivitiesinLast90Days, BDActivityCount value mapping, respectively.
          for (let i = 0; i < this.decisionMackerTotalActivitiesD.length; i++) {
            for (let j = 0; j < this.decisionMackerTotalFaceToFaceActivity.length; j++) {
              if (this.decisionMackerTotalFaceToFaceActivity[j].DecisionMakerContactId == this.decisionMackerTotalActivitiesD[i].DecisionMakerContactId) {
                this.decisionMackerTotalActivitiesD[i].f2f = this.decisionMackerTotalFaceToFaceActivity[j].DecisionMackerFacetoFaceActivityCount;
              }
            }
          }

          for (let i = 0; i < this.decisionMackerTotalActivitiesD.length; i++) {
            for (let j = 0; j < this.decisionMackerBDActivityCountLast90Days.length; j++) {
              if (this.decisionMackerBDActivityCountLast90Days[j].DecisionMakerContactId == this.decisionMackerTotalActivitiesD[i].DecisionMakerContactId) {
                this.decisionMackerTotalActivitiesD[i].bdactivity90 = this.decisionMackerBDActivityCountLast90Days[j].DecisionMackerTotalBDActivitiesinlast90daysCount;
              }
            }
          }

          for (let i = 0; i < this.decisionMackerTotalActivitiesD.length; i++) {
            for (let j = 0; j < this.decisionMackerBDActivity.length; j++) {
              if (this.decisionMackerBDActivity[j].DecisionMakerContactId == this.decisionMackerTotalActivitiesD[i].DecisionMakerContactId) {
                this.decisionMackerTotalActivitiesD[i].bdact = this.decisionMackerBDActivity[j].DecisionMackerTotalBDActivitiesCount;
              }
            }
          }


          //Others F2F, BDActivitiesinLast90Days, BDActivityCount value mapping, respectively.
          for (let i = 0; i < this.otherContactTotalActivitiesD.length; i++) {
            for (let j = 0; j < this.otherContactTotalFaceToFaceActivity.length; j++) {
              if (this.otherContactTotalFaceToFaceActivity[j].OtherContactID == this.otherContactTotalActivitiesD[i].OtherContactID) {
                this.otherContactTotalActivitiesD[i].f2f = this.otherContactTotalFaceToFaceActivity[j].OtherContactFacetoFaceActivityCount;
              }
            }
          }

          for (let i = 0; i < this.otherContactTotalActivitiesD.length; i++) {
            for (let j = 0; j < this.otherContactBDActivityCountLast90Days.length; j++) {
              if (this.otherContactBDActivityCountLast90Days[j].OtherContactID == this.otherContactTotalActivitiesD[i].OtherContactID) {
                this.otherContactTotalActivitiesD[i].bdactivity90 = this.otherContactBDActivityCountLast90Days[j].OtherContactTotalBDActivitiesinlast90daysCount;
              }
            }
          }

          for (let i = 0; i < this.otherContactTotalActivitiesD.length; i++) {
            for (let j = 0; j < this.otherContactBDActivityCount.length; j++) {
              if (this.otherContactBDActivityCount[j].OtherContactID == this.otherContactTotalActivitiesD[i].OtherContactID) {
                this.otherContactTotalActivitiesD[i].bdact = this.otherContactBDActivityCount[j].OtherContactTotalBDActivitiesCount;
              }
            }
          }

          console.log("Check 13", this.primaryContactTotalActivities);
          console.log("Check 14", this.decisionMackerTotalActivitiesD);
          console.log("Check 15", this.otherContactTotalActivitiesD);


          //Opp Milestone stage change.    
          for (var x = 0; x < this.OpportunityMilestone_OpportunityStage.length; x++) {   //Remove duplicates (if old value is same as new)
            if (!(this.OpportunityMilestone_OpportunityStage[x].wipro_oldvalue === this.OpportunityMilestone_OpportunityStage[x].wipro_newvalue)) {
              this.OpportunityMilestone_OpportunityStage1.push(this.OpportunityMilestone_OpportunityStage[x]);
            }
          }
          for (var x = 0; x < this.OpportunityMilestone_OpportunityStage1.length; x++) {  //Add updated to __
            this.OpportunityMilestone_OpportunityStage1[x].wipro_newvalue = "Updated to " + this.OpportunityMilestone_OpportunityStage1[x].wipro_newvalue;
          }
          //Push into Opp Milestone stage change array the date of opportunity creation from session variable.
          var date = this.OpportunitiesService.getSession('createdDate');
          this.dateStage = this.datepipe.transform(date, 'dd-MMM-yyyy');
          console.log("Date format", this.dateStage);
          this.OpportunityMilestone_OpportunityStage1.push({ ChangedOnDateDisplay: this.dateStage, wipro_newvalue: "Opportunity created" });

          //Opp Milestone est. date change. 
          for (var x = 0; x < this.OpportunityMilestone_estclosedate.length; x++) {  //Remove duplicates (if old value is same as new)
            if (!(this.OpportunityMilestone_estclosedate[x].wipro_oldvalue === this.OpportunityMilestone_estclosedate[x].wipro_newvalue)) {
              this.OpportunityMilestone_estclosedate1.push(this.OpportunityMilestone_estclosedate[x]);
            }
          }
          console.log("Milestone1", this.OpportunityMilestone_estclosedate1);

          for (var x = 0; x < this.OpportunityMilestone_estclosedate1.length; x++) {  //Add updated from __ and to __ 
            if (this.OpportunityMilestone_estclosedate1[x].wipro_oldvalue) {
              this.OpportunityMilestone_estclosedate1[x].wipro_newvalue = "Updated from " + this.OpportunityMilestone_estclosedate1[x].wipro_oldvalue + " to " + this.OpportunityMilestone_estclosedate1[x].wipro_newvalue;
            }
            else {
              this.OpportunityMilestone_estclosedate1[x].wipro_newvalue = this.OpportunityMilestone_estclosedate1[x].wipro_newvalue;
            }

          }

          //Opp Milestone forecast change. 
          for (var x = 0; x < this.OpportunityMilestone_forecast.length; x++) {    //Remove duplicates (if old value is same as new)
            if (!(this.OpportunityMilestone_forecast[x].wipro_oldvalue === this.OpportunityMilestone_forecast[x].wipro_newvalue)) {
              this.OpportunityMilestone_forecast1.push(this.OpportunityMilestone_forecast[x]);
            }
          }
          console.log("Milestone2", this.OpportunityMilestone_forecast1);

          for (var x = 0; x < this.OpportunityMilestone_forecast1.length; x++) {   //Add updated from __ and to __ 
            if (this.OpportunityMilestone_forecast1[x].wipro_oldvalue) {
              this.OpportunityMilestone_forecast1[x].wipro_newvalue = "Updated from " + this.OpportunityMilestone_forecast1[x].wipro_oldvalue + " to " + this.OpportunityMilestone_forecast1[x].wipro_newvalue;
            }
            else {
              this.OpportunityMilestone_forecast1[x].wipro_newvalue = this.OpportunityMilestone_forecast1[x].wipro_newvalue;
            }
          }

          //Opp Milestone probability change. 
          for (var x = 0; x < this.OpportunityMilestone_probability.length; x++) {    //Remove duplicates (if old value is same as new)
            if (!(this.OpportunityMilestone_probability[x].wipro_oldvalue === this.OpportunityMilestone_probability[x].wipro_newvalue)) {
              this.OpportunityMilestone_probability1.push(this.OpportunityMilestone_probability[x]);
            }
          }
          console.log("Milestone3", this.OpportunityMilestone_probability1);

          for (var x = 0; x < this.OpportunityMilestone_probability1.length; x++) {   //Add updated from __ and to __ 
            if (this.OpportunityMilestone_probability1[x].wipro_oldvalue) {
              this.OpportunityMilestone_probability1[x].wipro_newvalue = "Updated from " + this.OpportunityMilestone_probability1[x].wipro_oldvalue + " to " + this.OpportunityMilestone_probability1[x].wipro_newvalue;
            }
            else {
              this.OpportunityMilestone_probability1[x].wipro_newvalue = this.OpportunityMilestone_probability1[x].wipro_newvalue;
            }
          }

          //Deal Summary section changes --- append comma between values.
          for (let i = 0; i < this.Competitordetails.length; i++) {
            if(this.Competitordetails[i].wipro_competitorname == "Others"){
              this.CompetitordetailsString.push(this.Competitordetails[i].othercompetitorname?this.Competitordetails[i].othercompetitorname:"Others");
            }
            else{
               this.CompetitordetailsString.push(this.Competitordetails[i].wipro_competitorname);
            }
          }
          var strCompetitordetailsString = this.CompetitordetailsString.join(", ");

          for (let i = 0; i < this.AllianceDetail.length; i++) {
            this.AllianceDetailString.push(this.AllianceDetail[i].AllianceName);
          }
          var strAllianceDetailString = this.AllianceDetailString.join(", ");

          for (let i = 0; i < this.SolutionDetail.length; i++) {
            this.SolutionDetailString.push(this.SolutionDetail[i].SolutionName);
          }
          console.log("DeliveryManager",this.deliveryteams);
          for (let i = 0; i < this.deliveryteams.length; i++) {
            this.DeliveryManagerString.push(this.deliveryteams[i].deliverycontent);
          }
          var deliverymanager = this.DeliveryManagerString.join(", ");
          var strSolutionDetailString = this.SolutionDetailString.join(", ");
          for (let i = 0; i < this.ServicelineDetails.length; i++) {
            var check = this.addComma(this.ServicelineDetails[i].WiproEstsltcv);
            this.ServicelineDetails[i].WiproEstsltcv = check;
            console.log("With commas", this.ServicelineDetails[i].WiproEstsltcv);
          }

          for (let i = 0; i < this.ServicelineDetails.length; i++) {     //Remove duplicates
            this.Serviceline.push(this.ServicelineDetails[i]);
            var flag = 0;
            for (let j = i + 1; j < this.ServicelineDetails.length; j++) {
              if (this.ServicelineDetails[i].WiproServicelineidName == this.ServicelineDetails[j].WiproServicelineidName) {
                flag = 1;
              }
            }
            if (flag == 1) {
              this.Serviceline.pop();
            }

          }
          console.log("Service Lines", this.Serviceline);

          for (let i = 0; i < this.ServicelineDetails.length; i++) {     //Remove duplicates
            this.EngagementModel.push(this.ServicelineDetails[i]);
            var flag = 0;
            for (let j = i + 1; j < this.ServicelineDetails.length; j++) {
              if (this.ServicelineDetails[i].Wipro_EngagementmodelName == this.ServicelineDetails[j].Wipro_EngagementmodelName) {
                flag = 1;
              }
            }
            if (flag == 1) {
              this.EngagementModel.pop();
            }
          }
          console.log("Engagement Model", this.EngagementModel);

          for (let i = 0; i < this.Serviceline.length; i++) {
            this.ServiceDetailString.push(this.Serviceline[i].WiproServicelineidName);
          }

          for (let i = 0; i < this.EngagementModel.length; i++) {
            this.EngagementModelString.push(this.EngagementModel[i].Wipro_EngagementmodelName);
          }
          var strServiceDetailString = this.ServiceDetailString.join(", ");
          var strEngageMentModel = this.EngagementModelString.join(", ");

          for (let i = 0; i < this.TCVChangeddetails.length; i++) {
            this.TCVChangeddetails[i].TCVChange = this.addComma(this.TCVChangeddetails[i].TCVChange);
            this.TCVChangeddetails[i].UpdatedTcv = this.addComma(this.TCVChangeddetails[i].UpdatedTcv);
          }     
          
          console.log("Comma 2", this.opportunityDetails.WiproOveralltcv);
          this.tcvComma = this.addComma(this.opportunityDetails.WiproOveralltcv);
          console.log("opportunityDetails.WiproOveralltcv", this.tcvComma);

          console.log("Comma 1", this.opportunityDetails.WiproAcv);
          this.acvComma = this.addComma(this.opportunityDetails.WiproAcv);
          console.log("opportunityDetails.WiproOveralltcv", this.acvComma);
          
          this.opportunityDetails.WiproScopeofwork=this.opportunityDetails.WiproScopeofwork==null?"-":this.getSymbol(this.opportunityDetails.WiproScopeofwork);

          
          //Push '-' if null, else the value present in array.
          this.table_data = [
            { "heading": "Opportunity name", "content": this.opportunityDetails.Name == null ? "-" : this.getSymbol(this.opportunityDetails.Name) },
            { "heading": "Account", "content": this.opportunityDetails.accountname == null ? "-" : this.opportunityDetails.accountname },
            { "heading": "Opportunity owner", "content": this.opportunityDetails._owneridname == null ? "-" : this.opportunityDetails._owneridname },
            { "heading": "Vertical", "content": this.opportunityDetails.Vertical_ == null ? "-" : this.opportunityDetails.Vertical_.charAt(0).toUpperCase() + this.opportunityDetails.Vertical_.slice(1) },
            { "heading": "Vertical sales owner", "content": this.opportunityDetails.VerticalSalesOwner == null ? "-" : this.opportunityDetails.VerticalSalesOwner },
            { "heading": "Opportunity number", "content": this.opportunityDetails.WiproOpportunitynumber == null ? "-" : this.opportunityDetails.WiproOpportunitynumber },
            { "heading": "Sub vertical", "content": this.opportunityDetails.SubVertical_ == null ? "-" : this.opportunityDetails.SubVertical_ },
            { "heading": "Opportunity type", "content": this.opportunityDetails.opportunitytype == null ? "-" : this.opportunityDetails.opportunitytype },
            { "heading": "Est. closure date", "content": this.opportunityDetails.Estimatedclosedate == null ? "-" : this.opportunityDetails.Estimatedclosedate },
            { "heading": "Currency", "content": this.opportunityDetails.Transactioncurrency == null ? "-" : this.opportunityDetails.Transactioncurrency },
            { "heading": "TCV", "content": this.opportunityDetails.tcv == null ? "-" : this.tcvComma },
            //{ "heading":"Qualification Score", "content":this.opportunityDetails.WiproOpportunityscore==null?"-":this.opportunityDetails.WiproOpportunityscore },
            { "heading": "ACV", "content": this.opportunityDetails.WiproAcv == null ? "-" : this.acvComma },
            { "heading": "Forecast", "content": this.opportunityDetails.forecast == null ? "-" : (this.opportunityDetails.forecast.charAt(0).toUpperCase() + (this.opportunityDetails.forecast.slice(1)).toLowerCase()) },//(word.charAt(0).toUpperCase() + word.slice(1));
            { "heading": "Probability", "content": this.opportunityDetails.probability == null ? "-" : this.opportunityDetails.probability },
            { "heading": "Duration (in months)", "content": this.opportunityDetails.WiproDurationinmonths == null ? "-" : this.opportunityDetails.WiproDurationinmonths },
            // { "heading":"Engagement model", "content": this.ServicelineDetails[0].Wipro_EngagementmodelName==null?"-":this.ServicelineDetails[0].Wipro_EngagementmodelName },
            //{ "heading":"Engagement model(s)", "content": strEngageMentModel==null ||strEngageMentModel==''?"-":strEngageMentModel },
            //{ "heading":"Account Manager", "content":this.opportunityDetails.accountmanager==null?"-":this.opportunityDetails.accountmanager },
            { "heading": "Advisor", "content": this.opportunityDetails.Advisorname == null ? "-" : this.opportunityDetails.Advisorname },
            { "heading": "Delivery manager(s)", "content": deliverymanager == null || deliverymanager == "" ? "-" : deliverymanager},
            //{ "heading":"Bid manager", "content":"-" },
            { "heading": "Competitor(s)", "content": strCompetitordetailsString == null || strCompetitordetailsString == '' ? "-" : strCompetitordetailsString },
            { "heading": "Solution(s)", "content": strSolutionDetailString == null || strSolutionDetailString == "" ? "-" : strSolutionDetailString },
            //{ "heading":"Service line(s)", "content":strServiceDetailString==null ||strServiceDetailString==''?"-":strServiceDetailString },
            { "heading": "Alliance(s)", "content": strAllianceDetailString == null || strAllianceDetailString == '' ? "-" : strAllianceDetailString }]

          console.log("REs---------------", this.table_data)
          console.log("REs---------------", this.opportunityDetails);
        }
      }
      else {
        this.table_data = [
          { "heading": "Opportunity name", "content": "-" },
          { "heading": "Account", "content": "-" },
          { "heading": "Opportunity owner", "content": "-" },
          { "heading": "Vertical", "content": "-" },
          { "heading": "Vertical sales owner", "content": "-" },
          { "heading": "Opportunity number", "content": "-" },
          { "heading": "Sub vertical", "content": "-" },
          { "heading": "Opportunity type", "content": "-" },
          { "heading": "Est. closure date", "content": "-" },
          { "heading": "Currency", "content": "-" },
          { "heading": "TCV", "content": "-" },
          //{ "heading":"Qualification score", "content":"-" },
          { "heading": "ACV", "content": "-" },
          { "heading": "Forecast", "content": "-" },
          { "heading": "Probability", "content": "-" },
          { "heading": "Duration (in months)", "content": "-" },
          //{ "heading":"Engagement model", "content":"-" },
          //{ "heading":"Account manager", "content":"-" },
          { "heading": "Advisor", "content": "-" },
          { "heading": "Delivery manager(s)", "content": "-" },
          //{ "heading":"Bid manager", "content":"-" },
          { "heading": "Competitor(s)", "content": "-" },
          { "heading": "Solution(s)", "content": "-" },
          //{ "heading":"Service line(s)", "content":"-" },
          { "heading": "Alliance(s)", "content": "-" }]
        this.scopeOfWorkHide = true;
        this.service.loaderhome = false;
        this.OpportunityServices.displayerror(res.ApiStatusCode);
      }

    },
      err => {
        this.service.loaderhome = false;
        this.table_data = [
          { "heading": "Opportunity name", "content": "-" },
          { "heading": "Account", "content": "-" },
          { "heading": "Opportunity owner", "content": "-" },
          { "heading": "Vertical", "content": "-" },
          { "heading": "Vertical sales owner", "content": "-" },
          { "heading": "Opportunity number", "content": "-" },
          { "heading": "Sub vertical", "content": "-" },
          { "heading": "Opportunity type", "content": "-" },
          { "heading": "Est. closure date", "content": "-" },
          { "heading": "TCV", "content": "-" },
          //{ "heading":"Qualification score", "content":"-" },
          { "heading": "ACV", "content": "-" },
          { "heading": "Forecast", "content": "-" },
          { "heading": "Probability", "content": "-" },
          { "heading": "Duration (in months)", "content": "-" },
          //{ "heading":"Engagement model", "content":"-" },
          //{ "heading":"Account manager", "content":"-" },
          { "heading": "Advisor", "content": "-" },
          { "heading": "Delivery manager(s)", "content": "-" },
          //{ "heading":"Bid manager", "content":"-" },
          { "heading": "Competitor(s)", "content": "-" },
          { "heading": "Solution(s)", "content": "-" },
          //{ "heading":"Service line(s)", "content":"-" },
          { "heading": "Alliance(s)", "content": "-" }]
        let message = "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?";
        this.OpportunityServices.displayMessageerror(message);

      })
  }

  deliveryteamMethod() {   //Get Delivery Manager(s) List for summary section

    let obj = { "Guid": this.OpportunitiesService.getSession('opportunityId') }

    this.OpportunitiesService.deliveryTeam(obj).subscribe(response => {
      this.deliveryteams = []
      if (!response.IsError) {
        if (response.ResponseObject != null && response.ResponseObject.length != 0) {
          const deliveryTeams = response.ResponseObject;
          deliveryTeams.map((deliveryTeam, i) => {
            const deliveryteamObj = {
              deliverycontent: deliveryTeam.MapName ? deliveryTeam.MapName : '-',
              sapcontent: deliveryTeam.Name ? deliveryTeam.Name : '-'
            }
            this.deliveryteams.push(deliveryteamObj);
          });
          
        }
        else {
        }
      }
    },
      err => {
        this.service.loaderhome = false;
      }
    )
  }

  goBack() {           //redirects on click of back button
    //window.history.back();
    this.router.navigate(['/opportunity/opportunityview/overview']);
  }

  getSymbol(data) {    //decrypts the encrypted data. 
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');
  }

  addComma(val) {     //function to format value, where ever neccessary. (Eg 10000000 --> 10,000,000.00)
    if (val) {
      var a = val;
      var tcv = a.toString();
      var num: string = "";
      var parts = tcv.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      //parts[0] = parts[0].replace(/(\d)(?=(\d\d)+\d$)/g, "$1,");
      if (parts[1] == null || parts[1] == undefined) {
        parts[1] = "00";
      }
      else {
        parts[1] = parts[1].substring(0, 2);
      }
      num = parts.join(".");
      return num;
    }
    else {
      return "-";
    }
  }

  panelOpenState1: boolean;
  panelOpenState2: boolean;
  panelOpenState3: boolean;
  panelOpenState4: boolean;
  panelOpenState5: boolean;
  panelOpenState6: boolean;
  panelOpenState7: boolean;

  table_data = []


}

