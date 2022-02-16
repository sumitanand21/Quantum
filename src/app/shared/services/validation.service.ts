import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidationService {
  //Sprint 3 Code starts 
  emailFormat = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";
  phoneFormat = "[0-9]{10}$";
  validEmail: boolean;
  validPhone: boolean;
  emailChars: number = 0;
  phoneChars: number = 0;

  CRMvalueRange = {
    'contact_contactno': { 'type': 'number', 'min': 1, 'max': 1000000000000000000 },
    'fortuneranking': { 'type': 'number', 'min': 1, 'max': 1000 },
    'trendsnanalysis_forbes1000rank': { 'type': 'number', 'min': 1, 'max': 1000 },
    'grossprofit': { 'type': 'float', 'min': 1, 'max': 100000000000 },
    'trendsnanalysis_profit': { 'type': 'float', 'min': 1, 'max': 100000000000 },
    'revenue': { 'type': 'float', 'min': 1, 'max': 100000000000 },
    'operatingmargin': { 'type': 'float', 'min': 1, 'max': 100000000000 },
    'marketvalue': { 'type': 'float', 'min': 1, 'max': 100000000000 },
    'returnonequity': { 'type': 'float', 'min': 1, 'max': 100000000000 },
    'creditscore': { 'type': 'number', 'min': 1, 'max': 900 },
    'trendsnanalysis_noofcbu': { 'type': 'number', 'min': 0, 'max': 10000 }
  };
  //Sprint 3 Code ends 
  public static getValidationErrorMessage(validatorName: string, validatorValue?: any, labelName?: string): any {
    const config = {
      required: `Field is required.`,
      invalidPassword: 'Invalid password. Password must be at least 6 characters long, and contain a number.',
      maxlength: `The field can't contain more than ${validatorValue.requiredLength} characters.`,
      minlength: `The field must contain atleast ${validatorValue.requiredLength} characters.`
    };

    return config[validatorName];
  }

  public static passwordValidator(control: AbstractControl): any {
    if (!control.value) { return; }

    return (control.value.match(/^(?=.*\d)(?=.*[a-zA-Z!@#$%^&*])(?!.*\s).{6,100}$/)) ? '' : { invalidPassword: true };
  }

  //Sprint 3 Code starts 

  onChange(type, newValue) {
    switch (type) {
      case 'phone':
        this.phoneChars = newValue.length;
        if (this.phoneFormat.match(newValue)) {
          this.validPhone = true;
        } else {
          this.validPhone = false;
        }
        break;
      case 'email':
        this.emailChars = newValue.length;
        if (this.emailFormat.match(newValue)) {
          this.validEmail = true;
        } else {
          this.validEmail = false;
        }
        break;
    }

  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }
  floatNumber(event, val): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;

    console.log(event, val, charCode);
    if ((charCode >= 48 && charCode <= 57) || (charCode == 46 && !val.includes('.'))) {
      console.log(charCode);
      return true;
    }
    else {
      return false;
    }
    // if (charCode > 31 && (charCode < 48 || charCode > 57 || (charCode != 190 && isDot != -1))) {
    //   return false;
    // }
    // return true;
  }

  // added by kunal
  deleteAfterDecimal(event, fromName, ind, val, attrname) {
    let isDigits = false;
    console.log(this.CRMvalueRange, this.CRMvalueRange[attrname], attrname, val);

    setTimeout(() => {
      if (parseFloat(event.target.value) == NaN && event.type == 'paste') {
        event.target.value = val;
        if (fromName && (ind != -1 || ind != '')) {
          fromName.controls[ind].setValue(val);
        }
        return event.target.value;
      }
      else {

        let KeyID = event.keyCode;
        const charCode = (event.which) ? event.which : event.keyCode;
        const ctrl = event.ctrlKey ? event.ctrlKey : ((charCode === 17) ? true : false);
        console.log(event, val, event.target.value, event.target.type, ctrl);
        if (this.CRMvalueRange[attrname].type == 'float')
          isDigits = /^(?:\d*\.\d{1,2}|\d+)$/.test(event.target.value) || /^-(?:\d*\.\d{1,2}|\d+)$/.test(event.target.value) || /^-?\d+$/.test(event.target.value) || /^\d+$/.test(event.target.value);
        else if (this.CRMvalueRange[attrname].type == 'number')
          isDigits = /^-?\d+$/.test(event.target.value) || /^\d+$/.test(event.target.value);

        console.log(isDigits);
        // /^-?\d{2}(\.\d+)?$/
        if (KeyID == 8 || KeyID == 46 || event.type == 'cut' || event.type == 'paste') {
          if (val && val.includes('.') && !event.target.value.includes('.') && parseFloat(event.target.value) > this.CRMvalueRange[attrname].max) {
            console.log(event, "fdsa", val.split('.')[0]);
            if (fromName && (ind != -1 || ind != '')) {
              fromName.controls[ind].setValue(parseFloat(val.split('.')[0]));
            }
            event.target.value = parseFloat(val.split('.')[0]);
            val = parseFloat(val.split('.')[0]);
            return event.target.value;//parseFloat(val.split('.')[0]);
          }
          else {
            return event.target.value;
          }
        }
        if (charCode == 86 && ctrl && isDigits && parseFloat(event.target.value) <= this.CRMvalueRange[attrname].max && parseFloat(event.target.value) >= this.CRMvalueRange[attrname].min) {
          if (fromName && (ind != -1 || ind != '')) {

            fromName.controls[ind].setValue(event.target.value);
            console.log("dfsaDFS");

          }
          return parseFloat(event.target.value);
        }
        else if (charCode == 86 && ctrl && (!isDigits || parseFloat(event.target.value) > this.CRMvalueRange[attrname].max || parseFloat(event.target.value) < this.CRMvalueRange[attrname].min)) {
          if (fromName && (ind != -1 || ind != '')) {
            fromName.controls[ind].setValue('');
          }
          else
            event.target.value = '';
          return '';
        }
      }
    }, 0);
  }
  allEqual(input, key) {
    let allchar = input.toString().split('').every(char => char == key);
    if (allchar && input.toString().length > 12) {
      return true;
    }
    else {
      return false;
    }
  }
  maxValueValidation(event, val, attrname): boolean {
    console.log(this.CRMvalueRange, this.CRMvalueRange[attrname], attrname);
    // console.log(event, val, maxval, minval, event.target.value);
    console.log("evt", event.srcElement.selectionStart);

    if (this.CRMvalueRange[attrname].type == 'float') {
      let index = event.srcElement.selectionStart;
      let val1 = val.substring(0, index) + event.key + val.substring(index);
      console.log(val1, val1.indexOf('-'));

      if ((event.charCode == 45 && !val.includes('-') && val1.indexOf('-') == 0) || (event.charCode == 46 && !val.includes('.') && val1.indexOf('.') != 0) || (event.charCode >= 48 && event.charCode <= 57)) {
        console.log("val21", (parseFloat(val1.split('.')[1]) > 99), parseFloat(val1), parseFloat(val1) > this.CRMvalueRange[attrname].max, val1, val1.split('.')[1], parseFloat(val1) < this.CRMvalueRange[attrname].min);
        // if (parseFloat(val1) >= maxval || parseFloat(val1) < minval || (typeof val1.split('.')[1] == 'number' && (parseFloat(val1.split('.')[1]) > 99 || parseFloat(val1.split('.')[1]).toString().length >2))) {
        if (parseFloat(val1) > this.CRMvalueRange[attrname].max || (parseFloat(val1.split('.')[1]) > 99) || parseFloat(val1) < this.CRMvalueRange[attrname].min || this.allEqual(val1, 0)) {
          return false;
        }
        else {
          return true;
        }

      } else {
        return false;
      }
    }
    else {
      let index = event.srcElement.selectionStart;
      let val1 = val.substring(0, index) + event.key + val.substring(index);
      if ((this.CRMvalueRange[attrname].min < 0 && event.charCode == 45 && !val.includes('-') && val1.indexOf('-') == 0) || (event.charCode >= 48 && event.charCode <= 57)) {
        let index = event.srcElement.selectionStart;
        let val1 = val.substring(0, index) + event.key + val.substring(index);
        // console.log("val21", val1, parseFloat(val1.split('.')[1]));
        if (parseFloat(val1) > this.CRMvalueRange[attrname].max || parseFloat(val1) < this.CRMvalueRange[attrname].min) {
          return false;
        }
        else {
          return true;
        }

      } else {
        return false;
      }
    }

    // let val1 = val + event.key;
    // console.log(val1, parseFloat(val1));
    // if (val.includes('.') && parseFloat(val.split('.')[1]) < 99) console.log(parseFloat(val.split('.')[1]));
    //   if ((parseFloat(val1) <= maxval) || (event.key == '.' && val.indexOf['.'] != 0 && !val.includes('.')) && (val.includes('.') && parseFloat(val.split('.')[1]) <9)) {

    //     return true;
    //   }
    //   else {
    //     return false;
    //   }
    // }
    // if (val == maxval - 1 && event.key == '.') return false;
    // let val1 = val + event.key;
    // if (val.includes('.')) console.log(val.split('.')[1].length);
    // console.log(parseFloat(val1), val1, parseFloat(val1.split('.')[0]));
    // console.log(parseFloat(val1) <= maxval);
    // // if (val1.includes('.') && parseFloat(val1.split('.')[1]) > 99) console.log(parseFloat(val1.split('.')[1]));
    // const charCode = (event.which) ? event.which : event.keyCode;

    // if ((charCode >= 48 && charCode <= 57) || (charCode == 46 && !val.includes('.')) && val1.indexOf['.'] != 0) {
    //   // if ((parseFloat(val1) <= maxval) && !val.includes('.')) return true;
    //   // else return false;
    //   // if (val1.includes('.') && parseFloat(val1.split('.')[1]) > 9) return false;
    //   return true;
    // }
    // else return false;

  }

  //Sprint 3 Code ends 
}
export function websiteValidator(

  // /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(val);
  control: AbstractControl
): { [key: string]: any } | null {
  if (control.value) {
    const valid = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(control.value)
    return valid
      ? null
      : { invalidNumber: { valid: false, value: control.value } }
  }
  else {
    return null;
  }
}
