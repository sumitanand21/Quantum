import { Directive, ElementRef, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { ViewChild } from '@angular/core';

@Directive({
  selector: '[appKeyListControl]'
})
export class KeyListControlDirective {
  @Output() arrowDown: EventEmitter<any> = new EventEmitter();
  @Output() refinejunkvalue: EventEmitter<any> = new EventEmitter();
  @Output() intialLoadData: EventEmitter<any> = new EventEmitter();
  @Output() closePopup: EventEmitter<any> = new EventEmitter();
  @Input() dataManipulate: boolean = false;

  isMobileDevice = window.innerWidth < 800 ? true : false;
  regexStr = "^[A-Za-z][0-9A-Za-z ,.'`-]{0,100}$";
  regexCountry = "^[A-Za-z][A-Za-z ().'`-]{0,100}$";
  regexAlphanumaric = "^[A-Za-z0-9][0-9A-Za-z ,.@*'`-]{0,100}$";
  regexNum = "^[0-9]$";
  regexMob = "[0-9+]$";
  regexDec = /^(\d*\.)?\d+$/igm;

  regex = new RegExp(this.regexStr);
  regexCountryCode = new RegExp(this.regexCountry);
  regexNumber = new RegExp(this.regexNum);
  regexDecimal = new RegExp(this.regexDec);
  regexAlfn = new RegExp(this.regexAlphanumaric);
  regexMobNum = new RegExp(this.regexMob);
  keyDownFired: boolean = false;
  streamArrowDown:boolean = false;

  constructor(private el: ElementRef) { }
  arrowkeyLocation = 0;
  isListBtn: boolean = false;
  isFocused:boolean=true;
  isSearching = false;
  @HostListener('keydown', ['$event']) onkeydown(event: KeyboardEvent) {
    let maxLength: any = (<HTMLElement>event.target).dataset.arraymaxlength;
    let downListBtn: any = (<HTMLElement>event.target).dataset.isdownbtn;
    downListBtn = downListBtn == undefined || null ? false : downListBtn;
    this.isListBtn = JSON.parse(downListBtn);
    let dynamicId = (<HTMLElement>event.target).id;
    maxLength = maxLength - 1;
    let modeExpanded = (<HTMLElement>event.currentTarget).attributes['aria-expanded'].nodeValue;
    console.log("dataNode", modeExpanded)
    if (modeExpanded == "true"){
    switch (event.keyCode) {
      case 38: // this is the ascii of arrow up
        this.keyDownFired = true;
        if (this.arrowkeyLocation > 0) {
          if (this.arrowkeyLocation > maxLength) {
            this.arrowkeyLocation = this.arrowkeyLocation - 2;
            document.getElementById(this.arrowkeyLocation.toString()).focus();
            document.getElementById(dynamicId).focus();
            this.arrowDown.emit(this.arrowkeyLocation);
            break;
          } else {
            this.arrowkeyLocation--;
            document.getElementById(this.arrowkeyLocation.toString()).focus();
            document.getElementById(dynamicId).focus();
            this.arrowDown.emit(this.arrowkeyLocation);
            break;
          }
        } else {
          this.arrowkeyLocation = 0;
          break;
        }
      case 40: // this is the ascii of arrow down 
       console.log(this.arrowkeyLocation+"----"+maxLength)
        this.keyDownFired = true;
        if (this.arrowkeyLocation < maxLength) {         
          if(this.streamArrowDown) {
            this.arrowkeyLocation = 0;
            this.streamArrowDown = false;
          }else {
            this.arrowkeyLocation++;
          }
          document.getElementById(this.arrowkeyLocation.toString()).focus();
          document.getElementById(dynamicId).focus();
          this.arrowDown.emit(this.arrowkeyLocation);
          break;
        } else {
          if (this.isListBtn) {
            this.arrowkeyLocation = maxLength + 2;

            try {
              document.getElementById('adls' + this.arrowkeyLocation.toString()).focus();
              document.getElementById(dynamicId).focus();
              this.arrowDown.emit(this.arrowkeyLocation);

            } catch (error) {
              //No Error Handling
              this.arrowkeyLocation = 0
            }

            break;
          } else {
            this.arrowkeyLocation = maxLength;
            break;
          }
        }
      case 13:
        {
          this.keyDownFired = false;
          this.arrowkeyLocation = 0;
          break;
        }
      case 9:
        {
          this.keyDownFired = false;
          //  this.arrowkeyLocation=0;
          // if(this.arrowkeyLocation==0)
          // {
          //   this.intialLoadData.emit("initaial load");
          // }

          // if (maxLength) {
          //   if (maxLength > 0) {
          //     var dataNodeValue = (<HTMLElement>event.currentTarget).attributes['aria-expanded'].nodeValue;
          //     if (dataNodeValue == "true") {
          //       try {
          //         document.getElementById('adls' + (maxLength + 2)).focus();
          //       } catch (error) {
          //         //No Error Handling
          //       }
          //     }

          //   }
          // }
          break;
        }
      }
     
    }
    else
    {
      // console.log("else condition removed")
      // this.arrowkeyLocation=0;
      // this.el.nativeElement.value = '';
      // this.intialLoadData.emit("initialDataLoad");
    }
  }

  // @HostListener('click', ['$event']) onClick(event) {
  
  //   if (this.dataManipulate) {
  //     if (this.isSearching==false && this.isFocused == false) {
  //       console.log('click called')
  //       if(this.el.nativeElement.value)
  //       {
  //         this.el.nativeElement.value = '';
  //         this.intialLoadData.emit("initialDataLoad");
  //       }
      
  //     }
  //   }
  // }

  @HostListener('focus', ['$event']) onfocus(event) {
   
    if (this.dataManipulate) {
      if (!this.keyDownFired) {
        var dataNodeValue = (<HTMLElement>event.currentTarget).attributes['aria-expanded'].nodeValue;
        if (dataNodeValue == "false") {
          console.log('focus called')
          this.arrowkeyLocation = 0;
          this.arrowDown.emit(this.arrowkeyLocation);
          this.isFocused=false;
          this.el.nativeElement.value = '';
          let selectedValue = (<HTMLElement>event.currentTarget).attributes['data-selectedvalue'] ? (<HTMLElement>event.currentTarget).attributes['data-selectedvalue'].nodeValue : false;
          if(selectedValue) {
            this.streamArrowDown = true;
          }else {
            this.streamArrowDown = false;
          }
          this.intialLoadData.emit("initialDataLoad");

         
        }
        // 
      }
    }
  }

  @HostListener('blur', ['$event']) onblur(event) {
    if (!this.keyDownFired) {
      this.isSearching = false;
      let selectedValue: any = (<HTMLElement>event.target).dataset.selectedvalue;
      if (selectedValue) {
        if (this.dataManipulate) {
          this.el.nativeElement.value = selectedValue;
        } else {
          if (this.el.nativeElement.value != '') {
            if (this.el.nativeElement.value.toLowerCase() != selectedValue.toLowerCase()) {
              this.el.nativeElement.value = selectedValue;
            }
          }
          else {
            this.el.nativeElement.value = '';
            this.refinejunkvalue.emit(selectedValue);
          }
        }
      } else {
        if (this.dataManipulate) {
          this.el.nativeElement.value = '';
          this.refinejunkvalue.emit('');
        }
      }
    }
    else {
      this.keyDownFired = false;
    }
  }

  @HostListener('input', ['$event']) onInputChange(event) {
    // if (this.isMobileDevice) {
    this.arrowkeyLocation = 0;
    this.isSearching = true;
    this.arrowDown.emit(this.arrowkeyLocation);
    if ((<HTMLElement>event.target).attributes['data-type']) {
      let inputType: any = ((<HTMLElement>event.target).attributes['data-type'].nodeValue) ? (<HTMLElement>event.target).attributes['data-type'].nodeValue : (<HTMLElement>event.target).attributes['type'].nodeValue;
      switch (inputType) {
        case 'text': {
          let enteredKey = event.target.value;
          if (!this.regex.test(enteredKey)) {
            if (enteredKey.length > 1) {
              this.el.nativeElement.value = enteredKey.replace(event.data, '');
            } else {
              this.el.nativeElement.value = ''
            }
          }
          break;
        }
        case 'number': {
          let enteredKey = event.target.value;
          if (!this.regexNumber.test(enteredKey)) {
            if (enteredKey.length > 1) {
              this.el.nativeElement.value = enteredKey.replace(event.data, '');
            } else {
              this.el.nativeElement.value = ''
            }
          }
          break;
        }
        case 'decimal': {
          let enteredKey = event.target.value;
          if (!this.regexDecimal.test(enteredKey)) {
            if (enteredKey.length > 1) {
              this.el.nativeElement.value = enteredKey.replace(event.data, '');
            } else {
              this.el.nativeElement.value = ''
            }
          }
          break;
        }
        case 'alphanumaric': {
          let enteredKey = event.target.value;
          if (!this.regexAlfn.test(enteredKey)) {
            if (enteredKey.length > 1) {
              this.el.nativeElement.value = enteredKey.replace(event.data, '');
            } else {
              this.el.nativeElement.value = ''
            }
          }
          break;
        }
        case 'mobileNumber': {
          let enteredKey = event.target.value;
          if (!this.regexMobNum.test(enteredKey)) {
            if (enteredKey.length > 1) {
              this.el.nativeElement.value = enteredKey.replace(event.data, '');
            } else {
              this.el.nativeElement.value = ''
            }
          }
          break;
        }
        case 'alpha': {
          let enteredKey = event.target.value;
          if (!this.regexCountryCode.test(enteredKey)) {
            if (enteredKey.length > 1) {
              this.el.nativeElement.value = enteredKey.replace(event.data, '');
            } else {
              this.el.nativeElement.value = ''
            }
          }
          break;
        }
      }
    }
  }
}