// export type LeadState = {
//     Tablelist: LeadTableList
// }

// export interface TableLeads {
//     count: number,
//     data: UnqualifiedLeadsTablelist[],
//     nextlink: string
// }

// export interface LeadTableList {
//     UnqualifiedLeads: TableLeads
// }

export interface UnqualifiedLeadsTablelist {
    Name: string
    ID: string,
    Score: any,
    Owner: string,
    Createdon: string
    Account: string
    Conversation: Array<any>,
    Source: string,
    Status: string,
    statusText: string
    isChecked: false,
    index: number
}