import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material";

@Injectable({ providedIn: "root" })
export class ErrorMessage {
  action: any;
  public offlineMessage: "You are not connected to Internet";
  constructor(public matSnackBar: MatSnackBar) {}

  public throwError(message,time?) {
    let period;
    if(time)
    period=time;
    else
    period=2500;
    this.matSnackBar.open(message, this.action, {
      duration: period
    });
  }

  public advanceLookupErr(res) {
    console.log("res.Message", res.Message)
    this.matSnackBar.open(res.Message, this.action, {
      duration: 2500
    });
    return res
  }

  public onSuccessMessage(message) {
   return this.matSnackBar.open(message, this.action, {
      duration: 2500
    });
  }
}
