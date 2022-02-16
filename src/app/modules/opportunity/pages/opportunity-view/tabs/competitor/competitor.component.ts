import { Component, OnInit, EventEmitter, Renderer, ViewChild, Input, Output, SimpleChanges, ElementRef } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material/';
import { OpportunitiesService } from '@app/core/services/opportunities.service';
import { OthercompetitorComponent } from '@app/shared/components/single-table/sprint4Modal/othercompetitor/othercompetitor.component';
import { Subject } from 'rxjs';
import { NgForm, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { environment as env } from '@env/environment';
import { EncrDecrService } from '@app/core/services/encr-decr.service';
import { EnvService } from '@app/core/services/env.service';
// const toolkitUrl = env.toolkitUrl;
@Component({
  selector: 'app-competitor',
  templateUrl: './competitor.component.html',
  styleUrls: ['./competitor.component.scss']
})
export class CompetitorComponent implements OnInit {

  @ViewChild('myForm') public userFrm: NgForm;
  @Input() story: boolean;
  @Input() parentSubject: Subject<any>;
  @Input() callSave: boolean;
  @Input() callValid: boolean;
  @Input() disableFieldsInEndSales: boolean;
  @Input() fromEndSalesCycle: boolean = false;
  @Output() endSale = new EventEmitter<boolean>();
  @Output() validComp = new EventEmitter<boolean>();
  endFlag: boolean;
  valid: boolean = false;
  @ViewChild('checkbutton') checkbutton;
  @ViewChild('checkbox') checkbox;
  arrowkeyLocation = 0;
  selectedAll: boolean;
  tempdown = [];
  tempup = [];
  CompetitorData = [];
  CompetitorEnable = [];
  CompetitorDataMoveDisable: boolean = false;
  CompetitorDisable = [];
  wiprocompetitorData = [];
  SoleSourceOpp: boolean;
  wiprocompetitorDataInitial = [];
  pursuitStage: boolean;
  secureStage: boolean;
  markingOppWon: boolean;
  markingOppLost: boolean;
  errorborder_condition: boolean;
  errortext_condition: boolean;
  disableOnAccess: boolean = false;
  SoleSourceOppYes: boolean = true;
  SoleSourceOppNO: boolean = false;
  disableMoveUPDown: boolean = false;
  solesoureToggle = new FormControl();
  orderCreatedFlag: boolean = false;
  isFullAccess = false;
  disableInhouseYes: boolean = false;
  isAppirio;

  constructor( public envr : EnvService,private EncrDecr: EncrDecrService, private renderer: Renderer, public OpportunitiesService: OpportunitiesService, public projectService: OpportunitiesService, private snackBar: MatSnackBar, public dialog: MatDialog, public service: DataCommunicationService, public OpportunityServices: OpportunitiesService, public router: Router) {
    this.addUpdTeamBuilder = this.addUpdTeamBuilder.bind(this);
    this.eventSubscriber(this.service.subscription, this.addUpdTeamBuilder);

    this.ngOnInit = this.ngOnInit.bind(this);
    this.eventSubscriber1(this.OpportunityServices.subscriptionMoreOptions, this.ngOnInit);
  }

  ngOnInit() {

    this.errortext_condition = false;
    this.errorborder_condition = false;
    this.pursuitStage = false;
    this.secureStage = false;
    this.markingOppWon = false;
    this.markingOppLost = false;
    this.orderCreatedFlag = this.projectService.getSession('ordercreated');

    //Determining the access permission for the page.
    this.isAppirio = this.projectService.getSession('IsAppirioFlag');
    console.log("AppirioFlagInComp", this.isAppirio);
    if (this.isAppirio) {
      this.disableOnAccess = true;
    }
    else {
      this.isFullAccess = this.projectService.getSession('FullAccess');
      if (this.projectService.getSession('opportunityStatus').toString() != '1' || this.orderCreatedFlag) {
        if (this.projectService.getSession('endsalesfromorder') == true && this.fromEndSalesCycle) {
          this.disableOnAccess = false;
        }
        else {
          this.disableOnAccess = true;
        }

      }
      else {
        if (this.isFullAccess == true) {
          this.disableOnAccess = false;
        }
        else {
          debugger;
          if ((this.projectService.getSession('compTeam') && (this.projectService.getSession('compTeam').FullAccess == true || this.projectService.getSession('compTeam').PartialAccess == true)) || (this.projectService.getSession('endsalesfromorder') == true && this.fromEndSalesCycle)) {
            this.disableOnAccess = false;
          }
          else {
            this.disableOnAccess = true;
          }
        }
      }
      //Based on status -- if lost/terminated disable competitor
      if((this.projectService.getSession('opportunityStatus') == 5 || this.projectService.getSession('opportunityStatus') == 184450000) && this.disableFieldsInEndSales==true)
      {
          this.disableOnAccess = true;
      }
    }

    console.log("this.disableOnAccess", this.disableOnAccess);

    //To call the addUpdTeamBuilder() function everytime save is triggered in ESC.
    console.log("ngInit change count", this.parentSubject);
    if (this.parentSubject != undefined) {
      this.parentSubject.subscribe(event => {
        // called in the parent component | End Sale Cycle
        console.log("Event Value", event);
        if (event > 1) {
          this.addUpdTeamBuilder();
        }
      });
    }
    this.competitorget()
  }

  
  public addUpdTeamBuilder() {  //To check for validations on save. 
    debugger;
    var flag = 0;
    var totalCheck = 0;
    this.valid = false;
    for (let k = 0; k < this.CompetitorEnable.length; k++) {
      if (this.CompetitorEnable[k].WiproCompetitoridname == '') {
        this.CompetitorEnable[k].errortext_conditionCompName = true;
        this.CompetitorEnable[k].errorborder_conditionCompName = true;
        flag = 1;
      }
    }

    for (let m = 0; m < this.CompetitorEnable.length; m++) {
      if (this.CompetitorEnable[m].WiproIncumbent == true) {
        if (!(this.CompetitorEnable[m].WiproCurrentscopeshare > 0 && this.CompetitorEnable[m].WiproCurrentscopeshare <= 100)) {
          this.CompetitorEnable[m].errortext_conditionCurrentScope = true;
          this.CompetitorEnable[m].errortext_conditionCurrentScope = true;
          flag = 1;
        }
      }
    }
    for (let m = 0; m < this.CompetitorDisable.length; m++) {
      if (this.CompetitorDisable[m].WiproIncumbent == true) {
        if (!(this.CompetitorDisable[m].WiproCurrentscopeshare > 0 && this.CompetitorDisable[m].WiproCurrentscopeshare <= 100)) {
          this.CompetitorDisable[m].errortext_conditionCurrentScope = true;
          this.CompetitorDisable[m].errortext_conditionCurrentScope = true;
          flag = 1;
        }
      }
    }

    for (let n = 0; n < this.CompetitorEnable.length; n++) {
      if (this.CompetitorEnable[n].WiproSharedwin == true) {
        if (!(this.CompetitorEnable[n].WiproSharepercentage > 0 && this.CompetitorEnable[n].WiproSharepercentage <= 100)) {
          this.CompetitorEnable[n].errortext_conditionSharedPercent = true;
          this.CompetitorEnable[n].errortext_conditionSharedPercent = true;
          flag = 1;
        }
      }
    }

    for (let n = 0; n < this.CompetitorDisable.length; n++) {
      if (this.CompetitorDisable[n].WiproSharedwin == true) {
        if (!(this.CompetitorDisable[n].WiproSharepercentage > 0 && this.CompetitorDisable[n].WiproSharepercentage <= 100)) {
          this.CompetitorDisable[n].errortext_conditionSharedPercent = true;
          this.CompetitorDisable[n].errortext_conditionSharedPercent = true;
          flag = 1;
        }
      }
    }

    for (let n = 0; n < this.CompetitorDisable.length; n++) {
      if (this.CompetitorDisable[n].WiproSharedwin == true) {
        totalCheck = totalCheck + parseFloat(this.CompetitorDisable[n].WiproSharepercentage);
      }
    }

    for (let n = 0; n < this.CompetitorEnable.length; n++) {
      if (this.CompetitorEnable[n].WiproSharedwin == true) {
        totalCheck = totalCheck + parseFloat(this.CompetitorEnable[n].WiproSharepercentage);
      }
    }

    console.log("Total Sum", totalCheck);
    if (totalCheck > 100) {
      flag = 1;
      let message = "Sum of all Share Percent should be less than or equal to 100";
      let action;
      this.snackBar.open(message, action, {
        duration: 4000,
      });
    }


    if (this.SoleSourceOpp == true) {
      for (let k = 0; k < this.CompetitorEnable.length; k++) {
        if (this.CompetitorEnable[k].WiproCompetitoridname == '') {
          this.CompetitorEnable[k].errortext_conditionCompName = false;
          this.CompetitorEnable[k].errorborder_conditionCompName = false;
        }
        this.CompetitorEnable[k].errortext_conditionCurrentScope = false;
        this.CompetitorEnable[k].errortext_conditionSharedPercent = false;
      }
      for (let m = 0; m < this.CompetitorDisable.length; m++) {
        this.CompetitorDisable[m].errortext_conditionCurrentScope = false;
        this.CompetitorDisable[m].errortext_conditionSharedPercent = false;
      }
    }
    debugger;

    var finalArray = [];
    if (this.CompetitorDisable.length != 0) {
      for (let i = 0; i < 3; i++) {
        finalArray.push(this.CompetitorDisable[i])
      }
      for (let i = 0; i < this.CompetitorEnable.length; i++) {
        finalArray.push(this.CompetitorEnable[i])
      }
    }
    else {
      for (let i = 0; i < this.CompetitorEnable.length; i++) {
        finalArray.push(this.CompetitorEnable[i])
      }
    }
    console.log("Flag Competitor Value final", flag);
    if (flag != 1) {          // if valid, then save the comp details for the given opp.
      this.service.loaderhome = true;
      let finalObject = {
        "OpportunityId": this.OpportunityServices.getSession('opportunityId'),
        "SoleSource": this.SoleSourceOpp,
        "opportunityCompetitors": finalArray
      }
      this.valid = true;
      this.callValid = false;
      this.validComp.emit(this.valid);
      console.log("finalObject", finalObject)
      this.OpportunityServices.saveOpportunityCompetitor(finalObject).subscribe(res => {
        console.log(res, "comp result")
        this.service.loaderhome = false;
        if (this.SoleSourceOpp) {
          this.projectService.setSession('soleSourceOverview', true);
        }
        this.competitorget()

        if (res.IsError == false) {
          this.callSave = false;
          this.endFlag = true;
          this.endSale.emit(this.endFlag);

          if ((!(this.disableFieldsInEndSales == false)) && !this.projectService.getSession('showMessage')) {
            let message = "Competitor Saved Successfully ";
            this.OpportunityServices.displayMessageerror(message);
          }
          this.togSuccess = false;
          this.userFrm.form.markAsPristine();
          if (this.projectService.getSession('showMessage')) {
            let message = "Competitor saved successfully, kindly navigate to overview page and click save to complete next stage movement";
            this.OpportunityServices.displayMessageerror(message);
            this.projectService.setSession('showMessage', false);
          }
        } else {
          this.OpportunityServices.displayerror(res.ApiStatusCode);
        }
      },
        err => {
          this.service.loaderhome = false;
          let message = "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?";
          this.OpportunityServices.displayMessageerror(message);
        })
    }
  }

  ngAfterContentChecked() {
    // alert("ngAfterContentChecked")
  }
  ngDoCheck() {
    // alert("ngDoCheck")
  }
  ngOnChanges(simpleChanges: SimpleChanges) { //called every time one of the component input properties changes
    // alert("ngOnChanges")
    if (simpleChanges.callSave) {
      if (simpleChanges.callSave.currentValue == true) {
        this.addUpdTeamBuilder();
      }
    }

    if (simpleChanges.callValid) {
      if (simpleChanges.callValid.currentValue == true) {
        this.addUpdTeamBuilder();
      }
    }
  }


  ngAfterViewChecked() {   //called everytime the view is updated.
    console.log("dirty flag service", this.service.dirtyflag);
    console.log("dirty flag2", this.userFrm.dirty);
    console.log("userFrm", this.userFrm);
    if (this.togSuccess == true) {
      this.userFrm.form.markAsDirty();
      console.log("TogSuccess", this.togSuccess);
    }
    if (this.userFrm.dirty) {
      this.service.dirtyflag = true;
    }
    else {
      this.service.dirtyflag = false;
    }

    if (this.solesoureToggle.value == 'No') {
      if (this.CompetitorEnable.length == 0 && this.CompetitorDisable.length == 3) {
        var flagINhouse = 0;
        for (let m = 0; m < this.CompetitorDisable.length; m++) {
          if (this.CompetitorDisable[m].WiproCompetitoridname == "In-house" || this.CompetitorDisable[m].WiproCompetitoridname == "In House") {
            if (this.CompetitorDisable[m].WiproCurrentscopeshare != null) {
              flagINhouse = 1;
            }
          }
        }
        if (flagINhouse != 1 && !this.disableOnAccess) {
          let message = "Since sole source is selected as No, you must fill atleast one competitor details to move forward";
          let action;
          this.snackBar.open(message, action, {
            duration: 6000,
          })
        }

        this.addcompetitor();

      }
    }
  }
  ngAfterContentInit() {
  }

  subscription;
  subscriptionMoreOptions;
  eventSubscriber(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscription) {
      this.subscription.unsubscribe();
    } else {
      this.subscription = action.subscribe(() => handler());
    }
  }

  eventSubscriber1(action: Subject<any>, handler: () => void, off: boolean = false) {
    if (off && this.subscriptionMoreOptions) {
      this.subscriptionMoreOptions.unsubscribe();
    } else {
      this.subscriptionMoreOptions = action.subscribe(() => handler());
    }
  }
  ngOnDestroy(): void {
    this.eventSubscriber(this.service.subscription, this.addUpdTeamBuilder, true);
    this.eventSubscriber1(this.OpportunityServices.subscriptionMoreOptions, this.ngOnInit, true);
    //this.parentSubject.unsubscribe();
  }

  addcompetitorTool() {    //To open competitor strategy tool 
    var opportunityId = this.OpportunityServices.getSession('opportunityId');
    var loggedInUser = this.EncrDecr.get('EncryptionEncryptionEncryptionEn', localStorage.getItem('userID'), 'DecryptionDecrip')
    var Status = 0
    window.open(this.envr.toolkitUrl + 'CompetitorStrategyTool/OMCompetitorGrid.aspx?id=' + opportunityId + '&ptype=4&currUser=' + loggedInUser + '&status=' + Status, 'CompetitorStrategy', 'toolbar=no,location=no,status=no,menubar=no,scrollbars=yes,resizable=no,height=' + screen.height + ',width=' + screen.width + ',top=0,left=0');
  }
  competitorget() {   //get the competitors and set the view based on the opp stage/state.
    let obj1 = {
      "Status Code": 1
    }
    this.OpportunityServices.searchOpportunitCompetitor(obj1).subscribe(res => { //get the competitor list for the dropdown
      if (res.IsError == false) {
        if (res.ResponseObject == null) {
          this.wiprocompetitorDataInitial = [];
          let message = 'No record found'
          this.OpportunityServices.displayMessageerror(message);
        }
        else {
          this.wiprocompetitorDataInitial = res.ResponseObject; //.filter(comp => comp.Name != 'Others');
          console.log("Without Others hopefully", this.wiprocompetitorDataInitial);
        }
      }
      else {
        this.OpportunityServices.displayerror(res.ApiStatusCode);
      }
    },
      err => {
        let message = "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?";
        this.OpportunityServices.displayMessageerror(message);

      })

    this.SoleSourceOpp = false;
    let obj = {
      "Id": this.OpportunityServices.getSession('opportunityId')
      //   "Id": "fb00ae34-d473-e911-a830-000d3aa058cb"
    }
    this.service.loaderhome = true;
    this.OpportunityServices.getOpportunitCompetitor(obj).subscribe(res => {   // to display the default/previously added competitor for the opp.
      this.service.loaderhome = false;
      if (res.IsError == false) {
        if (res.ResponseObject == null) {

          this.CompetitorData = [];
          let message = 'API returning null'
          this.OpportunityServices.displayMessageerror(message);
        }
        else {
          this.CompetitorData = res;
          console.log("res234567890", res.ResponseObject)
          if (res.ResponseObject.OppCompetitorList.length != 3) {
            this.CompetitorDataMoveDisable = true;
          }
          else {
            this.CompetitorDataMoveDisable = false;
          }
          console.log("res234567890", this.CompetitorDataMoveDisable);
          console.log("res234567890", this.disableOnAccess)
          console.log("res234567890", this.disableFieldsInEndSales)

          if (res.ResponseObject.SoleSource == null || res.ResponseObject.SoleSource == undefined) {
            this.SoleSourceOpp = this.projectService.getSession("soleSourceOverview");
            console.log("Sole source value 1", this.SoleSourceOpp);
          }
          else {
            this.SoleSourceOpp = res.ResponseObject.SoleSource;
            console.log("Sole source value 2", this.SoleSourceOpp);
          }

          console.log("Sole source value 3", this.SoleSourceOpp);
          console.log("Sole source value 4", this.projectService.getSession("soleSourceOverview"));


          if (this.disableFieldsInEndSales == false) {
            res.ResponseObject.SoleSource = false;
            this.SoleSourceOpp = false;
          }

          if (this.SoleSourceOpp == true) {
            // this.SoleSourceOppYes=true;
            // this.solesoureToggle="true";
            // this.SoleSourceOppNO=false;
            this.solesoureToggle.setValue("Yes")
            //updating rediscache
            this.service.GetRedisCacheData('saveOpportunity').subscribe(res => {   //updating cache for overview autosave
              console.log("redis", res)
              if (!res.IsError && res.ResponseObject) {
                console.log("parsed data", JSON.parse(res.ResponseObject))
                let oppIdFromSession = this.projectService.getSession('opportunityId');
                let dataFromRedis = JSON.parse(res.ResponseObject);
                if (Array.isArray(dataFromRedis) && dataFromRedis.length > 0) {
                  let currentOpportunityData = dataFromRedis.filter(data => data.opportunityId == oppIdFromSession)
                  if (currentOpportunityData.length) {
                    dataFromRedis.map(data => {
                      if (data.opportunityId == oppIdFromSession) {
                        data.solesource = true;
                      }
                    })
                    this.service.SetRedisCacheData(dataFromRedis, 'saveOpportunity').subscribe(res => {
                      if (!res.IsError) {
                        console.log("SUCESS FULL AUTO SAVE")
                      }
                    }, error => {
                      console.log(error)
                    })
                  }
                }
              }
            })
          }
          else {
            this.solesoureToggle.setValue("No");
            var flagEnable = 0;
            for (var x = 0; x < res.ResponseObject.OppCompetitorList.length; x++) {
              if (res.ResponseObject.OppCompetitorList[x].Rank > 0) {
                flagEnable = 1;
              }
            }
            if (this.disableOnAccess == true && flagEnable == 0) {
              this.SoleSourceOpp = true;
              // this.solesoureToggle.disable();
            }
            let data = res.ResponseObject.OppCompetitorList.filter(res => res.Rank && res.Rank > 0)
            if (data.length > 0) {
              //updating rediscache
              this.service.GetRedisCacheData('saveOpportunity').subscribe(result => {  //updating cache for overview autosave
                console.log("redis", result)
                if (!result.IsError && result.ResponseObject) {
                  console.log("parsed data", JSON.parse(result.ResponseObject))
                  let oppIdFromSession = this.projectService.getSession('opportunityId');
                  let dataFromRedis = JSON.parse(result.ResponseObject);
                  if (Array.isArray(dataFromRedis) && dataFromRedis.length > 0) {
                    let currentOpportunityData = dataFromRedis.filter(data => data.opportunityId == oppIdFromSession)
                    if (currentOpportunityData.length) {
                      dataFromRedis.map(data => {
                        if (data.opportunityId == oppIdFromSession) {
                          data.solesource = false;
                          console.log("compList", res.ResponseObject.OppCompetitorList)
                          data.OppCompetitorList = res.ResponseObject.OppCompetitorList ? res.ResponseObject.OppCompetitorList : [];
                        }
                      })
                      this.service.SetRedisCacheData(dataFromRedis, 'saveOpportunity').subscribe(result => {
                        if (!result.IsError) {
                          console.log("SUCESS FULL AUTO SAVE")
                        }
                      }, error => {
                        console.log(error)
                      })
                    }
                  }
                }
              })
            }

          }

          //determinig the opportunity stage and state for setting the view.
          var OppStatecode = res.ResponseObject.OppStatecode;
          var OppPipelineStage = res.ResponseObject.OppPipelineStage;
          
          if(OppPipelineStage==null || OppPipelineStage==undefined){
            OppPipelineStage = this.projectService.getSession('currentState');
          }
          console.log("Opp Pipeline Stage", OppPipelineStage);
          
          // Pursuit or Secure Stage
          if (OppPipelineStage == 184450002) {
            this.pursuitStage = true;
          }
          else if (OppPipelineStage == 184450003) {
            this.secureStage = true;
          }
          // Open, Won or Lost
          if (OppStatecode == 0) {

          }
          else if (OppStatecode == 1) {
            this.markingOppWon = true;
          }
          else if (OppStatecode == 2) {
            this.markingOppLost = true;
          }
        
           //If migrated data already has default comp values, but not as the disabledComp but enabledComp ---- will convert it to disabledComp 
          for(let x=0; x<res.ResponseObject.OppCompetitorList.length; x++)
          {
            if(res.ResponseObject.OppCompetitorList[x].WiproCompetitoridname == 'Wipro' || res.ResponseObject.OppCompetitorList[x].wiprocompetitorname == 'Wipro' ){
              res.ResponseObject.OppCompetitorList[x].Rank=null;
              res.ResponseObject.OppCompetitorList[x].WiproCompetitoridname = "Wipro";
            }
            if(res.ResponseObject.OppCompetitorList[x].WiproCompetitoridname == 'In House' || res.ResponseObject.OppCompetitorList[x].wiprocompetitorname == 'In House'){
              res.ResponseObject.OppCompetitorList[x].Rank=null;
              res.ResponseObject.OppCompetitorList[x].WiproCompetitoridname = "In House";
            }
            if(res.ResponseObject.OppCompetitorList[x].WiproCompetitoridname == 'Do Nothing' || res.ResponseObject.OppCompetitorList[x].wiprocompetitorname == 'Do Nothing'){
              res.ResponseObject.OppCompetitorList[x].Rank=null;
              res.ResponseObject.OppCompetitorList[x].WiproCompetitoridname = "Do Nothing";
            }
          }

          this.CompetitorEnable = res.ResponseObject.OppCompetitorList.filter(res => res.Rank > 0)
          this.CompetitorDisable = res.ResponseObject.OppCompetitorList.filter(res => (res.Rank == null) || (res.Rank == undefined) || (res.Rank == 0));
 
          
          var compDefault=[];
          if(this.CompetitorDisable.length ==0 || this.CompetitorDisable == [] || this.CompetitorDisable == null){
            this.CompetitorDisable=[{"WiproCompetitorid":"a", "WiproCompetitoridname":"Wipro","WiproOpportunityid":"a", "WiproIncumbent":false,"WiproLonglisted":false,"WiproShortlisted":false,"WiproSharedwin":false,"WiproWinningparty":false},{"WiproCompetitorid":"b", "WiproCompetitoridname":"In House","WiproOpportunityid":"b", "WiproIncumbent":false,"WiproLonglisted":false,"WiproShortlisted":false,"WiproSharedwin":false,"WiproWinningparty":false},{"WiproCompetitorid":"c", "WiproCompetitoridname":"Do Nothing","WiproOpportunityid":"c", "WiproIncumbent":false,"WiproLonglisted":false,"WiproShortlisted":false,"WiproSharedwin":false,"WiproWinningparty":false}];
            this.OpportunityServices.getDefaultCompetitorDisable(1).subscribe(resp =>{ //get the default competitor id for migrated opp, if missing
              if (resp.IsError == false) {
                compDefault=resp.ResponseObject;
                console.log("compDefault", compDefault);
                let i=2;
                for(var x=0;x<3;x++){
                  this.CompetitorDisable[i].WiproCompetitorid = (compDefault[x].SysGuid)?compDefault[x].SysGuid:"";
                  this.CompetitorDisable[i].WiproCompetitoridname = (compDefault[x].Name)?compDefault[x].Name:"";
                  this.CompetitorDisable[i].WiproOpportunityid=this.OpportunityServices.getSession('opportunityId');
                  //this.CompetitorDisable[i].Rank=null;
                  i=i-1;
                }
              }
            },
            err => {
                let message = "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?";
                this.OpportunityServices.displayMessageerror(message);  
            });
          }
          
          console.log("CHECK DISABLE FOR OPPS:", this.CompetitorDisable);

          for (var i = 0; i < this.CompetitorDisable.length; i++) {
            if (this.CompetitorDisable[i].WiproCompetitoridname == "Do Nothing") {
              this.CompetitorDisable[i].toggleDisable = true;
            }
            if (this.CompetitorDisable[i].WiproCompetitoridname == "In-house" || this.CompetitorDisable[i].WiproCompetitoridname == "In House") {
              this.CompetitorDisable[i].longlistInhouseDisable = true;
              if (this.SoleSourceOpp)
                this.CompetitorDisable[i].disableInhouseYes = true;
              else
                this.CompetitorDisable[i].disableInhouseYes = false;
            
              }
            if (this.pursuitStage == true) {
              if (this.CompetitorDisable[i].WiproCompetitoridname == "Wipro") {
                this.CompetitorDisable[i].WiproLonglisted = true;
                this.CompetitorDisable[i].longlistDisable = true;
              }
            }
            if (this.secureStage == true) {
              this.pursuitStage = true;
              if (this.CompetitorDisable[i].WiproCompetitoridname == "Wipro") {
                this.CompetitorDisable[i].WiproLonglisted = true;
                this.CompetitorDisable[i].WiproShortlisted = true;
                this.CompetitorDisable[i].longlistDisable = true;
                this.CompetitorDisable[i].shortlistDisable = true;
              }
            }
            if (this.markingOppWon == true) {
            }

            if (this.markingOppLost == true) {
            }

            //adding form data for disabled comp array. 
            this.CompetitorDisable[i].isCheccked = false;
            this.CompetitorDisable[i].disableCompetitor = true;
            this.CompetitorDisable[i].disabled = false;
            this.CompetitorDisable[i].actions = false;
            this.CompetitorDisable[i].errortext_conditionCurrentScope = false;
            this.CompetitorDisable[i].errorborder_conditionCurrentScope = false;
            this.CompetitorDisable[i].errortext_conditionSharedPercent = false;
            this.CompetitorDisable[i].errorborder_conditionSharedPercent = false;
            this.CompetitorDisable[i].CompNameDiable = "CompNameDiable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorDisable[i].IncumbentDisable = "IncumbentDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorDisable[i].CurrentscopeshareDisable = "CurrentscopeshareDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorDisable[i].longlistedDisable = "longlistedDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorDisable[i].ShortlistedDisable = "ShortlistedDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorDisable[i].SharedwinDisable = "SharedwinDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorDisable[i].SharepercentageDisable = "SharepercentageDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorDisable[i].WinningpartyDisable = "WinningpartyDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";

          }

          //adding form data for enabled comp array.
          for (var j = 0; j < this.CompetitorEnable.length; j++) {
            this.CompetitorEnable[j].isCheccked = false;
            this.CompetitorEnable[j].errortext_conditionCurrentScope = false;
            this.CompetitorEnable[j].errorborder_conditionCurrentScope = false;
            this.CompetitorEnable[j].errortext_conditionSharedPercent = false;
            this.CompetitorEnable[j].errorborder_conditionSharedPercent = false;
            this.CompetitorEnable[j].errortext_conditionCompName = false;
            this.CompetitorEnable[j].errorborder_conditionCompName = false;
            this.CompetitorEnable[j].CompName = "CompName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorEnable[j].Incubant = "Incubant" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorEnable[j].Currentscopeshare = "Currentscopeshare" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorEnable[j].Longlisted = "Longlisted" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorEnable[j].Shortlisted = "Shortlisted" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorEnable[j].Sharedwin = "Sharedwin" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorEnable[j].Sharepercentage = "Sharepercentage" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";
            this.CompetitorEnable[j].Winningparty = "Winningparty" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb";

            this.CompetitorEnable[j].disabled = false;
            this.CompetitorEnable[j].actions = true;
            if (this.secureStage == true) {
              this.pursuitStage = true;
            }
            if (this.markingOppWon == true) {
              // this.pursuitStage=true;
              // this.secureStage=true;
            }
            if (this.markingOppLost == true) {
              // this.pursuitStage=true;
              // this.secureStage=true;
            }

          }
        }
      }
      else {
        this.OpportunityServices.displayerror(res.ApiStatusCode);
      }
    },
      err => {
        this.service.loaderhome = false;
        let message = "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?";
        this.OpportunityServices.displayMessageerror(message);

      })
  }

  opportunityWiproSharedwinChange(event, data) {  //triggered when user unchecks the shared win checkbox for enabled comp| (change) event 
    if (event.checked == false) {
      data.WiproSharepercentage = '';
      data.errortext_conditionSharedPercent = false;
    }
  }

  onEvent(event, data) {   //triggered when user unchecks the shared win checkbox for disabled comp (Wipro) | (click) event
    for (var j = 0; j < this.CompetitorDisable.length; j++) {
      if (data.WiproSharedwin) {
        console.log("Check what the data is?", this.CompetitorDisable[j].WiproSharedwin);
        let message = "Please uncheck Shared Win for all other competitors.";
        let action;
        this.snackBar.open(message, action, { duration: 3000, });
      }
    }
  }

  opportunityWiproSharedwinChangeDisable(event, data) { //triggered when user checks the shared win checkbox for disabled comp | (change) event
    debugger;
    if (event.checked == false) {
      data.WiproSharepercentage = '';
      data.errortext_conditionSharedPercent = false;
    }
    if (data.WiproCompetitoridname == "Wipro") {
      let message = "Please uncheck Shared Win for all other competitors.";
      let action;
      this.snackBar.open(message, action, { duration: 3000, });
    }

    for (var j = 0; j < this.CompetitorDisable.length; j++) {
      if (this.CompetitorDisable[j].WiproCompetitoridname == "Wipro") {
        this.CompetitorDisable[j].WiproSharedwin = true;
        //this.checkToggle.setValue("true");
      }

    }
  }

  openotherComp(data) {  //opens a dialog box when user clicks on 'Others' in add comp dropdown.
    const dialogRef = this.dialog.open(OthercompetitorComponent,
      {
        width: '350px'
      });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        debugger;
        var flag = 0;

        //EnableComp check
        for (var j = 0; j < this.CompetitorEnable.length; j++) {
          if (this.CompetitorEnable[j].WiproCompetitoridname == 'Others') {
            if ((this.CompetitorEnable[j].wiprocompetitorname).trim().toLowerCase() == result.trim().toLowerCase()) {
              var message = "This Competitor is already selected";
              this.OpportunityServices.displayMessageerror(message);
              flag = 1;
            }
          }
        }

        for (var j = 0; j < this.CompetitorEnable.length; j++) {
          if ((this.CompetitorEnable[j].WiproCompetitoridname.trim()).toLowerCase() == result.trim().toLowerCase()) {
            // if (this.CompetitorEnable[j].WiproCompetitoridname == result) {
            var message = "This Competitor is already selected";
            this.OpportunityServices.displayMessageerror(message);
            flag = 1;
          }
        }


        //DisableComp Check
        for (var j = 0; j < this.CompetitorDisable.length; j++) {
          if ((this.CompetitorDisable[j].WiproCompetitoridname).trim().toLowerCase() == result.trim().toLowerCase()) {
            // if (this.CompetitorEnable[j].WiproCompetitoridname == result) {
            var message = "This Competitor is already selected";
            this.OpportunityServices.displayMessageerror(message);
            flag = 1;
          }
        }

        if (flag == 0) {
          for (var j = 0; j < this.wiprocompetitorDataInitial.length; j++) {
            if (this.wiprocompetitorDataInitial[j].Name == "Others") {
              data.WiproCompetitorid = this.wiprocompetitorDataInitial[j].SysGuid;
              data.WiproOpportunityid = this.OpportunityServices.getSession('opportunityId');
              break;
            }
          }
          data.WiproCompetitoridname = "Others";
          data.wiprocompetitorname = result;
        }
      }
    });

  }
  randomString(length, chars) { //to create a random string and push in the comp array (form validation)
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
  }

  addcompetitor() { //triggered when user clicks on 'Add competitor' button
    debugger;

    if (this.CompetitorEnable.length == 0) {
      let rank_count = this.CompetitorEnable.length;
      this.CompetitorEnable.push(
        {
          "CompName": "CompName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Incubant": "Incubant" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Currentscopeshare": "Currentscopeshare" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Longlisted": "Longlisted" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Shortlisted": "Shortlisted" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Sharedwin": "Sharedwin" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Sharepercentage": "Sharepercentage" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Winningparty": "Winningparty" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",

          "CompNameDiable": "CompNameDiable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "IncumbentDisable": "IncumbentDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "CurrentscopeshareDisable": "CurrentscopeshareDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "longlistedDisable": "longlistedDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "ShortlistedDisable": "ShortlistedDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "SharedwinDisable": "SharedwinDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "SharepercentageDisable": "SharepercentageDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "WinningpartyDisable": "WinningpartyDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Rank": (rank_count + 1),
          "actions": true,
          "disabled": false,
          "isCheccked": false,
          "WiproCompetitoridname": "",
          "WiproCurrentscopeshare": null,
          "WiproIncumbent": false,
          "WiproLonglisted": false,
          "WiproSharedwin": false,
          "WiproSharepercentage": null,
          "WiproShortlisted": false,
          "WiproWinningparty": false,
          "wiprocompetitorname": null,
          "errortext_conditionCompName": false,
          "errorborder_conditionCompName": false,
          "WiproCompetitorid": '',
          "longlistDisable": false,
          "shortlistDisable": false,
          "longlistInhouseDisable": false,
        }
      )
    }
    else {
      let rank_count = this.CompetitorEnable.length;
      this.CompetitorEnable.push(
        {
          "CompName": "CompName" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Incubant": "Incubant" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Currentscopeshare": "Currentscopeshare" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Longlisted": "Longlisted" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Shortlisted": "Shortlisted" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Sharedwin": "Sharedwin" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Sharepercentage": "Sharepercentage" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Winningparty": "Winningparty" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",

          "CompNameDiable": "CompNameDiable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "IncumbentDisable": "IncumbentDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "CurrentscopeshareDisable": "CurrentscopeshareDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "longlistedDisable": "longlistedDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "ShortlistedDisable": "ShortlistedDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "SharedwinDisable": "SharedwinDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "SharepercentageDisable": "SharepercentageDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "WinningpartyDisable": "WinningpartyDisable" + this.randomString(32, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "SavedData" + "fb00ae34-d473-e911-a830-000d3aa058cb",
          "Rank": (rank_count + 1),
          "actions": true,
          "disabled": false,
          "isCheccked": false,
          "WiproCompetitoridname": "",
          "WiproCurrentscopeshare": null,
          "WiproIncumbent": false,
          "WiproLonglisted": false,
          "WiproSharedwin": false,
          "WiproSharepercentage": null,
          "WiproShortlisted": false,
          "WiproWinningparty": false,
          "wiprocompetitorname": null,
          "errortext_conditionCompName": false,
          "errorborder_conditionCompName": false,
          "WiproCompetitorid": '',
          "longlistDisable": false,
          "shortlistDisable": false,
          "longlistInhouseDisable": false,
        }
      )
    }
    var count = 0;
    console.log("res2345678901222", this.CompetitorEnable)
    for (var k = 0; k < this.CompetitorEnable.length; k++) {
      if (this.CompetitorEnable[k].WiproCompetitorid != "") {
        count += 1;
        break;
      }
    }
    if (count == 0) {
      this.CompetitorDataMoveDisable = false;
    }
    else {
      this.CompetitorDataMoveDisable = true;
    }
  }

  deletecompetitor(WiproCompetitorid, id, Rank, index) {  //To delete a competitor

    let compArray1 = [];
    if (WiproCompetitorid == undefined) {
      this.CompetitorEnable.splice(index, 1);;
      let compArray = [];
      compArray = this.CompetitorEnable;
      for (var i = 0; i < compArray.length; i++) {
        compArray[i].Rank = i + 1;
      }
      this.CompetitorEnable = compArray;

      if (this.CompetitorEnable.length == 0) {
        for (let m = 0; m < this.CompetitorDisable.length; m++) {
          if (this.CompetitorDisable[m].WiproCompetitoridname == "Wipro") {
            this.CompetitorDisable[i].WiproSharepercentage = null;
            this.CompetitorDisable[i].WiproSharedwin = false;
          }
        }
        let message = "Since sole source is selected as No, you must fill atleast one competitor details to move forward";
        let action;
        this.snackBar.open(message, action, {
          duration: 6000,
        })

        this.addcompetitor();
      }

    }
    else {
      let obj = WiproCompetitorid;
      this.service.loaderhome = true;
      this.OpportunityServices.deleteOpportunitCompetitor(obj).subscribe(res => {
        this.service.loaderhome = false;
        debugger;
        if (res.IsError == false) {
          if (res.ResponseObject == null) {
            let message = 'Oops! There seems to be some technical snag! Could you raise a Helpline ticket?'
            this.OpportunityServices.displayMessageerror(message);
          }
          else {
            //this.userFrm.form.markAsDirty();
            let message = "Competitor Deleted Successfully ";
            this.OpportunityServices.displayMessageerror(message);
            this.CompetitorEnable.splice(index, 1);
            let compArray = [];
            compArray = this.CompetitorEnable;
            for (var i = 0; i < compArray.length; i++) {
              compArray[i].Rank = i + 1;
            }
            this.CompetitorEnable = compArray;
            if (this.CompetitorEnable.length == 0) {
              for (let m = 0; m < this.CompetitorDisable.length; m++) {
                if (this.CompetitorDisable[m].WiproCompetitoridname == "Wipro") {
                  this.CompetitorDisable[i].WiproSharepercentage = null;
                  this.CompetitorDisable[i].WiproSharedwin = false;
                }
              }
              let message = "Since sole source is selected as No, you must fill atleast one competitor details to move forward";
              let action;
              this.snackBar.open(message, action, {
                duration: 6000,
              })
              this.addcompetitor();
            }
          }
        }
        else {
          this.OpportunityServices.displayerror(res.ApiStatusCode);
        }
      },
        err => {
          this.service.loaderhome = false;
          let message = "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?";
          this.OpportunityServices.displayMessageerror(message);
        })
    }
    debugger;
    var count = 0;
    console.log("res2345678901222", this.CompetitorEnable)
    for (var k = 0; k < this.CompetitorEnable.length; k++) {
      if (this.CompetitorEnable[k].WiproCompetitorid != "") {
        count += 1;
        break;
      }
    }
    if (count == 0) {
      this.CompetitorDataMoveDisable = false;
    }
    else {
      this.CompetitorDataMoveDisable = true;
    }
  }

  movedown(index) {  //To move a competitor one position down
    debugger;
    if (this.CompetitorEnable.length != 1) {
      this.tempdown[0] = this.CompetitorEnable[index];
      this.CompetitorEnable[index] = this.CompetitorEnable[index + 1];
      this.CompetitorEnable[index + 1] = this.tempdown[0];
      this.userFrm.form.markAsDirty();
    }
    let compArray = [];
    compArray = this.CompetitorEnable;
    for (var i = 0; i < compArray.length; i++) {
      compArray[i].Rank = i + 1;
    }
    this.CompetitorEnable = compArray;
  }

  moveup(index) {   //To move a competitor one position up

    debugger;
    if (this.CompetitorEnable.length != 1) {
      this.tempdown[0] = this.CompetitorEnable[index];
      this.CompetitorEnable[index] = this.CompetitorEnable[index - 1];
      this.CompetitorEnable[index - 1] = this.tempdown[0];
      this.userFrm.form.markAsDirty();
    }
    let compArray = [];
    compArray = this.CompetitorEnable;
    for (var i = 0; i < compArray.length; i++) {
      compArray[i].Rank = i + 1;
    }
    this.CompetitorEnable = compArray;
  }

  // competitor name autocomplete starts here
  competitorName: string = "";
  competitorNameSwitch: boolean = true;

  competitorNameclose(data) { //to validate added competitor once user enters the name and clicks outside the input box.
    // debugger;
    if (this.wiprocompetitorDataInitial.length == 0) {
      data.WiproCompetitoridname = '';
    }
    else {
      var flag = 0;
      for (var j = 0; j < this.wiprocompetitorDataInitial.length; j++) {
        if (this.wiprocompetitorDataInitial[j].Name == data.WiproCompetitoridname) {
          flag = 1;
          break;
        }
      }
      if (flag == 0) {
        data.WiproCompetitoridname = '';
      }
    }

    data.competitorNameSwitch = false;
  }

  competitorNameSwitchClick(data) { //triggered when user clicks on the input box
    this.wiprocompetitorData = this.wiprocompetitorDataInitial.filter(comp => comp.Name != 'Others');
    for (let k = 0; k < this.CompetitorEnable.length; k++) {
      if (this.CompetitorEnable[k].WiproCompetitoridname == '') {
        this.CompetitorEnable[k].errortext_conditionCompName = false;
        this.CompetitorEnable[k].errorborder_conditionCompName = false;
      }
    }

    data.competitorNameSwitch = true
  }
  appendcompetitor(item, data, ind) {  //add a new competitor in input box.
    debugger;
    if (ind > this.wiprocompetitorData.length) {
      this.openotherComp(data);
    }
    else {
      var flag = 0;
      for (var j = 0; j < this.CompetitorEnable.length; j++) {
        if (this.CompetitorEnable[j].WiproCompetitoridname == item.Name) {
          // alert("This Competitor is already selected")
          var message = "This Competitor is already selected";
          this.OpportunityServices.displayMessageerror(message);
          flag = 1;
        }
      }


      for (var j = 0; j < this.CompetitorEnable.length; j++) {
        if (this.CompetitorEnable[j].WiproCompetitoridname == 'Others') {
          if ((this.CompetitorEnable[j].wiprocompetitorname).trim().toLowerCase() == item.Name.trim().toLowerCase()) {
            var message = "This Competitor is already selected";
            this.OpportunityServices.displayMessageerror(message);
            flag = 1;
          }
        }
      }

      if (flag == 0) {
        data.WiproCompetitoridname = item.Name;
        data.WiproCompetitorid = item.SysGuid;

        data.WiproOpportunityid = this.OpportunityServices.getSession('opportunityId');
        this.userFrm.form.markAsDirty();
      }
      data.competitorNameSwitch = false;
    }
  }

  opportunityCompetitorradioClick() {   //User clicks on sole source "Yes" radio button
    debugger;
    // this.solesoureToggle.setValue("No")
    if (this.disableOnAccess != true) {
      var flag = 0;
      for (let i = 0; i < this.CompetitorEnable.length; i++) {
        if (this.CompetitorEnable[i].WiproCompetitoridname != '' || this.CompetitorEnable[i].WiproCompetitorid != '') {
          flag = 1;
        }
      }
      if (flag == 1) {

        this.opportunityCompetitorradio(true)
      }
      else {
        this.CompetitorEnable = [];
        this.opportunityCompetitorradio(true)
      }
    }

  }

  togSuccess = false;
  opportunityCompetitorradioClick1() {  //User clicks on sole source "No" radio button
    debugger;
    if (this.disableOnAccess != true) {
      this.opportunityCompetitorradio(false)
    }
  }
  opportunityCompetitorradio(event: any) {   //(change) event | triggered when sole source value is changed
    debugger;
    // this.CompetitorEnable.splice(0,1);
    var flagINhouse = 0;
    for (let m = 0; m < this.CompetitorDisable.length; m++) {
      if (this.CompetitorDisable[m].WiproCompetitoridname == "In-house" || this.CompetitorDisable[m].WiproCompetitoridname == "In House") {
        if (this.CompetitorDisable[m].WiproCurrentscopeshare != null) {
          flagINhouse = 1;
        }
      }
    }
    if (flagINhouse == 1) {
      this.solesoureToggle.setValue("No")
      let message = "In-house has Scope share, Sole Source is not applicable";
      this.OpportunityServices.displayMessageerror(message);
    }
    else {
      if (event == true) {
        if (this.CompetitorEnable.length != 0) {
          this.solesoureToggle.setValue("No")
          let message = "Competitor details are available. Sole Source is not applicable";
          this.OpportunityServices.displayMessageerror(message);
          this.SoleSourceOpp = false;
        }
        else {
          for (let m = 0; m < this.CompetitorDisable.length; m++) {
            if (this.CompetitorDisable[m].WiproCompetitoridname == "In-house" || this.CompetitorDisable[m].WiproCompetitoridname == "In House") {
              this.CompetitorDisable[m].WiproShortlisted = false
              this.CompetitorDisable[m].WiproIncumbent = false;
              this.CompetitorDisable[m].disableInhouseYes = true;
            }
          }
          this.togSuccess = true;
          this.solesoureToggle.setValue("Yes")
          this.SoleSourceOpp = true;
          //  this.disableOnAccess=true;
          for (let k = 0; k < this.CompetitorEnable.length; k++) {
            if (this.CompetitorEnable[k].WiproCompetitoridname == '') {
              this.CompetitorEnable[k].errortext_conditionCompName = false;
              this.CompetitorEnable[k].errorborder_conditionCompName = false;
            }
            this.CompetitorEnable[k].errortext_conditionCurrentScope = false;
            this.CompetitorEnable[k].errortext_conditionSharedPercent = false;
          }

          for (let m = 0; m < this.CompetitorDisable.length; m++) {
            this.CompetitorDisable[m].WiproSharedwin = false;
            this.CompetitorDisable[m].errortext_conditionCurrentScope = false;
            this.CompetitorDisable[m].errortext_conditionSharedPercent = false;
          }
          console.log("CompetitorDisableCompetitorDisable", this.CompetitorDisable)

          console.log("CompetitorDisableCompetitorDisable", this.CompetitorDisable)

          // this.cancelClick();
        }

      }
      else {
        if (this.CompetitorEnable.length == 0) {
          this.addcompetitor();
        }
        this.togSuccess = true;
        this.solesoureToggle.setValue("No")
        this.SoleSourceOpp = false;
        // this.disableOnAccess=false;
        if (this.CompetitorEnable.length == 0) {
          // alert("Mandate to have one record")
          let message = "Since sole source is selected as No, you must fill atleast one competitor details to move forward";
          this.OpportunityServices.displayMessageerror(message);
        }
        for (let m = 0; m < this.CompetitorDisable.length; m++) {
          if (this.CompetitorDisable[m].WiproCompetitoridname == "In-house" || this.CompetitorDisable[m].WiproCompetitoridname == "In House") {
            this.CompetitorDisable[m].disableInhouseYes = false;
          }
        }
        // this.cancelClick();
      }
    }

  }

  opportunityCompetitorToggle(event, data) {   // Wipro Incumbent Toggle | EnabledComp
    if (event.checked == false) {
      data.WiproCurrentscopeshare = null;
      data.errortext_conditionCurrentScope = false;
    }
  }
  opportunityCompetitorToggleDisable(event, data) {  // Wipro Incumbent Toggle | DisabledComp
    if (event.checked == false) {
      data.WiproCurrentscopeshare = null;
      data.errortext_conditionCurrentScope = false;
    }
  }

  changeLookUp(data) {     //Search Competitor in dropdown
    debugger;
    if (data.WiproCompetitoridname == "Others") {
      for (var i = 0; i < this.CompetitorEnable.length; i++) {
        if (this.CompetitorEnable[i].WiproCompetitoridname == data.WiproCompetitoridname) {
          if (this.CompetitorEnable[i].wiprocompetitorname == data.wiprocompetitorname) {
            this.CompetitorEnable[i].WiproCompetitoridname = '';
            this.CompetitorEnable[i].wiprocompetitorname = null;
          }
        }
      }
    }
    let obj = {
      "SearchText": data.WiproCompetitoridname
    }
    this.OpportunityServices.searchOpportunitCompetitor(obj).subscribe(res => {
      if (res.IsError == false) {
        if (res.ResponseObject == null) {
          let message = 'No record found'
          this.OpportunityServices.displayMessageerror(message);
        } else {
          var a = res.ResponseObject.filter(comp => comp.Name != 'Others');
          this.wiprocompetitorData = a;
        }
      }
      else {
        this.OpportunityServices.displayerror(res.ApiStatusCode);
      }
    },
      err => {
        let message = "Oops! There seems to be some technical snag! Could you raise a Helpline ticket?";
        this.OpportunityServices.displayMessageerror(message);

      })
  }

  changeCurrentScopeShareEnableClick(data) {   // on click of current scope share % box | EnabledComp
    data.errortext_conditionCurrentScope = false;
    data.errorborder_conditionCurrentScope = false;
  }

  changeCurrentScopeShareDisableClick(data) {   // on click of current scope share % box | DisabledComp
    data.errortext_conditionCurrentScope = false;
    data.errorborder_conditionCurrentScope = false;
  }
  changeWiproSharepercentageEnableClick(data) {   // on click of Share % box | EnabledComp
    data.errortext_conditionSharedPercent = false;
    data.errorborder_conditionSharedPercent = false;
  }
  changeWiproSharepercentageDisableClick(data) {  // on click of Share % box | DisabledComp
    data.errortext_conditionSharedPercent = false;
    data.errorborder_conditionSharedPercent = false;
  }

  fixDecimal(data) {    //fix decimal for current scope share %  |EnabledComp
    data.errortext_condition = false;
    let tempLicenceValue: any = data.WiproCurrentscopeshare.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    data.WiproCurrentscopeshare = tempLicenceValue ? tempLicenceValue[0].toString() : "";
  }

  fixDecimal1(data) {  //fix decimal for Share %
    let tempLicenceValue: any = data.WiproSharepercentage.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    data.WiproSharepercentage = tempLicenceValue ? tempLicenceValue[0].toString() : "";
  }

  fixDecimalDisable(data) {    //fix decimal for current scope share % |DisabledComp
    data.errortext_condition = false;
    let tempLicenceValue: any = data.WiproCurrentscopeshare.match(/^[0-9]+(\.[0-9]*){0,1}$/g);
    data.WiproCurrentscopeshare = tempLicenceValue ? tempLicenceValue[0].toString() : "";

  }

  changeCurrentScopeShareEnable(data) {  // triggered when user enters and clicks outside the current scope share % box|EnabledComp
    console.log("data.WiproCurrentscopeshareEnable", data.WiproCurrentscopeshare)
    if (data.WiproCurrentscopeshare != null && data.WiproIncumbent == true) {
      if (!(data.WiproCurrentscopeshare > 0 && data.WiproCurrentscopeshare <= 100)) {
        data.WiproCurrentscopeshare = null;
        data.errortext_conditionCurrentScope = true;
        data.errorborder_conditionCurrentScope = true;
      }
    }
  }

  changeCurrentScopeShareDisable(data) {  //triggered when user enters and clicks outside the current scope share % box |DisabledComp
    debugger;
    console.log("data.WiproCurrentscopeshareDisable", data.WiproCurrentscopeshare)
    if (data.WiproCurrentscopeshare != null && data.WiproIncumbent == true) {
      if (!(data.WiproCurrentscopeshare > 0 && data.WiproCurrentscopeshare <= 100)) {
        data.WiproCurrentscopeshare = null;
        data.errortext_conditionCurrentScope = true;
        data.errorborder_conditionCurrentScope = true;
      }
    }
  }

  changeWiproSharepercentageEnable(data) {   //triggered when user enters and clicks outside the Share % box | EnabledComp
    console.log("data.WiproSharePerce", data.WiproSharePercentage)
    if (data.WiproSharepercentage != null && data.WiproSharedwin == true) {
      if (!(data.WiproSharepercentage > 0 && data.WiproSharepercentage <= 100)) {
        data.WiproSharepercentage = null;
        data.errortext_conditionSharedPercent = true;
        data.errorborder_conditionSharedPercent = true;
      }
    }
  }

  changeWiproSharepercentageDisable(data) {   //triggered when user enters and clicks outside the Share % box | DisabledComp
    console.log("data.WiproSharePerceDisable", data.WiproSharePercentage)
    if (data.WiproSharepercentage != null && data.WiproSharedwin == true) {
      if (!(data.WiproSharepercentage > 0 && data.WiproSharepercentage <= 100)) {
        data.WiproSharepercentage = null;
        data.errortext_conditionSharedPercent = true;
        data.errorborder_conditionSharedPercent = true;
      }
    }
  }

  enableCheckFlag = false;
  enableCheck() {    //To auto check 'Wipro Shared Win' checkbox if any 'enabledComp shared win' option is checked.
    this.enableCheckFlag = false;
    console.log("this.CompetitorEnable", this.CompetitorEnable);
    for (let m = 0; m < this.CompetitorEnable.length; m++) {
      if (this.CompetitorEnable[m].WiproSharedwin == true) {
        console.log("Competitor Enable Check", this.CompetitorEnable[m].WiproSharedwin);
        this.enableCheckFlag = true;
      }
    }

    if (this.enableCheckFlag) {
      for (let m = 0; m < this.CompetitorDisable.length; m++) {
        if (this.CompetitorDisable[m].WiproCompetitoridname == "Wipro") {
          this.CompetitorDisable[m].WiproSharedwin = true;
        }
      }
    }
    else {
      for (let m = 0; m < this.CompetitorDisable.length; m++) {
        if (this.CompetitorDisable[m].WiproCompetitoridname == "Wipro") {
          this.CompetitorDisable[m].WiproSharedwin = false;
          this.CompetitorDisable[m].WiproSharepercentage = null;
          this.CompetitorDisable[m].errortext_conditionSharedPercent = false;
          this.CompetitorDisable[m].errorborder_conditionSharedPercent = false;
        }
      }
    }
  }

  selectedcompetitor: {}[] = [];
  // competitor name autocomplete ends here
}