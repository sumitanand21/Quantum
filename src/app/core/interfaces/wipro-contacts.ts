export interface WiproContacts {
    ResponseObject: ResponseObject[];
    IsError: boolean;
    Severity: number;
}

export interface ResponseObject {
    UserId: string;
    EmpNo: number;
    FullName: string;
    Email: string;
    IsMale: boolean;
}