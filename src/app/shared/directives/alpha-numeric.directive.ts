import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appAlphaNumeric]'
})
export class AlphaNumericDirective {
  @Input('appAlphaNumeric') inputType: string;
  // regexStr = "^[A-Za-z][0-9A-Za-z- ]{0,100}$";
  // // regexStr2 =  "^[A-Za-z][0-9A-Za-z-]{0,100}$";
  // regexAlphanumeric = "^[A-Za-z0-9][0-9A-Za-z ,.@-]{0,100}$";
  // regexStrfn = new RegExp(this.regexStr);
  // regexAlfn = new RegExp(this.regexAlphanumeric);
  constructor(private el: ElementRef) {
    debugger;
  }

  @HostListener("input", ['$event']) onInputChange(event) {
    switch (this.inputType) {
      case "text": {
        let initalValue = this.el.nativeElement.value;
        let tempInp = initalValue;
        tempInp = tempInp ? tempInp.replace(/^[^a-zA-Z]+/g, '') : "";
        tempInp = tempInp ? tempInp.replace(/[^a-zA-Z0-9- ]*/g, '') : "";
        this.el.nativeElement.value = tempInp ? tempInp.substring(0, 100) : "";
        if (initalValue != this.el.nativeElement.value) {
          this.el.nativeElement.dispatchEvent(new Event('input'));
          event.stopPropagation();
        }
        break;
      }

      case "ordertype": {
        let initalValue = this.el.nativeElement.value;
        let tempInp = initalValue;
        tempInp = tempInp ? tempInp.replace(/[^a-zA-Z0-9]*/g, '') : "";
        this.el.nativeElement.value = tempInp ? tempInp.substring(0, 100) : "";
        if (initalValue != this.el.nativeElement.value) {
          this.el.nativeElement.dispatchEvent(new Event('input'));
          event.stopPropagation();
        }
        break;
      }

      case "alphanumeric": {
        let initalValue = this.el.nativeElement.value;
        let tempInp = initalValue;
        tempInp = tempInp ? tempInp.replace(/[^a-zA-Z0-9- @,.]*/g, '') : "";
        this.el.nativeElement.value = tempInp ? tempInp.substring(0, 2000) : "";
        if (initalValue != this.el.nativeElement.value) {
          this.el.nativeElement.dispatchEvent(new Event('input'));
          event.stopPropagation();
        }
        // let enteredKey = event.target.value;
        // if (!this.regexAlfn.test(enteredKey)) {
        //   if (enteredKey.length > 1) {
        //     if(event.data)
        //     this.el.nativeElement.value = enteredKey.replace(event.data, "");
        //     else
        //     this.el.nativeElement.value = "";
        //     this.el.nativeElement.dispatchEvent(new Event('input'));
        //   } else {
        //     this.el.nativeElement.value = "";
        //   }
        //   event.stopPropagation();
        // }
        break;
      }

    }
  }

  // @HostListener('input', ['$event']) onInputChange(event) {

  //   let initalValue = this._el.nativeElement.value;
  //   let tempInp = initalValue;
  //    tempInp = tempInp ? tempInp.replace(/^[^a-zA-Z]+/g, ''):"";
  //    tempInp = tempInp ? tempInp.replace(/[^a-zA-Z0-9@ ]*/g, '') : "";
  //   this._el.nativeElement.value = tempInp ? tempInp.substring(0,6) : "";
  //    this._el.nativeElement.dispatchEvent(new Event('input'));
  //   // if ( initalValue !== this._el.nativeElement.value) {
  //   //   event.stopPropagation();
  //   // }
  // }
}

