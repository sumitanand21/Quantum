import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
    selector: '[TooltipAnimation]'
})
export class TooltipDirective {

    @Input() TooltipHide: string;

    constructor(private el: ElementRef) { }

    @HostListener('click', ['$event']) onclick(event) {
        window.addEventListener('keyup', function (e) {
            if (e.keyCode === 13) {
                setTimeout(() => {
                    let hideTooltip = <HTMLElement>document.querySelector(".mat-tooltip");
                    hideTooltip.style.display = "none";
                }, 1000);
            }
            if (e.keyCode === 32) {
                setTimeout(() => {
                    let hideTooltip = <HTMLElement>document.querySelector(".mat-tooltip");
                    hideTooltip.style.display = "none";
                }, 1000);
            }
        }, false);
        //hide tooltip on selection change fix
        setTimeout(() => {
            let hideTooltip = <HTMLElement>document.querySelector(".mat-tooltip");
            hideTooltip.style.display = "none";
        }, 1000);
    }


}