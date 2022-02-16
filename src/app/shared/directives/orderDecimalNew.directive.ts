import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { NgModel } from '@angular/forms';

@Directive({
    selector: '[decimalnumberslimitOnly]',
    providers: [NgModel],
})
export class OrderDecimalNewDirective {
    @Input() maxlengthVal: string;
    @Input() allowNegative: boolean;
    @Input() oldValue: any;

    // Allow the below keys
    private specialKeys: Array<string> = ['Backspace', 'End', 'Home', 'ArrowLeft', 'ArrowRight', 'Del', 'Delete'];

    constructor(private el: ElementRef, private model: NgModel) { }

    @HostListener('input', ['$event'])
    onKeyDown(event: KeyboardEvent) {

        if (this.specialKeys.indexOf(event.key) !== -1) {
            return;
        }

        const maxLen = this.maxlengthVal ? this.maxlengthVal : '12';
        const regexstring = this.allowNegative ? `^(-?\\d{0,${maxLen}})(\\.\\d{0,2})?$` : `^(\\d{0,${maxLen}})(\\.\\d{0,2})?$`;
        const regex: RegExp = new RegExp(regexstring);

        let current: string = this.el.nativeElement.value;

        if (current && !String(current).match(regex)) {
            this.el.nativeElement.value = this.oldValue ? this.oldValue : '';
            this.model.viewToModelUpdate(this.oldValue);
        }
    }
}
