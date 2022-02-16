import { Directive, HostListener, ElementRef, Input } from "@angular/core";
@Directive({
  selector: "[specialIsAlphaNumeric]"
})
export class SpecialCharacterDirective {
  isMobileDevice = window.innerWidth < 800 ? true : false;
  regexStr = "^[A-Za-z][0-9A-Za-z ,.'`-]{0,100}$";
  regexAlphanumaric = "^[A-Za-z0-9][0-9A-Za-z ,.@*'`-]{0,100}$";
  regexNum = "^[0-9]$";
  regexMob = "[0-9+-]$";
  regexDec = /^(\d*\.)?\d+$/gim;
  regextext = "^.{1,2000}$";
  regexDecWithNegative = "^[-]?[0-9]{0,900}(?:.[0-9]{0,900})?$";

  regex = new RegExp(this.regexStr);
  regexNumber = new RegExp(this.regexNum);
  regexDecimal = new RegExp(this.regexDec);
  regexAlfn = new RegExp(this.regexAlphanumaric);
  regexMobNum = new RegExp(this.regexMob);
  regexTextarea = new RegExp(this.regextext);
  regexNegativeDecimal = new RegExp(this.regexDecWithNegative);

  constructor(private el: ElementRef) {}

  // @HostListener('keypress', ['$event']) onKeyPress(event) {
  //     let inputType: any = ((<HTMLElement>event.target).attributes['data-type']) ? (<HTMLElement>event.target).attributes['data-type'].nodeValue : (<HTMLElement>event.target).attributes['type'].nodeValue;
  //     let enteredKey = event.target.value ? event.target.value + event.key : event.key;
  //     switch (inputType) {
  //         case 'text': {
  //             return this.regex.test(enteredKey);
  //         }
  //         case 'alphanumaric': {
  //             return this.regexAlfn.test(enteredKey);
  //         }
  //         case 'number': {
  //             return this.regexNumber.test(enteredKey);
  //         }
  //         case 'decimal': {
  //             return this.regexDecimal.test(enteredKey);
  //         }
  //     }
  // }

  @HostListener("input", ["$event"]) onInputChange(event) {
    //debugger
    // if (this.isMobileDevice) {
    let inputType: any = (<HTMLElement>event.target).attributes["data-type"]
      .nodeValue
      ? (<HTMLElement>event.target).attributes["data-type"].nodeValue
      : (<HTMLElement>event.target).attributes["type"].nodeValue;
    switch (inputType) {
      case "text": {
        let enteredKey = event.target.value;
        if (!this.regex.test(enteredKey)) {
          if (enteredKey.length > 1) {
            this.el.nativeElement.value = enteredKey.replace(event.data, "");
          } else {
            this.el.nativeElement.value = "";
          }
        }
        break;
      }
      case "number": {
        let enteredKey = event.target.value;
        if (!this.regexNumber.test(enteredKey)) {
          if (enteredKey.length > 1) {
            this.el.nativeElement.value = enteredKey.replace(event.data, "");
          } else {
            this.el.nativeElement.value = "";
          }
        }
        break;
      }
      case "decimal": {
        let enteredKey = event.target.value;
        if (!this.regexDecimal.test(enteredKey)) {
          if (enteredKey.length > 1) {
            this.el.nativeElement.value = enteredKey.replace(event.data, "");
          } else {
            this.el.nativeElement.value = "";
          }
        }
        break;
      }
      case "alphanumaric": {
        let enteredKey = event.target.value;
        if (!this.regexAlfn.test(enteredKey)) {
          if (enteredKey.length > 1) {
            this.el.nativeElement.value = enteredKey.replace(event.data, "");
          } else {
            this.el.nativeElement.value = "";
          }
        }
        break;
      }
      case "mobileNumber": {
        let enteredKey = event.target.value;
        if (!this.regexMobNum.test(enteredKey)) {
          if (enteredKey.length > 1) {
            this.el.nativeElement.value = enteredKey.replace(event.data, "");
          } else {
            this.el.nativeElement.value = "";
          }
        }
        break;
      }

      case "textareaLength": {
        // let enteredKey = event.target.value;
        // if (!this.regexTextarea.test(enteredKey)) {
        //     if (enteredKey.length < 2000 ) {
        //         this.el.nativeElement.value = enteredKey.replace(event.data,'');
        //     } else {
        //         var twoThousandChar =  enteredKey.match(/.{1,2000}/g);
        //         this.el.nativeElement.value = twoThousandChar[0];
        //     }
        // }
        break;
      }

      case "decimalWithNegativeValue": {
        let enteredKey = event.target.value;
        if (!this.regexNegativeDecimal.test(enteredKey)) {
          if (enteredKey.length > 1) {
            this.el.nativeElement.value = enteredKey.replace(event.data, "");
          } else {
            this.el.nativeElement.value = "";
          }
        }
        break;
      }

      // }
    }
  }
  // @HostListener('paste', ['$event']) blockPaste(event: KeyboardEvent) {
  //     this.validateFields(event);
  // }

  // validateFields(event) {
  //     setTimeout(() => {
  //         this.el.nativeElement.value = ''
  //         event.preventDefault();

  //     }, 100)
  // }
}
