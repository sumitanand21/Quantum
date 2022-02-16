import { AbstractControl, FormControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { of, Observable } from 'rxjs';
import * as moment from 'moment';

export function removeSpaces(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    console.log(">>>>>>>>>>>>>>>>." + isValid)
    return isValid ? null : { 'whitespace': true };
}

export function checkLimit(max: any): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        if (c.value && (c.value.length >= max)) {
            return { 'range': true };
        }
        return null;
    };
}

export function DescrLimit(max: any): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
        if (c.value && (c.value.length >= max)) {
            return { 'range': true };
        }
        return null;
    };
}

// export function specialCharacter(control: any): ValidatorFn {
//     return (control: AbstractControl): { [key: string]: boolean } | null => {
//         if (control.value !== null || control.value !== undefined) {

//             var k;
//             k = (control.value).charCode;  //         k = event.keyCode;  (Both can be used)
//             // return ((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57));
//             // // const regex = new RegExp(/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/);
//             if (((k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57))) {
//                 return { isError: true }
//             }
//         }
//         return null;
//     };
// }

   export function specialCharacter(control:AbstractControl) : { [key: string]: boolean } | null{
    if(control &&(control.value !==null || control.value !==undefined)){
        const regex = new RegExp (/^[^`~!@#$%\^&*()_+={}|[\]\\:';"<>?,./]*$/);
        if(!regex.test(control.value)){
            return{ isError : true}
        }
    }
    return null;
}

export function firstCharacter(control:AbstractControl) : { [key: string]: boolean } | null{ 
    if(control.value!= "" && control.value!= undefined && control.value!=null){ 
        var matchProperty = control.value;
        if (matchProperty.includes('`')) 
            if (matchProperty.match('`').index == 0) 
                return{ firstCharError : true}

        if (matchProperty.includes(','))
            if (matchProperty.match(',').index == 0) 
                return{ firstCharError : true}

        if (matchProperty.includes('.')) 
            if (matchProperty.match('.').index == 0) 
                return{ firstCharError : true}

        if (matchProperty.includes('-')) 
            if (matchProperty.match('-').index == 0) 
                return{ firstCharError : true}
    }
    return null;
}
   
  //  Please don't change this leadDecimalDealValue function, its used in Contact 
export function leadDecimalDealValue(control:AbstractControl) : { [key: string]: boolean } | null{
    if(control &&(control.value !==null || control.value !==undefined)){
        const regex = new RegExp (/^[^`~!@#$%\^&*_+={}|[\]\\:';"<>?,/]*$/);
        if(!regex.test(control.value)){
            return{ isError : true}
        }
    }
    return null;
}

export function alphaNumericDot(control:AbstractControl) : { [key: string]: boolean } | null{
    if(control &&(control.value !==null || control.value !==undefined)){
        const regex = new RegExp (/^[a-zA-Z0-9. ]*$/);
        if(!regex.test(control.value)){
            return{ isError : true}
        }
    }
    return null;
}

export function DateValidator(format = "DD-MMM-YYYY"): any {
    return (control: FormControl): { [key: string]: any } => {
      const val = moment(control.value, format, true);  
      if (!val.isValid()) {
        return { invalidDate: true };
      }  
      return null;
    };
  }

// export function advisorjunkCharacter(list,value) : ValidationErrors  | null{
//      if (value) {

//         return ( ! list.some(x=>x==x.Name ==value) ) ? null : {
//             advisorjunkCharacter: {
//               valid: false
//             }
//           }

//     }
//     return null;
// }




