import { Pipe, PipeTransform } from '@angular/core';
import { DataCommunicationService } from '@app/core/services/global.service';

@Pipe({
  name: 'multiValueFilter'
})
export class MultiValueFilterPipe implements PipeTransform {

  constructor(private globalData:DataCommunicationService) {

  }
  
  transform(myobjects: Array<object>, args?: Array<object>): any {
    if (args && Array.isArray(myobjects)) {
      // copy all objects of original array into new array of objects
      var returnobjects = myobjects;
      // args are the compare oprators provided in the *ngFor directive
      args.forEach(function (filterobj) {
        let filterkey = Object.keys(filterobj)[0];
        let filtervalue = filterobj[filterkey];
        myobjects.forEach(function (objectToFilter) {

          if(Array.isArray(objectToFilter[filterkey]))
          {
            if (!filtervalue.some(x=>objectToFilter[filterkey].some(y=>y==x)) && filtervalue != "") {
              // object didn't match a filter value so remove it from array via filter
              returnobjects = returnobjects.filter(obj => obj !== objectToFilter);
            }

          }else{
            if (!filtervalue.some(x=>x==objectToFilter[filterkey]) && filtervalue != "") {
              // object didn't match a filter value so remove it from array via filter
              returnobjects = returnobjects.filter(obj => obj !== objectToFilter);
            }
          }         
          
        })
      });
      // return new object to *ngFor directive
      // if( returnobjects.length==0){
      //   returnobjects=[{}
      // }
      this.globalData.pseudoFilter = returnobjects;
      return returnobjects;
    }
  }

}
