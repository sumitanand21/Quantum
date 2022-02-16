import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'customPagination'
})
export class CustomPaginationPipe implements PipeTransform {

    transform(value, currentPageValue,perPageValue) {
        const perPage = perPageValue;
        const start = ((currentPageValue - 1) * perPage) + 1;
        const end = start + perPage - 1;
        let temp = value.filter(data => data.index >= start && data.index <= end);
        
        return temp;
        
        // return value;
    }
}
