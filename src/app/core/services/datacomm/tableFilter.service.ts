import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TableFilterService {

    /**
     * Author: Jithendra R
     * Created: 30 Jan 2020
     * Description: Returns unique data based on headername supplied in filterData param
     * @param filterData: Single table event emitted data 
     * @param uiMappedArrObj: API response to Single table mapped array object
     */
    getUniqueHeaderValue(filterData: FilterData, uiMappedArrObj: any[], ) {
        let newArr: any[] = [];
        if (uiMappedArrObj.length > 0) {
            uiMappedArrObj.filter(function (item) {
                var i = newArr.findIndex(x => x.name == item[filterData.headerName]);
                let found;
                if (filterData.filterColumn[filterData.headerName].length > 0) {
                    found = filterData.filterColumn[filterData.headerName].find(x => x.id === item.id);
                }
                if (i <= -1) {
                    let obj = {
                        "id": item.id,
                        "name": item[filterData.headerName],
                        "isDatafiltered": found ? found.isDatafiltered : false
                    }
                    newArr.push(obj);
                }
            });
            return newArr;
        }
    }
}

export interface FilterData {
    globalSearch: string;
    filterColumn: any;
    order: [];
    headerName: string;
    columnSerachKey: string;
    sortOrder: boolean;
    sortColumn: string;
    isApplyFilter: boolean;
}