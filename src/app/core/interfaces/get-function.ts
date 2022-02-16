export interface GetFunction {
    ResponseObject: FunctionsValue[];
    IsError: boolean;
    Severity: number;
}

export interface FunctionsValue {
    Id: number;
    Value: string;
}
