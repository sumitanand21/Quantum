import { Directive, ElementRef, HostListener,Input } from '@angular/core';

@Directive({
  selector: '[decimalnumbersOnly]'
})
export class OrderDecimalDirective {
  @Input('decimalnumbersOnly') isNegative:any;   
  @Input('maxValLength') maxValLength:any; 
  @Input('oldValue') oldValue:any;
positiveregex : any = new RegExp(/^(\d{0,11})(\.\d{0,2})?$/, "g");
negativeregex : any = new RegExp(/^(-?|\d{0,1})(\d{0,10})(\.\d{0,2})?$/, "g");
  constructor(private _el: ElementRef) { }
  @HostListener('input', ['$event']) onInputChange(event) {
    let oldVal = this.oldValue ? this.oldValue.toString() : "";
    let newVal = this._el.nativeElement.value;
    if(event.data == null){
      if(newVal && (oldVal.includes('.')) && !newVal.includes('.') ){
          let splitVal = oldVal.split('.');
                 setTimeout(() => {
        this._el.nativeElement.value = splitVal[0];
                 });
        }
    }
    else{
      
    if(event.data == "." && oldVal.includes('.')){
      this._el.nativeElement.value = oldVal;
      this._el.nativeElement.dispatchEvent(new Event('input'));
      event.stopPropagation();
    }else{
      let matchedVal = this.isNegative ? newVal.match(this.negativeregex) : newVal.match(this.positiveregex);
      if(matchedVal){
       this._el.nativeElement.value = matchedVal[0];
      }else{
      this._el.nativeElement.value = oldVal;
      this._el.nativeElement.dispatchEvent(new Event('input'));
      event.stopPropagation();
      }
    }
  }

  }
  
  }