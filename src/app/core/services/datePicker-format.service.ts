import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';


@Injectable({
    providedIn: 'root'
  })

export class DatePickerFormat {

    constructor(private datePick : DatePipe ) {

    }
     dateFormat (datePick) {
       return this.datePick.transform(datePick, 'dd-MMM-yyyy')
    } 
    qualifiedDateFormat (datePick) {
        return this.datePick.transform(datePick, 'yyyy-MM-dd')
    }
}
