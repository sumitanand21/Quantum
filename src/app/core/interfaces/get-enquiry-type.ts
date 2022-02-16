export interface GetEnquiryType {
    ResponseObject: EnquiryType[];
    IsError: boolean;
    Severity: number;
}

export interface EnquiryType {
    Id: number;
    Value: string;
}
