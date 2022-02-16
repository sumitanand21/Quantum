import { Component, NgModule, Pipe,PipeTransform } from '@angular/core';

 @Pipe({ name: "orderByLines" })

    export class ServiceByPipe {
        transform(records ?: Array<any>, args?: any): any {
               if(records.length > 0 ){
                return records.sort(function(a, b){
                      if(a.ServiceLineName.toLowerCase() < b.ServiceLineName.toLowerCase()){
                        return -1
                      }
                      else if(a.ServiceLineName.toLowerCase() > b.ServiceLineName.toLowerCase()){
                        return 1
                      }
                      else{
                        return 0;
                      }
                    });
               }
             };
  }