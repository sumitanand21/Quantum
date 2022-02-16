import { Component, OnInit } from '@angular/core';
import { OpportunitiesService} from '@app/core';

@Component({
  selector: 'app-servicelinepopup',
  templateUrl: './servicelinepopup.component.html',
  styleUrls: ['./servicelinepopup.component.scss']
})
export class ServicelinepopupComponent implements OnInit {

  constructor(public projectService: OpportunitiesService) { }
  
  popup_data:any;
  final_data:any={};
  overAllTcvObj:any={
    "OppTcv":"",
    "DPSTcv":"",
    "DPSTcvNew":"",
    "isCurrencyMismatch":false,
    "difference":"0"
  };
  overallServicelineData:any=[];
  overallIpData:any=[];
  DPSCurrencySymbol:any;
  DPSCurrencyValue:any;

  ngOnInit() {
    console.log("popup",this.popup_data);
    if(this.popup_data.OppBSP)
    {
      this.getOverallTcvComparison(this.popup_data.OppBSP);
    }
    if(this.popup_data.WiproServiceLineDtls.length>0)
    {
      this.getServiceLineData(this.popup_data.WiproServiceLineDtls);
    }
    if(this.popup_data.WiproAllIPDetails.length>0)
    {
      this.getIpData(this.popup_data.WiproAllIPDetails);
    }

  }

  getOverallTcvComparison(data)
  {
    this.overAllTcvObj.OppTcv=this.getCurrencyData(data.TraceTCV);
    this.overAllTcvObj.DPSTcv=this.getCurrencyData(data.DPSTCV);
    this.DPSCurrencySymbol = this.getCurrencyData(data.DPSCurrencySymbol);
    this.DPSCurrencyValue = this.overAllTcvObj.DPSTcv.split(' ')[1].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    console.log("dpass",this.DPSCurrencyValue)
    this.overAllTcvObj.DPSTcvNew = this.DPSCurrencySymbol+" "+this.DPSCurrencyValue;
    console.log("dpass",this.overAllTcvObj.DPSTcvNew)
    this.overAllTcvObj.isCurrencyMismatch=data.IsTraceDPSCurrencyMismatch;    
    if(data.IsTraceDPSCurrencyMismatch)
    {
      this.overAllTcvObj.difference="Currency mismatch";
    }
    else
    {
      let CurrencySymbol= this.getCurrencyData(this.projectService.getSession("currencySymbol"));
      let diff=this.formatData(data.TCVDifference);
      this.overAllTcvObj.difference=CurrencySymbol+" "+diff;
    }
  }


  getServiceLineData(data){

  for(var i=0;i<data.length;i++)
  {
    let overallServicelineDataObj={
       "Serviceline":data[i].WiproServicelineidValueName,
       "Practice":data[i].WiproPracticeName,
       "SubPractice":data[i].WiproSubpracticeName,
       "TraceValue":0,
       "DPSValue":0,
       "highlightRow":false,
       "isSame":false
    }

    if(data[i].WiproEstsltcv>=0 && data[i].WiproDPSEstTCV>=0)
    {
      console.log("present in both");
      overallServicelineDataObj.DPSValue=data[i].WiproDPSEstTCV;
      overallServicelineDataObj.TraceValue=data[i].WiproEstsltcv;
      if(!this.overAllTcvObj.isCurrencyMismatch && overallServicelineDataObj.DPSValue == overallServicelineDataObj.TraceValue)
      {
        overallServicelineDataObj.isSame=true;
      }
    }
    else
    {
      overallServicelineDataObj.highlightRow=true;
      if(data[i].WiproEstsltcv)
      {
        overallServicelineDataObj.TraceValue=data[i].WiproEstsltcv;
      }
       if(data[i].WiproDPSEstTCV)
      {
        overallServicelineDataObj.DPSValue=data[i].WiproDPSEstTCV;
      }
      
    }

    overallServicelineDataObj.DPSValue = this.formatData(overallServicelineDataObj.DPSValue);
    overallServicelineDataObj.TraceValue = this.formatData(overallServicelineDataObj.TraceValue);
    this.overallServicelineData.push(overallServicelineDataObj);
  }
  console.log("ser",this.overallServicelineData)
}

formatData(data)
{
  return data.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

  getIpData(data)
  {
    for(var i=0;i<data.length;i++)
      {
        let overallIpDataObj={
          "ipName":data[i].IpName,
          "moduleName":data[i].WiproModuleName,
          "wiproAMCvalue":0,
          "wiproLicenseValue":0,
          "wiproDPSAMCvalue":0,
          "wiproDPSLicenseValue":0,
          "isAMCsame":false,
          "isLicenseSame":false,
          "highlightRow":false
        }

        if(data[i].WiproAmcvalue>=0 && data[i].WiproDPSAMCValue>=0)
        {
          console.log("present in both",data[i]);
          overallIpDataObj.wiproAMCvalue=data[i].WiproAmcvalue;
          overallIpDataObj.wiproLicenseValue=data[i].WiproLicenseValue;
          overallIpDataObj.wiproDPSAMCvalue=data[i].WiproDPSAMCValue;
          overallIpDataObj.wiproDPSLicenseValue=data[i].WiproDPSLicenseValue;
          if(data[i].WiproAmcvalue == data[i].WiproDPSAMCValue)
          {
            overallIpDataObj.isAMCsame=true;
          }
           if(data[i].WiproLicenseValue == data[i].WiproDPSLicenseValue)
          {
            overallIpDataObj.isLicenseSame=true;
          }
        }
        else
        {
          overallIpDataObj.highlightRow=true;
          if(data[i].WiproAmcvalue>=0)
          {
            overallIpDataObj.wiproAMCvalue=data[i].WiproAmcvalue;
            overallIpDataObj.wiproLicenseValue=data[i].WiproLicenseValue;
          }
          if(data[i].WiproDPSAMCValue>=0)
          {
            overallIpDataObj.wiproDPSAMCvalue=data[i].WiproDPSAMCValue;
            overallIpDataObj.wiproDPSLicenseValue=data[i].WiproDPSLicenseValue;
          }          
        }
        overallIpDataObj.wiproAMCvalue = this.formatData(overallIpDataObj.wiproAMCvalue);
        overallIpDataObj.wiproLicenseValue = this.formatData(overallIpDataObj.wiproLicenseValue);
        console.log("ssss",overallIpDataObj)
        console.log("ssss",overallIpDataObj.wiproDPSLicenseValue)
        overallIpDataObj.wiproDPSAMCvalue = this.formatData(overallIpDataObj.wiproDPSAMCvalue);
        overallIpDataObj.wiproDPSLicenseValue = this.formatData(overallIpDataObj.wiproDPSLicenseValue);
        this.overallIpData.push(overallIpDataObj);
      }
      console.log("IP",this.overallIpData)
  }

  getCurrencyData(data) {
    return unescape(JSON.parse('"' + data + '"')).replace(/\+/g, ' ');;
  }
  


}
