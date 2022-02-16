export interface GetActivityType {
    ResponseObject: ActivityType[];
    IsError: boolean;
    ApiStatusCode: number;
}

export interface ActivityType {
    Id: number;
    Value: string;
}