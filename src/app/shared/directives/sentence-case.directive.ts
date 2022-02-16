import { Directive, ElementRef, HostListener} from '@angular/core';
@Directive({
   selector: '[appChangeText]'
})
export class ChangeTextDirective {

   constructor(private el: ElementRef) { }

   @HostListener('blur') onBlur() {
      if (this.el.nativeElement.value.trim()) {
        const arr: string[] = this.el.nativeElement.value.trim().toLowerCase().split('')
        arr[0] = arr[0].toUpperCase();
        this.el.nativeElement.value = arr.join('');
     }
    }
   
}