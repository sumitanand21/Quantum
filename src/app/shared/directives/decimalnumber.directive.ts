import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
 selector: '[decimalNumberOnly]'
})
export class DecimalNumberDirective {
 // Allow decimal numbers and negative values
 private regex: RegExp = new RegExp(/^(?!(0))-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/g);
//  private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);
//  (/^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:(\.|,)\d+)?$/g)
 // Allow key codes for special events. Reflect :
 // Backspace, tab, end, home
 private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', 'Delete', 'ArrowLeft', 'ArrowRight'];

constructor(private el: ElementRef) {
 }
 @HostListener('keydown', [ '$event' ])
 onKeyDown(event: KeyboardEvent) {
 // Allow Backspace, tab, end, and home keys
 if (this.specialKeys.indexOf(event.key) !== -1) {
 return;
 }
//  console.log(event)
//  if(event.key.match(/^0/)) { 
//    this.el.nativeElement.value = "";
//  }

//  let current: string = this.el.nativeElement.value;
//  let next: string = current.concat(event.key);
//  if (next && !String(next).match(this.regex)) {
//  event.preventDefault();
let current: string = this.el.nativeElement.value;
const position = this.el.nativeElement.selectionStart;
const next: string = [current.slice(0, position), event.key == 'Decimal' ? '.' : event.key, current.slice(position)].join('');
if (next && !String(next).match(this.regex)) {
  event.preventDefault();
 }
 }
}