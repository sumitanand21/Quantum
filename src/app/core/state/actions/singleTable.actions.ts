import { Action } from '@ngrx/store';
import { Update } from '@ngrx/entity';
import { TableHeader } from '../state.models/singleTable/singleTable.interface';


export enum TableActions {
    addTableHeader='[add table header] inserting new table header',
    updateTableHeaderAction = '[update table header] updating table header',
    // removeTableHeader = '[remove table header] removing table header'
}


export class loadTableHeader implements Action {
    readonly type = TableActions.addTableHeader
    constructor(public payload:{tableHead:TableHeader}){
        console.log("the pay load is")
        console.log()
    }
}

export class updateTableHeader implements Action {
    readonly type = TableActions.updateTableHeaderAction
    constructor(public payload:{updatetableHead:Update<TableHeader>}){
        console.log("the pay load is")
        console.log()
    }
}

export type  SingleTableActions= loadTableHeader | updateTableHeader
