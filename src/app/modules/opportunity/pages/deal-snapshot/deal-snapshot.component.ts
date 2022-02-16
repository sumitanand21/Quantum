import { Component, OnInit } from '@angular/core';
import { DataCommunicationService } from '@app/core';
import { OpportunitiesService } from '@app/core';
import { MatDialog,MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-deal-snapshot',
  templateUrl: './deal-snapshot.component.html',
  styleUrls: ['./deal-snapshot.component.scss']
})
export class DealSnapshotComponent implements OnInit {

  constructor(public service : DataCommunicationService,public projectService: OpportunitiesService,public snackBar:MatSnackBar) { }
   
  ngOnInit() {
    this.isLoading=true;

    this.projectService.getOpenRequests(this.opportunityId).subscribe((res)=>
    {
      console.log("snapshot result",res);
      if(res!==null)
      {
        if(res.IsError)
        {
            this.snackBar.open("Server error occured.Try after some time", this.action, {
              duration: 3000
            });
            this.isLoading=false;
        }
        else
        {
          this.Teaming=res.ResponseObject.ListOpportunityTeamings;
        }
      }
    })

    this.projectService.getCoachDetails(this.opportunityId).subscribe((res)=>
    {
      if(res!==null)
      {
        if(res.IsError)
        {
            this.snackBar.open("Server error occured.Try after some time", this.action, {
              duration: 3000
            });
            this.isLoading=false;
        }
        else
        {
          for(var i=0;i<4;i++)
          {
            this.toolUsage[i]["days"]=res.ResponseObject[i].LastModifiedCount;
            this.toolUsage[i]["tooltipMessage"]=res.ResponseObject[i].RAG_Criteria;
            this.toolUsage[i]["value"]=res.ResponseObject[i].LastModifiedCount;
          }
          for(var j=4,k=0;j<res.ResponseObject.length;j++,k++)
          {
            this.winStartegy[k]["days"]=res.ResponseObject[j].LastModifiedCount;
            this.winStartegy[k]["tooltipMessage"]=res.ResponseObject[j].RAG_Criteria;
            this.winStartegy[k]["value"]=res.ResponseObject[j].LastModifiedCount;
          }
          this.isLoading=false;
        }
      }
    })
  }

  goBack() {
    window.history.back();
  }

  addComma(val) {
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
      num = parts.join(".");
      return num;
    }
    else {
      return "NA";
    }
  }


  print()
  {
    window.print();
  }
   currencySymbol = this.projectService.getSession('currencySymbol');
   action:any;
   isLoading=false;
   opportunityId=this.projectService.getSession('opportunityId');
   tcvValue=this.projectService.getSession('tcvStoredValue')
   DealSummary = [

      {label:'Account',content:this.projectService.getSession('accountName')?this.projectService.getSession('accountName'):'NA'},
      {label:'Opp name',content:this.projectService.getSession('opportunityName')?this.projectService.getSession('opportunityName'):'NA'},
      {label:'Est closure dt',content:this.projectService.getSession('estDate')?this.formatDate(this.projectService.getSession('estDate')):'NA'},
      {label:'Opportunity owner',content:this.projectService.getSession('ownerNameValue')?this.projectService.getSession('ownerNameValue'):'NA'},
      {label:'SBU',content:this.projectService.getSession('sbuStoredValue')?this.projectService.getSession('sbuStoredValue'):'NA'},
      {label:'TCV('+this.currencySymbol+')',content: this.addComma(this.tcvValue)}
  ]

  coachingContent = [

    {bgcolor:'bgcolor-green',logo:'mdi mdi-trophy',label:'Last win strategy coaching',value:'NA'},
    {bgcolor:'bgcolor-yellow',logo:'mdi mdi-chart-areaspline',label:'Last opportunity coaching',value:'NA'},
    {bgcolor:'bgcolor-purple',logo:'mdi mdi-account-multiple-check',label:'Last opportunity review',value:'NA'},
    {bgcolor:'bgcolor-red',logo:'mdi mdi-directions-fork',label:'Last pipeline review',value:'NA'}
    
  ]

  toolUsage = [

    { usageType:'Storm tracker',value:0,days:'0'},
    { usageType:'Relationship suite',value:0,days:'0'},
    { usageType:'Competitor strategy tool',value:0,days:'0'},
    { usageType:'Raid log',value:0,days:'0'}

  ]
 
  winStartegy = [

    { usageType:'Buying and selection criteria',value:0,days:'0'},
    { usageType:'Deal shaping strategy',value:0,days:'0'},
    { usageType:'Value position',value:0,days:'0'},
    { usageType:'Competitive messaging matrix',value:0,days:'0'},
    { usageType:'Buying process events',value:0,days:'0'}

  ]

  Teaming=[];

  getProgress(value)
  {
    
    switch(true){

      case (value <= 20) :
        return 'green';
        

      case (value > 90) :
        return 'orange';

      case  (value > 21 &&  value < 90):
        return 'azure' ;

      default:
      return 'azure'  
    }
    
  }
  formatDate(date) {
    var d = new Date(date),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
    if(month.length<2) month= '0'+ month; 
    if (day.length < 2) day = '0' + day;
    return [day, month, year].join('-');
  }

  
}
