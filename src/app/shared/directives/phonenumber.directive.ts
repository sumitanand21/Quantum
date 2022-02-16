import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
 selector: '[PhoneNumbervalidationOnly]'
})
export class PhoneNumberDirective {
    isMobileDevice = window.innerWidth < 800 ? true : false;
 // Allow decimal numbers and negative values
 private regex: RegExp = new RegExp(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/g);
 // Allow key codes for special events. Reflect :
 // Backspace, tab, end, home
 private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', '+'];

constructor(private el: ElementRef) {
 }
 @HostListener('keydown', [ '$event' ])onKeyDown(event: KeyboardEvent) {
     console.log("phone validation")
 // Allow Backspace, tab, end, and home keys
 if (this.specialKeys.indexOf(event.key) !== -1) {
 return;
 }
 let current: string = this.el.nativeElement.value;
 let next: string = current.concat(event.key);

 if (next && !String(next).match(this.regex)) {
 event.preventDefault();
 }
 }

 @HostListener('input', ['$event']) onInputChange(event) {
    if(this.isMobileDevice)
    { 
        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
            }
            let current: string = this.el.nativeElement.value;
            let next: string = current.concat(event.key);
           
            if (next && !String(next).match(this.regex)) {
            event.preventDefault();
            }
    }
 }
}