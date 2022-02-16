import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'firstWord'
})
export class FirstWordPipe implements PipeTransform {

  transform(input: string): string {
    var output = input ?  input.trim() : '';
    var initials = "";
    var wordArray = input ? input.split(" ") : '';
    if(wordArray.length == 1){
      initials += wordArray[0].substring(0, 2);
    }
    else if(wordArray.length>1){
      initials += wordArray[0].substring(0, 1);
      initials += wordArray[wordArray.length-1].substring(0, 1);
    }
    return initials;
  }
}
