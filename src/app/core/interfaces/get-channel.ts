export interface GetChannel {
    ResponseObject: Channels[];
    IsError: boolean;
    Severity: number;
}

export interface Channels {
    Id: number;
    Value: string;
}