import { Component, NgModule, Pipe,PipeTransform } from '@angular/core';
    @Pipe({ name: "orderBy" })
    export class OrderrByPipe {
        transform(records ?: Array<any>, args?: any): any {
          if(records !== undefined){
            if(args.property == 'CurrencyName'){
              return records.sort(function(a, b){
                    if(a['CurrencyName'].toLowerCase() < b['CurrencyName'].toLowerCase()){
                      return -1
                    }
                    else if( a['CurrencyName'].toLowerCase() > b['CurrencyName'].toLowerCase()){
                      return 1
                    }
                    else{
                      return 0;
                    }
                  });
                }
           }
        };
  }
 